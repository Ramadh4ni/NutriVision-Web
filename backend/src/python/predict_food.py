import argparse
import json
import os

import numpy as np
from PIL import Image
from keras.models import model_from_json


def sanitize_keras3_config(value):
    if isinstance(value, dict):
        sanitized = {}
        for key, item in value.items():
            if key in {"build_config", "compile_config", "registered_name", "shared_object_id", "quantization_config"}:
                continue
            mapped_key = "batch_input_shape" if key == "batch_shape" else key
            if mapped_key == "optional":
                continue
            sanitized[mapped_key] = sanitize_keras3_config(item)
        return sanitized

    if isinstance(value, list):
        return [sanitize_keras3_config(item) for item in value]

    return value


def load_model(model_dir: str):
    config_path = os.path.join(model_dir, "config.json")
    weights_path = os.path.join(model_dir, "model.weights.h5")

    with open(config_path, "r", encoding="utf-8") as config_file:
        raw_config = json.load(config_file)

    config_json = json.dumps(sanitize_keras3_config(raw_config))
    model = model_from_json(config_json)
    model.load_weights(weights_path)
    return model


def prepare_image(image_path: str):
    image = Image.open(image_path).convert("RGB")
    image = image.resize((224, 224))
    array = np.asarray(image, dtype=np.float32)
    array = np.expand_dims(array, axis=0)
    return array


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("--model-dir", required=True)
    parser.add_argument("--image-path", required=True)
    args = parser.parse_args()

    model = load_model(args.model_dir)
    image_tensor = prepare_image(args.image_path)
    prediction = model.predict(image_tensor, verbose=0)[0]
    predicted_index = int(np.argmax(prediction))
    confidence = float(prediction[predicted_index])

    print(
        json.dumps(
            {
                "predictedIndex": predicted_index,
                "confidence": confidence,
                "probabilities": [float(value) for value in prediction.tolist()],
            }
        )
    )


if __name__ == "__main__":
    main()
