import os
import urllib.request
import io
from PIL import Image

# Curated Unsplash photo IDs for specific food items
IMAGES = [
    # Snacks & Nachos
    ("public/menu/snacks/tangy-nachos.jpg", "https://images.unsplash.com/photo-1513456852971-30c0b8199d4d?w=600&h=600&fit=crop&q=80"),
    ("public/menu/snacks/cheesy-nachos.jpg", "https://images.unsplash.com/photo-1582169296194-e4d644c48063?w=600&h=600&fit=crop&q=80"),
    ("public/menu/snacks/peri-peri-fries.jpg", "https://images.unsplash.com/photo-1630384060421-cb20d0e0649d?w=600&h=600&fit=crop&q=80"),
    ("public/menu/snacks/onion-rings.jpg", "https://images.unsplash.com/photo-1639024471287-032f66e64627?w=600&h=600&fit=crop&q=80"),
    ("public/menu/snacks/spice-fries.jpg", "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600&h=600&fit=crop&q=80"),
    ("public/menu/snacks/paneer-loaded-fries.jpg", "https://images.unsplash.com/photo-1576107232684-1279f3908594?w=600&h=600&fit=crop&q=80"),
    ("public/menu/snacks/chicken-loaded-fries.jpg", "https://images.unsplash.com/photo-1585109649139-366815a0d713?w=600&h=600&fit=crop&q=80"),
    ("public/menu/snacks/bbq-wings.jpg", "https://images.unsplash.com/photo-1527477396000-e27163b481c2?w=600&h=600&fit=crop&q=80"),
    
    # Burgers
    ("public/menu/snacks/paneer-burger.jpg", "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&h=600&fit=crop&q=80"),
    ("public/menu/snacks/double-down-burger.jpg", "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&h=600&fit=crop&q=80"),

    # Pasta
    ("public/menu/pasta/creamy-white-pasta.jpg", "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?w=600&h=600&fit=crop&q=80"),
    ("public/menu/pasta/red-sauce-pasta.jpg", "https://images.unsplash.com/photo-1621996346565-e3d5d62811b7?w=600&h=600&fit=crop&q=80"),

    # Maggie
    ("public/menu/maggie/veg-maggie.jpg", "https://images.unsplash.com/photo-1612927601601-6638404737ce?w=600&h=600&fit=crop&q=80"),
    ("public/menu/maggie/tomato-maggie.jpg", "https://images.unsplash.com/photo-1569718212165-3a8278d5f624?w=600&h=600&fit=crop&q=80"),
    ("public/menu/maggie/cheese-maggie.jpg", "https://images.unsplash.com/photo-1552611052-33e04de081de?w=600&h=600&fit=crop&q=80"),
    ("public/menu/maggie/paneer-maggie.jpg", "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&h=600&fit=crop&q=80"),
    ("public/menu/maggie/chicken-maggie.jpg", "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=600&h=600&fit=crop&q=80"),

    # Momos
    ("public/menu/momos/veg-momos.jpg", "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=600&h=600&fit=crop&q=80"),
    ("public/menu/momos/chicken-momos.jpg", "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=600&h=600&fit=crop&q=80"),

    # Sandwiches & Wraps
    ("public/menu/sandwich/paneer-wrap.jpg", "https://images.unsplash.com/photo-1626700051175-6818013e1d4f?w=600&h=600&fit=crop&q=80"),
    ("public/menu/sandwich/corn-mayo-sandwich.jpg", "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=600&h=600&fit=crop&q=80"),
    ("public/menu/sandwich/mexican-sandwich.jpg", "https://images.unsplash.com/photo-1509722747041-616f39b57569?w=600&h=600&fit=crop&q=80"),

    # Shakes & Drinks
    ("public/menu/shakes/lotte-choco-pie.jpg", "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=600&h=600&fit=crop&q=80"),
    ("public/menu/mocktails/mint-maaza-mojito.jpg", "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=600&h=600&fit=crop&q=80"),

    # Desserts
    ("public/menu/desserts/choco-lava-cake.jpg", "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=600&h=600&fit=crop&q=80"),
    ("public/menu/desserts/gulab-jamun-vanilla.jpg", "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&h=600&fit=crop&q=80"),

    # Soups
    ("public/menu/soups/tomato-soup.jpg", "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=600&fit=crop&q=80"),
    ("public/menu/soups/hot-and-sour-soup.jpg", "https://images.unsplash.com/photo-1582878826629-29b7ad1cdc43?w=600&h=600&fit=crop&q=80"),
    ("public/menu/soups/manchow-soup.jpg", "https://images.unsplash.com/photo-1547592180-85f173990554?w=600&h=600&fit=crop&q=80"),
    ("public/menu/soups/corn-soup.jpg", "https://images.unsplash.com/photo-1543353071-873f17a7a088?w=600&h=600&fit=crop&q=80"),
    ("public/menu/soups/chicken-soup.jpg", "https://images.unsplash.com/photo-1603105037880-880cd4edfb0d?w=600&h=600&fit=crop&q=80"),
    ("public/menu/soups/mix-veg-soup.jpg", "https://images.unsplash.com/photo-1547592166-23ac45744acd?w=600&h=600&fit=crop&q=80"),
]

headers = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko)"
}

for dest, url in IMAGES:
    os.makedirs(os.path.dirname(dest), exist_ok=True)
    if os.path.exists(dest) and os.path.getsize(dest) > 1000:
        print(f"Already exists: {dest}")
        continue
    try:
        req = urllib.request.Request(url, headers=headers)
        with urllib.request.urlopen(req, timeout=10) as resp:
            data = resp.read()
            img = Image.open(io.BytesIO(data)).convert("RGB")
            # Crop to square center
            w, h = img.size
            min_dim = min(w, h)
            left = (w - min_dim) // 2
            top = (h - min_dim) // 2
            img = img.crop((left, top, left + min_dim, top + min_dim))
            img = img.resize((500, 500), Image.Resampling.LANCZOS)
            img.save(dest, "JPEG", quality=82, optimize=True)
            print(f"Saved: {dest} ({os.path.getsize(dest)} bytes)")
    except Exception as e:
        print(f"Error fetching {dest}: {e}")

print("Image setup completed!")
