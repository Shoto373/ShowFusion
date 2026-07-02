from PIL import Image

def remove_bg(input_path, output_path):
    img = Image.open(input_path).convert("RGBA")
    datas = img.getdata()

    newData = []
    for item in datas:
        r, g, b, a = item
        # We can use the max of R, G, B as the alpha channel
        alpha = max(r, g, b)
        
        if alpha == 0:
            newData.append((0, 0, 0, 0))
        else:
            # Unmultiply color by alpha so it looks the same when rendered on black
            new_r = min(255, int(r * 255 / alpha))
            new_g = min(255, int(g * 255 / alpha))
            new_b = min(255, int(b * 255 / alpha))
            newData.append((new_r, new_g, new_b, alpha))

    img.putdata(newData)
    img.save(output_path, "PNG")

remove_bg("frontend/public/media/logo.png", "frontend/public/media/logo.png")
print("Done")
