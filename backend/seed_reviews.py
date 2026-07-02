import os
import sys
from sqlalchemy.orm import Session
from .database import SessionLocal
from .models import Review

def seed():
    db = SessionLocal()

    # Check if reviews already exist
    if db.query(Review).count() > 0:
        print("Reviews already exist. Skipping seed.")
        db.close()
        return

    reviews = [
        {"author": "Анна и Максим", "text": "Заказывали тяжелый дым на первый танец и холодные фонтаны. Это было просто волшебно! Дым стелился по полу идеальным ровным слоем, а фонтаны в конце танца вызвали шквал аплодисментов. Спасибо команде за профессионализм!", "rating": 5},
        {"author": "Корпоратив Газпром", "text": "Файер-шоу стало отличным завершением нашего новогоднего корпоратива. Ребята отработали на все 100%, очень зрелищно, отличная музыкальная подборка и безопасная работа с пиротехникой.", "rating": 5},
        {"author": "Елена", "text": "Брали эффект Золушки (лазеры). Очень красиво и необычно, все гости были в восторге. Отдельное спасибо за то, что учли все наши пожелания по цветам лазеров и музыке.", "rating": 5},
        {"author": "Игорь", "text": "Дымные пузыри для детского праздника — это нечто! Дети визжали от восторга, когда лопали пузыри, а из них выходил дым. Очень крутая идея, рекомендую!", "rating": 5}
    ]

    for item in reviews:
        db_item = Review(author=item["author"], text=item["text"], rating=item["rating"])
        db.add(db_item)

    db.commit()
    db.close()
    print("Reviews seeded successfully!")

if __name__ == "__main__":
    seed()
