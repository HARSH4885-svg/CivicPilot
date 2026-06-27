import { useState, useEffect } from 'react';
import { 
  Sparkles, 
  TrendingUp, 
  AlertTriangle, 
  Clock, 
  Activity, 
  ShieldAlert, 
  BarChart3, 
  Lightbulb, 
  CheckCircle2, 
  ArrowRight,
  RefreshCw,
  MapPin,
  Calendar
} from 'lucide-react';
import { IssueReport, PredictiveInsightsData } from '../types';

interface PredictiveInsightsSectionProps {
  reports: IssueReport[];
}

export default function PredictiveInsightsSection({ reports }: PredictiveInsightsSectionProps) {
  const [insights, setInsights] = useState<PredictiveInsightsData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'hotspots' | 'trends' | 'actions'>('hotspots');

  // Trigger whenever reports list or report status changes (analyzed, updated, etc)
  // Serialize the reports' statuses and length to trigger updates correctly
  const reportsSyncKey = reports
    .map(r => `${r.id}-${r.status}-${r.isDemo}`)
    .join('|');

  const fetchInsights = async () => {
    setLoading(true);
    setError(null);
    try {
      const lightweightReports = (reports || []).map((r: any) => ({
        id: r.id,
        title: r.title,
        category: r.category,
        description: r.description,
        location: r.location ? { lat: r.location.lat, lng: r.location.lng, address: r.location.address } : undefined,
        createdAt: r.createdAt,
        severity: r.severity,
        status: r.status,
        isDemo: !!r.isDemo
      }));

      const res = await fetch('/api/predictive-insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reports: lightweightReports })
      });
      if (!res.ok) {
        throw new Error('Failed to retrieve predictive analysis from municipal networks.');
      }
      const data = await res.json();
      setInsights(data);
    } catch (err: any) {
      console.error('Error in fetching predictive insights:', err);
      setError(err?.message || 'An unexpected error occurred during prediction analysis.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInsights();
  }, [reportsSyncKey]);

  if (loading && !insights) {
    return (
      <div id="predictive-insights-loading" className="p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/20 shadow-sm space-y-6 animate-pulse">
        <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-900">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-slate-200 dark:bg-slate-800 rounded-xl" />
            <div className="space-y-2">
              <div className="w-48 h-4 bg-slate-200 dark:bg-slate-800 rounded" />
              <div className="w-32 h-3 bg-slate-200 dark:bg-slate-800 rounded" />
            </div>
          </div>
          <div className="w-24 h-8 bg-slate-200 dark:bg-slate-800 rounded-lg" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
          <div className="h-32 bg-slate-200 dark:bg-slate-800 rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div id="predictive-insights-error" className="p-6 rounded-3xl border border-red-200 dark:border-red-900/50 bg-red-50/50 dark:bg-red-950/15 text-center flex flex-col items-center justify-center py-8">
        <div className="w-12 h-12 rounded-full bg-red-100 dark:bg-red-950/30 flex items-center justify-center text-red-600 dark:text-red-400 mb-4 border border-red-200 dark:border-red-900/20">
          <AlertTriangle className="w-6 h-6" />
        </div>
        <h4 className="text-sm font-semibold text-red-800 dark:text-red-300">Predictive Engine Interrupted</h4>
        <p className="text-xs text-red-600 dark:text-red-400/80 mt-1.5 max-w-sm leading-relaxed">
          {error}
        </p>
        <button
          onClick={fetchInsights}
          className="mt-4 flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md transition-all cursor-pointer"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Calibration</span>
        </button>
      </div>
    );
  }

  if (!insights) return null;

  return (
    <div id="predictive-insights-root" className="space-y-6">
      {/* Module Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-5 h-5 text-indigo-600 dark:text-indigo-400 animate-pulse" />
            <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">Predictive Insights</h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            AI cognitive models forecasting infrastructure risks, recurring patterns, and preventive municipal actions.
          </p>
        </div>

        {/* Tab Controls */}
        <div className="flex rounded-xl bg-slate-100 dark:bg-slate-900 p-1 self-start sm:self-auto border border-slate-200/50 dark:border-slate-800">
          <button
            onClick={() => setActiveTab('hotspots')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'hotspots'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200/40 dark:border-slate-700/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Hotspots
          </button>
          <button
            onClick={() => setActiveTab('trends')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'trends'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200/40 dark:border-slate-700/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Trend Analysis
          </button>
          <button
            onClick={() => setActiveTab('actions')}
            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeTab === 'actions'
                ? 'bg-white dark:bg-slate-800 text-slate-900 dark:text-white shadow-sm border border-slate-200/40 dark:border-slate-700/40'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
            }`}
          >
            Preventive Actions
          </button>
        </div>
      </div>

      {/* Warning banner if insufficient data exists */}
      {insights.insufficientData && (
        <div id="predictive-insufficient-data-alert" className="flex items-start gap-3 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-800 dark:text-amber-400">
          <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold uppercase tracking-wider block text-[10px] text-amber-600 dark:text-amber-400 mb-0.5">AI Forecast based on available reports.</span>
            Our local database has limited active reports. Models are utilizing demo records combined with available incident templates to extrapolate regional forecasts. Results will calibrate dynamically as real municipal reports accumulate.
          </div>
        </div>
      )}

      {/* Main Active Panel Content */}
      <div className="transition-all duration-300">
        
        {/* Hotspots Section */}
        {activeTab === 'hotspots' && (
          <div id="panel-hotspots" className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
            {insights.hotspots.map((hotspot, idx) => {
              const isHigh = hotspot.riskLevel === 'high' || hotspot.riskLevel === 'critical';
              const isMed = hotspot.riskLevel === 'medium';
              
              let riskBadgeColor = 'bg-slate-100 text-slate-600 border-slate-200';
              if (hotspot.riskLevel === 'critical') {
                riskBadgeColor = 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
              } else if (hotspot.riskLevel === 'high') {
                riskBadgeColor = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
              } else if (hotspot.riskLevel === 'medium') {
                riskBadgeColor = 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
              }

              return (
                <div 
                  key={idx}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/20 hover:border-indigo-500/30 shadow-sm transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-3.5">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <MapPin className="w-3.5 h-3.5 text-slate-450 shrink-0" />
                        <span className="text-sm font-bold text-slate-900 dark:text-white truncate">{hotspot.name}</span>
                      </div>
                      <span className={`text-[9px] font-mono font-bold uppercase tracking-wide px-2 py-0.5 rounded border shrink-0 ${riskBadgeColor}`}>
                        {hotspot.riskLevel} Risk
                      </span>
                    </div>

                    <div className="space-y-3">
                      <div>
                        <p className="text-[10px] font-mono text-slate-500 uppercase">Predicted Next Issue</p>
                        <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 mt-0.5">{hotspot.predictedIssueType}</p>
                      </div>

                      <div>
                        <p className="text-[10px] font-mono text-slate-500 uppercase">AI REASONING</p>
                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed mt-1">{hotspot.reasoning}</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-5 pt-4 border-t border-slate-100 dark:border-slate-900 flex items-center justify-between">
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Activity className="w-3 h-3 text-indigo-500" />
                      PREDICTIVE CONFIDENCE
                    </span>
                    <span className="text-xs font-bold font-mono text-indigo-600 dark:text-indigo-400">{hotspot.confidence}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Trends & Projections Section with beautifully crafted SVGs */}
        {activeTab === 'trends' && (
          <div id="panel-trends" className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fadeIn">
            
            {/* Resolution Delays Projections card */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/20 shadow-sm">
              <div className="flex items-center gap-2 mb-4">
                <Clock className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Estimated Resolution Delays</h4>
              </div>
              <p className="text-xs text-slate-500 mb-6">Current dispatch efficiency compared to predicted delay in days based on volume forecasts.</p>

              <div className="space-y-5">
                {insights.resolutionDelays.map((delay, idx) => {
                  const currentPercent = Math.min(100, (delay.currentDelayDays / 10) * 100);
                  const predictedPercent = Math.min(100, (delay.predictedDelayDays / 10) * 100);
                  const isSlower = delay.predictedDelayDays > delay.currentDelayDays;

                  return (
                    <div key={idx} className="space-y-2">
                      <div className="flex justify-between items-center text-xs">
                        <span className="font-semibold text-slate-800 dark:text-slate-250">{delay.category}</span>
                        <span className="font-mono text-slate-500">
                          {delay.currentDelayDays}d → <span className={isSlower ? "text-amber-500 font-bold" : "text-emerald-500 font-bold"}>{delay.predictedDelayDays}d</span>
                        </span>
                      </div>

                      {/* Side-by-side comparative bars */}
                      <div className="space-y-1">
                        <div className="h-2 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden flex items-center relative">
                          <div 
                            className="h-full bg-slate-350 dark:bg-slate-750 rounded-full transition-all duration-500" 
                            style={{ width: `${currentPercent}%` }}
                          />
                          <span className="absolute left-2 text-[8px] font-mono text-slate-500">Current</span>
                        </div>
                        <div className="h-2.5 bg-slate-100 dark:bg-slate-900 rounded-full overflow-hidden flex items-center relative">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${isSlower ? "bg-amber-500" : "bg-indigo-500"}`} 
                            style={{ width: `${predictedPercent}%` }}
                          />
                          <span className="absolute left-2 text-[8px] font-mono text-white">Projected</span>
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-450 italic mt-1 leading-relaxed pl-2 border-l-2 border-slate-150 dark:border-slate-800">
                        {delay.delayReason}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Recurrence Category Trend Chart */}
            <div className="p-6 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/20 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <TrendingUp className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Recurrence Probabilities & Volume Trends</h4>
                </div>
                <p className="text-xs text-slate-500 mb-6">Likelihood of recurrent alerts generated over the upcoming 30-day forecast period.</p>
              </div>

              {/* Native SVG Chart to prevent layout issues */}
              <div className="relative h-48 w-full mt-2">
                <svg viewBox="0 0 400 160" className="w-full h-full font-mono text-[9px] text-slate-400 overflow-visible">
                  {/* Grid Lines */}
                  <line x1="40" y1="20" x2="380" y2="20" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3" />
                  <line x1="40" y1="60" x2="380" y2="60" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3" />
                  <line x1="40" y1="100" x2="380" y2="100" stroke="currentColor" strokeOpacity="0.1" strokeDasharray="3" />
                  <line x1="40" y1="140" x2="380" y2="140" stroke="currentColor" strokeOpacity="0.1" />

                  {/* Y Axis Labels */}
                  <text x="32" y="24" textAnchor="end">100%</text>
                  <text x="32" y="64" textAnchor="end">50%</text>
                  <text x="32" y="104" textAnchor="end">25%</text>
                  <text x="32" y="144" textAnchor="end">0%</text>

                  {/* Draw Trend Bars */}
                  {insights.recurringCategories.map((item, idx) => {
                    const xPos = 80 + idx * 110;
                    const valHeight = (item.recurrenceScore / 100) * 120; // max height is 120px
                    const yPos = 140 - valHeight;

                    return (
                      <g key={idx} className="group">
                        {/* Shadow/Glow effect bar */}
                        <rect 
                          x={xPos} 
                          y={yPos} 
                          width="24" 
                          height={valHeight} 
                          rx="4" 
                          fill="url(#indigoGrad)" 
                          className="opacity-80 group-hover:opacity-100 transition-opacity cursor-pointer"
                        />
                        {/* Trend badge */}
                        <text 
                          x={xPos + 12} 
                          y={yPos - 6} 
                          textAnchor="middle" 
                          fontWeight="bold" 
                          fill={item.trend === 'rising' ? '#f59e0b' : '#3b82f6'}
                        >
                          {item.trend === 'rising' ? '▲' : '●'} {item.recurrenceScore}%
                        </text>
                        {/* Category Label */}
                        <text x={xPos + 12} y="154" textAnchor="middle" className="fill-slate-500 dark:fill-slate-400 font-sans">
                          {item.category.length > 15 ? `${item.category.slice(0, 12)}...` : item.category}
                        </text>
                      </g>
                    );
                  })}

                  {/* Gradient definition */}
                  <defs>
                    <linearGradient id="indigoGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#4f46e5" stopOpacity="0.1" />
                    </linearGradient>
                  </defs>
                </svg>
              </div>

              <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-900 grid grid-cols-2 gap-4">
                {insights.recurringCategories.map((item, idx) => (
                  <div key={idx} className="text-xs space-y-0.5">
                    <span className="font-semibold text-slate-800 dark:text-slate-350">{item.category}</span>
                    <p className="text-[11px] text-slate-500 leading-normal line-clamp-2">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Preventive Actions Section */}
        {activeTab === 'actions' && (
          <div id="panel-preventive-actions" className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-fadeIn">
            {insights.preventiveActions.map((action, idx) => {
              let urgencyBadge = 'bg-slate-100 text-slate-600 border-slate-200';
              if (action.urgency === 'critical') {
                urgencyBadge = 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
              } else if (action.urgency === 'high') {
                urgencyBadge = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
              } else if (action.urgency === 'medium') {
                urgencyBadge = 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
              }

              return (
                <div 
                  key={idx}
                  className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/20 hover:border-indigo-500/30 shadow-sm transition-all flex flex-col justify-between"
                >
                  <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                      <div className="p-2.5 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400 border border-indigo-150 dark:border-indigo-500/20 shrink-0">
                        <Lightbulb className="w-4 h-4" />
                      </div>
                      <span className={`text-[9px] font-mono font-bold uppercase tracking-wide px-2 py-0.5 rounded border shrink-0 ${urgencyBadge}`}>
                        {action.urgency} Urgency
                      </span>
                    </div>

                    <div className="space-y-1.5">
                      <h5 className="text-sm font-bold text-slate-900 dark:text-white leading-snug">{action.title}</h5>
                      <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">{action.action}</p>
                    </div>

                    <div className="pt-3 border-t border-slate-50 dark:border-slate-900 space-y-2">
                      <div className="text-[11px]">
                        <span className="font-mono text-slate-400 block uppercase">Department Target</span>
                        <span className="font-semibold text-slate-700 dark:text-slate-350">{action.targetDepartment}</span>
                      </div>
                      <div className="text-[11px]">
                        <span className="font-mono text-slate-400 block uppercase">Expected Impact</span>
                        <span className="text-slate-600 dark:text-slate-450 leading-relaxed">{action.impact}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
