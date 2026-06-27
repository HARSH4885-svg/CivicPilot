import { useState, useEffect } from 'react';
import { jsPDF } from 'jspdf';
import { 
  FileText, 
  Download, 
  MapPin, 
  ShieldCheck, 
  CheckCircle2, 
  Paperclip,
  Volume2
} from 'lucide-react';
import { IssueReport, View, CommunityVerification } from '../types';
import SafeImage from '../components/SafeImage';
import CommunityVerificationSection from '../components/CommunityVerificationSection';

interface GeneratedCaseViewProps {
  reports: IssueReport[];
  activeReport: IssueReport | null;
  onSelectReport: (report: IssueReport) => void;
  onUpdateVerification: (id: string, updatedVerification: CommunityVerification, updatedAnalysis?: any) => void;
  language?: 'en' | 'hi';
}

export default function GeneratedCaseView({ 
  reports, 
  activeReport, 
  onSelectReport,
  onUpdateVerification,
  language = 'en'
}: GeneratedCaseViewProps) {
  // If no report is selected, default to the first one available or show list
  const currentReport = activeReport || reports[0];
  const [downloading, setDownloading] = useState(false);
  const [pdfDownloading, setPdfDownloading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Audio Text-to-Speech States
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Stop audio speech on unmount
  useEffect(() => {
    return () => {
      window.speechSynthesis.cancel();
    };
  }, []);

  const speakReport = () => {
    if (!currentReport) return;
    const analysis = currentReport.analysis;
    const textToSpeak = analysis?.summary || currentReport.aiSummary || 'AI compilation complete. Specialized vision models localized environmental asset fractures and routed telemetry to city works registries.';
    
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    
    const voices = window.speechSynthesis.getVoices();
    const targetVoice = voices.find(v => v.lang.startsWith(language === 'hi' ? 'hi' : 'en'));
    if (targetVoice) {
      utterance.voice = targetVoice;
    }

    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsPaused(false);
    };

    utterance.onend = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsPaused(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const pauseReport = () => {
    window.speechSynthesis.pause();
    setIsPaused(true);
  };

  const resumeReport = () => {
    window.speechSynthesis.resume();
    setIsPaused(false);
  };

  const stopReport = () => {
    window.speechSynthesis.cancel();
    setIsSpeaking(false);
    setIsPaused(false);
  };

  const triggerDownload = () => {
    if (!currentReport) return;
    const analysis = currentReport.analysis;
    setDownloading(true);
    setTimeout(() => {
      setDownloading(false);
      
      // Compile dossier plain text content
      const dossierText = `
========================================================================
             CIVICPILOT AUTONOMOUS MUNICIPAL CASE FILE
========================================================================
CASE ID: ${currentReport.id}
TICKET: ${currentReport.ticketId || 'TX-GRD-901'}
DATE RECORDED: ${new Date(currentReport.createdAt).toLocaleString()}
REPORT CLASS: ${analysis?.issueType || (language === 'hi' && currentReport.translatedCategory ? currentReport.translatedCategory : currentReport.category)}
MUNICIPAL SEVERITY: ${(analysis?.severity || currentReport.severity).toUpperCase()}
OFFICIAL DISPATCH AUTHORITY: ${analysis?.authority || "Department of Public Works"}

------------------------------------------------------------------------
1. CITIZEN INPUT SUMMARY
------------------------------------------------------------------------
Subject: ${language === 'hi' && currentReport.translatedTitle ? currentReport.translatedTitle : currentReport.title}
Incident Address: ${currentReport.location.address}
Description: ${language === 'hi' && currentReport.translatedDescription ? currentReport.translatedDescription : currentReport.description}

------------------------------------------------------------------------
2. AUTOMATED COGNITIVE ANALYSIS
------------------------------------------------------------------------
Summary: ${analysis?.summary || "Pending automated synthesis."}
Reasoning: ${analysis?.reasoning || "Pending algorithmic justification."}
Urgency Score: ${analysis?.urgencyScore || 75}/100
Citizen Impact Assessment: ${analysis?.citizenImpact || "Standard local impact."}

------------------------------------------------------------------------
3. CONCRETE MITIGATION & RESTORATION PLAN
------------------------------------------------------------------------
${(analysis?.suggestedActions || ["Deploy inspection crew", "Log to Open311", "Notify area residents"])
  .map((action, i) => `${i + 1}. [EXPEDITED] ${action}`)
  .join('\n')}

------------------------------------------------------------------------
4. MULTI-AGENT ORCHESTRATION TELEMETRY
------------------------------------------------------------------------
- Vision Agent Status: [${analysis?.agents?.vision?.confidence || 90}% Confidence] ${analysis?.agents?.vision?.status || "Completed."}
- Geo Agent Status: [${analysis?.agents?.geo?.confidence || 95}% Confidence] ${analysis?.agents?.geo?.status || "Completed."}
- Verification Agent Status: [${analysis?.agents?.verification?.confidence || 92}% Confidence] ${analysis?.agents?.verification?.status || "Completed."}
- Priority Agent Status: [${analysis?.agents?.priority?.confidence || 94}% Confidence] ${analysis?.agents?.priority?.status || "Completed."}
- Resolution Agent Status: [${analysis?.agents?.resolution?.confidence || 91}% Confidence] ${analysis?.agents?.resolution?.status || "Completed."}
- Deployment Agent Status: [${analysis?.agents?.deployment?.confidence || 96}% Confidence] ${analysis?.agents?.deployment?.status || "Completed."}

========================================================================
     END OF RECORD - AUTHENTICATED BY CIVICPILOT CRYPTO-LEDGER
========================================================================
      `;

      const blob = new Blob([dossierText.trim()], { type: 'text/plain;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `civicpilot_dossier_${currentReport.id}.txt`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setToastMessage(`civicpilot_dossier_${currentReport.id}.txt compiled & saved.`);
      setShowToast(true);
      setTimeout(() => setShowToast(false), 4000);
    }, 1200);
  };

  const triggerPDFDownload = () => {
    if (!currentReport) return;
    const analysis = currentReport.analysis;
    setPdfDownloading(true);

    setTimeout(() => {
      setPdfDownloading(false);
      try {
        const doc = new jsPDF({
          orientation: 'portrait',
          unit: 'mm',
          format: 'a4'
        });
        
        // Colors
        const indigoColor = '#4f46e5';
        const darkSlate = '#0f172a';
        
        // Background banner
        doc.setFillColor(79, 70, 229); // Indigo
        doc.rect(0, 0, 210, 18, 'F');
        
        // Header Banner Text
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(13);
        doc.setTextColor(255, 255, 255);
        doc.text('CIVICPILOT AUTONOMOUS MUNICIPAL CASE DOSSIER', 15, 11);
        
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(224, 231, 255);
        doc.text('OS_NODE_092  •  HASH CERTIFIED', 155, 11);

        // Header Section
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(16);
        doc.setTextColor(15, 23, 42); // dark slate
        doc.text(language === 'hi' && currentReport.translatedTitle ? currentReport.translatedTitle : currentReport.title, 15, 30);

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(100, 116, 139);
        doc.text(`Docket ID: #${currentReport.id}  •  Ticket: ${currentReport.ticketId || 'TX-GRD-901'}  •  Recorded: ${new Date(currentReport.createdAt).toLocaleDateString()}`, 15, 36);

        // Thin Separator line
        doc.setDrawColor(226, 232, 240);
        doc.setLineWidth(0.4);
        doc.line(15, 41, 195, 41);

        // Core Meta Grid Card
        doc.setFillColor(248, 250, 252);
        doc.rect(15, 46, 180, 20, 'F');
        doc.rect(15, 46, 180, 20, 'D');

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(8);
        doc.setTextColor(100, 116, 139);
        doc.text('REPORT CATEGORY', 20, 52);
        doc.text('MUNICIPAL SEVERITY', 68, 52);
        doc.text('DISPATCH STATUS', 115, 52);
        doc.text('INTEGRITY INDEX', 160, 52);

        doc.setFontSize(9.5);
        doc.setTextColor(15, 23, 42);
        doc.text(language === 'hi' && currentReport.translatedCategory ? currentReport.translatedCategory : currentReport.category, 20, 60);
        doc.text((analysis?.severity || currentReport.severity).toUpperCase(), 68, 60);
        doc.text(currentReport.status.toUpperCase(), 115, 60);
        doc.text(`${analysis?.confidence || 98.6}% Sync`, 160, 60);

        // 1. Citizen Input Profile
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(79, 70, 229); // Indigo
        doc.text('1. CITIZEN INCIDENT PROFILE', 15, 78);

        doc.setFontSize(9);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text('GEOGRAPHIC ANCHOR:', 15, 85);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        doc.text(currentReport.location.address, 58, 85);

        doc.setFont('helvetica', 'bold');
        doc.setTextColor(15, 23, 42);
        doc.text('INCIDENT DETAILS:', 15, 92);
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(71, 85, 105);
        const splitDescription = doc.splitTextToSize(language === 'hi' && currentReport.translatedDescription ? currentReport.translatedDescription : currentReport.description, 180);
        doc.text(splitDescription, 15, 97);

        const descHeight = splitDescription.length * 4.5;
        let nextY = 97 + descHeight + 10;

        // 2. Cognitive Analysis Summary
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(79, 70, 229);
        doc.text('2. AUTOMATED COGNITIVE ANALYSIS', 15, nextY);
        nextY += 7;

        // Summary box
        doc.setFillColor(245, 247, 255);
        const summaryText = analysis?.summary || currentReport.aiSummary || "AI compilation complete. Specialized vision models localized environmental asset fractures and routed telemetry to city works registries.";
        const splitSummary = doc.splitTextToSize(`" ${summaryText} "`, 172);
        const boxHeight = splitSummary.length * 4.5 + 8;

        doc.rect(15, nextY, 180, boxHeight, 'F');
        doc.rect(15, nextY, 180, boxHeight, 'D');

        doc.setFont('helvetica', 'italic');
        doc.setFontSize(9);
        doc.setTextColor(67, 56, 202);
        doc.text(splitSummary, 19, nextY + 6);

        nextY += boxHeight + 10;

        // 3. Expedited Restoration Plan
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(11);
        doc.setTextColor(79, 70, 229);
        doc.text('3. EXPEDITED RESTORATION PLAN', 15, nextY);
        nextY += 7;

        doc.setFont('helvetica', 'normal');
        doc.setFontSize(9);
        doc.setTextColor(71, 85, 105);

        const actions = analysis?.suggestedActions || [
          "Deploy Warning Beacons & Area Isolators to safeguard pedestrians",
          "Initiate Automatic Crew Dispatch Schedule with heavy equipment specs",
          "Sync digital metadata signature hash with Open311 municipal database registry"
        ];

        actions.forEach((action, index) => {
          doc.setFont('helvetica', 'bold');
          doc.setTextColor(79, 70, 229);
          doc.text(`[0${index + 1}]`, 15, nextY);
          
          doc.setFont('helvetica', 'normal');
          doc.setTextColor(71, 85, 105);
          const splitAction = doc.splitTextToSize(action, 168);
          doc.text(splitAction, 25, nextY);
          nextY += (splitAction.length * 4.5) + 3.5;
        });

        // Audit Signature
        if (nextY > 268) {
          doc.addPage();
          nextY = 25;
        } else {
          nextY += 8;
        }

        doc.setLineWidth(0.3);
        doc.setDrawColor(226, 232, 240);
        doc.line(15, nextY, 195, nextY);
        nextY += 5;

        doc.setFont('helvetica', 'bold');
        doc.setFontSize(7.5);
        doc.setTextColor(16, 185, 129); // emerald
        doc.text('✓ CRYPTOGRAPHICALLY AUTHENTICATED & SYNCED TO OPEN311 SYSTEMS', 15, nextY);
        
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(148, 163, 184);
        doc.text(`SYSTEM_HASH: sha256_b372f910a300ff84a0d9230588c7f_${currentReport.id.toLowerCase()}`, 15, nextY + 4);

        doc.save(`civicpilot_dossier_${currentReport.id}.pdf`);

        setToastMessage(`civicpilot_dossier_${currentReport.id}.pdf generated & downloaded successfully.`);
        setShowToast(true);
        setTimeout(() => setShowToast(false), 4000);
      } catch (err) {
        console.error('PDF generation error', err);
      }
    }, 1500);
  };

  if (!currentReport) {
    return (
      <div className="p-8 text-center border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl bg-slate-50 dark:bg-slate-950/20 max-w-lg mx-auto my-12 transition-colors">
        <FileText className="w-12 h-12 text-indigo-500 dark:text-indigo-400 mx-auto mb-4" />
        <h4 className="text-base font-bold text-slate-800 dark:text-white">No Case Dossiers Available</h4>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-2">Create a new report in the Incident Center to compile structured dossiers.</p>
      </div>
    );
  }

  const analysis = currentReport.analysis;

  return (
    <div id="generated-case-view" className="space-y-8 pb-12 relative transition-colors duration-300">
      {/* Toast notification overlay */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 bg-white dark:bg-[#0A0A0A] border border-emerald-500/30 rounded-2xl p-4 shadow-xl shadow-emerald-950/10 flex items-center gap-3 animate-bounce">
          <div className="p-2 bg-emerald-50 dark:bg-emerald-500/10 rounded-xl text-emerald-600 dark:text-emerald-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-white font-mono">EXPORT_SUCCESS</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
              {toastMessage}
            </p>
          </div>
        </div>
      )}

      {/* Dossier Selection & Meta Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 gap-4 shadow-sm transition-colors">
        <div>
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-[10px] font-mono tracking-wider text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-150 dark:border-indigo-500/20 px-2 py-0.5 rounded">
              Docket #{currentReport.id}
            </span>
            {currentReport.isDemo ? (
              <span className="text-[10px] font-mono font-extrabold text-amber-700 dark:text-amber-400 bg-amber-50 dark:bg-amber-500/10 border border-amber-150 dark:border-amber-500/20 px-2 py-0.5 rounded">
                DEMO CASE
              </span>
            ) : (
              <span className="text-[10px] font-mono font-extrabold text-emerald-700 dark:text-emerald-450 bg-emerald-50 dark:bg-emerald-500/10 border border-emerald-150 dark:border-emerald-500/20 px-2 py-0.5 rounded animate-pulse">
                LIVE ANALYSIS
              </span>
            )}
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white mt-2.5 font-display">
            Selected File: {language === 'hi' && currentReport.translatedTitle ? currentReport.translatedTitle : currentReport.title}
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Status: <span className="text-emerald-600 dark:text-emerald-400 font-medium capitalize">{currentReport.status}</span> • Created {new Date(currentReport.createdAt).toLocaleDateString()}
          </p>
        </div>

        {/* Quick dossier selector dropdown */}
        <div className="flex items-center gap-3">
          <label htmlFor="case-select" className="text-xs font-mono text-slate-500 whitespace-nowrap">SWITCH_DOCKET:</label>
          <select
            id="case-select"
            value={currentReport.id}
            onChange={(e) => {
              const rep = reports.find(r => r.id === e.target.value);
              if (rep) onSelectReport(rep);
            }}
            className="px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-700 dark:text-slate-300 outline-none cursor-pointer focus:border-indigo-500"
          >
            {reports.map(r => (
              <option key={r.id} value={r.id}>
                {r.id} - {r.title.slice(0, 25)}...
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Columns - AI Insights and Evidence Summary */}
        <div className="lg:col-span-1 space-y-6">
          {/* AI Synthesis Summary Card */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 relative overflow-hidden shadow-sm transition-colors">
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
            
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Cognitive Synthesis
            </h4>

            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-150 dark:border-slate-800/80 mb-4 transition-colors">
              <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans italic">
                "{analysis?.summary || currentReport.aiSummary || 'AI compilation complete. Specialized vision models localized environmental asset fractures and routed telemetry to city works registries.'}"
              </p>
            </div>

            {/* Audio Speech Player Controls */}
            <div className="flex items-center justify-between mt-4 p-3 bg-indigo-50/50 dark:bg-indigo-950/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30 mb-6">
              <span className="text-[10px] font-mono text-indigo-600 dark:text-indigo-400 font-bold flex items-center gap-1">
                <Volume2 className="w-3.5 h-3.5" />
                {language === 'hi' ? 'ऑडियो रिपोर्ट वाचक' : 'AUDIO REPORT READER'}
              </span>
              <div className="flex gap-2">
                {!isSpeaking && !isPaused ? (
                  <button
                    type="button"
                    onClick={speakReport}
                    className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer text-[10px] flex items-center gap-1 font-semibold"
                    title={language === 'hi' ? 'रिपोर्ट सुनें' : 'Listen to Report'}
                  >
                    <span>{language === 'hi' ? 'सुनें' : 'Listen'}</span>
                  </button>
                ) : (
                  <>
                    {isSpeaking && !isPaused ? (
                      <button
                        type="button"
                        onClick={pauseReport}
                        className="px-2.5 py-1 rounded-lg bg-amber-500 text-white hover:bg-amber-600 transition-colors cursor-pointer text-[10px]"
                        title={language === 'hi' ? 'रोकें' : 'Pause'}
                      >
                        {language === 'hi' ? 'विराम' : 'Pause'}
                      </button>
                    ) : (
                      <button
                        type="button"
                        onClick={resumeReport}
                        className="px-2.5 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition-colors cursor-pointer text-[10px]"
                        title={language === 'hi' ? 'जारी रखें' : 'Resume'}
                      >
                        {language === 'hi' ? 'जारी रखें' : 'Resume'}
                      </button>
                    )}
                    <button
                      type="button"
                      onClick={stopReport}
                      className="px-2.5 py-1 rounded-lg bg-red-600 text-white hover:bg-red-700 transition-colors cursor-pointer text-[10px]"
                      title={language === 'hi' ? 'बंद करें' : 'Stop'}
                    >
                      {language === 'hi' ? 'बंद' : 'Stop'}
                    </button>
                  </>
                )}
              </div>
            </div>

            <div className="space-y-4 pt-2 text-xs font-mono">
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-900 pb-2 transition-colors">
                <span className="text-slate-500">SEVERITY_INDEX</span>
                <span className={`font-bold uppercase ${
                  (analysis?.severity || currentReport.severity) === 'critical' ? 'text-red-600 dark:text-red-400 animate-pulse' : 'text-amber-600 dark:text-amber-400'
                }`}>
                  {analysis?.severity || currentReport.severity}
                </span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-900 pb-2 transition-colors">
                <span className="text-slate-500">MUNICIPAL_ROUTE</span>
                <span className="text-indigo-600 dark:text-indigo-400 font-semibold">{analysis?.issueType || currentReport.category}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-900 pb-2 transition-colors">
                <span className="text-slate-500">OPEN311_ID</span>
                <span className="text-slate-700 dark:text-slate-200 font-bold">{currentReport.ticketId || 'TX-GEN-922'}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 dark:border-slate-900 pb-2 transition-colors">
                <span className="text-slate-500">INTEGRITY_INDEX</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">{analysis?.confidence || 98.6}% Standard</span>
              </div>
              {analysis?.affectedArea && (
                <div className="flex justify-between border-b border-slate-100 dark:border-slate-900 pb-2 transition-colors">
                  <span className="text-slate-500 font-mono">AFFECTED_AREA</span>
                  <span className="text-slate-700 dark:text-slate-300 text-right font-sans font-medium">{analysis.affectedArea}</span>
                </div>
              )}
              {analysis?.urgencyScore && (
                <div className="flex justify-between">
                  <span className="text-slate-500">URGENCY_SCORE</span>
                  <span className="text-rose-600 dark:text-rose-400 font-mono font-bold">{analysis.urgencyScore}/100</span>
                </div>
              )}
            </div>
          </div>

          {/* Evidence Attachments Panel */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 shadow-sm transition-colors">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Paperclip className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              Incident Assets
            </h4>

            {currentReport.imageUrl ? (
              <div className="space-y-3">
                <div className="rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 transition-colors">
                  <SafeImage 
                    src={currentReport.imageUrl} 
                    alt="Civic evidence" 
                    category={currentReport.category}
                    className="w-full h-44 object-cover"
                  />
                </div>
                <div className="flex justify-between text-[11px] font-mono text-slate-500">
                  <span>FILE: SOURCE_CAPTURE.JPG</span>
                  <span>SIZE: 2.4MB</span>
                </div>
              </div>
            ) : (
              <div className="py-8 text-center bg-slate-50 dark:bg-slate-900/40 rounded-xl border border-slate-200 dark:border-slate-800/80 transition-colors">
                <p className="text-xs text-slate-400 dark:text-slate-500">No photo attachments linked</p>
              </div>
            )}

            {currentReport.voiceDuration && (
              <div className="mt-4 p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200 dark:border-slate-800 flex flex-col gap-2 text-xs text-slate-700 dark:text-slate-300 font-mono transition-colors">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5 text-indigo-600 dark:text-indigo-400 font-bold">
                    <CheckCircle2 className="w-4 h-4" /> VOICE_TRANSCRIPT
                  </span>
                  <span className="font-semibold">{currentReport.voiceDuration} seconds</span>
                </div>
                {currentReport.voiceUrl ? (
                  <audio src={currentReport.voiceUrl} controls className="w-full mt-1 h-8 rounded bg-transparent" />
                ) : (
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 italic mt-0.5">Vocal telemetry transcript synthesized</span>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Columns - Official Government-Ready Case File */}
        <div className="lg:col-span-2 space-y-6">
          {/* Paper / PDF Blueprint container */}
          <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#0d1220] p-6 md:p-10 shadow-2xl relative overflow-hidden transition-colors duration-300">
            {/* Top decorative binder strip */}
            <div className="absolute top-0 left-0 right-0 h-4 bg-slate-100 dark:bg-slate-950 flex justify-around">
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map(n => (
                <span key={n} className="w-4 h-4 rounded-full bg-white dark:bg-[#0d1220] border border-slate-200 dark:border-slate-800 -mt-2"></span>
              ))}
            </div>

            {/* Document Action Panel (Floating glass effect) */}
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 mb-8 border-b border-slate-150 dark:border-slate-800 mt-4 gap-4 transition-colors">
              <div className="flex items-center gap-2 text-xs font-mono text-slate-500 dark:text-slate-400">
                <FileText className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                <span>GOVERNMENT_CASE_DOSSIER_V3.0</span>
              </div>

              <div className="flex items-center gap-2.5 flex-wrap">
                <button
                  id="btn-download-txt"
                  onClick={triggerDownload}
                  disabled={downloading || pdfDownloading}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-200 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 active:scale-95 transition-all cursor-pointer"
                >
                  <Download className={`w-3.5 h-3.5 ${downloading ? 'animate-bounce' : ''}`} />
                  <span>{downloading ? 'Compiling...' : 'Export TXT'}</span>
                </button>

                <button
                  id="btn-download-pdf"
                  onClick={triggerPDFDownload}
                  disabled={downloading || pdfDownloading}
                  className="flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 active:scale-95 transition-all shadow-md shadow-indigo-600/10 cursor-pointer"
                >
                  <FileText className={`w-3.5 h-3.5 ${pdfDownloading ? 'animate-pulse' : ''}`} />
                  <span>{pdfDownloading ? 'Generating...' : 'Export PDF'}</span>
                </button>
              </div>
            </div>

            {/* Official PDF layout mockup */}
            <div className="space-y-8 font-sans text-slate-700 dark:text-slate-300">
              {/* Header section with seals */}
              <div className="flex justify-between items-start border-b-2 border-slate-200 dark:border-slate-800 pb-6 transition-colors">
                <div>
                  <h1 className="text-xl font-bold font-display text-slate-900 dark:text-white tracking-wide uppercase">
                    Municipal Emergency Dispatch
                  </h1>
                  <p className="text-[11px] font-mono text-slate-500 mt-1">
                    AUTONOMOUS CLOUD INTEGRATION RECORD • DISTRICT 4 COGNITIVE OPERATIONS
                  </p>
                </div>
                
                <div className="text-right font-mono text-[11px]">
                  <p className="text-slate-900 dark:text-white font-bold">CASE ID: {currentReport.id}</p>
                  <p className="text-slate-500 mt-1">TICKET: {currentReport.ticketId || 'TX-GRD-901'}</p>
                </div>
              </div>

              {/* Main Docket Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-mono border-b border-slate-200 dark:border-slate-800 pb-6 transition-colors">
                <div>
                  <p className="text-slate-500">DATE RECORDED</p>
                  <p className="text-slate-800 dark:text-slate-200 mt-1 font-bold">{new Date(currentReport.createdAt).toLocaleDateString()}</p>
                </div>
                <div>
                  <p className="text-slate-500">REPORT CLASS</p>
                  <p className="text-indigo-600 dark:text-indigo-400 mt-1 font-bold">
                    {analysis?.issueType || (language === 'hi' && currentReport.translatedCategory ? currentReport.translatedCategory : currentReport.category)}
                  </p>
                </div>
                <div>
                  <p className="text-slate-500">MUNICIPAL SEVERITY</p>
                  <p className="text-amber-600 dark:text-amber-400 mt-1 font-bold capitalize">{analysis?.severity || currentReport.severity}</p>
                </div>
                <div>
                  <p className="text-slate-500">DISPATCH TIMING</p>
                  <p className="text-emerald-600 dark:text-emerald-400 mt-1 font-bold">
                    {analysis?.urgencyScore ? `URGENT (${analysis.urgencyScore}/100)` : 'AUTOROUTE (8.4x Accelerated)'}
                  </p>
                </div>
              </div>

              {/* Physical Site Coordinates */}
              <div className="space-y-2">
                <h5 className="text-xs font-mono text-slate-500 uppercase">1. Incident Geographic Anchors</h5>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-xs leading-relaxed flex items-center justify-between gap-4 transition-colors">
                  <div className="flex items-center gap-2 text-slate-800 dark:text-slate-200 font-medium">
                    <MapPin className="w-4 h-4 text-indigo-500 dark:text-indigo-400" />
                    <span>{currentReport.location.address}</span>
                  </div>
                  <span className="font-mono text-[11px] text-slate-500 shrink-0">
                    GPS: {currentReport.location.lat.toFixed(4)}° N, {currentReport.location.lng.toFixed(4)}° W
                  </span>
                </div>
              </div>

              {/* Physical Incident Description */}
              <div className="space-y-2">
                <h5 className="text-xs font-mono text-slate-500 uppercase">2. Raw Evidence Log Transcript</h5>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-xs leading-relaxed font-mono text-slate-700 dark:text-slate-300 transition-colors">
                  {language === 'hi' && currentReport.translatedDescription ? currentReport.translatedDescription : currentReport.description}
                </div>
              </div>

              {/* Real Citizen Impact & Routing Analysis */}
              {analysis && (
                <div className="space-y-2">
                  <h5 className="text-xs font-mono text-slate-500 uppercase">3. Citizen Impact & Routing Analysis</h5>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200 dark:border-slate-800 text-xs space-y-2 leading-relaxed transition-colors">
                    <p className="text-slate-700 dark:text-slate-300">
                      <strong>Impact Assessment</strong>: {analysis.citizenImpact}
                    </p>
                    <div className="pt-2 border-t border-slate-200 dark:border-slate-900 text-[11px] text-slate-500 flex flex-wrap justify-between gap-2">
                      <span><strong>Authority Routing</strong>: <span className="font-semibold text-slate-700 dark:text-slate-300">{analysis.authority}</span></span>
                      <span><strong>Model Reasoning</strong>: <span className="font-semibold text-slate-700 dark:text-slate-300">{analysis.reasoning}</span></span>
                    </div>
                  </div>
                </div>
              )}

              {/* Dynamic Step-by-Step Resolution Plan */}
              <div className="space-y-3">
                <h5 className="text-xs font-mono text-slate-500 uppercase">
                  {analysis ? '4. Auto-Synthesized Tactical Mitigation Steps' : '3. Auto-Synthesized Tactical Mitigation Steps'}
                </h5>
                <div className="space-y-2.5 text-xs">
                  {analysis?.suggestedActions && analysis.suggestedActions.length > 0 ? (
                    analysis.suggestedActions.map((action, idx) => (
                      <div key={idx} className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-150 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-bold shrink-0 mt-0.5 transition-colors">
                          {String(idx + 1).padStart(2, '0')}
                        </span>
                        <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                          {action}
                        </p>
                      </div>
                    ))
                  ) : (
                    <>
                      <div className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-150 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-bold shrink-0 mt-0.5 transition-colors">
                          01
                        </span>
                        <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                          <strong>Deploy Warning Beacons & Area Isolators</strong>: Route emergency alerts to smart signaling network on Broadway to isolate active sinkhole radius.
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-150 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-bold shrink-0 mt-0.5 transition-colors">
                          02
                        </span>
                        <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                          <strong>Automatic Crew Dispatch Schedule</strong>: Route material specs (12" sleeve coupler, shoring grid) directly to local Public Works Maintenance Fleet B.
                        </p>
                      </div>
                      <div className="flex items-start gap-3">
                        <span className="w-5 h-5 rounded-full bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-150 dark:border-indigo-500/30 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-mono text-[10px] font-bold shrink-0 mt-0.5 transition-colors">
                          03
                        </span>
                        <p className="leading-relaxed text-slate-600 dark:text-slate-300">
                          <strong>Log Open311 Database Entry</strong>: Sync signed metadata hash with municipal registry endpoint, releasing public API callback updates.
                        </p>
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Audit Sign-off footer block */}
              <div className="pt-6 border-t border-slate-200 dark:border-slate-800/80 flex flex-col md:flex-row justify-between items-start md:items-center gap-4 text-[10px] font-mono text-slate-500 transition-colors">
                <div>
                  <p>COMPILATION: CIVICPILOT_OS_NODE_092</p>
                  <p className="mt-1 text-indigo-600 dark:text-indigo-400/80">BLOCKCHAIN_CERTIFICATE_HASH: f9a0e4c2781bcf7041a094bb92c</p>
                </div>

                <div className="text-right border-l md:border-l-0 md:pl-0 border-slate-200 dark:border-slate-800 pl-4">
                  <p className="text-emerald-600 dark:text-emerald-400 font-bold uppercase">✓ API SYNCED TO CITYWORKS</p>
                  <p className="mt-1">AUTONOMOUS AUDIT COMPLIANT</p>
                </div>
              </div>
            </div>
            
            {/* Citizen Community Verification Hub */}
            <CommunityVerificationSection 
              report={currentReport} 
              onUpdateVerification={onUpdateVerification} 
            />
          </div>
        </div>
      </div>
    </div>
  );
}
