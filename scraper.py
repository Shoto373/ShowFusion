import os
import requests
from bs4 import BeautifulSoup
from urllib.parse import urljoin
import time

BASE_URL = "https://originalfireshow.ru"
MEDIA_DIR = os.path.join(os.path.dirname(__file__), "frontend", "public", "media")

def setup_dir():
    if not os.path.exists(MEDIA_DIR):
        os.makedirs(MEDIA_DIR)

def get_images():
    print(f"Fetching {BASE_URL}...")
    response = requests.get(BASE_URL)
    response.raise_for_status()
    soup = BeautifulSoup(response.text, 'html.parser')
    
    # We want to find images, particularly those in picture > source or img tags.
    image_urls = set()
    for img in soup.find_all('img'):
        src = img.get('src')
        if src:
            image_urls.add(src)
            
    # Also find background images or higher quality sources in <source> tags
    for source in soup.find_all('source'):
        srcset = source.get('srcset')
        if srcset:
            # simple parse, usually comma separated urls with descriptors
            parts = srcset.split(',')
            for part in parts:
                url = part.strip().split(' ')[0]
                if url:
                    image_urls.add(url)
                    
    print(f"Found {len(image_urls)} unique image URLs.")
    
    downloaded = 0
    for url in image_urls:
        if url.startswith('data:'):
            continue
            
        full_url = urljoin(BASE_URL, url)
        # some urls might have query parameters, we can strip them for filename
        filename = full_url.split('/')[-1].split('?')[0]
        if not filename or filename.endswith('.ico') or filename.endswith('.js') or filename.endswith('.css'):
            continue
            
        filepath = os.path.join(MEDIA_DIR, filename)
        if os.path.exists(filepath):
            continue
            
        try:
            print(f"Downloading {full_url}...")
            img_resp = requests.get(full_url, stream=True, timeout=10)
            img_resp.raise_for_status()
            with open(filepath, 'wb') as f:
                for chunk in img_resp.iter_content(chunk_size=8192):
                    f.write(chunk)
            downloaded += 1
            time.sleep(0.1)
        except Exception as e:
            print(f"Failed to download {full_url}: {e}")
            
    print(f"Downloaded {downloaded} new images.")

if __name__ == "__main__":
    setup_dir()
    get_images()
