import React from 'react';
import {
    PieChart, Pie, Cell, ResponsiveContainer,
    BarChart, Bar, XAxis, YAxis, Tooltip as RechartsTooltip,
    Legend, PolarGrid, PolarAngleAxis, Radar, RadarChart,
    AreaChart, Area
} from 'recharts';
import {
    TrendingUp, MessageSquare, Zap, AlertTriangle,
    CheckCircle2, Info, Timer, BrainCircuit, Activity,
    Quote, Heart, Target, Sparkles
} from 'lucide-react';
import { motion } from 'framer-motion';

const CircularProgress = ({ score, size = 240, strokeWidth = 20 }) => {
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;
    const offset = circumference - (score / 100) * circumference;

    const getColor = (s) => {
        if (s >= 80) return '#f2572b'; // primary
        if (s >= 60) return '#fb923c'; // warning
        return '#ef4444'; // secondary/danger
    };

    return (
        <div className="relative flex items-center justify-center p-8" style={{ width: size, height: size }}>
            {/* Outer Glow */}
            <div className="absolute inset-0 bg-primary/20 blur-[80px] rounded-full opacity-30 animate-pulse" />

            <svg width={size} height={size} className="transform -rotate-90 relative z-10">
                {/* Background circle */}
                <circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke="currentColor"
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    className="text-white/[0.03]"
                />
                {/* Progress circle */}
                <motion.circle
                    cx={size / 2}
                    cy={size / 2}
                    r={radius}
                    stroke={getColor(score)}
                    strokeWidth={strokeWidth}
                    fill="transparent"
                    strokeDasharray={circumference}
                    initial={{ strokeDashoffset: circumference }}
                    animate={{ strokeDashoffset: offset }}
                    transition={{ duration: 2.5, ease: [0.16, 1, 0.3, 1] }}
                    strokeLinecap="round"
                    className="drop-shadow-[0_0_20px_rgba(242,87,43,0.5)]"
                />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center z-20">
                <motion.span
                    initial={{ opacity: 0, scale: 0.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.8, duration: 1 }}
                    className="text-7xl font-black text-white italic tracking-tighter"
                >
                    {score}
                </motion.span>
                <div className="flex flex-col items-center">
                    <span className="text-[10px] font-black text-primary uppercase tracking-[0.4em] mb-1">Neural Rank</span>
                    <div className="flex gap-1">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="w-1 h-1 rounded-full bg-primary/40" />
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const Dashboard = ({ data }) => {
    if (!data) return null;

    const { transcript, filler_words, speaking_speed, confidence, sentiment, final_score, feedback, emotions } = data;

    const emotionData = emotions ? Object.entries(emotions).map(([name, value]) => ({
        name: name.toUpperCase(),
        value: Math.round(value * 100)
    })).sort((a, b) => b.value - a.value).slice(0, 4) : [];

    const metrics = [
        { label: 'Flow Velocity', value: `${speaking_speed.wpm} WPM`, status: speaking_speed.feedback, icon: <Timer />, color: 'primary' },
        { label: 'Neural Static', value: `${filler_words.percentage}%`, status: filler_words.count + ' artifacts', icon: <Activity />, color: 'primary' },
        { label: 'AI Resonance', value: `${confidence.score}%`, status: 'Synaptic Match', icon: <Zap />, color: 'primary' },
        { label: 'Emotional Bias', value: sentiment.label, status: 'Polarity: ' + sentiment.score, icon: <Heart />, color: 'primary' }
    ];

    return (
        <div className="space-y-16 mt-24 animate-in fade-in slide-in-from-bottom-12 duration-1000">

            <div className="grid lg:grid-cols-3 gap-12">

                {/* Score Card */}
                <motion.div
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="premium-card p-12 lg:p-16 flex flex-col items-center justify-center text-center space-y-10 lg:col-span-1 border-primary/20 bg-primary/[0.02]"
                >
                    <div className="space-y-4">
                        <div className="flex items-center justify-center gap-3">
                            <Sparkles className="text-primary animate-pulse" size={20} />
                            <h3 className="text-xs font-black text-primary uppercase tracking-[0.4em] py-1">Synthesis Result</h3>
                        </div>
                        <h4 className="text-3xl font-black text-white italic">Luminary evaluation</h4>
                    </div>

                    <CircularProgress score={final_score} />

                    <div className="pt-4 flex flex-col items-center gap-8 w-full group">
                        <div className="w-full h-1 bg-white/[0.03] rounded-full overflow-hidden border border-white/5 relative">
                            <motion.div
                                initial={{ width: 0 }}
                                animate={{ width: `${final_score}%` }}
                                transition={{ duration: 3, delay: 0.5 }}
                                className="h-full bg-gradient-to-r from-primary to-orange-400 shadow-[0_0_20px_rgba(242,87,43,0.5)]"
                            />
                        </div>
                        <p className="text-zinc-500 font-medium text-lg leading-relaxed italic">
                            "Cognitive patterns indicate a <span className="text-white font-black">{final_score > 70 ? 'Superior' : 'Refining'}</span> alignment with professional benchmarks."
                        </p>
                    </div>
                </motion.div>

                {/* Feature breakdown */}
                <div className="lg:col-span-2 space-y-12">
                    <div className="grid sm:grid-cols-2 gap-8">
                        {metrics.map((m, i) => (
                            <motion.div
                                key={i}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: i * 0.15 }}
                                className="premium-card p-10 border-white/5 flex items-start gap-8 group hover:bg-white/[0.02]"
                            >
                                <div className="p-4 rounded-2xl bg-white/[0.03] text-primary border border-white/10 group-hover:scale-110 transition-transform duration-500 group-hover:shadow-2xl group-hover:shadow-primary/10">
                                    {m.icon}
                                </div>
                                <div className="flex flex-col">
                                    <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em] mb-2">{m.label}</p>
                                    <p className="text-4xl font-black text-white mb-2 tracking-tighter italic">{m.value}</p>
                                    <p className="text-[10px] font-black text-primary uppercase tracking-widest">{m.status}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Emotion Analytics */}
                    {emotionData.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="premium-card p-12 lg:p-16 border-white/5 bg-white/[0.01]"
                        >
                            <div className="flex items-center justify-between mb-12">
                                <div className="space-y-1">
                                    <h3 className="text-2xl font-black text-white italic tracking-tight flex items-center gap-4">
                                        <Activity className="text-primary" size={28} />
                                        Biometric Resonance
                                    </h3>
                                    <p className="text-zinc-600 text-[10px] font-black uppercase tracking-[0.3em]">Temporal Affect Mapping</p>
                                </div>
                            </div>
                            <div className="h-[250px] w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={emotionData} layout="vertical" margin={{ left: 20, right: 40 }}>
                                        <XAxis type="number" hide domain={[0, 100]} />
                                        <YAxis
                                            dataKey="name"
                                            type="category"
                                            stroke="#52525b"
                                            fontSize={10}
                                            fontWeight={900}
                                            width={100}
                                            axisLine={false}
                                            tickLine={false}
                                        />
                                        <RechartsTooltip
                                            cursor={{ fill: 'rgba(255,255,255,0.02)' }}
                                            contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '2rem', padding: '20px', boxShadow: '0 50px 100px rgba(0,0,0,0.8)' }}
                                        />
                                        <Bar dataKey="value" fill="#f2572b" radius={[0, 12, 12, 0]} barSize={32}>
                                            {emotionData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={index === 0 ? '#f2572b' : `rgba(242, 87, 43, ${0.8 - index * 0.15})`} />
                                            ))}
                                        </Bar>
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </motion.div>
                    )}
                </div>
            </div>

            {/* AI Suggestions */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="premium-card p-16 border-white/10 overflow-hidden relative"
            >
                <div className="absolute top-0 right-0 w-96 h-96 bg-primary/5 blur-[120px] -m-20 -z-10" />

                <div className="flex items-start gap-10 mb-16 px-4">
                    <div className="p-5 rounded-[2rem] bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-2xl shadow-emerald-500/10">
                        <Target size={32} />
                    </div>
                    <div>
                        <h3 className="text-4xl font-black text-white italic tracking-tighter mb-2">Tactical Optimizations</h3>
                        <p className="text-zinc-600 font-extrabold uppercase tracking-[0.4em] text-xs">Neural Insights from InterviewML Engine</p>
                    </div>
                </div>

                <div className="grid md:grid-cols-2 gap-10">
                    {feedback.map((item, index) => (
                        <motion.div
                            key={index}
                            whileHover={{ scale: 1.02, x: 5 }}
                            className="flex gap-8 p-10 bg-white/[0.02] border border-white/5 rounded-[2.5rem] hover:bg-white/[0.04] transition-all duration-500 group shadow-2xl"
                        >
                            <div className="mt-1">
                                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                                    <CheckCircle2 size={24} />
                                </div>
                            </div>
                            <p className="text-zinc-400 font-medium text-lg leading-relaxed group-hover:text-white transition-colors">{item}</p>
                        </motion.div>
                    ))}
                </div>
            </motion.div>

            {/* Semantic Transcript */}
            <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                className="premium-card p-16 border-white/5 bg-white/[0.01]"
            >
                <div className="flex items-center gap-8 mb-16">
                    <div className="p-5 rounded-[2rem] bg-primary/10 text-primary border border-primary/20 shadow-2xl shadow-primary/10">
                        <Quote size={32} />
                    </div>
                    <div>
                        <h3 className="text-4xl font-black text-white italic tracking-tighter mb-2">Aural Reconstruction</h3>
                        <p className="text-zinc-600 font-extrabold uppercase tracking-[0.4em] text-xs">Full Semantic Transcript Artifact</p>
                    </div>
                </div>

                <div className="relative">
                    <div className="absolute top-0 left-0 w-16 h-16 border-t-2 border-l-2 border-primary/20 -m-4" />
                    <div className="absolute bottom-0 right-0 w-16 h-16 border-b-2 border-r-2 border-primary/20 -m-4" />

                    <div className="bg-[#050505] border border-white/[0.05] p-16 rounded-[3rem] text-zinc-400 leading-[2.2] text-xl font-medium tracking-wide selection:bg-primary/30 shadow-inner italic">
                        <Sparkles className="inline-block text-primary/40 mr-4 mb-2" size={24} />
                        {transcript || "Neural engine did not identify any reconstructible semantic structures."}
                    </div>
                </div>
            </motion.div>

        </div>
    );
};

const MetricCard = ({ title, value, subtitle, icon, color }) => (
    <div className="glass p-6 border-white/5 flex items-start gap-4 card-hover">
        <div className={`p-3 rounded-xl bg-${color}/10 text-${color}`}>
            {icon}
        </div>
        <div>
            <p className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{title}</p>
            <p className="text-2xl font-black text-white mb-1">{value}</p>
            <p className="text-xs font-semibold text-slate-400">{subtitle}</p>
        </div>
    </div>
);

export default Dashboard;
