# AgriSense AI — Smart Crop Doctor
> **"Smarter Farming. Healthier Crops."**  
> AI-Powered Plant Foliar Disease Diagnostics and Integrated Pest Management (IPM) Platform.

AgriSense AI is an agricultural technology application and ML internship showcase engineered to assist farmers, agricultural students, and agronomists in early plant pathology diagnosis, preventing regional blight epidemics, and eliminating unnecessary chemical pesticide overuse.

---

## 1. United Nations Sustainable Development Goals (SDG) Alignment
AgriSense AI directly supports:
- **SDG 2: Zero Hunger (Target 2.4)**: Ensures sustainable food production systems by curtailing devastating crop loss from foliar infections like Late Blight (*Phytophthora infestans*) and Early Blight (*Alternaria solani*).
- **SDG 12: Responsible Consumption and Production (Target 12.4)**: Promotes Integrated Pest Management (IPM) and organic biocontrols, stopping blanket prophylactic spraying of hazardous synthetic chemicals.
- **SDG 15: Life on Land (Target 15.5)**: Prevents chemical fungicide accumulation in agricultural soils, safeguarding mycorrhizal fungi, earthworms, and pollinator biodiversity.

---

## 2. Technology Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide Icons, SVG Data Visualizations, Modular UI component architecture (`src/components/ui/`, `src/services/`).
- **Backend & Model Serving**: Express.js with TypeScript (`backend/src/`), modular controllers, services, routes, and data persistence; dedicated Python FastAPI (`backend/python/main.py`) for standalone deployment.
- **Machine Learning Pipeline**: MobileNetV2 (TensorFlow / Keras), Transfer Learning, PlantVillage Dataset (54,305 images across 38 classes), Scikit-learn evaluation metrics (`ml/`).
- **Multimodal AI**: Google Gemini 3.8 Flash Vision fallback via `@google/genai` TypeScript SDK (server-side only with User-Agent telemetry).
- **Data Persistence**: File-backed JSON history engine (`analysis_history.json`).

---

## 3. Project Architecture

```
agrisense-ai/
├── backend/
│   ├── src/                         # Modular Express.js TypeScript backend
│   │   ├── config/                  # Environment & Gemini configurations
│   │   ├── controllers/             # Health, crops, diseases, predict, history, assistant
│   │   ├── data/                    # Plant classes, disease knowledge, crop catalog
│   │   ├── middleware/              # Error handling & request logging
│   │   ├── routes/                  # Express REST routes mounted at /api
│   │   ├── services/                # Gemini AI, Classifier, History, Disease services
│   │   ├── types/                   # Backend TypeScript types
│   │   ├── app.ts                   # Express app factory
│   │   └── server.ts                # Server startup & Vite dev/prod middleware
│   └── python/                      # Standalone Python FastAPI microservice
│       ├── main.py                  # FastAPI model serving endpoints
│       └── requirements.txt         # Python dependencies
├── ml/                              # Machine learning research pipeline
│   ├── train.py                     # MobileNetV2 training script
│   ├── evaluate.py                  # Model evaluation metrics
│   ├── predict.py                   # CLI inference script
│   ├── preprocessing.py             # Image augmentations
│   ├── class_labels.json            # 38 PlantVillage classes mapping
│   └── README.md                    # Research documentation
├── src/                             # React 19 frontend
│   ├── components/                  # Navigation, layout, and domain components
│   │   └── ui/                      # Reusable design system (Badge, Button, Card, Modal, etc.)
│   ├── pages/                       # Route pages (Dashboard, Scanner, Library, etc.)
│   ├── services/                    # Modular client services (apiClient, health, predict, etc.)
│   ├── types/                       # Shared domain TypeScript types
│   ├── utils/                       # Image compression & client inference fallback
│   ├── index.css                    # Design tokens & glassmorphic styles
│   └── App.tsx                      # Root application
├── server.ts                        # Clean application entry point
└── package.json                     # Project scripts and dependencies
```

---

## 4. Running the Application Locally

### Prerequisites
- Node.js 18+ (Node 20+ recommended)
- Python 3.10+ (for training the standalone ML model)

### Quick Start
```bash
# 1. Install Node.js dependencies
npm install

# 2. Start full-stack server (runs on http://localhost:3000)
npm run dev

# 3. Build for production
npm run build
npm run start
```

---

## 5. Machine Learning Pipeline (Python & TensorFlow)

### Dataset Setup (PlantVillage)
1. Download the PlantVillage dataset (~54k images):
   ```bash
   mkdir -p data
   cd data
   kaggle datasets download -d emmarex/plantdisease -p . --unzip
   mv plantdisease PlantVillage
   ```
2. Structure:
   ```
   data/PlantVillage/
   ├── Tomato___Early_blight/
   ├── Tomato___Late_blight/
   ├── Corn_(maize)___Common_rust_/
   └── ... (38 class directories)
   ```

### Training MobileNetV2 with Transfer Learning
```bash
# Install Python ML requirements
pip install -r backend/requirements.txt

# Run two-phase transfer learning training
python ml/train.py --data_dir ./data/PlantVillage --epochs 20 --output agrisense_mobilenetv2.h5
```

### Model Evaluation
```bash
python ml/evaluate.py --model agrisense_mobilenetv2.h5 --test_dir ./data/PlantVillage/test
```
Calculates Accuracy, Weighted Precision, Recall, Macro F1-score, and exports `ml/evaluation_results.json`.

### Single Leaf Inference
```bash
python ml/predict.py --image path/to/leaf_image.jpg --model agrisense_mobilenetv2.h5
```

---

## 6. Standalone Python FastAPI Backend
For deployments preferring a pure Python microservice:
```bash
cd backend
uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

---

## 7. Model Limitations & Distribution Shift
- **Laboratory Bias**: PlantVillage images are captured against uniform grey/black paper backgrounds under laboratory lighting. Real-world field images exhibit dirt, harsh shadows, and complex leaf overlaps.
- **Multimodal Mitigation**: AgriSense AI includes both MobileNetV2 calibrated classification and Gemini 3.8 Flash Vision fallback to handle in-field ambiguities responsibly without fabricating false confidence.
- **Ethical Safeguard**: All predictions explicitly advise consulting local agricultural extension officers before commercial spraying.
