import { useState } from 'react';
import { motion } from 'motion/react';
import { 
  ArrowRight, 
  Sparkles, 
  Cpu, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  FileText,
  ShieldAlert,
  ArrowUpRight,
  TrendingUp,
  MapPin,
  Search,
  SlidersHorizontal
} from 'lucide-react';
import { IssueReport, View } from '../types';
import { PRELOADED_DEMO_CASES, DemoCase } from '../data/demoCases';
import SafeImage from '../components/SafeImage';
import PredictiveInsightsSection from '../components/PredictiveInsightsSection';

import { Language } from '../utils/i18n';

interface DashboardViewProps {
  reports: IssueReport[];
  onViewChange: (view: View) => void;
  onSelectReport: (report: IssueReport) => void;
  demoMode: boolean;
  onToggleDemoMode: () => void;
  onSelectDemoCase: (demo: DemoCase) => void;
  language?: Language;
}

export default function DashboardView({ 
  reports, 
  onViewChange, 
  onSelectReport,
  demoMode,
  onToggleDemoMode,
  onSelectDemoCase,
  language
}: DashboardViewProps) {
  const [activeTableTab, setActiveTableTab] = useState<'live' | 'demo'>('live');
  const [searchQuery, setSearchQuery] = useState('');
  const [severityFilter, setSeverityFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  // Compute some stats
  const totalCases = reports.length;
  const activeMissions = reports.filter(r => r.status === 'active' || r.status === 'analyzing').length;
  const resolvedCases = reports.filter(r => r.status === 'resolved').length;

  const filteredReports = reports
    .filter(r => activeTableTab === 'live' ? !r.isDemo : r.isDemo)
    .filter(r => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch = !q ||
        r.id.toLowerCase().includes(q) ||
        r.title.toLowerCase().includes(q) ||
        r.description.toLowerCase().includes(q) ||
        r.category.toLowerCase().includes(q) ||
        r.location.address.toLowerCase().includes(q);
        
      const matchesSeverity = severityFilter === 'all' || r.severity === severityFilter;
      const matchesCategory = categoryFilter === 'all' || r.category === categoryFilter;
      
      return matchesSearch && matchesSeverity && matchesCategory;
    });

  const handleRowClick = (report: IssueReport) => {
    onSelectReport(report);
    if (report.status === 'analyzing') {
      onViewChange('mission-control');
    } else {
      onViewChange('generated-case');
    }
  };

  return (
    <div id="dashboard-view" className="space-y-8 pb-12">
      {/* Hero Section */}
      <section className="relative overflow-hidden rounded-3xl border border-slate-200 dark:border-slate-800 bg-gradient-to-br from-white via-slate-50 to-indigo-50/20 dark:from-slate-950 dark:via-slate-900 dark:to-[#0e1628] p-8 md:p-12 shadow-xl dark:shadow-2xl transition-colors duration-300">
        {/* Ambient background glows */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 dark:bg-indigo-600/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-violet-500/5 dark:bg-violet-600/5 rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 text-xs font-mono font-medium tracking-wider text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-150 dark:border-indigo-500/20 rounded-full mb-6">
            <Sparkles className="w-3 h-3 animate-pulse" />
            <span>AI-POWERED AUTONOMOUS DISPATCH</span>
          </div>
          
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display leading-tight">
            Civic Intelligence that <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-indigo-500 dark:from-indigo-400 dark:via-violet-400 dark:to-indigo-300">doesn't just report</span> problems—it helps solve them.
          </h1>
          
          <p className="mt-4 text-base md:text-lg text-slate-600 dark:text-slate-400 leading-relaxed max-w-2xl">
            A specialized cognitive architecture linking advanced vision agents, spatial mapping, and auto-prepared Open311 dossiers to accelerate local municipal response by up to 10x.
          </p>
          
          <div className="mt-8 flex flex-wrap gap-4">
            <button
              id="dashboard-cta-report"
              onClick={() => onViewChange('report')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold tracking-wide text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30 active:scale-98 transition-all duration-300 cursor-pointer"
            >
              <span>Report New Incident</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            
            <button
              id="dashboard-cta-missions"
              onClick={() => onViewChange('mission-control')}
              className="flex items-center gap-2 px-6 py-3.5 rounded-xl font-semibold tracking-wide text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white bg-white hover:bg-slate-100 dark:bg-slate-900/60 dark:hover:bg-slate-800/80 border border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 transition-all duration-300 cursor-pointer"
            >
              <span>Launch Mission Control</span>
              <Cpu className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </button>
          </div>
        </div>

        {/* Floating tech element graphic */}
        <div className="absolute right-8 bottom-8 hidden lg:flex flex-col gap-2 p-4 rounded-2xl bg-white/90 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 w-64 text-xs font-mono text-slate-600 dark:text-slate-400 shadow-lg">
          <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 border-b border-slate-100 dark:border-slate-800/50 pb-2 mb-1">
            <span>COGNITIVE_STATE</span>
            <span className="text-emerald-600 dark:text-emerald-400 font-bold">ACTIVE</span>
          </div>
          <div className="flex justify-between">
            <span>Model:</span>
            <span className="text-indigo-600 dark:text-indigo-400 font-semibold">Gemini 2.5 Flash</span>
          </div>
          <div className="flex justify-between">
            <span>Agent Orchestrator:</span>
            <span className="text-slate-800 dark:text-slate-300">AutoRouter V4</span>
          </div>
          <div className="flex justify-between">
            <span>Integrations:</span>
            <span className="text-slate-800 dark:text-slate-300">Open311, ArcGIS</span>
          </div>
          <div className="w-full bg-slate-100 dark:bg-slate-950 h-1.5 rounded-full mt-2 overflow-hidden">
            <div className="bg-indigo-600 dark:bg-indigo-500 h-full w-4/5 animate-pulse"></div>
          </div>
        </div>
      </section>

      {/* Demo Mode Controller Panel */}
      <section className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-gradient-to-r dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 relative overflow-hidden shadow-md dark:shadow-xl transition-all duration-300">
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/[0.02] rounded-full blur-3xl pointer-events-none"></div>
        
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`p-3 rounded-2xl border transition-all duration-300 ${
              demoMode 
                ? 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-150 dark:border-indigo-500/30 shadow-md shadow-indigo-500/5' 
                : 'bg-slate-50 dark:bg-slate-900 text-slate-400 dark:text-slate-500 border-slate-200 dark:border-slate-800'
            }`}>
              <Sparkles className={`w-5 h-5 ${demoMode ? 'animate-pulse' : ''}`} />
            </div>
            <div>
              <h3 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Interactive Demo Scenarios
                <span className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border transition-colors ${
                  demoMode 
                    ? 'bg-emerald-50 dark:bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-150 dark:border-emerald-500/30' 
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-500 dark:text-slate-400 border-slate-200 dark:border-slate-800'
                }`}>
                  {demoMode ? 'DEMO_MODE_ACTIVE' : 'READY'}
                </span>
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-xl leading-relaxed">
                Explore the autonomous multi-agent pipeline immediately with pre-configured mock incidents. No camera/photo upload required.
              </p>
            </div>
          </div>
          
          <button
            id="demo-mode-toggle"
            onClick={onToggleDemoMode}
            className={`flex items-center gap-3 px-5 py-3 rounded-xl text-xs font-semibold tracking-wide border transition-all duration-300 cursor-pointer ${
              demoMode
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20 hover:bg-indigo-500'
                : 'bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800/80 border-slate-200 dark:border-slate-850 hover:border-slate-300 dark:hover:border-slate-700 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <span>{demoMode ? 'Disable Demo Mode' : 'Enable Demo Mode'}</span>
            <div className={`w-8 h-4 rounded-full relative transition-colors duration-300 ${demoMode ? 'bg-indigo-300' : 'bg-slate-200 dark:bg-slate-800'}`}>
              <div className={`w-3.5 h-3.5 rounded-full bg-white absolute top-0.25 transition-transform duration-300 ${demoMode ? 'translate-x-4' : 'translate-x-0.5'} shadow-sm`} />
            </div>
          </button>
        </div>

        {/* Elegant Preloaded Cases Grid */}
        {demoMode && (
          <div className="mt-6 pt-6 border-t border-slate-150 dark:border-slate-800 grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
            {PRELOADED_DEMO_CASES.map((demoCase) => (
              <div
                key={demoCase.id}
                id={`demo-card-${demoCase.id}`}
                onClick={() => onSelectDemoCase(demoCase)}
                className="group p-5 rounded-2xl border border-slate-200 dark:border-slate-800 hover:border-indigo-500/45 dark:hover:border-indigo-500/40 bg-slate-50/50 dark:bg-slate-950/40 hover:bg-indigo-50/20 dark:hover:bg-indigo-950/[0.04] transition-all duration-300 cursor-pointer flex flex-col justify-between overflow-hidden relative shadow-sm hover:shadow-md"
              >
                {/* Accent glow on hover */}
                <div className="absolute inset-0 bg-indigo-500/[0.01] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                
                <div>
                  <div className="relative h-36 rounded-xl overflow-hidden mb-4 border border-slate-200 dark:border-slate-850/60 shadow-inner">
                    <SafeImage
                      src={demoCase.imageUrl}
                      alt={demoCase.title}
                      category={demoCase.category}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent opacity-80" />
                    <span className={`absolute top-2.5 right-2.5 text-[9px] font-mono font-bold px-2 py-0.5 rounded border capitalize ${
                      demoCase.severity === 'critical'
                        ? 'bg-red-500 text-white border-red-500/30 shadow-sm shadow-red-500/20'
                        : demoCase.severity === 'high'
                        ? 'bg-amber-500 text-white border-amber-500/30 shadow-sm shadow-amber-500/20'
                        : 'bg-indigo-500 text-white border-indigo-500/30 shadow-sm shadow-indigo-500/20'
                    }`}>
                      {demoCase.severity}
                    </span>
                  </div>

                  <div className="flex items-center gap-2 flex-wrap mb-2.5">
                    <span className="text-[10px] font-mono font-bold text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-0.5 rounded border border-indigo-150 dark:border-indigo-500/10">
                      {demoCase.category}
                    </span>
                    <span className="text-[10px] font-mono font-bold text-amber-700 dark:text-amber-500 bg-amber-50 dark:bg-amber-500/10 px-2 py-0.5 rounded border border-amber-150 dark:border-amber-500/20 shadow-sm shrink-0">
                      DEMO CASE
                    </span>
                  </div>
                  
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200 mt-1.5 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors leading-snug">
                    {demoCase.title}
                  </h4>
                  
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 line-clamp-3 leading-relaxed">
                    {demoCase.description}
                  </p>
                </div>

                <div className="mt-5 pt-4 border-t border-slate-200/60 dark:border-slate-900/60 flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 flex items-center gap-1.5 max-w-[70%] truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{demoCase.address}</span>
                  </span>
                  <span className="text-[10px] font-bold text-indigo-600 dark:text-indigo-400 group-hover:text-indigo-500 dark:group-hover:text-indigo-300 flex items-center gap-1 shrink-0 transition-colors">
                    Deploy <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Statistics Cards */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900/20 hover:border-slate-300 dark:hover:border-slate-700/50 transition-all duration-300 relative group overflow-hidden shadow-sm hover:shadow-md">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-600/5 rounded-full blur-2xl group-hover:bg-indigo-600/10 transition-colors"></div>
          <div className="flex justify-between items-start">
            <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <span className="flex items-center gap-1 text-xs text-emerald-700 dark:text-emerald-400 font-mono bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-md border border-emerald-150 dark:border-transparent">
              <TrendingUp className="w-3 h-3" />
              <span>+18% MoM</span>
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-950 dark:text-white tracking-tight mt-4 font-display">{resolvedCases}</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1 uppercase tracking-wider">Resolved Incidents</p>
          <p className="text-[11px] text-slate-500 mt-2">Dossiers signed, packaged and dispatched successfully.</p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900/20 hover:border-slate-300 dark:hover:border-slate-700/50 transition-all duration-300 relative group overflow-hidden shadow-sm hover:shadow-md">
          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-600/5 rounded-full blur-2xl group-hover:bg-emerald-600/10 transition-colors"></div>
          <div className="flex justify-between items-start">
            <div className="p-3 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400">
              <Cpu className="w-6 h-6 animate-spin-slow" style={{ animationDuration: '8s' }} />
            </div>
            {activeMissions > 0 && (
              <span className="flex items-center gap-1 h-2 w-2 relative mt-2 mr-1">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            )}
          </div>
          <p className="text-3xl font-bold text-slate-950 dark:text-white tracking-tight mt-4 font-display">{activeMissions}</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1 uppercase tracking-wider">Active Autonomous Missions</p>
          <p className="text-[11px] text-slate-500 mt-2">Simulated agents running multi-agent checks in real-time.</p>
        </div>

        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800/60 bg-white dark:bg-slate-900/20 hover:border-slate-300 dark:hover:border-slate-700/50 transition-all duration-300 relative group overflow-hidden sm:col-span-2 lg:col-span-1 shadow-sm hover:shadow-md">
          <div className="absolute top-0 right-0 w-24 h-24 bg-violet-600/5 rounded-full blur-2xl group-hover:bg-violet-600/10 transition-colors"></div>
          <div className="flex justify-between items-start">
            <div className="p-3 bg-violet-50 dark:bg-violet-500/10 rounded-xl text-violet-600 dark:text-violet-400">
              <Clock className="w-6 h-6" />
            </div>
            <span className="text-[10px] font-mono text-indigo-700 dark:text-indigo-400 border border-indigo-150 dark:border-indigo-500/20 bg-indigo-50 dark:bg-indigo-500/10 px-1.5 py-0.5 rounded-md">
              KPI VALUE
            </span>
          </div>
          <p className="text-3xl font-bold text-slate-950 dark:text-white tracking-tight mt-4 font-display">8.4x</p>
          <p className="text-xs text-slate-600 dark:text-slate-400 font-medium mt-1 uppercase tracking-wider">Average Dispatch Acceleration</p>
          <p className="text-[11px] text-slate-500 mt-2">Reduction in average duration from report to municipal logging.</p>
        </div>
      </section>

      {/* Predictive Insights Section */}
      <PredictiveInsightsSection reports={reports} />

      {/* Grid: Recent Missions & AI Status Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Missions list */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Recent Incidents</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">Dual-mode pipeline view: Real live uploads separate from demo scenarios.</p>
            </div>
            <button
              onClick={() => onViewChange('map')}
              className="text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-white flex items-center gap-1 hover:underline transition-all cursor-pointer self-start sm:self-auto"
            >
              <span>View on Geospatial Deck</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Segmented Tab Bar - Separates Live from Demo completely */}
          <div className="flex border-b border-slate-200 dark:border-slate-800/80">
            <button 
              onClick={() => setActiveTableTab('live')}
              className={`px-4 py-2.5 text-xs font-mono font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTableTab === 'live' 
                  ? 'border-indigo-600 dark:border-indigo-400 text-indigo-600 dark:text-indigo-400 bg-indigo-50/10' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full bg-indigo-500 ${activeTableTab === 'live' ? 'animate-pulse' : ''}`} />
              LIVE ANALYSIS ({reports.filter(r => !r.isDemo).length})
            </button>
            <button 
              onClick={() => setActiveTableTab('demo')}
              className={`px-4 py-2.5 text-xs font-mono font-bold border-b-2 transition-all flex items-center gap-2 cursor-pointer ${
                activeTableTab === 'demo' 
                  ? 'border-amber-600 dark:border-amber-500 text-amber-600 dark:text-amber-500 bg-amber-50/10' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
              }`}
            >
              <span className="w-1.5 h-1.5 rounded-full bg-amber-500" />
              DEMO CASES ({reports.filter(r => r.isDemo).length})
            </button>
          </div>

          {/* Search and Filters bar */}
          <div className="flex flex-col md:flex-row gap-3 p-4 bg-slate-50 dark:bg-slate-900/20 border border-slate-150 dark:border-slate-800/60 rounded-2xl transition-colors">
            {/* Search Input */}
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-2.5 w-4 h-4 text-slate-455 dark:text-slate-500 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by title, description, address, or Docket ID..."
                className="w-full pl-10 pr-4 py-2 bg-white dark:bg-slate-950/60 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-850 dark:text-slate-200 placeholder-slate-400 outline-none focus:border-indigo-500 transition-all"
              />
            </div>
            
            {/* Severity Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase hidden lg:inline">Severity:</span>
              <select
                value={severityFilter}
                onChange={(e) => setSeverityFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-205 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 outline-none cursor-pointer focus:border-indigo-500"
              >
                <option value="all">All Severities</option>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="critical">Critical</option>
              </select>
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-mono font-bold text-slate-400 uppercase hidden lg:inline">Category:</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 rounded-xl bg-white dark:bg-slate-950/60 border border-slate-205 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 outline-none cursor-pointer focus:border-indigo-500"
              >
                <option value="all">All Categories</option>
                <option value="Water & Utilities">Water & Utilities</option>
                <option value="Environmental Hazard">Environmental Hazard</option>
                <option value="Traffic & Transit">Traffic & Transit</option>
                <option value="Accessibility & Parking">Accessibility & Parking</option>
                <option value="Infrastructure">Infrastructure</option>
                <option value="Health & Safety">Health & Safety</option>
              </select>
            </div>
          </div>

          <div className="border border-slate-200 dark:border-slate-800/80 rounded-2xl bg-white dark:bg-slate-950/40 overflow-hidden shadow-sm transition-colors duration-300">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 text-[11px] font-mono tracking-wider uppercase bg-slate-50 dark:bg-slate-900/30">
                    <th className="py-4 px-5">Incident Info</th>
                    <th className="py-4 px-5">Priority</th>
                    <th className="py-4 px-5">Progress / Status</th>
                    <th className="py-4 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/50">
                  {reports.filter(r => activeTableTab === 'live' ? !r.isDemo : r.isDemo).length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center px-6">
                        <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                          <div className="p-3 bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-2xl mb-3.5 border border-indigo-150 dark:border-indigo-500/10">
                            <Cpu className="w-6 h-6 animate-pulse" />
                          </div>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-250">
                            {activeTableTab === 'live' ? 'No Live Analyses Active' : 'No Demo Cases Loaded'}
                          </p>
                          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            {activeTableTab === 'live'
                              ? 'No live AI analyses have been generated yet. Upload an incident photo or recorded audio in "Report New Incident" to trigger the live pipeline.'
                              : 'Select one of the quick scenario preloads from the sidebar to launch a demo docket.'}
                          </p>
                          {activeTableTab === 'live' && (
                            <button
                              onClick={() => onViewChange('report')}
                              className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all shadow-md cursor-pointer"
                            >
                              <span>Report Live Incident</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ) : filteredReports.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="py-12 text-center px-6">
                        <div className="flex flex-col items-center justify-center max-w-sm mx-auto">
                          <div className="p-3 bg-slate-100 dark:bg-slate-900 text-slate-400 rounded-2xl mb-3.5 border border-slate-200 dark:border-slate-800">
                            <Search className="w-5 h-5 text-slate-500" />
                          </div>
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">No matching incidents</p>
                          <p className="text-xs text-slate-500 mt-1.5 leading-relaxed">
                            We couldn\'t find any incidents matching "{searchQuery}" with the selected filters.
                          </p>
                          <button
                            onClick={() => {
                              setSearchQuery('');
                              setSeverityFilter('all');
                              setCategoryFilter('all');
                            }}
                            className="mt-4 px-4 py-2 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 active:scale-95 transition-all cursor-pointer"
                          >
                            Reset Filters
                          </button>
                        </div>
                      </td>
                    </tr>
                  ) : (
                    filteredReports
                      .map((report) => (
                        <tr 
                          key={report.id}
                          onClick={() => handleRowClick(report)}
                          className="hover:bg-slate-50/80 dark:hover:bg-slate-900/30 cursor-pointer transition-colors group"
                        >
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              {report.imageUrl ? (
                                <SafeImage 
                                  src={report.imageUrl} 
                                  alt={report.title} 
                                  category={report.category}
                                  className="w-10 h-10 rounded-lg object-cover border border-slate-200 dark:border-slate-800"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-900 flex items-center justify-center border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 font-mono text-xs">
                                  CP
                                </div>
                              )}
                              <div>
                                <div className="flex items-center flex-wrap gap-2">
                                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                                    {language === 'hi' && report.translatedTitle ? report.translatedTitle : report.title}
                                  </p>
                                  {report.isDemo ? (
                                    <span className="inline-flex items-center px-1.5 py-0.25 text-[8px] font-bold font-mono tracking-wide text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-100 dark:border-amber-500/20 rounded shrink-0">
                                      DEMO CASE
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center px-1.5 py-0.25 text-[8px] font-bold font-mono tracking-wide text-indigo-700 dark:text-indigo-450 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-100 dark:border-indigo-500/20 rounded shrink-0 animate-pulse">
                                      LIVE ANALYSIS
                                    </span>
                                  )}
                                </div>
                                <div className="flex items-center gap-2 mt-1">
                                  <span className="text-[10px] font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-1.5 py-0.5 rounded">
                                    {language === 'hi' && report.translatedCategory ? report.translatedCategory : report.category}
                                  </span>
                                  <span className="text-[10px] text-slate-500 flex items-center gap-1">
                                    <MapPin className="w-2.5 h-2.5 text-slate-400" />
                                    {report.location.address.split(',')[0]}
                                  </span>
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-5">
                            <span className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold tracking-wider uppercase font-mono border ${
                              report.severity === 'critical'
                                ? 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-150 dark:border-red-500/20'
                                : report.severity === 'high'
                                ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-150 dark:border-amber-500/20'
                                : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-150 dark:border-indigo-500/20'
                            }`}>
                              {report.severity}
                            </span>
                          </td>
                          <td className="py-4 px-5">
                            <div className="flex items-center gap-3">
                              <span className={`h-2 w-2 rounded-full ${
                                report.status === 'resolved'
                                  ? 'bg-emerald-500'
                                  : report.status === 'analyzing'
                                  ? 'bg-indigo-500 animate-pulse'
                                  : 'bg-amber-500'
                              }`} />
                              <span className="text-xs text-slate-700 dark:text-slate-300 font-medium capitalize">
                                {report.status}
                              </span>
                            </div>
                          </td>
                          <td className="py-4 px-5 text-right">
                            <button 
                              className="p-1.5 rounded-lg text-slate-400 hover:text-indigo-600 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 group-hover:translate-x-1 transition-all cursor-pointer"
                              title="Open Case File"
                            >
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* AI Status Card & Empty State Showcase */}
        <div className="space-y-6">
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">System Status</h3>
          
          {/* AI Orchestrator Health Card */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-950/40 relative overflow-hidden shadow-sm transition-colors duration-300">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-900">
              <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
                <Cpu className="w-5 h-5 animate-pulse" />
              </div>
              <div>
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Pilot Intelligence Node</h4>
                <p className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">STATUS: CALIBRATED_LIVE</p>
              </div>
            </div>

            <div className="mt-4 space-y-3.5 text-xs font-mono">
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span>Primary Model:</span>
                <span className="text-slate-800 dark:text-slate-200 font-semibold">gemini-2.5-flash</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span>Cognitive Temperature:</span>
                <span className="text-slate-800 dark:text-slate-200">0.2 (Structured Response)</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span>Verification Accuracy:</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-semibold">99.4% (Threshold Target)</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span>Municipal Sync Channels:</span>
                <span className="text-slate-800 dark:text-slate-200">Open311 (V3), Cityworks</span>
              </div>
              <div className="flex justify-between items-center text-slate-500 dark:text-slate-400">
                <span>Active Core Threads:</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">6 Specialized Agents</span>
              </div>
            </div>
          </div>

          {/* Premium Empty State card showcasing Civic Safety status */}
          <div className="p-6 rounded-2xl border border-dashed border-slate-250 dark:border-slate-800 bg-slate-50/40 dark:bg-slate-950/20 text-center flex flex-col items-center justify-center py-8">
            <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center text-emerald-600 dark:text-emerald-400 mb-4 border border-emerald-150 dark:border-emerald-500/20">
              <ShieldAlert className="w-6 h-6 animate-pulse-slow" />
            </div>
            <h4 className="text-sm font-semibold text-slate-800 dark:text-slate-200">Escalation Queues Empty</h4>
            <p className="text-xs text-slate-500 dark:text-slate-500 mt-2 max-w-xs leading-relaxed">
              No unresolved environmental safety hazards or utility emergencies are currently flagged in Sector 4. Good job!
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
