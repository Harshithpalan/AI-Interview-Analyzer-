import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Mic, Square, Loader2, Play, Trash2, Video, VideoOff, Camera, Waves, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Webcam from 'react-webcam';
import { useAuth } from '../context/AuthContext';
import { analyzeInterview } from '../api';

const AudioRecorder = ({ onAnalysisComplete }) => {
    const { user } = useAuth();
    const [isRecording, setIsRecording] = useState(false);
    const [isAnalyzing, setIsAnalyzing] = useState(false);
    const [showWebcam, setShowWebcam] = useState(true);
    const [audioURL, setAudioURL] = useState(null);
    const [timer, setTimer] = useState(0);
    const [lastSnapshot, setLastSnapshot] = useState(null);

    const mediaRecorderRef = useRef(null);
    const timerRef = useRef(null);
    const chunksRef = useRef([]);
    const webcamRef = useRef(null);
    const snapshotIntervalRef = useRef(null);

    useEffect(() => {
        return () => {
            if (timerRef.current) clearInterval(timerRef.current);
            if (snapshotIntervalRef.current) clearInterval(snapshotIntervalRef.current);
        };
    }, []);

    const captureSnapshot = useCallback(() => {
        if (webcamRef.current) {
            const imageSrc = webcamRef.current.getScreenshot();
            if (imageSrc) {
                setLastSnapshot(imageSrc);
            }
        }
    }, [webcamRef]);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            mediaRecorderRef.current = new MediaRecorder(stream);
            chunksRef.current = [];

            mediaRecorderRef.current.ondataavailable = (e) => {
                if (e.data.size > 0) chunksRef.current.push(e.data);
            };

            mediaRecorderRef.current.onstop = () => {
                const audioBlob = new Blob(chunksRef.current, { type: 'audio/wav' });
                const url = URL.createObjectURL(audioBlob);
                setAudioURL(url);
                analyzeAudio(audioBlob);
            };

            mediaRecorderRef.current.start();
            setIsRecording(true);
            setTimer(0);
            setLastSnapshot(null);

            timerRef.current = setInterval(() => {
                setTimer((prev) => prev + 1);
            }, 1000);

            if (showWebcam) {
                snapshotIntervalRef.current = setInterval(captureSnapshot, 3000);
            }
        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Could not access microphone. Please check permissions.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current && isRecording) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
            clearInterval(timerRef.current);
            clearInterval(snapshotIntervalRef.current);
        }
    };

    const analyzeAudio = async (blob) => {
        setIsAnalyzing(true);
        try {
            let imageBlob = null;
            if (lastSnapshot) {
                const res = await fetch(lastSnapshot);
                imageBlob = await res.blob();
            }

            const data = await analyzeInterview(blob, imageBlob, user?.username);
            if (data.error) throw new Error(data.error);

            onAnalysisComplete(data);
        } catch (err) {
            console.error("Analysis failed:", err);
        } finally {
            setIsAnalyzing(false);
        }
    };

    const formatTime = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="premium-card p-12 lg:p-16 border-white/10 mx-auto max-w-6xl mt-12 group">
            {/* Subtle inner glow */}
            <div className="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 -z-10" />

            <div className={`grid ${showWebcam ? 'lg:grid-cols-2' : 'grid-cols-1'} gap-16 items-center`}>

                {/* Left: Controls */}
                <div className="flex flex-col justify-center text-center lg:text-left items-center lg:items-start order-2 lg:order-1">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="mb-12"
                    >
                        <h3 className="text-4xl md:text-5xl font-black text-white mb-4 italic tracking-tighter">
                            Quantum <span className="text-primary not-italic">Session</span>
                        </h3>
                        <p className="text-zinc-500 font-medium text-lg max-w-sm leading-relaxed">
                            Initialize your biometric profile. Our neural engine will map your physiological resonance in real-time.
                        </p>
                    </motion.div>

                    <div className="relative group mb-12">
                        {/* High-fidelity scanning rings */}
                        <AnimatePresence>
                            {isRecording && (
                                <>
                                    <motion.div
                                        initial={{ rotate: 0 }}
                                        animate={{ rotate: 360 }}
                                        transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
                                        className="absolute -inset-8 border border-primary/20 rounded-full border-dashed"
                                    />
                                    <motion.div
                                        initial={{ scale: 0.8, opacity: 0 }}
                                        animate={{ scale: [1, 1.5, 1], opacity: [0, 0.3, 0] }}
                                        transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                                        className="absolute inset-0 rounded-full bg-primary/20 blur-xl -z-10"
                                    />
                                </>
                            )}
                        </AnimatePresence>

                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={isRecording ? stopRecording : startRecording}
                            disabled={isAnalyzing}
                            className={`relative z-10 w-40 h-40 rounded-full flex items-center justify-center transition-all duration-700 shadow-[0_0_50px_rgba(0,0,0,0.5)] ${isRecording
                                ? 'bg-secondary ring-[12px] ring-secondary/10'
                                : 'bg-primary ring-[12px] ring-primary/10 group-hover:ring-primary/20'
                                }`}
                        >
                            <div className="absolute inset-0 rounded-full bg-inherit animate-pulse opacity-50" />
                            {isRecording ? (
                                <Square className="w-16 h-16 text-white" />
                            ) : (
                                <Mic className="w-16 h-16 text-white" />
                            )}
                        </motion.button>
                    </div>

                    <div className="mb-12 w-full">
                        <div className={`text-8xl font-black mb-6 tracking-tighter transition-all duration-700 ${isRecording ? 'text-white' : 'text-zinc-800'}`}>
                            {formatTime(timer)}
                        </div>

                        <div className="flex flex-col items-center lg:items-start gap-4">
                            <AnimatePresence mode="wait">
                                {isRecording ? (
                                    <motion.div
                                        key="live"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="flex items-center gap-3"
                                    >
                                        <div className="flex gap-1.5 h-6 items-center">
                                            {[1, 2, 3, 4, 5, 6].map(i => (
                                                <motion.div
                                                    key={i}
                                                    animate={{ height: ['30%', '100%', '30%'] }}
                                                    transition={{ repeat: Infinity, duration: 0.5 + i * 0.1, ease: 'easeInOut' }}
                                                    className="w-2 bg-primary rounded-full shadow-[0_0_15px_rgba(242,87,43,0.5)]"
                                                />
                                            ))}
                                        </div>
                                        <span className="text-xs font-black uppercase tracking-[0.3em] text-primary animate-pulse">Neural Mapping Active</span>
                                    </motion.div>
                                ) : (
                                    <motion.span
                                        key="ready"
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="text-xs font-black uppercase tracking-[0.3em] text-zinc-600"
                                    >
                                        {isAnalyzing ? "Synthesizing Vocal Artifacts..." : "Awaiting Command"}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </div>
                    </div>

                    <div className="flex gap-6">
                        <button
                            onClick={() => setShowWebcam(!showWebcam)}
                            className="btn-outline border-none bg-white/[0.03] hover:bg-white/[0.07] px-8"
                        >
                            {showWebcam ? <VideoOff size={20} className="text-primary" /> : <Video size={20} className="text-primary" />}
                        </button>
                    </div>
                </div>

                {/* Right: Vision Feed */}
                {showWebcam && (
                    <div className="relative group order-1 lg:order-2">
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            className="relative h-[500px] w-full lg:w-[450px] overflow-hidden rounded-[3rem] border border-white/5 shadow-2xl"
                        >
                            <Webcam
                                audio={false}
                                ref={webcamRef}
                                screenshotFormat="image/jpeg"
                                className="w-full h-full object-cover scale-x-[-1] opacity-60 grayscale-[0.3] group-hover:grayscale-0 transition-all duration-1000"
                            />

                            {/* Decorative Frame */}
                            <div className="absolute inset-0 border-[20px] border-black/20 pointer-events-none" />
                            <div className="absolute top-0 left-0 w-20 h-20 border-t-2 border-l-2 border-primary/40 m-8" />
                            <div className="absolute bottom-0 right-0 w-20 h-20 border-b-2 border-r-2 border-primary/40 m-8" />

                            {!isRecording && !isAnalyzing && (
                                <div className="absolute inset-0 bg-[#0a0a0a]/80 backdrop-blur-xl flex flex-col items-center justify-center text-center p-12">
                                    <motion.div
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ repeat: Infinity, duration: 4 }}
                                        className="w-24 h-24 rounded-[2rem] bg-primary/10 flex items-center justify-center mb-8 border border-primary/20 shadow-2xl shadow-primary/10"
                                    >
                                        <Camera className="text-primary" size={40} />
                                    </motion.div>
                                    <h4 className="text-2xl font-black text-white mb-4 italic">Biometric Feed</h4>
                                    <p className="text-zinc-500 font-medium leading-relaxed">Activate session to begin spatial mapping and emotional resonance tracking.</p>
                                </div>
                            )}

                            {isRecording && (
                                <div className="absolute top-10 left-10 flex items-center gap-4 bg-black/60 backdrop-blur-3xl border border-white/10 px-6 py-3 rounded-2xl shadow-2xl">
                                    <div className="relative flex h-3 w-3">
                                        <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary/40 opacity-75"></span>
                                        <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                                    </div>
                                    <span className="text-[10px] font-black tracking-[0.3em] uppercase text-white">Neural Scan In Progress</span>
                                </div>
                            )}
                        </motion.div>
                    </div>
                )}
            </div>

            <AnimatePresence>
                {isAnalyzing && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        className="mt-16 p-12 glass-card border-primary/20 flex flex-col items-center gap-8 text-center relative overflow-hidden"
                    >
                        <motion.div
                            className="absolute inset-0 bg-primary/5 -z-10"
                            animate={{ opacity: [0.1, 0.3, 0.1] }}
                            transition={{ repeat: Infinity, duration: 2 }}
                        />
                        <div className="relative">
                            <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full" />
                            <Loader2 className="text-primary animate-spin relative z-10" size={64} />
                        </div>
                        <div className="space-y-4">
                            <h4 className="text-2xl font-black text-white">Synthesizing Artifacts</h4>
                            <div className="flex gap-1 justify-center">
                                {[1, 2, 3].map(i => (
                                    <motion.div
                                        key={i}
                                        animate={{ opacity: [0.2, 1, 0.2] }}
                                        transition={{ repeat: Infinity, duration: 1, delay: i * 0.2 }}
                                        className="w-2 h-2 rounded-full bg-primary"
                                    />
                                ))}
                            </div>
                            <p className="text-zinc-500 font-medium uppercase tracking-widest text-[10px]">Filtering Semantics • Analyzing Composure • Mapping Peaks</p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {audioURL && !isRecording && !isAnalyzing && (
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-16 p-10 glass-card border-white/5 flex flex-wrap items-center justify-between gap-10"
                >
                    <div className="flex items-center gap-8">
                        <div className="w-16 h-16 rounded-[1.5rem] bg-emerald-500/10 flex items-center justify-center text-emerald-500 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
                            <Play size={28} fill="currentColor" />
                        </div>
                        <div>
                            <span className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.2em] block mb-2">Aural Memory Buffer</span>
                            <audio src={audioURL} controls className="h-10 brightness-110 contrast-125 opacity-80" />
                        </div>
                    </div>
                    <button
                        className="p-4 text-zinc-600 hover:text-rose-500 transition-all bg-white/[0.03] rounded-2xl border border-white/5 hover:bg-white/[0.07] hover:scale-110 active:scale-95"
                        onClick={() => { setAudioURL(null); setTimer(0); }}
                        title="Purge Archive"
                    >
                        <Trash2 size={24} />
                    </button>
                </motion.div>
            )}
        </div>
    );
};

export default AudioRecorder;
