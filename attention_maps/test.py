import os
from PIL import Image, ImageEnhance

# Enhancement settings
BRIGHTNESS = 1.1
CONTRAST = 0.85
EXPOSURE = 1.3  # Applied via brightness

# Supported image formats
SUPPORTED_EXTENSIONS = (".jpg", ".jpeg", ".png", ".bmp", ".tiff")

# Directory to process
INPUT_DIR = "."  # 🔁 Replace with your path


def process_image(image_path):
    try:
        with Image.open(image_path) as img:
            img = img.convert("RGB")

            # Apply exposure (via brightness)
            enhancer = ImageEnhance.Brightness(img)
            img = enhancer.enhance(BRIGHTNESS * EXPOSURE)

            # Apply contrast
            enhancer = ImageEnhance.Contrast(img)
            img = enhancer.enhance(CONTRAST)

            # Overwrite the original file
            img.save(image_path)
            print(f"Processed: {image_path}")
    except Exception as e:
        print(f"Failed to process {image_path}: {e}")


def process_directory(directory):
    for root, _, files in os.walk(directory):
        for file in files:
            if file.lower().endswith(SUPPORTED_EXTENSIONS):
                full_path = os.path.join(root, file)
                process_image(full_path)


if __name__ == "__main__":
    process_directory(INPUT_DIR)
