# AI Vision Classifier

A premium, AI-powered image classification web application built with **Flask** and **TensorFlow**. It allows users to classify images via file upload or real-time webcam capture, featuring a modern dark theme with glassmorphism and animated components.

## ✨ Features

- **Deep Learning Core**: Powered by a Keras (`.h5`) model.
- **Webcam Integration**: Capture images directly from your browser.
- **Real-time Results**: Instant prediction with confidence scores and class breakdown.
- **Prediction History**: Automatically saves recent classifications locally.
- **Export Results**: Download the detailed classification report as a text file.
- **Responsive Design**: Premium dark UI that works on desktop and mobile.

## 🚀 Getting Started

### 1. Prerequisites
Ensure you have Python 3.9+ installed.

### 2. Installation
Clone this repository and install the dependencies:
```bash
pip install -r requirements.txt
```

### 3. Model Setup
Place your Teachable Machine (or Keras) model files in the `model/` directory:
- `keras_model.h5`
- `labels.txt`

### 4. Running the App
Start the Flask development server:
```bash
python app.py
```
Open your browser and navigate to `http://localhost:5000`.

## 📁 Directory Structure
- `app.py`: Main Flask application backend.
- `model/`: Folder for the trained ML model and labels.
- `static/`: Frontend assets (CSS, JS, Images).
- `templates/`: HTML templates.
- `requirements.txt`: Python package dependencies.

## 🛠️ Technology Stack
- **Backend**: Flask (Python)
- **ML Framework**: TensorFlow / Keras
- **Frontend**: Vanilla JavaScript, CSS3 (Glassmorphism), HTML5
- **Fonts**: Inter (Google Fonts)
