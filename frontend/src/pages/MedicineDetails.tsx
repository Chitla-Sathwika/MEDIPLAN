import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useSpeech } from '../hooks/useSpeech';
import { Pill, Volume2, VolumeX, Bookmark, BookmarkCheck, ArrowLeft, Loader2, Info, AlertTriangle } from 'lucide-react';
import api from '../services/api';

export const MedicineDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language, t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { speak, stop, isPlaying } = useSpeech(language);

  const [loading, setLoading] = useState(true);
  const [medicine, setMedicine] = useState<any | null>(null);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // Fetch Medicine details
  useEffect(() => {
    const fetchDetails = async () => {
      setLoading(true);
      try {
        const res = await api.get(`/medicines/${id}?lang=${language}`);
        setMedicine(res.data.medicine);

        // Check if bookmarked
        if (isAuthenticated) {
          const bRes = await api.get('/users/bookmarks');
          const bookmarkedList = bRes.data.bookmarks;
          setIsBookmarked(bookmarkedList.some((b: any) => b.itemId === id));
        }
      } catch (error) {
        console.error('Failed to fetch medicine details:', error);
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
        await api.delete('/users/bookmarks', { data: { itemType: 'medicine', itemId: id } });
        setIsBookmarked(false);
      } else {
        await api.post('/users/bookmarks', { itemType: 'medicine', itemId: id });
        setIsBookmarked(true);
      }
    } catch (error) {
      console.error('Bookmark error:', error);
    }
  };

  const handleVoiceReadout = () => {
    if (isPlaying) {
      stop();
    } else if (medicine) {
      // Build speech text depending on language
      let text = '';
      if (language === 'hi') {
        text = `दवा का नाम: ${medicine.name}. इसका मुख्य उपयोग है: ${medicine.uses}. खुराक: ${medicine.dosage}. महत्वपूर्ण चेतावनी: ${medicine.warnings}.`;
      } else if (language === 'te') {
        text = `మందు పేరు: ${medicine.name}. దీని ఉపయోగాలు: ${medicine.uses}. మోతాదు: ${medicine.dosage}. ముఖ్యమైన హెచ్చరికలు: ${medicine.warnings}.`;
      } else {
        text = `Medicine name is ${medicine.name}. Generic name is ${medicine.genericName}. Its primary uses are: ${medicine.uses}. Dosage instructions: ${medicine.dosage}. Critical warnings: ${medicine.warnings}.`;
      }
      speak(text);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-2">
        <Loader2 className="animate-spin text-brand-500" size={32} />
        <span className="text-xs font-bold">Retrieving Drug Monographs...</span>
      </div>
    );
  }

  if (!medicine) {
    return (
      <div className="max-w-md mx-auto text-center py-20 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-2xl p-6">
        <AlertTriangle className="text-medical-rose mx-auto mb-4" size={32} />
        <h3 className="font-bold text-slate-800 dark:text-white">Medicine Not Found</h3>
        <p className="text-xs text-slate-400 mt-2">The requested drug file could not be located in our registry database.</p>
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
            <div className="h-14 w-14 rounded-2xl bg-brand-50 dark:bg-brand-950/20 flex items-center justify-center text-brand-500 shadow-inner">
              <Pill size={28} />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">{medicine.name}</h2>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full ${medicine.prescriptionRequired ? 'bg-medical-rose/10 text-medical-rose' : 'bg-medical-emerald/10 text-medical-emerald'}`}>
                  {medicine.prescriptionRequired ? t('prescriptionRequired') : t('otc')}
                </span>
              </div>
              <p className="text-xs text-slate-400 mt-1.5 font-semibold">
                {medicine.manufacturer}
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
          {/* Generic Information */}
          <div className="bg-slate-50/50 dark:bg-slate-850 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/40">
            <h3 className="font-bold text-xs uppercase tracking-wider text-brand-500 mb-3 flex items-center gap-1.5">
              <Info size={14} />
              Generic Profile
            </h3>
            <div className="space-y-4 text-xs">
              <div>
                <span className="font-bold text-slate-400 block mb-0.5">{t('genericName')}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{medicine.genericName}</span>
              </div>
              <div>
                <span className="font-bold text-slate-400 block mb-0.5">{t('brandName')}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{medicine.brandName}</span>
              </div>
              <div>
                <span className="font-bold text-slate-400 block mb-0.5">{t('strength')}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{medicine.strength}</span>
              </div>
              <div>
                <span className="font-bold text-slate-400 block mb-0.5">{t('category')}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200">{medicine.category}</span>
              </div>
            </div>
          </div>

          {/* Usage Panel */}
          <div className="bg-slate-50/50 dark:bg-slate-850 p-5 rounded-2xl border border-slate-100 dark:border-slate-800/40">
            <h3 className="font-bold text-xs uppercase tracking-wider text-brand-500 mb-3 flex items-center gap-1.5">
              <Info size={14} />
              Instructions & Uses
            </h3>
            <div className="space-y-4 text-xs">
              <div>
                <span className="font-bold text-slate-400 block mb-0.5">{t('uses')}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 leading-relaxed block">{medicine.uses}</span>
              </div>
              <div>
                <span className="font-bold text-slate-400 block mb-0.5">{t('dosage')}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 leading-relaxed block">{medicine.dosage}</span>
              </div>
              <div>
                <span className="font-bold text-slate-400 block mb-0.5">{t('storage')}</span>
                <span className="font-semibold text-slate-800 dark:text-slate-200 block">{medicine.storage}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Warning alerts / Side effects */}
        <div className="mt-6 p-5 bg-medical-rose/5 rounded-2xl border border-medical-rose/10">
          <h3 className="font-bold text-xs uppercase tracking-wider text-medical-rose mb-3 flex items-center gap-1.5">
            <AlertTriangle size={14} className="text-medical-rose" />
            Precautions & Side Effects
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-xs leading-relaxed">
            <div>
              <span className="font-bold text-medical-rose/70 block mb-0.5">{t('warnings')}</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{medicine.warnings}</p>
            </div>
            <div>
              <span className="font-bold text-medical-rose/70 block mb-0.5">{t('precautions')}</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{medicine.precautions}</p>
            </div>
            <div>
              <span className="font-bold text-medical-rose/70 block mb-0.5">{t('sideEffects')}</span>
              <p className="font-semibold text-slate-800 dark:text-slate-200">{medicine.sideEffects}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
