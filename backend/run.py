import subprocess
import sys
import os
import time

def main():
    print("Starting FastAPI server...")
    # Run uvicorn as if we are in the parent directory so backend module is resolvable
    api_process = subprocess.Popen([sys.executable, "-m", "uvicorn", "backend.main:app", "--host", "0.0.0.0", "--port", "8000"], cwd=os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
    
    print("Starting Telegram Bot...")
    # Add PYTHONPATH so absolute imports in bot work
    env = os.environ.copy()
    env["PYTHONPATH"] = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    bot_process = subprocess.Popen([sys.executable, "tg_bot/bot.py"], env=env)
    
    try:
        while True:
            time.sleep(1)
            if api_process.poll() is not None:
                print("API process died. Exiting.")
                break
            if bot_process.poll() is not None:
                print("Bot process died. Exiting.")
                break
    except KeyboardInterrupt:
        print("Stopping services...")
    finally:
        api_process.terminate()
        bot_process.terminate()

if __name__ == "__main__":
    main()
