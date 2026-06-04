from fastapi import FastAPI, UploadFile, File
from PIL import Image
import tensorflow as tf
import numpy as np
import json
import io

# =====================================================
# FASTAPI
# =====================================================

app = FastAPI(
    title="NutriVision API"
)

# =====================================================
# LOAD MODEL
# =====================================================

import os

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
MODEL_PATH = os.path.join(BASE_DIR, "models", "food_saved_model")

model = tf.saved_model.load(
    MODEL_PATH
)

predict_fn = model.signatures["serving_default"]

print("✅ Model Loaded")

# =====================================================
# LOAD CLASS NAMES
# =====================================================

class_names_path = os.path.join(BASE_DIR, "models", "class_names.json")
with open(
    class_names_path,
    "r",
    encoding="utf-8"
) as f:

    class_names = json.load(f)

print("✅ Class Names Loaded")

# =====================================================
# HOME
# =====================================================

@app.get("/")
def home():

    return {
        "message": "NutriVision API Running"
    }

# =====================================================
# PREPROCESS IMAGE
# =====================================================

def preprocess_image(image):

    image = image.convert("RGB")

    image = image.resize(
        (224, 224)
    )

    image = np.array(
        image,
        dtype=np.float32
    )

    image = np.expand_dims(
        image,
        axis=0
    )

    return image

# =====================================================
# PREDICT
# =====================================================

@app.post("/predict")
async def predict(
    file: UploadFile = File(...)
):

    contents = await file.read()

    image = Image.open(
        io.BytesIO(contents)
    )

    image_array = preprocess_image(
        image
    )

    predictions = predict_fn(
        tf.constant(image_array)
    )

    predictions = list(
        predictions.values()
    )[0].numpy()

    pred_idx = int(
        np.argmax(predictions)
    )

    confidence = float(
        np.max(predictions) * 100
    )

    food_name = class_names[
        pred_idx
    ]

    return {

        "food_name": food_name,

        "class_index": pred_idx,

        "confidence": round(
            confidence,
            2
        )
    }