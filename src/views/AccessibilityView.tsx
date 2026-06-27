import { useState } from 'react';
import { 
  Type, 
  Eye, 
  Volume2, 
  Sparkles, 
  Globe, 
  Keyboard, 
  Zap, 
  Check, 
  CheckCircle2,
  Sliders,
  HelpCircle
} from 'lucide-react';
import { Language, getTranslation } from '../utils/i18n';

interface AccessibilityViewProps {
  language: Language;
  onLanguageChange: (lang: Language) => void;
  fontSize: 'sm' | 'base' | 'lg' | 'xl';
  onFontSizeChange: (size: 'sm' | 'base' | 'lg' | 'xl') => void;
  highContrast: boolean;
  onHighContrastChange: (val: boolean) => void;
  reducedMotion: boolean;
  onReducedMotionChange: (val: boolean) => void;
  colorBlindMode: 'none' | 'grayscale' | 'protanopia' | 'deuteranopia' | 'tritanopia';
  onColorBlindModeChange: (mode: 'none' | 'grayscale' | 'protanopia' | 'deuteranopia' | 'tritanopia') => void;
}

export default function AccessibilityView({
  language,
  onLanguageChange,
  fontSize,
  onFontSizeChange,
  highContrast,
  onHighContrastChange,
  reducedMotion,
  onReducedMotionChange,
  colorBlindMode,
  onColorBlindModeChange
}: AccessibilityViewProps) {
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState('');

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const t = (key: string) => getTranslation(key, language);

  return (
    <div id="accessibility-view" className="space-y-8 pb-12 relative transition-colors duration-300">
      {/* Toast alert */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 bg-white dark:bg-[#0A0A0A] border border-indigo-500/30 rounded-2xl p-4 shadow-xl flex items-center gap-3 animate-bounce">
          <div className="p-2 bg-indigo-50 dark:bg-indigo-500/10 rounded-xl text-indigo-600 dark:text-indigo-400">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <p className="text-xs font-bold text-slate-800 dark:text-white font-mono">SETTINGS_UPDATED</p>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{toastMsg}</p>
          </div>
        </div>
      )}

      {/* Main card */}
      <div className="p-6 md:p-8 rounded-3xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-950/40 shadow-sm transition-colors relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-indigo-500 via-violet-500 to-indigo-500"></div>

        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 rounded-2xl bg-indigo-50 dark:bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-500/20">
            <Sliders className="w-6 h-6" />
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white font-display">
              {t('accessibilityTitle')}
            </h3>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              {t('accessibilitySub')}
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 border-t border-slate-100 dark:border-slate-900/60 pt-8">
          
          {/* Left Column - Display & Controls */}
          <div className="space-y-6">
            
            {/* Language Selection Card */}
            <div className="p-5 rounded-2xl border border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 hover:border-slate-200 dark:hover:border-slate-700 transition-all">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Globe className="w-4 h-4 text-indigo-500" />
                    {t('languageSelection')}
                  </h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {t('langDesc')}
                  </p>
                </div>
              </div>
              <div className="flex gap-3 mt-4">
                <button
                  type="button"
                  id="btn-lang-en"
                  onClick={() => {
                    onLanguageChange('en');
                    triggerToast('Application language changed to English.');
                  }}
                  className={`flex-1 py-3 px-4 text-xs font-semibold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    language === 'en'
                      ? 'bg-indigo-600 border-indigo-600 text-white font-bold shadow-md shadow-indigo-600/15'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  {language === 'en' && <Check className="w-3.5 h-3.5" />}
                  <span>English (EN)</span>
                </button>
                <button
                  type="button"
                  id="btn-lang-hi"
                  onClick={() => {
                    onLanguageChange('hi');
                    triggerToast('एप्लिकेशन की भाषा हिंदी में बदली गई।');
                  }}
                  className={`flex-1 py-3 px-4 text-xs font-semibold rounded-xl border transition-all cursor-pointer flex items-center justify-center gap-2 ${
                    language === 'hi'
                      ? 'bg-indigo-600 border-indigo-600 text-white font-bold shadow-md shadow-indigo-600/15'
                      : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-450 hover:bg-slate-50 dark:hover:bg-slate-850'
                  }`}
                >
                  {language === 'hi' && <Check className="w-3.5 h-3.5" />}
                  <span>हिंदी (Hindi - HI)</span>
                </button>
              </div>
            </div>

            {/* Font Sizing Controls */}
            <div className="p-5 rounded-2xl border border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 hover:border-slate-200 dark:hover:border-slate-700 transition-all">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Type className="w-4 h-4 text-indigo-500" />
                  {t('fontSizeLabel')}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t('fontSizeDesc')}
                </p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mt-4">
                {(['sm', 'base', 'lg', 'xl'] as const).map((size) => {
                  const sizeLabels = {
                    sm: t('sizeSmall'),
                    base: t('sizeNormal'),
                    lg: t('sizeLarge'),
                    xl: t('sizeXLarge')
                  };
                  return (
                    <button
                      type="button"
                      key={size}
                      id={`btn-font-size-${size}`}
                      onClick={() => {
                        onFontSizeChange(size);
                        triggerToast(`Font size scaled to ${sizeLabels[size]}.`);
                      }}
                      className={`py-2 px-3 text-[11px] font-semibold rounded-xl capitalize border transition-all cursor-pointer text-center ${
                        fontSize === size
                          ? 'bg-indigo-600 border-indigo-600 text-white font-bold shadow-sm shadow-indigo-600/10'
                          : 'bg-white dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-850'
                      }`}
                    >
                      {sizeLabels[size]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Color Blindness Friendly Dropdown */}
            <div className="p-5 rounded-2xl border border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 hover:border-slate-200 dark:hover:border-slate-700 transition-all">
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                  <Eye className="w-4 h-4 text-indigo-500" />
                  {t('colorBlindLabel')}
                </h4>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  {t('colorBlindDesc')}
                </p>
              </div>

              <select
                id="select-color-blind"
                value={colorBlindMode}
                onChange={(e) => {
                  const mode = e.target.value as any;
                  onColorBlindModeChange(mode);
                  triggerToast(`Color vision mode updated.`);
                }}
                className="w-full mt-4 px-4 py-3 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-xs text-slate-750 dark:text-slate-250 outline-none cursor-pointer focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
              >
                <option value="none">{t('cbNone')}</option>
                <option value="grayscale">{t('cbGrayscale')}</option>
                <option value="protanopia">{t('cbProtanopia')}</option>
                <option value="deuteranopia">{t('cbDeuteranopia')}</option>
                <option value="tritanopia">{t('cbTritanopia')}</option>
              </select>
            </div>

          </div>

          {/* Right Column - Switches and Guides */}
          <div className="space-y-6">
            
            {/* High Contrast and Reduced Motion Switches */}
            <div className="p-5 rounded-2xl border border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10 space-y-6">
              
              {/* High Contrast Mode Toggle */}
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1 pr-4">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Zap className="w-4 h-4 text-indigo-500" />
                    {t('highContrastLabel')}
                  </h4>
                  <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
                    {t('highContrastDesc')}
                  </p>
                </div>
                <button
                  type="button"
                  id="toggle-high-contrast"
                  onClick={() => {
                    onHighContrastChange(!highContrast);
                    triggerToast(`High Contrast mode ${!highContrast ? 'enabled' : 'disabled'}.`);
                  }}
                  className={`w-12 h-6 flex items-center rounded-full p-0.5 cursor-pointer shrink-0 transition-colors ${
                    highContrast ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-800'
                  }`}
                  aria-checked={highContrast}
                  role="switch"
                  aria-label={t('highContrastLabel')}
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                      highContrast ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

              <div className="h-px bg-slate-150 dark:bg-slate-800/80"></div>

              {/* Reduced Motion Toggle */}
              <div className="flex items-center justify-between gap-4">
                <div className="space-y-1 pr-4">
                  <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-indigo-500" />
                    {t('reducedMotionLabel')}
                  </h4>
                  <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed">
                    {t('reducedMotionDesc')}
                  </p>
                </div>
                <button
                  type="button"
                  id="toggle-reduced-motion"
                  onClick={() => {
                    onReducedMotionChange(!reducedMotion);
                    triggerToast(`Reduced Motion ${!reducedMotion ? 'enabled' : 'disabled'}.`);
                  }}
                  className={`w-12 h-6 flex items-center rounded-full p-0.5 cursor-pointer shrink-0 transition-colors ${
                    reducedMotion ? 'bg-indigo-600' : 'bg-slate-300 dark:bg-slate-800'
                  }`}
                  aria-checked={reducedMotion}
                  role="switch"
                  aria-label={t('reducedMotionLabel')}
                >
                  <div
                    className={`bg-white w-5 h-5 rounded-full shadow-md transform transition-transform duration-300 ${
                      reducedMotion ? 'translate-x-6' : 'translate-x-0'
                    }`}
                  />
                </button>
              </div>

            </div>

            {/* Keyboard Guide Section */}
            <div className="p-5 rounded-2xl border border-slate-150 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/10">
              <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-3">
                <Keyboard className="w-4 h-4 text-indigo-500" />
                {t('keyboardGuideTitle')}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">
                {t('keyboardGuideDesc')}
              </p>

              <div className="space-y-3.5 text-xs">
                <div className="flex gap-3">
                  <span className="font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-1 rounded shrink-0 h-fit text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {t('kbTab')}
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {t('kbTabDesc')}
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-1 rounded shrink-0 h-fit text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {t('kbEnter')}
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {t('kbEnterDesc')}
                  </p>
                </div>

                <div className="flex gap-3">
                  <span className="font-mono bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-2 py-1 rounded shrink-0 h-fit text-[11px] font-bold text-slate-700 dark:text-slate-300">
                    {t('kbEscape')}
                  </span>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    {t('kbEscapeDesc')}
                  </p>
                </div>
              </div>
            </div>

          </div>

        </div>

        {/* Voice Accessibility Helper Information */}
        <div className="mt-8 border-t border-slate-100 dark:border-slate-900/60 pt-8">
          <div className="p-5 rounded-2xl border border-dashed border-slate-200 dark:border-slate-800 bg-indigo-50/20 dark:bg-indigo-500/5">
            <h4 className="text-sm font-semibold text-slate-900 dark:text-white flex items-center gap-2 mb-2">
              <Volume2 className="w-4 h-4 text-indigo-500" />
              {t('voiceAccTitle')}
            </h4>
            <p className="text-xs text-slate-550 dark:text-slate-400 leading-relaxed mb-4">
              {t('voiceAccDesc')}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs mt-4">
              <div className="space-y-1 bg-white/40 dark:bg-slate-950/20 p-3.5 rounded-xl border border-slate-100 dark:border-slate-900">
                <h5 className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                  🎤 {t('speakIssueLabel')}
                </h5>
                <p className="text-slate-500 leading-relaxed mt-1">
                  {t('speakIssueDesc')}
                </p>
              </div>
              <div className="space-y-1 bg-white/40 dark:bg-slate-950/20 p-3.5 rounded-xl border border-slate-100 dark:border-slate-900">
                <h5 className="font-bold text-indigo-600 dark:text-indigo-400 font-mono">
                  🔊 {t('listenReportLabel')}
                </h5>
                <p className="text-slate-500 leading-relaxed mt-1">
                  {t('listenReportDesc')}
                </p>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
