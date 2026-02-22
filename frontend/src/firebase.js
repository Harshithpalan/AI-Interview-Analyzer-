import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration from the user
const firebaseConfig = {
    apiKey: "AIzaSyCWuoFgQzKw2MA_67HtheWZ_ElvjqQEfUs",
    authDomain: "ai-resume-shortlisting.firebaseapp.com",
    projectId: "ai-resume-shortlisting",
    storageBucket: "ai-resume-shortlisting.firebasestorage.app",
    messagingSenderId: "16121746966",
    appId: "1:16121746966:web:49dcb08dcb982c5356c737"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore
const db = getFirestore(app);

export { db };
