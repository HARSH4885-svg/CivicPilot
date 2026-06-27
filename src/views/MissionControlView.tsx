import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Cpu, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle2, 
  Eye, 
  MapPin, 
  ShieldCheck, 
  AlertTriangle, 
  Wrench, 
  Server,
  ArrowRight,
  RefreshCw,
  AlertCircle,
  Check,
  Sparkles
} from 'lucide-react';
import { IssueReport, Agent, View } from '../types';
import { INITIAL_AGENTS } from '../data/mockData';
import SafeImage from '../components/SafeImage';

interface MissionControlViewProps {
  activeReport: IssueReport | null;
  onUpdateReportStatus: (
    id: string, 
    status: 'resolved' | 'active' | 'failed', 
    ticketId: string, 
    summary: string, 
    analysis?: any,
    severity?: 'low' | 'medium' | 'high' | 'critical'
  ) => void;
  onViewChange: (view: View) => void;
}

// Icon mapping helper with Material-style colors and sizing
const getAgentIcon = (iconName: string, className: string) => {
  switch (iconName) {
    case 'Eye': return <Eye className={className} />;
    case 'MapPin': return <MapPin className={className} />;
    case 'ShieldCheck': return <ShieldCheck className={className} />;
    case 'AlertTriangle': return <AlertTriangle className={className} />;
    case 'Wrench': return <Wrench className={className} />;
    case 'Server': return <Server className={className} />;
    default: return <Cpu className={className} />;
  }
};

// Formatted local clock ticker
function getFormattedTime() {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  return `${pad(d.getHours())}:${pad(d.getMinutes())}:${pad(d.getSeconds())}`;
}

// Helper to determine why a department is responsible
const getAuthorityExplanation = (auth: string) => {
  const lower = auth.toLowerCase();
  if (lower.includes('water') || lower.includes('utility')) {
    return 'they manage primary pipeline maintenance, hydrological safety, and city water assets';
  }
  if (lower.includes('environmental') || lower.includes('hazard') || lower.includes('health') || lower.includes('garbage')) {
    return 'they manage toxic containment, municipal sanitation, waste regulation, and neighborhood environmental protection';
  }
  if (lower.includes('traffic') || lower.includes('transit') || lower.includes('street') || lower.includes('light')) {
    return 'they regulate traffic safety systems, streetlights, transit signaling, and pedestrian road safety markers';
  }
  if (lower.includes('park') || lower.includes('recreation') || lower.includes('forestry')) {
    return 'they regulate public parklands, botanical preservation, and regional greenway safety standards';
  }
  return 'they regulate general municipal asset restoration, infrastructure repairs, and local field emergency dispatch';
};

// Returns dynamic progressive sub-steps for each agent
function getAgentSteps(agentId: string, data: any, report: IssueReport | null): string[] {
  const defaultAuth = report?.category || "Department of Public Works";
  const authority = data?.authority || defaultAuth;
  const issueType = data?.issueType || report?.title || report?.category || "reported issue";
  const area = data?.affectedArea || report?.location.address || "reported area";
  const severity = data?.severity || report?.severity || "medium";
  const visionConf = data?.agents?.vision?.confidence || 94;
  
  const whyResponsible = getAuthorityExplanation(authority);
  
  switch (agentId) {
    case 'vision':
      return [
        "Scanning uploaded image...",
        "Detecting objects...",
        `${issueType} detected`,
        `Confidence: ${visionConf}%`
      ];
    case 'geo':
      return [
        `Using the detected ${issueType.toLowerCase()} location, searching nearby landmarks...`,
        "Retrieving GIS registry coordinates...",
        `Verified near ${area}`
      ];
    case 'verification':
      return [
        "Querying Open311 database for overlapping incidents...",
        "Scanning neighborhood spatial buffer...",
        "No duplicates found. Confirmed unique report."
      ];
    case 'priority':
      return [
        "Analyzing public risk factors...",
        "Proximity assessment to public zones...",
        `Because the issue is near ${area} and confidence is high (${visionConf}%), severity set to ${severity.toUpperCase()}`
      ];
    case 'resolution':
      return [
        "Mapping operational category to responsible agency...",
        `${authority} selected as responsible because ${whyResponsible}.`,
        "Response workflow constructed"
      ];
    case 'deployment':
      return [
        "Packaging evidence files and GIS markers...",
        "Generating cryptographic safety log...",
        `Dispatch complete! Summary: ${issueType} near ${area} prioritized as ${severity.toUpperCase()} due to safety proximity hazards, assigned directly to ${authority}`
      ];
    default:
      return [];
  }
}

// Inline custom fast Typewriter Component to show active steps
function TypewriterText({ text, speed = 10, onComplete }: { text: string; speed?: number; onComplete?: () => void }) {
  const [displayed, setDisplayed] = useState('');
  
  useEffect(() => {
    setDisplayed('');
    let idx = 0;
    const timer = setInterval(() => {
      setDisplayed((prev) => prev + text.charAt(idx));
      idx++;
      if (idx >= text.length) {
        clearInterval(timer);
        onComplete?.();
      }
    }, speed);
    return () => clearInterval(timer);
  }, [text, speed]);

  return (
    <span className="font-sans">
      {displayed}
      {displayed.length < text.length && (
        <span className="inline-block w-1.5 h-3 bg-indigo-500 dark:bg-indigo-400 ml-0.5 animate-pulse" />
      )}
    </span>
  );
}

export default function MissionControlView({ activeReport, onUpdateReportStatus, onViewChange }: MissionControlViewProps) {
  const [agents, setAgents] = useState<Agent[]>(INITIAL_AGENTS);
  const [isRunning, setIsRunning] = useState(false);
  const [currentAgentIndex, setCurrentAgentIndex] = useState<number>(-1);
  const [currentStepIndex, setCurrentStepIndex] = useState<number>(0);
  const [terminalLogs, setTerminalLogs] = useState<string[]>([]);
  const [missionProgress, setMissionProgress] = useState(0);
  const [missionComplete, setMissionComplete] = useState(false);

  // Real Gemini states
  const [loadingAnalysis, setLoadingAnalysis] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [geminiData, setGeminiData] = useState<any>(null);
  
  const terminalBottomRef = useRef<HTMLDivElement>(null);

  // Keep terminal scrolled to bottom
  useEffect(() => {
    terminalBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLogs]);

  // Initial setup & API call trigger
  useEffect(() => {
    if (activeReport && activeReport.status === 'analyzing') {
      triggerRealAnalysis();
    } else {
      // Setup completed demonstration data or load saved analysis
      const savedData = activeReport?.analysis || null;
      if (savedData) {
        setGeminiData(savedData);
      }
      setAgents(INITIAL_AGENTS.map(agent => ({
        ...agent,
        status: 'success',
        progress: 100,
        logs: []
      })));
      setMissionProgress(100);
      setMissionComplete(true);
      setCurrentAgentIndex(6); // Set beyond last agent so all are marked completed
      setCurrentStepIndex(5);
      
      // Populate finished logs
      const allLogs: string[] = [];
      INITIAL_AGENTS.forEach((ag, idx) => {
        allLogs.push(`>> Agent ${ag.name} executed successfully.`);
        const steps = getAgentSteps(ag.id, savedData, activeReport);
        steps.forEach((step) => {
          allLogs.push(` [${ag.name}] ${step}`);
        });
      });
      allLogs.push(`[SYSTEM] All municipal integration tasks concluded. Dossiers compiled.`);
      setTerminalLogs(allLogs);
    }
  }, [activeReport]);

  const triggerRealAnalysis = async () => {
    if (!activeReport) return;

    setLoadingAnalysis(true);
    setAnalysisError(null);
    setIsRunning(false);
    setCurrentAgentIndex(-1);
    setCurrentStepIndex(0);
    setMissionComplete(false);
    setMissionProgress(0);

    // Initial human-friendly boot log
    setTerminalLogs([
      `Starting up the CivicPilot AI pipeline...`,
      `Loading details for case: "${activeReport.title}"`,
      `Connecting to the AI processing engine...`,
      `Analyzing report details and visual evidence...`
    ]);

    setAgents(INITIAL_AGENTS.map(agent => ({ ...agent, status: 'idle', progress: 0, logs: [] })));

    try {
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          title: activeReport.title,
          description: activeReport.description,
          category: activeReport.category,
          imageUrl: activeReport.imageUrl,
          address: activeReport.location.address,
          communityVerification: activeReport.communityVerification
        })
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP error ${response.status}`);
      }

      const data = await response.json();
      setGeminiData(data);
      setLoadingAnalysis(false);

      // Successfully retrieved analysis
      setTerminalLogs(prev => [
        ...prev,
        `Successfully received and verified the AI analysis.`,
        `Determined severity level: ${data.severity.toUpperCase()}.`,
        `Commencing 6-step verification and coordination process...`
      ]);

      // Automatically launch the sequence
      setIsRunning(true);
      setCurrentAgentIndex(0);
      setCurrentStepIndex(0);
    } catch (err: any) {
      console.error(err);
      setLoadingAnalysis(false);
      setAnalysisError(err?.message || "Connection to municipal AI gateway failed.");
      
      setTerminalLogs(prev => [
        ...prev,
        `Failed to complete AI processing. Connection blocked.`,
        `Reason: ${err?.message || "Failed to parse structured JSON response."}`,
        `System standing by for manual recovery...`
      ]);

      // Inform parent that analysis failed
      onUpdateReportStatus(activeReport.id, 'failed', 'TX-ERR-500', err?.message || 'Gemini processing failed');
    }
  };

  // Active Simulation Loop for sequential agent steps
  useEffect(() => {
    if (!isRunning || currentAgentIndex === -1 || currentAgentIndex >= agents.length || !geminiData) {
      // Handle completion
      if (currentAgentIndex >= agents.length && isRunning && geminiData) {
        setIsRunning(false);
        setMissionComplete(true);
        if (activeReport) {
          const generatedTicket = `TX-${(geminiData.authority || activeReport.category).slice(0, 3).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;
          onUpdateReportStatus(
            activeReport.id, 
            'resolved', 
            generatedTicket, 
            geminiData.summary, 
            geminiData,
            geminiData.severity.toLowerCase() as any
          );
        }
      }
      return;
    }

    const currentAgent = agents[currentAgentIndex];
    const steps = getAgentSteps(currentAgent.id, geminiData, activeReport);

    // If we've finished all steps for this agent, transition to the next agent
    if (currentStepIndex >= steps.length) {
      setAgents(prev => prev.map((ag, i) => i === currentAgentIndex ? { ...ag, status: 'success', progress: 100 } : ag));
      setTerminalLogs(prev => [
        ...prev,
        `Completed step: ${currentAgent.name} (Confidence: ${geminiData.agents[currentAgent.id]?.confidence || 95}%).`
      ]);
      
      setCurrentAgentIndex(prev => prev + 1);
      setCurrentStepIndex(0);
      return;
    }

    // Set the agent status to processing when it starts first step
    if (currentStepIndex === 0) {
      setAgents(prev => prev.map((ag, i) => i === currentAgentIndex ? { ...ag, status: 'processing', progress: 0 } : ag));
      setTerminalLogs(prev => [
        ...prev,
        `Starting step: ${currentAgent.name}...`
      ]);
    }

    // Schedule the next step after a delay (allowing time to type out reasoning)
    const timer = setTimeout(() => {
      const stepText = steps[currentStepIndex];
      
      // Append log to terminal
      setTerminalLogs(prev => [
        ...prev,
        ` [${currentAgent.name}] ${stepText}`
      ]);

      // Update progress of the current agent
      const nextProgress = Math.round(((currentStepIndex + 1) / steps.length) * 100);
      setAgents(prev => prev.map((ag, i) => i === currentAgentIndex ? { ...ag, progress: nextProgress } : ag));

      // Update total mission progress
      const totalStepsCompleted = currentAgentIndex * steps.length + (currentStepIndex + 1);
      const totalStepsCount = agents.length * steps.length;
      setMissionProgress(Math.round((totalStepsCompleted / totalStepsCount) * 100));

      // Advance step index
      setCurrentStepIndex(prev => prev + 1);
    }, 2000); // 2s pacing gives typing animations room to shine!

    return () => clearTimeout(timer);
  }, [isRunning, currentAgentIndex, currentStepIndex, geminiData]);

  const handleTogglePlay = () => {
    if (currentAgentIndex === -1) {
      setCurrentAgentIndex(0);
      setCurrentStepIndex(0);
    }
    setIsRunning(!isRunning);
  };

  const handleManualReset = () => {
    if (activeReport && activeReport.status === 'analyzing') {
      triggerRealAnalysis();
    } else {
      setAgents(INITIAL_AGENTS.map(agent => ({ ...agent, status: 'idle', progress: 0, logs: [] })));
      setTerminalLogs([`System reset. Waiting to deploy next case...`]);
      setMissionProgress(0);
      setMissionComplete(false);
      setCurrentAgentIndex(0);
      setCurrentStepIndex(0);
    }
  };

  // Defining the 6 simple steps for structural rendering
  const stepsConfig = [
    {
      id: 'vision',
      title: '1. Detect Issue',
      iconName: 'Eye',
      explanation: 'Analyzing details and visual evidence to identify the problem.',
      getOneLiner: (data: any, report: IssueReport | null) => {
        if (!data) return "Analyzing details and visual evidence to identify the problem.";
        const issueType = data?.issueType || report?.category || "reported issue";
        const confidence = data?.agents?.vision?.confidence || 94;
        return `Detected a ${issueType.toLowerCase()} with ${confidence}% confidence.`;
      },
      getReasoning: (data: any) => data?.agents?.vision?.reasoning || "Analyzing image pixels and keyword markers to classify the core civic damage."
    },
    {
      id: 'geo',
      title: '2. Verify Location',
      iconName: 'MapPin',
      explanation: 'Locating city grid coordinates and verifying regional asset maps.',
      getOneLiner: (data: any, report: IssueReport | null) => {
        if (!data) return "Locating city grid coordinates and verifying regional asset maps.";
        const area = data?.affectedArea || report?.location.address || "reported area";
        return `Verified the location near ${area}.`;
      },
      getReasoning: (data: any) => data?.agents?.geo?.reasoning || "Matched spatial coordinates to municipal district records and nearby landmarks."
    },
    {
      id: 'verification',
      title: '3. Check Similar Reports',
      iconName: 'ShieldCheck',
      explanation: 'Searching active database records for overlapping neighborhood reports.',
      getOneLiner: (data: any) => {
        if (!data) return "Searching active database records for overlapping neighborhood reports.";
        return "Confirmed this is a new, unique report (no active duplicates nearby).";
      },
      getReasoning: (data: any) => data?.agents?.verification?.reasoning || "Confirmed zero active overlapping tickets exist within a 500-meter radius."
    },
    {
      id: 'priority',
      title: '4. Assess Priority',
      iconName: 'AlertTriangle',
      explanation: 'Evaluating safety threats and priority matrix equations.',
      getOneLiner: (data: any, report: IssueReport | null) => {
        if (!data) return "Evaluating safety threats and priority matrix equations.";
        const severity = data?.severity || report?.severity || "medium";
        const score = data?.urgencyScore || 85;
        return `Assessed risk level as ${severity.toLowerCase()} priority (Score: ${score}/100).`;
      },
      getReasoning: (data: any) => data?.agents?.priority?.reasoning || "High pedestrian traffic and proximity to public transit elevates safety urgency."
    },
    {
      id: 'resolution',
      title: '5. Assign Department',
      iconName: 'Wrench',
      explanation: 'Mapping incident category to specialized response units.',
      getOneLiner: (data: any, report: IssueReport | null) => {
        if (!data) return "Mapping incident category to specialized response units.";
        const authority = data?.authority || report?.category || "Department of Public Works";
        return `Assigned task to the ${authority}.`;
      },
      getReasoning: (data: any) => data?.agents?.resolution?.reasoning || "Scheduled emergency response crew with required tools and heavy equipment."
    },
    {
      id: 'deployment',
      title: '6. Generate Official Case',
      iconName: 'Server',
      explanation: 'Preparing standardized official open case file and dispatch ticket.',
      getOneLiner: (data: any, report: IssueReport | null) => {
        if (!data) return "Preparing standardized official open case file and dispatch ticket.";
        const authority = data?.authority || report?.category || "Public Works Department";
        return `Preparing the official case for the ${authority}.`;
      },
      getReasoning: (data: any) => data?.agents?.deployment?.reasoning || "Signed audit certificate and compiled final standard case file PDF."
    }
  ];

  return (
    <div id="mission-control-view" className="space-y-8 pb-12 font-sans transition-colors duration-300">
      {/* Top Controller Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 gap-4 shadow-sm transition-colors duration-300">
        <div className="flex items-center gap-4">
          <div className="relative flex items-center justify-center w-12 h-12 rounded-xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-150 dark:border-indigo-500/20 transition-colors">
            <Cpu className={`w-6 h-6 ${isRunning || loadingAnalysis ? 'animate-spin-slow' : ''}`} />
            {(isRunning || loadingAnalysis) && (
              <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 animate-pulse border-2 border-white dark:border-slate-950" />
            )}
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight font-display">
                {activeReport ? `Processing Report: ${activeReport.title}` : 'CivicPilot Autopilot Engine'}
              </h3>
              {activeReport && (
                activeReport.isDemo ? (
                  <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded border bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-500 border-amber-150 dark:border-amber-500/20">
                    DEMO CASE
                  </span>
                ) : (
                  <span className="text-[9px] font-mono font-extrabold px-1.5 py-0.5 rounded border bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-150 dark:border-indigo-500/20 animate-pulse">
                    LIVE ANALYSIS
                  </span>
                )
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Analyzing, verifying, and dispatching your local report automatically
            </p>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {activeReport && activeReport.status === 'analyzing' && !loadingAnalysis && !analysisError && (
            <>
              <button
                id="mc-btn-play"
                onClick={handleTogglePlay}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
                  isRunning 
                    ? 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 hover:bg-amber-100 dark:hover:bg-amber-500/20' 
                    : 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-200 dark:border-emerald-500/20 hover:bg-emerald-100 dark:hover:bg-emerald-500/20 shadow-sm'
                }`}
              >
                {isRunning ? (
                  <>
                    <Pause className="w-3.5 h-3.5" /> Pause Auto-Pilot
                  </>
                ) : (
                  <>
                    <Play className="w-3.5 h-3.5" /> Resume Auto-Pilot
                  </>
                )}
              </button>

              <button
                id="mc-btn-reset"
                onClick={handleManualReset}
                className="p-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 transition-all cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800"
                title="Restart Case Analysis"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          )}

          {!activeReport && (
            <button
              id="mc-btn-trigger-demo"
              onClick={() => onViewChange('report')}
              className="flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold tracking-wide text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 transition-all cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
              Create A New Report
            </button>
          )}
        </div>
      </div>

      {/* Aggregate Workflow Progress Bar */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/20 shadow-sm transition-colors duration-300">
        <div className="flex justify-between items-center text-xs font-sans font-semibold tracking-wide mb-2">
          <span className="text-slate-500 dark:text-slate-400">TOTAL WORKFLOW PROGRESS</span>
          <span className="text-indigo-600 dark:text-indigo-400 font-bold">{missionProgress}%</span>
        </div>
        <div className="w-full bg-slate-100 dark:bg-slate-900/80 h-2.5 rounded-full overflow-hidden border border-slate-200 dark:border-slate-800">
          <div 
            className="bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-400 h-full rounded-full transition-all duration-500" 
            style={{ width: `${missionProgress}%` }}
          />
        </div>
      </div>

      {/* Main Material-Design OS Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Left Side: The 6 Elegant Steps Stepper */}
        <div className="xl:col-span-2 space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-slate-200 dark:border-slate-900 transition-colors">
            <h4 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest font-mono">Autonomous Pipeline Stages</h4>
            {loadingAnalysis && (
              <span className="text-xs text-indigo-600 dark:text-indigo-400 animate-pulse flex items-center gap-1.5 font-semibold">
                <RefreshCw className="w-3.5 h-3.5 animate-spin" /> ENGAGING AI ENGINE...
              </span>
            )}
          </div>
          
          <AnimatePresence mode="wait">
            {analysisError ? (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="p-8 rounded-3xl border border-red-200 dark:border-red-500/30 bg-red-500/[0.01] flex flex-col items-center justify-center text-center gap-4 py-16 shadow-lg"
              >
                <div className="p-4 bg-red-50 dark:bg-red-500/10 rounded-full text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 shadow-sm">
                  <AlertCircle className="w-8 h-8" />
                </div>
                <div>
                  <h4 className="text-base font-bold text-slate-800 dark:text-white tracking-tight">AI Connection Temporarily Interrupted</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 max-w-md mx-auto leading-relaxed">
                    We could not communicate with the municipal AI coordinator. Please verify your settings or retry the process.
                  </p>
                </div>
                <button
                  onClick={triggerRealAnalysis}
                  className="flex items-center gap-2 py-2.5 px-6 rounded-xl text-xs font-semibold text-white bg-red-600 hover:bg-red-500 shadow-lg shadow-red-500/20 active:scale-95 transition-all cursor-pointer border border-red-550"
                >
                  <RefreshCw className="w-3.5 h-3.5" />
                  <span>Retry AI Orchestration</span>
                </button>
              </motion.div>
            ) : (
              <div className="space-y-0">
                {stepsConfig.map((step, index) => {
                  const isDone = index < currentAgentIndex || missionComplete;
                  const isWorking = index === currentAgentIndex && !missionComplete;
                  const isPending = index > currentAgentIndex && !missionComplete;
                  const confidenceVal = geminiData?.agents?.[step.id]?.confidence || 95;

                  // Get sub-steps for this specific agent step
                  const subSteps = getAgentSteps(step.id, geminiData, activeReport);

                  return (
                    <div 
                      key={step.id} 
                      className="relative pl-12 pb-6 last:pb-0"
                    >
                      {/* Connecting line track */}
                      {index < 5 && (
                        <div className={`absolute left-[15px] top-8 bottom-0 w-[2px] transition-colors duration-500 ${
                          isDone 
                            ? 'bg-emerald-500/30' 
                            : isWorking 
                            ? 'bg-gradient-to-b from-indigo-500 to-slate-200 dark:to-slate-800/40' 
                            : 'bg-slate-200 dark:bg-slate-800/40'
                        }`} />
                      )}

                      {/* Floating Stepper Status Icon */}
                      <div className={`absolute left-0 top-0.5 w-8 h-8 rounded-full flex items-center justify-center border transition-all duration-300 ${
                        isDone 
                          ? 'bg-emerald-50 dark:bg-emerald-500/10 border-emerald-300 dark:border-emerald-500/30 text-emerald-600 dark:text-emerald-400 shadow-sm' 
                          : isWorking 
                          ? 'bg-indigo-50 dark:bg-indigo-500/10 border-indigo-500 text-indigo-600 dark:text-indigo-400 shadow-md ring-4 ring-indigo-500/10 dark:ring-indigo-500/15' 
                          : 'bg-slate-100 dark:bg-slate-950/80 border-slate-200 dark:border-slate-850 text-slate-400 dark:text-slate-600'
                      }`}>
                        {isDone ? (
                          <Check className="w-4 h-4 text-emerald-600 dark:text-emerald-400 stroke-[3]" />
                        ) : isWorking ? (
                          <div className="relative flex items-center justify-center">
                            {getAgentIcon(step.iconName, 'w-4 h-4 animate-pulse')}
                            <span className="absolute inset-0 rounded-full border border-indigo-400 animate-ping opacity-60" />
                          </div>
                        ) : (
                          getAgentIcon(step.iconName, 'w-4 h-4')
                        )}
                      </div>

                      {/* Main Step Card */}
                      <div className={`p-5 rounded-2xl border transition-all duration-300 ${
                        isWorking 
                          ? 'bg-white dark:bg-indigo-500/[0.03] border-indigo-500/30 shadow-md scale-[1.005]' 
                          : isDone 
                          ? 'bg-white dark:bg-slate-900/20 border-slate-200 dark:border-slate-800/60 shadow-sm' 
                          : 'bg-slate-50/50 dark:bg-slate-950/20 border-slate-100 dark:border-slate-900/50 opacity-60'
                      }`}>
                        
                        {/* Card Header Row */}
                        <div className="flex items-center justify-between gap-4">
                          <h5 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                            {step.title}
                          </h5>

                          <div className="flex items-center gap-2">
                            {isDone && (
                              <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                                Confidence: {confidenceVal}%
                              </span>
                            )}
                            {isWorking && (
                              <span className="text-[10px] font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2.5 py-0.5 rounded-full border border-indigo-200 dark:border-indigo-500/20 animate-pulse">
                                Running...
                              </span>
                            )}
                            {isPending && (
                              <span className="text-[10px] font-medium text-slate-400 dark:text-slate-500 bg-slate-100/50 dark:bg-slate-900/50 px-2.5 py-0.5 rounded-full border border-slate-200/40 dark:border-slate-800/40">
                                Standby
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Large, Human-Friendly One-Line Explanation */}
                        <p className={`text-sm md:text-base font-semibold leading-relaxed mt-2.5 ${
                          isPending ? 'text-slate-400 dark:text-slate-500' : 'text-slate-800 dark:text-slate-100'
                        }`}>
                          {step.getOneLiner(geminiData, activeReport)}
                        </p>

                        {/* PROGRESSIVE SUB-STEPS LIST REVEAL */}
                        {(isDone || isWorking) && subSteps.length > 0 && (
                          <div className="mt-4 space-y-2 pl-1 pt-1 animate-fadeIn">
                            {subSteps.map((subStepText, subStepIdx) => {
                              const isSubStepDone = isDone || subStepIdx < currentStepIndex;
                              const isSubStepWorking = isWorking && subStepIdx === currentStepIndex;
                              
                              if (!isSubStepDone && !isSubStepWorking) return null;

                              return (
                                <div key={subStepIdx} className="flex items-start gap-2.5 text-xs animate-fadeIn">
                                  {isSubStepDone ? (
                                    <span className="text-emerald-600 dark:text-emerald-400 font-bold shrink-0 mt-0.5">✓</span>
                                  ) : (
                                    <span className="text-indigo-600 dark:text-indigo-400 font-bold shrink-0 mt-0.5 animate-pulse">●</span>
                                  )}
                                  <p className={`leading-relaxed font-sans ${
                                    isSubStepDone 
                                      ? 'text-slate-600 dark:text-slate-300 font-medium' 
                                      : 'text-indigo-600 dark:text-indigo-400 font-semibold'
                                  }`}>
                                    {isSubStepWorking ? (
                                      <TypewriterText text={subStepText} speed={12} />
                                    ) : (
                                      subStepText
                                    )}
                                  </p>
                                </div>
                              );
                            })}
                          </div>
                        )}

                        {/* AI Reasoning Sub-section (Detailed background) */}
                        {isDone && (
                          <div className="mt-4 pt-3.5 border-t border-slate-100 dark:border-slate-900/50 animate-fadeIn">
                            <span className="text-[9px] font-mono font-bold tracking-wider text-indigo-600 dark:text-indigo-400 block mb-1 uppercase">
                              AI Explanation
                            </span>
                            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                              {step.getReasoning(geminiData)}
                            </p>
                          </div>
                        )}

                        {/* Micro Progress Slider for Active Step */}
                        {isWorking && (
                          <div className="mt-4">
                            <div className="w-full bg-slate-100 dark:bg-slate-950 h-[3px] rounded-full overflow-hidden">
                              <div 
                                className="h-full bg-indigo-500 rounded-full transition-all duration-300"
                                style={{ width: `${Math.round((currentStepIndex / subSteps.length) * 100)}%` }}
                              />
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Right Side: Case Details & Friendly Live Activity Feed */}
        <div className="space-y-6">
          {/* Active Case Summary Card */}
          {activeReport && (
            <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950/20 space-y-4 shadow-sm transition-colors">
              <div className="flex items-center justify-between pb-1 border-b border-slate-100 dark:border-slate-900">
                <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Active Case Details</h4>
                <span className={`text-[9px] font-mono font-bold px-2.5 py-0.5 rounded-full border capitalize ${
                  activeReport.severity === 'critical'
                    ? 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-200 dark:border-red-500/30'
                    : activeReport.severity === 'high'
                    ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-200 dark:border-amber-500/30'
                    : 'bg-indigo-50 dark:bg-indigo-500/10 text-indigo-700 dark:text-indigo-400 border-indigo-150 dark:border-indigo-500/30'
                }`}>
                  {activeReport.severity}
                </span>
              </div>

              {activeReport.imageUrl && (
                <div className="h-32 rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800/80">
                  <SafeImage 
                    src={activeReport.imageUrl} 
                    alt={activeReport.title} 
                    category={activeReport.category}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}

              <div className="space-y-2">
                <h5 className="text-sm font-bold text-slate-800 dark:text-white leading-snug">{activeReport.title}</h5>
                <p className="text-xs text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{activeReport.location.address}</span>
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400/80 leading-relaxed pt-1 line-clamp-3">
                  {activeReport.description}
                </p>
              </div>
            </div>
          )}

          {/* Calming Activity Stream Journal */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest font-mono">Activity Journal</h4>
              <div className="flex items-center gap-1.5 text-[10px] text-slate-500 font-medium">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
                <span>Live Feed</span>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 dark:border-slate-850 bg-white dark:bg-slate-950/40 p-5 h-[420px] flex flex-col justify-between overflow-hidden shadow-sm relative transition-colors">
              {/* Spinning status indicator */}
              <div className="absolute top-4 right-4">
                <Sparkles className={`w-4 h-4 text-indigo-500/60 ${isRunning ? 'animate-pulse' : ''}`} />
              </div>
              
              <div className="flex-1 overflow-y-auto space-y-3.5 pr-2">
                {terminalLogs.map((log, i) => {
                  let cleanLog = log
                    .replace(/^\[.*?\]\s*>>\s*/, '')
                    .replace(/^\[.*?\]\s*/, '')
                    .replace(/^\s*\[.*?\]\s*/, '')
                    .replace(/^>>\s*/, '')
                    .replace(/AGENT_\d+\s*•\s*/, '')
                    .trim();

                  // Skip empty entries or system internal keys
                  if (!cleanLog || cleanLog.includes('LOAD_FACTOR') || cleanLog.includes('INITIALIZING COGNITIVE')) {
                    return null;
                  }

                  const isSuccess = log.includes('SUCCESS') || log.includes('complete') || log.includes('Successfully') || log.includes('concluded');
                  const isAlert = log.includes('Failed') || log.includes('CRITICAL_ERROR') || log.includes('blocked');

                  return (
                    <div key={i} className="flex items-start gap-3 text-xs leading-relaxed animate-fadeIn">
                      <div className={`w-1.5 h-1.5 rounded-full shrink-0 mt-2 ${
                        isSuccess 
                          ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50' 
                          : isAlert 
                          ? 'bg-red-500 shadow-sm' 
                          : 'bg-indigo-500 shadow-sm shadow-indigo-500/50'
                      }`} />
                      <span className="text-slate-700 dark:text-slate-300 font-medium font-sans">{cleanLog}</span>
                    </div>
                  );
                })}
                <div ref={terminalBottomRef} />
              </div>

              {/* Tidy bottom status line */}
              <div className="pt-3 border-t border-slate-100 dark:border-slate-900/60 text-slate-400 dark:text-slate-500 text-[10px] flex items-center justify-between">
                <span>Autonomous coordination active</span>
                <span>Auto-scrolling</span>
              </div>
            </div>
          </div>

          {/* Post-Process redirection card */}
          {missionComplete && (
            <motion.div 
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-500/20 bg-emerald-50/50 dark:bg-emerald-500/[0.02] flex items-center justify-between shadow-sm animate-fadeIn"
            >
              <div className="mr-4">
                <h5 className="text-xs font-bold text-emerald-600 dark:text-emerald-400">All Steps Completed Successfully</h5>
                <p className="text-xs text-slate-500 dark:text-slate-300 mt-1 leading-relaxed">
                  The official dispatch report has been signed and delivered to local works.
                </p>
              </div>
              <button
                id="mc-view-dossier"
                onClick={() => onViewChange('generated-case')}
                className="flex items-center gap-1.5 px-3.5 py-2.5 rounded-xl text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md hover:scale-[1.02] active:scale-[0.98] transition-all cursor-pointer whitespace-nowrap shrink-0"
              >
                <span>View Case</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
