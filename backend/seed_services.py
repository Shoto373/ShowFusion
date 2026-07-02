import os
import sys
import json
from sqlalchemy.orm import Session
from .database import SessionLocal, engine
from .models import Service, Base

Base.metadata.create_all(bind=engine)

def seed():
    db = SessionLocal()

    if db.query(Service).count() > 0:
        print("Services already exist. Skipping seed.")
        db.close()
        return

    detailedServices = [
      {
        "id": "fire",
        "title": "Файер-шоу",
        "description": "Яркое и динамичное огненное представление, которое станет кульминацией вашего праздника. Включает работу с различным огненным реквизитом, пиротехнические эффекты и мощный финал.",
        "features": "Профессиональные артисты,Безопасность,Яркий реквизит,Пиротехнический финал",
        "image": "/media/full_O2jJTAYn.png",
        "icon_name": "Flame",
        "price": "от 15 000 ₽"
      },
      {
        "id": "smoke",
        "title": "Тяжелый дым, снег, конфетти",
        "description": "Идеальное дополнение для первого танца молодоженов. Густой, стелющийся по полу дым создаст эффект танца в облаках и не испортит фотографии.",
        "features": "Не имеет запаха,Не оставляет следов,Высокая плотность,Генераторы снега и конфетти",
        "image": "/media/full_MXP6QYSs.jpg",
        "icon_name": "Wind",
        "price": "от 6 000 ₽"
      },
      {
        "id": "fountain",
        "title": "Холодные фонтаны",
        "description": "Искрящиеся дорожки из холодных фонтанов — идеальное решение для встречи гостей или торжественного выноса торта. Абсолютно безопасны для помещений.",
        "features": "Высота до 3 метров,Длительность до 60 сек,Для улицы и зала,Огненные сердца",
        "image": "/media/full_R72Wc6YZ.jpg",
        "icon_name": "Star",
        "price": "от 800 ₽/шт"
      },
      {
        "id": "cinderella",
        "title": "Эффект Золушки (лазерное шоу)",
        "description": "Волшебная сказка, создаваемая с помощью лазеров. Персонализированные анимации, имена молодоженов и романтическая атмосфера.",
        "features": "Уникальная анимация,Полноцветные лазеры,Написание имен/текста,Музыкальная синхронизация",
        "image": "/media/fFSTtfHP.jpg",
        "icon_name": "Music",
        "price": "от 12 000 ₽"
      },
      {
        "id": "light",
        "title": "Световое оформление",
        "description": "Профессиональная заливка зала светом. Подчеркнем декор, создадим нужную атмосферу и правильный свет для работы фотографа и видеографа.",
        "features": "Заливка зала,Подсветка декора,Динамический свет,Работа художника по свету",
        "image": "/media/full_zc7W9Eki.jpg",
        "icon_name": "Sun",
        "price": "от 10 000 ₽"
      },
      {
        "id": "bubbles",
        "title": "Дымные пузыри",
        "description": "Новинка сезона! Тысячи мыльных пузырей, наполненных дымом, которые эффектно лопаются. Завораживающее зрелище для всех гостей.",
        "features": "Безопасно для детей,Вау-эффект,Отличные фото,Интерактив",
        "image": "/media/full_p4XausNN.jpg",
        "icon_name": "Sparkles",
        "price": "от 8 000 ₽"
      },
      {
        "id": "dj",
        "title": "Работа DJ на мероприятиях",
        "description": "Профессиональное музыкальное сопровождение вашего праздника. Индивидуальный плейлист и невероятная энергетика на танцполе.\nСтоимость:\n• 4000 ₽/час — с аппаратурой\n• 2000 ₽/час — без аппаратуры",
        "features": "Профессиональный звук,Индивидуальный плейлист,Огромная фонотека,Работа в любом формате",
        "image": "/media/dj_2.jpg",
        "icon_name": "Music",
        "price": "от 2 000 ₽/час"
      }
    ]

    for item in detailedServices:
        db_item = Service(
            key=item["id"],
            title=item["title"],
            description=item["description"],
            features=item["features"],
            image=item["image"],
            icon_name=item["icon_name"],
            price=item["price"]
        )
        db.add(db_item)

    db.commit()
    db.close()
    print("Services seeded successfully!")

if __name__ == "__main__":
    seed()
