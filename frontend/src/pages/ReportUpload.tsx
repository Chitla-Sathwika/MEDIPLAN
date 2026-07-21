import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../contexts/LanguageContext';
import { useAuth } from '../contexts/AuthContext';
import { useSpeech } from '../hooks/useSpeech';
import { UploadCloud, Activity, AlertTriangle, Pill, Volume2, VolumeX, AlertOctagon, Check, Loader2, Sparkles } from 'lucide-react';
import api from '../services/api';

export const ReportUpload: React.FC = () => {
  const { language, t } = useLanguage();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { speak, stop, isPlaying } = useSpeech(language);

  // Form states
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [reportType, setReportType] = useState<'prescription' | 'lab_report' | 'bill'>('prescription');
  const [loading, setLoading] = useState(false);
  const [loadingStage, setLoadingStage] = useState('');
  const [error, setError] = useState<string | null>(null);
  
  // Result states
  const [analysisResult, setAnalysisResult] = useState<any | null>(null);
  const [dragActive, setDragActive] = useState(false);

  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
    }
  }, [isAuthenticated, navigate]);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type.startsWith('image/')) {
        setFile(droppedFile);
        setPreviewUrl(URL.createObjectURL(droppedFile));
      } else {
        setError('Only image files (PNG, JPG, JPEG) are supported for OCR.');
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0];
      if (selectedFile.type.startsWith('image/')) {
        setFile(selectedFile);
        setPreviewUrl(URL.createObjectURL(selectedFile));
      } else {
        setError('Only image files are supported.');
      }
    }
  };

  const handleUploadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      setError('Please select or drag an image file to upload.');
      return;
    }

    setError(null);
    setLoading(true);
    setLoadingStage('Uploading health document to server...');

    const formData = new FormData();
    formData.append('image', file);
    formData.append('reportType', reportType);
    formData.append('language', language);

    try {
      // Step-by-step progress simulation for premium UX
      setTimeout(() => setLoadingStage('Extracting text using Tesseract OCR engine...'), 2000);
      setTimeout(() => setLoadingStage('Cross-referencing database for matching medicines, tests, and diseases...'), 4500);
      setTimeout(() => setLoadingStage('Querying Gemini AI for structured medical explanations...'), 6500);

      const response = await api.post('/reports/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      setAnalysisResult(response.data.report);
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.message || 'Failed to process document. Please try again with a clearer image.');
    } finally {
      setLoading(false);
      setLoadingStage('');
    }
  };

  const handleVoiceReadout = () => {
    if (isPlaying) {
      stop();
    } else if (analysisResult?.aiExplanation) {
      const expl = analysisResult.aiExplanation;
      const text = `${expl.meaning}. Warnings: ${expl.warnings}. Abnormal Findings: ${expl.abnormalValues}. Lifestyle advice: ${expl.lifestyleAdvice}.`;
      speak(text);
    }
  };

  const resetForm = () => {
    setFile(null);
    setPreviewUrl(null);
    setAnalysisResult(null);
    setError(null);
  };

  return (
    <div className="max-w-6xl mx-auto py-2">
      {/* Upload and Form Section */}
      {!analysisResult ? (
        <div className="max-w-xl mx-auto bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 shadow-xl">
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white mb-2">
            {t('uploadTitle')}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mb-6 leading-relaxed">
            {t('uploadSubtitle')}
          </p>

          {error && (
            <div className="flex items-center gap-2.5 p-3 mb-4 rounded-xl bg-medical-rose/10 text-medical-rose text-xs font-semibold border border-medical-rose/25">
              <AlertOctagon size={18} />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleUploadSubmit} className="space-y-6">
            {/* Document Type Selector */}
            <div>
              <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-2">
                {t('selectReportType')}
              </label>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => setReportType('prescription')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition text-center ${reportType === 'prescription' ? 'bg-brand-500 border-brand-500 text-white shadow-md' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                >
                  {t('prescription')}
                </button>
                <button
                  type="button"
                  onClick={() => setReportType('lab_report')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition text-center ${reportType === 'lab_report' ? 'bg-brand-500 border-brand-500 text-white shadow-md' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                >
                  {t('labReport')}
                </button>
                <button
                  type="button"
                  onClick={() => setReportType('bill')}
                  className={`py-2 px-3 rounded-lg text-xs font-bold border transition text-center ${reportType === 'bill' ? 'bg-brand-500 border-brand-500 text-white shadow-md' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'}`}
                >
                  {t('bill')}
                </button>
              </div>
            </div>

            {/* Drag & Drop File Upload */}
            <div
              onDragEnter={handleDrag}
              onDragOver={handleDrag}
              onDragLeave={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center text-center cursor-pointer transition ${dragActive ? 'border-brand-500 bg-brand-50/20 dark:bg-brand-950/10' : 'border-slate-200 dark:border-slate-800 hover:bg-slate-50/50'}`}
            >
              <input
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              
              {previewUrl ? (
                <div className="flex flex-col items-center gap-3">
                  <img src={previewUrl} alt="Preview" className="h-32 object-contain rounded-lg border dark:border-slate-800 shadow" />
                  <span className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center gap-1">
                    <Check className="text-medical-emerald" size={16} />
                    {file?.name}
                  </span>
                </div>
              ) : (
                <div className="flex flex-col items-center">
                  <div className="h-12 w-12 rounded-xl bg-slate-50 dark:bg-slate-850 flex items-center justify-center text-slate-400 mb-4 border border-slate-100 dark:border-slate-800/40">
                    <UploadCloud size={24} />
                  </div>
                  <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{t('dragDropText')}</p>
                  <p className="text-[10px] text-slate-400 mt-1">PNG, JPG, JPEG up to 10MB</p>
                </div>
              )}
            </div>

            {/* Submit button */}
            <button
              type="submit"
              disabled={loading || !file}
              className="w-full py-3 rounded-xl font-extrabold text-white bg-gradient-to-r from-brand-500 to-brand-600 hover:from-brand-600 hover:to-brand-700 disabled:opacity-40 disabled:pointer-events-none active:scale-[0.99] transition shadow-md shadow-brand-500/10 hover:shadow-brand-500/20 flex items-center justify-center gap-2 text-sm sm:text-base"
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  <span>Processing...</span>
                </>
              ) : (
                <>
                  <Sparkles size={20} />
                  {t('analyzeBtn')}
                </>
              )}
            </button>
          </form>

          {/* Loader Overlay */}
          {loading && (
            <div className="absolute inset-0 bg-white/95 dark:bg-slate-900/95 backdrop-blur rounded-3xl flex flex-col items-center justify-center p-6 text-center z-40 transition-all duration-300">
              <div className="relative mb-6">
                <div className="absolute inset-0 rounded-full bg-brand-500/10 blur-xl animate-soft-pulse"></div>
                <Loader2 className="animate-spin text-brand-500 relative z-10" size={48} />
              </div>
              <h3 className="font-extrabold text-slate-800 dark:text-white text-base">Processing Report</h3>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 max-w-sm mt-3 animate-pulse font-medium">
                {loadingStage}
              </p>
            </div>
          )}
        </div>
      ) : (
        /* ========================================= */
        /* RESULTS & AI EXPLANATION SCREEN */
        /* ========================================= */
        <div className="flex flex-col gap-6">
          {/* Header Bar */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-5 shadow">
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-brand-500">Analysis complete</span>
              <h2 className="text-lg sm:text-xl font-extrabold text-slate-800 dark:text-white mt-0.5">{t('reportAnalysisResult')}</h2>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleVoiceReadout}
                className={`flex items-center gap-1 px-3 py-2 rounded-xl text-xs font-bold border transition ${
                  isPlaying 
                    ? 'bg-medical-rose/10 border-medical-rose/30 text-medical-rose'
                    : 'bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 text-slate-700 dark:text-slate-200 border-slate-200/65 dark:border-slate-700'
                }`}
              >
                {isPlaying ? <VolumeX size={15} /> : <Volume2 size={15} />}
                <span>{isPlaying ? t('stopReading') : t('readAloud')}</span>
              </button>
              <button onClick={resetForm} className="px-3 py-2 bg-slate-900 dark:bg-slate-800 text-white rounded-xl text-xs font-bold hover:opacity-90">
                Upload Another
              </button>
            </div>
          </div>

          {/* Core Content Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left side: Mapped entities & details */}
            <div className="lg:col-span-1 space-y-6">
              {/* Image Preview */}
              {previewUrl && (
                <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-4 shadow">
                  <h3 className="text-xs font-extrabold text-slate-400 mb-3 uppercase tracking-wider">Original Upload</h3>
                  <img src={previewUrl} alt="Analyzed Document" className="w-full max-h-48 object-contain rounded-2xl bg-slate-50 dark:bg-slate-850 p-2" />
                </div>
              )}

              {/* Matched Entities */}
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-5 shadow">
                <h3 className="text-xs font-extrabold text-slate-400 mb-4 uppercase tracking-wider">{t('detectedItemsTitle')}</h3>
                
                <div className="space-y-4">
                  {/* Medicines */}
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-500 mb-2 flex items-center gap-1"><Pill size={12} /> {t('detectedMedicines')}</h4>
                    {analysisResult.detectedMedicines.length === 0 ? (
                      <span className="text-[11px] text-slate-400 block pl-4 italic">No medicines identified</span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 pl-2">
                        {analysisResult.detectedMedicines.map((med: any) => (
                          <button
                            key={med._id}
                            onClick={() => navigate(`/medicines/${med._id}`)}
                            className="text-[10px] font-bold bg-blue-50 hover:bg-blue-100 text-blue-700 dark:bg-blue-950/20 dark:text-blue-400 px-2 py-1 rounded-md border border-blue-100/50 dark:border-blue-900/30 transition"
                          >
                            {med.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Tests */}
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-500 mb-2 flex items-center gap-1"><Activity size={12} /> {t('detectedMedicalTests')}</h4>
                    {analysisResult.detectedTests.length === 0 ? (
                      <span className="text-[11px] text-slate-400 block pl-4 italic">No diagnostic tests identified</span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 pl-2">
                        {analysisResult.detectedTests.map((test: any) => (
                          <button
                            key={test._id}
                            onClick={() => navigate(`/tests/${test._id}`)}
                            className="text-[10px] font-bold bg-teal-50 hover:bg-teal-100 text-teal-700 dark:bg-teal-950/20 dark:text-teal-400 px-2 py-1 rounded-md border border-teal-100/50 dark:border-teal-900/30 transition"
                          >
                            {test.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Diseases */}
                  <div>
                    <h4 className="text-[11px] font-bold text-slate-500 mb-2 flex items-center gap-1"><AlertTriangle size={12} /> {t('detectedDiseases')}</h4>
                    {analysisResult.detectedDiseases.length === 0 ? (
                      <span className="text-[11px] text-slate-400 block pl-4 italic">No diseases identified</span>
                    ) : (
                      <div className="flex flex-wrap gap-1.5 pl-2">
                        {analysisResult.detectedDiseases.map((disease: any) => (
                          <button
                            key={disease._id}
                            onClick={() => navigate(`/diseases/${disease._id}`)}
                            className="text-[10px] font-bold bg-amber-50 hover:bg-amber-100 text-amber-700 dark:bg-amber-950/20 dark:text-amber-400 px-2 py-1 rounded-md border border-amber-100/50 dark:border-amber-900/30 transition"
                          >
                            {disease.name}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right side: AI parsed Explanation columns */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow space-y-6">
                
                {/* Meaning & Purpose */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="p-4 bg-slate-50/60 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                    <h4 className="text-xs font-bold text-brand-500 uppercase tracking-wide mb-2">{t('aiMeaning')}</h4>
                    <p className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed font-semibold">{analysisResult.aiExplanation.meaning}</p>
                  </div>
                  <div className="p-4 bg-slate-50/60 dark:bg-slate-850 rounded-2xl border border-slate-100 dark:border-slate-800/40">
                    <h4 className="text-xs font-bold text-brand-500 uppercase tracking-wide mb-2">{t('aiPurpose')}</h4>
                    <p className="text-xs text-slate-700 dark:text-slate-350 leading-relaxed font-semibold">{analysisResult.aiExplanation.purpose}</p>
                  </div>
                </div>

                {/* Warnings, Abnormal Values & Lifestyle advice */}
                <div className="space-y-4">
                  <div className="p-4 bg-medical-rose/5 rounded-2xl border border-medical-rose/10">
                    <h4 className="text-xs font-bold text-medical-rose uppercase tracking-wide mb-2">{t('aiWarnings')}</h4>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">{analysisResult.aiExplanation.warnings}</p>
                  </div>

                  <div className="p-4 bg-medical-amber/5 rounded-2xl border border-medical-amber/10">
                    <h4 className="text-xs font-bold text-medical-amber dark:text-amber-400 uppercase tracking-wide mb-2">{t('aiAbnormal')}</h4>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">{analysisResult.aiExplanation.abnormalValues}</p>
                  </div>

                  <div className="p-5 bg-teal-50/20 dark:bg-teal-950/10 rounded-2xl border border-teal-100/30 dark:border-teal-900/20">
                    <h4 className="text-xs font-bold text-medical-teal uppercase tracking-wide mb-2">{t('aiLifestyle')}</h4>
                    <p className="text-xs text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">{analysisResult.aiExplanation.lifestyleAdvice}</p>
                  </div>
                </div>

                {/* Disclaimer */}
                <div className="p-4 bg-slate-900 text-slate-400 rounded-2xl text-[10px] leading-relaxed border border-slate-850">
                  <span className="font-bold text-slate-200 block mb-1 uppercase tracking-wider">{t('aiDisclaimer')}</span>
                  {analysisResult.aiExplanation.disclaimer || 'Always verify with your doctor.'}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
export default ReportUpload;
