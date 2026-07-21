import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useSpeech } from '../hooks/useSpeech';
import { FileText, Calendar, ArrowRight, Trash2, Loader2, FileSpreadsheet, Eye, Volume2, VolumeX } from 'lucide-react';
import api from '../services/api';

export const History: React.FC = () => {
  const { t, language } = useLanguage();
  const { isAuthenticated } = useAuth();
  const { speak, stop, isPlaying } = useSpeech(language);

  const [loading, setLoading] = useState(true);
  const [reports, setReports] = useState<any[]>([]);
  const [selectedReport, setSelectedReport] = useState<any | null>(null);

  // Fetch reports list
  useEffect(() => {
    if (isAuthenticated) {
      api.get('/reports')
        .then(res => setReports(res.data.reports))
        .catch(err => console.error('Failed to load reports:', err))
        .finally(() => setLoading(false));
    }
  }, [isAuthenticated]);

  const deleteReport = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation(); // Avoid selecting the report card
    if (!window.confirm('Are you sure you want to delete this report from your history?')) return;

    try {
      await api.delete(`/reports/${id}`);
      setReports(prev => prev.filter(r => r._id !== id));
      if (selectedReport?._id === id) {
        setSelectedReport(null);
        stop();
      }
    } catch (error) {
      console.error('Failed to delete report:', error);
    }
  };

  const handleVoiceReadout = () => {
    if (isPlaying) {
      stop();
    } else if (selectedReport?.aiExplanation) {
      const expl = selectedReport.aiExplanation;
      const text = `${expl.meaning}. Warnings: ${expl.warnings}. Abnormal Findings: ${expl.abnormalValues}. Lifestyle advice: ${expl.lifestyleAdvice}.`;
      speak(text);
    }
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-2">
        <Loader2 className="animate-spin text-brand-500" size={32} />
        <span className="text-xs font-bold">Retrieving Health Archives...</span>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-2">
      <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white mb-6 flex items-center gap-2">
        <FileSpreadsheet className="text-brand-500" size={24} />
        Analysis History
      </h2>

      {reports.length === 0 ? (
        /* Empty State */
        <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-10 text-center max-w-md mx-auto">
          <FileText className="text-slate-300 mx-auto mb-4" size={40} />
          <h3 className="font-extrabold text-sm text-slate-850 dark:text-white">Archive is Empty</h3>
          <p className="text-xs text-slate-400 mt-2">You have not scanned any medical documents yet. Head to the upload page to start.</p>
        </div>
      ) : (
        /* Split view */
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Reports List */}
          <div className="lg:col-span-1 space-y-3">
            {reports.map((report) => {
              const formattedDate = new Date(report.createdAt).toLocaleDateString(undefined, {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
              });

              const isSelected = selectedReport?._id === report._id;

              return (
                <div
                  key={report._id}
                  onClick={() => { setSelectedReport(report); stop(); }}
                  className={`p-4 rounded-2xl border cursor-pointer flex items-center justify-between gap-3 transition ${
                    isSelected
                      ? 'border-brand-500 bg-brand-500/5 dark:bg-brand-950/20'
                      : 'border-slate-200/60 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500/20'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-xl bg-slate-50 dark:bg-slate-850 flex items-center justify-center text-slate-500 shrink-0">
                      <FileText size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-white capitalize truncate max-w-[140px]">
                        {report.reportType.replace('_', ' ')}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5 flex items-center gap-1">
                        <Calendar size={10} />
                        {formattedDate}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={(e) => deleteReport(report._id, e)}
                      className="p-2 text-slate-400 hover:text-medical-rose hover:bg-slate-50 dark:hover:bg-slate-850 rounded-lg transition"
                    >
                      <Trash2 size={14} />
                    </button>
                    <ArrowRight size={14} className="text-slate-300" />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Report Detail Panel */}
          <div className="lg:col-span-2">
            {selectedReport ? (
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-xl space-y-6">
                
                {/* Header */}
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4 flex-wrap gap-2">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-500 capitalize">
                      {selectedReport.reportType.replace('_', ' ')} report
                    </span>
                    <h3 className="font-extrabold text-slate-800 dark:text-white text-base">Analysis Breakdown</h3>
                  </div>

                  <button
                    onClick={handleVoiceReadout}
                    className={`flex items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold border transition ${
                      isPlaying 
                        ? 'bg-medical-rose/10 border-medical-rose/30 text-medical-rose'
                        : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 border-slate-200/65 dark:border-slate-700'
                    }`}
                  >
                    {isPlaying ? <VolumeX size={14} /> : <Volume2 size={14} />}
                    <span>{isPlaying ? t('stopReading') : t('readAloud')}</span>
                  </button>
                </div>

                {/* Explanation items */}
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50/50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800/40">
                      <span className="font-bold text-[10px] text-brand-500 uppercase block mb-1">Meaning & Summary</span>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-350 leading-relaxed">{selectedReport.aiExplanation.meaning}</p>
                    </div>
                    <div className="p-4 bg-slate-50/50 dark:bg-slate-850 rounded-xl border border-slate-100 dark:border-slate-800/40">
                      <span className="font-bold text-[10px] text-brand-500 uppercase block mb-1">Clinical Reasons</span>
                      <p className="text-xs font-semibold text-slate-700 dark:text-slate-350 leading-relaxed">{selectedReport.aiExplanation.purpose}</p>
                    </div>
                  </div>

                  <div className="p-4 bg-medical-rose/5 rounded-xl border border-medical-rose/10">
                    <span className="font-bold text-[10px] text-medical-rose uppercase block mb-1">Warnings</span>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-350 leading-relaxed">{selectedReport.aiExplanation.warnings}</p>
                  </div>

                  <div className="p-4 bg-medical-amber/5 rounded-xl border border-medical-amber/10">
                    <span className="font-bold text-[10px] text-medical-amber dark:text-amber-400 uppercase block mb-1">Abnormal findings</span>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-350 leading-relaxed">{selectedReport.aiExplanation.abnormalValues}</p>
                  </div>

                  <div className="p-4 bg-teal-50/20 dark:bg-teal-950/15 rounded-xl border border-teal-100/30 dark:border-teal-900/30">
                    <span className="font-bold text-[10px] text-medical-teal uppercase block mb-1">Lifestyle Advice</span>
                    <p className="text-xs font-semibold text-slate-700 dark:text-slate-350 leading-relaxed">{selectedReport.aiExplanation.lifestyleAdvice}</p>
                  </div>
                </div>

                {/* Warning Disclaimer */}
                <div className="p-3.5 bg-slate-900 text-slate-400 rounded-xl text-[9px] leading-relaxed border border-slate-800">
                  <span className="font-bold text-slate-200 block mb-0.5 uppercase">AI Monograph Disclaimer</span>
                  {selectedReport.aiExplanation.disclaimer || 'Information purposes only. Consult your doctor.'}
                </div>
              </div>
            ) : (
              <div className="h-full flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-12 text-slate-400 font-semibold text-xs text-center min-h-[300px]">
                <div className="flex flex-col items-center gap-2">
                  <Eye size={24} />
                  <span>Select a report from the list to expand and read details</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
export default History;
