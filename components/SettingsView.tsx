
import React, { useState, useEffect } from 'react';
import { AppTheme, AppFontSize, AppLanguage, TRANSLATIONS } from '../types';

interface SettingsViewProps {
  onBack: () => void;
  clearHistory: () => void;
  saveToGallery: boolean;
  setSaveToGallery: (val: boolean) => void;
  highResAudio: boolean;
  setHighResAudio: (val: boolean) => void;
  historyCount?: number;
  theme: AppTheme;
  setTheme: (t: AppTheme) => void;
  fontSize: AppFontSize;
  setFontSize: (s: AppFontSize) => void;
  language: AppLanguage;
  setLanguage: (l: AppLanguage) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({ 
    onBack, 
    clearHistory,
    saveToGallery,
    setSaveToGallery,
    highResAudio,
    setHighResAudio,
    historyCount = 0,
    theme,
    setTheme,
    fontSize,
    setFontSize,
    language,
    setLanguage
}) => {
  const [confirmDelete, setConfirmDelete] = useState(false);
  const isDark = theme === 'dark';
  const t = TRANSLATIONS[language].settings;

  useEffect(() => {
      let timeout: ReturnType<typeof setTimeout>;
      if (confirmDelete) {
          timeout = setTimeout(() => setConfirmDelete(false), 3000);
      }
      return () => clearTimeout(timeout);
  }, [confirmDelete]);

  const handleClearClick = () => {
      if (confirmDelete) {
          clearHistory();
          setConfirmDelete(false);
      } else {
          setConfirmDelete(true);
      }
  };

  // Theme-based class helpers
  const bgClass = isDark ? 'bg-black' : 'bg-gray-50';
  const textClass = isDark ? 'text-white' : 'text-gray-900';
  const subTextClass = isDark ? 'text-gray-400' : 'text-gray-500';
  const borderClass = isDark ? 'border-gray-800' : 'border-gray-200';
  const hoverTextClass = isDark ? 'hover:text-white' : 'hover:text-black';
  const iconClass = isDark ? 'text-gray-400' : 'text-gray-500';

  const languages: {code: AppLanguage, label: string}[] = [
      { code: 'en', label: 'English' },
      { code: 'zh', label: '简体中文' },
      { code: 'ja', label: '日本語' },
      { code: 'es', label: 'Español' },
      { code: 'fr', label: 'Français' },
  ];

  return (
    <div className={`absolute inset-0 z-50 flex flex-col h-full animate-fade-in ${bgClass} ${textClass}`}>
      {/* Header - Fixed */}
      <div className="flex items-center p-6 pb-4 shrink-0">
        <button onClick={onBack} className={`p-2 -ml-2 ${iconClass} ${hoverTextClass}`}>
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
        </button>
        <h1 className="text-2xl font-light ml-4">{t.title}</h1>
      </div>

      {/* Scrollable Content */}
      <div className="flex-1 overflow-y-auto no-scrollbar">
        <div className="p-6 pt-2 flex flex-col min-h-full space-y-8">
            
            {/* Language Section */}
            <div className="space-y-4">
                <h2 className={`text-sm font-bold uppercase tracking-wider ${subTextClass}`}>{t.language}</h2>
                <div className="grid grid-cols-2 gap-3">
                    {languages.map((lang) => (
                         <button 
                            key={lang.code}
                            onClick={() => setLanguage(lang.code)} 
                            className={`p-3 rounded-xl border text-sm font-medium transition-all duration-200 ${language === lang.code ? (isDark ? 'bg-white/10 border-white text-white' : 'bg-indigo-50 border-indigo-500 text-indigo-900') : `${borderClass} ${subTextClass}`}`}
                        >
                            {lang.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Appearance Section */}
            <div className="space-y-4">
                <h2 className={`text-sm font-bold uppercase tracking-wider ${subTextClass}`}>{t.appearance}</h2>
                
                {/* Theme Toggle */}
                <div className="grid grid-cols-2 gap-4">
                    <button 
                        onClick={() => setTheme('dark')} 
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-200 ${theme === 'dark' ? 'border-white bg-white/10 ring-1 ring-white/50' : `${borderClass} ${isDark ? 'bg-gray-900' : 'bg-white text-gray-500'}`}`}
                    >
                        <div className="w-6 h-6 rounded-full bg-gray-900 border border-gray-700 shadow-sm"></div>
                        <span className="text-sm font-medium">{t.midnight}</span>
                    </button>
                    <button 
                        onClick={() => setTheme('light')} 
                        className={`p-4 rounded-xl border flex flex-col items-center justify-center gap-2 transition-all duration-200 ${theme === 'light' ? 'border-indigo-500 bg-indigo-50 text-indigo-900 ring-1 ring-indigo-500' : `${borderClass} ${isDark ? 'bg-gray-900 text-gray-400' : 'bg-white text-gray-500'}`}`}
                    >
                        <div className="w-6 h-6 rounded-full bg-white border border-gray-200 shadow-sm"></div>
                        <span className="text-sm font-medium">{t.porcelain}</span>
                    </button>
                </div>

                {/* Font Size Toggle */}
                <div className={`flex items-center justify-between p-2 rounded-xl border ${borderClass} ${isDark ? 'bg-gray-900' : 'bg-white'}`}>
                    <button
                        onClick={() => setFontSize('small')}
                        className={`flex-1 py-3 rounded-lg text-xs font-medium transition-all duration-200 ${fontSize === 'small' ? (isDark ? 'bg-white/10 text-white shadow-sm' : 'bg-gray-100 text-gray-900 shadow-sm') : subTextClass}`}
                    >
                        Aa
                    </button>
                    <div className={`w-px h-6 ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                    <button
                        onClick={() => setFontSize('medium')}
                        className={`flex-1 py-3 rounded-lg text-base font-medium transition-all duration-200 ${fontSize === 'medium' ? (isDark ? 'bg-white/10 text-white shadow-sm' : 'bg-gray-100 text-gray-900 shadow-sm') : subTextClass}`}
                    >
                        Aa
                    </button>
                    <div className={`w-px h-6 ${isDark ? 'bg-gray-800' : 'bg-gray-200'}`}></div>
                    <button
                        onClick={() => setFontSize('large')}
                        className={`flex-1 py-3 rounded-lg text-xl font-medium transition-all duration-200 ${fontSize === 'large' ? (isDark ? 'bg-white/10 text-white shadow-sm' : 'bg-gray-100 text-gray-900 shadow-sm') : subTextClass}`}
                    >
                        Aa
                    </button>
                </div>
            </div>

            {/* Preferences Section */}
            <div className="space-y-4">
            <h2 className={`text-sm font-bold uppercase tracking-wider ${subTextClass}`}>{t.preferences}</h2>
            
            {/* Save Photos to Gallery */}
            <div 
                onClick={() => setSaveToGallery(!saveToGallery)}
                className={`flex items-center justify-between py-4 border-b cursor-pointer transition-colors ${borderClass} ${isDark ? 'active:bg-gray-900' : 'active:bg-gray-100'}`}
            >
                <span className="text-lg font-light">{t.saveGallery}</span>
                <div 
                    className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${saveToGallery ? 'bg-green-500' : isDark ? 'bg-gray-700' : 'bg-gray-300'}`}
                >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${saveToGallery ? 'left-[calc(100%-1.25rem)]' : 'left-1'}`}></div>
                </div>
            </div>

            {/* High-Res Audio */}
            <div 
                onClick={() => setHighResAudio(!highResAudio)}
                className={`flex items-center justify-between py-4 border-b cursor-pointer transition-colors ${borderClass} ${isDark ? 'active:bg-gray-900' : 'active:bg-gray-100'}`}
            >
                <div className="flex flex-col">
                    <span className="text-lg font-light">{t.highResAudio}</span>
                    <span className={`text-xs ${subTextClass}`}>{t.highResDesc}</span>
                </div>
                <div 
                    className={`w-12 h-6 rounded-full relative transition-colors duration-200 ${highResAudio ? 'bg-green-500' : isDark ? 'bg-gray-700' : 'bg-gray-300'}`}
                >
                    <div className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-all duration-200 ${highResAudio ? 'left-[calc(100%-1.25rem)]' : 'left-1'}`}></div>
                </div>
            </div>
            </div>

            {/* Data Section */}
            <div className="space-y-4">
            <h2 className={`text-sm font-bold uppercase tracking-wider ${subTextClass}`}>{t.data}</h2>
            <button 
                onClick={handleClearClick}
                disabled={historyCount === 0}
                className={`w-full py-4 border rounded-xl transition-all shadow-lg duration-200 font-medium
                    ${confirmDelete
                        ? 'border-red-600 bg-red-600 text-white shadow-red-900/40 scale-[1.02]' 
                        : historyCount === 0 
                            ? `${borderClass} ${subTextClass} cursor-not-allowed`
                            : `${isDark ? 'border-red-900 bg-black' : 'border-red-200 bg-red-50'} text-red-500 hover:bg-red-500/10`
                    }
                `}
            >
                {confirmDelete ? t.confirmClear : t.clearHistory}
            </button>
            {historyCount > 0 && (
                <p className={`text-center text-xs ${subTextClass}`}>{historyCount} {t.itemsInStorage}</p>
            )}
            </div>

            <div className={`mt-auto pt-10 text-center text-sm ${subTextClass}`}>
                <p>Context Lens v1.4.0</p>
                <p>Powered by Gemini 2.0 Flash</p>
            </div>
        </div>
      </div>
    </div>
  );
};
