from aiogram import Router, F
from aiogram.types import Message, CallbackQuery, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.fsm.context import FSMContext
from aiogram.fsm.state import State, StatesGroup
import os
import asyncio

# Need absolute imports because bot runs from bot.py
from backend.database import AsyncSessionLocal
from backend.models import Application
from backend.telegram import send_telegram_notification

router = Router()

class OrderForm(StatesGroup):
    service = State()
    name = State()
    phone = State()
    date = State()
    comment = State()

def get_services_keyboard():
    services = [
        "Файер-шоу", "Тяжелый дым", "Холодные фонтаны", 
        "Эффект Золушки", "Световое оформление", 
        "Дымные пузыри", "Работа DJ"
    ]
    keyboard = []
    for s in services:
        keyboard.append([InlineKeyboardButton(text=s, callback_data=f"sel_service:{s}")])
    keyboard.append([InlineKeyboardButton(text="Отмена", callback_data="cancel_order")])
    return InlineKeyboardMarkup(inline_keyboard=keyboard)

@router.callback_query(F.data == "order_start")
async def process_order_start(callback: CallbackQuery, state: FSMContext):
    await state.set_state(OrderForm.service)
    await callback.message.edit_text(
        "Выберите услугу, которую хотите заказать:",
        reply_markup=get_services_keyboard()
    )
    await callback.answer()

@router.callback_query(F.data == "cancel_order")
async def cancel_order(callback: CallbackQuery, state: FSMContext):
    await state.clear()
    from .user import get_main_menu
    await callback.message.edit_text(
        "Оформление заказа отменено. Выберите раздел:", 
        reply_markup=get_main_menu()
    )
    await callback.answer()

@router.callback_query(OrderForm.service, F.data.startswith("sel_service:"))
async def process_service_selection(callback: CallbackQuery, state: FSMContext):
    service = callback.data.split(":")[1]
    await state.update_data(service=service)
    await state.set_state(OrderForm.name)
    await callback.message.edit_text(f"Вы выбрали: <b>{service}</b>\n\nКак к вам обращаться?")
    await callback.answer()

import re
from datetime import datetime

@router.message(OrderForm.name)
async def process_name(message: Message, state: FSMContext):
    await state.update_data(name=message.text)
    await state.set_state(OrderForm.phone)
    await message.answer("Пожалуйста, укажите ваш контактный номер телефона:")

@router.message(OrderForm.phone)
async def process_phone(message: Message, state: FSMContext):
    phone = message.text.strip()
    
    # Basic phone validation: extract digits
    digits = re.sub(r'\D', '', phone)
    
    if len(digits) < 10 or len(digits) > 15:
        await message.answer("Пожалуйста, введите корректный номер телефона (от 10 до 15 цифр).")
        return
        
    await state.update_data(phone=phone)
    await state.set_state(OrderForm.date)
    await message.answer("Укажите желаемую дату мероприятия в формате ДД.ММ.ГГГГ (например, 15.08.2026):")

@router.message(OrderForm.date)
async def process_date(message: Message, state: FSMContext):
    date_str = message.text.strip()
    
    # Validate date format DD.MM.YYYY
    if not re.match(r"^\d{1,2}[\.\-\/]\d{1,2}[\.\-\/]\d{2,4}$", date_str):
        await message.answer("Пожалуйста, введите дату в корректном формате, например: 15.08.2026")
        return
        
    await state.update_data(date=date_str)
    await state.set_state(OrderForm.comment)
    await message.answer("Добавьте комментарий или пожелания (или напишите 'Нет'):")

@router.message(OrderForm.comment)
async def process_comment(message: Message, state: FSMContext):
    await state.update_data(comment=message.text)
    data = await state.get_data()
    
    # Save to database
    async with AsyncSessionLocal() as db:
        new_app = Application(
            name=data['name'],
            phone=data['phone'],
            event_type=data['service'],
            date=data['date'],
            comment=data['comment'],
            status="Новая",
            tg_user_id=message.from_user.id
        )
        db.add(new_app)
        await db.commit()
        
    await state.clear()
    
    from .user import get_main_menu
    await message.answer(
        "✅ <b>Спасибо! Ваша заявка принята.</b>\n\n"
        "Мы свяжемся с вами в ближайшее время для подтверждения деталей.",
        reply_markup=get_main_menu()
    )
    
    # Notify admin
    loop = asyncio.get_event_loop()
    loop.run_in_executor(None, lambda: send_telegram_notification(
        name=data['name'],
        phone=data['phone'],
        event_type=data['service'],
        date=data['date'],
        comment=data['comment'],
        source="Telegram-бот"
    ))
