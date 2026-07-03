import os
import shutil
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, status, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session
from fastapi.responses import FileResponse

from . import models, schemas
from .database import engine, SessionLocal, DB_PATH
from .telegram import send_telegram_notification
from .email_service import send_email_notification
from .auth import create_access_token, get_current_admin
from .google_calendar import create_calendar_event
import sqlite3
import os

from . import seed_services, seed_portfolio, seed_reviews

def upgrade_db():
    if os.path.exists(DB_PATH):
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        try:
            cursor.execute("ALTER TABLE applications ADD COLUMN time VARCHAR")
        except sqlite3.OperationalError:
            pass
        try:
            cursor.execute("ALTER TABLE applications ADD COLUMN comment TEXT")
        except sqlite3.OperationalError:
            pass
        try:
            cursor.execute("ALTER TABLE applications ADD COLUMN tg_user_id INTEGER")
        except sqlite3.OperationalError:
            pass
        try:
            cursor.execute("ALTER TABLE applications ADD COLUMN nps_sent INTEGER DEFAULT 0")
        except sqlite3.OperationalError:
            pass
        conn.commit()
        conn.close()

upgrade_db()
models.Base.metadata.create_all(bind=engine)

# Auto-seed the database if empty
try:
    seed_services.seed()
    seed_portfolio.seed()
    seed_reviews.seed()
except Exception as e:
    print(f"Error seeding database: {e}")

app = FastAPI(title="ShowFusion API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow frontend port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for uploads
DATA_DIR = os.getenv("DATA_DIR", os.path.dirname(os.path.abspath(__file__)))
UPLOAD_DIR = os.path.join(DATA_DIR, "uploads")
os.makedirs(UPLOAD_DIR, exist_ok=True)
app.mount("/uploads", StaticFiles(directory=UPLOAD_DIR), name="uploads")

ADMIN_USERNAME = os.getenv("ADMIN_USERNAME", "admin")
ADMIN_PASSWORD = os.getenv("ADMIN_PASSWORD", "admin")

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/api/login", response_model=schemas.Token)
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    if form_data.username != ADMIN_USERNAME or form_data.password != ADMIN_PASSWORD:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token = create_access_token(data={"sub": form_data.username})
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/api/applications", response_model=schemas.Application)
def create_application(application: schemas.ApplicationCreate, background_tasks: BackgroundTasks, db: Session = Depends(get_db)):
    db_app = models.Application(**application.model_dump())
    db.add(db_app)
    db.commit()
    db.refresh(db_app)
    
    # Send notifications in background
    background_tasks.add_task(
        send_telegram_notification,
        name=application.name,
        phone=application.phone,
        event_type=application.event_type,
        date=application.date,
        time=application.time,
        comment=application.comment
    )
    
    background_tasks.add_task(
        send_email_notification,
        name=application.name,
        phone=application.phone,
        event_type=application.event_type,
        date=application.date,
        time=application.time,
        comment=application.comment
    )
    
    background_tasks.add_task(
        create_calendar_event,
        name=application.name,
        phone=application.phone,
        event_type=application.event_type,
        date_str=application.date,
        time_str=application.time,
        comment=application.comment
    )
    
    return db_app

@app.get("/api/analytics")
def get_analytics(db: Session = Depends(get_db), admin: str = Depends(get_current_admin)):
    applications = db.query(models.Application).all()
    
    # Process basic stats
    total_applications = len(applications)
    
    # Process by service type
    services_count = {}
    for app in applications:
        evt = app.event_type or "Unknown"
        services_count[evt] = services_count.get(evt, 0) + 1
        
    top_services = [{"name": k, "value": v} for k, v in services_count.items()]
    
    # Process by month
    months_count = {}
    for app in applications:
        if app.created_at:
            month_key = app.created_at.strftime("%Y-%m")
            months_count[month_key] = months_count.get(month_key, 0) + 1
            
    # Sort months
    sorted_months = sorted(months_count.keys())
    applications_by_month = [{"name": m, "count": months_count[m]} for m in sorted_months]
    
    # Process by source (Bot vs Site)
    source_count = {"Site": 0, "Bot": 0}
    for app in applications:
        if app.tg_user_id:
            source_count["Bot"] += 1
        else:
            source_count["Site"] += 1
            
    sources = [
        {"name": "Сайт", "value": source_count["Site"]},
        {"name": "Telegram Бот", "value": source_count["Bot"]}
    ]
    
    return {
        "total_applications": total_applications,
        "top_services": top_services,
        "applications_by_month": applications_by_month[-6:], # Last 6 months
        "sources": sources
    }

@app.get("/api/reviews", response_model=list[schemas.Review])
def read_reviews(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    reviews = db.query(models.Review).offset(skip).limit(limit).all()
    return reviews

@app.post("/api/reviews", response_model=schemas.Review)
def create_review(review: schemas.ReviewCreate, db: Session = Depends(get_db), admin: str = Depends(get_current_admin)):
    db_review = models.Review(**review.model_dump(exclude_none=True))
    db.add(db_review)
    db.commit()
    db.refresh(db_review)
    return db_review

@app.delete("/api/reviews/{review_id}")
def delete_review(review_id: int, db: Session = Depends(get_db), admin: str = Depends(get_current_admin)):
    db_review = db.query(models.Review).filter(models.Review.id == review_id).first()
    if not db_review:
        raise HTTPException(status_code=404, detail="Review not found")
    db.delete(db_review)
    db.commit()
    return {"ok": True}

# --- Portfolio Endpoints ---

@app.get("/api/portfolio", response_model=list[schemas.PortfolioItem])
def get_portfolio(db: Session = Depends(get_db)):
    return db.query(models.PortfolioItem).all()

@app.post("/api/portfolio", response_model=schemas.PortfolioItem)
def create_portfolio_item(
    title: str = Form(...),
    type: str = Form(...),
    image: UploadFile = File(...),
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin)
):
    file_path = os.path.join(UPLOAD_DIR, image.filename)
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(image.file, buffer)
        
    image_url = f"/uploads/{image.filename}"
    
    db_item = models.PortfolioItem(title=title, type=type, image=image_url)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.delete("/api/portfolio/{item_id}")
def delete_portfolio_item(item_id: int, db: Session = Depends(get_db), admin: str = Depends(get_current_admin)):
    db_item = db.query(models.PortfolioItem).filter(models.PortfolioItem.id == item_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    db.delete(db_item)
    db.commit()
    return {"ok": True}

# --- Site Settings Endpoints ---

@app.get("/api/settings", response_model=list[schemas.SiteSetting])
def get_settings(db: Session = Depends(get_db)):
    return db.query(models.SiteSetting).all()

@app.post("/api/settings")
def update_setting(setting: schemas.SiteSetting, db: Session = Depends(get_db), admin: str = Depends(get_current_admin)):
    db_setting = db.query(models.SiteSetting).filter(models.SiteSetting.key == setting.key).first()
    if db_setting:
        db_setting.value = setting.value
        db_setting.description = setting.description
    else:
        db_setting = models.SiteSetting(key=setting.key, value=setting.value, description=setting.description)
        db.add(db_setting)
    db.commit()
    return db_setting
# --- Services Endpoints ---

@app.get("/api/services", response_model=list[schemas.Service])
def get_services(db: Session = Depends(get_db)):
    return db.query(models.Service).all()

@app.post("/api/services", response_model=schemas.Service)
def create_service(
    key: str = Form(...),
    title: str = Form(...),
    description: str = Form(...),
    features: str = Form(...),
    icon_name: str = Form(...),
    price: str = Form(...),
    image: UploadFile = File(None),
    image_url: str = Form(None),
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin)
):
    final_image = image_url or ""
    if image and image.filename:
        file_path = os.path.join(UPLOAD_DIR, image.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        final_image = f"/uploads/{image.filename}"
        
    db_item = models.Service(key=key, title=title, description=description, features=features, icon_name=icon_name, price=price, image=final_image)
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@app.put("/api/services/{service_id}", response_model=schemas.Service)
def update_service(
    service_id: int,
    key: str = Form(...),
    title: str = Form(...),
    description: str = Form(...),
    features: str = Form(...),
    icon_name: str = Form(...),
    price: str = Form(...),
    image: UploadFile = File(None),
    db: Session = Depends(get_db),
    admin: str = Depends(get_current_admin)
):
    db_item = db.query(models.Service).filter(models.Service.id == service_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Service not found")
        
    db_item.key = key
    db_item.title = title
    db_item.description = description
    db_item.features = features
    db_item.icon_name = icon_name
    db_item.price = price
    
    if image and image.filename:
        file_path = os.path.join(UPLOAD_DIR, image.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(image.file, buffer)
        db_item.image = f"/uploads/{image.filename}"
        
    db.commit()
    db.refresh(db_item)
    return db_item

@app.delete("/api/services/{service_id}")
def delete_service(service_id: int, db: Session = Depends(get_db), admin: str = Depends(get_current_admin)):
    db_item = db.query(models.Service).filter(models.Service.id == service_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Service not found")
    db.delete(db_item)
    db.commit()
    return {"ok": True}

# --- Serve Frontend SPA ---

@app.get("/{full_path:path}")
def serve_spa(full_path: str):
    # This will catch all routes not handled by /api/... and serve the frontend
    dist_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "dist")
    
    # If the file exists in dist (like /assets/something.js, /favicon.svg), serve it directly
    file_path = os.path.join(dist_dir, full_path)
    if os.path.isfile(file_path):
        return FileResponse(file_path)
        
    # Otherwise, it's a client-side route, serve index.html
    return FileResponse(os.path.join(dist_dir, "index.html"))
