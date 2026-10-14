"""
AgriSense AI — Smart Crop Doctor
Module: Image Preprocessing Pipeline for Plant Leaf Classification
Author: AgriSense AI ML Research Team
Dataset: PlantVillage Standard (224x224 RGB)
"""

import numpy as np
from PIL import Image

IMAGE_SIZE = (224, 224)

def load_and_preprocess_image(image_path_or_buffer, target_size=IMAGE_SIZE):
    """
    Load an image, convert to RGB, resize, and apply MobileNetV2 normalization.
    MobileNetV2 expects pixel values scaled to [-1.0, 1.0].
    
    Args:
        image_path_or_buffer: File path string or file-like binary stream.
        target_size: Tuple (width, height), default (224, 224).
        
    Returns:
        numpy.ndarray: Tensor of shape (1, 224, 224, 3) with float32 values in [-1, 1].
    """
    img = Image.open(image_path_or_buffer)
    
    # Handle alpha channel (PNG) or grayscale
    if img.mode != 'RGB':
        img = img.convert('RGB')
        
    # Resize with high-quality Lanczos resampling
    img = img.resize(target_size, Image.Resampling.LANCZOS)
    
    # Convert to NumPy array
    img_array = np.array(img, dtype=np.float32)
    
    # Normalize to [-1, 1] as required by tf.keras.applications.mobilenet_v2.preprocess_input
    # Formula: (x / 127.5) - 1.0
    normalized_array = (img_array / 127.5) - 1.0
    
    # Add batch dimension: (224, 224, 3) -> (1, 224, 224, 3)
    batch_tensor = np.expand_dims(normalized_array, axis=0)
    
    return batch_tensor

def get_data_augmentation_pipeline():
    """
    Returns Keras Sequential augmentation layer to reduce overfitting
    on laboratory-captured leaf images.
    """
    import tensorflow as tf
    from tensorflow.keras import layers
    
    return tf.keras.Sequential([
        layers.RandomFlip("horizontal_and_vertical"),
        layers.RandomRotation(0.2),
        layers.RandomZoom(0.15),
        layers.RandomContrast(0.1),
        layers.GaussianNoise(0.02)
    ], name="agrisense_augmentation")
