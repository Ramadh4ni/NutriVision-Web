# test_model.py

import tensorflow as tf

model = tf.saved_model.load(
    "C:\\Users\\Hype AMD\\Nutrivisonweb\\NutriVision-Web\\model (AI)\\models\\food_saved_model"
)

print("Model Loaded Successfully")