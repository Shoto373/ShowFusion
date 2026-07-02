import os
import shutil
from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import PortfolioItem

def seed():
    db = SessionLocal()

    base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    media_dir = os.path.join(base_dir, "frontend", "public", "media")
    if not os.path.exists(media_dir):
        media_dir = os.path.join(base_dir, "dist", "media")
    data_dir = os.getenv("DATA_DIR", os.path.join(base_dir, "backend"))
    uploads_dir = os.path.join(data_dir, "uploads")
    os.makedirs(uploads_dir, exist_ok=True)

    items_to_seed = [
        {"type": "fire", "title": "Огненное шоу", "filename": "full_O2jJTAYn.png"},
        {"type": "smoke", "title": "Тяжелый дым", "filename": "full_MXP6QYSs.jpg"},
        {"type": "fountain", "title": "Холодные фонтаны", "filename": "full_R72Wc6YZ.jpg"},
        {"type": "cinderella", "title": "Эффект Золушки", "filename": "fFSTtfHP.jpg"},
        {"type": "bubbles", "title": "Дымные пузыри", "filename": "full_p4XausNN.jpg"},
        {"type": "light", "title": "Световое оформление", "filename": "full_zc7W9Eki.jpg"},
        {"type": "dj", "title": "Работа DJ на мероприятиях", "filename": "dj_2.jpg"},
    ]

    for item in items_to_seed:
        src_path = os.path.join(media_dir, item["filename"])
        dst_path = os.path.join(uploads_dir, item["filename"])
        
        if os.path.exists(src_path):
            shutil.copy2(src_path, dst_path)
            
        image_url = f"/uploads/{item['filename']}"
        
        # Check if exists
        existing = db.query(PortfolioItem).filter_by(image=image_url).first()
        if not existing:
            db_item = PortfolioItem(type=item["type"], title=item["title"], image=image_url)
            db.add(db_item)

    db.commit()
    db.close()
    print("Database seeded successfully!")

if __name__ == "__main__":
    seed()
