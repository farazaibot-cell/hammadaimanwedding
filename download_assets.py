import urllib.request
import re
import os

base_dir = "/users/farazltd/claude_work/wedding-invitation/assets"
fonts_dir = os.path.join(base_dir, "fonts")

# Download fonts CSS
req = urllib.request.Request(
    "https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=Great+Vibes&display=swap",
    headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
)
with urllib.request.urlopen(req) as response:
    css = response.read().decode("utf-8")

# Extract WOFF2 URLs
urls = re.findall(r"url\((https://[^)]+\.woff2)\)", css)

for i, url in enumerate(set(urls)):
    filename = f"font_{i}.woff2"
    filepath = os.path.join(fonts_dir, filename)
    urllib.request.urlretrieve(url, filepath)
    css = css.replace(url, f"../assets/fonts/{filename}")

with open(os.path.join(fonts_dir, "fonts.css"), "w") as f:
    f.write(css)

# Download an elegant public domain classical piece (e.g., Chopin Nocturne Op. 9 No. 2 from Wikimedia)
music_url = "https://upload.wikimedia.org/wikipedia/commons/1/10/Chopin_Nocturne_Op_9_No_2_E_Flat_Major.ogg"
music_path = os.path.join(base_dir, "music", "bgm.ogg")
try:
    urllib.request.urlretrieve(music_url, music_path)
except Exception as e:
    print("Music download failed:", e)

print("Assets downloaded.")
