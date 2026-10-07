import React, { useState } from 'react';
import { api } from '../api';
import { User } from '../types';
import { DEMO_CREDENTIALS } from '../constants/transcripts';
import { Sparkles, Shield, Briefcase, Code, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';

interface LoginViewProps {
  onLoginSuccess: (user: User) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('admin@novaworks.example');
  const [password, setPassword] = useState('Demo123!');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e?: React.FormEvent, customEmail?: string, customPassword?: string) => {
    if (e) e.preventDefault();
    setError(null);
    setLoading(true);

    const loginEmail = customEmail || email;
    const loginPass = customPassword || password;

    try {
      const res = await api.login(loginEmail, loginPass);
      onLoginSuccess(res.user);
    } catch (err: any) {
      setError(err.message || 'Login failed. Please check credentials.');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickLogin = (demoEmail: string) => {
    setEmail(demoEmail);
    setPassword('Demo123!');
    handleLogin(undefined, demoEmail, 'Demo123!');
  };

  return (
    <div className="min-h-screen bg-[#070b14] flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-brand-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-[400px] h-[400px] bg-indigo-500/10 rounded-full blur-[120px] pointer-events-none" />

      {/* Container */}
      <div className="w-full max-w-xl z-10">
        {/* Header Branding */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-800/80 border border-slate-700/60 text-xs font-medium text-slate-300 mb-4 shadow-inner">
            <Sparkles className="w-3.5 h-3.5 text-brand-400" />
            <span>The Infinity Hack '26 &bull; Student Challenge Pack</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white mb-2">
            NovaWorks <span className="gradient-text">Project CRM</span>
          </h1>
          <p className="text-slate-400 text-sm max-w-md mx-auto">
            Meeting-to-Execution Project Management Platform with strict Role-Based Access Control and automated transcript parsing.
          </p>
        </div>

        {/* Card */}
        <div className="glass-panel p-6 sm:p-8 rounded-2xl shadow-2xl border border-slate-800/80 backdrop-blur-xl">
          {error && (
            <div className="mb-5 p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-start gap-3 text-red-400 text-xs animate-shake">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Work Email
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="name@novaworks.example"
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Demo123!"
                  className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-brand-500/50 focus:border-brand-500 transition-all font-mono"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white text-sm font-semibold shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-50"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/20 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  <span>Sign In to CRM</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Switcher - Essential for Hackathon Judges */}
          <div className="mt-8 pt-6 border-t border-slate-800">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                1-Click Judge Quick Login
              </span>
              <span className="text-[11px] text-slate-500 font-mono">Password: Demo123!</span>
            </div>

            <div className="space-y-2.5">
              {/* Admin Chip */}
              <div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-1 font-medium">
                  <Shield className="w-3 h-3 text-purple-400" /> Administrator
                </span>
                <div className="grid grid-cols-1 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('admin@novaworks.example')}
                    className="flex items-center justify-between px-3 py-2 rounded-lg bg-purple-950/30 hover:bg-purple-900/40 border border-purple-800/40 text-purple-300 text-xs font-medium transition-all group text-left"
                  >
                    <span>Admin (All projects & Transcript automation)</span>
                    <span className="text-[10px] opacity-60 group-hover:opacity-100 font-mono">admin@novaworks.example &rarr;</span>
                  </button>
                </div>
              </div>

              {/* Managers Chips */}
              <div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-1 font-medium">
                  <Briefcase className="w-3 h-3 text-blue-400" /> Project Managers (Filtered view)
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('ayesha@novaworks.example')}
                    className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 text-slate-300 text-xs font-medium text-left truncate transition-colors"
                  >
                    Ayesha (Web)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('bilal@novaworks.example')}
                    className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 text-slate-300 text-xs font-medium text-left truncate transition-colors"
                  >
                    Bilal (Mobile)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('hina@novaworks.example')}
                    className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 text-slate-300 text-xs font-medium text-left truncate transition-colors"
                  >
                    Hina (AI)
                  </button>
                </div>
              </div>

              {/* Developer Agents Chips */}
              <div>
                <span className="text-[11px] text-slate-400 flex items-center gap-1 mb-1 font-medium">
                  <Code className="w-3 h-3 text-emerald-400" /> Developer Agents (My Tasks view)
                </span>
                <div className="grid grid-cols-3 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('ali@novaworks.example')}
                    className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 text-slate-300 text-xs font-medium text-left truncate transition-colors"
                  >
                    Ali (FullStack)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('hamza@novaworks.example')}
                    className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 text-slate-300 text-xs font-medium text-left truncate transition-colors"
                  >
                    Hamza (FullStack)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('sara@novaworks.example')}
                    className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 text-slate-300 text-xs font-medium text-left truncate transition-colors"
                  >
                    Sara (Flutter)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('usman@novaworks.example')}
                    className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 text-slate-300 text-xs font-medium text-left truncate transition-colors"
                  >
                    Usman (Flutter)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('zain@novaworks.example')}
                    className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 text-slate-300 text-xs font-medium text-left truncate transition-colors"
                  >
                    Zain (AI)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleQuickLogin('maryam@novaworks.example')}
                    className="p-2 rounded-lg bg-slate-800/60 hover:bg-slate-700/60 border border-slate-700 text-slate-300 text-xs font-medium text-left truncate transition-colors"
                  >
                    Maryam (AI)
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <p className="text-center text-xs text-slate-600 mt-6 font-mono">
          NovaWorks Technologies &bull; Lahore, Pakistan &bull; Infinity Hack '26
        </p>
      </div>
    </div>
  );
};
