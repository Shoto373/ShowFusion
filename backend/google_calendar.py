import os
import json
from datetime import datetime, timedelta
from google.oauth2.service_account import Credentials
from googleapiclient.discovery import build
import re

SCOPES = ['https://www.googleapis.com/auth/calendar.events']

def parse_date(date_str):
    # Handles YYYY-MM-DD (from HTML input type="date")
    # or DD.MM.YYYY (from Telegram bot)
    if re.match(r"^\d{4}-\d{2}-\d{2}$", date_str):
        return datetime.strptime(date_str, "%Y-%m-%d")
    elif re.match(r"^\d{1,2}[\.\-\/]\d{1,2}[\.\-\/]\d{2,4}$", date_str):
        # normalize to dots
        d = date_str.replace("-", ".").replace("/", ".")
        return datetime.strptime(d, "%d.%m.%Y")
    return None

def create_calendar_event(name, phone, event_type, date_str, time_str, comment):
    service_account_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), 'service_account.json')
    calendar_id = os.getenv("GOOGLE_CALENDAR_ID", "primary")

    if not os.path.exists(service_account_file):
        print(f"Google Calendar skipped: {service_account_file} not found.")
        return False

    try:
        credentials = Credentials.from_service_account_file(
            service_account_file, scopes=SCOPES)
        service = build('calendar', 'v3', credentials=credentials)

        base_date = parse_date(date_str)
        if not base_date:
            print(f"Google Calendar skipped: Unrecognized date format {date_str}")
            return False

        # Attempt to parse time
        is_all_day = True
        start_dt = base_date
        end_dt = base_date + timedelta(days=1) # All day ends next day midnight
        time_zone = "Europe/Moscow" # Assume Moscow time for Russia by default

        if time_str and time_str.lower() not in ["", "не указано", "нет", "не знаю"]:
            # extract HH:MM
            time_match = re.search(r"(\d{1,2}):(\d{2})", time_str)
            if time_match:
                hours, minutes = int(time_match.group(1)), int(time_match.group(2))
                start_dt = base_date.replace(hour=hours, minute=minutes)
                end_dt = start_dt + timedelta(hours=2) # Default 2 hours event
                is_all_day = False

        event_body = {
            'summary': f'Шоу: {event_type} - {name}',
            'description': f'Телефон: {phone}\nКомментарий: {comment}',
        }

        if is_all_day:
            event_body['start'] = {'date': start_dt.strftime("%Y-%m-%d")}
            event_body['end'] = {'date': end_dt.strftime("%Y-%m-%d")}
        else:
            event_body['start'] = {
                'dateTime': start_dt.isoformat(),
                'timeZone': time_zone,
            }
            event_body['end'] = {
                'dateTime': end_dt.isoformat(),
                'timeZone': time_zone,
            }

        event = service.events().insert(calendarId=calendar_id, body=event_body).execute()
        print(f"Google Calendar event created: {event.get('htmlLink')}")
        return True

    except Exception as e:
        print(f"Failed to create Google Calendar event: {e}")
        return False
