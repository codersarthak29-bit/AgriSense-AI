"""
AgriSense AI — Smart Crop Doctor
Module: Model Evaluation & Metric Reporting
Calculates: Accuracy, Precision, Recall, Macro F1-Score, and Confusion Matrix
Author: AgriSense AI ML Research Team
"""

import os
import json
import argparse
import numpy as np
import tensorflow as tf
from sklearn.metrics import classification_report, confusion_matrix, precision_recall_fscore_support

def evaluate_model(model_path, test_data_dir, labels_path="ml/class_labels.json"):
    print(f"📊 Loading AgriSense Model from: {model_path}")
    model = tf.keras.models.load_model(model_path)
    
    with open(labels_path, "r") as f:
        meta = json.load(f)
        class_names = meta["classes"]
        
    print(f"🧪 Loading evaluation test set from: {test_data_dir}")
    test_ds = tf.keras.utils.image_dataset_from_directory(
        test_data_dir,
        image_size=(224, 224),
        batch_size=32,
        shuffle=False,
        label_mode='categorical'
    )
    
    rescale_layer = tf.keras.layers.Rescaling(1./127.5, offset=-1)
    test_ds_rescaled = test_ds.map(lambda x, y: (rescale_layer(x), y))
    
    # Run predictions
    print("⏳ Running inference on test split...")
    y_pred_probs = model.predict(test_ds_rescaled)
    y_pred = np.argmax(y_pred_probs, axis=1)
    
    # Extract ground truth labels
    y_true_batches = []
    for _, labels_batch in test_ds:
        y_true_batches.append(np.argmax(labels_batch.numpy(), axis=1))
    y_true = np.concatenate(y_true_batches)
    
    # Calculate metrics
    precision, recall, f1, _ = precision_recall_fscore_support(y_true, y_pred, average='weighted')
    accuracy = np.mean(y_true == y_pred)
    
    print("\n" + "="*50)
    print("🌾 AGRISENSE AI MODEL EVALUATION SUMMARY")
    print("="*50)
    print(f"Total Samples Evaluated: {len(y_true)}")
    print(f"Overall Accuracy:        {accuracy * 100:.2f}%")
    print(f"Weighted Precision:      {precision * 100:.2f}%")
    print(f"Weighted Recall:         {recall * 100:.2f}%")
    print(f"Weighted F1-Score:       {f1 * 100:.2f}%")
    print("="*50)
    
    print("\nDetailed Per-Class Classification Report:")
    report = classification_report(y_true, y_pred, target_names=class_names, digits=4)
    print(report)
    
    cm = confusion_matrix(y_true, y_pred)
    print(f"\nConfusion Matrix Shape: {cm.shape}")
    
    # Save metrics report
    results = {
        "accuracy": float(accuracy),
        "precision": float(precision),
        "recall": float(recall),
        "f1_score": float(f1),
        "total_test_samples": int(len(y_true)),
        "model_architecture": "MobileNetV2"
    }
    with open("ml/evaluation_results.json", "w") as f:
        json.dump(results, f, indent=2)
    print("📁 Evaluation metrics exported to: ml/evaluation_results.json")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument("--model", type=str, default="agrisense_mobilenetv2.h5")
    parser.add_argument("--test_dir", type=str, default="./data/PlantVillage/test")
    args = parser.parse_args()
    
    if os.path.exists(args.model) and os.path.exists(args.test_dir):
        evaluate_model(args.model, args.test_dir)
    else:
        print("Note: To run evaluation on physical files, provide valid --model and --test_dir paths.")
