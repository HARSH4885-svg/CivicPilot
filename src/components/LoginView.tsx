import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, Shield, User, Building2, ArrowRight } from 'lucide-react';

interface LoginViewProps {
  onLogin: (role: 'citizen' | 'admin') => void;
}

export default function LoginView({ onLogin }: LoginViewProps) {
  const [selectedRole, setSelectedRole] = useState<'citizen' | 'admin'>('citizen');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onLogin(selectedRole);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-xl">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,_var(--tw-gradient-stops))] from-indigo-900/20 via-slate-950 to-slate-950 pointer-events-none"></div>
      
      {/* Interactive Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] opacity-30 pointer-events-none"></div>

      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className="relative w-full max-w-lg p-8 mx-4 rounded-3xl border border-slate-800 bg-slate-900/50 backdrop-blur-md shadow-2xl overflow-hidden"
      >
        {/* Floating Ambient Light */}
        <div className="absolute -top-10 -left-10 w-40 h-40 bg-indigo-500/10 blur-3xl rounded-full"></div>
        <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-emerald-500/10 blur-3xl rounded-full"></div>

        <div className="relative text-center space-y-2 mb-8">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-500 shadow-xl shadow-indigo-500/25 mb-4">
            <svg className="w-7 h-7 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-white font-display">
            Civic<span className="text-indigo-400">Pilot</span> System Access
          </h2>
          <p className="text-sm text-slate-400 max-w-md mx-auto">
            AI-Powered Multi-Agent Orchestration for Smart-City Dispatch and Civic Response coordination.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6 relative">
          <div className="space-y-3">
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider font-mono">
              Select Operating Account
            </label>
            
            <div className="grid grid-cols-1 gap-4">
              {/* Citizen Card */}
              <button
                type="button"
                onClick={() => setSelectedRole('citizen')}
                className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                  selectedRole === 'citizen'
                    ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/15'
                    : 'border-slate-800 bg-slate-900/30 hover:border-slate-750 hover:bg-slate-900/50'
                }`}
              >
                <div className={`p-3 rounded-xl ${
                  selectedRole === 'citizen' ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-450'
                }`}>
                  <User className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-base">Citizen Agent Persona</h4>
                    {selectedRole === 'citizen' && (
                      <span className="text-[10px] bg-indigo-500 text-white px-2 py-0.5 rounded-full font-mono font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Report real-time infrastructure defects, verify community safety alerts, and view cognitive impact records.
                  </p>
                </div>
              </button>

              {/* Admin Card */}
              <button
                type="button"
                onClick={() => setSelectedRole('admin')}
                className={`flex items-start gap-4 p-5 rounded-2xl border text-left transition-all duration-300 cursor-pointer ${
                  selectedRole === 'admin'
                    ? 'border-emerald-500 bg-emerald-500/10 shadow-lg shadow-emerald-500/15'
                    : 'border-slate-800 bg-slate-900/30 hover:border-slate-750 hover:bg-slate-900/50'
                }`}
              >
                <div className={`p-3 rounded-xl ${
                  selectedRole === 'admin' ? 'bg-emerald-500 text-white' : 'bg-slate-800 text-slate-450'
                }`}>
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <h4 className="font-bold text-white text-base">Municipal Administrator</h4>
                    {selectedRole === 'admin' && (
                      <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-mono font-bold">
                        ACTIVE
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">
                    Review automated dispatch workloads, authorize agency assignments, and access full audit trail records.
                  </p>
                </div>
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 py-4 rounded-2xl text-sm font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-xl shadow-indigo-600/20 hover:shadow-indigo-600/35 transition-all duration-300 cursor-pointer group active:scale-98"
            >
              <span>Initialize System & Sign In</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </button>
          </div>
        </form>

        <div className="mt-6 pt-4 border-t border-slate-800/80 text-center">
          <p className="text-[10px] font-mono text-slate-500 flex items-center justify-center gap-1.5">
            <Shield className="w-3.5 h-3.5 text-emerald-500" />
            <span>AUTHENTICATED SECURE OPERATOR ACCESS VERIFIED</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
}
