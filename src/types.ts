export type View = 'dashboard' | 'report' | 'mission-control' | 'generated-case' | 'map' | 'impact-dashboard' | 'profile' | 'command-center' | 'accessibility';

export interface VerificationTimelineEvent {
  id: string;
  citizenName: string;
  type: 'verify' | 'inaccurate' | 'duplicate' | 'photo_confirm' | 'ai_update';
  comment: string;
  timestamp: string;
}

export interface CommunityVerification {
  verifications: number; // total positive confirmations
  inaccurateCount: number; // total negative confirmations (marked inaccurate or duplicate)
  comments: {
    author: string;
    text: string;
    timestamp: string;
    type: 'verify' | 'inaccurate' | 'duplicate' | 'photo_confirm';
  }[];
  timeline: VerificationTimelineEvent[];
}

export interface IssueReport {
  id: string;
  title: string;
  category: string;
  description: string;
  imageUrl?: string;
  voiceDuration?: number; // in seconds
  voiceUrl?: string; // audio playback url or base64 data url
  isDemo?: boolean; // distinguishes demo presentation data from live reports
  location: {
    lat: number;
    lng: number;
    address: string;
  };
  createdAt: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'draft' | 'analyzing' | 'resolved' | 'failed' | 'active';
  ticketId?: string;
  aiSummary?: string;
  translatedTitle?: string;
  translatedDescription?: string;
  translatedCategory?: string;
  communityVerification?: CommunityVerification;
  analysis?: {
    issueType: string;
    title: string;
    summary: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    confidence: number;
    authority: string;
    reasoning: string;
    affectedArea: string;
    suggestedActions: string[];
    citizenImpact: string;
    urgencyScore: number;
    agents: {
      vision: { status: string; confidence: number; reasoning: string };
      geo: { status: string; confidence: number; reasoning: string };
      verification: { status: string; confidence: number; reasoning: string };
      priority: { status: string; confidence: number; reasoning: string };
      resolution: { status: string; confidence: number; reasoning: string };
      deployment: { status: string; confidence: number; reasoning: string };
    };
  };
}

export interface AgentLog {
  timestamp: string;
  message: string;
  type: 'info' | 'success' | 'warning' | 'error';
}

export interface Agent {
  id: string;
  name: string;
  role: string;
  status: 'idle' | 'processing' | 'success' | 'warning';
  progress: number;
  iconName: string;
  description: string;
  logs: AgentLog[];
}

export interface PredictiveHotspot {
  name: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  predictedIssueType: string;
  confidence: number;
  reasoning: string;
}

export interface RecurringCategoryPrediction {
  category: string;
  recurrenceScore: number;
  trend: 'rising' | 'stable' | 'declining';
  description: string;
}

export interface ResolutionDelayPrediction {
  category: string;
  currentDelayDays: number;
  predictedDelayDays: number;
  delayReason: string;
}

export interface PreventiveActionPrediction {
  id: string;
  title: string;
  action: string;
  targetDepartment: string;
  impact: string;
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

export interface PredictiveInsightsData {
  insufficientData: boolean;
  hotspots: PredictiveHotspot[];
  recurringCategories: RecurringCategoryPrediction[];
  resolutionDelays: ResolutionDelayPrediction[];
  preventiveActions: PreventiveActionPrediction[];
}

