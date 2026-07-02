import asyncio
from datetime import datetime, timedelta
from aiogram import Bot
from aiogram.types import InlineKeyboardMarkup, InlineKeyboardButton
from sqlalchemy.future import select
from backend.database import AsyncSessionLocal
from backend.models import Application

async def check_and_send_nps(bot: Bot):
    print("Running check_and_send_nps job...")
    yesterday = datetime.now() - timedelta(days=1)
    f1 = yesterday.strftime("%Y-%m-%d")
    f2 = yesterday.strftime("%d.%m.%Y")
    
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [
            InlineKeyboardButton(text="1", callback_data="nps_1"),
            InlineKeyboardButton(text="2", callback_data="nps_2"),
            InlineKeyboardButton(text="3", callback_data="nps_3"),
            InlineKeyboardButton(text="4", callback_data="nps_4"),
            InlineKeyboardButton(text="5", callback_data="nps_5")
        ]
    ])
    
    text = (
        "Здравствуйте! 👋\n\n"
        "Вчера у вас было мероприятие с нашим шоу. Мы будем очень признательны, "
        "если вы оцените нашу работу от 1 до 5!"
    )

    async with AsyncSessionLocal() as db:
        # Find applications from yesterday with tg_user_id and not sent yet
        result = await db.execute(
            select(Application).where(
                Application.tg_user_id != None,
                Application.nps_sent == 0
            )
        )
        apps = result.scalars().all()
        
        for app in apps:
            if app.date in [f1, f2]:
                try:
                    await bot.send_message(
                        chat_id=app.tg_user_id,
                        text=text,
                        reply_markup=keyboard
                    )
                    app.nps_sent = 1
                    await db.commit()
                    # Sleep to prevent hitting rate limits if there are many
                    await asyncio.sleep(0.5)
                except Exception as e:
                    print(f"Failed to send NPS to {app.tg_user_id}: {e}")
