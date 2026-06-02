import json
import numpy as np
import tensorflow as tf

from PIL import Image
from tensorflow.keras.applications.efficientnet import preprocess_input

MODEL_PATH = "C:\\Users\\Hype AMD\\Nutrivisonweb\\NutriVision-Web\\model (AI)\\models\\model_3_best (1).keras"
CLASS_PATH = "C:\\Users\\Hype AMD\\Nutrivisonweb\\NutriVision-Web\\model (AI)\\models\\class_names.json"

# Load model sekali saat startup
model = tf.keras.models.load_model(
    MODEL_PATH,
    compile=False
)

with open(CLASS_PATH, "r") as f:
    class_names = json.load(f)


def predict_image(image_file):

    image = Image.open(image_file)

    image = image.convert("RGB")
    image = image.resize((224, 224))

    image_array = np.array(
        image,
        dtype=np.float32
    )

    image_array = preprocess_input(
        image_array
    )

    image_array = np.expand_dims(
        image_array,
        axis=0
    )

    prediction = model.predict(
        image_array,
        verbose=0
    )

    pred_idx = int(
        np.argmax(prediction)
    )

    confidence = float(
        np.max(prediction)
    )

    return {
        "class_name": class_names[pred_idx],
        "confidence": round(
            confidence * 100,
            2
        )
    }