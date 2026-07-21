import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { Search, Mic, MicOff, Pill, Activity, AlertTriangle, FileText, CheckCircle, ArrowRight } from 'lucide-react';
import api from '../services/api';

export const Home: React.FC = () => {
  const { t, language } = useLanguage();
  const navigate = useNavigate();
  
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isListening, setIsListening] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);
  
  const searchContainerRef = useRef<HTMLDivElement>(null);
  const recognitionRef = useRef<any>(null);

  // Close suggestions on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchContainerRef.current && !searchContainerRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Fetch search suggestions
  useEffect(() => {
    const delayDebounce = setTimeout(async () => {
      if (query.trim().length >= 2) {
        try {
          const response = await api.get(`/search?q=${encodeURIComponent(query)}&lang=${language}`);
          setSuggestions(response.data.suggestions || []);
        } catch (error) {
          console.error('Error fetching suggestions:', error);
        }
      } else {
        setSuggestions([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounce);
  }, [query, language]);

  // Initialize Speech Recognition
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (SpeechRecognition) {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      
      // Map app language context to Speech Recognition locale
      const localeMap = { en: 'en-US', hi: 'hi-IN', te: 'te-IN' };
      rec.lang = localeMap[language] || 'en-US';

      rec.onstart = () => {
        setIsListening(true);
      };

      rec.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setQuery(transcript);
        // Auto navigate to search page on voice return
        setTimeout(() => {
          navigate(`/search?q=${encodeURIComponent(transcript)}`);
        }, 800);
      };

      rec.onerror = (e: any) => {
        console.error('Speech recognition error:', e);
        setIsListening(false);
      };

      rec.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = rec;
    }
  }, [language, navigate]);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert('Speech Recognition is not supported by your current browser. Please try Google Chrome.');
      return;
    }

    if (isListening) {
      recognitionRef.current.stop();
    } else {
      // Set lang again in case it changed
      const localeMap = { en: 'en-US', hi: 'hi-IN', te: 'te-IN' };
      recognitionRef.current.lang = localeMap[language] || 'en-US';
      recognitionRef.current.start();
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      navigate(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  const handleSuggestionClick = (sug: string) => {
    setQuery(sug);
    setShowSuggestions(false);
    navigate(`/search?q=${encodeURIComponent(sug)}`);
  };

  const categories = [
    { title: t('prescription'), icon: Pill, color: 'from-blue-500 to-indigo-600', path: '/upload' },
    { title: t('labReport'), icon: Activity, color: 'from-teal-500 to-emerald-600', path: '/upload' },
    { title: t('bill'), icon: FileText, color: 'from-purple-500 to-pink-600', path: '/upload' },
    { title: 'Diseases Directory', icon: AlertTriangle, color: 'from-amber-500 to-orange-600', path: '/search?q=Diabetes' }
  ];

  return (
    <div className="flex flex-col gap-16 py-4">
      {/* Hero Header Section */}
      <div className="text-center max-w-4xl mx-auto flex flex-col items-center gap-6 mt-4">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-brand-50 dark:bg-brand-950/30 rounded-full border border-brand-100 dark:border-brand-900 text-xs font-bold text-brand-600 dark:text-brand-400">
          <CheckCircle size={14} />
          MediPlain AI Engine Active
        </div>
        <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
          {t('heroTitle')}
        </h1>
        <p className="text-sm sm:text-base text-slate-500 dark:text-slate-400 leading-relaxed max-w-2xl">
          {t('heroSubtitle')}
        </p>

        {/* Dynamic Search Box */}
        <div className="w-full max-w-2xl relative mt-4" ref={searchContainerRef}>
          <form onSubmit={handleSearchSubmit} className="flex gap-2">
            <div className="relative flex-1">
              <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 pointer-events-none">
                <Search size={20} />
              </span>
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                placeholder={t('searchPlaceholder')}
                className="w-full pl-12 pr-12 py-3.5 sm:py-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-800 dark:text-white shadow-xl shadow-slate-100 dark:shadow-none focus:outline-none focus:ring-4 focus:ring-brand-500/10 focus:border-brand-500 transition-all text-sm sm:text-base font-medium"
              />
              
              {/* Mic Icon Button */}
              <button
                type="button"
                onClick={toggleListening}
                title={t('voiceSearchTooltip')}
                className={`absolute inset-y-0 right-0 pr-4 flex items-center transition ${
                  isListening 
                    ? 'text-medical-rose animate-pulse scale-110' 
                    : 'text-slate-400 hover:text-brand-500'
                }`}
              >
                {isListening ? <Mic size={22} /> : <MicOff size={20} />}
              </button>
            </div>
            <button
              type="submit"
              className="px-6 rounded-2xl bg-brand-500 hover:bg-brand-600 text-white font-bold transition shadow-md shadow-brand-500/20 active:scale-95 flex items-center gap-1.5 text-sm sm:text-base"
            >
              <span>{t('search')}</span>
            </button>
          </form>

          {/* Suggestions Dropdown panel */}
          {showSuggestions && suggestions.length > 0 && (
            <div className="absolute left-0 right-0 mt-2 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl shadow-2xl py-2 overflow-hidden z-30">
              {suggestions.map((sug, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(sug)}
                  className="w-full text-left px-5 py-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/80 text-xs sm:text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors flex items-center gap-2"
                >
                  <Search size={14} className="text-slate-400" />
                  {sug}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Categories Grid shortcuts */}
      <div className="max-w-6xl mx-auto w-full">
        <h3 className="text-center font-bold text-slate-800 dark:text-white text-lg sm:text-xl mb-8">
          Quick Portals & Analysis
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((cat, idx) => {
            const Icon = cat.icon;
            return (
              <button
                key={idx}
                onClick={() => navigate(cat.path)}
                className="group relative overflow-hidden rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-850 p-6 flex flex-col gap-4 text-left shadow-lg shadow-slate-100/50 dark:shadow-none hover:shadow-2xl hover:border-brand-500/30 dark:hover:border-brand-500/30 transition-all duration-300"
              >
                <div className={`h-12 w-12 rounded-xl bg-gradient-to-br ${cat.color} flex items-center justify-center text-white shadow-md shadow-brand-500/10`}>
                  <Icon size={22} />
                </div>
                <div>
                  <h4 className="font-extrabold text-sm sm:text-base text-slate-800 dark:text-white group-hover:text-brand-500 transition-colors">
                    {cat.title}
                  </h4>
                  <p className="text-[11px] sm:text-xs text-slate-400 dark:text-slate-500 mt-1">
                    Direct access to analysis portals
                  </p>
                </div>
                <div className="flex items-center gap-1 text-[11px] font-bold text-brand-500 group-hover:gap-2 transition-all mt-2">
                  Launch Portal
                  <ArrowRight size={12} />
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Feature Walkthroughs Section */}
      <div className="max-w-5xl mx-auto w-full grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 border-t border-slate-200/50 dark:border-slate-800/50">
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-sm text-brand-500 uppercase tracking-wider">{t('featureOCRTitle')}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{t('featureOCRDesc')}</p>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-sm text-brand-500 uppercase tracking-wider">{t('featureSearchTitle')}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{t('featureSearchDesc')}</p>
        </div>
        <div className="flex flex-col gap-3">
          <h4 className="font-bold text-sm text-brand-500 uppercase tracking-wider">{t('featureVoiceTitle')}</h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{t('featureVoiceDesc')}</p>
        </div>
      </div>
    </div>
  );
};
