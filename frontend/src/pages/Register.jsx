import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, Loader2, KeyRound, User as UserIcon, Sparkles, Brain } from 'lucide-react';
import { motion } from 'framer-motion';

const Register = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        setError('');
        const result = await register(username, password);
        if (result.success) {
            alert('Registration successful! Please login.');
            navigate('/login');
        } else {
            setError(result.error);
        }
        setIsSubmitting(false);
    };

    return (
        <div className="min-h-[85vh] flex items-center justify-center p-8">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="premium-card p-16 w-full max-w-[500px] border-white/10 shadow-3xl bg-primary/[0.01] relative"
            >
                {/* Visual anchors */}
                <div className="absolute top-0 left-0 w-24 h-24 border-t-2 border-l-2 border-primary/20 -m-4" />
                <div className="absolute bottom-0 right-0 w-24 h-24 border-b-2 border-r-2 border-primary/20 -m-4" />

                <div className="relative">
                    <div className="mb-14 text-center">
                        <motion.div
                            initial={{ y: -20 }}
                            animate={{ y: 0 }}
                            className="w-24 h-24 bg-primary/10 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-primary/20 shadow-2xl shadow-primary/10"
                        >
                            <Brain className="text-primary" size={40} />
                        </motion.div>
                        <h2 className="text-5xl font-black text-white mb-4 italic tracking-tighter">Neural <span className="text-primary not-italic">Profile</span></h2>
                        <p className="text-zinc-500 font-medium text-lg uppercase tracking-[0.2em] text-xs">Initialize Luminary Protocol</p>
                    </div>

                    {error && (
                        <motion.div
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="mb-8 p-6 bg-red-500/5 border border-red-500/20 text-red-400 text-sm rounded-2xl text-center font-black uppercase tracking-widest"
                        >
                            {error}
                        </motion.div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] ml-2">Choose Username</label>
                            <div className="relative group/input">
                                <UserIcon className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within/input:text-primary transition-colors duration-500" size={22} />
                                <input
                                    type="text"
                                    className="w-full bg-white/[0.02] border border-white/5 rounded-3xl py-5 pl-16 pr-6 text-white text-lg placeholder:text-zinc-800 focus:outline-none focus:border-primary/40 focus:bg-primary/[0.02] transition-all duration-500 font-bold tracking-tight shadow-inner"
                                    placeholder="SYNAPTIC_ID"
                                    value={username}
                                    onChange={(e) => setUsername(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-3">
                            <label className="text-[10px] font-black text-zinc-600 uppercase tracking-[0.4em] ml-2">Secure Pass-Key</label>
                            <div className="relative group/input">
                                <KeyRound className="absolute left-6 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within/input:text-primary transition-colors duration-500" size={22} />
                                <input
                                    type="password"
                                    className="w-full bg-white/[0.02] border border-white/5 rounded-3xl py-5 pl-16 pr-6 text-white text-lg placeholder:text-zinc-800 focus:outline-none focus:border-primary/40 focus:bg-primary/[0.02] transition-all duration-500 font-bold tracking-tight shadow-inner"
                                    placeholder="••••••••"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                        </div>

                        <button
                            className="btn-primary w-full py-6 text-xl font-black flex items-center justify-center gap-4 group/btn shadow-2xl relative overflow-hidden"
                            disabled={isSubmitting}
                        >
                            <motion.div
                                className="absolute inset-0 bg-white/20 -translate-x-full skew-x-12 group-hover/btn:translate-x-full transition-transform duration-1000"
                            />
                            {isSubmitting ? (
                                <Loader2 className="animate-spin" size={24} />
                            ) : (
                                <>
                                    <Sparkles size={24} />
                                    Launch Profile
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-12 text-center space-y-4">
                        <p className="text-zinc-600 font-bold text-xs uppercase tracking-widest">
                            Known Subject? <Link to="/login" className="text-primary hover:text-white transition-colors font-black">Sign In</Link>
                        </p>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default Register;
