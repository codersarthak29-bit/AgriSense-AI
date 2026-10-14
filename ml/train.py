"""
AgriSense AI — Smart Crop Doctor
Module: Transfer Learning Training Pipeline with MobileNetV2
Author: AgriSense AI ML Research Team
Dataset: PlantVillage Dataset (38 classes, ~54k samples)
"""

import os
import json
import argparse
import tensorflow as tf
from tensorflow.keras import layers, models, callbacks, optimizers
from preprocessing import get_data_augmentation_pipeline

def build_transfer_learning_model(num_classes=38, input_shape=(224, 224, 3)):
    """
    Constructs a lightweight CNN based on MobileNetV2 pretrained on ImageNet.
    MobileNetV2 uses depthwise separable convolutions, ideal for low-latency inference.
    """
    inputs = layers.Input(shape=input_shape, name="input_leaf_image")
    
    # 1. Augmentation layer
    augmented = get_data_augmentation_pipeline()(inputs)
    
    # 2. Pretrained MobileNetV2 backbone (frozen initial weights)
    base_model = tf.keras.applications.MobileNetV2(
        input_shape=input_shape,
        include_top=False,
        weights='imagenet'
    )
    base_model.trainable = False
    
    features = base_model(augmented, training=False)
    
    # 3. Classification Head
    x = layers.GlobalAveragePooling2D(name="global_avg_pool")(features)
    x = layers.BatchNormalization()(x)
    x = layers.Dropout(0.3, name="dropout_regularization")(x)
    x = layers.Dense(256, activation='relu', kernel_regularizer=tf.keras.regularizers.l2(1e-4))(x)
    x = layers.Dropout(0.2)(x)
    outputs = layers.Dense(num_classes, activation='softmax', name="disease_probabilities")(x)
    
    model = models.Model(inputs=inputs, outputs=outputs, name="AgriSense_MobileNetV2")
    return model, base_model

def train_pipeline(dataset_dir, output_model_path="agrisense_mobilenetv2.h5", epochs=20, batch_size=32):
    print("🌾 Starting AgriSense AI Model Training Pipeline...")
    print(f"📁 Dataset Directory: {dataset_dir}")
    
    # Load dataset splits (80% train, 20% validation)
    train_ds = tf.keras.utils.image_dataset_from_directory(
        dataset_dir,
        validation_split=0.2,
        subset="training",
        seed=1337,
        image_size=(224, 224),
        batch_size=batch_size,
        label_mode='categorical'
    )
    
    val_ds = tf.keras.utils.image_dataset_from_directory(
        dataset_dir,
        validation_split=0.2,
        subset="validation",
        seed=1337,
        image_size=(224, 224),
        batch_size=batch_size,
        label_mode='categorical'
    )
    
    class_names = train_ds.class_names
    num_classes = len(class_names)
    print(f"✅ Identified {num_classes} plant-disease classes.")
    
    # Save class names mapping
    with open("ml/class_labels.json", "w") as f:
        json.dump({"classes": class_names, "total_classes": num_classes}, f, indent=2)
        
    # Preprocessing: normalize pixel values to [-1, 1]
    rescale_layer = layers.Rescaling(1./127.5, offset=-1)
    train_ds = train_ds.map(lambda x, y: (rescale_layer(x), y)).prefetch(tf.data.AUTOTUNE)
    val_ds = val_ds.map(lambda x, y: (rescale_layer(x), y)).prefetch(tf.data.AUTOTUNE)
    
    # Phase 1: Train classification head
    print("\n🚀 Phase 1: Training Classification Head with frozen backbone...")
    model, base_model = build_transfer_learning_model(num_classes=num_classes)
    
    model.compile(
        optimizer=optimizers.Adam(learning_rate=1e-3),
        loss='categorical_crossentropy',
        metrics=['accuracy', tf.keras.metrics.Precision(name='precision'), tf.keras.metrics.Recall(name='recall')]
    )
    
    head_callbacks = [
        callbacks.EarlyStopping(monitor='val_loss', patience=3, restore_best_weights=True),
        callbacks.ReduceLROnPlateau(monitor='val_loss', factor=0.5, patience=2, min_lr=1e-6)
    ]
    
    model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=epochs // 2,
        callbacks=head_callbacks
    )
    
    # Phase 2: Fine-Tuning the top layers of MobileNetV2
    print("\n🔬 Phase 2: Unfreezing top 30 layers for fine-tuning...")
    base_model.trainable = True
    # Freeze all layers except the last 30
    for layer in base_model.layers[:-30]:
        layer.trainable = False
        
    model.compile(
        optimizer=optimizers.Adam(learning_rate=1e-4), # Lower learning rate to avoid destroying weights
        loss='categorical_crossentropy',
        metrics=['accuracy', tf.keras.metrics.Precision(name='precision'), tf.keras.metrics.Recall(name='recall')]
    )
    
    fine_tune_callbacks = [
        callbacks.ModelCheckpoint(output_model_path, monitor='val_accuracy', save_best_only=True, verbose=1),
        callbacks.EarlyStopping(monitor='val_accuracy', patience=4, restore_best_weights=True),
        callbacks.ReduceLROnPlateau(monitor='val_loss', factor=0.2, patience=2, min_lr=1e-7)
    ]
    
    model.fit(
        train_ds,
        validation_data=val_ds,
        epochs=epochs // 2,
        callbacks=fine_tune_callbacks
    )
    
    print(f"\n🎉 Training complete! Best weights saved to: {output_model_path}")

if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="AgriSense AI Plant Disease Model Training")
    parser.add_argument("--data_dir", type=str, default="./data/PlantVillage", help="Path to PlantVillage dataset folder")
    parser.add_argument("--epochs", type=int, default=20, help="Total training epochs")
    parser.add_argument("--output", type=str, default="agrisense_mobilenetv2.h5", help="Output model filename")
    args = parser.parse_args()
    
    if not os.path.exists(args.data_dir):
        print(f"⚠️ Warning: Dataset folder '{args.data_dir}' not found.")
        print("Please follow instructions in ml/README.md to download the PlantVillage dataset.")
    else:
        train_pipeline(args.data_dir, output_model_path=args.output, epochs=args.epochs)
