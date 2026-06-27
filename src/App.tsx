import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Sidebar from './components/Sidebar';
import TopNav from './components/TopNav';
import MobileNav from './components/MobileNav';
import DashboardView from './views/DashboardView';
import ReportIssueView from './views/ReportIssueView';
import MissionControlView from './views/MissionControlView';
import GeneratedCaseView from './views/GeneratedCaseView';
import MapView from './views/MapView';
import ImpactDashboardView from './views/ImpactDashboardView';
import MunicipalCommandCenterView from './views/MunicipalCommandCenterView';
import AccessibilityView from './views/AccessibilityView';
import { View, IssueReport } from './types';
import { INITIAL_REPORTS } from './data/mockData';
import { DemoCase } from './data/demoCases';
import CitizenProfileView from './views/CitizenProfileView';
import { getInitialProfileState, CitizenProfileState, GAMIFICATION_RULES } from './utils/gamification';
import { Language } from './utils/i18n';

export default function App() {
  // Loading screen state
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'light' || saved === 'dark') return saved;
    return 'dark'; // default to dark
  });

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Language & Accessibility States
  const [language, setLanguage] = useState<Language>(() => {
    const saved = localStorage.getItem('civicpilot_language');
    if (saved === 'en' || saved === 'hi') return saved as Language;
    return 'en';
  });

  const [fontSize, setFontSize] = useState<'sm' | 'base' | 'lg' | 'xl'>(() => {
    const saved = localStorage.getItem('civicpilot_fontSize');
    if (saved === 'sm' || saved === 'base' || saved === 'lg' || saved === 'xl') return saved as any;
    return 'base';
  });

  const [highContrast, setHighContrast] = useState<boolean>(() => {
    return localStorage.getItem('civicpilot_highContrast') === 'true';
  });

  const [reducedMotion, setReducedMotion] = useState<boolean>(() => {
    return localStorage.getItem('civicpilot_reducedMotion') === 'true';
  });

  const [colorBlindMode, setColorBlindMode] = useState<'none' | 'grayscale' | 'protanopia' | 'deuteranopia' | 'tritanopia'>(() => {
    const saved = localStorage.getItem('civicpilot_colorBlindMode');
    if (saved === 'none' || saved === 'grayscale' || saved === 'protanopia' || saved === 'deuteranopia' || saved === 'tritanopia') return saved as any;
    return 'none';
  });

  // Sync / apply language and accessibility styles
  useEffect(() => {
    localStorage.setItem('civicpilot_language', language);
  }, [language]);

  useEffect(() => {
    const root = window.document.documentElement;
    localStorage.setItem('civicpilot_fontSize', fontSize);
    if (fontSize === 'sm') {
      root.style.fontSize = '14px';
    } else if (fontSize === 'base') {
      root.style.fontSize = '16px';
    } else if (fontSize === 'lg') {
      root.style.fontSize = '18px';
    } else if (fontSize === 'xl') {
      root.style.fontSize = '20px';
    }
  }, [fontSize]);

  useEffect(() => {
    const root = window.document.documentElement;
    localStorage.setItem('civicpilot_highContrast', String(highContrast));
    if (highContrast) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [highContrast]);

  useEffect(() => {
    const root = window.document.documentElement;
    localStorage.setItem('civicpilot_reducedMotion', String(reducedMotion));
    if (reducedMotion) {
      root.classList.add('reduced-motion');
    } else {
      root.classList.remove('reduced-motion');
    }
  }, [reducedMotion]);

  useEffect(() => {
    const root = window.document.documentElement;
    localStorage.setItem('civicpilot_colorBlindMode', colorBlindMode);
    root.classList.remove('cb-grayscale', 'cb-protanopia', 'cb-deuteranopia', 'cb-tritanopia');
    if (colorBlindMode !== 'none') {
      root.classList.add(`cb-${colorBlindMode}`);
    }
  }, [colorBlindMode]);

  // Navigation & Data States
  const [currentView, setCurrentView] = useState<View>('dashboard');
  const [reports, setReports] = useState<IssueReport[]>(() => 
    INITIAL_REPORTS.map(r => ({ ...r, isDemo: true }))
  );
  const [activeReport, setActiveReport] = useState<IssueReport | null>(() => {
    const defaultReports = INITIAL_REPORTS.map(r => ({ ...r, isDemo: true }));
    return defaultReports[0] || null;
  });

  // On-the-fly translate active report analysis if language switches to Hindi
  useEffect(() => {
    const translateActiveReport = async () => {
      if (activeReport && activeReport.analysis) {
        const isCurrentlyHindi = activeReport.analysis.title && (
          activeReport.analysis.title.startsWith("संज्ञानात्मक") || 
          /[\u0900-\u097F]/.test(activeReport.analysis.title)
        );

        if (language === 'hi' && !isCurrentlyHindi) {
          try {
            const res = await fetch('/api/translate', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                analysis: activeReport.analysis,
                title: activeReport.title,
                description: activeReport.description,
                category: activeReport.category,
                targetLang: 'hi'
              })
            });
            if (res.ok) {
              const translatedAnalysis = await res.json();
              setReports(prev => prev.map(r => r.id === activeReport.id ? {
                ...r,
                analysis: translatedAnalysis,
                aiSummary: translatedAnalysis.summary,
                translatedTitle: translatedAnalysis.translatedTitle,
                translatedDescription: translatedAnalysis.translatedDescription,
                translatedCategory: translatedAnalysis.translatedCategory,
              } : r));
              setActiveReport(prev => prev && prev.id === activeReport.id ? {
                ...prev,
                analysis: translatedAnalysis,
                aiSummary: translatedAnalysis.summary,
                translatedTitle: translatedAnalysis.translatedTitle,
                translatedDescription: translatedAnalysis.translatedDescription,
                translatedCategory: translatedAnalysis.translatedCategory,
              } : prev);
            }
          } catch (err) {
            console.error("On-the-fly translation error:", err);
          }
        }
      }
    };
    translateActiveReport();
  }, [language, activeReport?.id]);

  // Demo Mode States
  const [demoMode, setDemoMode] = useState<boolean>(false);
  const [prefilledDemo, setPrefilledDemo] = useState<DemoCase | null>(null);

  // Load profiles from localStorage or get initial states
  const [liveProfile, setLiveProfile] = useState<CitizenProfileState>(() => {
    const saved = localStorage.getItem('civicpilot_live_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return getInitialProfileState(false);
  });

  const [demoProfile, setDemoProfile] = useState<CitizenProfileState>(() => {
    const saved = localStorage.getItem('civicpilot_demo_profile');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return getInitialProfileState(true);
  });

  // Sync profiles to localStorage
  useEffect(() => {
    localStorage.setItem('civicpilot_live_profile', JSON.stringify(liveProfile));
  }, [liveProfile]);

  useEffect(() => {
    localStorage.setItem('civicpilot_demo_profile', JSON.stringify(demoProfile));
  }, [demoProfile]);

  const handleAddActivity = (type: 'report' | 'verify' | 'evidence' | 'comment' | 'duplicate') => {
    const pointsToAdd = GAMIFICATION_RULES[
      type === 'report' ? 'REPORT_VALID' :
      type === 'verify' ? 'VERIFY_REPORT' :
      type === 'evidence' ? 'UPLOAD_EVIDENCE' :
      type === 'comment' ? 'ADD_COMMENT' : 'RESOLVE_DUPLICATE'
    ];

    const updateProfile = (prev: CitizenProfileState) => {
      const updatedBreakdown = { ...prev.pointsBreakdown };
      if (type === 'report') updatedBreakdown.reportsCount += 1;
      else if (type === 'verify') updatedBreakdown.verificationsCount += 1;
      else if (type === 'evidence') updatedBreakdown.evidenceCount += 1;
      else if (type === 'comment') updatedBreakdown.commentsCount += 1;
      else if (type === 'duplicate') updatedBreakdown.duplicatesCount += 1;

      const newPoints = prev.points + pointsToAdd;
      
      const newTrustScore = Math.min(
        100,
        Math.max(
          50,
          75 + (updatedBreakdown.verificationsCount * 3) + (updatedBreakdown.evidenceCount * 5) - (updatedBreakdown.duplicatesCount * 2)
        )
      );

      const newlyUnlockedBadges = [...prev.unlockedBadges];
      
      if (updatedBreakdown.reportsCount >= 1 && !newlyUnlockedBadges.includes('first-reporter')) {
        newlyUnlockedBadges.push('first-reporter');
      }
      if (updatedBreakdown.verificationsCount >= 3 && !newlyUnlockedBadges.includes('verified-citizen')) {
        newlyUnlockedBadges.push('verified-citizen');
      }
      if (updatedBreakdown.reportsCount >= 3 && !newlyUnlockedBadges.includes('guardian-city')) {
        newlyUnlockedBadges.push('guardian-city');
      }
      if (newPoints >= 300 && !newlyUnlockedBadges.includes('top-contributor')) {
        newlyUnlockedBadges.push('top-contributor');
      }
      if (updatedBreakdown.reportsCount >= 2 && !newlyUnlockedBadges.includes('ai-collaborator')) {
        newlyUnlockedBadges.push('ai-collaborator');
      }
      if (newTrustScore >= 95 && !newlyUnlockedBadges.includes('community-hero')) {
        newlyUnlockedBadges.push('community-hero');
      }

      return {
        ...prev,
        points: newPoints,
        pointsBreakdown: updatedBreakdown,
        trustScore: newTrustScore,
        unlockedBadges: newlyUnlockedBadges
      };
    };

    if (demoMode) {
      setDemoProfile(prev => updateProfile(prev));
    } else {
      setLiveProfile(prev => updateProfile(prev));
    }
  };

  const handleSelectDemoCase = (demo: DemoCase) => {
    setPrefilledDemo(demo);
    setCurrentView('report');
  };

  // Handle addition of newly generated user reports
  const handleAddReport = (newReport: IssueReport) => {
    setReports(prev => [newReport, ...prev]);
    setActiveReport(newReport);
    
    // Reward points for report
    handleAddActivity('report');
    if (newReport.imageUrl) {
      handleAddActivity('evidence');
    }
  };

  const handleJoinReport = (reportId: string) => {
    setReports(prev => prev.map(report => {
      if (report.id === reportId) {
        const verifications = (report.communityVerification?.verifications || 0) + 1;
        const currentTimeline = report.communityVerification?.timeline || [];
        const currentComments = report.communityVerification?.comments || [];
        
        const newTimelineEvent = {
          id: `evt-join-${Math.random().toString(36).substr(2, 9)}`,
          citizenName: 'Reporter (You)',
          type: 'verify' as const,
          comment: 'Joined report. Citizen verified active duplicate hazard on site.',
          timestamp: new Date().toISOString()
        };

        const newComment = {
          author: 'Reporter (You)',
          text: 'Joined report. Citizen verified active duplicate hazard on site.',
          timestamp: new Date().toISOString(),
          type: 'verify' as const
        };

        const updatedVerification = {
          ...report.communityVerification,
          verifications,
          comments: [...currentComments, newComment],
          timeline: [...currentTimeline, newTimelineEvent]
        };

        // Increase AI confidence
        const updatedAnalysis = report.analysis ? {
          ...report.analysis,
          confidence: Math.min(100, (report.analysis.confidence || 85) + 5),
          agents: report.analysis.agents ? {
            ...report.analysis.agents,
            verification: report.analysis.agents.verification ? {
              ...report.analysis.agents.verification,
              confidence: Math.min(100, (report.analysis.agents.verification.confidence || 90) + 5),
              reasoning: `Confidence boosted by additional citizen joining this report. Total verifications: ${verifications}.`
            } : undefined
          } : undefined
        } : undefined;

        return {
          ...report,
          communityVerification: updatedVerification,
          ...(updatedAnalysis ? { analysis: updatedAnalysis } : {})
        };
      }
      return report;
    }));

    setActiveReport(prev => {
      if (prev && prev.id === reportId) {
        const verifications = (prev.communityVerification?.verifications || 0) + 1;
        const currentTimeline = prev.communityVerification?.timeline || [];
        const currentComments = prev.communityVerification?.comments || [];

        const newTimelineEvent = {
          id: `evt-join-${Math.random().toString(36).substr(2, 9)}`,
          citizenName: 'Reporter (You)',
          type: 'verify' as const,
          comment: 'Joined report. Citizen verified active duplicate hazard on site.',
          timestamp: new Date().toISOString()
        };

        const newComment = {
          author: 'Reporter (You)',
          text: 'Joined report. Citizen verified active duplicate hazard on site.',
          timestamp: new Date().toISOString(),
          type: 'verify' as const
        };

        const updatedVerification = {
          ...prev.communityVerification,
          verifications,
          comments: [...currentComments, newComment],
          timeline: [...currentTimeline, newTimelineEvent]
        };

        const updatedAnalysis = prev.analysis ? {
          ...prev.analysis,
          confidence: Math.min(100, (prev.analysis.confidence || 85) + 5),
          agents: prev.analysis.agents ? {
            ...prev.analysis.agents,
            verification: prev.analysis.agents.verification ? {
              ...prev.analysis.agents.verification,
              confidence: Math.min(100, (prev.analysis.agents.verification.confidence || 90) + 5),
              reasoning: `Confidence boosted by additional citizen joining this report. Total verifications: ${verifications}.`
            } : undefined
          } : undefined
        } : undefined;

        return {
          ...prev,
          communityVerification: updatedVerification,
          ...(updatedAnalysis ? { analysis: updatedAnalysis } : {})
        };
      }
      return prev;
    });

    // Update citizen participation statistics
    handleAddActivity('verify');
  };

  // Callback to update status after agent simulation finishes
  const handleUpdateReportStatus = (
    id: string, 
    status: 'resolved' | 'active' | 'failed', 
    ticketId: string, 
    summary: string, 
    analysis?: any,
    severity?: 'low' | 'medium' | 'high' | 'critical'
  ) => {
    setReports(prev => prev.map(report => 
      report.id === id 
        ? { 
            ...report, 
            status, 
            ticketId, 
            aiSummary: summary, 
            ...(analysis ? { analysis } : {}),
            ...(severity ? { severity } : {})
          } 
        : report
    ));
    // Also update our active report view reference
    setActiveReport(prev => prev && prev.id === id 
      ? { 
          ...prev, 
          status, 
          ticketId, 
          aiSummary: summary, 
          ...(analysis ? { analysis } : {}),
          ...(severity ? { severity } : {})
        } 
      : prev
    );
  };

  // Handle updates to community verification
  const handleUpdateVerification = (id: string, updatedVerification: any, updatedAnalysis?: any) => {
    setReports(prev => prev.map(report => 
      report.id === id 
        ? { 
            ...report, 
            communityVerification: updatedVerification,
            ...(updatedAnalysis ? { analysis: updatedAnalysis } : {})
          } 
        : report
    ));
    setActiveReport(prev => prev && prev.id === id 
      ? { 
          ...prev, 
          communityVerification: updatedVerification,
          ...(updatedAnalysis ? { analysis: updatedAnalysis } : {})
        } 
      : prev
    );

    // Dynamic award of points depending on verification type!
    if (updatedVerification?.timeline?.length > 0) {
      // Filter out AI updates, base initialization reports, etc.
      const citizenEvents = updatedVerification.timeline.filter((e: any) => 
        e.type !== 'ai_update' && 
        e.id !== 'init-evt' && 
        e.id !== 'evt-init' && 
        !e.id.startsWith('init')
      );
      if (citizenEvents.length > 0) {
        const lastEvent = citizenEvents[citizenEvents.length - 1];
        if (lastEvent.type === 'verify') {
          handleAddActivity('verify');
        } else if (lastEvent.type === 'duplicate') {
          handleAddActivity('duplicate');
        } else if (lastEvent.type === 'inaccurate') {
          handleAddActivity('verify');
        }
        
        if (lastEvent.comment && lastEvent.comment.trim().length > 3) {
          handleAddActivity('comment');
        }
      }
    }
  };

  // Compute live active missions
  const hasUnfinishedMission = reports.some(r => r.status === 'analyzing');
  const activeMissionCount = reports.filter(r => r.status === 'analyzing').length;

  const pageVariants = {
    initial: { opacity: 0, y: 8 },
    animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
    exit: { opacity: 0, y: -8, transition: { duration: 0.25, ease: "easeIn" } }
  };

  return (
    <div 
      id="civicpilot-app-root"
      className="min-h-screen bg-slate-50 dark:bg-[#050505] text-slate-800 dark:text-slate-100 font-sans antialiased overflow-x-hidden pb-16 md:pb-0 transition-colors duration-300"
    >
      <AnimatePresence mode="wait">
        {isLoading && (
          <motion.div 
            key="splash-screen"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, transition: { duration: 0.35, ease: "easeInOut" } }}
            className="fixed inset-0 flex flex-col items-center justify-center bg-slate-50 dark:bg-[#050505] z-50 transition-colors duration-300"
          >
            <div className="relative flex flex-col items-center max-w-sm px-6 text-center">
              {/* Logo Container with pulsing waves */}
              <div className="relative mb-6">
                <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-600 to-emerald-500 rounded-full blur-xl opacity-20 dark:opacity-15 animate-pulse"></div>
                <div className="relative flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-emerald-500 shadow-xl shadow-indigo-500/25">
                  <svg className="w-8 h-8 text-white animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 2 7 12 12 22 7 12 2" />
                    <polyline points="2 17 12 22 22 17" />
                    <polyline points="2 12 12 17 22 12" />
                  </svg>
                </div>
              </div>
              
              {/* Typography */}
              <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 dark:text-white font-display mb-1">
                Civic<span className="text-indigo-600 dark:text-emerald-400 font-medium">Pilot</span>
              </h1>
              <p className="text-[9px] font-mono font-semibold tracking-widest text-slate-400 dark:text-slate-500 uppercase">
                AI Civic Intelligence
              </p>
              
              {/* Progress Indicator */}
              <div className="w-48 bg-slate-200/60 dark:bg-slate-800/40 h-1 rounded-full mt-8 overflow-hidden">
                <motion.div 
                  className="bg-gradient-to-r from-indigo-500 to-emerald-500 h-full rounded-full"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: 1.0, ease: "easeInOut" }}
                />
              </div>
              
              {/* Status Message */}
              <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-4 animate-pulse">
                Calibrating intelligent routing nodes...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Layout on Desktop */}
      <Sidebar 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        hasUnfinishedMission={hasUnfinishedMission}
      />

      {/* Main Content Area */}
      <div className="md:pl-64 flex flex-col min-h-screen">
        {/* Header Top Nav bar */}
        <TopNav 
          currentView={currentView} 
          onViewChange={setCurrentView}
          activeMissionCount={activeMissionCount}
          theme={theme}
          onToggleTheme={() => setTheme(prev => prev === 'light' ? 'dark' : 'light')}
          language={language}
          onLanguageChange={setLanguage}
        />

        {/* Content Viewports with animated route transitions */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl mx-auto w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentView}
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageVariants}
              className="w-full h-full"
            >
              {currentView === 'dashboard' && (
                <DashboardView 
                  reports={reports} 
                  onViewChange={setCurrentView}
                  onSelectReport={setActiveReport}
                  demoMode={demoMode}
                  onToggleDemoMode={() => setDemoMode(!demoMode)}
                  onSelectDemoCase={handleSelectDemoCase}
                  language={language}
                />
              )}

              {currentView === 'impact-dashboard' && (
                <ImpactDashboardView 
                  reports={reports}
                />
              )}

              {currentView === 'report' && (
                <ReportIssueView 
                  reports={reports}
                  onAddReport={handleAddReport} 
                  onJoinReport={handleJoinReport}
                  onSelectReport={setActiveReport}
                  onViewChange={setCurrentView}
                  prefilledDemo={prefilledDemo}
                  onClearPrefilledDemo={() => setPrefilledDemo(null)}
                  language={language}
                />
              )}

              {currentView === 'mission-control' && (
                <MissionControlView 
                  activeReport={activeReport}
                  onUpdateReportStatus={handleUpdateReportStatus}
                  onViewChange={setCurrentView}
                />
              )}

              {currentView === 'generated-case' && (
                <GeneratedCaseView 
                  reports={reports}
                  activeReport={activeReport}
                  onSelectReport={setActiveReport}
                  onUpdateVerification={handleUpdateVerification}
                  language={language}
                />
              )}

              {currentView === 'map' && (
                <MapView 
                  reports={reports}
                  onSelectReport={setActiveReport}
                  language={language}
                />
              )}

              {currentView === 'profile' && (
                <CitizenProfileView 
                  demoMode={demoMode}
                  onToggleDemoMode={() => setDemoMode(!demoMode)}
                  profileState={demoMode ? demoProfile : liveProfile}
                  onUpdateProfile={demoMode ? setDemoProfile : setLiveProfile}
                  onAddActivity={handleAddActivity}
                />
              )}

              {currentView === 'command-center' && (
                <MunicipalCommandCenterView 
                  reports={reports}
                  onUpdateReportStatus={handleUpdateReportStatus}
                  onUpdateVerification={handleUpdateVerification}
                  language={language}
                />
              )}

              {currentView === 'accessibility' && (
                <AccessibilityView 
                  language={language}
                  onLanguageChange={setLanguage}
                  fontSize={fontSize}
                  onFontSizeChange={setFontSize}
                  highContrast={highContrast}
                  onHighContrastChange={setHighContrast}
                  reducedMotion={reducedMotion}
                  onReducedMotionChange={setReducedMotion}
                  colorBlindMode={colorBlindMode}
                  onColorBlindModeChange={setColorBlindMode}
                />
              )}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Elegant Footer with Powered by Google Gemini */}
        <footer className="py-6 px-8 border-t border-slate-200/60 dark:border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400 dark:text-slate-500 max-w-7xl mx-auto w-full transition-colors duration-300">
          <div>
            <span className="font-display font-bold text-slate-850 dark:text-slate-300">CivicPilot</span> © {new Date().getFullYear()} • Intelligent Civic Infrastructure
          </div>
          <div className="flex items-center gap-1.5 font-sans font-medium text-slate-550 dark:text-slate-400">
            <span>Powered by</span>
            <span className="inline-flex items-center gap-1 font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400">
              <svg className="w-3.5 h-3.5 text-indigo-500 dark:text-indigo-400 animate-pulse shrink-0 inline-block" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2 L14.5 9.5 L22 12 L14.5 14.5 L12 22 L9.5 14.5 L2 12 L9.5 9.5 Z" />
              </svg>
              Google Gemini
            </span>
          </div>
        </footer>
      </div>

      {/* Mobile Sticky Bottom Tab Bar */}
      <MobileNav 
        currentView={currentView} 
        onViewChange={setCurrentView} 
        hasUnfinishedMission={hasUnfinishedMission}
      />
    </div>
  );
}
