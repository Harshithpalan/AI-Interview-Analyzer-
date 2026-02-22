from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
import json
import os
import uuid
import librosa
import numpy as np
import cv2
from datetime import datetime
from analyzer import InterviewAnalyzer
import random
import string

app = Flask(__name__)
CORS(app)
app.config['SECRET_KEY'] = 'dev-secret-key-123'
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///database.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)

# Models
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(80), unique=True, nullable=False)
    password_hash = db.Column(db.String(120), nullable=False)
    interviews = db.relationship('Interview', backref='user', lazy=True)

class Interview(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    transcript = db.Column(db.Text)
    final_score = db.Column(db.Float)
    metrics = db.Column(db.Text) # JSON string
    emotions = db.Column(db.Text) # JSON string
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

with app.app_context():
    db.create_all()

analyzer = InterviewAnalyzer()

@app.route('/')
def health_check():
    return jsonify({"status": "Backend is running", "version": "1.0.0"})

# Auth Routes
@app.route('/register', methods=['POST'])
def register():
    data = request.json
    if User.query.filter_by(username=data['username']).first():
        return jsonify({"error": "Username already exists"}), 400
    
    hashed_pw = generate_password_hash(data['password'])
    new_user = User(username=data['username'], password_hash=hashed_pw)
    db.session.add(new_user)
    db.session.commit()
    return jsonify({"message": "User registered successfully"})

@app.route('/login', methods=['POST'])
def login():
    data = request.json
    user = User.query.filter_by(username=data['username']).first()
    if user and check_password_hash(user.password_hash, data['password']):
        login_user(user)
        return jsonify({"message": "Logged in successfully", "username": user.username})
    return jsonify({"error": "Invalid username or password"}), 401

@app.route('/logout', methods=['POST'])
def logout():
    logout_user()
    return jsonify({"message": "Logged out successfully"})

@app.route('/demo-credentials', methods=['GET'])
def get_demo_credentials():
    # Generate random username and password
    chars = string.ascii_lowercase + string.digits
    rand_suffix = ''.join(random.choice(chars) for _ in range(5))
    username = f"demo_{rand_suffix}"
    
    password = ''.join(random.choice(string.ascii_letters + string.digits) for _ in range(10))
    
    # Register the user
    hashed_pw = generate_password_hash(password)
    new_user = User(username=username, password_hash=hashed_pw)
    db.session.add(new_user)
    db.session.commit()
    
    return jsonify({
        "username": username,
        "password": password
    })

@app.route('/history', methods=['GET'])
def get_history():
    user_id_val = request.args.get('userId')
    
    if current_user and current_user.is_authenticated:
        interviews = Interview.query.filter_by(user_id=current_user.id).order_by(Interview.timestamp.desc()).all()
    elif user_id_val:
        db_user = User.query.filter_by(username=user_id_val).first()
        if db_user:
            interviews = Interview.query.filter_by(user_id=db_user.id).order_by(Interview.timestamp.desc()).all()
        else:
            interviews = []
    else:
        return jsonify({"error": "Unauthorized"}), 401
        
    history = []
    for i in interviews:
        history.append({
            "id": i.id,
            "transcript": i.transcript,
            "final_score": i.final_score,
            "metrics": json.loads(i.metrics) if i.metrics else {},
            "emotions": json.loads(i.emotions) if i.emotions else {},
            "timestamp": i.timestamp.isoformat()
        })
    return jsonify(history)


@app.route('/analyze', methods=['POST'])
def analyze():
    if 'audio' not in request.files:
        return jsonify({"error": "No audio file provided"}), 400
    
    audio_file = request.files['audio']
    if audio_file.filename == '':
        return jsonify({"error": "No selected file"}), 400

    video_frame = request.files.get('image')
    
    filename = secure_filename(f"{uuid.uuid4()}_{audio_file.filename}")
    file_path = os.path.join(UPLOAD_FOLDER, filename)
    audio_file.save(file_path)

    try:
        y, sr_rate = librosa.load(file_path)
        duration = librosa.get_duration(y=y, sr=sr_rate)

        transcript = analyzer.transcribe_audio(file_path)
        filler_data = analyzer.analyze_filler_words(transcript)
        speed_data = analyzer.analyze_speaking_speed(transcript, duration)
        confidence_data = analyzer.analyze_confidence(file_path)
        sentiment_data = analyzer.analyze_sentiment(transcript)
        
        # Real Emotion Detection using OpenCV
        emotion_data = {}
        if video_frame:
            # Convert to OpenCV frame
            file_bytes = np.frombuffer(video_frame.read(), np.uint8)
            img = cv2.imdecode(file_bytes, cv2.IMREAD_COLOR)
            emotion_data = analyzer.analyze_emotions(img)

        final_score = analyzer.calculate_final_score(
            filler_data, speed_data, confidence_data, sentiment_data
        )
        
        feedback = analyzer.generate_feedback(
            filler_data, speed_data, confidence_data, sentiment_data, transcript
        )

        metrics = {
            "filler_words": filler_data,
            "speaking_speed": speed_data,
            "confidence": confidence_data,
            "sentiment": sentiment_data,
        }

        # Save to DB if userId is provided or logged in
        user_id_val = request.form.get('userId')
        
        if user_id_val or (current_user and current_user.is_authenticated):
            # In our case, we'll store the userId string directly in the database.
            # However, the current schema uses an integer for user_id.
            # Let's check if the user exists in our local SQL DB, if not, create a placeholder or use a string-compatible approach.
            # For simplicity in this demo, we'll use the userId from frontend as the primary reference.
            
            # Find or create user in SQL DB to satisfy ForeignKey
            db_user = None
            if current_user and current_user.is_authenticated:
                db_user = current_user
            elif user_id_val:
                db_user = User.query.filter_by(username=user_id_val).first()
                if not db_user:
                    # Create a temporary user entry if it doesn't exist
                    # This is to maintain the relational integrity of the existing schema
                    db_user = User(username=user_id_val, password_hash="external_auth")
                    db_session_add = True
                    db.session.add(db_user)
                    db.session.commit()

            new_interview = Interview(
                user_id=db_user.id if db_user else 0,
                transcript=transcript,
                final_score=final_score,
                metrics=json.dumps(metrics),
                emotions=json.dumps(emotion_data)
            )
            db.session.add(new_interview)
            db.session.commit()

        response = {
            "transcript": transcript,
            "filler_words": filler_data,
            "speaking_speed": speed_data,
            "confidence": confidence_data,
            "sentiment": sentiment_data,
            "final_score": final_score,
            "feedback": feedback,
            "duration": round(duration, 2),
            "emotions": emotion_data
        }

        return jsonify(response)

    except Exception as e:
        print(f"Error during analysis: {e}")
        return jsonify({"error": str(e)}), 500
    finally:
        # Clean up the file
        if os.path.exists(file_path):
            os.remove(file_path)

if __name__ == '__main__':
    app.run(debug=True, port=5000)
