from PIL import Image
import os

img_path = r"C:\Users\maksi\.gemini\antigravity-ide\brain\9e134e7f-3484-44c6-af58-6a4e2c97021c\showfusion_flame_icon_1783024730582.png"
out_path = r"e:\PetProjects\ShowFusion\frontend\public\media\logo-icon.png"

img = Image.open(img_path).convert("RGBA")
datas = img.getdata()

newData = []
for item in datas:
    r, g, b, a = item
    
    # Use max component as alpha for glowing blend
    alpha = max(r, g, b)
    
    if alpha > 0:
        # Premultiply the colors back so they look right over transparent
        new_r = min(255, int(r * 255 / alpha))
        new_g = min(255, int(g * 255 / alpha))
        new_b = min(255, int(b * 255 / alpha))
        newData.append((new_r, new_g, new_b, alpha))
    else:
        newData.append((0, 0, 0, 0))

img.putdata(newData)
img.save(out_path, "PNG")
print("Saved transparent logo!")
