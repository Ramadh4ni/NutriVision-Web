import tensorflow as tf
import json

MODEL_PATH = "C:\\Users\\Hype AMD\\Nutrivisonweb\\NutriVision-Web\\model (AI)\\models\\food_saved_model"
CLASS_PATH = "C:\\Users\\Hype AMD\\Nutrivisonweb\\NutriVision-Web\\model (AI)\\models\\class_names.json"

model = tf.saved_model.load(MODEL_PATH)
predict_fn = model.signatures["serving_default"]

with open(CLASS_PATH, "r", encoding="utf-8") as f:
    class_names = json.load(f)