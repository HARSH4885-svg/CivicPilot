import { IssueReport, Agent } from '../types';
// @ts-ignore
import regeneratedImage from '../assets/images/regenerated_image_1782549420873.png';

export const INITIAL_REPORTS: IssueReport[] = [
  {
    id: 'CP-8901',
    title: 'Water Main Burst & Road Erosion',
    category: 'Water & Utilities',
    description: 'A major water line is ruptured, pouring thousands of gallons onto Elm Street. The water flow has begun eroding the sub-base of the asphalt, creating dangerous sinkholes. Immediate public works intervention required.',
    imageUrl: regeneratedImage,
    location: {
      lat: 37.7749,
      lng: -122.4194,
      address: '1420 Elm Street, Sector 4'
    },
    createdAt: '2026-06-25T14:30:00Z',
    severity: 'critical',
    status: 'active',
    ticketId: 'TX-ELM-901',
    aiSummary: 'Critical utilities failure. Water main rupture leading to high-volume flooding and active asphalt erosion. High risk of localized sinkhole and traffic disruption. Recommended immediate valve shutoff and emergency lane closure.',
    communityVerification: {
      verifications: 14,
      inaccurateCount: 1,
      comments: [
        { author: 'Elena R.', text: 'Water is gushing out rapidly. The road surface is visibly cracking.', timestamp: '2026-06-25T14:45:00Z', type: 'verify' },
        { author: 'Dave M.', text: 'Confirmed. Soil is washing away below the pavement.', timestamp: '2026-06-25T15:02:00Z', type: 'photo_confirm' }
      ],
      timeline: [
        { id: 'evt-1', citizenName: 'Elena R.', type: 'verify', comment: 'Water is gushing out rapidly. The road surface is visibly cracking.', timestamp: '2026-06-25T14:45:00Z' },
        { id: 'evt-2', citizenName: 'Dave M.', type: 'photo_confirm', comment: 'Confirmed with photo evidence of sub-base erosion.', timestamp: '2026-06-25T15:02:00Z' },
        { id: 'evt-3', citizenName: 'Sarah P.', type: 'verify', comment: 'Verified. Water levels are up to the sidewalk curbs now.', timestamp: '2026-06-25T15:10:00Z' },
        { id: 'evt-4', citizenName: 'System/AI Agent', type: 'ai_update', comment: 'Community consensus threshold reached. Autonomous confidence synced to 98.6%.', timestamp: '2026-06-25T15:15:00Z' }
      ]
    }
  },
  {
    id: 'CP-8742',
    title: 'Illegal Hazardous Chemical Dumping',
    category: 'Environmental Hazard',
    description: 'Multiple rusted metal drums labelled "Industrial Solvent" dumped in the nature reserve parking lot. Strong chemical odor, and fluid leaking into adjacent soil, threatening local watershed.',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=600&auto=format&fit=crop',
    location: {
      lat: 37.7833,
      lng: -122.4167,
      address: 'Oakwood Nature Reserve Trailhead'
    },
    createdAt: '2026-06-24T09:15:00Z',
    severity: 'high',
    status: 'analyzing',
    ticketId: 'TX-OAK-742',
    aiSummary: 'High-severity environmental hazard. Unregulated disposal of toxic solvents. High probability of soil contamination and surface runoff into riparian zone. Requires specialized hazmat containment and immediate EPA notification.',
    communityVerification: {
      verifications: 6,
      inaccurateCount: 0,
      comments: [
        { author: 'Robert J.', text: 'Yes, there is a very pungent solvent smell near the oakwood trailhead.', timestamp: '2026-06-24T09:30:00Z', type: 'verify' }
      ],
      timeline: [
        { id: 'evt-2-1', citizenName: 'Robert J.', type: 'verify', comment: 'Highly toxic smell near trail parking. Keep dogs away.', timestamp: '2026-06-24T09:30:00Z' },
        { id: 'evt-2-2', citizenName: 'Clara W.', type: 'photo_confirm', comment: 'Took additional pictures of the label "Industrial Solvent".', timestamp: '2026-06-24T10:05:00Z' },
        { id: 'evt-2-3', citizenName: 'System/AI Agent', type: 'ai_update', comment: 'AI Confidence elevated following multi-party visual verification.', timestamp: '2026-06-24T10:15:00Z' }
      ]
    }
  },
  {
    id: 'CP-8610',
    title: 'Traffic Signal Intersection Blackout',
    category: 'Traffic & Transit',
    description: 'The traffic light controller at 5th and Grand Ave is completely dead. Intersection is currently a blind four-way stop in a high-speed zone, leading to near-miss collisions every few minutes.',
    imageUrl: 'https://images.unsplash.com/photo-1494526508112-9c3f0bbfbf1f?q=80&w=600&auto=format&fit=crop',
    location: {
      lat: 37.7599,
      lng: -122.4312,
      address: '5th Ave & Grand Blvd'
    },
    createdAt: '2026-06-24T20:45:00Z',
    severity: 'high',
    status: 'resolved',
    ticketId: 'TX-GRD-610',
    aiSummary: 'Major traffic safety incident. Full intersection signal blackout in high-volume corridor. Auto-routed to Traffic Engineering Dispatch. Backup warning beacons activated.',
    communityVerification: {
      verifications: 19,
      inaccurateCount: 2,
      comments: [
        { author: 'Tom S.', text: 'Almost got T-boned here. Lights are completely dark.', timestamp: '2026-06-24T20:50:00Z', type: 'verify' }
      ],
      timeline: [
        { id: 'evt-3-1', citizenName: 'Tom S.', type: 'verify', comment: 'Extremely dangerous four-way blind intersection right now.', timestamp: '2026-06-24T20:50:00Z' },
        { id: 'evt-3-2', citizenName: 'Lucas K.', type: 'verify', comment: 'Confirmed. The backup power must have failed too.', timestamp: '2026-06-24T21:00:00Z' }
      ]
    }
  },
  {
    id: 'CP-8550',
    title: 'Structural Cracks on Pedestrian Overpass',
    category: 'Infrastructure',
    description: 'Significant concrete spalling and visible exposed, rusted rebar on the underside of the Central Highway bypass bridge. Chunks of concrete have started falling onto the pedestrian path below.',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600&auto=format&fit=crop',
    location: {
      lat: 37.7699,
      lng: -122.4468,
      address: 'Central Highway Overpass, Mile 14'
    },
    createdAt: '2026-06-23T11:20:00Z',
    severity: 'high',
    status: 'active',
    ticketId: 'TX-HWY-550',
    aiSummary: 'Structural integrity warning. Advanced concrete degradation on elevated pedestrian pathway. High risk of debris-strike injury to public pathway users. Requires urgent safety netting and engineering inspection.',
    communityVerification: {
      verifications: 8,
      inaccurateCount: 1,
      comments: [
        { author: 'Marcus G.', text: 'Concrete chunks fell on my path yesterday morning.', timestamp: '2026-06-23T11:45:00Z', type: 'verify' }
      ],
      timeline: [
        { id: 'evt-4-1', citizenName: 'Marcus G.', type: 'verify', comment: 'Debris is dropping onto the lower walking lanes.', timestamp: '2026-06-23T11:45:00Z' },
        { id: 'evt-4-2', citizenName: 'Jane D.', type: 'photo_confirm', comment: 'Uploaded detailed closeup of the rusted tension cables.', timestamp: '2026-06-23T12:15:00Z' }
      ]
    }
  },
  {
    id: 'CP-8422',
    title: 'Unlawful Blockage of ADA Access Ramp',
    category: 'Accessibility & Parking',
    description: 'A commercial cargo dumpster has been dropped directly blocking the handicap ramp in front of the Public Health Clinic, forcing wheelchair users to navigate into active traffic lanes.',
    imageUrl: 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?q=80&w=600&auto=format&fit=crop',
    location: {
      lat: 37.7781,
      lng: -122.4211,
      address: '405 Health Center Way'
    },
    createdAt: '2026-06-22T08:00:00Z',
    severity: 'medium',
    status: 'resolved',
    ticketId: 'TX-HLT-422',
    aiSummary: 'ADA compliance violation. Physical obstruction of clinical wheelchair access. Code enforcement citation automatically prepared and dispatched to the dumpster leasing agency.',
    communityVerification: {
      verifications: 4,
      inaccurateCount: 0,
      comments: [
        { author: 'Alice M.', text: 'Had to assist an elderly person in a wheelchair around the dumpster today.', timestamp: '2026-06-22T08:30:00Z', type: 'verify' }
      ],
      timeline: [
        { id: 'evt-5-1', citizenName: 'Alice M.', type: 'verify', comment: 'Ramp is 100% blocked by commercial dumpster.', timestamp: '2026-06-22T08:30:00Z' }
      ]
    }
  }
];

export const INITIAL_AGENTS: Agent[] = [
  {
    id: 'vision',
    name: 'Vision Agent',
    role: 'Visual Analysis & Damage Assessment',
    status: 'idle',
    progress: 0,
    iconName: 'Eye',
    description: 'Ingests photographic or video evidence, labels damage severity, detects public safety hazards, and quantifies spatial impact.',
    logs: []
  },
  {
    id: 'geo',
    name: 'Geo Agent',
    role: 'GIS & Asset Location Verification',
    status: 'idle',
    progress: 0,
    iconName: 'MapPin',
    description: 'Resolves raw coordinates against city infrastructure records, determines municipal jurisdiction, and cross-references nearby utility grids.',
    logs: []
  },
  {
    id: 'verification',
    name: 'Verification Agent',
    role: 'De-duplication & Credibility Rating',
    status: 'idle',
    progress: 0,
    iconName: 'ShieldCheck',
    description: 'Checks for overlapping active tickets, matches report against local news or weather streams, and assigns incident confidence score.',
    logs: []
  },
  {
    id: 'priority',
    name: 'Priority Agent',
    role: 'Dynamic Urgency Scoring',
    status: 'idle',
    progress: 0,
    iconName: 'AlertTriangle',
    description: 'Evaluates public risk index, accessibility impact, proximity to schools or hospitals, and auto-assigns official municipal response priority.',
    logs: []
  },
  {
    id: 'resolution',
    name: 'Resolution Agent',
    role: 'Mitigation Plan & Dispatch Router',
    status: 'idle',
    progress: 0,
    iconName: 'Wrench',
    description: 'Synthesizes specialized step-by-step mitigation guides, details required crew skillsets, estimates material costs, and selects dispatch teams.',
    logs: []
  },
  {
    id: 'deployment',
    name: 'Deployment Agent',
    role: 'Municipal Integration API Writer',
    status: 'idle',
    progress: 0,
    iconName: 'Server',
    description: 'Compiles a fully standardized, government-ready PDF case file, injects API payloads to Open311 / Cityworks, and logs audit hash.',
    logs: []
  }
];

export const AGENT_STEP_LOGS: Record<string, string[]> = {
  vision: [
    'Initializing advanced CV parsing pipeline...',
    'Analyzing uploaded high-resolution imagery assets...',
    'Detected: Active pipeline hazard, fluid surface reflection, asphalt shear fractures.',
    'Calculating damage area: Estimated 45 sq ft of compromised structural surface.',
    'Hazard signature classified: High-volume water discharge, potential underground sinkhole warning.',
    'Feature vector finalized and logged.'
  ],
  geo: [
    'Accessing Global Positioning Service metadata...',
    'Performing reverse-geocoding lookup: SF Water & Utilities Sector 4.',
    'Cross-referencing municipal asset maps: Match found on 12" high-pressure main line (#WM-4592).',
    'Identifying nearest isolation valves: Valve #V-112 located 140 meters north.',
    'Determining jurisdictional authority: SF Public Works, Water Division, Crew B Area.',
    'GIS coordinate alignment completed and saved.'
  ],
  verification: [
    'Querying active 311 and GIS incident database for active duplicates...',
    'De-duplication results: 0 matching active tickets within 500-meter radius.',
    'Analyzing media integrity (verifying capture time and EXIF metadata consistency)...',
    'Correlating local sensor telemetry: Flow-rate sensor #F-09 showing pressure drop of 24%.',
    'Report credibility verified: High-confidence signal established (98.6%).',
    'Incident entry lock released.'
  ],
  priority: [
    'Evaluating municipal priority matrix equations...',
    'Critical check: Proximity to vulnerable points of interest...',
    'POIs flagged: Central Clinic within 250 meters. ADA access path compromised.',
    'Analyzing safety risk vectors: Active sub-grade erosion detected (Severity: Critical).',
    'Calculating priority score: Safety Score (9.8/10), Infrastructure Impact (9.2/10).',
    'Priority assigned: CRITICAL (Immediate emergency dispatch warranted).'
  ],
  resolution: [
    'Formulating tactical emergency resolution plan...',
    'Identifying necessary mitigation supplies: 12" sleeve coupler, standard shoring rig, structural asphalt fill.',
    'Recommending specialized labor role designations: Class A Utility Pipefitter, Heavy Machine Operator.',
    'Compiling standard regulatory safety directives for active sinkhole zones.',
    'Routing to dispatch schedule: Pre-selected Water Main Emergency Response Team 4.',
    'Resolution roadmap completed.'
  ],
  deployment: [
    'Formatting JSON incident payload for municipal API gateway...',
    'Generating cryptographically signed audit hash: sha256_b372f910a300ff...',
    'Assembling executive case file PDF layout with visual evidence attachments...',
    'Pushing data package to city Open311 endpoint... Response: [201 Created] Ticket ID TX-ELM-901.',
    'Notifying public emergency channels and closing active pipeline.',
    'AI agent mission completed. Case record locked.'
  ]
};
