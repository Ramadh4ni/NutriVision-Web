# NutriVision AI Service

AI Service for NutriVision that combines TensorFlow-based food image classification and Gemini AI-powered nutrition analysis and recipe generation.

---

# Overview

This module serves as the AI layer of the NutriVision ecosystem.

```text
Frontend / Mobile App
        ↓
Backend (Express.js)
        ↓
FastAPI AI Service
        ↓
┌─────────────────────────┐
│ TensorFlow Model        │
│ • Food Classification   │
└─────────────────────────┘
        ↓
┌─────────────────────────┐
│ Gemini AI              │
│ • Nutrition Analysis   │
│ • Recipe Generation    │
└─────────────────────────┘
        ↓
Structured JSON Response
```

The AI service receives food images from the backend, predicts the food category using a TensorFlow model, and enriches the result using Gemini AI to provide nutritional information and recipe recommendations.

---

# Features

### Food Detection

* Food image classification using TensorFlow/Keras
* Transfer Learning with EfficientNet
* Confidence score prediction
* Multi-class food recognition

### Nutrition Analysis

* Nutritional estimation using Gemini AI
* Health insights
* Calorie estimation
* Food description generation

### Recipe Recommendation

* Recipe generation based on detected food
* Cooking instructions
* Ingredient recommendations

### Explainable AI

* Grad-CAM visualization
* Model evaluation notebooks
* Training experiments

---

# Project Structure

```text
model (AI)/
│
├── notebooks/                   # Model development & experiments
│   ├── Model_1.ipynb            # Initial training & evaluation
│   └── Model_2_3_4.ipynb        # Model comparison & improvements
│
├── inference/                   # FastAPI inference service
│   ├── main.py                  # FastAPI application entry point
│   ├── routes.py                # API endpoints (/predict)
│   ├── predictor.py             # TensorFlow + Gemini prediction logic
│   ├── utils.py                 # Image preprocessing utilities
│   └── schemas.py               # Request & response schemas
│
├── services/
│   └── model_loader.py          # Load trained model and class labels
│
├── gemini/
│   ├── config.py                # Gemini API configuration
│   ├── gemini_client.py         # Gemini client initialization
│   └── service.py               # Nutrition analysis & recipe generation
│
├── models/
│   ├── food_saved_model/        # TensorFlow SavedModel format
│   ├── model_3_best.keras       # Best trained model checkpoint
│   ├── class_names.json         # Class label mapping
│   └── test_model.py            # Model testing script
│
├── prompts/
│   ├── system_prompt.txt        # System instructions
│   ├── nutrition_prompt.txt     # Nutrition analysis prompt
│   └── recipe_prompt.txt        # Recipe generation prompt
│
├── uploads/                     # Temporary uploaded images
│
├── app.py                       # Main application launcher
├── requirements.txt             # Python dependencies
├── .env                         # Environment variables (NOT pushed)
└── README.md                    # AI module documentation
```

---

# Folder Explanation

## notebooks/

Contains model development and experimentation notebooks.

Files:

* Model training
* Data preprocessing
* Transfer learning experiments
* Evaluation metrics
* Grad-CAM visualization

---

## inference/

Contains the FastAPI inference service.

### main.py

Application entry point.

### routes.py

API endpoints definition.

### predictor.py

Connects TensorFlow model and Gemini service.

### utils.py

Image preprocessing utilities.

### schemas.py

Request and response schemas.

---

## gemini/

Handles communication with Gemini AI.

### config.py

Gemini API configuration.

### gemini_client.py

Gemini client initialization.

### service.py

Nutrition analysis and recipe generation logic.

---

## services/

Reusable services.

### model_loader.py

Loads TensorFlow model and class labels into memory.

---

## models/

Contains trained machine learning models.

### food_saved_model/

TensorFlow SavedModel format.

### model_3_best.keras

Best-performing model checkpoint.

### class_names.json

Maps class indices to food labels.

---

## prompts/

Prompt templates used by Gemini AI.

### system_prompt.txt

General AI behavior prompt.

### nutrition_prompt.txt

Nutrition analysis prompt.

### recipe_prompt.txt

Recipe generation prompt.

---

## uploads/

Temporary storage for uploaded images.

This folder is generated during runtime and should not store important files.

---

# Installation

## Clone Repository

```bash
git clone <repository-url>
cd "model (AI)"
```

---

## Create Virtual Environment

Windows:

```bash
python -m venv venv
venv\Scripts\activate
```

Linux/Mac:

```bash
python -m venv venv
source venv/bin/activate
```

---

## Install Dependencies

```bash
pip install -r requirements.txt
```

---

# Environment Variables

Create a `.env` file:

```env
GEMINI_API_KEY=YOUR_GEMINI_API_KEY
```

Example:

```env
GEMINI_API_KEY=AIzaxxxxxxxxxxxxxxxx
```

⚠️ Never commit `.env` files to GitHub.

---

# Running the API

Start the FastAPI server:

```bash
uvicorn app:app --reload
```

Default:

```text
http://127.0.0.1:8000
```

Swagger Documentation:

```text
http://127.0.0.1:8000/docs
```

ReDoc Documentation:

```text
http://127.0.0.1:8000/redoc
```

---

# API Workflow

```text
Image Upload
      ↓
Image Preprocessing
      ↓
TensorFlow Prediction
      ↓
Food Label
      ↓
Gemini Nutrition Analysis
      ↓
Recipe Recommendation
      ↓
JSON Response
```

---

# Model Information

Base Model:

* EfficientNetB0

Framework:

* TensorFlow
* Keras

Image Size:

* 224 × 224

Output:

* Food category prediction
* Confidence score

---

# Contributors

AI Engineer Team

Responsibilities:

* Model training
* Model evaluation
* API development
* Gemini AI integration
* Explainable AI (Grad-CAM)
