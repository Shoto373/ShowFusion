from aiogram import Router, F
from aiogram.types import Message, CallbackQuery, InlineKeyboardMarkup, InlineKeyboardButton, WebAppInfo
from aiogram.filters import CommandStart
from aiogram.fsm.state import State, StatesGroup
from aiogram.fsm.context import FSMContext
import os

class NPSFeedback(StatesGroup):
    waiting_for_feedback = State()

router = Router()

def get_main_menu():
    webapp_url = os.getenv("WEBAPP_URL", "https://showfusion.amvera.io")
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="📱 Открыть Mini App", web_app=WebAppInfo(url=webapp_url))],
        [InlineKeyboardButton(text="🎭 Наши услуги", callback_data="menu_services")],
        [InlineKeyboardButton(text="❓ Частые вопросы", callback_data="menu_faq")],
        [InlineKeyboardButton(text="📞 Контакты", callback_data="menu_contacts")],
        [InlineKeyboardButton(text="🛒 Оформить заказ (в чате)", callback_data="order_start")]
    ])
    return keyboard

@router.message(CommandStart())
async def cmd_start(message: Message):
    text = (
        f"Здравствуйте, {message.from_user.first_name}! 👋\n\n"
        "Вас приветствует бот студии спецэффектов <b>ShowFusion</b>.\n"
        "Мы создаем яркие шоу для ваших праздников!\n\n"
        "Выберите интересующий вас раздел:"
    )
    await message.answer(text, reply_markup=get_main_menu())

@router.callback_query(F.data == "menu_main")
async def process_main_menu(callback: CallbackQuery):
    await callback.message.edit_text("Выберите интересующий вас раздел:", reply_markup=get_main_menu())
    await callback.answer()

@router.callback_query(F.data == "menu_services")
async def process_services(callback: CallbackQuery):
    text = (
        "<b>Наши услуги:</b>\n\n"
        "🔥 <b>Файер-шоу</b> — Яркое огненное представление.\n"
        "💨 <b>Тяжелый дым</b> — Эффект танца в облаках.\n"
        "✨ <b>Холодные фонтаны</b> — Искрящиеся дорожки (безопасно).\n"
        "🎵 <b>Эффект Золушки</b> — Лазерное шоу с именами.\n"
        "💡 <b>Световое оформление</b> — Профессиональная заливка зала.\n"
        "🫧 <b>Дымные пузыри</b> — Пузыри с дымом внутри.\n"
        "🎧 <b>Работа DJ</b> — Музыкальное сопровождение.\n"
    )
    kb = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="🛒 Оформить заказ", callback_data="order_start")],
        [InlineKeyboardButton(text="◀️ Назад", callback_data="menu_main")]
    ])
    await callback.message.edit_text(text, reply_markup=kb)
    await callback.answer()

@router.callback_query(F.data == "menu_faq")
async def process_faq(callback: CallbackQuery):
    text = (
        "<b>Частые вопросы:</b>\n\n"
        "<b>Q: Безопасно ли файер-шоу?</b>\n"
        "A: Абсолютно! Мы соблюдаем все правила техники безопасности.\n\n"
        "<b>Q: Можно ли использовать холодные фонтаны в зале?</b>\n"
        "A: Да, они сертифицированы для помещений (нет дыма и запаха).\n\n"
        "<b>Q: За сколько нужно бронировать?</b>\n"
        "A: Желательно за 1-2 месяца до мероприятия.\n"
    )
    kb = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="◀️ Назад", callback_data="menu_main")]
    ])
    await callback.message.edit_text(text, reply_markup=kb)
    await callback.answer()

@router.callback_query(F.data == "menu_contacts")
async def process_contacts(callback: CallbackQuery):
    text = (
        "<b>Наши контакты:</b>\n\n"
        "📱 Телефон: +7 996 617 80 89\n"
        "✉️ Email: showfusion62@gmail.com\n"
        "📍 Адрес: г. Рязань\n"
        "🌐 VK: <a href='https://vk.com/originalfireshow'>originalfireshow</a>\n"
    )
    kb = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="◀️ Назад", callback_data="menu_main")]
    ])
    await callback.message.edit_text(text, reply_markup=kb, disable_web_page_preview=True)
    await callback.answer()

@router.callback_query(F.data.startswith("nps_"))
async def process_nps(callback: CallbackQuery, state: FSMContext):
    rating = int(callback.data.split("_")[1])
    if rating == 5:
        text = "Спасибо за высшую оценку! 🎉\nБудем рады, если вы оставите отзыв на Яндекс.Картах: https://yandex.ru/maps/"
        await callback.message.edit_text(text)
    else:
        await state.update_data(rating=rating)
        await state.set_state(NPSFeedback.waiting_for_feedback)
        await callback.message.edit_text("Спасибо за честную оценку! Пожалуйста, напишите текстом, что мы могли бы улучшить:")
    await callback.answer()

@router.message(NPSFeedback.waiting_for_feedback)
async def process_nps_text(message: Message, state: FSMContext):
    data = await state.get_data()
    rating = data.get('rating')
    
    admin_id = os.getenv("ADMIN_TG_ID")
    if admin_id:
        admin_ids = [int(i.strip()) for i in admin_id.split(",") if i.strip().isdigit()]
        text = f"📉 <b>Новый отзыв NPS!</b>\n\nОценка: {rating}/5\nОт пользователя: @{message.from_user.username or message.from_user.id}\nТекст: {message.text}"
        for aid in admin_ids:
            try:
                await message.bot.send_message(aid, text, parse_mode="HTML")
            except Exception:
                pass

    await message.answer("Спасибо за ваш отзыв! Мы обязательно станем лучше.")
    await state.clear()
