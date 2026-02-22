import React, { useState, useEffect } from 'react';
import {
    XAxis, YAxis, CartesianGrid, Tooltip,
    ResponsiveContainer, AreaChart, Area
} from 'recharts';
import { History as HistoryIcon, TrendingUp, Calendar, ArrowRight, BarChart2, Activity, Zap, MessageSquare, Brain } from 'lucide-react';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useAuth } from '../context/AuthContext';
import { fetchHistory as fetchHistoryApi } from '../api';

const History = () => {
    const { user } = useAuth();
    const [history, setHistory] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user) {
            fetchHistory();
        }
    }, [user]);

    const fetchHistory = async () => {
        try {
            const data = await fetchHistoryApi(user.username);
            setHistory(data);
        } catch (error) {
            console.error('Failed to fetch history from backend:', error);
        } finally {
            setLoading(false);
        }
    };

    const chartData = [...history].reverse().map(item => ({
        date: format(new Date(item.timestamp), 'MMM dd'),
        score: item.final_score
    }));

    if (loading) return (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
            <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
            <p className="text-slate-500 font-bold uppercase tracking-widest text-xs">Accessing Records...</p>
        </div>
    );

    return (
        <div className="max-w-7xl mx-auto px-8 py-20 space-y-24">
            <header className="flex flex-col lg:flex-row lg:items-center justify-between gap-12 relative">
                <div className="relative z-10">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="flex items-center gap-4 mb-6"
                    >
                        <div className="p-3 bg-primary/10 rounded-2xl text-primary border border-primary/20 shadow-2xl shadow-primary/10">
                            <Brain size={24} />
                        </div>
                        <h2 className="text-xs font-black text-primary uppercase tracking-[0.4em]">Luminary Archive</h2>
                    </motion.div>
                    <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter italic">
                        Session <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-orange-400 not-italic">Chronicles</span>
                    </h1>
                    <p className="text-zinc-500 font-medium text-xl max-w-xl mt-6 leading-relaxed">
                        A high-fidelity longitudinal study of your communication evolution and physiological composure markers.
                    </p>
                </div>

                {history.length > 0 && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass-card px-10 py-8 flex gap-12 items-center border-white/5 shadow-2xl"
                    >
                        <div>
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">Success Index</p>
                            <p className="text-4xl font-black text-white tracking-tighter italic">{Math.round(history.reduce((a, b) => a + b.final_score, 0) / history.length)}%</p>
                        </div>
                        <div className="w-[1px] h-12 bg-white/10"></div>
                        <div>
                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">Engagements</p>
                            <p className="text-4xl font-black text-white tracking-tighter italic">{history.length}</p>
                        </div>
                    </motion.div>
                )}
            </header>

            {history.length > 0 ? (
                <div className="grid lg:grid-cols-3 gap-12">

                    {/* Progress Chart */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        className="lg:col-span-3 premium-card p-12 lg:p-16 border-white/5 overflow-hidden relative"
                    >
                        <div className="absolute inset-0 bg-primary/5 -z-10 blur-3xl opacity-30" />

                        <div className="flex items-center justify-between mb-12">
                            <h3 className="text-3xl font-black text-white italic tracking-tight flex items-center gap-4">
                                <TrendingUp size={32} className="text-primary" />
                                Growth Trajectory
                            </h3>
                            <div className="flex items-center gap-3 px-6 py-2 bg-white/[0.03] border border-white/10 rounded-2xl text-[10px] font-black text-zinc-400 uppercase tracking-[0.2em]">
                                <div className="w-2.5 h-2.5 rounded-full bg-primary shadow-[0_0_15px_rgba(242,87,43,0.8)] animate-pulse"></div>
                                Luminary Score Calibration
                            </div>
                        </div>

                        <div className="h-[400px] w-full mt-8">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData}>
                                    <defs>
                                        <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                                            <stop offset="5%" stopColor="#f2572b" stopOpacity={0.4} />
                                            <stop offset="95%" stopColor="#f2572b" stopOpacity={0} />
                                        </linearGradient>
                                    </defs>
                                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.02)" vertical={false} />
                                    <XAxis
                                        dataKey="date"
                                        stroke="#52525b"
                                        fontSize={10}
                                        fontWeight={900}
                                        axisLine={false}
                                        tickLine={false}
                                        dy={20}
                                    />
                                    <YAxis
                                        domain={[0, 100]}
                                        stroke="#52525b"
                                        fontSize={10}
                                        fontWeight={900}
                                        axisLine={false}
                                        tickLine={false}
                                    />
                                    <Tooltip
                                        contentStyle={{ background: '#0a0a0a', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '2rem', boxShadow: '0 40px 100px rgba(0,0,0,0.8)', padding: '20px' }}
                                        itemStyle={{ color: '#f2572b', fontWeight: 900, fontSize: '14px', textTransform: 'uppercase', letterSpacing: '0.1em' }}
                                        cursor={{ stroke: 'rgba(242, 87, 43, 0.2)', strokeWidth: 2 }}
                                    />
                                    <Area
                                        type="monotone"
                                        dataKey="score"
                                        stroke="#f2572b"
                                        strokeWidth={6}
                                        fillOpacity={1}
                                        fill="url(#colorScore)"
                                        animationDuration={3000}
                                    />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    {/* Detailed List */}
                    <div className="lg:col-span-3 space-y-10">
                        <div className="flex items-center gap-6">
                            <h3 className="text-2xl font-black text-white italic tracking-tight">Artifact Collection</h3>
                            <div className="h-[1px] flex-1 bg-gradient-to-r from-white/10 to-transparent"></div>
                        </div>

                        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-10">
                            {history.map((item, idx) => (
                                <motion.div
                                    key={item.id}
                                    initial={{ opacity: 0, y: 40 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 0.8, delay: idx * 0.1 }}
                                    className="premium-card p-10 space-y-8"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-4">
                                            <div className="p-3 bg-white/[0.03] rounded-2xl text-zinc-500 group-hover:text-primary transition-all duration-500 group-hover:bg-primary/10">
                                                <Calendar size={20} />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em]">Timestamp</span>
                                                <span className="text-sm font-black text-zinc-400 group-hover:text-white transition-colors">{format(new Date(item.timestamp), 'PP')}</span>
                                            </div>
                                        </div>
                                        <div className="text-[10px] font-black text-zinc-600 uppercase tracking-widest px-3 py-1 bg-white/[0.03] rounded-full border border-white/5">#{item.id}</div>
                                    </div>

                                    <div className="flex items-end justify-between">
                                        <div>
                                            <p className="text-[10px] font-black text-zinc-500 uppercase tracking-[0.2em] mb-2">Neural Index</p>
                                            <p className="text-6xl font-black text-white leading-none tracking-tighter italic">
                                                {Math.round(item.final_score)}
                                                <span className="text-lg font-black text-primary ml-1 not-italic">%</span>
                                            </p>
                                        </div>
                                        <div className="flex gap-1.5 items-center pb-2">
                                            {[1, 2, 3, 4, 5].map(i => (
                                                <motion.div
                                                    key={i}
                                                    initial={{ height: 4 }}
                                                    whileInView={{ height: i * 4 + 4 }}
                                                    className={`w-1.5 rounded-full transition-all duration-1000 ${i <= (item.final_score / 20) ? 'bg-primary shadow-[0_0_10px_rgba(242,87,43,0.5)]' : 'bg-white/5'}`}
                                                />
                                            ))}
                                        </div>
                                    </div>

                                    <div className="pt-8 border-t border-white/5 flex gap-6">
                                        <div className="flex-1 text-center group/metric">
                                            <Activity className="mx-auto mb-2 text-zinc-600 group-hover/metric:text-primary transition-colors" size={16} />
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{item.metrics.speaking_speed.wpm} <span className="text-zinc-600 block text-[8px]">WPM</span></p>
                                        </div>
                                        <div className="w-[1px] h-10 bg-white/5"></div>
                                        <div className="flex-1 text-center group/metric">
                                            <MessageSquare className="mx-auto mb-2 text-zinc-600 group-hover/metric:text-primary transition-colors" size={16} />
                                            <p className="text-[10px] font-black text-zinc-400 uppercase tracking-widest">{item.metrics.sentiment.label} <span className="text-zinc-600 block text-[8px]">EMOTION</span></p>
                                        </div>
                                        <div className="w-[1px] h-10 bg-white/5"></div>
                                        <div className="flex-1 text-center group-hover:translate-x-1 transition-transform cursor-pointer">
                                            <ArrowRight className="mx-auto mb-2 text-primary" size={20} />
                                            <p className="text-[8px] font-black text-white tracking-[0.3em] uppercase">VIEW</p>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                </div>
            ) : (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="premium-card p-32 text-center border-white/5 space-y-10"
                >
                    <div className="w-32 h-32 bg-primary/5 rounded-[3rem] flex items-center justify-center mx-auto text-primary border border-primary/20 shadow-2xl animate-pulse">
                        <BarChart2 size={56} />
                    </div>
                    <div className="space-y-6">
                        <h3 className="text-4xl font-black text-white italic tracking-tight">Records Missing</h3>
                        <p className="text-zinc-500 font-medium text-xl max-w-sm mx-auto leading-relaxed">Your neural archive is awaiting its first data entry. Initialize a session to begin tracking.</p>
                        <a href="/" className="btn-primary inline-flex items-center gap-3 py-5 px-12 mx-auto uppercase">
                            Initialize Luminary stage
                            <ArrowRight size={20} />
                        </a>
                    </div>
                </motion.div>
            )}
        </div>
    );
};

export default History;
