import os
import requests
from dotenv import load_dotenv

load_dotenv()

TELEGRAM_BOT_TOKEN = os.getenv("TELEGRAM_BOT_TOKEN")
TELEGRAM_CHAT_ID = os.getenv("TELEGRAM_CHAT_ID")

def send_telegram_notification(name: str, phone: str, event_type: str, date: str, comment: str):
    if not TELEGRAM_BOT_TOKEN or not TELEGRAM_CHAT_ID:
        print("Telegram bot token or chat ID not set. Skipping notification.")
        return False
        
    text = (
        f"🔥 *Новая заявка с сайта ShowFusion!* 🔥\n\n"
        f"👤 *Имя:* {name}\n"
        f"📱 *Телефон:* {phone}\n"
        f"🎭 *Тип:* {event_type}\n"
        f"📅 *Дата:* {date}\n"
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
