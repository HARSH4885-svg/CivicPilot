import { 
  Bell, 
  Search, 
  Cpu, 
  Sparkles,
  Wifi,
  Clock,
  Sun,
  Moon,
  Globe
} from 'lucide-react';
import { View } from '../types';
import { Language } from '../utils/i18n';

interface TopNavProps {
  currentView: View;
  onViewChange: (view: View) => void;
  activeMissionCount: number;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  language: Language;
  onLanguageChange: (lang: Language) => void;
}

export default function TopNav({ 
  currentView, 
  onViewChange, 
  activeMissionCount, 
  theme, 
  onToggleTheme,
  language,
  onLanguageChange
}: TopNavProps) {
  // Get view title and subtitle
  const getHeaderDetails = () => {
    switch (currentView) {
      case 'dashboard':
        return {
          title: language === 'hi' ? 'इंटेलिजेंस सेंटर' : 'Intelligence Center',
          subtitle: language === 'hi' ? 'पड़ोसी बुनियादी ढांचा संचालन का वास्तविक समय अवलोकन' : 'Real-time overview of neighborhood infrastructure operations'
        };
      case 'command-center':
        return {
          title: language === 'hi' ? 'नगरपालिका कमांड सेंटर' : 'Municipal Command Center',
          subtitle: language === 'hi' ? 'जिला अधिकारियों और प्रशासकों के लिए एआई-संचालित परिचालन डैशबोर्ड' : 'AI-powered operational dashboard for district officers and administrators'
        };
      case 'report':
        return {
          title: language === 'hi' ? 'नई घटना की रिपोर्ट करें' : 'Report New Incident',
          subtitle: language === 'hi' ? 'स्थानीय नागरिक हस्तक्षेप मिशन शुरू करने के लिए मल्टीमॉडल डेटा फीड करें' : 'Feed multimodal data to initialize a local civic intervention mission'
        };
      case 'mission-control':
        return {
          title: language === 'hi' ? 'एआई मिशन कंट्रोल' : 'AI Mission Control',
          subtitle: language === 'hi' ? 'ऑर्केस्ट्रेटर और विशेष एजेंट खुफिया फाइलों की सक्रिय निगरानी' : 'Active monitoring of orchestrator and specialized agent intelligence files'
        };
      case 'generated-case':
        return {
          title: language === 'hi' ? 'उत्पन्न नगरपालिका फाइलें' : 'Generated Municipal Files',
          subtitle: language === 'hi' ? 'सरकार-तैयार Open311 और सिटीवर्क्स-संगत डोजियर डाउनलोड करें' : 'Download government-ready Open311 & Cityworks-compatible dossiers'
        };
      case 'map':
        return {
          title: language === 'hi' ? 'लाइव मिशन जियोस्पेशियल' : 'Live Mission Geospatial',
          subtitle: language === 'hi' ? 'नगरपालिका संपत्तियों और पर्यावरणीय घटनाओं का स्थानिक समन्वय' : 'Spatial coordination of municipal assets and environmental incidents'
        };
      case 'accessibility':
        return {
          title: language === 'hi' ? 'सुगमता और भाषा' : 'Accessibility & Language',
          subtitle: language === 'hi' ? 'प्रदर्शन, आवाज सुगमता और भाषा प्राथमिकताओं को कॉन्फ़िगर करें' : 'Configure display, voice accessibility, and language preferences'
        };
      default:
        return {
          title: 'CivicPilot',
          subtitle: 'AI-Powered Civic Intelligence'
        };
    }
  };

  const header = getHeaderDetails();

  return (
    <header 
      id="civicpilot-top-nav"
      className="sticky top-0 z-20 flex items-center justify-between h-20 px-6 md:px-8 bg-slate-50/80 dark:bg-[#050505]/80 backdrop-blur-xl border-b border-slate-200 dark:border-white/5 w-full transition-colors duration-300"
    >
      {/* Title & Description */}
      <div>
        <h2 className="text-xl font-bold text-slate-900 dark:text-white font-display tracking-tight flex items-center gap-2">
          {header.title}
          {currentView === 'mission-control' && activeMissionCount > 0 && (
            <span className="flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono tracking-wider text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 rounded-full">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 dark:bg-emerald-400 animate-pulse"></span>
              LIVE PROCESSING
            </span>
          )}
        </h2>
        <p className="hidden sm:block text-xs text-slate-500 dark:text-slate-400 mt-1">
          {header.subtitle}
        </p>
      </div>

      {/* Right Side Controls */}
      <div className="flex items-center gap-4">
        {/* Status indicator pill */}
        <div className="hidden lg:flex items-center gap-4 border border-slate-200 dark:border-slate-800 bg-white/80 dark:bg-slate-900/40 px-4 py-2 rounded-xl text-xs text-slate-600 dark:text-slate-300 transition-colors">
          <div className="flex items-center gap-1.5 text-emerald-600 dark:text-emerald-400 font-mono">
            <Wifi className="w-3.5 h-3.5" />
            <span>IO_ONLINE</span>
          </div>
          <div className="h-3 w-px bg-slate-200 dark:bg-slate-800"></div>
          <div className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-mono">
            <Cpu className="w-3.5 h-3.5" />
            <span>AGENTS_STANDBY</span>
          </div>
        </div>

        {/* Multilingual Switcher: One-Click EN/HI Toggle */}
        <button
          id="btn-lang-toggle"
          onClick={() => onLanguageChange(language === 'en' ? 'hi' : 'en')}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-350 hover:text-slate-900 dark:hover:text-white bg-slate-100 dark:bg-slate-900/40 hover:bg-slate-200/50 dark:hover:bg-slate-800/60 border border-slate-200 dark:border-slate-800/60 transition-all cursor-pointer font-mono h-10"
          title={language === 'en' ? 'Switch to Hindi (हिंदी)' : 'Switch to English (EN)'}
        >
          <Globe className="w-3.5 h-3.5 text-indigo-500" />
          <span>{language === 'en' ? 'EN' : 'हिंदी'}</span>
        </button>

        {/* Premium Theme Toggle Button */}
        <button 
          id="btn-theme-toggle"
          onClick={onToggleTheme}
          className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/40 border border-slate-200 dark:border-slate-800/60 transition-all duration-300 group cursor-pointer"
          title={theme === 'light' ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 group-hover:-rotate-12 transition-transform" />
          ) : (
            <Sun className="w-4 h-4 group-hover:rotate-45 transition-transform" />
          )}
        </button>

        {/* Notifications / Alerts Button */}
        <button 
          id="btn-notifications"
          className="relative p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/40 border border-slate-200 dark:border-slate-800/60 transition-all duration-300 group cursor-pointer"
        >
          <Bell className="w-4 h-4 group-hover:rotate-12 transition-transform" />
          {activeMissionCount > 0 && (
            <span className="absolute top-1.5 right-1.5 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
          )}
        </button>

        {/* Action Button: Fast switcher */}
        <button
          id="btn-quick-new-incident"
          onClick={() => onViewChange('report')}
          className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide text-white bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-md shadow-indigo-600/10 hover:shadow-indigo-600/20 active:scale-95 transition-all duration-300 cursor-pointer"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>New Incident</span>
        </button>
      </div>
    </header>
  );
}
