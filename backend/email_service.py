import os
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

def send_email_notification(name, phone, event_type, date, comment):
    smtp_server = os.getenv("SMTP_SERVER")
    smtp_port = os.getenv("SMTP_PORT", "465")
    smtp_user = os.getenv("SMTP_USER")
    smtp_pass = os.getenv("SMTP_PASSWORD")
    target_email = os.getenv("NOTIFICATION_EMAIL", smtp_user)
    
    if not all([smtp_server, smtp_user, smtp_pass, target_email]):
        print("Email credentials not fully configured. Skipping email notification.")
        return

    subject = f"Новая заявка на шоу: {event_type} от {name}"
    
    body = f"""
У вас новая заявка!

Имя: {name}
Телефон: {phone}
Тип мероприятия: {event_type}
Дата: {date}
Комментарий: {comment or 'Нет'}
    """
    
    msg = MIMEMultipart()
    msg['From'] = smtp_user
    msg['To'] = target_email
    msg['Subject'] = subject
    
    msg.attach(MIMEText(body, 'plain'))
    
    try:
        # We assume SMTP_SSL for port 465. 
        # If user uses 587, we'd need starttls. 
        # Let's try SSL first, or fallback based on port.
        if str(smtp_port) == "587":
            server = smtplib.SMTP(smtp_server, int(smtp_port))
            server.starttls()
        else:
            server = smtplib.SMTP_SSL(smtp_server, int(smtp_port))
            
        server.login(smtp_user, smtp_pass)
        server.send_message(msg)
        server.quit()
        print("Email notification sent successfully.")
    except Exception as e:
        print(f"Failed to send email notification: {e}")
