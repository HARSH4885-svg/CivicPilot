import React, { useState } from 'react';
import { 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  MessageSquare, 
  Clock, 
  PlusCircle, 
  Sparkles, 
  User, 
  ShieldCheck, 
  FileCheck2,
  AlertCircle
} from 'lucide-react';
import { IssueReport, CommunityVerification, VerificationTimelineEvent } from '../types';

interface CommunityVerificationSectionProps {
  report: IssueReport;
  onUpdateVerification: (id: string, updatedVerification: CommunityVerification, updatedAnalysis?: any) => void;
}

export default function CommunityVerificationSection({ 
  report, 
  onUpdateVerification 
}: CommunityVerificationSectionProps) {
  const [citizenName, setCitizenName] = useState(() => {
    // Try to sync with gamified profile name
    try {
      const savedLive = localStorage.getItem('civicpilot_live_profile');
      if (savedLive) {
        const parsed = JSON.parse(savedLive);
        if (parsed.name) return parsed.name;
      }
    } catch (e) {}
    return 'Alex Carter';
  });
  const [commentText, setCommentText] = useState('');
  const [verificationType, setVerificationType] = useState<'verify' | 'inaccurate' | 'duplicate'>('verify');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fallback if report doesn't have verification initialized
  const verData: CommunityVerification = report.communityVerification || {
    verifications: 1,
    inaccurateCount: 0,
    comments: [],
    timeline: [
      {
        id: 'init-evt',
        citizenName: 'Reporter (You)',
        type: 'verify',
        comment: 'Citizen submitted report with system hash metadata confirmation.',
        timestamp: new Date().toISOString()
      }
    ]
  };

  // Calculations
  const totalVotes = verData.verifications + verData.inaccurateCount;
  const confidencePercent = totalVotes > 0 
    ? Math.round((verData.verifications / totalVotes) * 100) 
    : 100;

  // Consensus determination
  let consensus = 'Unknown';
  let consensusColor = 'text-slate-500 bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800';
  if (totalVotes === 0) {
    consensus = 'Pending Input';
  } else if (confidencePercent >= 80 && verData.verifications >= 3) {
    consensus = 'Strong Consensus (Verified)';
    consensusColor = 'text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-500/10 border-emerald-150 dark:border-emerald-500/20';
  } else if (confidencePercent >= 60) {
    consensus = 'Moderate Consensus';
    consensusColor = 'text-indigo-700 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border-indigo-150 dark:border-indigo-500/20';
  } else if (confidencePercent >= 40) {
    consensus = 'Contested / Split';
    consensusColor = 'text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border-amber-150 dark:border-amber-500/20';
  } else {
    consensus = 'Unreliable / Flagged';
    consensusColor = 'text-red-700 dark:text-red-400 bg-red-50 dark:bg-red-500/10 border-red-150 dark:border-red-500/20';
  }

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!citizenName.trim() || !commentText.trim()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      // 1. Prepare new verification counts
      let updatedVerifications = verData.verifications;
      let updatedInaccurateCount = verData.inaccurateCount;

      if (verificationType === 'verify') {
        updatedVerifications += 1;
      } else {
        updatedInaccurateCount += 1;
      }

      // 2. Add comment to comment array
      const newComment = {
        author: citizenName.trim(),
        text: commentText.trim(),
        timestamp: new Date().toISOString(),
        type: verificationType as 'verify' | 'inaccurate' | 'duplicate'
      };

      // 3. Create citizen timeline event
      const citizenTimelineId = `evt-${Math.random().toString(36).substr(2, 9)}`;
      const citizenTimelineEvent: VerificationTimelineEvent = {
        id: citizenTimelineId,
        citizenName: citizenName.trim(),
        type: verificationType,
        comment: commentText.trim(),
        timestamp: new Date().toISOString()
      };

      // 4. Calculate new AI confidence based on updated community weights
      const baseModelConfidence = report.isDemo ? 95 : 85;
      const newTotalVotes = updatedVerifications + updatedInaccurateCount;
      const communityRatio = updatedVerifications / newTotalVotes;
      const communityWeight = 0.4; // 40% weight to community feedback
      const communityScore = communityRatio * 100;
      
      const newConfidence = Math.round(
        baseModelConfidence * (1 - communityWeight) + communityScore * communityWeight
      );

      // 5. Create AI confidence updated timeline event
      const aiTimelineEvent: VerificationTimelineEvent = {
        id: `evt-ai-${Math.random().toString(36).substr(2, 9)}`,
        citizenName: 'Municipal AI Engine',
        type: 'ai_update',
        comment: `AI confidence updated to ${newConfidence}% incorporating new citizen credentials.`,
        timestamp: new Date().toISOString()
      };

      // Compile updated verification
      const updatedVerification: CommunityVerification = {
        verifications: updatedVerifications,
        inaccurateCount: updatedInaccurateCount,
        comments: [...verData.comments, newComment],
        timeline: [...verData.timeline, citizenTimelineEvent, aiTimelineEvent]
      };

      // Modify the analysis object to reflect the new confidence scores
      const updatedAnalysis = report.analysis ? {
        ...report.analysis,
        confidence: newConfidence,
        agents: {
          ...report.analysis.agents,
          verification: {
            ...report.analysis.agents.verification,
            confidence: Math.round(newConfidence * 1.05 > 100 ? 100 : newConfidence * 1.05),
            reasoning: `Adjusted using community verified signals (${updatedVerifications} positive, ${updatedInaccurateCount} inaccurate flags).`
          }
        }
      } : undefined;

      onUpdateVerification(report.id, updatedVerification, updatedAnalysis);

      // Reset form fields
      setCitizenName('');
      setCommentText('');
      setVerificationType('verify');
      setIsSubmitting(false);
    }, 450);
  };

  return (
    <div id="community-verification-root" className="space-y-6">
      {/* Community Verification Summary Card */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/20 shadow-sm transition-all duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-900 pb-4 mb-5">
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl border border-indigo-150 dark:border-indigo-500/20">
              <Users className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white">Community Verification Hub</h4>
              <p className="text-[11px] text-slate-500">Citizen consensus metrics and validation timeline</p>
            </div>
          </div>

          {/* Condition: If confidence >= 80%, show badge */}
          {confidencePercent >= 80 && verData.verifications >= 1 && (
            <div 
              id="community-verified-badge"
              className="flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 animate-pulse uppercase tracking-wide shrink-0"
            >
              <ShieldCheck className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
              <span>Community Verified</span>
            </div>
          )}
        </div>

        {/* Triple Grid Metrics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-5">
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-850/60 flex items-center gap-3.5 transition-colors">
            <div className="p-2.5 bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 rounded-lg">
              <FileCheck2 className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-slate-500">TOTAL VERIFICATIONS</p>
              <p className="text-base font-bold text-slate-900 dark:text-white mt-0.5">{verData.verifications}</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-850/60 flex items-center gap-3.5 transition-colors">
            <div className="p-2.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 rounded-lg">
              <Sparkles className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <p className="text-[10px] font-mono text-slate-500">VERIFICATION CONFIDENCE</p>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-base font-bold text-slate-900 dark:text-white">{confidencePercent}%</span>
                <div className="flex-1 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
                    style={{ width: `${confidencePercent}%` }} 
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-150 dark:border-slate-850/60 flex items-center gap-3.5 transition-colors">
            <div className="p-2.5 bg-slate-100 dark:bg-slate-800 rounded-lg text-slate-600 dark:text-slate-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono text-slate-500">COMMUNITY CONSENSUS</p>
              <span className={`inline-block text-[11px] font-semibold px-2 py-0.5 rounded border mt-1 ${consensusColor}`}>
                {consensus}
              </span>
            </div>
          </div>
        </div>

        {/* Verification Timeline */}
        <div className="space-y-3 mt-6">
          <h5 className="text-xs font-mono text-slate-500 uppercase tracking-wider">Verification Timeline</h5>
          <div className="relative pl-6 border-l-2 border-slate-200 dark:border-slate-800 space-y-5 py-2">
            {verData.timeline.map((event, idx) => {
              const isAIUpdate = event.type === 'ai_update';
              const isVerify = event.type === 'verify' || event.type === 'photo_confirm';
              const isDuplicate = event.type === 'duplicate';
              const isInaccurate = event.type === 'inaccurate';

              let badgeColor = 'bg-slate-100 text-slate-600 border-slate-200';
              let iconNode = <User className="w-3 h-3" />;
              if (isAIUpdate) {
                badgeColor = 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border-indigo-500/20';
                iconNode = <Sparkles className="w-3 h-3 text-indigo-500" />;
              } else if (isVerify) {
                badgeColor = 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20';
                iconNode = <CheckCircle2 className="w-3 h-3 text-emerald-500" />;
              } else if (isDuplicate) {
                badgeColor = 'bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20';
                iconNode = <AlertCircle className="w-3 h-3 text-amber-500" />;
              } else if (isInaccurate) {
                badgeColor = 'bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20';
                iconNode = <AlertTriangle className="w-3 h-3 text-red-500" />;
              }

              return (
                <div key={event.id} className="relative group">
                  {/* Outer timeline indicator dot */}
                  <span className={`absolute -left-[31px] top-1 w-4 h-4 rounded-full border bg-white dark:bg-slate-950 flex items-center justify-center ${
                    isAIUpdate ? 'border-indigo-500' : isVerify ? 'border-emerald-500' : 'border-slate-300 dark:border-slate-800'
                  }`}>
                    <span className={`w-1.5 h-1.5 rounded-full ${
                      isAIUpdate ? 'bg-indigo-500' : isVerify ? 'bg-emerald-500' : 'bg-slate-400'
                    }`} />
                  </span>

                  {/* Timeline Event Card */}
                  <div className="flex flex-col gap-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-100">{event.citizenName}</span>
                      <span className={`text-[10px] font-mono uppercase px-1.5 py-0.2 rounded border flex items-center gap-1 font-bold ${badgeColor}`}>
                        {iconNode}
                        {event.type.replace('_', ' ')}
                      </span>
                      <span className="text-[10px] text-slate-400 font-mono flex items-center gap-1 ml-auto">
                        <Clock className="w-3 h-3" />
                        {new Date(event.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed font-sans">{event.comment}</p>
                  </div>

                  {/* Arrow connector between timeline events */}
                  {idx < verData.timeline.length - 1 && (
                    <div className="absolute left-[-23px] bottom-[-22px] w-0.5 h-3 flex flex-col justify-center items-center pointer-events-none opacity-30">
                      <span className="text-[8px] text-slate-400 font-bold">↓</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Citizens Action: Form to verify/flag the issue */}
      <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/20 shadow-sm transition-colors duration-300">
        <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-1.5 flex items-center gap-2">
          <PlusCircle className="w-4.5 h-4.5 text-indigo-600 dark:text-indigo-400" />
          Citizen Verification Registry
        </h4>
        <p className="text-xs text-slate-500 mb-4">Are you in the area? Log your verification or flag inaccuracies below to assist municipal routing networks.</p>

        <form onSubmit={handleFormSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label htmlFor="citizen-name-input" className="block text-xs font-mono text-slate-500 mb-1.5">CITIZEN_FULL_NAME</label>
              <input
                id="citizen-name-input"
                type="text"
                placeholder="e.g. Officer Ramirez / Jane Doe"
                value={citizenName}
                onChange={(e) => setCitizenName(e.target.value)}
                required
                className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 transition-all font-sans"
              />
            </div>

            <div>
              <label htmlFor="verification-type-select" className="block text-xs font-mono text-slate-500 mb-1.5">VERIFICATION_ACTION</label>
              <div className="flex rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 p-1">
                <button
                  type="button"
                  onClick={() => setVerificationType('verify')}
                  className={`flex-1 py-1.5 text-[11px] font-semibold rounded-lg transition-all ${
                    verificationType === 'verify'
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Verify Issue
                </button>
                <button
                  type="button"
                  onClick={() => setVerificationType('inaccurate')}
                  className={`flex-1 py-1.5 text-[11px] font-semibold rounded-lg transition-all ${
                    verificationType === 'inaccurate'
                      ? 'bg-red-500 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Mark Inaccurate
                </button>
                <button
                  type="button"
                  onClick={() => setVerificationType('duplicate')}
                  className={`flex-1 py-1.5 text-[11px] font-semibold rounded-lg transition-all ${
                    verificationType === 'duplicate'
                      ? 'bg-amber-500 text-white shadow-sm'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
                  }`}
                >
                  Duplicate
                </button>
              </div>
            </div>
          </div>

          <div>
            <label htmlFor="verification-comment-textarea" className="block text-xs font-mono text-slate-500 mb-1.5">CONFIRMATION_COMMENT</label>
            <textarea
              id="verification-comment-textarea"
              placeholder="Provide a short confirmation note on visual status or safety updates..."
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              required
              rows={3}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/60 text-xs text-slate-800 dark:text-slate-200 outline-none focus:border-indigo-500 transition-all resize-none font-sans"
            />
          </div>

          <div className="flex justify-end">
            <button
              id="submit-verification-btn"
              type="submit"
              disabled={isSubmitting || !citizenName.trim() || !commentText.trim()}
              className="flex items-center gap-2 py-2.5 px-5 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 shadow-md shadow-indigo-600/10 active:scale-95 transition-all cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isSubmitting ? 'Registering...' : 'Register Verification'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
