import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  X, 
  ChevronRight, 
  ChevronLeft, 
  Sparkles, 
  Play, 
  Award,
  CheckCircle2,
  HelpCircle,
  AlertTriangle
} from 'lucide-react';
import { View } from '../types';
import { Language } from '../utils/i18n';

interface OnboardingTourProps {
  language: Language;
  currentView: View;
  onViewChange: (view: View) => void;
  onOpenReportDemo?: () => void;
  isOpen: boolean;
  onClose: () => void;
}

interface TourStep {
  titleEn: string;
  titleHi: string;
  descEn: string;
  descHi: string;
}

export default function OnboardingTour({
  language,
  currentView,
  onViewChange,
  isOpen,
  onClose
}: OnboardingTourProps) {
  const [step, setStep] = useState<number>(0); // 0 = Welcome Modal, 1-9 = Tour Steps, 10 = Finish Modal
  const [rect, setRect] = useState<DOMRect | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number; position: 'top' | 'bottom' | 'left' | 'right' | 'center' }>({ top: 0, left: 0, position: 'center' });
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const steps: TourStep[] = [
    {
      titleEn: "👋 Welcome to CivicPilot",
      titleHi: "👋 सिविकपायलट में आपका स्वागत है",
      descEn: "AI-powered civic intelligence that doesn't just report problems—it helps solve them.",
      descHi: "एआई-संचालित नागरिक खुफिया जानकारी जो केवल समस्याओं की रिपोर्ट नहीं करती—उन्हें हल करने में मदद करती है।"
    },
    {
      titleEn: "Dashboard",
      titleHi: "डैशबोर्ड",
      descEn: "This is your central workspace where you can monitor civic activity, recent reports and city-wide insights.",
      descHi: "यह आपका केंद्रीय कार्यक्षेत्र है जहां आप नागरिक गतिविधियों, हालिया रिपोर्टों और शहर-व्यापी जानकारियों की निगरानी कर सकते हैं।"
    },
    {
      titleEn: "Report Issue",
      titleHi: "समस्या की रिपोर्ट करें",
      descEn: "Report civic issues using an image, voice recording or simple text.",
      descHi: "छवि (इमेज), आवाज रिकॉर्डिंग या सरल पाठ (टेक्स्ट) का उपयोग करके नागरिक मुद्दों की रिपोर्ट करें।"
    },
    {
      titleEn: "Mission Control",
      titleHi: "मिशन कंट्रोल",
      descEn: "This is the AI brain of CivicPilot. Six specialized AI agents collaborate transparently to understand, verify and prioritize every issue.",
      descHi: "यह सिविकपायलट का एआई मस्तिष्क है। छह विशेष एआई एजेंट हर मुद्दे को समझने, सत्यापित करने और प्राथमिकता देने के लिए पारदर्शी रूप से सहयोग करते हैं।"
    },
    {
      titleEn: "Community Verification",
      titleHi: "सामुदायिक सत्यापन",
      descEn: "Citizens help verify reported issues, improving trust while reducing false or duplicate reports.",
      descHi: "नागरिक रिपोर्ट किए गए मुद्दों को सत्यापित करने में मदद करते हैं, जिससे झूठी या डुप्लिकेट रिपोर्ट कम होती हैं और विश्वास बढ़ता है।"
    },
    {
      titleEn: "Municipal Command Center",
      titleHi: "नगरपालिका कमांड सेंटर",
      descEn: "Authorities receive AI-prioritized issues, department recommendations and resource planning tools.",
      descHi: "अधिकारियों को एआई-प्राथमिकता वाले मुद्दे, विभाग की सिफारिशें और संसाधन योजना उपकरण प्राप्त होते हैं।"
    },
    {
      titleEn: "Predictive Insights",
      titleHi: "पूर्वानुमानित जानकारी",
      descEn: "AI identifies recurring problems and predicts future civic hotspots.",
      descHi: "एआई आवर्ती (बार-बार होने वाली) समस्याओं की पहचान करता है और भविष्य के नागरिक हॉटस्पॉट की भविष्यवाणी करता है।"
    },
    {
      titleEn: "Impact Dashboard",
      titleHi: "प्रभाव डैशबोर्ड",
      descEn: "Track city-wide metrics, resolution performance and community participation.",
      descHi: "शहर-व्यापी मीट्रिक्स, समाधान प्रदर्शन और सामुदायिक भागीदारी को ट्रैक करें।"
    },
    {
      titleEn: "Accessibility",
      titleHi: "पहुंच (एक्सेसिबिलिटी)",
      descEn: "CivicPilot supports multiple accessibility options including voice interaction, multilingual support and theme switching.",
      descHi: "सिविकपायलट आवाज इंटरैक्शन, बहुभाषी समर्थन और थीम स्विचिंग सहित कई पहुंच विकल्पों का समर्थन करता है।"
    },
    {
      titleEn: "Profile & Civic Points",
      titleHi: "प्रोफ़ाइल और नागरिक अंक",
      descEn: "Earn points, badges and achievements by actively contributing to your community.",
      descHi: "अपने समुदाय में सक्रिय रूप से योगदान देकर अंक, बैज और उपलब्धियां अर्जित करें।"
    },
    {
      titleEn: "🎉 You're ready!",
      titleHi: "🎉 आप तैयार हैं!",
      descEn: "Explore CivicPilot and experience AI-powered civic intelligence.",
      descHi: "सिविकपायलट का अन्वेषण करें और एआई-संचालित नागरिक खुफिया जानकारी का अनुभव करें।"
    }
  ];

  const stepToViewMap: Record<number, View> = {
    1: 'dashboard',
    2: 'report',
    3: 'mission-control',
    4: 'generated-case',
    5: 'command-center',
    6: 'dashboard',
    7: 'impact-dashboard',
    8: 'accessibility',
    9: 'profile',
  };

  const getSelectorForStep = (currentStep: number): string => {
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
    if (isMobile) {
      switch (currentStep) {
        case 1: return '#civicpilot-mobile-nav';
        case 2: return '#mobile-nav-report';
        case 3: return '#mobile-nav-mission-control';
        case 4: return '#mobile-nav-generated-case';
        case 5: return '#civicpilot-top-nav';
        case 6: return '#predictive-insights-root';
        case 7: return '#mobile-nav-impact-dashboard';
        case 8: return '#civicpilot-top-nav';
        case 9: return '#mobile-nav-profile';
        default: return '';
      }
    } else {
      switch (currentStep) {
        case 1: return '#nav-item-dashboard';
        case 2: return '#nav-item-report';
        case 3: return '#nav-item-mission-control';
        case 4: return '#nav-item-generated-case';
        case 5: return '#nav-item-command-center';
        case 6: return '#predictive-insights-root';
        case 7: return '#nav-item-impact-dashboard';
        case 8: return '#nav-item-accessibility';
        case 9: return '#nav-item-profile';
        default: return '';
      }
    }
  };

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      } else if (e.key === 'ArrowRight' || e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        if (step < 10) {
          handleNext();
        } else if (step === 10) {
          onClose();
        }
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        if (step > 0) {
          handlePrev();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, step]);

  // Reset step to 0 when tour is opened
  useEffect(() => {
    if (isOpen) {
      setStep(0);
    }
  }, [isOpen]);

  // Handle step and view synchronizations
  useEffect(() => {
    if (!isOpen) return;

    if (step > 0 && step < 10) {
      const targetView = stepToViewMap[step];
      if (targetView && currentView !== targetView) {
        onViewChange(targetView);
      }
    }

    // Delay measurement slightly to allow rendering/view transitions
    const timer = setTimeout(() => {
      measureElement();
    }, 250);

    return () => clearTimeout(timer);
  }, [step, isOpen]);

  // Listen to window resizing
  useEffect(() => {
    const handleResize = () => {
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
      resizeTimeoutRef.current = setTimeout(() => {
        measureElement();
      }, 100);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) clearTimeout(resizeTimeoutRef.current);
    };
  }, [step, isOpen]);

  const measureElement = () => {
    if (step === 0 || step === 10) {
      setRect(null);
      setTooltipPos({ top: 0, left: 0, position: 'center' });
      return;
    }

    const selector = getSelectorForStep(step);
    const element = document.querySelector(selector);

    if (element) {
      // Scroll element into view smoothly if not fully visible
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });

      const elementRect = element.getBoundingClientRect();
      setRect(elementRect);

      const isMobile = window.innerWidth < 768;
      if (isMobile) {
        // Mobile layout: Tooltip is anchored as a sheet or centered
        setTooltipPos({
          top: window.innerHeight - 240,
          left: window.innerWidth / 2,
          position: 'bottom'
        });
        return;
      }

      // Desktop layout: Position tooltip based on target coordinates
      const tooltipHeight = 200;
      const tooltipWidth = 320;
      const margin = 20;

      let top = elementRect.top + elementRect.height / 2;
      let left = elementRect.right + margin;
      let position: 'top' | 'bottom' | 'left' | 'right' | 'center' = 'right';

      // Check right boundary
      if (left + tooltipWidth > window.innerWidth) {
        // Place left of target
        left = elementRect.left - tooltipWidth - margin;
        position = 'left';
      }

      // Check left boundary fallback
      if (left < 0) {
        // Place below target
        left = elementRect.left + (elementRect.width / 2) - (tooltipWidth / 2);
        top = elementRect.bottom + margin;
        position = 'bottom';
      }

      // Check bottom boundary fallback
      if (top + tooltipHeight > window.innerHeight) {
        top = window.innerHeight - tooltipHeight - margin;
      }

      // Guard minimum borders
      left = Math.max(margin, Math.min(left, window.innerWidth - tooltipWidth - margin));
      top = Math.max(margin, Math.min(top, window.innerHeight - tooltipHeight - margin));

      setTooltipPos({ top, left, position });
    } else {
      // No target found, place centrally
      setRect(null);
      setTooltipPos({
        top: window.innerHeight / 2,
        left: window.innerWidth / 2,
        position: 'center'
      });
    }
  };

  const handleNext = () => {
    if (step < 10) {
      setStep(prev => prev + 1);
    }
  };

  const handlePrev = () => {
    if (step > 0) {
      setStep(prev => prev - 1);
    }
  };

  const handleStart = () => {
    setStep(1);
  };

  const handleFinish = () => {
    onClose();
  };

  const handleSkip = () => {
    onClose();
  };

  if (!isOpen) return null;

  const currentStepData = steps[step];
  const title = language === 'hi' ? currentStepData.titleHi : currentStepData.titleEn;
  const description = language === 'hi' ? currentStepData.descHi : currentStepData.descEn;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden select-none pointer-events-auto">
      {/* 1. Backdrop overlay with spotlight mask using SVG */}
      <div className={`absolute inset-0 transition-all duration-300 pointer-events-auto ${
        rect ? 'bg-transparent' : 'bg-slate-950/70 backdrop-blur-[3px]'
      }`}>
        {rect && (
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            <defs>
              <mask id="spotlight-mask">
                <rect x="0" y="0" width="100%" height="100%" fill="white" />
                <rect 
                  x={rect.left - 8} 
                  y={rect.top - 8} 
                  width={rect.width + 16} 
                  height={rect.height + 16} 
                  rx="16" 
                  fill="black" 
                />
              </mask>
            </defs>
            <rect 
              x="0" 
              y="0" 
              width="100%" 
              height="100%" 
              fill="rgba(15, 23, 42, 0.75)" 
              mask="url(#spotlight-mask)" 
            />
          </svg>
        )}
      </div>

      {/* Spotlight border accent overlay */}
      <AnimatePresence>
        {rect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute pointer-events-none z-50 border-2 border-indigo-500 rounded-2xl shadow-[0_0_20px_rgba(99,102,241,0.5)] bg-transparent"
            style={{
              top: rect.top - 8,
              left: rect.left - 8,
              width: rect.width + 16,
              height: rect.height + 16,
            }}
          >
            {/* Pulsing glow ring */}
            <span className="absolute -inset-1 border border-indigo-400 rounded-2xl animate-ping opacity-45 duration-1000"></span>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute inset-0 flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          {/* WELCOME MODAL (Step 0) */}
          {step === 0 && (
            <motion.div
              key="welcome-modal"
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-xl rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-2xl z-50 glow-indigo text-slate-800 dark:text-slate-100 pointer-events-auto"
            >
              {/* Top Banner Gradient Stripe */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-indigo-500 via-violet-500 to-emerald-500 rounded-t-3xl"></div>

              {/* Close Button */}
              <button 
                onClick={handleSkip}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-indigo-500/10 rounded-2xl border border-indigo-500/20 text-indigo-600 dark:text-indigo-400">
                    <Sparkles className="w-8 h-8 animate-pulse" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white font-display">
                      {title}
                    </h2>
                    <p className="text-xs text-indigo-600 dark:text-indigo-400 font-semibold uppercase tracking-wider mt-0.5">
                      {language === 'hi' ? 'एआई-संचालित नागरिक खुफिया' : 'AI-POWERED CIVIC INTELLIGENCE'}
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  <p className="text-base font-medium text-slate-700 dark:text-slate-200 leading-relaxed">
                    {description}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                    {language === 'hi' 
                      ? 'सिविकपायलट नागरिकों को नागरिक मुद्दों की रिपोर्ट करने में मदद करता है और एआई-संचालित विश्लेषण, प्राथमिकता और समाधान के साथ नगरपालिका अधिकारियों की सहायता करता है।' 
                      : 'CivicPilot helps citizens report civic issues while assisting municipal authorities with AI-powered analysis, prioritization and resolution.'
                    }
                  </p>
                </div>

                {/* Info Pills */}
                <div className="grid grid-cols-2 gap-3 text-xs pt-2">
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-150 dark:border-slate-800 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-indigo-500"></div>
                    <span className="font-semibold text-slate-600 dark:text-slate-350">
                      {language === 'hi' ? '6+ सहयोगी एजेंट' : '6+ Collaborating Agents'}
                    </span>
                  </div>
                  <div className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-150 dark:border-slate-800 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-emerald-500"></div>
                    <span className="font-semibold text-slate-600 dark:text-slate-350">
                      {language === 'hi' ? 'सामुदायिक सत्यापन' : 'Community Verifications'}
                    </span>
                  </div>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-900">
                  <button
                    onClick={handleSkip}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl text-sm font-semibold text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-all cursor-pointer text-center"
                  >
                    {language === 'hi' ? 'दौरा छोड़ें' : 'Skip Tour'}
                  </button>
                  <button
                    onClick={handleStart}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/35 transition-all cursor-pointer"
                  >
                    <span>{language === 'hi' ? 'दौरा शुरू करें' : 'Start Tour'}</span>
                    <Play className="w-4 h-4 fill-current" />
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {/* INTERACTIVE TOOLTIP CARD (Steps 1-9) */}
          {step > 0 && step < 10 && (
            <motion.div
              key={`tour-step-${step}`}
              initial={{ opacity: 0, scale: 0.95, y: tooltipPos.position === 'bottom' ? 20 : -10 }}
              animate={{ 
                opacity: 1, 
                scale: 1, 
                y: 0,
                x: window.innerWidth < 768 ? -160 : 0 // center horizontally on mobile (absolute center alignment hack)
              }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 22, stiffness: 300 }}
              className={`absolute w-[320px] rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#08080c]/95 p-5 shadow-2xl z-50 glow-indigo text-slate-800 dark:text-slate-100 pointer-events-auto ${
                window.innerWidth < 768 ? 'left-1/2 bottom-12 top-auto' : ''
              }`}
              style={window.innerWidth >= 768 ? {
                top: tooltipPos.top,
                left: tooltipPos.left,
              } : undefined}
            >
              {/* Elegant floating badge */}
              <div className="absolute -top-3 left-5 px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono uppercase bg-indigo-500 text-white shadow-md">
                {language === 'hi' ? `चरण ${step} / 9` : `Step ${step} of 9`}
              </div>

              <div className="space-y-4 pt-1">
                <div>
                  <h3 className="text-base font-black tracking-tight text-slate-900 dark:text-white font-display">
                    {title}
                  </h3>
                </div>

                <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-medium">
                  {description}
                </p>

                {/* Progress dot indicator */}
                <div className="flex gap-1.5 pt-1">
                  {Array.from({ length: 9 }).map((_, i) => (
                    <div 
                      key={i} 
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i + 1 === step 
                          ? 'w-5 bg-indigo-500' 
                          : i + 1 < step 
                            ? 'w-1.5 bg-indigo-500/40' 
                            : 'w-1.5 bg-slate-200 dark:bg-slate-800'
                      }`}
                    />
                  ))}
                </div>

                <div className="flex items-center justify-between gap-2 pt-3 border-t border-slate-100 dark:border-slate-900/60 text-xs">
                  <button
                    onClick={handleSkip}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-350 transition-colors cursor-pointer font-semibold"
                  >
                    {language === 'hi' ? 'छोड़ें' : 'Skip'}
                  </button>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={handlePrev}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-850 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-900 transition-colors cursor-pointer"
                      title={language === 'hi' ? 'पिछला' : 'Previous'}
                    >
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button
                      onClick={handleNext}
                      className="flex items-center gap-1 px-3 py-1.5 rounded-lg text-white bg-indigo-600 hover:bg-indigo-500 font-bold shadow-md transition-colors cursor-pointer"
                    >
                      <span>{language === 'hi' ? 'अगला' : 'Next'}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* TOUR COMPLETION / FINISH MODAL (Step 10) */}
          {step === 10 && (
            <motion.div
              key="finish-modal"
              initial={{ opacity: 0, scale: 0.92, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: -10 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-lg rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950 p-8 shadow-2xl z-50 text-center glow-emerald text-slate-800 dark:text-slate-100 pointer-events-auto"
            >
              {/* Celebratory confetti/burst pattern underlayer */}
              <div className="absolute inset-0 overflow-hidden rounded-3xl pointer-events-none">
                <div className="absolute top-10 left-10 w-2 h-2 rounded-full bg-indigo-500 animate-ping"></div>
                <div className="absolute top-24 right-16 w-3 h-3 rounded-full bg-emerald-500 animate-pulse"></div>
                <div className="absolute bottom-12 left-20 w-2.5 h-2.5 rounded-full bg-violet-500 animate-pulse"></div>
                <div className="absolute bottom-28 right-12 w-2 h-2 rounded-full bg-pink-500 animate-ping"></div>
              </div>

              {/* Top Banner Gradient Stripe */}
              <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-emerald-500 via-teal-500 to-indigo-500 rounded-t-3xl"></div>

              {/* Close Button */}
              <button 
                onClick={handleFinish}
                className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-all cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="space-y-6 flex flex-col items-center">
                {/* Checkmark Animation with green burst */}
                <div className="relative">
                  <div className="p-4 bg-emerald-500/10 rounded-full text-emerald-500 border border-emerald-500/20 relative z-10">
                    <CheckCircle2 className="w-12 h-12" />
                  </div>
                  <div className="absolute -inset-2 bg-emerald-500/5 rounded-full blur-sm animate-pulse"></div>
                </div>

                <div className="space-y-2">
                  <h2 className="text-2xl font-black tracking-tight text-slate-900 dark:text-white font-display">
                    {title}
                  </h2>
                  <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
                    {description}
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-indigo-50/40 dark:bg-slate-900/60 border border-slate-150 dark:border-slate-800 text-left w-full space-y-2.5">
                  <h4 className="text-xs font-black text-slate-900 dark:text-white uppercase font-mono tracking-wider flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-indigo-500" />
                    {language === 'hi' ? 'अगला कदम आज़माएं' : 'Try Your First Action'}
                  </h4>
                  <p className="text-xs text-slate-550 dark:text-slate-350 leading-relaxed">
                    {language === 'hi'
                      ? 'नागरिक मुद्दा रिपोर्टिंग का परीक्षण करने के लिए "समस्या की रिपोर्ट करें" टैब पर जाएं या एक पूर्ण लाइव डेमो के लिए हमारे डैशबोर्ड पर बने रहें।'
                      : 'Navigate to the "Report Issue" tab to submit a civic issue, or try exploring Mission Control to see how the multi-agent AI engine operates.'
                    }
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row items-center justify-center gap-3 w-full pt-4 border-t border-slate-100 dark:border-slate-900">
                  <button
                    onClick={() => setStep(1)}
                    className="w-full sm:w-auto px-5 py-3 rounded-xl text-sm font-semibold text-slate-550 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-900 transition-all cursor-pointer"
                  >
                    {language === 'hi' ? 'दौरा दोहराएं' : 'Replay Tour'}
                  </button>
                  <button
                    onClick={handleFinish}
                    className="w-full sm:w-auto px-8 py-3 rounded-xl text-sm font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/35 transition-all cursor-pointer text-center"
                  >
                    {language === 'hi' ? 'प्रारंभ करें' : 'Explore CivicPilot'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
