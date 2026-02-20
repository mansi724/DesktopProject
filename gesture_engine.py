import cv2
import mediapipe as mp
import numpy as np
import joblib
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent


class GestureEngine:
    def __init__(self):
        # MediaPipe setup
        self.mp_hands = mp.solutions.hands
        self.hands = self.mp_hands.Hands(
            static_image_mode=False,
            max_num_hands=1,
            min_detection_confidence=0.7,
            min_tracking_confidence=0.7
        )
        self.mp_draw = mp.solutions.drawing_utils

        # Load trained model and label encoder (absolute paths)
        self.model = joblib.load(BASE_DIR / "gesture_landmark_model.pkl")
        self.label_encoder = joblib.load(BASE_DIR / "label_encoder.pkl")

        # Confidence threshold (you can tune this)
        self.conf_threshold = 0.70

    # Normalize landmarks (relative to wrist)
    def normalize_landmarks(self, landmarks: np.ndarray) -> np.ndarray:
        landmarks = landmarks.reshape(21, 3)
        wrist = landmarks[0]
        normalized = landmarks - wrist
        return normalized.flatten()

    # Process frame and extract normalized landmarks
    def process(self, frame):
        rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
        results = self.hands.process(rgb)

        if results.multi_hand_landmarks:
            hand = results.multi_hand_landmarks[0]
            landmarks = []

            for lm in hand.landmark:
                landmarks.append([lm.x, lm.y, lm.z])

            landmarks = np.array(landmarks, dtype=np.float32)
            landmarks = self.normalize_landmarks(landmarks)

            return landmarks, results.multi_hand_landmarks

        return None, None

    # Predict gesture from landmarks
    def predict(self, landmarks):
        pred_class = self.model.predict([landmarks])[0]
        probabilities = self.model.predict_proba([landmarks])[0]

        confidence = float(np.max(probabilities))
        gesture_name = self.label_encoder.inverse_transform([pred_class])[0]

        # Safety: return Unknown if confidence is low
        if confidence < self.conf_threshold:
            return "Unknown", confidence

        return str(gesture_name), confidence

    # NEW: Predict directly from a camera frame (easy for Flask)
    def predict_from_frame(self, frame):
        landmarks, _ = self.process(frame)
        if landmarks is None:
            return "None", 0.0
        return self.predict(landmarks)