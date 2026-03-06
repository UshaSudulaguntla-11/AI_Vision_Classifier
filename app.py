"""
ML Model Image Classifier - Flask Web Application
Serves a Keras .h5 model for image classification via a beautiful web UI.
"""

import os
import io
import json
import numpy as np
from flask import Flask, render_template, request, jsonify
from PIL import Image, ImageOps

# Suppress TF warnings for cleaner output
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '3'

import tensorflow as tf
import tf_keras as keras
from tf_keras.models import load_model
from tf_keras.layers import DepthwiseConv2D, Conv2D, BatchNormalization

# ── Custom layer fix for Teachable Machine models ──────────────────────────

class CustomDepthwiseConv2D(DepthwiseConv2D):
    """Fixes compatibility issue with 'groups' and 'mask' kwarg in older models."""
    def __init__(self, **kwargs):
        kwargs.pop('groups', None)
        kwargs.pop('mask', None)
        super().__init__(**kwargs)

class CustomConv2D(Conv2D):
    def __init__(self, **kwargs):
        kwargs.pop('mask', None)
        super().__init__(**kwargs)

class CustomBatchNormalization(BatchNormalization):
    def __init__(self, **kwargs):
        kwargs.pop('mask', None)
        super().__init__(**kwargs)


# ── Flask App ───────────────────────────────────────────────────────────────
app = Flask(__name__)

MODEL_DIR = os.path.join(os.path.dirname(__file__), "model")
MODEL_PATH = os.path.join(MODEL_DIR, "keras_model.h5")
LABELS_PATH = os.path.join(MODEL_DIR, "labels.txt")

# Load model and labels at startup
print("🔄  Loading model …")
model = load_model(
    MODEL_PATH,
    compile=False,
    custom_objects={
        "DepthwiseConv2D": CustomDepthwiseConv2D,
        "Conv2D": CustomConv2D,
        "BatchNormalization": CustomBatchNormalization
    },
)
print("✅  Model loaded successfully!")

with open(LABELS_PATH, "r") as f:
    class_names = [line.strip() for line in f.readlines()]
    # Strip leading index numbers like "0 Class" → "Class"
    class_names = [
        name.split(" ", 1)[1] if " " in name else name
        for name in class_names
    ]

print(f"📋  Classes: {class_names}")


def preprocess_image(image_bytes: bytes) -> np.ndarray:
    """Resize, centre-crop, and normalise an image for the model."""
    image = Image.open(io.BytesIO(image_bytes)).convert("RGB")
    image = ImageOps.fit(image, (224, 224), Image.Resampling.LANCZOS)
    arr = np.asarray(image, dtype=np.float32)
    normalised = (arr / 127.5) - 1
    return np.expand_dims(normalised, axis=0)   # shape (1, 224, 224, 3)


# ── Routes ──────────────────────────────────────────────────────────────────
@app.route("/")
def index():
    return render_template("index.html")


@app.route("/predict", methods=["POST"])
def predict():
    """Accept an image file, return prediction results as JSON."""
    if "image" not in request.files:
        return jsonify({"error": "No image uploaded"}), 400

    file = request.files["image"]
    if file.filename == "":
        return jsonify({"error": "Empty filename"}), 400

    try:
        image_bytes = file.read()
        data = preprocess_image(image_bytes)

        prediction = model.predict(data, verbose=0)
        index = int(np.argmax(prediction))
        confidence = float(prediction[0][index])

        all_predictions = [
            {"class": class_names[i], "confidence": round(float(prediction[0][i]) * 100, 2)}
            for i in range(len(class_names))
        ]
        all_predictions.sort(key=lambda x: x["confidence"], reverse=True)

        return jsonify({
            "class": class_names[index],
            "confidence": round(confidence * 100, 2),
            "all_predictions": all_predictions,
        })

    except Exception as e:
        return jsonify({"error": str(e)}), 500


# ── Entry Point ─────────────────────────────────────────────────────────────
if __name__ == "__main__":
    os.makedirs(MODEL_DIR, exist_ok=True)

    if not os.path.exists(MODEL_PATH):
        print(f"\n⚠️  Model file not found at: {MODEL_PATH}")
        print(f"   Please copy 'keras_model.h5' into the 'model/' folder.\n")
    if not os.path.exists(LABELS_PATH):
        print(f"\n⚠️  Labels file not found at: {LABELS_PATH}")
        print(f"   Please copy 'labels.txt' into the 'model/' folder.\n")

    app.run(debug=True, host="0.0.0.0", port=5000)
