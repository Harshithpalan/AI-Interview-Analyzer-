import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Header from './components/Header';
import AudioRecorder from './components/AudioRecorder';
import Dashboard from './components/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import History from './pages/History';
import { Sparkles, Target, Zap, ShieldCheck, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return null;
  return user ? children : <Navigate to="/login" />;
};

function AppContent() {
  const [analysisResult, setAnalysisResult] = useState(null);

  const handleAnalysisComplete = (result) => {
    setAnalysisResult(result);
    // Smooth scroll to results
    setTimeout(() => {
      document.getElementById('results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  return (
    <div className="relative min-h-screen">
      {/* Cinematic Background */}
      <div className="nebula-container">
        <div className="blob-1 nebula-blob"></div>
        <div className="blob-2 nebula-blob"></div>
        <div className="blob-3 nebula-blob"></div>
        <div className="starfield"></div>
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-8 pb-32">
        <Header />

        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          <Route path="/" element={
            <main className="space-y-32">
              <section className="pt-8 text-center space-y-12">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                  className="space-y-6"
                >
                  <div className="inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-primary/5 border border-primary/10 text-primary text-[10px] font-black uppercase tracking-[0.25em] shadow-xl shadow-primary/5">
                    <Brain size={14} className="animate-pulse" />
                    LUMINARY AI v3.0 ALPHA
                  </div>
                  <h1 className="text-7xl md:text-9xl font-black text-white tracking-tighter leading-[0.95] font-serif italic">
                    Unleash Your <br />
                    <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400 not-italic">Full Potential</span>
                  </h1>
                  <p className="text-zinc-500 text-xl max-w-2xl mx-auto leading-relaxed font-medium">
                    Master your communication with biometric composure analysis, semantic sentiment mapping, and high-fidelity ML scoring.
                  </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-8 pt-12">
                  {[
                    { icon: Sparkles, title: "Neural Resonance", desc: "Real-time mapping of cognitive composure and vocal stability." },
                    { icon: Target, title: "Semantic Precision", desc: "Deep linguistic analysis to ensure message clarity and impact." },
                    { icon: Zap, title: "Quantum Feedback", desc: "Micro-second latency scoring with predictive ML modeling." }
                  ].map((feature, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 + i * 0.1 }}
                      className="glass-card p-8 text-left group hover:border-primary/30 transition-all duration-500"
                    >
                      <div className="w-12 h-12 rounded-xl bg-primary/5 flex items-center justify-center text-primary mb-6 group-hover:bg-primary group-hover:text-white transition-all duration-500">
                        <feature.icon size={24} />
                      </div>
                      <h4 className="text-xl font-black text-white mb-2 italic tracking-tight">{feature.title}</h4>
                      <p className="text-zinc-500 text-sm font-medium leading-relaxed">{feature.desc}</p>
                    </motion.div>
                  ))}
                </div>

                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <AudioRecorder onAnalysisComplete={handleAnalysisComplete} />
                </motion.div>
              </section>

              {analysisResult && (
                <section id="results" className="pt-12">
                  <div className="flex items-center gap-6 mb-12">
                    <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent to-white/10"></div>
                    <div className="flex items-center gap-3">
                      <h2 className="text-3xl font-black text-white">Diagnostic Output</h2>
                      <div className="px-3 py-1 bg-accent/20 text-accent rounded-lg text-[10px] font-black uppercase tracking-widest">Live Result</div>
                    </div>
                    <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent to-white/10"></div>
                  </div>

                  <Dashboard data={analysisResult} />
                </section>
              )}
            </main>
          } />

          <Route path="/history" element={
            <PrivateRoute>
              <History />
            </PrivateRoute>
          } />
        </Routes>

        <footer className="mt-32 pt-12 border-t border-white/5 text-center px-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
              <Sparkles className="text-primary" size={16} />
            </div>
            <span className="font-black text-sm tracking-tighter">Interview <span className="text-primary">Master</span> v2.0</span>
          </div>
          <p className="text-slate-600 text-xs font-bold uppercase tracking-widest leading-loose">
            Powered by Advanced Natural Language Processing & Visual Biometrics <br />
            © 2026 AI-Interview-Analyzer. All rights reserved.
          </p>
        </footer>
      </div>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
