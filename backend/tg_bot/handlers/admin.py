import os
from aiogram import Router, F
from aiogram.types import Message, CallbackQuery, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.filters import Command
from aiogram.fsm.state import State, StatesGroup
from aiogram.fsm.context import FSMContext
import asyncio
from sqlalchemy import select
from backend.database import AsyncSessionLocal
from backend.models import Application

router = Router()

class BroadcastForm(StatesGroup):
    waiting_for_message = State()
    waiting_for_confirmation = State()

ADMIN_TG_ID = os.getenv("ADMIN_TG_ID")

def is_admin(user_id: int) -> bool:
    if not ADMIN_TG_ID:
        return False
    # allow multiple admins separated by comma
    admin_ids = [int(i.strip()) for i in ADMIN_TG_ID.split(",") if i.strip().isdigit()]
    return user_id in admin_ids

@router.message(Command("admin"))
async def cmd_admin(message: Message):
    if not is_admin(message.from_user.id):
        return
        
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="Новые заявки", callback_data="admin_new_apps")],
        [InlineKeyboardButton(text="Заявки в работе", callback_data="admin_progress_apps")],
        [InlineKeyboardButton(text="📢 Рассылка клиентам", callback_data="admin_broadcast")]
    ])
    await message.answer("🛠 <b>Панель администратора</b>", reply_markup=keyboard)

async def get_applications_list(status: str, callback: CallbackQuery):
    async with AsyncSessionLocal() as db:
        result = await db.execute(
            select(Application).where(Application.status == status).order_by(Application.created_at.desc()).limit(10)
        )
        apps = result.scalars().all()
        
    if not apps:
        await callback.message.edit_text(f"Нет заявок со статусом '{status}'.", reply_markup=InlineKeyboardMarkup(inline_keyboard=[[InlineKeyboardButton(text="Назад", callback_data="admin_menu")]]))
        return
        
    text = f"<b>Заявки '{status}' (последние 10):</b>\n\n"
    keyboard = []
    
    for app in apps:
        text += f"ID: {app.id} | {app.name} | {app.event_type} | {app.date}\n"
        keyboard.append([InlineKeyboardButton(text=f"Управление заявкой #{app.id}", callback_data=f"admin_app_{app.id}")])
        
    keyboard.append([InlineKeyboardButton(text="Назад", callback_data="admin_menu")])
    await callback.message.edit_text(text, reply_markup=InlineKeyboardMarkup(inline_keyboard=keyboard))

@router.callback_query(F.data == "admin_menu")
async def process_admin_menu(callback: CallbackQuery):
    if not is_admin(callback.from_user.id):
        return
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="Новые заявки", callback_data="admin_new_apps")],
        [InlineKeyboardButton(text="Заявки в работе", callback_data="admin_progress_apps")],
        [InlineKeyboardButton(text="📢 Рассылка клиентам", callback_data="admin_broadcast")]
    ])
    await callback.message.edit_text("🛠 <b>Панель администратора</b>", reply_markup=keyboard)
    await callback.answer()

@router.callback_query(F.data == "admin_new_apps")
async def process_admin_new_apps(callback: CallbackQuery):
    if not is_admin(callback.from_user.id):
        return
    await get_applications_list("Новая", callback)
    await callback.answer()

@router.callback_query(F.data == "admin_progress_apps")
async def process_admin_progress_apps(callback: CallbackQuery):
    if not is_admin(callback.from_user.id):
        return
    await get_applications_list("В работе", callback)
    await callback.answer()

@router.callback_query(F.data.startswith("admin_app_"))
async def process_admin_app_detail(callback: CallbackQuery):
    if not is_admin(callback.from_user.id):
        return
        
    app_id = int(callback.data.split("_")[2])
    
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Application).where(Application.id == app_id))
        app = result.scalar_one_or_none()
        
    if not app:
        await callback.answer("Заявка не найдена!")
        return
        
    text = (
        f"<b>Заявка #{app.id}</b>\n\n"
        f"👤 Имя: {app.name}\n"
        f"📱 Телефон: {app.phone}\n"
        f"🎭 Услуга: {app.event_type}\n"
        f"📅 Дата: {app.date}\n"
        f"💬 Комментарий: {app.comment or 'Нет'}\n"
        f"📌 Статус: {app.status}\n"
    )
    
    keyboard = []
    if app.status == "Новая":
        keyboard.append([InlineKeyboardButton(text="✅ Взять в работу", callback_data=f"admin_status_{app.id}_progress")])
    elif app.status == "В работе":
        keyboard.append([InlineKeyboardButton(text="🏁 Завершить", callback_data=f"admin_status_{app.id}_done")])
        
    keyboard.append([InlineKeyboardButton(text="Назад", callback_data="admin_menu")])
    
    await callback.message.edit_text(text, reply_markup=InlineKeyboardMarkup(inline_keyboard=keyboard))
    await callback.answer()

@router.callback_query(F.data.startswith("admin_status_"))
async def process_admin_status_change(callback: CallbackQuery):
    if not is_admin(callback.from_user.id):
        return
        
    parts = callback.data.split("_")
    app_id = int(parts[2])
    action = parts[3]
    
    new_status = "В работе" if action == "progress" else "Завершена"
    
    async with AsyncSessionLocal() as db:
        result = await db.execute(select(Application).where(Application.id == app_id))
        app = result.scalar_one_or_none()
        if app:
            app.status = new_status
            await db.commit()
            
    await callback.answer(f"Статус изменен на '{new_status}'")
    await process_admin_menu(callback)

@router.callback_query(F.data == "admin_broadcast")
async def process_admin_broadcast(callback: CallbackQuery, state: FSMContext):
    if not is_admin(callback.from_user.id): return
    await callback.message.answer("Отправьте сообщение (текст или фото с текстом), которое нужно разослать всем клиентам:")
    await state.set_state(BroadcastForm.waiting_for_message)
    await callback.answer()

@router.message(BroadcastForm.waiting_for_message)
async def process_broadcast_message(message: Message, state: FSMContext):
    if not is_admin(message.from_user.id): return
    await state.update_data(msg_id=message.message_id, from_chat_id=message.chat.id)
    kb = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="✅ Начать рассылку", callback_data="broadcast_confirm")],
        [InlineKeyboardButton(text="❌ Отмена", callback_data="broadcast_cancel")]
    ])
    await message.answer("Сообщение получено. Начать рассылку по базе?", reply_markup=kb)
    await state.set_state(BroadcastForm.waiting_for_confirmation)

@router.callback_query(BroadcastForm.waiting_for_confirmation)
async def process_broadcast_confirmation(callback: CallbackQuery, state: FSMContext):
    if not is_admin(callback.from_user.id): return
    
    if callback.data == "broadcast_cancel":
        await state.clear()
        await callback.message.edit_text("Рассылка отменена.")
        return
        
    if callback.data == "broadcast_confirm":
        data = await state.get_data()
        msg_id = data.get('msg_id')
        from_chat_id = data.get('from_chat_id')
        await state.clear()
        await callback.message.edit_text("Рассылка начата! ⏳")
        
        async with AsyncSessionLocal() as db:
            result = await db.execute(select(Application.tg_user_id).where(Application.tg_user_id != None).distinct())
            user_ids = result.scalars().all()
            
        success = 0
        errors = 0
        # Unique user ids
        unique_ids = list(set(user_ids))
        for uid in unique_ids:
            try:
                await callback.bot.copy_message(chat_id=uid, from_chat_id=from_chat_id, message_id=msg_id)
                success += 1
                await asyncio.sleep(0.05)
            except Exception:
                errors += 1
                
        await callback.message.answer(f"✅ Рассылка завершена!\nУспешно доставлено: {success}\nОшибок: {errors}")
