import librosa
import numpy as np
from sklearn.ensemble import RandomForestClassifier
import joblib
import os

def extract_features(audio_path):
    """Extract MFCCs, Chroma, and Mel features for ML."""
    y, sr = librosa.load(audio_path)
    
    mfccs = np.mean(librosa.feature.mfcc(y=y, sr=sr, n_mfcc=40).T, axis=0)
    chroma = np.mean(librosa.feature.chroma_stft(y=y, sr=sr).T, axis=0)
    mel = np.mean(librosa.feature.melspectrogram(y=y, sr=sr).T, axis=0)
    
    return np.hstack([mfccs, chroma, mel])

def train_dummy_model():
    """Create a synthesized model for demonstration."""
    # Features: [MFCCs(40), Chroma(12), Mel(128)] = 180 total
    X = []
    y = []
    
    # Synthesize "Confident" samples (Label 1)
    for _ in range(50):
        confident_sample = np.random.normal(0.5, 0.1, 180)
        X.append(confident_sample)
        y.append(1)
        
    # Synthesize "Anxious" samples (Label 0)
    for _ in range(50):
        anxious_sample = np.random.normal(0.2, 0.1, 180)
        X.append(anxious_sample)
        y.append(0)
        
    model = RandomForestClassifier(n_estimators=100)
    model.fit(X, y)
    
    # Ensure directory exists
    if not os.path.exists('models'):
        os.makedirs('models')
        
    joblib.dump(model, 'models/confidence_model.pkl')
    print("Confidence model trained and saved.")

if __name__ == "__main__":
    train_dummy_model()
