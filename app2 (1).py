from flask import Flask, render_template, Response, jsonify
import cv2
import joblib
import numpy as np
from gesture_engine import GestureEngine
from action_mapper import ActionMapper


dynamic_model = joblib.load("model/dynamic_gesture_model.pkl")
dynamic_encoder = joblib.load("model/dynamic_label_encoder.pkl")
dynamic_scaler = joblib.load("model/dynamic_scaler.pkl")

static_model = joblib.load("model/gesture_landmark_model.pkl")
static_encoder = joblib.load("model/label_encoder.pkl")


app = Flask(__name__)

engine = GestureEngine()
mapper = ActionMapper()

camera = cv2.VideoCapture(0)
     
current_gesture = "None"
current_confidence = 0.0

SEQUENCE_LENGTH = 20
sequence = []

# 🔹 Home Page
@app.route("/")
def index():
    return render_template("index.html")


# 🔹 Video Streaming
def generate_frames():
    global current_gesture, current_confidence, sequence

    while True:
        success, frame = camera.read()
        if not success:
            break

        landmarks, hands = engine.process(frame)

        if hands:
            for hand in hands:
                engine.mp_draw.draw_landmarks(
                    frame,
                    hand,
                    engine.mp_hands.HAND_CONNECTIONS
                )

        if landmarks is not None:

    # ---- Collect for dynamic ----
           sequence.append(landmarks)

    # ---- If enough frames → Dynamic ----
           if len(sequence) == SEQUENCE_LENGTH:
             input_data = np.array(sequence).flatten().reshape(1, -1)
             input_data = dynamic_scaler.transform(input_data)

             prediction = dynamic_model.predict(input_data)[0]
             probabilities = dynamic_model.predict_proba(input_data)[0]

             confidence = np.max(probabilities)
             gesture = dynamic_encoder.inverse_transform([prediction])[0]

             if confidence > 0.8:
                mapper.trigger(gesture)

             sequence.clear()

    # ---- Else → Static ----
           else:
            input_static = np.array(landmarks).reshape(1, -1)

            prediction = static_model.predict(input_static)[0]
            probabilities = static_model.predict_proba(input_static)[0]

            confidence = np.max(probabilities)
            gesture = static_encoder.inverse_transform([prediction])[0]

            if confidence > 0.9:   # slightly higher threshold for static
                 mapper.trigger(gesture)


        _, buffer = cv2.imencode(".jpg", frame)
        frame_bytes = buffer.tobytes()

        yield (b"--frame\r\n"
               b"Content-Type: image/jpeg\r\n\r\n" + frame_bytes + b"\r\n")


@app.route("/video_feed")
def video_feed():
    return Response(generate_frames(),
                    mimetype="multipart/x-mixed-replace; boundary=frame")


# 🔹 Gesture Status API
@app.route("/gesture_status")
def gesture_status():
    return jsonify({
        "gesture": current_gesture,
        "confidence": current_confidence
    })


if __name__ == "__main__":
    app.run(debug=True)
