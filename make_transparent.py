from PIL import Image

# Load original image
img = Image.open('logo.jpg.jpeg').convert('RGBA')

# Convert black (near-black) pixels to transparent
datas = img.getdata()
newData = []
for item in datas:
    r,g,b,a = item
    # consider near-black as background (tweak threshold if needed)
    if r < 30 and g < 30 and b < 30:
        newData.append((255,255,255,0))
    else:
        newData.append((r,g,b,a))

img.putdata(newData)
img.save('logo.png', 'PNG')
print('Saved logo.png')
