import React, { useState, useRef, useEffect } from 'react';
import { 
  Upload, 
  Mic, 
  MicOff,
  Sparkles, 
  MapPin, 
  ImageIcon, 
  AlertOctagon,
  CornerDownRight,
  Info,
  Trash2,
  CheckCircle2,
  Cpu,
  RefreshCw
} from 'lucide-react';
import { IssueReport, View } from '../types';
import { DemoCase } from '../data/demoCases';
import SafeImage from '../components/SafeImage';

interface ReportIssueViewProps {
  reports?: IssueReport[];
  onAddReport: (report: IssueReport) => void;
  onJoinReport?: (reportId: string) => void;
  onSelectReport?: (report: IssueReport) => void;
  onViewChange: (view: View) => void;
  prefilledDemo: DemoCase | null;
  onClearPrefilledDemo: () => void;
  language?: 'en' | 'hi';
}

// Preset evidence packages for easy testing
const EVIDENCE_PRESETS = [
  {
    name: 'Ruptured Pipe',
    category: 'Water & Utilities',
    description: 'A major underground pipe is fractured, throwing clean water 5 feet in the air. Water is accumulating, causing soil collapse near the pedestrian pathway.',
    imageUrl: 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=600&auto=format&fit=crop',
    address: '1420 Elm Street, Sector 4',
    severity: 'critical' as const
  },
  {
    name: 'Toxic Dumping',
    category: 'Environmental Hazard',
    description: 'Rusted steel barrels filled with black, highly toxic fluid dumped in the middle of Oakwood trailhead. Marked with skull symbol.',
    imageUrl: 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=600&auto=format&fit=crop',
    address: 'Oakwood Nature Reserve Trailhead',
    severity: 'high' as const
  },
  {
    name: 'Highway Spall',
    category: 'Infrastructure',
    description: 'Concrete chunks falling from the overpass undersupport. Exposed rebar is heavily corroded, causing traffic hazards below.',
    imageUrl: 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600&auto=format&fit=crop',
    address: 'Central Highway Overpass, Mile 14',
    severity: 'high' as const
  }
];

export default function ReportIssueView({ 
  reports = [],
  onAddReport, 
  onJoinReport,
  onSelectReport,
  onViewChange,
  prefilledDemo,
  onClearPrefilledDemo,
  language = 'en'
}: ReportIssueViewProps) {
  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Infrastructure');
  const [description, setDescription] = useState('');
  const [address, setAddress] = useState('1109 Broadway Avenue, Sector 2');
  const [severity, setSeverity] = useState<'low' | 'medium' | 'high' | 'critical'>('high');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  // Speech Recognition state
  const [isListeningSpeech, setIsListeningSpeech] = useState(false);

  const startSpeechRecognition = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser. Please use Chrome, Safari, or Edge.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    recognition.interimResults = false;

    recognition.onstart = () => {
      setIsListeningSpeech(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      if (transcript) {
        setDescription(prev => prev ? `${prev} ${transcript}` : transcript);
        
        // Smart language detection: check if Hindi spoken
        const hasHindi = /[\u0900-\u097F]/.test(transcript);
        if (hasHindi) {
          console.log("Spoken Hindi input detected! ", transcript);
        }
      }
    };

    recognition.onerror = (event: any) => {
      console.error("Speech recognition error:", event.error);
      setIsListeningSpeech(false);
    };

    recognition.onend = () => {
      setIsListeningSpeech(false);
    };

    recognition.start();
  };
  
  // Audio state
  const [isRecording, setIsRecording] = useState(false);
  const [recordedDuration, setRecordedDuration] = useState<number | null>(null);
  const [recordingInterval, setRecordingInterval] = useState<NodeJS.Timeout | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const [recordedAudioUrl, setRecordedAudioUrl] = useState<string | null>(null);

  // Drag and drop state
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Demo auto-deploy state
  const [isAutoDeploying, setIsAutoDeploying] = useState(false);

  // Duplicate detection state
  const [isCheckingDuplicates, setIsCheckingDuplicates] = useState(false);
  const [duplicateMatch, setDuplicateMatch] = useState<any>(null);
  const [showDuplicateModal, setShowDuplicateModal] = useState(false);

  // Helper function to submit report
  const submitReport = (
    finalTitle: string,
    finalCategory: string,
    finalDescription: string,
    finalAddress: string,
    finalSeverity: 'low' | 'medium' | 'high' | 'critical',
    finalImage: string | null,
    isDemoReport: boolean = false
  ) => {
    const categoryImages: Record<string, string> = {
      'Water & Utilities': 'https://images.unsplash.com/photo-1515162305285-0293e4767cc2?q=80&w=600&auto=format&fit=crop',
      'Environmental Hazard': 'https://images.unsplash.com/photo-1530587191325-3db32d826c18?q=80&w=600&auto=format&fit=crop',
      'Traffic & Transit': 'https://images.unsplash.com/photo-1494526508112-9c3f0bbfbf1f?q=80&w=600&auto=format&fit=crop',
      'Accessibility & Parking': 'https://images.unsplash.com/photo-1578328819058-b69f3a3b0f6b?q=80&w=600&auto=format&fit=crop',
      'Infrastructure': 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600&auto=format&fit=crop',
      'Health & Safety': 'https://images.unsplash.com/photo-1509024644558-2f56ce76c090?q=80&w=600&auto=format&fit=crop'
    };
    const resolvedImage = finalImage || categoryImages[finalCategory] || 'https://images.unsplash.com/photo-1541888946425-d81bb19240f5?q=80&w=600&auto=format&fit=crop';

    const newReport: IssueReport = {
      id: `CP-${Math.floor(1000 + Math.random() * 9000)}`,
      title: finalTitle,
      category: finalCategory,
      description: finalDescription,
      imageUrl: resolvedImage,
      voiceDuration: recordedDuration || undefined,
      voiceUrl: recordedAudioUrl || undefined,
      isDemo: isDemoReport,
      location: {
        lat: 37.7749 + (Math.random() - 0.5) * 0.05,
        lng: -122.4194 + (Math.random() - 0.5) * 0.05,
        address: finalAddress
      },
      createdAt: new Date().toISOString(),
      severity: finalSeverity,
      status: 'analyzing', // Marks it as processing so Mission Control starts working
      communityVerification: {
        verifications: 1,
        inaccurateCount: 0,
        comments: [],
        timeline: [
          {
            id: `evt-${Math.random().toString(36).substr(2, 9)}`,
            citizenName: 'Reporter (You)',
            type: 'verify',
            comment: 'Citizen submitted report with system hash metadata confirmation.',
            timestamp: new Date().toISOString()
          }
        ]
      }
    };

    onAddReport(newReport);
    onViewChange('mission-control');
  };

  // Handle Demo Mode auto-population and auto-deployment
  useEffect(() => {
    if (prefilledDemo) {
      // 1. Instantly populate form states
      setTitle(prefilledDemo.title);
      setCategory(prefilledDemo.category);
      setDescription(prefilledDemo.description);
      setAddress(prefilledDemo.address);
      setSeverity(prefilledDemo.severity);
      setSelectedImage(prefilledDemo.imageUrl);
      
      // 2. Set auto deploying visual state
      setIsAutoDeploying(true);

      // 3. Trigger auto-deploy after 1.2s so they see the inputs populating visually
      const timer = setTimeout(() => {
        submitReport(
          prefilledDemo.title,
          prefilledDemo.category,
          prefilledDemo.description,
          prefilledDemo.address,
          prefilledDemo.severity,
          prefilledDemo.imageUrl,
          true // Mark as Demo Case report
        );
        onClearPrefilledDemo();
        setIsAutoDeploying(false);
      }, 1200);

      return () => clearTimeout(timer);
    }
  }, [prefilledDemo]);

  // Handle preset application
  const applyPreset = (preset: typeof EVIDENCE_PRESETS[0]) => {
    setTitle(`Potential ${preset.name} Emergency`);
    setCategory(preset.category);
    setDescription(preset.description);
    setAddress(preset.address);
    setSeverity(preset.severity);
    setSelectedImage(preset.imageUrl);
  };

  // Drag and Drop triggers
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setSelectedImage(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = (uploadEvent) => {
        if (uploadEvent.target?.result) {
          setSelectedImage(uploadEvent.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Recording Simulation and Real Audio Capture
  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      if (recordingInterval) clearInterval(recordingInterval);
      setRecordingInterval(null);
      setIsRecording(false);
      
      if (mediaRecorderRef.current && mediaRecorderRef.current.state !== 'inactive') {
        mediaRecorderRef.current.stop();
      }
    } else {
      // Start recording
      setRecordedAudioUrl(null);
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        audioChunksRef.current = [];

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
          const audioUrl = URL.createObjectURL(audioBlob);
          setRecordedAudioUrl(audioUrl);
          
          // Stop all audio tracks to release microphone
          stream.getTracks().forEach(track => track.stop());
        };

        mediaRecorder.start();
        setIsRecording(true);
        setRecordedDuration(0);
        
        const interval = setInterval(() => {
          setRecordedDuration(prev => (prev !== null ? prev + 1 : 1));
        }, 1000);
        setRecordingInterval(interval);
      } catch (err) {
        console.warn('Microphone access denied or error occurred, falling back to simulated recording:', err);
        // Fallback simulation
        setIsRecording(true);
        setRecordedDuration(0);
        const interval = setInterval(() => {
          setRecordedDuration(prev => (prev !== null ? prev + 1 : 1));
        }, 1000);
        setRecordingInterval(interval);
      }
    }
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (recordingInterval) clearInterval(recordingInterval);
    };
  }, [recordingInterval]);

  // Format Duration helper
  const formatDuration = (sec: number | null) => {
    if (sec === null) return '00:00';
    const m = Math.floor(sec / 60).toString().padStart(2, '0');
    const s = (sec % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedImage(null);
  };

  const parseBoldText = (str: string) => {
    const parts = str.split('**');
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return <strong key={i} className="font-semibold text-slate-900 dark:text-white">{part}</strong>;
      }
      return part;
    });
  };

  const renderExplanation = (text: string) => {
    if (!text) return null;
    
    const lines = text.split('\n');
    return (
      <div className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
        {lines.map((line, idx) => {
          const trimmed = line.trim();
          if (!trimmed) return null;
          
          // Render bullet points
          if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
            const content = trimmed.substring(1).trim();
            return (
              <div key={idx} className="flex items-start gap-2 pl-2">
                <span className="text-indigo-500 dark:text-indigo-400 mt-1 shrink-0">•</span>
                <span>{parseBoldText(content)}</span>
              </div>
            );
          }
          
          return <p key={idx}>{parseBoldText(trimmed)}</p>;
        })}
      </div>
    );
  };

  // Submit report to state and launch agent with AI duplicate checking
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description) return;

    setIsCheckingDuplicates(true);
    try {
      // Build the new report payload
      const newReportPayload = {
        title,
        category,
        description,
        imageUrl: selectedImage,
        location: {
          lat: 37.7749 + (Math.random() - 0.5) * 0.05,
          lng: -122.4194 + (Math.random() - 0.5) * 0.05,
          address: address
        }
      };

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

      // Call the detect duplicates API
      const response = await fetch('/api/detect-duplicates', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          newReport: newReportPayload,
          existingReports: lightweightReports
        })
      });

      if (!response.ok) {
        throw new Error('Failed to run duplicate detection');
      }

      const result = await response.json();
      if (result.isDuplicate) {
        setDuplicateMatch(result);
        setShowDuplicateModal(true);
      } else {
        submitReport(title, category, description, address, severity, selectedImage, false);
      }
    } catch (err) {
      console.error('Error during duplicate check:', err);
      submitReport(title, category, description, address, severity, selectedImage, false);
    } finally {
      setIsCheckingDuplicates(false);
    }
  };

  return (
    <div id="report-view" className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-12 relative">
      {/* Auto-Deploy Overlay Screen */}
      {isAutoDeploying && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/80 backdrop-blur-md animate-fadeIn">
          <div className="p-8 rounded-3xl border border-indigo-200 dark:border-indigo-500/30 bg-white dark:bg-slate-900/95 max-w-md w-full mx-4 shadow-2xl text-center relative overflow-hidden transition-colors duration-300">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-indigo-500/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="w-16 h-16 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-150 dark:border-indigo-500/30 text-indigo-600 dark:text-indigo-400 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <Cpu className="w-8 h-8 animate-spin animate-spin-slow" style={{ animationDuration: '3s' }} />
              <Sparkles className="w-4 h-4 text-violet-500 dark:text-violet-400 absolute top-2 right-2 animate-bounce" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 tracking-tight font-display">
              Demo Auto-Pilot Deploying
            </h3>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed mb-6">
              Automatically populating visual evidence, incident description, and geographic GIS markers. Booting AI agents...
            </p>

            <div className="space-y-3 max-w-xs mx-auto text-left font-mono text-[10px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">✓</span>
                <span>POPULATING EVIDENCE METADATA</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-indigo-600 dark:text-indigo-400 animate-pulse font-bold">●</span>
                <span>INITIALIZING ORCHESTRATION PIPELINE</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI Duplicate Detection Checking Overlay */}
      {isCheckingDuplicates && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 backdrop-blur-md animate-fadeIn">
          <div className="p-8 rounded-3xl border border-violet-200 dark:border-violet-500/30 bg-white dark:bg-slate-900/95 max-w-md w-full mx-4 shadow-2xl text-center relative overflow-hidden transition-colors duration-300">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-violet-500/10 rounded-full blur-2xl pointer-events-none"></div>
            
            <div className="w-16 h-16 bg-violet-50 dark:bg-violet-500/10 border border-violet-150 dark:border-violet-500/30 text-violet-600 dark:text-violet-400 rounded-full flex items-center justify-center mx-auto mb-6 relative">
              <RefreshCw className="w-8 h-8 animate-spin" />
              <Sparkles className="w-4 h-4 text-pink-500 dark:text-pink-400 absolute top-2 right-2 animate-bounce" />
            </div>

            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-2 tracking-tight font-display">
              Scanning City Database
            </h3>
            
            <p className="text-xs text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed mb-6">
              AI Agents are scanning location coordinates, description semantic clusters, and image pixels for duplicate incidents...
            </p>

            <div className="space-y-3 max-w-xs mx-auto text-left font-mono text-[10px] text-slate-600 dark:text-slate-400 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-xl border border-slate-200 dark:border-slate-800 transition-colors">
              <div className="flex items-center gap-2">
                <span className="text-indigo-600 dark:text-indigo-400 animate-pulse font-bold">●</span>
                <span>COMPARING SPATIAL GEOMETRY</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-indigo-600 dark:text-indigo-400 animate-pulse font-bold">●</span>
                <span>EVALUATING PIXEL CORRELATION</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* AI-Powered Duplicate Found Dialog */}
      {showDuplicateModal && duplicateMatch && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-950/85 backdrop-blur-md p-4 animate-fadeIn overflow-y-auto">
          <div className="p-6 md:p-8 rounded-3xl border border-amber-200 dark:border-amber-500/30 bg-white dark:bg-slate-900 max-w-2xl w-full mx-auto shadow-2xl relative overflow-hidden transition-colors duration-300 my-8">
            <div className="absolute -top-10 -right-10 w-40 h-40 bg-amber-500/10 rounded-full blur-2xl pointer-events-none"></div>
            
            {/* Header with high contrast */}
            <div className="flex items-start gap-4 mb-6">
              <div className="w-12 h-12 bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/30 text-amber-600 dark:text-amber-400 rounded-2xl flex items-center justify-center shrink-0">
                <AlertOctagon className="w-6 h-6 animate-pulse" />
              </div>
              <div className="space-y-1">
                <span className="text-[10px] uppercase tracking-wider font-semibold text-amber-600 dark:text-amber-400">
                  AI duplicate agent scanner
                </span>
                <h3 className="text-xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-snug">
                  This issue appears similar to an existing report.
                </h3>
              </div>
            </div>

            {/* Metrics Ribbon */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6 bg-slate-50 dark:bg-slate-950/60 p-4 rounded-2xl border border-slate-150 dark:border-slate-800">
              <div className="text-center sm:border-r border-slate-200 dark:border-slate-850 p-1">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Similarity</p>
                <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400 font-mono">
                  {duplicateMatch.similarityScore}% Match
                </span>
              </div>
              <div className="text-center sm:border-r border-slate-200 dark:border-slate-850 p-1">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Existing Ticket</p>
                <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 font-mono">
                  #{duplicateMatch.existingTicketId}
                </span>
              </div>
              <div className="text-center sm:border-r border-slate-200 dark:border-slate-850 p-1">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Distance</p>
                <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 font-mono">
                  {duplicateMatch.distanceStr} away
                </span>
              </div>
              <div className="text-center p-1">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wider mb-0.5">Report Age</p>
                <span className="text-sm font-extrabold text-slate-800 dark:text-slate-200 font-mono">
                  {duplicateMatch.ageStr}
                </span>
              </div>
            </div>

            {/* Structured Explanation */}
            <div className="space-y-3 mb-8">
              <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                AI Correlation Reasoning
              </h4>
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-850 text-sm leading-relaxed text-slate-700 dark:text-slate-300">
                {renderExplanation(duplicateMatch.explanation)}
              </div>
            </div>

            {/* Interactive User Choices */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                id="btn-join-duplicate"
                onClick={() => {
                  if (onJoinReport && duplicateMatch.matchedReport) {
                    onJoinReport(duplicateMatch.matchedReport.id);
                  }
                  if (onSelectReport && duplicateMatch.matchedReport) {
                    onSelectReport(duplicateMatch.matchedReport);
                  }
                  onViewChange('generated-case');
                  setShowDuplicateModal(false);
                }}
                className="flex-1 px-5 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs rounded-xl shadow-lg shadow-indigo-600/10 hover:shadow-indigo-600/25 transition-all text-center flex flex-col items-center justify-center gap-0.5"
              >
                <span className="font-bold">Join Existing Report</span>
                <span className="text-[9px] text-indigo-200 font-normal">Earn Civic Points & Boost AI confidence</span>
              </button>

              <button
                type="button"
                id="btn-view-duplicate"
                onClick={() => {
                  if (onSelectReport && duplicateMatch.matchedReport) {
                    onSelectReport(duplicateMatch.matchedReport);
                  }
                  onViewChange('generated-case');
                  setShowDuplicateModal(false);
                }}
                className="px-5 py-3.5 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-semibold text-xs rounded-xl transition-colors text-center flex flex-col items-center justify-center gap-0.5"
              >
                <span className="font-bold">View Existing Issue</span>
                <span className="text-[9px] text-slate-400 font-normal font-sans">Inspect original details</span>
              </button>

              <button
                type="button"
                id="btn-continue-new"
                onClick={() => {
                  submitReport(title, category, description, address, severity, selectedImage, false);
                  setShowDuplicateModal(false);
                }}
                className="px-5 py-3.5 border border-slate-200 hover:bg-slate-50 dark:border-slate-800 dark:hover:bg-slate-850 text-slate-500 dark:text-slate-400 font-medium text-xs rounded-xl transition-colors text-center flex flex-col items-center justify-center gap-0.5"
              >
                <span className="font-semibold">Continue as New Report</span>
                <span className="text-[9px] text-slate-400 font-normal font-sans">Submit anyway</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Primary Report Form Container */}
      <div className="lg:col-span-2 space-y-6">
        <div className="p-6 md:p-8 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 relative overflow-hidden shadow-sm transition-colors duration-300">
          {/* Subtle decoration line */}
          <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500"></div>

          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display mb-6 flex items-center gap-2">
            <AlertOctagon className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
            Incident Context Data
          </h3>

          <form onSubmit={handleFormSubmit} className="space-y-6">
            {/* Title */}
            <div>
              <label htmlFor="report-title" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 font-mono">
                Incident Title
              </label>
              <input
                id="report-title"
                type="text"
                required
                placeholder="e.g. Broken Water Main on Central Blvd"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all"
              />
            </div>

            {/* Category and Severity Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div>
                <label htmlFor="report-category" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 font-mono">
                  Operational Category
                </label>
                <select
                  id="report-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 rounded-xl text-sm text-slate-700 dark:text-slate-300 outline-none transition-all cursor-pointer"
                >
                  <option>Water & Utilities</option>
                  <option>Environmental Hazard</option>
                  <option>Traffic & Transit</option>
                  <option>Infrastructure</option>
                  <option>Accessibility & Parking</option>
                  <option>Health & Safety</option>
                  <option>Other</option>
                </select>
              </div>

              <div>
                <label htmlFor="report-severity" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 font-mono">
                  Initial Urgency Tag
                </label>
                <div className="flex gap-2">
                  {(['low', 'medium', 'high', 'critical'] as const).map((level) => (
                    <button
                      type="button"
                      key={level}
                      id={`severity-btn-${level}`}
                      onClick={() => setSeverity(level)}
                      className={`flex-1 py-3 px-2 text-xs font-semibold rounded-xl capitalize border transition-all cursor-pointer ${
                        severity === level
                          ? level === 'critical'
                            ? 'bg-red-50 dark:bg-red-500/15 border-red-300 dark:border-red-500 text-red-700 dark:text-red-400 font-bold'
                            : level === 'high'
                            ? 'bg-amber-50 dark:bg-amber-500/15 border-amber-300 dark:border-amber-500 text-amber-700 dark:text-amber-400 font-bold'
                            : level === 'medium'
                            ? 'bg-indigo-50 dark:bg-indigo-500/15 border-indigo-300 dark:border-indigo-500 text-indigo-700 dark:text-indigo-400 font-bold'
                            : 'bg-slate-100 dark:bg-slate-500/15 border-slate-300 dark:border-slate-400 text-slate-700 dark:text-slate-300 font-bold'
                          : 'bg-slate-50/50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      {level}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Description Textbox */}
            <div>
              <div className="flex justify-between items-center mb-2">
                <label htmlFor="report-desc" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider font-mono">
                  {language === 'hi' ? 'घटना का विवरण और क्षति लॉग' : 'Multimodal Description & Damage Logs'}
                </label>
                <button
                  type="button"
                  id="btn-voice-input"
                  onClick={startSpeechRecognition}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isListeningSpeech
                      ? 'bg-red-500/10 text-red-500 border border-red-500/20 animate-pulse'
                      : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 hover:bg-indigo-500/20 border border-indigo-500/10'
                  }`}
                  title={language === 'hi' ? 'बोलकर टाइप करें' : 'Speak instead of typing'}
                >
                  {isListeningSpeech ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  <span>{isListeningSpeech ? (language === 'hi' ? 'सुन रहा हूँ...' : 'Listening...') : (language === 'hi' ? 'बोलें (Speak)' : 'Speak')}</span>
                </button>
              </div>
              <textarea
                id="report-desc"
                required
                rows={5}
                placeholder={language === 'hi' ? "आप जो देखते हैं उसका वर्णन करें। सक्रिय खतरों, सुरक्षा निहितार्थों, पानी के स्तर आदि का विवरण दें..." : "Describe what you see. Detail active hazards, safety implications, water levels, structural degradation indicators..."}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl text-sm text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 outline-none transition-all resize-none leading-relaxed"
              ></textarea>
            </div>

            {/* Location GPS text */}
            <div>
              <label htmlFor="report-location" className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 font-mono">
                Simulated Geocode Node Address
              </label>
              <div className="relative">
                <MapPin className="absolute left-4 top-3.5 w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                <input
                  id="report-location"
                  type="text"
                  placeholder="Street Address or Landmark coordinates"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 focus:border-indigo-500 focus:bg-white dark:focus:bg-slate-900 rounded-xl text-sm text-slate-800 dark:text-slate-200 outline-none transition-all"
                />
              </div>
            </div>

            {/* Drag & Drop File Upload */}
            <div>
              <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 font-mono">
                High-Resolution Evidence Capture
              </label>
              
              <div
                id="image-drop-zone"
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all ${
                  isDragging 
                    ? 'border-indigo-500 bg-indigo-500/5' 
                    : selectedImage 
                    ? 'border-indigo-500/50 bg-slate-50 dark:bg-slate-900/20' 
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700 bg-slate-50/20 dark:bg-slate-900/10'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                {selectedImage ? (
                  <div className="space-y-4">
                    <SafeImage 
                      src={selectedImage} 
                      alt="Uploaded civic evidence" 
                      category={category}
                      className="max-h-52 mx-auto rounded-lg object-cover border border-slate-200 dark:border-slate-800"
                    />
                    <div className="flex items-center justify-center gap-3">
                      <span className="text-xs text-emerald-600 dark:text-emerald-400 font-medium flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Evidence Linked
                      </span>
                      <button
                        type="button"
                        id="btn-clear-image"
                        onClick={clearImage}
                        className="text-xs text-red-600 dark:text-red-400 hover:text-red-500 flex items-center gap-1 bg-red-50 dark:bg-red-500/10 px-2 py-1 rounded-md border border-red-200 dark:border-red-500/20 cursor-pointer"
                      >
                        <Trash2 className="w-3 h-3" /> Clear
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center space-y-2 py-4">
                    <div className="p-3 bg-slate-50 dark:bg-slate-900 rounded-xl text-indigo-600 dark:text-indigo-400 border border-slate-200 dark:border-slate-800 transition-colors">
                      <Upload className="w-5 h-5" />
                    </div>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">
                      Drag & Drop image here, or <span className="text-indigo-600 dark:text-indigo-400 hover:underline">browse files</span>
                    </p>
                    <p className="text-[11px] text-slate-500">
                      Supports JPG, PNG, WEBP (Recommended: raw photo of asset damage)
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Submit & Deploy Buttons */}
            <div className="pt-4">
              <button
                type="submit"
                id="btn-deploy-orchestrator"
                disabled={!title || !description}
                className={`w-full flex items-center justify-center gap-2.5 py-4 px-6 rounded-xl font-bold tracking-wide text-white transition-all duration-300 ${
                  title && description
                    ? 'bg-gradient-to-r from-indigo-600 via-indigo-500 to-violet-600 hover:from-indigo-500 hover:to-violet-500 shadow-lg shadow-indigo-600/20 cursor-pointer active:scale-99'
                    : 'bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed'
                }`}
              >
                <Sparkles className="w-5 h-5 animate-pulse" />
                <span>Deploy AI Agent Orchestrator</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      {/* Right Sidebar: Audio Capture & Evidence Presets */}
      <div className="space-y-6">
        {/* Voice Recorder Block */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 relative overflow-hidden shadow-sm transition-colors duration-300">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
            <Mic className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Multimodal Voice Transcript
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed mb-6">
            Record vocal context report live on scene. CivicPilot transforms audio into validated telemetry records for cross-corroboration.
          </p>

          <div className="bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800/80 rounded-2xl p-5 flex flex-col items-center justify-center text-center transition-colors">
            {isRecording ? (
              <div className="space-y-4 w-full">
                {/* Simulated equalizer wave bars */}
                <div className="flex items-center justify-center gap-1 h-8">
                  {[1, 2, 3, 4, 5, 6, 7, 6, 5, 4, 3, 2, 1].map((bar, idx) => (
                    <span 
                      key={idx}
                      className="w-1.5 bg-red-500 rounded-full animate-bounce" 
                      style={{ 
                        height: `${Math.max(20, Math.random() * 100)}%`,
                        animationDelay: `${idx * 0.08}s`
                      }}
                    />
                  ))}
                </div>
                <div className="text-center">
                  <p className="text-sm font-mono font-bold text-red-500">{formatDuration(recordedDuration)}</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1 uppercase tracking-widest animate-pulse">STREAMING TELEMETRY</p>
                </div>

                <button
                  type="button"
                  id="btn-stop-recording"
                  onClick={toggleRecording}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-red-600 dark:text-red-400 bg-red-50 dark:bg-red-500/10 hover:bg-red-100 dark:hover:bg-red-500/20 border border-red-200 dark:border-red-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <MicOff className="w-3.5 h-3.5" />
                  Stop Recording
                </button>
              </div>
            ) : (
              <div className="space-y-4 w-full">
                <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-950 flex items-center justify-center text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-800">
                  <Mic className="w-5 h-5" />
                </div>
                
                <div>
                  <p className="text-xs text-slate-800 dark:text-slate-300 font-semibold font-sans">Voice Capture Ready</p>
                  <p className="text-[10px] text-slate-400 dark:text-slate-500 mt-1">No audio linked to report</p>
                </div>

                <button
                  type="button"
                  id="btn-start-recording"
                  onClick={toggleRecording}
                  className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-xs font-semibold text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 hover:bg-indigo-100 dark:hover:bg-indigo-500/20 border border-indigo-200 dark:border-indigo-500/20 active:scale-95 transition-all cursor-pointer"
                >
                  <Mic className="w-3.5 h-3.5" />
                  Link Voice Context
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Evidence Presets Block */}
        <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 shadow-sm transition-colors duration-300">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
            Quick Incident Presets
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-500 mb-4 leading-relaxed">
            Instantly load structured data blueprints to explore different multi-agent pipeline results.
          </p>

          <div className="space-y-3">
            {EVIDENCE_PRESETS.map((preset) => (
              <button
                type="button"
                key={preset.name}
                id={`preset-${preset.name.toLowerCase().replace(/\s+/g, '-')}`}
                onClick={() => applyPreset(preset)}
                className="w-full text-left p-3.5 rounded-xl bg-slate-50/50 dark:bg-slate-900/40 hover:bg-slate-100 dark:hover:bg-slate-900/80 border border-slate-200 dark:border-slate-800 hover:border-indigo-500/40 transition-all duration-300 group flex items-start justify-between cursor-pointer"
              >
                <div>
                  <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors flex items-center gap-1.5">
                    <CornerDownRight className="w-3 h-3 text-indigo-600 dark:text-indigo-400" />
                    {preset.name}
                  </p>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">{preset.description}</p>
                </div>
                <span className={`text-[9px] font-semibold tracking-wider font-mono uppercase px-1.5 py-0.5 rounded border ml-2 ${
                  preset.severity === 'critical'
                    ? 'bg-red-50 dark:bg-red-500/10 text-red-700 dark:text-red-400 border-red-150 dark:border-red-500/10'
                    : 'bg-amber-50 dark:bg-amber-500/10 text-amber-700 dark:text-amber-400 border-amber-150 dark:border-amber-500/10'
                }`}>
                  {preset.severity}
                </span>
              </button>
            ))}
          </div>

          <div className="mt-5 p-3.5 bg-slate-50 dark:bg-slate-900/30 border border-slate-200 dark:border-slate-800/80 rounded-xl text-[11px] text-slate-500 dark:text-slate-400 flex gap-2.5 items-start transition-colors">
            <Info className="w-4 h-4 text-indigo-600 dark:text-indigo-400 shrink-0 mt-0.5" />
            <p className="leading-relaxed">
              When you deploy the AI Orchestrator, you will be taken to Mission Control to monitor the specialized cognitive agents as they process the incident in real-time.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
