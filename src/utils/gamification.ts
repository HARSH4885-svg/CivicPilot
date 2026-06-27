export interface Badge {
  id: string;
  name: string;
  description: string;
  iconName: 'hero' | 'reporter' | 'verified' | 'guardian' | 'contributor' | 'collab';
  unlockedAt?: string;
  requirementText: string;
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  pointsReward: number;
  progress: number;
  target: number;
  isCompleted: boolean;
  type: 'weekly' | 'monthly';
}

export interface CitizenProfileState {
  name: string;
  avatarUrl: string;
  points: number;
  pointsBreakdown: {
    reportsCount: number; // +50
    verificationsCount: number; // +15
    evidenceCount: number; // +30
    commentsCount: number; // +10
    duplicatesCount: number; // +25
  };
  unlockedBadges: string[];
  completedChallenges: string[];
  trustScore: number; // out of 100
}

export interface LeaderboardEntry {
  name: string;
  avatarUrl: string;
  points: number;
  level: string;
  verifications: number;
  trustScore: number;
  isUser?: boolean;
}

export const GAMIFICATION_RULES = {
  REPORT_VALID: 50,
  VERIFY_REPORT: 15,
  UPLOAD_EVIDENCE: 30,
  ADD_COMMENT: 10,
  RESOLVE_DUPLICATE: 25,
};

export const BADGE_DEFINITIONS: Badge[] = [
  {
    id: 'first-reporter',
    name: 'First Reporter',
    description: 'Logged your first neighborhood issue report successfully.',
    iconName: 'reporter',
    requirementText: 'Report 1 issue',
  },
  {
    id: 'verified-citizen',
    name: 'Verified Citizen',
    description: 'Your reports are consistently validated by the community.',
    iconName: 'verified',
    requirementText: 'Earn 3 community verifications on your reports',
  },
  {
    id: 'guardian-city',
    name: 'Guardian of the City',
    description: 'Active defender of public safety, environment, and infrastructure.',
    iconName: 'guardian',
    requirementText: 'Report 3 active issues in critical or high severity categories',
  },
  {
    id: 'top-contributor',
    name: 'Top Contributor',
    description: 'A pillar of neighborhood improvement, reaching Gold contribution status.',
    iconName: 'contributor',
    requirementText: 'Earn 300 total Civic Points',
  },
  {
    id: 'ai-collaborator',
    name: 'AI Collaborator',
    description: 'Highly active in generating complete AI case files and optimizing dispatch data.',
    iconName: 'collab',
    requirementText: 'Involve multi-agent municipal analysis for 3 reports',
  },
  {
    id: 'community-hero',
    name: 'Community Hero',
    description: 'Earned the highest level of trust and active engagement from fellow citizens.',
    iconName: 'hero',
    requirementText: 'Reach a Community Trust Score of 95+',
  }
];

export function determineLevel(points: number): 'Bronze' | 'Silver' | 'Gold' | 'Platinum' | 'Civic Champion' {
  if (points >= 1000) return 'Civic Champion';
  if (points >= 600) return 'Platinum';
  if (points >= 300) return 'Gold';
  if (points >= 100) return 'Silver';
  return 'Bronze';
}

export function getLevelRange(level: string): { min: number; max: number } {
  switch (level) {
    case 'Civic Champion': return { min: 1000, max: 2000 };
    case 'Platinum': return { min: 600, max: 999 };
    case 'Gold': return { min: 300, max: 599 };
    case 'Silver': return { min: 100, max: 299 };
    default: return { min: 0, max: 99 };
  }
}

export function getInitialProfileState(isDemo: boolean): CitizenProfileState {
  if (isDemo) {
    // Demo sandbox defaults to moderate starting progress to demonstrate features
    return {
      name: 'Alex Carter (Demo Sandbox)',
      avatarUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
      points: 240,
      pointsBreakdown: {
        reportsCount: 3, // 150 pts
        verificationsCount: 4, // 60 pts
        evidenceCount: 1, // 30 pts
        commentsCount: 0, // 0 pts
        duplicatesCount: 0, // 0 pts
      },
      unlockedBadges: ['first-reporter'],
      completedChallenges: ['weekly-verify'],
      trustScore: 82,
    };
  } else {
    // Live sandbox starts fresh but retains natural citizen profile details
    return {
      name: 'Citizen #2841',
      avatarUrl: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&auto=format&fit=crop&q=80',
      points: 50, // Starts with some points for setup
      pointsBreakdown: {
        reportsCount: 1, // 50 pts
        verificationsCount: 0,
        evidenceCount: 0,
        commentsCount: 0,
        duplicatesCount: 0,
      },
      unlockedBadges: [],
      completedChallenges: [],
      trustScore: 75,
    };
  }
}

export const WEEKLY_CHALLENGES_DEFINITION = [
  {
    id: 'weekly-report',
    title: 'Eyes of the Streets',
    description: 'Report at least 2 neighborhood issues in Live Mode.',
    target: 2,
    pointsReward: 75,
    type: 'weekly' as const,
  },
  {
    id: 'weekly-verify',
    title: 'Civic Validator',
    description: 'Verify 3 community-reported alerts to build consensus.',
    target: 3,
    pointsReward: 50,
    type: 'weekly' as const,
  }
];

export const MONTHLY_CHALLENGES_DEFINITION = [
  {
    id: 'monthly-neighborhood',
    title: 'Neighborhood Guardian',
    description: 'Help improve your neighborhood by contributing with 3 valid reports and 5 comments or verifications.',
    target: 8,
    pointsReward: 200,
    type: 'monthly' as const,
  }
];

export const LEADERBOARD_SEED: LeaderboardEntry[] = [
  { name: 'Marcus Vance', avatarUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&auto=format&fit=crop&q=80', points: 1420, level: 'Civic Champion', verifications: 42, trustScore: 98 },
  { name: 'Sarah Jenkins', avatarUrl: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&auto=format&fit=crop&q=80', points: 940, level: 'Platinum', verifications: 28, trustScore: 96 },
  { name: 'Liam Sterling', avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&auto=format&fit=crop&q=80', points: 720, level: 'Platinum', verifications: 19, trustScore: 93 },
  { name: 'Maya Lin', avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&auto=format&fit=crop&q=80', points: 580, level: 'Gold', verifications: 14, trustScore: 89 },
  { name: 'Officer Brooks', avatarUrl: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&auto=format&fit=crop&q=80', points: 350, level: 'Gold', verifications: 11, trustScore: 95 },
];
