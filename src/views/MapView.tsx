import { useState } from 'react';
import { 
  MapPin, 
  Compass, 
  Radio
} from 'lucide-react';
import { IssueReport } from '../types';

import { Language } from '../utils/i18n';

interface MapViewProps {
  reports: IssueReport[];
  onSelectReport: (report: IssueReport) => void;
  language?: Language;
}

export default function MapView({ reports, onSelectReport, language }: MapViewProps) {
  const [selectedPinId, setSelectedPinId] = useState<string>(reports[0]?.id || '');
  const [activeLayer, setActiveLayer] = useState<'standard' | 'satellite' | 'thermal'>('standard');

  const selectedReport = reports.find(r => r.id === selectedPinId) || reports[0];

  const handlePinClick = (report: IssueReport) => {
    setSelectedPinId(report.id);
    onSelectReport(report);
  };

  return (
    <div id="map-view" className="grid grid-cols-1 lg:grid-cols-4 gap-8 pb-12 transition-colors duration-300">
      {/* Large Map Visualizer (Left Column 3/4) */}
      <div className="lg:col-span-3 flex flex-col space-y-4">
        {/* Map Header Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 shadow-sm transition-colors">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg text-indigo-600 dark:text-indigo-400 transition-colors">
              <Compass className="w-4 h-4 animate-spin-slow" />
            </div>
            <div>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">MAP_RADAR_COORDINATOR</p>
              <h4 className="text-xs font-bold text-slate-800 dark:text-white mt-0.5 font-sans">District 4 Geospatial Matrix</h4>
            </div>
          </div>

          {/* Map Layers */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-slate-900/60 p-1 rounded-xl border border-slate-200 dark:border-slate-800 text-xs transition-colors">
            {(['standard', 'satellite', 'thermal'] as const).map((layer) => (
              <button
                key={layer}
                id={`map-layer-${layer}`}
                onClick={() => setActiveLayer(layer)}
                className={`px-3 py-1.5 rounded-lg capitalize font-medium transition-all cursor-pointer ${
                  activeLayer === layer
                    ? 'bg-indigo-600 text-white font-semibold shadow-sm'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white'
                }`}
              >
                {layer}
              </button>
            ))}
          </div>
        </div>

        {/* High-Fidelity Custom Vector Map Canvas */}
        <div className={`relative h-[550px] rounded-2xl border transition-all duration-500 overflow-hidden group ${
          activeLayer === 'satellite'
            ? 'bg-slate-950 border-emerald-900/30 shadow-inner'
            : activeLayer === 'thermal'
            ? 'bg-zinc-950 border-rose-950/45 shadow-inner'
            : 'bg-slate-50 dark:bg-[#070b13] border-slate-200 dark:border-slate-800'
        }`}>
          {/* Grid Blueprint Styling lines */}
          {activeLayer === 'standard' && (
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(99,102,241,0.05)_1px,transparent_1px),linear-gradient(to_bottom,rgba(99,102,241,0.05)_1px,transparent_1px)] bg-[size:3rem_3rem] opacity-50 dark:opacity-100 transition-opacity duration-500" />
          )}
          {activeLayer === 'satellite' && (
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(16,185,129,0.04)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,185,129,0.04)_1px,transparent_1px)] bg-[size:2rem_2rem] opacity-75 transition-opacity duration-500" />
          )}
          {activeLayer === 'thermal' && (
            <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(239,68,68,0.03)_1px,transparent_1px),linear-gradient(to_bottom,rgba(239,68,68,0.03)_1px,transparent_1px)] bg-[size:1.5rem_1.5rem] opacity-60 transition-opacity duration-500" />
          )}
          
          {/* Radial radar scan effect */}
          <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full border animate-ping opacity-35 pointer-events-none ${
            activeLayer === 'satellite' ? 'border-emerald-500/5' : activeLayer === 'thermal' ? 'border-red-500/5' : 'border-indigo-500/5'
          }`} style={{ animationDuration: '6s' }} />

          {/* Simulated Geographic Street Mockup Lines (Premium aesthetic overlay) */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none transition-opacity duration-500" xmlns="http://www.w3.org/2000/svg">
            {activeLayer === 'standard' && (
              <g className="opacity-[0.15] dark:opacity-[0.12] transition-opacity duration-500">
                <path d="M 0 100 Q 300 120 600 80 T 1200 140" fill="transparent" stroke="#4f46e5" strokeWidth="4" />
                <path d="M 100 0 Q 180 300 220 600" fill="transparent" stroke="#4f46e5" strokeWidth="2" />
                <path d="M 350 0 L 350 600" fill="transparent" stroke="#4f46e5" strokeWidth="3" strokeDasharray="5,5" />
                <path d="M 0 450 L 1200 450" fill="transparent" stroke="#4f46e5" strokeWidth="3" />
                <path d="M 600 0 L 800 600" fill="transparent" stroke="#4f46e5" strokeWidth="2" />
                <path d="M 0 300 C 200 280, 400 350, 1200 200" fill="transparent" stroke="#4f46e5" strokeWidth="1.5" />
              </g>
            )}
            {activeLayer === 'satellite' && (
              <g className="opacity-25 transition-opacity duration-500">
                {/* Build footprints */}
                <rect x="15%" y="20%" width="40" height="30" rx="4" fill="#042f1a" stroke="#10b981" strokeWidth="1" className="opacity-40" />
                <rect x="45%" y="15%" width="60" height="45" rx="6" fill="#042f1a" stroke="#10b981" strokeWidth="1" className="opacity-40" />
                <rect x="75%" y="60%" width="50" height="35" rx="4" fill="#042f1a" stroke="#10b981" strokeWidth="1" className="opacity-40" />
                <rect x="30%" y="70%" width="80" height="40" rx="6" fill="#042f1a" stroke="#10b981" strokeWidth="1" className="opacity-40" />
                
                {/* Infrastructure grid */}
                <path d="M 0 100 Q 300 120 600 80 T 1200 140" fill="transparent" stroke="#10b981" strokeWidth="3" strokeDasharray="2,2" />
                <path d="M 100 0 Q 180 300 220 600" fill="transparent" stroke="#10b981" strokeWidth="1.5" />
                <path d="M 350 0 L 350 600" fill="transparent" stroke="#10b981" strokeWidth="2" strokeDasharray="10,5" />
                <path d="M 0 450 L 1200 450" fill="transparent" stroke="#10b981" strokeWidth="2" />
                <path d="M 600 0 L 800 600" fill="transparent" stroke="#10b981" strokeWidth="1.5" />
              </g>
            )}
            {activeLayer === 'thermal' && (
              <g className="opacity-20 transition-opacity duration-500">
                <path d="M 0 100 Q 300 120 600 80 T 1200 140" fill="transparent" stroke="#ef4444" strokeWidth="2" />
                <path d="M 100 0 Q 180 300 220 600" fill="transparent" stroke="#ef4444" strokeWidth="1" />
                <path d="M 350 0 L 350 600" fill="transparent" stroke="#ef4444" strokeWidth="1.5" strokeDasharray="4,4" />
                <path d="M 0 450 L 1200 450" fill="transparent" stroke="#ef4444" strokeWidth="2" />
                <path d="M 600 0 L 800 600" fill="transparent" stroke="#ef4444" strokeWidth="1" />
              </g>
            )}
          </svg>
          
          {/* Simulated Satellite Terrain Features */}
          {activeLayer === 'satellite' && (
            <div className="absolute inset-0 pointer-events-none transition-all duration-500">
              {/* Forest / Green Zone */}
              <div className="absolute top-1/4 left-1/12 w-[160px] h-[100px] rounded-full bg-emerald-950/20 blur-xl" />
              <div className="absolute bottom-1/3 right-1/4 w-[220px] h-[140px] rounded-full bg-emerald-900/10 blur-2xl" />
              {/* Lake / Water Zone */}
              <div className="absolute top-1/3 right-1/12 w-[200px] h-[150px] rounded-full bg-blue-950/20 blur-xl" />
              <div className="absolute bottom-1/12 left-1/4 w-[180px] h-[100px] rounded-full bg-cyan-950/15 blur-xl" />
              
              {/* Coordinate Grid HUD Elements */}
              <div className="absolute top-4 right-4 text-[8px] font-mono text-emerald-500/50 flex flex-col items-end gap-0.5">
                <span>ORBIT_RECON: PASS_04</span>
                <span>ALTITUDE: 154.2 KM</span>
                <span>GRID: D4-SF-W1</span>
              </div>
            </div>
          )}

          {/* Simulated Thermal Heatmap Glows under each pin */}
          {activeLayer === 'thermal' && (
            <div className="absolute inset-0 pointer-events-none transition-all duration-500">
              {/* Thermal color grading overlay */}
              <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-transparent via-black/10 to-black/40 mix-blend-color-dodge" />
              
              {/* Scanlines */}
              <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:100%_4px]" />
              
              {/* Dynamic Heat Zones mapping precisely to the reports positions */}
              {reports.map((report, idx) => {
                const mapX = 15 + (idx * 16) + (report.location.lat % 0.05) * 800;
                const mapY = 20 + (idx * 12) + (report.location.lng % 0.05) * 800;
                const isCritical = report.severity === 'critical';
                const isHigh = report.severity === 'high';
                
                return (
                  <div 
                    key={`heat-${report.id}`}
                    style={{ 
                      left: `${Math.max(5, Math.min(90, mapX))}%`, 
                      top: `${Math.max(5, Math.min(85, mapY))}%`,
                    }}
                    className="absolute -translate-x-1/2 -translate-y-1/2 pointer-events-none transition-all"
                  >
                    {/* Inner high-heat core (bright yellow/orange) */}
                    <div className={`rounded-full animate-pulse blur-md ${
                      isCritical ? 'w-16 h-16 bg-amber-400/40' : isHigh ? 'w-12 h-12 bg-orange-500/30' : 'w-8 h-8 bg-yellow-500/20'
                    }`} style={{ animationDuration: '2s' }} />
                    {/* Outer ambient heat ring (red/purple) */}
                    <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 rounded-full animate-pulse blur-xl ${
                      isCritical ? 'w-36 h-36 bg-red-600/15' : isHigh ? 'w-28 h-28 bg-rose-600/10' : 'w-16 h-16 bg-purple-600/5'
                    }`} style={{ animationDuration: '3s' }} />
                  </div>
                );
              })}
            </div>
          )}

          {/* Compass layout widget on map */}
          <div className="absolute bottom-6 left-6 p-3 rounded-xl bg-white/90 dark:bg-slate-950/80 border border-slate-200 dark:border-slate-800/80 backdrop-blur-md text-[10px] font-mono text-slate-500 dark:text-slate-400 flex flex-col gap-1 pointer-events-none transition-colors">
            <span className="text-slate-800 dark:text-white font-bold flex items-center gap-1">
              <Compass className={`w-3.5 h-3.5 ${
                activeLayer === 'satellite' ? 'text-emerald-500 animate-spin-slow' : activeLayer === 'thermal' ? 'text-rose-500' : 'text-indigo-600 dark:text-indigo-400'
              }`} />
              {activeLayer === 'satellite' ? 'SATELLITE_ORBIT' : activeLayer === 'thermal' ? 'THERMAL_FLUX' : 'NORTH_ANCHOR'}
            </span>
            <span>LAT: 37.7749 N</span>
            <span>LNG: 122.4194 W</span>
            <span>ZOOM: 14.5x LEVEL</span>
            {activeLayer === 'thermal' && <span className="text-red-500 font-bold animate-pulse">HEAT_FLUX: HOTSPOT</span>}
            {activeLayer === 'satellite' && <span className="text-emerald-500 font-bold">RECON_MODE: CALIBRATED</span>}
          </div>

          {/* Dynamic Glowing Pins on map */}
          {reports.map((report, idx) => {
            const isSelected = report.id === selectedPinId;
            
            // Generate deterministic grid placement on our virtual canvas
            const mapX = 15 + (idx * 16) + (report.location.lat % 0.05) * 800;
            const mapY = 20 + (idx * 12) + (report.location.lng % 0.05) * 800;
            
            return (
              <button
                key={report.id}
                id={`map-pin-${report.id}`}
                onClick={() => handlePinClick(report)}
                style={{ 
                  left: `${Math.max(5, Math.min(90, mapX))}%`, 
                  top: `${Math.max(5, Math.min(85, mapY))}%` 
                }}
                className="absolute -translate-x-1/2 -translate-y-1/2 focus:outline-none z-10 group cursor-pointer"
              >
                {/* Ping rings */}
                <span className={`absolute inset-0 rounded-full animate-ping opacity-60 ${
                  report.severity === 'critical'
                    ? 'bg-red-500'
                    : report.severity === 'high'
                    ? 'bg-amber-500'
                    : 'bg-indigo-500'
                }`} style={{ animationDuration: isSelected ? '1.5s' : '3s' }} />

                {/* Pin element core */}
                <div className={`p-2 rounded-full border transition-all shadow-lg ${
                  isSelected 
                    ? 'bg-indigo-600 border-white text-white scale-125 z-20 shadow-indigo-500/20' 
                    : report.severity === 'critical'
                    ? 'bg-red-100 dark:bg-red-500/20 border-red-500 text-red-600 dark:text-red-400 hover:scale-110'
                    : report.severity === 'high'
                    ? 'bg-amber-100 dark:bg-amber-500/20 border-amber-500 text-amber-600 dark:text-amber-400 hover:scale-110'
                    : 'bg-indigo-100 dark:bg-indigo-500/20 border-indigo-500 text-indigo-600 dark:text-indigo-400 hover:scale-110'
                }`}>
                  <MapPin className="w-4 h-4" />
                </div>

                {/* Floating mini-label on hover */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-full mb-2 bg-slate-950 dark:bg-slate-900 border border-slate-800 text-[10px] font-sans text-white py-1 px-2.5 rounded-md whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none shadow-xl z-30">
                  <div className="flex items-center gap-1.5">
                    <p className="font-semibold">
                      {language === 'hi' && report.translatedTitle ? report.translatedTitle : report.title}
                    </p>
                    {report.isDemo ? (
                      <span className="text-[7px] font-bold font-mono px-1 bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded">DEMO</span>
                    ) : (
                      <span className="text-[7px] font-bold font-mono px-1 bg-indigo-500/20 text-indigo-450 border border-indigo-500/30 rounded animate-pulse">LIVE</span>
                    )}
                  </div>
                  <p className="text-slate-400 font-mono text-[9px] mt-0.5">
                    {report.id} • {language === 'hi' && report.translatedCategory ? report.translatedCategory : report.category}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Sidebar - Dynamic Incident Inspector & Coverage Panel */}
      <div className="lg:col-span-1 space-y-6">
        {/* Selected Incident Inspector */}
        {selectedReport ? (
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 space-y-4 shadow-sm transition-colors">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-1.5 flex-wrap">
                  <span className={`text-[9px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded border ${
                    selectedReport.severity === 'critical'
                      ? 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-150 dark:border-red-500/20'
                      : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-150 dark:border-indigo-500/20'
                  }`}>
                    {selectedReport.severity}
                  </span>
                  {selectedReport.isDemo ? (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-500 border-amber-150 dark:border-amber-500/20">
                      DEMO CASE
                    </span>
                  ) : (
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 rounded border bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-150 dark:border-indigo-500/20 animate-pulse">
                      LIVE ANALYSIS
                    </span>
                  )}
                </div>
                <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-2">DOCKET_NUM: #{selectedReport.id}</p>
              </div>

              <span className={`h-2.5 w-2.5 rounded-full ${
                selectedReport.status === 'resolved' ? 'bg-emerald-500' : 'bg-indigo-500 animate-pulse'
              }`} />
            </div>

            <h4 className="text-sm font-bold text-slate-900 dark:text-white font-display">
              {language === 'hi' && selectedReport.translatedTitle ? selectedReport.translatedTitle : selectedReport.title}
            </h4>

            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed line-clamp-3">
              {language === 'hi' && selectedReport.translatedDescription ? selectedReport.translatedDescription : selectedReport.description}
            </p>

            <div className="text-xs font-mono space-y-2 pt-2 border-t border-slate-100 dark:border-slate-900 text-slate-500 dark:text-slate-400 transition-colors">
              <div className="flex items-start gap-1.5 text-slate-600 dark:text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 shrink-0 mt-0.5" />
                <span>{selectedReport.location.address}</span>
              </div>
              <div className="flex justify-between items-center text-[10px] text-slate-400 dark:text-slate-500 pt-1">
                <span>LAT: {selectedReport.location.lat.toFixed(4)}° N</span>
                <span>LNG: {selectedReport.location.lng.toFixed(4)}° W</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="p-6 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 text-center py-8 bg-slate-50/50 dark:bg-slate-950/20 transition-colors">
            <p className="text-xs text-slate-400 dark:text-slate-500">Select a map anchor to inspect ticket details</p>
          </div>
        )}

        {/* Future Vision / Mission Roadmap Panel */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 space-y-4 shadow-sm transition-colors">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
            <Radio className="w-4 h-4 text-indigo-500 dark:text-indigo-400 animate-pulse" />
            Sensor Coverage Overlay
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-500 leading-relaxed">
            Configure future drone flight paths and diagnostic sonar arrays to auto-corroborate public infrastructure health indices.
          </p>

          <div className="space-y-2">
            <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-150 dark:border-slate-800 text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed transition-colors">
              <p className="font-semibold text-slate-800 dark:text-slate-300 flex items-center gap-1 font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600"></span>
                Acoustic Leak Detection (Future)
              </p>
              <p className="mt-1">Analyze water pipe audio feeds to locate silent pressure drops before sinkholes develop.</p>
            </div>

            <div className="p-3 bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-150 dark:border-slate-800 text-[11px] text-slate-550 dark:text-slate-400 leading-relaxed transition-colors">
              <p className="font-semibold text-slate-800 dark:text-slate-300 flex items-center gap-1 font-sans">
                <span className="w-1.5 h-1.5 rounded-full bg-slate-400 dark:bg-slate-600"></span>
                Automated Drone Pathing (Future)
              </p>
              <p className="mt-1">Deploy aerial inspection pathways linked to report vectors to gather close-up structural images.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
