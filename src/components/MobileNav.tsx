import { 
  LayoutDashboard, 
  FileText, 
  Cpu, 
  CheckSquare, 
  Map as MapIcon,
  BarChart3,
  User
} from 'lucide-react';
import { View } from '../types';

interface MobileNavProps {
  currentView: View;
  onViewChange: (view: View) => void;
  hasUnfinishedMission: boolean;
}

export default function MobileNav({ currentView, onViewChange, hasUnfinishedMission }: MobileNavProps) {
  const navItems = [
    { id: 'dashboard' as View, name: 'Dash', icon: LayoutDashboard },
    { id: 'impact-dashboard' as View, name: 'Impact', icon: BarChart3 },
    { id: 'report' as View, name: 'Report', icon: FileText },
    { id: 'mission-control' as View, name: 'Mission', icon: Cpu, badge: hasUnfinishedMission },
    { id: 'generated-case' as View, name: 'Case', icon: CheckSquare },
    { id: 'map' as View, name: 'Map', icon: MapIcon },
    { id: 'profile' as View, name: 'Profile', icon: User },
  ];

  return (
    <nav 
      id="civicpilot-mobile-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-white/95 dark:bg-[#070a13]/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800/80 px-4 flex items-center justify-between z-40 pb-safe shadow-2xl transition-colors duration-300"
    >
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = currentView === item.id;

        return (
          <button
            key={item.id}
            id={`mobile-nav-${item.id}`}
            onClick={() => onViewChange(item.id)}
            className={`flex flex-col items-center justify-center flex-1 h-full py-1 text-[10px] font-medium transition-all duration-300 relative cursor-pointer ${
              isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500 dark:text-slate-400'
            }`}
          >
            <div className="relative">
              <Icon className={`w-5 h-5 mb-0.5 transition-all duration-300 ${isActive ? 'scale-110' : 'opacity-80'}`} />
              {item.badge && (
                <span className="absolute top-0 right-0 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
                </span>
              )}
            </div>
            <span>{item.name}</span>

            {isActive && (
              <span className="absolute bottom-1 w-5 h-0.5 bg-indigo-600 dark:bg-indigo-500 rounded-full" />
            )}
          </button>
        );
      })}
    </nav>
  );
}
