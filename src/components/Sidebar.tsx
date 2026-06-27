import { motion } from 'motion/react';
import { 
  LayoutDashboard, 
  FileText, 
  Cpu, 
  CheckSquare, 
  Map as MapIcon, 
  Shield, 
  AlertCircle,
  BarChart3,
  User,
  Building2,
  Sliders
} from 'lucide-react';
import { View } from '../types';

interface SidebarProps {
  currentView: View;
  onViewChange: (view: View) => void;
  hasUnfinishedMission: boolean;
}

export default function Sidebar({ currentView, onViewChange, hasUnfinishedMission }: SidebarProps) {
  const menuItems = [
    { id: 'dashboard' as View, name: 'Dashboard', icon: LayoutDashboard },
    { id: 'impact-dashboard' as View, name: 'Impact Dashboard', icon: BarChart3 },
    { id: 'command-center' as View, name: 'Command Center', icon: Building2 },
    { id: 'report' as View, name: 'Report Issue', icon: FileText },
    { 
      id: 'mission-control' as View, 
      name: 'Mission Control', 
      icon: Cpu,
      badge: hasUnfinishedMission ? 'Active' : undefined
    },
    { id: 'generated-case' as View, name: 'Generated Case', icon: CheckSquare },
    { id: 'map' as View, name: 'Live Map', icon: MapIcon },
    { id: 'profile' as View, name: 'Citizen Profile', icon: User },
    { id: 'accessibility' as View, name: 'Accessibility & Lang', icon: Sliders },
  ];

  return (
    <aside 
      id="civicpilot-sidebar"
      className="hidden md:flex flex-col w-64 h-screen fixed left-0 top-0 glass-panel border-r border-slate-200 dark:border-slate-800 z-30 transition-colors duration-300"
    >
      {/* Brand Logo & Tagline */}
      <div className="p-6 border-b border-slate-200 dark:border-slate-800/60">
        <div className="flex items-center gap-3">
          <div className="relative flex items-center justify-center w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-500 shadow-lg shadow-indigo-500/25">
            <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polygon points="12 2 2 7 12 12 22 7 12 2" />
              <polyline points="2 17 12 22 22 17" />
              <polyline points="2 12 12 17 22 12" />
            </svg>
            <div className="absolute -inset-0.5 rounded-xl bg-indigo-500/30 blur-sm opacity-50"></div>
          </div>
          <div>
            <h1 className="text-xl font-bold tracking-tight text-slate-900 dark:text-white font-display flex items-center">
              Civic<span className="text-indigo-600 dark:text-emerald-400 font-semibold ml-0.5">Pilot</span>
            </h1>
            <p className="text-[9px] font-mono tracking-widest text-slate-400 dark:text-slate-500 uppercase mt-0.5">
              AI Civic Intelligence
            </p>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-4 py-6 space-y-1 overflow-y-auto">
        {menuItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              id={`nav-item-${item.id}`}
              onClick={() => onViewChange(item.id)}
              className={`relative flex items-center justify-between w-full px-4 py-3 text-sm rounded-xl transition-all duration-300 group cursor-pointer ${
                isActive 
                  ? 'text-indigo-600 dark:text-white font-medium bg-indigo-50 dark:bg-indigo-600/10 border border-indigo-100 dark:border-indigo-500/20' 
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/30 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3 z-10">
                <Icon className={`w-5 h-5 transition-transform duration-300 ${
                  isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400 dark:text-slate-400 group-hover:scale-110'
                }`} />
                <span>{item.name}</span>
              </div>

              {/* Badges / Active Indicators */}
              {item.badge && (
                <span className="relative flex h-2 w-2 z-10">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}

              {isActive && (
                <motion.div 
                  layoutId="active-sidebar-indicator"
                  className="absolute inset-0 bg-indigo-50/50 dark:bg-indigo-600/5 rounded-xl border border-indigo-100 dark:border-indigo-500/15"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer System Node Info */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800/60 m-4 bg-slate-100/50 dark:bg-slate-950/40 rounded-xl border border-slate-200 dark:border-slate-850 transition-colors duration-300">
        <div className="flex items-start gap-3">
          <div className="p-1 rounded bg-indigo-100 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 shrink-0">
            <Cpu className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-xs text-slate-800 dark:text-slate-300 font-bold">CivicPilot Core Node</p>
            <p className="text-[10px] text-slate-500 dark:text-slate-500 mt-1 leading-relaxed">
              Orchestrated on Cloud Run via server-side Google Gemini. Secure Open311 & Cityworks API channels verified.
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
}
