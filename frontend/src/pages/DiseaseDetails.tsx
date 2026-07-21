import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useSpeech } from '../hooks/useSpeech';
import { AlertTriangle, Volume2, VolumeX, Bookmark, BookmarkCheck, ArrowLeft, Loader2, Info, Flame } from 'lucide-react';
import api from '../services/api';

export const DiseaseDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { speak, stop, isPlaying } = useSpeech(language);

  const [loading, setLoading] = useState(true);
  const [disease, setDisease] = useState<any | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Fetch Disease details
  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/diseases/${id}?lang=${language}`);
        setDisease(res.data.disease);

        // Check bookmark
        if (isAuthenticated) {
          const bRes = await api.get('/users/bookmarks');
          setIsBookmarked(bRes.data.bookmarks.some((b: any) => b.itemId === id));
        }
      } catch (error) {
        console.error('Failed to fetch disease details:', error);
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
        await api.delete('/users/bookmarks', { data: { itemType: 'disease', itemId: id } });
        setIsBookmarked(false);
      } else {
        await api.post('/users/bookmarks', { itemType: 'disease', itemId: id });
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('Bookmark error:', error);
    }
  };

  const handleVoiceReadout = () => {
    if (isPlaying) {
      stop();
    } else if (disease) {
      let text = '';
      if (language === 'hi') {
        text = `बीमारी का नाम: ${disease.name}. सामान्य लक्षण: ${disease.symptoms}. इसके कारण: ${disease.causes}. जोखिम कारक: ${disease.riskFactors}.`;
      } else if (language === 'te') {
        text = `వ్యాధి పేరు: ${disease.name}. సాధారణ లక్షణాలు: ${disease.symptoms}. దీనికి గల కారణాలు: ${disease.causes}. ప్రమాద కారకాలు: ${disease.riskFactors}.`;
      } else {
        text = `Disease name is ${disease.name}. Common symptoms: ${disease.symptoms}. Causes: ${disease.causes}. Risk factors: ${disease.riskFactors}.`;
      }
      speak(text);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-2">
        <Loader2 className="animate-spin text-brand-500" size={32} />
        <span className="text-xs font-bold">Scanning Pathology Registries...</span>
      </div>
    );
  }

  if (!disease) {
    return (
      <div className="max-w-md mx-auto text-center py-20 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6">
        <AlertTriangle className="text-medical-rose mx-auto mb-4" size={32} />
        <h3 className="font-bold text-slate-800 dark:text-white">Disease File Not Found</h3>
        <p className="text-xs text-slate-400 mt-2">The requested pathology monograph could not be located.</p>
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
            <div className="h-14 w-14 rounded-2xl bg-amber-50 dark:bg-amber-950/20 flex items-center justify-center text-medical-amber shadow-inner">
              <AlertTriangle size={28} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">{disease.name}</h2>
              <p className="text-xs text-slate-400 mt-1.5 font-semibold">
                Clinical Health Monograph
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
          {/* Symptoms and Profile */}
          <div className="bg-slate-50/50 dark:bg-slate-850 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/40">
            <h3 className="font-bold text-xs uppercase tracking-wider text-medical-amber mb-3 flex items-center gap-1.5">
              <Info size={14} />
              Symptoms & Risk Factors
            </h3>
            <div className="space-y-4 text-xs">
              <div>
                <span className="font-bold text-slate-400 block mb-0.5">{t('symptoms')}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 leading-relaxed block">{disease.symptoms}</span>
              </div>
              <div>
                <span className="font-bold text-slate-400 block mb-0.5">{t('riskFactors')}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 leading-relaxed block">{disease.riskFactors}</span>
              </div>
              <div>
                <span className="font-bold text-slate-400 block mb-0.5">{t('causes')}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 leading-relaxed block">{disease.causes}</span>
              </div>
            </div>
          </div>

          {/* Diagnosis & Treatments */}
          <div className="bg-slate-50/50 dark:bg-slate-850 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/40">
            <h3 className="font-bold text-xs uppercase tracking-wider text-medical-teal mb-3 flex items-center gap-1.5">
              <Info size={14} />
              Diagnosis, Treatment & Prevention
            </h3>
            <div className="space-y-4 text-xs">
              <div>
                <span className="font-bold text-slate-400 block mb-0.5">{t('diagnosis')}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 leading-relaxed block">{disease.diagnosis}</span>
              </div>
              <div>
                <span className="font-bold text-slate-400 block mb-0.5">{t('treatment')}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 leading-relaxed block">{disease.treatment}</span>
              </div>
              <div>
                <span className="font-bold text-slate-400 block mb-0.5">{t('prevention')}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 leading-relaxed block">{disease.prevention}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Red Flags */}
        <div className="mt-6 p-5 bg-medical-rose/5 rounded-2xl border border-medical-rose/10">
          <h3 className="font-bold text-xs uppercase tracking-wider text-medical-rose mb-3 flex items-center gap-1.5">
            <Flame size={14} className="text-medical-rose animate-soft-pulse" />
            {t('emergencySymptoms')}
          </h3>
          <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
            {disease.emergencySymptoms}
          </p>
        </div>
      </div>
    </div>
  );
};
