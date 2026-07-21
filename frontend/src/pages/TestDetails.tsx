import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useSpeech } from '../hooks/useSpeech';
import { Activity, Volume2, VolumeX, Bookmark, BookmarkCheck, ArrowLeft, Loader2, Info, AlertCircle } from 'lucide-react';
import api from '../services/api';

export const TestDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { speak, stop, isPlaying } = useSpeech(language);

  const [loading, setLoading] = useState(true);
  const [test, setTest] = useState<any | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Fetch Test details
  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/tests/${id}?lang=${language}`);
        setTest(res.data.test);

        // Check bookmark
        if (isAuthenticated) {
          const bRes = await api.get('/users/bookmarks');
          setIsBookmarked(bRes.data.bookmarks.some((b: any) => b.itemId === id));
        }
      } catch (error) {
        console.error('Failed to fetch medical test details:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDetails();
  }, [id, language, isAuthenticated]);

  const handleBookmarkToggle = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (isBookmarked) {
        await api.delete('/users/bookmarks', { data: { itemType: 'test', itemId: id } });
        setIsBookmarked(false);
      } else {
        await api.post('/users/bookmarks', { itemType: 'test', itemId: id });
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('Bookmark error:', error);
    }
  };

  const handleVoiceReadout = () => {
    if (isPlaying) {
      stop();
    } else if (test) {
      let text = '';
      if (language === 'hi') {
        text = `परीक्षण का नाम: ${test.name}. इसका उद्देश्य: ${test.purpose}. सामान्य सीमा: ${test.normalRange}. उच्च मूल्य होने का अर्थ: ${test.highMeaning}.`;
      } else if (language === 'te') {
        text = `పరీక్ష పేరు: ${test.name}. దీని ఉద్దేశ్యం: ${test.purpose}. సాధారణ పరిమితి: ${test.normalRange}. అధిక విలువల అర్థం: ${test.highMeaning}.`;
      } else {
        text = `Medical test name: ${test.name}. Purpose: ${test.purpose}. Normal reference range: ${test.normalRange}. Meaning of high values: ${test.highMeaning}.`;
      }
      speak(text);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-2">
        <Loader2 className="animate-spin text-brand-500" size={32} />
        <span className="text-xs font-bold">Loading Diagnostic Profiles...</span>
      </div>
    );
  }

  if (!test) {
    return (
      <div className="max-w-md mx-auto text-center py-20 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6">
        <AlertCircle className="text-medical-rose mx-auto mb-4" size={32} />
        <h3 className="font-bold text-slate-800 dark:text-white">Diagnostic Test Not Found</h3>
        <p className="text-xs text-slate-400 mt-2">The requested laboratory profile could not be found.</p>
        <button onClick={() => navigate(-1)} className="mt-4 px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-lg text-xs font-bold transition">Go Back</button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto py-4">
      {/* Return link */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1 text-xs font-bold text-slate-500 hover:text-brand-500 transition mb-6"
      >
        <ArrowLeft size={14} />
        Back to Results
      </button>

      {/* Main card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl shadow-xl overflow-hidden p-6 sm:p-8 transition-colors duration-200">
        
        {/* Header Block */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center border-b border-slate-100 dark:border-slate-800/60 pb-6 mb-6 gap-4">
          <div className="flex items-start sm:items-center gap-4">
            <div className="h-14 w-14 rounded-2xl bg-teal-50 dark:bg-teal-950/20 flex items-center justify-center text-medical-teal shadow-inner">
              <Activity size={28} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">{test.name}</h2>
              <p className="text-xs text-slate-400 mt-1.5 font-semibold">
                Category: {test.category}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Speech Button */}
            <button
              onClick={handleVoiceReadout}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold border transition ${
                isPlaying 
                  ? 'bg-medical-rose/10 border-medical-rose/30 text-medical-rose'
                  : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 border-slate-200/65 dark:border-slate-700'
              }`}
            >
              {isPlaying ? <VolumeX size={16} /> : <Volume2 size={16} />}
              <span>{isPlaying ? t('stopReading') : t('readAloud')}</span>
            </button>

            {/* Bookmark button */}
            <button
              onClick={handleBookmarkToggle}
              className="p-2 rounded-xl border border-slate-200/65 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-500 dark:text-slate-300 transition"
            >
              {isBookmarked ? (
                <BookmarkCheck size={18} className="text-brand-500" />
              ) : (
                <Bookmark size={18} />
              )}
            </button>
          </div>
        </div>

        {/* Detailed Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Diagnostic Info */}
          <div className="bg-slate-50/50 dark:bg-slate-850 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/40">
            <h3 className="font-bold text-xs uppercase tracking-wider text-medical-teal mb-3 flex items-center gap-1.5">
              <Info size={14} />
              Test Profile
            </h3>
            <div className="space-y-4 text-xs">
              <div>
                <span className="font-bold text-slate-400 block mb-0.5">{t('purposeTest')}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 leading-relaxed block">{test.purpose}</span>
              </div>
              <div>
                <span className="font-bold text-slate-400 block mb-0.5">{t('sampleType')}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">{test.sampleType}</span>
              </div>
              <div>
                <span className="font-bold text-slate-400 block mb-0.5">{t('preparation')}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 leading-relaxed block">{test.preparation}</span>
              </div>
            </div>
          </div>

          {/* Reference Ranges & Meanings */}
          <div className="bg-slate-50/50 dark:bg-slate-850 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/40 flex flex-col justify-between">
            <h3 className="font-bold text-xs uppercase tracking-wider text-medical-teal mb-3 flex items-center gap-1.5">
              <Info size={14} />
              Reference Ranges & Interpretations
            </h3>
            <div className="space-y-4 text-xs">
              <div>
                <span className="font-bold text-slate-400 block mb-0.5">{t('normalRange')}</span>
                <span className="font-extrabold text-sm text-brand-600 dark:text-brand-400 block">{test.normalRange}</span>
              </div>
              <div className="p-3 bg-medical-rose/5 rounded-xl border border-medical-rose/10 flex flex-col gap-2">
                <div>
                  <span className="font-bold text-medical-rose/80 block">{t('highMeaning')}</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 leading-relaxed mt-0.5">{test.highMeaning}</p>
                </div>
                <div className="border-t border-slate-200/50 dark:border-slate-800/50 pt-2">
                  <span className="font-bold text-slate-400 block">{t('lowMeaning')}</span>
                  <p className="font-semibold text-slate-800 dark:text-slate-200 leading-relaxed mt-0.5">{test.lowMeaning}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
