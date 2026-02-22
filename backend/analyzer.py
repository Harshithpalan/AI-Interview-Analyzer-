import librosa
import numpy as np
import speech_recognition as sr
from textblob import TextBlob
import joblib
import cv2
try:
    from fer import FER
    emotion_detector = FER(mtcnn=True)
except (ImportError, ModuleNotFoundError):
    print("FER or TensorFlow not found. Emotion detection will be disabled.")
    emotion_detector = None
import nltk
from nltk.tokenize import word_tokenize
import os
import google.generativeai as genai

# Replace with your actual Gemini API Key
GEMINI_API_KEY = os.environ.get("GEMINI_API_KEY", "AIzaSyBUUjiMbyotI-Q_jooaPzuITyZynuELUkw")
genai.configure(api_key=GEMINI_API_KEY)

class InterviewAnalyzer:
    def __init__(self):
        self.recognizer = sr.Recognizer()
        self.filler_words = ["um", "uh", "like", "you know", "actually", "basically"]
        
        # Load ML model
        self.ml_model = None
        if os.path.exists('models/confidence_model.pkl'):
            self.ml_model = joblib.load('models/confidence_model.pkl')
            
        # Initialize Gemini Model
        try:
            self.gemini = genai.GenerativeModel('gemini-1.5-flash')
        except Exception as e:
            print(f"Failed to initialize Gemini: {e}")
            self.gemini = None

    def transcribe_audio(self, audio_path):
        """Convert audio file to text using Google Speech Recognition."""
        with sr.AudioFile(audio_path) as source:
            audio_data = self.recognizer.record(source)
            try:
                text = self.recognizer.recognize_google(audio_data)
                return text
            except sr.UnknownValueError:
                return ""
            except sr.RequestError as e:
                print(f"Could not request results from Google Speech Recognition service; {e}")
                return ""

    def analyze_filler_words(self, text):
        """Detect and count filler words."""
        if not text:
            return {"count": 0, "percentage": 0, "detected": []}
        
        tokens = word_tokenize(text.lower())
        total_words = len(tokens)
        detected_fillers = [word for word in tokens if word in self.filler_words]
        
        # Check for multi-word fillers like "you know"
        for i in range(len(tokens) - 1):
            phrase = f"{tokens[i]} {tokens[i+1]}"
            if phrase == "you know":
                detected_fillers.append(phrase)
                total_words -= 1 # adjust total words for multi-word count

        count = len(detected_fillers)
        percentage = (count / total_words * 100) if total_words > 0 else 0
        
        return {
            "count": count,
            "percentage": round(percentage, 2),
            "detected": list(set(detected_fillers))
        }

    def analyze_speaking_speed(self, text, duration):
        """Calculate Words Per Minute (WPM)."""
        if not text or duration <= 0:
            return {"wpm": 0, "feedback": "Too slow"}
        
        tokens = word_tokenize(text)
        wpm = (len(tokens) / duration) * 60
        
        feedback = "Good"
        if wpm < 110:
            feedback = "Too slow"
        elif wpm > 160:
            feedback = "Too fast"
            
        return {"wpm": round(wpm, 2), "feedback": feedback}

    def analyze_confidence(self, audio_path):
        """Analyze voice confidence using ML and pitch/energy variation."""
        try:
            y, sr_rate = librosa.load(audio_path)
            
            # 1. Pitch & Energy Analysis (Heuristic)
            pitches, magnitudes = librosa.piptrack(y=y, sr=sr_rate)
            pitch_values = [pitches[magnitudes[:, t].argmax(), t] for t in range(pitches.shape[1]) if pitches[magnitudes[:, t].argmax(), t] > 0]
            pitch_std = np.std(pitch_values) if pitch_values else 0
            
            rms = librosa.feature.rms(y=y)[0]
            energy_std = np.std(rms)
            
            # 2. ML Prediction
            ml_score = 50
            if self.ml_model:
                try:
                    mfccs = np.mean(librosa.feature.mfcc(y=y, sr=sr_rate, n_mfcc=40).T, axis=0)
                    chroma = np.mean(librosa.feature.chroma_stft(y=y, sr=sr_rate).T, axis=0)
                    mel = np.mean(librosa.feature.melspectrogram(y=y, sr=sr_rate).T, axis=0)
                    features = np.hstack([mfccs, chroma, mel]).reshape(1, -1)
                    
                    # Probability of class 1 (Confident)
                    ml_score = self.ml_model.predict_proba(features)[0][1] * 100
                except Exception as e:
                    print(f"ML Prediction error: {e}")

            # Combined score (Weighted)
            heuristic_score = min(100, max(0, (pitch_std / 50) * 50 + (energy_std / 0.1) * 50))
            confidence_score = (ml_score * 0.7) + (heuristic_score * 0.3)
            
            return {
                "score": round(confidence_score, 2),
                "pitch_variation": round(pitch_std, 2),
                "ml_prediction": round(ml_score, 2)
            }
        except Exception as e:
            print(f"Error in confidence analysis: {e}")
            return {"score": 0, "feedback": str(e)}

    def analyze_emotions(self, frame):
        """Analyze facial emotions using OpenCV and FER (if available)."""
        if not emotion_detector:
            return {}
        try:
            # FER returns a list of dictionaries (one for each face detected)
            results = emotion_detector.detect_emotions(frame)
            if results:
                # Get the strongest emotion of the first face
                emotions = results[0]["emotions"]
                return emotions
            return {}
        except Exception as e:
            print(f"Emotion detection error: {e}")
            return {}

    def analyze_sentiment(self, text):
        """Analyze transcript sentiment."""
        if not text:
            return {"score": 0, "label": "Neutral"}
        
        analysis = TextBlob(text)
        polarity = analysis.sentiment.polarity
        
        label = "Neutral"
        if polarity > 0.1:
            label = "Positive"
        elif polarity < -0.1:
            label = "Negative"
            
        return {"score": round(polarity, 2), "label": label}

    def calculate_final_score(self, filler_data, speed_data, confidence_data, sentiment_data):
        """Calculate weighted performance score."""
        # 1. Filler words (30%): Fewer fillers = higher score
        filler_score = max(0, 100 - (filler_data["percentage"] * 5)) # 20% filler = 0 score
        
        # 2. Speaking speed (30%): "Good" = 100, others lower
        speed_score = 100 if speed_data["feedback"] == "Good" else 60
        
        # 3. Confidence (30%)
        confidence_score = confidence_data["score"]
        
        # 4. Sentiment (10%)
        sentiment_score = (sentiment_data["score"] + 1) * 50 # Normalize -1 to 1 to 0 to 100
        
        final_score = (filler_score * 0.3) + (speed_score * 0.3) + (confidence_score * 0.3) + (sentiment_score * 0.1)
        
        return round(final_score, 2)

    def generate_feedback(self, filler_data, speed_data, confidence_data, sentiment_data, transcript):
        """Provide improvement suggestions using Gemini for context-aware feedback."""
        
        base_suggestions = []
        
        if filler_data["percentage"] > 5:
            base_suggestions.append(f"Try to reduce filler words like {', '.join(filler_data['detected'])}. Practice pausing instead.")
            
        if speed_data["feedback"] == "Too slow":
            base_suggestions.append("You are speaking a bit slowly. Try to increase your pace to maintain engagement.")
        elif speed_data["feedback"] == "Too fast":
            base_suggestions.append("You are speaking very fast. Try to slow down and articulate your words more clearly.")
            
        if confidence_data["score"] < 60:
            base_suggestions.append("Your voice seems a bit monotone or low energy. Try to vary your pitch and energy to sound more confident.")
            
        if sentiment_data["label"] == "Negative":
            base_suggestions.append("The tone of your response seems slightly negative. Focus on highlighting positive experiences and outcomes.")

        if self.gemini and transcript:
            try:
                prompt = f"""
                Analyze the following interview transcript and provide professional, constructive feedback.
                Focus on:
                - Content quality
                - Professionalism
                - Areas of improvement
                
                Transcript: "{transcript}"
                
                Base Metrics Feedback: {", ".join(base_suggestions)}
                
                Provide the feedback as a bulleted list of actionable steps.
                """
                response = self.gemini.generate_content(prompt)
                ai_feedback = response.text.split('\n')
                # Filter out empty lines or markdown markers
                ai_feedback = [line.strip().replace('* ', '').replace('- ', '') for line in ai_feedback if line.strip() and not line.strip().startswith('#')]
                return ai_feedback[:5] # Return top 5 suggestions
            except Exception as e:
                print(f"Gemini feedback error: {e}")
        
        if not base_suggestions:
            base_suggestions.append("Great job! Your communication is clear, confident, and well-paced.")
            
        return base_suggestions
