import numpy as np
import tensorflow as tf

from services.model_loader import predict_fn, class_names
from inference.utils import preprocess_image
from gemini.service import generate_food_analysis


def predict_and_generate(image):

    # 1. preprocess
    image_array = preprocess_image(image)

    # 2. prediction model
    predictions = predict_fn(tf.constant(image_array))
    predictions = list(predictions.values())[0].numpy()

    pred_idx = int(np.argmax(predictions))
    confidence = float(np.max(predictions) * 100)

    food_name = class_names[pred_idx]

    # 3. Gemini AI (8 resep)
    ai_result = generate_food_analysis([food_name])

    return {
        "food_name": food_name,
        "confidence": round(confidence, 2),
        "result": ai_result
    }