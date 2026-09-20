# 🖐️ Gesture-Based Desktop Control System

![Python](https://img.shields.io/badge/Python-3.8%2B-blue)
![Flask](https://img.shields.io/badge/Backend-Flask-black)
![OpenCV](https://img.shields.io/badge/Vision-OpenCV-green)
![MediaPipe](https://img.shields.io/badge/Hand%20Tracking-MediaPipe-orange)

Control your computer with hand gestures. This project uses your webcam to recognize static and dynamic hand gestures in real time and turns them into desktop actions, all managed from a simple web dashboard.

<!-- TODO: add a demo GIF or screenshot of the dashboard, e.g.
![Dashboard](assets/dashboard.png)
-->

---

## 📖 Overview

The system captures live video with OpenCV, extracts 21 hand landmarks per frame with MediaPipe, and classifies the gesture with trained machine-learning models. A Flask server streams the annotated camera feed to a browser dashboard, where you can start or stop the system and watch the recognized gesture.

Two types of gestures are supported:

- **Static gestures:** a single hand pose recognized from one frame.
- **Dynamic gestures:** a movement recognized from a sequence of 20 frames.

---

## ✨ Features

- 📷 Live camera feed streamed to the browser (Flask + OpenCV)
- 🤚 Real-time hand tracking and gesture prediction (MediaPipe + ML model)
- 🔄 Separate models for static and dynamic gestures
- 🎯 Confidence thresholds to avoid accidental triggers
- 🖥️ Web dashboard built with HTML, CSS and JavaScript
- ▶️ Start / Stop system control
- 📊 Gesture confidence display
- ⚙️ Custom gesture management UI
- 🔁 One-click retraining UI *(backend integration pending)*

---

## 🧠 How It Works

```
Webcam frame
     │
     ▼
MediaPipe Hands  →  21 landmarks (x, y, z)
     │
     ▼
Normalize relative to the wrist
     │
     ├── Static model   (single frame)        → confidence > 0.9 → trigger action
     │
     └── Dynamic model  (20-frame sequence)   → confidence > 0.8 → trigger action
                                   │
                                   ▼
                    Action mapper → desktop action (PyAutoGUI)
```

1. **Landmark extraction:** MediaPipe detects one hand (minimum detection and tracking confidence of 0.7).
2. **Normalization:** landmarks are shifted relative to the wrist, so recognition does not depend on where the hand appears in the frame.
3. **Classification:** a trained model predicts the gesture and a confidence score. Predictions below the threshold are ignored (`Unknown`).
4. **Action mapping:** recognized gestures are mapped to desktop actions.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|--------------|
| Backend | Python, Flask |
| Computer Vision | OpenCV, MediaPipe |
| Machine Learning | scikit-learn models saved with Joblib, NumPy |
| Desktop Automation | PyAutoGUI *(optional)* |
| Frontend | HTML, CSS, JavaScript |

---

## 📁 Project Structure

<!-- TODO: update this so it matches your actual folders and files -->

```
DesktopProject/
├── app.py                 # Flask server, video streaming and prediction loop
├── gesture_engine.py      # MediaPipe landmark extraction and gesture prediction
├── action_mapper.py       # Maps gestures to desktop actions
├── model/                 # Trained models, encoders and scaler (.pkl)
├── templates/
│   └── index.html         # Dashboard page
├── static/
│   ├── styles.css         # Dashboard styling
│   └── app.js             # Dashboard logic
└── README.md
```

---

## ⚙️ Getting Started

### Prerequisites

- Python 3.8 or higher
- A working webcam

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/mansi724/DesktopProject.git
cd DesktopProject

# 2. Create and activate a virtual environment
python -m venv venv

# Windows
venv\Scripts\activate
# Linux / macOS
source venv/bin/activate

# 3. Install dependencies
pip install flask opencv-python mediapipe numpy joblib scikit-learn pyautogui
```

### Run the app

```bash
python app.py
```

Then open **http://127.0.0.1:5000** in your browser.

---

## 🎮 Usage

1. Start the server and open the dashboard.
2. Allow camera access and place one hand in front of the webcam.
3. Press **Start** to begin gesture recognition.
4. Perform a gesture and watch the predicted gesture and its confidence on the dashboard.
5. Press **Stop** to pause recognition.

### Gesture → Action Map

<!-- TODO: replace these rows with your real gestures and actions -->

| Gesture | Type | Desktop Action |
|---------|------|----------------|
| *Gesture name* | Static | *e.g. play / pause* |
| *Gesture name* | Dynamic | *e.g. switch window* |
| *Gesture name* | Static | *e.g. volume up* |

---

## 🌐 API Endpoints

| Route | Description |
|-------|-------------|
| `/` | Dashboard page |
| `/video_feed` | Live annotated camera stream |
| `/gesture_status` | Current gesture and confidence (JSON) |

---

## 🗺️ Roadmap

- [ ] Connect the one-click retraining UI to the backend
- [ ] Let users add and manage custom gestures from the dashboard
- [ ] Editable gesture-to-action mapping from the UI
- [ ] Multi-hand support
- [ ] Improve accuracy with more training data

---

## 👩‍💻 Authors

<!-- TODO: add names and GitHub profile links -->

- **Navya Minocha**, **Mansi Bansal**
---

## 📄 License

<!-- TODO: choose a license (e.g. MIT) or delete this section -->

This project is licensed under the MIT License.
