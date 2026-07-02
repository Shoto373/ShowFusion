import os
import requests
from dotenv import load_dotenv

dotenv_path = os.path.join(os.path.dirname(os.path.abspath(__file__)), '.env')
load_dotenv(dotenv_path)

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

def send_telegram_notification(name: str, phone: str, event_type: str, date: str, time: str, comment: str, source: str = "Сайт"):
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        print("Telegram bot token or chat ID not set. Skipping notification.")
        return False
        
    text = (
        f"🔥 *Новая заявка!* 🔥\n\n"
        f"🌐 *Источник:* {source}\n"
        f"👤 *Имя:* {name}\n"
        f"📱 *Телефон:* {phone}\n"
        f"🎭 *Тип:* {event_type}\n"
        f"📅 *Дата:* {date}\n"
        f"⏰ *Время:* {time if time else 'Не указано'}\n"
        f"💬 *Комментарий:* {comment if comment else 'Нет'}"
    )
    
    url = f"https://api.telegram.org/bot{TELEGRAM_BOT_TOKEN}/sendMessage"
    payload = {
        "chat_id": TELEGRAM_CHAT_ID,
        "text": text,
        "parse_mode": "Markdown"
    }
    
    try:
        response = requests.post(url, json=payload, timeout=5)
        response.raise_for_status()
        return True
    except Exception as e:
        print(f"Error sending telegram notification: {e}")
        return False
