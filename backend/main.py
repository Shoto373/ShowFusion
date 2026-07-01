import os
import shutil
from fastapi import FastAPI, Depends, HTTPException, UploadFile, File, Form, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.security import OAuth2PasswordRequestForm
from sqlalchemy.orm import Session

from . import models, schemas
from .database import engine, SessionLocal
from .telegram import send_telegram_notification
from .auth import create_access_token, get_current_admin

models.Base.metadata.create_all(bind=engine)

app = FastAPI(title="ShowFusion API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], # Allow frontend port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Static files for uploads
UPLOAD_DIR = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "uploads")
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
def create_application(application: schemas.ApplicationCreate, db: Session = Depends(get_db)):
    db_app = models.Application(**application.model_dump())
    db.add(db_app)
    db.commit()
    db.refresh(db_app)
    
    # Send telegram notification
    send_telegram_notification(
        name=application.name,
        phone=application.phone,
        event_type=application.event_type,
        date=application.date,
        comment=application.comment
    )
    
    return db_app

@app.get("/api/reviews", response_model=list[schemas.Review])
def read_reviews(skip: int = 0, limit: int = 10, db: Session = Depends(get_db)):
    reviews = db.query(models.Review).offset(skip).limit(limit).all()
    return reviews

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
