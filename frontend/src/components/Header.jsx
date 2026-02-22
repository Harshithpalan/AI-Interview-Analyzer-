import { Link, useNavigate } from 'react-router-dom';
import { Mic, Activity, History, LogOut, User as UserIcon, LayoutDashboard, MousePointerClick, RefreshCw, Loader2, Brain } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getDemoCredentials } from '../api';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [showDemo, setShowDemo] = useState(false);
  const [demoCreds, setDemoCreds] = useState({ username: '', password: '' });
  const [isRefreshing, setIsRefreshing] = useState(false);

  const fetchDemoCredentials = async () => {
    setIsRefreshing(true);
    try {
      const data = await getDemoCredentials();
      setDemoCreds(data);
    } catch (error) {
      console.error('Failed to fetch demo credentials:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    if (!user) {
      fetchDemoCredentials();
    }
  }, [user]);

  return (
    <header className="glass-card flex items-center justify-between px-12 py-5 mb-8 border-white/[0.03] mx-auto max-w-7xl relative mt-4 group">
      <Link to="/" className="flex items-center gap-5 group transition-all">
        <div className="relative">
          <div className="absolute inset-0 bg-primary/20 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="bg-primary p-3.5 rounded-2xl text-white shadow-2xl shadow-primary/40 group-hover:rotate-[15deg] transition-all duration-700 relative z-10">
            <Brain size={26} />
          </div>
        </div>
        <div className="flex flex-col">
          <h2 className="text-3xl font-black tracking-tighter leading-none italic text-white flex items-center gap-2 uppercase">
            LUMINARY <span className="text-primary not-italic">AI</span>
          </h2>
          <span className="text-[9px] font-black text-zinc-600 uppercase tracking-[0.4em] ml-1">Intelligent Evaluation</span>
        </div>
      </Link>

      <nav className="flex items-center gap-10">
        <Link to="/" className="text-zinc-400 hover:text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all">
          <Mic size={16} /> Practice
        </Link>
        {user && (
          <Link to="/history" className="text-zinc-400 hover:text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-2 transition-all">
            <History size={16} /> Records
          </Link>
        )}

        <div className="h-4 w-[1px] bg-white/10"></div>

        {user ? (
          <div className="flex items-center gap-8 text-white">
            <div className="flex items-center gap-3 bg-white/[0.03] py-2 px-5 rounded-2xl border border-white/[0.05]">
              <div className="w-8 h-8 rounded-xl bg-primary/20 flex items-center justify-center border border-primary/20">
                <UserIcon size={16} className="text-primary" />
              </div>
              <span className="font-extrabold text-sm tracking-tight">{user.username}</span>
            </div>
            <button
              onClick={async () => {
                await logout();
                navigate('/');
              }}
              className="text-zinc-500 hover:text-secondary-light transition-all p-1 hover:scale-110"
              title="Logout"
            >
              <LogOut size={22} />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <Link to="/login" className="btn-primary py-2.5 px-8 text-sm">
              Launch App
            </Link>

            <div className="absolute right-0 top-full mt-8 z-[100] flex flex-col items-end gap-3">
              <motion.button
                onClick={() => setShowDemo(!showDemo)}
                animate={{
                  y: [0, -12, 0],
                  scale: [1, 1.1, 1],
                  boxShadow: [
                    "0 0 0px 0px rgba(242, 87, 43, 0)",
                    "0 0 20px 5px rgba(242, 87, 43, 0.3)",
                    "0 0 0px 0px rgba(242, 87, 43, 0)"
                  ]
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
                className="w-14 h-14 bg-primary/20 border border-primary/40 rounded-2xl flex items-center justify-center text-primary shadow-2xl backdrop-blur-3xl hover:bg-primary/30 transition-all group relative overflow-visible"
              >
                <motion.div
                  className="absolute inset-0 rounded-2xl bg-primary/10 -z-10"
                  animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <MousePointerClick size={28} className={showDemo ? 'rotate-12' : ''} />
                <span className="absolute right-full mr-4 px-3 py-1 bg-primary text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">Demo Access</span>
              </motion.button>

              <AnimatePresence>
                {showDemo && (
                  <motion.div
                    initial={{ opacity: 0, x: 20, scale: 0.9 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.9 }}
                    className="glass p-6 border-primary/20 shadow-2xl shadow-primary/20 text-right min-w-[260px] relative overflow-hidden"
                  >
                    <div className="absolute top-0 left-0 w-full h-1 bg-primary/20">
                      {isRefreshing && <motion.div initial={{ x: '-100%' }} animate={{ x: '100%' }} transition={{ repeat: Infinity, duration: 1 }} className="h-full bg-primary w-1/2" />}
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); fetchDemoCredentials(); }}
                        disabled={isRefreshing}
                        className="p-1.5 hover:bg-white/5 rounded-lg text-slate-500 hover:text-primary transition-all disabled:opacity-50"
                        title="Generate New Credentials"
                      >
                        <RefreshCw size={14} className={isRefreshing ? 'animate-spin' : ''} />
                      </button>
                      <p className="text-[10px] font-black text-primary uppercase tracking-widest flex items-center gap-2">
                        <MousePointerClick size={12} />
                        Demo Profile
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="group">
                        <p className="text-[9px] font-bold text-slate-500 uppercase mb-1 tracking-tighter">Username</p>
                        <p
                          draggable={true}
                          onDragStart={(e) => e.dataTransfer.setData("text/plain", demoCreds.username)}
                          className="text-sm font-black text-white hover:text-primary transition-colors cursor-move select-all font-mono"
                        >
                          {isRefreshing ? "••••••••" : demoCreds.username || "Loading..."}
                        </p>
                      </div>
                      <div className="group">
                        <p className="text-[9px] font-bold text-slate-500 uppercase mb-1 tracking-tighter">Password</p>
                        <p
                          draggable={true}
                          onDragStart={(e) => e.dataTransfer.setData("text/plain", demoCreds.password)}
                          className="text-sm font-black text-white hover:text-primary transition-colors cursor-move select-all font-mono text-xs"
                        >
                          {isRefreshing ? "••••••••" : demoCreds.password || "Loading..."}
                        </p>
                      </div>
                    </div>

                    <p className="mt-4 pt-4 border-t border-white/5 text-[8px] font-black text-primary uppercase tracking-widest text-center animate-pulse">
                      just drag and drop to sign in page
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
