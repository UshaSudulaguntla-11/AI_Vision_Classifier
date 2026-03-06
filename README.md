# 🧠 AI Vision Classifier

An AI-powered image classification web application built using Flask and TensorFlow/Keras that allows users to upload images or capture photos using a webcam and instantly receive predictions from a trained deep learning model.

The application demonstrates how computer vision models can be integrated into a real-time web application, combining machine learning, backend development, and interactive frontend UI.

This project showcases the complete pipeline of deploying an image classification model into a production-like web interface.

---

# 📌 Project Overview

Image classification is one of the most common tasks in computer vision, where a trained machine learning model identifies the category of an image.

This project implements a deep learning-based image classifier that:

* Accepts an image input (upload or webcam).
* Processes the image into a format compatible with the trained model.
* Runs inference using a TensorFlow/Keras model.
* Returns the predicted class along with confidence scores.
* Displays results through a modern, responsive web interface.

The application simulates how AI models are integrated into real-world products, where users interact through a UI while the backend handles model inference.

---

# 🎯 Objectives of the Project

The main goals of this project are:

* Demonstrate deployment of machine learning models in web applications
* Show how Flask APIs can serve AI predictions
* Implement real-time image capture using browser webcam APIs
* Build a modern interactive UI with prediction visualization
* Maintain prediction history locally for user reference
* Provide exportable classification reports

This project bridges the gap between machine learning experimentation and real-world deployment.

---

# 🧠 Core AI Concept

The classifier uses a Deep Learning model trained using Keras (TensorFlow backend).

## Image Classification

Image classification is a task in computer vision where a model learns patterns from images and assigns them to predefined categories.

Example workflow:

Input Image → Preprocessing → Neural Network Model → Prediction

The neural network analyzes features such as:

* shapes
* textures
* colors
* patterns

It then outputs probabilities for each possible class.

Example output:

Cat : 92.5%
Dog : 6.3%
Rabbit : 1.2%

The highest probability is selected as the final prediction.

---

# 🏗️ System Architecture

The system consists of three main components.

## 1️⃣ Frontend Layer

Responsible for user interaction.

Features include:

* Image upload
* Webcam capture
* Displaying prediction results
* Showing confidence scores
* Storing prediction history
* Exporting reports

Technologies used:

* HTML5
* CSS3 (Glassmorphism UI)
* JavaScript
* Webcam API

## 2️⃣ Backend Layer

The backend is implemented using Flask, a lightweight Python web framework.

Responsibilities:

* Receive image requests
* Process image data
* Run inference using the trained model
* Return prediction results in JSON format

Flask acts as a bridge between the UI and the machine learning model.

## 3️⃣ Machine Learning Layer

The AI model is a Keras .h5 trained neural network model.

It performs:

* Feature extraction
* Pattern recognition
* Class prediction

Files required:

model/
├── keras_model.h5
└── labels.txt

Where:

keras_model.h5 → trained neural network
labels.txt → class names used during training

---

# ⚙️ Application Workflow

The working process of the application follows these steps:

## Step 1 — User Input

User provides an image via:

* Uploading a file
* Capturing image through webcam

## Step 2 — Image Processing

The image is:

* resized to model input size
* normalized
* converted into tensor format

## Step 3 — Model Prediction

The processed image is passed to the Keras model, which produces probabilities for each class.

## Step 4 — Result Generation

The backend returns:

* predicted class
* confidence percentage
* probability distribution

## Step 5 — Result Display

The frontend displays:

* predicted label
* confidence score
* detailed class breakdown
* prediction history

---

# ✨ Features

## 🔍 AI-Powered Classification

Uses a deep learning model to classify images with probability scores.

## 📷 Webcam Image Capture

Users can capture images directly through the browser using the Webcam API.

## ⚡ Real-Time Predictions

The application performs instant inference after receiving the image.

## 📊 Confidence Score Visualization

Displays probability distribution across all classes.

## 🕘 Prediction History

Recent predictions are stored in local storage so users can review past results.

## 📥 Export Classification Report

Users can download a text report containing classification results.

## 🎨 Modern Premium UI

The interface uses:

* Dark theme
* Glassmorphism design
* Smooth animations
* Responsive layout

---

# 🖥️ User Interface Design

The UI was designed with a modern glassmorphism aesthetic.

Key design elements:

* blurred background cards
* soft glowing borders
* smooth transitions
* responsive layouts

Fonts used:

Inter (Google Fonts)

The UI is fully responsive and works across:

* desktops
* tablets
* mobile devices

---

# 📂 Project Directory Structure

AI-Vision-Classifier
│
├── app.py
│
├── model
│   ├── keras_model.h5
│   └── labels.txt
│
├── static
│   ├── css
│   ├── js
│   └── images
│
├── templates
│   └── index.html
│
├── requirements.txt
│
└── README.md

---

# 🛠️ Technology Stack

## Backend

* Python
* Flask

## Machine Learning

* TensorFlow
* Keras
* NumPy

## Frontend

* HTML5
* CSS3
* JavaScript

## UI Design

* Glassmorphism
* Dark Theme
* Inter Font

---

# 📦 Installation Guide

## Step 1 — Clone the Repository

```
git clone https://github.com/yourusername/ai-vision-classifier.git
cd ai-vision-classifier
```

## Step 2 — Install Dependencies

```
pip install -r requirements.txt
```

## Step 3 — Add Model Files

Place your trained model files inside the model/ directory.

Required files:

model/
keras_model.h5
labels.txt

These files can be generated using Google Teachable Machine or any Keras training pipeline.

## Step 4 — Run the Application

```
python app.py
```

## Step 5 — Open in Browser

Navigate to:

[http://localhost:5000](http://localhost:5000)

---

# 📊 Example Output

Example prediction:

Prediction: Cat
Confidence: 94.21%

Class Probabilities:
Cat — 94.21%
Dog — 3.15%
Rabbit — 2.64%

---

# 🚀 Future Improvements

Possible enhancements for future development:

* Deploy using Docker
* Add GPU inference support
* Implement multi-image batch prediction
* Integrate model retraining pipeline
* Add REST API endpoints
* Deploy to cloud platforms (AWS / GCP / Render)

---

# 🎓 Learning Outcomes

Through this project, the following concepts were implemented:

* Machine Learning Model Deployment
* Image Classification using Deep Learning
* Flask Backend Development
* RESTful API integration
* Frontend–Backend communication
* Real-time browser webcam integration
* UI/UX design with modern CSS techniques

---

# 👨‍💻 Author

Sudulaguntla Usha Chowdary

