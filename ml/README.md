# AgriSense AI — Machine Learning Pipeline & Research Documentation

## 1. Project Overview & Research Context
**AgriSense AI** integrates computer vision and agricultural pathology to identify foliar diseases across 14 major agricultural crop species. 

### Alignment with United Nations Sustainable Development Goals:
- **SDG 2: Zero Hunger**: Accelerating early intervention prevents devastating crop losses caused by aggressive pathogens such as *Phytophthora infestans* (Late Blight) and *Alternaria solani* (Early Blight).
- **SDG 12: Responsible Consumption and Production**: Replacing broad-spectrum, calendar-based preventative spraying with verified condition-targeted applications reduces unnecessary chemical runoff.
- **SDG 15: Life on Land**: Preserves essential soil microbiomes and beneficial insect populations by preventing synthetic agrochemical over-application.

---

## 2. Dataset Attribution & Acquisition
The model is trained on the open-access **PlantVillage Dataset**:
- **Reference**: Hughes, D., & Salathé, M. (2015). *An open access repository of images on plant health to enable the development of mobile disease diagnostics*. arXiv:1511.08060.
- **Scale**: 54,305 curated images across 38 distinct crop-disease combinations.
- **Crops Supported**: Apple, Blueberry, Cherry, Corn (Maize), Grape, Orange (Citrus), Peach, Bell Pepper, Potato, Raspberry, Soybean, Squash, Strawberry, and Tomato.

### Download Instructions:
1. Obtain the dataset from the official Zenodo repository or Kaggle PlantVillage mirror:
   ```bash
   mkdir -p data
   cd data
   # Using Kaggle CLI
   kaggle datasets download -d emmarex/plantdisease -p . --unzip
   mv plantdisease PlantVillage
   ```
2. Expected directory format:
   ```
   data/PlantVillage/
   ├── Tomato___Early_blight/
   ├── Tomato___Late_blight/
   ├── Tomato___healthy/
   ├── Corn_(maize)___Common_rust_/
   └── ... (38 class folders)
   ```

---

## 3. Model Architecture: MobileNetV2 Transfer Learning
We select **MobileNetV2** as the primary neural network backbone:
- **Depthwise Separable Convolutions**: Drastically reduces parameter count (~3.4M parameters) while maintaining top-1 feature extraction capacity.
- **Inverted Residuals with Linear Bottlenecks**: Preserves representation power across compact manifold embeddings.
- **Input Resolution**: 224 × 224 × 3 RGB.
- **Inference Latency**: ~35ms per image on CPU; <10ms on mobile edge TPU.

### Training Procedure:
1. **Phase 1 (Feature Extraction)**: Freeze the base ImageNet weights; train only the custom classification head (`Dense(256) -> Dropout(0.3) -> Dense(38, activation='softmax')`) using Adam optimizer with `lr = 1e-3` for 10 epochs.
2. **Phase 2 (Fine-Tuning)**: Unfreeze the top 30 layers of MobileNetV2 with a reduced learning rate of `1e-4` to adapt high-level leaf lesion filters without catastrophic forgetting.

---

## 4. Addressing Dataset Bias & Real-World Limitations
**Critical Engineering Note on Distribution Shift**:
- **Laboratory Artifacts**: Standard PlantVillage photos were captured under controlled lighting against uniform grey/white backgrounds.
- **Field Realities**: Real-world farm images exhibit complex soil backgrounds, variable sunlight shadows, leaf occlusion, dust particles, and mixed co-infections.
- **Mitigation Strategy**: AgriSense AI implements heavy spatial augmentation (Gaussian noise, contrast shifts, random rotations) and provides a **Gemini Vision fallback mode** that leverages large-scale multimodal models for unstructured field conditions.

---

## 5. Execution Commands
```bash
# Install Python ML dependencies
pip install -r backend/requirements.txt

# Run model training
python ml/train.py --data_dir ./data/PlantVillage --epochs 20 --output agrisense_mobilenetv2.h5

# Run test set evaluation
python ml/evaluate.py --model agrisense_mobilenetv2.h5 --test_dir ./data/PlantVillage/test

# Run CLI prediction on a single test image
python ml/predict.py --image path/to/leaf_photo.jpg
```
