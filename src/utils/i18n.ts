export type Language = 'en' | 'hi';

export interface TranslationDictionary {
  [key: string]: {
    en: string;
    hi: string;
  };
}

export const UI_TRANSLATIONS: TranslationDictionary = {
  // Navigation / Sidebar
  navIntelligenceCenter: {
    en: 'Intelligence Center',
    hi: 'इंटेलिजेंस सेंटर'
  },
  navCommandCenter: {
    en: 'Command Center',
    hi: 'कमांड सेंटर'
  },
  navReportIncident: {
    en: 'Report Incident',
    hi: 'घटना की रिपोर्ट करें'
  },
  navMissionControl: {
    en: 'Mission Control',
    hi: 'मिशन नियंत्रण'
  },
  navMunicipalFiles: {
    en: 'Municipal Files',
    hi: 'नगरपालिका फाइलें'
  },
  navLiveGISMap: {
    en: 'Live GIS Map',
    hi: 'लाइव जीआईएस मानचित्र'
  },
  navCitizenProfile: {
    en: 'Citizen Profile',
    hi: 'नागरिक प्रोफ़ाइल'
  },
  navAccessibility: {
    en: 'Accessibility & Lang',
    hi: 'सुगमता और भाषा'
  },

  // General UI / Headers
  ioOnline: {
    en: 'IO_ONLINE',
    hi: 'आईओ_ऑनलाइन'
  },
  agentsStandby: {
    en: 'AGENTS_STANDBY',
    hi: 'एजेंट_तैयार'
  },
  btnNewIncident: {
    en: 'New Incident',
    hi: 'नई घटना'
  },
  btnThemeToggleLight: {
    en: 'Switch to Light Theme',
    hi: 'लाइट थीम पर स्विच करें'
  },
  btnThemeToggleDark: {
    en: 'Switch to Dark Theme',
    hi: 'डार्क थीम पर स्विच करें'
  },

  // Accessibility Page Controls
  accessibilityTitle: {
    en: 'Accessibility & Multilingual Experience',
    hi: 'सुगमता और बहुभाषी अनुभव'
  },
  accessibilitySub: {
    en: 'Configure display, voice accessibility, and language preferences.',
    hi: 'प्रदर्शन, आवाज सुगमता और भाषा प्राथमिकताओं को कॉन्फ़िगर करें।'
  },
  languageSelection: {
    en: 'Application Language',
    hi: 'एप्लिकेशन की भाषा'
  },
  langDesc: {
    en: 'Choose the language for the user interface and AI-generated summaries.',
    hi: 'यूज़र इंटरफ़ेस और एआई-जनित सारांश के लिए भाषा चुनें।'
  },
  fontSizeLabel: {
    en: 'Font Size Adjustment',
    hi: 'फ़ॉन्ट आकार समायोजन'
  },
  fontSizeDesc: {
    en: 'Scale all application text for improved legibility.',
    hi: 'बेहतर पठनीयता के लिए सभी एप्लिकेशन टेक्स्ट को स्केल करें।'
  },
  sizeSmall: {
    en: 'Small',
    hi: 'छोटा'
  },
  sizeNormal: {
    en: 'Normal',
    hi: 'सामान्य'
  },
  sizeLarge: {
    en: 'Large',
    hi: 'बड़ा'
  },
  sizeXLarge: {
    en: 'Extra Large',
    hi: 'बहुत बड़ा'
  },
  highContrastLabel: {
    en: 'High Contrast Mode',
    hi: 'उच्च कंट्रास्ट मोड'
  },
  highContrastDesc: {
    en: 'Increase contrast of text and structural components for readability.',
    hi: 'पठनीयता के लिए टेक्स्ट और संरचनात्मक घटकों के कंट्रास्ट को बढ़ाएं।'
  },
  reducedMotionLabel: {
    en: 'Reduced Motion',
    hi: 'कम गति (Reduced Motion)'
  },
  reducedMotionDesc: {
    en: 'Disable or minimize layout animations and smooth transitions.',
    hi: 'लेआउट एनिमेशन और सहज बदलावों को अक्षम या कम करें।'
  },
  colorBlindLabel: {
    en: 'Color Vision Mode',
    hi: 'रंग दृष्टि मोड'
  },
  colorBlindDesc: {
    en: 'Adjust color palettes for color vision deficiencies or grayscale viewing.',
    hi: 'रंग दृष्टि दोषों या ग्रेस्केल देखने के लिए रंग पट्टियों को समायोजित करें।'
  },
  cbNone: {
    en: 'None (Standard)',
    hi: 'कोई नहीं (मानक)'
  },
  cbGrayscale: {
    en: 'Grayscale (Monochrome)',
    hi: 'ग्रेस्केल (एक रंग)'
  },
  cbProtanopia: {
    en: 'Protanopia (Red-blind helper)',
    hi: 'प्रोटानोपिया (लाल-अंधा सहायक)'
  },
  cbDeuteranopia: {
    en: 'Deuteranopia (Green-blind helper)',
    hi: 'ड्यूटेरानोपिया (हरा-अंधा सहायक)'
  },
  cbTritanopia: {
    en: 'Tritanopia (Blue-blind helper)',
    hi: 'ट्रिटानोपिया (नीला-अंधा सहायक)'
  },
  keyboardGuideTitle: {
    en: 'Keyboard Navigation Guide',
    hi: 'कीबोर्ड नेविगेशन गाइड'
  },
  keyboardGuideDesc: {
    en: 'Use the following standard shortcuts to navigate CivicPilot:',
    hi: 'CivicPilot को नेविगेट करने के लिए निम्नलिखित मानक शॉर्टकट का उपयोग करें:'
  },
  kbTab: {
    en: 'Tab / Shift+Tab',
    hi: 'टैब / शिफ्ट+टैब'
  },
  kbTabDesc: {
    en: 'Navigate through interactive buttons and form inputs sequentially.',
    hi: 'अनुक्रमिक रूप से इंटरैक्टिव बटन और फ़ॉर्म इनपुट के माध्यम से नेविगेट करें।'
  },
  kbEnter: {
    en: 'Enter / Spacebar',
    hi: 'एंटर / स्पेसबार'
  },
  kbEnterDesc: {
    en: 'Activate selected button, option, or expand incident dossiers.',
    hi: 'चयनित बटन, विकल्प को सक्रिय करें या घटना के दस्तावेजों का विस्तार करें।'
  },
  kbEscape: {
    en: 'Escape (Esc)',
    hi: 'एस्केप (Esc)'
  },
  kbEscapeDesc: {
    en: 'Close duplicate checking dialogs, alerts, or return to dashboards.',
    hi: 'डुप्लिकेट चेकिंग डायलॉग्स, अलर्ट बंद करें या डैशबोर्ड पर वापस आएं।'
  },

  // Voice Accessibility Section
  voiceAccTitle: {
    en: 'Voice Accessibility Support',
    hi: 'आवाज सुगमता सहायता'
  },
  voiceAccDesc: {
    en: 'Speak to input reports and listen to synthesized reports using AI Text-to-Speech.',
    hi: 'रिपोर्ट इनपुट करने के लिए बोलें और एआई टेक्स्ट-टू-स्पीच का उपयोग करके संश्लेषित रिपोर्ट सुनें।'
  },
  speakIssueLabel: {
    en: 'Vocal Telemetry Recording',
    hi: 'वॉयस टेलीमेट्री रिकॉर्डिंग'
  },
  speakIssueDesc: {
    en: 'Click "Link Voice Context" on the reporting form and speak to dictate your report description automatically.',
    hi: 'रिपोर्टिंग फॉर्म पर "लिंक वॉयस कॉन्टेक्स्ट" पर क्लिक करें और अपने रिपोर्ट विवरण को स्वचालित रूप से डिक्टेट करने के लिए बोलें।'
  },
  listenReportLabel: {
    en: 'Text-to-Speech (TTS) Narrations',
    hi: 'टेक्स्ट-टू-स्पीच (TTS) वर्णन'
  },
  listenReportDesc: {
    en: 'Listen to the AI summaries and case dossiers in your active language by clicking the "Listen" button inside generated dossiers.',
    hi: 'उत्पन्न डोजियर के अंदर "सुनें" बटन पर क्लिक करके अपनी सक्रिय भाषा में एआई सारांश और केस डोजियर सुनें।'
  },

  // Report Issue Form Translations
  incidentTitleLabel: {
    en: 'Incident Title',
    hi: 'घटना का शीर्षक'
  },
  incidentTitlePlaceholder: {
    en: 'e.g. Broken Water Main on Central Blvd',
    hi: 'जैसे: सेंट्रल ब्लाव्ड पर टूटा हुआ मुख्य जल पाइप'
  },
  operationalCategoryLabel: {
    en: 'Operational Category',
    hi: 'परिचालन श्रेणी'
  },
  initialUrgencyLabel: {
    en: 'Initial Urgency Tag',
    hi: 'प्रारंभिक तात्कालिकता टैग'
  },
  multimodalDescLabel: {
    en: 'Multimodal Description & Damage Logs',
    hi: 'बहुविध विवरण और क्षति लॉग'
  },
  multimodalDescPlaceholder: {
    en: 'Describe what you see. Detail active hazards, safety implications, water levels, structural degradation indicators...',
    hi: 'जो आप देखते हैं उसका वर्णन करें। सक्रिय खतरों, सुरक्षा निहितार्थों, जल स्तर, संरचनात्मक गिरावट संकेतकों का विवरण दें...'
  },
  simulatedLocationLabel: {
    en: 'Simulated Geocode Node Address',
    hi: 'सिम्युलेटेड जियोकोड नोड पता'
  },
  evidenceCaptureLabel: {
    en: 'High-Resolution Evidence Capture',
    hi: 'उच्च-रिज़ॉल्यूशन साक्ष्य कैप्चर'
  },
  evidenceLinkedMsg: {
    en: 'Evidence Linked',
    hi: 'साक्ष्य लिंक किया गया'
  },
  evidenceDragDrop: {
    en: 'Drag & Drop image here, or browse files',
    hi: 'यहां इमेज ड्रैग और ड्रॉप करें, या फाइलें ब्राउज़ करें'
  },
  evidenceFormats: {
    en: 'Supports JPG, PNG, WEBP (Recommended: raw photo of asset damage)',
    hi: 'JPG, PNG, WEBP का समर्थन करता है (अनुशंसित: संपत्ति क्षति की वास्तविक तस्वीर)'
  },
  btnDeployOrchestrator: {
    en: 'Deploy AI Agent Orchestrator',
    hi: 'एआई एजेंट ऑर्केस्ट्रेटर तैनात करें'
  },
  vocalTelemetryTitle: {
    en: 'Multimodal Voice Transcript',
    hi: 'बहुविध वॉयस ट्रांसक्रिप्ट'
  },
  vocalTelemetryDesc: {
    en: 'Record vocal context report live on scene. CivicPilot transforms audio into validated telemetry records.',
    hi: 'घटना स्थल पर लाइव वॉयस रिपोर्ट रिकॉर्ड करें। सिविकपायलट ऑडियो को सत्यापित टेलीमेट्री रिकॉर्ड में बदल देता है।'
  },
  voiceRecordReady: {
    en: 'Voice Capture Ready',
    hi: 'वॉयस कैप्चर तैयार है'
  },
  voiceNoAudio: {
    en: 'No audio linked to report',
    hi: 'रिपोर्ट से कोई ऑडियो लिंक नहीं है'
  },
  btnLinkVoice: {
    en: 'Link Voice Context',
    hi: 'वॉयस संदर्भ लिंक करें'
  },
  btnStopRecording: {
    en: 'Stop Recording',
    hi: 'रिकॉर्डिंग रोकें'
  },
  quickPresetsTitle: {
    en: 'Quick Incident Presets',
    hi: 'त्वरित घटना प्रीसेट'
  },
  quickPresetsDesc: {
    en: 'Instantly load structured data blueprints to explore different multi-agent pipeline results.',
    hi: 'विभिन्न मल्टी-एजेंट पाइपलाइन परिणामों का पता लगाने के लिए तुरंत संरचित डेटा ब्लूप्रिंट लोड करें।'
  },

  // Generated Case Dossier Translations
  selectedFile: {
    en: 'Selected File',
    hi: 'चयनित फ़ाइल'
  },
  switchDocket: {
    en: 'SWITCH_DOCKET',
    hi: 'डोजियर_बदलें'
  },
  cognitiveSynthesis: {
    en: 'Cognitive Synthesis',
    hi: 'संज्ञानात्मक संश्लेषण'
  },
  incidentAssets: {
    en: 'Incident Assets',
    hi: 'घटना की संपत्तियां'
  },
  noPhotoAttached: {
    en: 'No photo attachments linked',
    hi: 'कोई फोटो अटैचमेंट लिंक नहीं है'
  },
  exportTxtBtn: {
    en: 'Export TXT',
    hi: 'TXT निर्यात करें'
  },
  exportPdfBtn: {
    en: 'Export PDF',
    hi: 'PDF निर्यात करें'
  },
  emergencyDispatchHeader: {
    en: 'Municipal Emergency Dispatch',
    hi: 'नगरपालिका आपातकालीन प्रेषण'
  },
  docketAnchorsHeader: {
    en: '1. Incident Geographic Anchors',
    hi: '1. घटना भौगोलिक एंकर'
  },
  evidenceLogHeader: {
    en: '2. Raw Evidence Log Transcript',
    hi: '2. कच्चा साक्ष्य लॉग ट्रांसक्रिप्ट'
  },
  citizenImpactHeader: {
    en: '3. Citizen Impact & Routing Analysis',
    hi: '3. नागरिक प्रभाव और रूटिंग विश्लेषण'
  },
  mitigationStepsHeader: {
    en: '4. Auto-Synthesized Tactical Mitigation Steps',
    hi: '4. ऑटो-संश्लेषित सामरिक शमन कदम'
  },
  blockchainCert: {
    en: 'BLOCKCHAIN_CERTIFICATE_HASH',
    hi: 'ब्लॉकचेन_प्रमाणपत्र_हैश'
  },
  apiSynced: {
    en: '✓ API SYNCED TO CITYWORKS',
    hi: '✓ एपीआई सिटीवर्क्स के साथ सिंक हो गया है'
  },
  auditCompliant: {
    en: 'AUTONOMOUS AUDIT COMPLIANT',
    hi: 'स्वायत्त ऑडिट अनुपालन'
  },

  // TTS buttons
  btnListen: {
    en: 'Listen to Summary',
    hi: 'सारांश सुनें'
  },
  btnStopListening: {
    en: 'Stop Listening',
    hi: 'सुनना बंद करें'
  },
  btnReplay: {
    en: 'Replay Summary',
    hi: 'सारांश पुन: चलाएं'
  },

  // Smart translation indicators
  translatingIndicator: {
    en: 'AI Translating...',
    hi: 'एआई अनुवाद कर रहा है...'
  },
  translationComplete: {
    en: 'Translation Complete',
    hi: 'अनुवाद पूरा हुआ'
  }
};

export function getTranslation(key: string, lang: Language): string {
  const item = UI_TRANSLATIONS[key];
  if (!item) return key;
  return item[lang] || item['en'];
}
