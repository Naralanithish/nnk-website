from PIL import Image, ImageDraw, ImageFont
import os

# Images directory path
images_dir = os.path.join(os.path.dirname(__file__), 'images')

def create_placeholder_image(filename, width, height, bg_color, text):
    """Create a placeholder image with text"""
    img = Image.new('RGB', (width, height), bg_color)
    draw = ImageDraw.Draw(img)
    
    # Try to use a nice font, fall back to default
    try:
        font = ImageFont.truetype("arial.ttf", 32)
    except:
        font = ImageFont.load_default()
    
    # Calculate text position (center)
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    x = (width - text_width) // 2
    y = (height - text_height) // 2
    
    # Draw text
    draw.text((x, y), text, fill='white', font=font)
    
    # Save image
    filepath = os.path.join(images_dir, filename)
    img.save(filepath, quality=90)
    print(f"✓ Created {filename}")

# Create images
create_placeholder_image('hero.jpg', 800, 500, '#2196F3', 'Software Development')
create_placeholder_image('project1.jpg', 500, 350, '#FF9800', 'Billing Software')
create_placeholder_image('project2.jpg', 500, 350, '#4CAF50', 'Web Automation')
create_placeholder_image('project3.jpg', 500, 350, '#9C27B0', 'E-Commerce Platform')
create_placeholder_image('project4.jpg', 500, 350, '#F44336', 'Task Management')
create_placeholder_image('logo.png', 150, 150, '#000000', 'NNK')

print("\n✓ All images created successfully in the 'images' folder!")
