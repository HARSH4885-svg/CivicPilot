import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Award, 
  TrendingUp, 
  Users, 
  CheckCircle, 
  Shield, 
  Sparkles, 
  Edit3, 
  Check, 
  Info, 
  Trophy, 
  Flame, 
  AlertCircle,
  HelpCircle,
  User,
  Heart,
  Search,
  CheckSquare,
  Lock,
  ArrowRight,
  RefreshCw,
  Zap
} from 'lucide-react';
import { 
  Badge, 
  Challenge, 
  CitizenProfileState, 
  determineLevel, 
  getLevelRange,
  BADGE_DEFINITIONS,
  WEEKLY_CHALLENGES_DEFINITION,
  MONTHLY_CHALLENGES_DEFINITION,
  LEADERBOARD_SEED,
  GAMIFICATION_RULES
} from '../utils/gamification';

interface CitizenProfileViewProps {
  demoMode: boolean;
  onToggleDemoMode: () => void;
  profileState: CitizenProfileState;
  onUpdateProfile: (updated: CitizenProfileState) => void;
  onAddActivity: (type: 'report' | 'verify' | 'evidence' | 'comment' | 'duplicate') => void;
}

interface AIImpactSummary {
  totalContribution: string;
  estimatedPeopleHelped: number;
  estimatedPeopleHelpedReasoning: string;
  resolvedBecauseOfUser: number;
  communityTrustScore: number;
  suggestedActions: string[];
}

export default function CitizenProfileView({
  demoMode,
  onToggleDemoMode,
  profileState,
  onUpdateProfile,
  onAddActivity
}: CitizenProfileViewProps) {
  const [isEditingName, setIsEditingName] = useState(false);
  const [editedName, setEditedName] = useState(profileState.name);
  const [selectedBadge, setSelectedBadge] = useState<Badge | null>(null);
  
  // AI summary states
  const [aiSummary, setAiSummary] = useState<AIImpactSummary | null>(null);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [summaryError, setSummaryError] = useState<string | null>(null);

  const level = determineLevel(profileState.points);
  const levelRange = getLevelRange(level);
  const progressPercent = Math.min(
    100,
    Math.max(0, ((profileState.points - levelRange.min) / (levelRange.max - levelRange.min)) * 100)
  );

  // Initialize edited name when profile changes
  useEffect(() => {
    setEditedName(profileState.name);
  }, [profileState.name]);

  // Handle name update
  const handleSaveName = () => {
    if (editedName.trim()) {
      onUpdateProfile({
        ...profileState,
        name: editedName.trim()
      });
      setIsEditingName(false);
    }
  };

  // Fetch AI Impact Summary
  const handleGenerateAISummary = async () => {
    setLoadingSummary(true);
    setSummaryError(null);
    try {
      const response = await fetch('/api/citizen-impact-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          citizenName: profileState.name,
          points: profileState.points,
          level: level,
          pointsBreakdown: profileState.pointsBreakdown,
          unlockedBadges: profileState.unlockedBadges,
          isDemo: demoMode
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to reach Municipal Intelligence Service');
      }
      
      const data = await response.json();
      setAiSummary(data);
    } catch (err: any) {
      console.error('Error fetching AI Summary:', err);
      setSummaryError(err.message || 'Service temporarily offline');
      // Fallback local calculations
      const estPeople = (profileState.pointsBreakdown.reportsCount * 220) + (profileState.pointsBreakdown.verificationsCount * 30);
      const resolved = Math.max(1, Math.floor(profileState.pointsBreakdown.reportsCount * 0.8));
      setAiSummary({
        totalContribution: `Excellent work! Your profile shows you logged ${profileState.pointsBreakdown.reportsCount} critical issues and engaged in ${profileState.pointsBreakdown.verificationsCount} local community validations.`,
        estimatedPeopleHelped: estPeople || 60,
        estimatedPeopleHelpedReasoning: `By maintaining transparency and prompt reports in your district, you protected roughly ${estPeople || 60} neighbors from active street and environmental bottlenecks.`,
        resolvedBecauseOfUser: resolved,
        communityTrustScore: profileState.trustScore,
        suggestedActions: [
          "Report a new streetlight or road hazard (+50 points).",
          "Help review and verify 2 community reports on your live map (+30 points).",
          "Complete your daily comment log to build collaborative consensus."
        ]
      });
    } finally {
      setLoadingSummary(false);
    }
  };

  // Generate automatically on initial render if not present
  useEffect(() => {
    handleGenerateAISummary();
  }, [demoMode, profileState.pointsBreakdown]);

  // Combine leaderboard entries and inject current user in the correct rank
  const leaderboard: any[] = [...LEADERBOARD_SEED];
  const userEntry = {
    name: profileState.name,
    avatarUrl: profileState.avatarUrl,
    points: profileState.points,
    level: level,
    verifications: profileState.pointsBreakdown.verificationsCount,
    trustScore: profileState.trustScore,
    isUser: true
  };
  
  // Insert and sort
  leaderboard.push(userEntry);
  leaderboard.sort((a, b) => b.points - a.points);
  
  // Get user rank index
  const userRank = leaderboard.findIndex(entry => entry.isUser) + 1;

  // Render Badge Icons
  const getBadgeIcon = (iconName: string, unlocked: boolean) => {
    const baseClass = `w-12 h-12 rounded-2xl flex items-center justify-center shadow-md transition-all duration-300 ${
      unlocked 
        ? 'bg-gradient-to-tr text-white scale-100' 
        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-600'
    }`;

    switch (iconName) {
      case 'reporter':
        return (
          <div className={`${baseClass} ${unlocked ? 'from-indigo-500 to-indigo-600' : ''}`}>
            <Info className="w-6 h-6" />
          </div>
        );
      case 'verified':
        return (
          <div className={`${baseClass} ${unlocked ? 'from-emerald-500 to-emerald-600' : ''}`}>
            <CheckCircle className="w-6 h-6" />
          </div>
        );
      case 'guardian':
        return (
          <div className={`${baseClass} ${unlocked ? 'from-amber-500 to-orange-500' : ''}`}>
            <Shield className="w-6 h-6" />
          </div>
        );
      case 'contributor':
        return (
          <div className={`${baseClass} ${unlocked ? 'from-blue-500 to-indigo-500' : ''}`}>
            <Trophy className="w-6 h-6" />
          </div>
        );
      case 'collab':
        return (
          <div className={`${baseClass} ${unlocked ? 'from-violet-500 to-purple-500' : ''}`}>
            <Sparkles className="w-6 h-6" />
          </div>
        );
      case 'hero':
      default:
        return (
          <div className={`${baseClass} ${unlocked ? 'from-rose-500 to-pink-500' : ''}`}>
            <Award className="w-6 h-6" />
          </div>
        );
    }
  };

  // Get Badge color scheme for details card
  const getBadgeColorScheme = (iconName: string) => {
    switch (iconName) {
      case 'reporter': return 'from-indigo-500 to-indigo-600 text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-200 dark:border-indigo-500/20';
      case 'verified': return 'from-emerald-500 to-emerald-600 text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-200 dark:border-emerald-500/20';
      case 'guardian': return 'from-amber-500 to-orange-500 text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-200 dark:border-amber-500/20';
      case 'contributor': return 'from-blue-500 to-indigo-500 text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-500/10 border-blue-200 dark:border-blue-500/20';
      case 'collab': return 'from-violet-500 to-purple-500 text-purple-600 dark:text-purple-400 bg-purple-50 dark:bg-purple-500/10 border-purple-200 dark:border-purple-500/20';
      default: return 'from-rose-500 to-pink-500 text-rose-600 dark:text-rose-400 bg-rose-50 dark:bg-rose-500/10 border-rose-200 dark:border-rose-500/20';
    }
  };

  return (
    <div id="citizen-profile-container" className="space-y-8 pb-12">
      
      {/* Mode Status and Filter Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-4 bg-white dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl gap-4">
        <div className="flex items-center gap-3">
          <div className={`p-2 rounded-xl ${demoMode ? 'bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400' : 'bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400'}`}>
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white">
              Environment Context: {demoMode ? "Demo Sandbox Environment" : "Live Municipal Network"}
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {demoMode 
                ? "Showing simulated profile progress. Perfect for testing and system exploration." 
                : "Active production. Connect your real credentials to log valid citizen signals."}
            </p>
          </div>
        </div>
        <button
          id="btn-profile-environment-switch"
          onClick={onToggleDemoMode}
          className={`flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-xl border cursor-pointer transition-all duration-300 ${
            demoMode
              ? 'text-indigo-600 bg-indigo-50 border-indigo-200 hover:bg-indigo-100 dark:bg-indigo-500/10 dark:border-indigo-500/20 dark:text-indigo-400'
              : 'text-amber-600 bg-amber-50 border-amber-200 hover:bg-amber-100 dark:bg-amber-500/10 dark:border-amber-500/20 dark:text-amber-400'
          }`}
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Switch to {demoMode ? "Live Mode" : "Demo Sandbox"}</span>
        </button>
      </div>

      {/* Profile Header Block */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Citizen Info Card */}
        <div className="lg:col-span-2 glass-panel border border-slate-200 dark:border-slate-800 p-6 rounded-3xl flex flex-col justify-between transition-all duration-300 relative overflow-hidden bg-white dark:bg-[#070a13]/40">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 blur-3xl rounded-full"></div>
          
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="relative group">
              <img 
                src={profileState.avatarUrl} 
                alt="Avatar" 
                className="w-20 h-20 rounded-2xl object-cover border-2 border-indigo-500/20 shadow-lg"
              />
              <div className="absolute -bottom-2 -right-2 bg-gradient-to-tr from-indigo-600 to-violet-600 text-white p-1.5 rounded-lg shadow">
                <Trophy className="w-4 h-4" />
              </div>
            </div>

            <div className="flex-1 space-y-2 w-full">
              <div className="flex items-center gap-3 flex-wrap">
                {isEditingName ? (
                  <div className="flex items-center gap-2 w-full max-w-xs">
                    <input
                      type="text"
                      value={editedName}
                      onChange={(e) => setEditedName(e.target.value)}
                      className="px-3 py-1.5 text-sm bg-slate-100 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl focus:outline-none focus:border-indigo-500 text-slate-900 dark:text-white"
                      maxLength={25}
                      autoFocus
                    />
                    <button 
                      onClick={handleSaveName}
                      className="p-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl"
                    >
                      <Check className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h3 className="text-2xl font-bold text-slate-900 dark:text-white font-display">
                      {profileState.name}
                    </h3>
                    <button 
                      onClick={() => setIsEditingName(true)}
                      className="p-1.5 text-slate-400 hover:text-indigo-500 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800/60 rounded-xl transition-all"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                  </>
                )}

                <span className="px-2.5 py-0.5 text-xs font-semibold uppercase tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-150 dark:border-indigo-500/20 rounded-lg">
                  Level: {level}
                </span>
              </div>

              <div className="flex items-center gap-6 text-sm text-slate-500 dark:text-slate-400">
                <div className="flex items-center gap-1.5">
                  <Flame className="text-orange-500 w-4 h-4" />
                  <span><strong>{profileState.points}</strong> Civic Points</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Users className="text-blue-500 w-4 h-4" />
                  <span>Leaderboard Rank: <strong>#{userRank}</strong></span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Heart className="text-rose-500 w-4 h-4" />
                  <span>Trust Score: <strong>{profileState.trustScore}%</strong></span>
                </div>
              </div>
            </div>
          </div>

          {/* Level Progress Slider */}
          <div className="mt-8 space-y-2">
            <div className="flex justify-between text-xs font-semibold text-slate-500 dark:text-slate-400">
              <span>{level} ({profileState.points} pts)</span>
              <span>Next Level: {level === 'Civic Champion' ? 'Maximum Cap' : `${levelRange.max + 1} pts`}</span>
            </div>
            <div className="relative h-3 bg-slate-100 dark:bg-slate-800/80 rounded-full overflow-hidden border border-slate-200/50 dark:border-slate-800">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: "easeOut" }}
                className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-indigo-600 to-violet-500 shadow-lg shadow-indigo-500/20"
              />
            </div>
            <p className="text-[11px] text-slate-400 dark:text-slate-500 leading-relaxed text-right">
              {level === 'Civic Champion' 
                ? "You have achieved the ultimate Civic Champion level! Thank you for protecting our city."
                : `Earn ${levelRange.max + 1 - profileState.points} more points to unlock the next contribution tier.`
              }
            </p>
          </div>

        </div>

        {/* Civic points breakdown / Rules card */}
        <div className="glass-panel border border-slate-200 dark:border-slate-800 p-6 rounded-3xl bg-white dark:bg-[#070a13]/40 flex flex-col justify-between">
          <div className="space-y-4">
            <h4 className="text-sm font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Trophy className="w-4 h-4 text-amber-500" />
              Civic Point Engine
            </h4>
            <div className="space-y-3">
              <div className="flex justify-between text-xs border-b border-slate-100 dark:border-slate-800/50 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Report Valid Issue</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">+{GAMIFICATION_RULES.REPORT_VALID} pts</span>
              </div>
              <div className="flex justify-between text-xs border-b border-slate-100 dark:border-slate-800/50 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Verify Incident Alert</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">+{GAMIFICATION_RULES.VERIFY_REPORT} pts</span>
              </div>
              <div className="flex justify-between text-xs border-b border-slate-100 dark:border-slate-800/50 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Upload Media/Evidence</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">+{GAMIFICATION_RULES.UPLOAD_EVIDENCE} pts</span>
              </div>
              <div className="flex justify-between text-xs border-b border-slate-100 dark:border-slate-800/50 pb-2">
                <span className="text-slate-500 dark:text-slate-400">Contribute Useful Comment</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">+{GAMIFICATION_RULES.ADD_COMMENT} pts</span>
              </div>
              <div className="flex justify-between text-xs pb-1">
                <span className="text-slate-500 dark:text-slate-400">Resolve Duplicate Logs</span>
                <span className="font-semibold text-indigo-600 dark:text-indigo-400">+{GAMIFICATION_RULES.RESOLVE_DUPLICATE} pts</span>
              </div>
            </div>
          </div>

          {/* Interactive Activity Simulator */}
          <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-800">
            <h5 className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-2 flex items-center gap-1">
              <Zap className="w-3.5 h-3.5 text-indigo-500" />
              Simulator (Sandbox Quick-Test)
            </h5>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={() => onAddActivity('report')}
                className="px-2 py-1.5 text-[10px] font-semibold rounded-lg bg-indigo-50 hover:bg-indigo-100 text-indigo-600 dark:bg-indigo-500/10 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/25 transition-all text-left truncate"
                title="Simulate reporting a valid neighborhood hazard"
              >
                + Log Report
              </button>
              <button
                onClick={() => onAddActivity('verify')}
                className="px-2 py-1.5 text-[10px] font-semibold rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-600 dark:bg-emerald-500/10 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-500/25 transition-all text-left truncate"
                title="Simulate community validation of a report"
              >
                + Verify Report
              </button>
              <button
                onClick={() => onAddActivity('evidence')}
                className="px-2 py-1.5 text-[10px] font-semibold rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-600 dark:bg-blue-500/10 dark:text-blue-400 border border-blue-100 dark:border-blue-500/25 transition-all text-left truncate"
                title="Simulate uploading quality media / photo evidence"
              >
                + Add Evidence
              </button>
              <button
                onClick={() => onAddActivity('comment')}
                className="px-2 py-1.5 text-[10px] font-semibold rounded-lg bg-purple-50 hover:bg-purple-100 text-purple-600 dark:bg-purple-500/10 dark:text-purple-400 border border-purple-100 dark:border-purple-500/25 transition-all text-left truncate"
                title="Simulate adding useful civic comments"
              >
                + Add Comment
              </button>
            </div>
          </div>
        </div>

      </div>

      {/* Main Section Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Hand: AI Generated Citizen Impact Summary & Challenges */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* AI Generated Citizen Impact Summary */}
          <div className="glass-panel border border-slate-200 dark:border-slate-800 p-6 rounded-3xl bg-white dark:bg-[#070a13]/40 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
              <span className="flex items-center gap-1 text-[10px] font-mono tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 px-2 py-1 rounded-md border border-indigo-100 dark:border-indigo-500/25">
                <Sparkles className="w-3 h-3 animate-pulse" />
                GEMINI AI POWERED
              </span>
            </div>

            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                Cognitive Citizen Impact Summary
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Real-time synthesis of how your contributions directly improve local district operations.
              </p>
            </div>

            {loadingSummary ? (
              <div className="py-8 flex flex-col items-center justify-center space-y-3">
                <RefreshCw className="w-8 h-8 text-indigo-500 animate-spin" />
                <p className="text-xs font-mono text-indigo-600 dark:text-indigo-400 animate-pulse">
                  Querying Smart-City Dispatch Records...
                </p>
              </div>
            ) : aiSummary ? (
              <div className="space-y-6">
                {/* Metric grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/50 dark:border-slate-800/80">
                    <span className="text-[10px] font-mono uppercase tracking-wide text-slate-500">Estimated People Helped</span>
                    <h5 className="text-2xl font-bold text-slate-900 dark:text-white font-display mt-1">
                      ~{aiSummary.estimatedPeopleHelped}
                    </h5>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                      Neighbors protected or assisted.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/50 dark:border-slate-800/80">
                    <span className="text-[10px] font-mono uppercase tracking-wide text-slate-500">Issues Resolved/Expedited</span>
                    <h5 className="text-2xl font-bold text-slate-900 dark:text-white font-display mt-1">
                      {aiSummary.resolvedBecauseOfUser}
                    </h5>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                      Under active dispatch.
                    </p>
                  </div>
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/60 rounded-2xl border border-slate-200/50 dark:border-slate-800/80">
                    <span className="text-[10px] font-mono uppercase tracking-wide text-slate-500">Community Trust Score</span>
                    <h5 className="text-2xl font-bold text-slate-900 dark:text-white font-display mt-1">
                      {aiSummary.communityTrustScore}%
                    </h5>
                    <p className="text-[10px] text-slate-400 mt-1 leading-normal">
                      Report accuracy Consensus rating.
                    </p>
                  </div>
                </div>

                {/* Narrative Assessment */}
                <div className="p-4 bg-indigo-50/40 dark:bg-indigo-950/10 border border-indigo-100 dark:border-indigo-500/10 rounded-2xl text-slate-700 dark:text-slate-300">
                  <p className="text-xs leading-relaxed">
                    "{aiSummary.totalContribution} {aiSummary.estimatedPeopleHelpedReasoning}"
                  </p>
                </div>

                {/* Suggested Next Actions */}
                <div className="space-y-3">
                  <h5 className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider font-mono">
                    Suggested Next Actions
                  </h5>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                    {aiSummary.suggestedActions.map((action, i) => (
                      <div 
                        key={i} 
                        className="p-3 bg-white dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800/60 rounded-xl text-[11px] leading-relaxed text-slate-600 dark:text-slate-400 flex items-start gap-2"
                      >
                        <span className="flex items-center justify-center w-5 h-5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 font-bold shrink-0">
                          {i + 1}
                        </span>
                        <span>{action}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-4 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 rounded-2xl text-xs flex items-center gap-2">
                <AlertCircle className="w-5 h-5" />
                <span>Could not synthesize profile impact at this time. Click generate below to re-try.</span>
              </div>
            )}

            <div className="flex justify-between items-center pt-2">
              <span className="text-[10px] text-slate-400">
                Last synced: {new Date().toLocaleTimeString()}
              </span>
              <button
                onClick={handleGenerateAISummary}
                disabled={loadingSummary}
                className="flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-semibold bg-transparent border border-indigo-150 dark:border-indigo-500/20 hover:bg-indigo-50 dark:hover:bg-indigo-500/5 px-3 py-1.5 rounded-xl transition-all cursor-pointer"
              >
                <RefreshCw className={`w-3.5 h-3.5 ${loadingSummary ? 'animate-spin' : ''}`} />
                <span>Re-Sync Impact File</span>
              </button>
            </div>
          </div>

          {/* Active Challenges Block */}
          <div className="glass-panel border border-slate-200 dark:border-slate-800 p-6 rounded-3xl bg-white dark:bg-[#070a13]/40 space-y-6">
            <div className="flex justify-between items-center">
              <div>
                <h4 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                  Active Civic Challenges
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                  Complete challenges to claim high-yield points and badges.
                </p>
              </div>
              <Flame className="w-5 h-5 text-orange-500 animate-pulse" />
            </div>

            {/* Weekly Challenges list */}
            <div className="space-y-4">
              <h5 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
                Weekly Operations
              </h5>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {WEEKLY_CHALLENGES_DEFINITION.map((chal) => {
                  // Calculate dynamic weekly progress from real states
                  let progress = 0;
                  if (chal.id === 'weekly-report') {
                    progress = profileState.pointsBreakdown.reportsCount;
                  } else if (chal.id === 'weekly-verify') {
                    progress = profileState.pointsBreakdown.verificationsCount;
                  }
                  
                  const isCompleted = progress >= chal.target;
                  const percent = Math.min(100, Math.round((progress / chal.target) * 100));

                  return (
                    <div 
                      key={chal.id}
                      className={`p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden bg-slate-50 dark:bg-slate-900/40 ${
                        isCompleted 
                          ? 'border-emerald-250 dark:border-emerald-500/20 bg-emerald-50/10 dark:bg-emerald-500/5' 
                          : 'border-slate-200 dark:border-slate-800/80'
                      }`}
                    >
                      <div className="flex justify-between items-start gap-3">
                        <div>
                          <h6 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                            {chal.title}
                            {isCompleted && (
                              <span className="text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-md font-mono">
                                COMPLETED
                              </span>
                            )}
                          </h6>
                          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                            {chal.description}
                          </p>
                        </div>
                        <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                          +{chal.pointsReward} PTS
                        </span>
                      </div>

                      {/* Progress bar */}
                      <div className="mt-4 space-y-1.5">
                        <div className="flex justify-between text-[11px] font-mono text-slate-500">
                          <span>Progress: {progress} / {chal.target}</span>
                          <span>{percent}%</span>
                        </div>
                        <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all duration-500 ${
                              isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'
                            }`}
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Monthly Challenge */}
            <div className="space-y-4">
              <h5 className="text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
                Monthly Operations
              </h5>
              {MONTHLY_CHALLENGES_DEFINITION.map((chal) => {
                const totalCont = profileState.pointsBreakdown.reportsCount + profileState.pointsBreakdown.verificationsCount + profileState.pointsBreakdown.commentsCount;
                const progress = totalCont;
                const isCompleted = progress >= chal.target;
                const percent = Math.min(100, Math.round((progress / chal.target) * 100));

                return (
                  <div 
                    key={chal.id}
                    className={`p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden bg-slate-50 dark:bg-slate-900/40 ${
                      isCompleted 
                        ? 'border-emerald-250 dark:border-emerald-500/20 bg-emerald-50/10 dark:bg-emerald-500/5' 
                        : 'border-slate-200 dark:border-slate-800/80'
                    }`}
                  >
                    <div className="flex justify-between items-start gap-3">
                      <div>
                        <h6 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
                          {chal.title}
                          {isCompleted && (
                            <span className="text-[10px] bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 px-1.5 py-0.5 rounded-md font-mono">
                              COMPLETED
                            </span>
                          )}
                        </h6>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-normal">
                          {chal.description}
                        </p>
                      </div>
                      <span className="text-xs font-mono font-bold text-indigo-600 dark:text-indigo-400 shrink-0">
                        +{chal.pointsReward} PTS
                      </span>
                    </div>

                    {/* Progress bar */}
                    <div className="mt-4 space-y-1.5">
                      <div className="flex justify-between text-[11px] font-mono text-slate-500">
                        <span>Progress: {progress} / {chal.target} total contributions</span>
                        <span>{percent}%</span>
                      </div>
                      <div className="h-2 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                        <div 
                          className={`h-full rounded-full transition-all duration-500 ${
                            isCompleted ? 'bg-emerald-500' : 'bg-indigo-600'
                          }`}
                          style={{ width: `${percent}%` }}
                        />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

          </div>

        </div>

        {/* Right Hand Column: Achievement Badges and Leaderboard */}
        <div className="space-y-8">
          
          {/* Achievement Badges Grid */}
          <div className="glass-panel border border-slate-200 dark:border-slate-800 p-6 rounded-3xl bg-white dark:bg-[#070a13]/40 space-y-6">
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                Achievement Badges
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Hover or click to view details and requirements.
              </p>
            </div>

            <div className="grid grid-cols-3 gap-4">
              {BADGE_DEFINITIONS.map((badge) => {
                // Calculate if badge is unlocked
                let isUnlocked = false;
                if (badge.id === 'first-reporter') {
                  isUnlocked = profileState.pointsBreakdown.reportsCount >= 1;
                } else if (badge.id === 'verified-citizen') {
                  isUnlocked = profileState.pointsBreakdown.verificationsCount >= 3;
                } else if (badge.id === 'guardian-city') {
                  isUnlocked = profileState.pointsBreakdown.reportsCount >= 3;
                } else if (badge.id === 'top-contributor') {
                  isUnlocked = profileState.points >= 300;
                } else if (badge.id === 'ai-collaborator') {
                  isUnlocked = profileState.pointsBreakdown.reportsCount >= 2; // Involve AI for 2+ reports
                } else if (badge.id === 'community-hero') {
                  isUnlocked = profileState.trustScore >= 95;
                }

                return (
                  <button
                    key={badge.id}
                    id={`btn-badge-${badge.id}`}
                    onClick={() => setSelectedBadge({ ...badge, unlockedAt: isUnlocked ? 'Unlocked' : undefined })}
                    className={`flex flex-col items-center justify-center p-3 rounded-2xl border transition-all duration-300 group relative cursor-pointer ${
                      isUnlocked 
                        ? 'border-indigo-150 dark:border-indigo-500/15 bg-indigo-50/20 dark:bg-indigo-500/5 hover:scale-105' 
                        : 'border-slate-100 dark:border-slate-800/60 bg-transparent opacity-60 hover:opacity-100'
                    }`}
                  >
                    {getBadgeIcon(badge.iconName, isUnlocked)}
                    
                    <span className="text-[10px] text-center font-semibold text-slate-700 dark:text-slate-300 mt-2 truncate w-full">
                      {badge.name}
                    </span>

                    {!isUnlocked && (
                      <Lock className="w-3.5 h-3.5 absolute top-1 right-1 text-slate-300 dark:text-slate-700" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* Badge Details Card (Sub-modal state) */}
            <AnimatePresence mode="wait">
              {selectedBadge ? (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className={`p-4 border rounded-2xl flex items-start gap-3 relative ${getBadgeColorScheme(selectedBadge.iconName)}`}
                >
                  <button
                    onClick={() => setSelectedBadge(null)}
                    className="absolute top-2 right-2 text-xs font-bold text-slate-400 hover:text-slate-600 dark:hover:text-white"
                  >
                    ✕
                  </button>
                  <div className="space-y-1 pr-4">
                    <h5 className="text-sm font-bold">{selectedBadge.name}</h5>
                    <p className="text-xs opacity-90 leading-normal">{selectedBadge.description}</p>
                    <div className="flex items-center gap-1 text-[10px] font-mono pt-1">
                      <span>Requirement:</span>
                      <strong className="underline">{selectedBadge.requirementText}</strong>
                    </div>
                    <p className="text-[10px] font-bold mt-2">
                      Status: {selectedBadge.unlockedAt ? "✅ Unlocked & Active" : "🔒 Locked"}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <div className="p-4 bg-slate-50 dark:bg-slate-900/20 border border-slate-200/50 dark:border-slate-800 rounded-2xl flex items-center gap-2.5 text-xs text-slate-500 dark:text-slate-400">
                  <Info className="w-4 h-4 text-slate-400 shrink-0" />
                  <span>Select any badge from the grid to review unlocked benefits, status, and municipal credentials.</span>
                </div>
              )}
            </AnimatePresence>
          </div>

          {/* Community Leaderboard */}
          <div className="glass-panel border border-slate-200 dark:border-slate-800 p-6 rounded-3xl bg-white dark:bg-[#070a13]/40 space-y-6">
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                Community Leaderboard
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                Top active citizens contributing to district improvements.
              </p>
            </div>

            <div className="space-y-3">
              {leaderboard.map((entry, idx) => {
                const rank = idx + 1;
                const isUser = entry.isUser;

                return (
                  <div 
                    key={idx}
                    className={`flex items-center justify-between p-3 rounded-xl border transition-all duration-300 ${
                      isUser 
                        ? 'border-indigo-300 dark:border-indigo-500 bg-indigo-50/30 dark:bg-indigo-500/10 shadow-md ring-1 ring-indigo-500/30 animate-pulse' 
                        : 'border-slate-100 dark:border-slate-800/40 bg-slate-50/40 dark:bg-slate-900/10'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {/* Rank Indicator */}
                      <span className={`w-5 text-center text-xs font-bold font-mono ${
                        rank === 1 ? 'text-amber-500' : rank === 2 ? 'text-slate-400' : rank === 3 ? 'text-amber-700' : 'text-slate-500'
                      }`}>
                        #{rank}
                      </span>
                      
                      <img 
                        src={entry.avatarUrl} 
                        alt={entry.name} 
                        className="w-8 h-8 rounded-lg object-cover"
                      />

                      <div className="space-y-0.5">
                        <p className="text-xs font-semibold text-slate-900 dark:text-white flex items-center gap-1">
                          {entry.name}
                          {isUser && (
                            <span className="text-[9px] bg-indigo-600 text-white px-1 py-0.2 rounded">YOU</span>
                          )}
                        </p>
                        <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-mono">
                          {entry.level}
                        </span>
                      </div>
                    </div>

                    <div className="text-right space-y-0.5">
                      <p className="text-xs font-bold text-slate-900 dark:text-white">
                        {entry.points} pts
                      </p>
                      <p className="text-[9px] text-slate-500 font-mono">
                        {entry.verifications} verifications | {entry.trustScore}% trust
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}
