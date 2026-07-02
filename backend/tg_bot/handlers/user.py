from aiogram import Router, F
from aiogram.types import Message, CallbackQuery, InlineKeyboardMarkup, InlineKeyboardButton
from aiogram.filters import CommandStart

router = Router()

def get_main_menu():
    keyboard = InlineKeyboardMarkup(inline_keyboard=[
        [InlineKeyboardButton(text="🎭 Наши услуги", callback_data="menu_services")],
        [InlineKeyboardButton(text="❓ Частые вопросы", callback_data="menu_faq")],
        [InlineKeyboardButton(text="📞 Контакты", callback_data="menu_contacts")],
        [InlineKeyboardButton(text="🛒 Оформить заказ", callback_data="order_start")]
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
