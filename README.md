# 🥗 NutriVision AI Service

AI Microservice untuk deteksi makanan dari gambar + analisis nutrisi + rekomendasi resep berbasis Gemini AI.

---

# 🚀 Overview

Service ini menerima input **gambar makanan**, lalu akan:

1. Mendeteksi makanan menggunakan **TensorFlow Model**
2. Menghasilkan analisis **nutrisi (kalori, protein, dll)**
3. Memberikan **rekomendasi resep sehat**
4. Menggunakan **Gemini AI sebagai reasoning layer**

---

# 🧠 System Architecture

```text
Frontend / Mobile App
        ↓
Backend (Express - Team)
        ↓
FastAPI AI Service (ini repo)
        ↓
────────────────────────────
│ 1. TensorFlow Model       │
│    → Food Detection       │
│                           │
│ 2. Gemini AI              │
│    → Nutrition Analysis   │
│    → Recipe Generator     │
────────────────────────────
        ↓
Structured JSON Response


model (AI)/
│
├── inference/                 # FastAPI main service
│   ├── main.py              # entry point FastAPI
│   ├── routes.py            # API endpoints (/predict)
│   ├── predictor.py         # logic: TF + Gemini
│   ├── utils.py             # image preprocessing
│   ├── schemas.py           # response structure
│
├── services/
│   └── model_loader.py      # load ML model + labels
│
├── gemini/
│   ├── config.py           # Gemini API setup
│   ├── service.py          # nutrition & recipe logic
│
├── models/
│   ├── food_saved_model/   # trained model
│   └── class_names.json    # label mapping
│
├── prompts/
│   ├── system_prompt.txt
│   ├── nutrition_prompt.txt
│   └── recipe_prompt.txt
│
├── uploads/                # temp uploaded images
│
├── .env                    # API keys (NOT pushed)
├── requirements.txt
└── README.md