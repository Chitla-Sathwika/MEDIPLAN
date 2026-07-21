import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useLanguage } from '../contexts/LanguageContext';
import { User, Clock, MessageSquare, Star, CheckCircle2, AlertCircle } from 'lucide-react';
import api from '../services/api';

export const Profile: React.FC = () => {
  const { user, updateUserPreferences } = useAuth();
  const { t } = useLanguage();

  // Profile Form States
  const [name, setName] = useState(user?.name || '');
  const [password, setPassword] = useState('');
  const [prefLang, setPrefLang] = useState(user?.language || 'en');
  const [prefTheme, setPrefTheme] = useState(user?.theme || 'light');
  
  const [profileSuccess, setProfileSuccess] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Search History States
  const [history, setHistory] = useState<any[]>([]);

  // Feedback Form States
  const [feedbackRating, setFeedbackRating] = useState(5);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [feedbackSuccess, setFeedbackSuccess] = useState<string | null>(null);
  const [feedbackError, setFeedbackError] = useState<string | null>(null);
  const [isSubmittingFeedback, setIsSubmittingFeedback] = useState(false);

  // Load Search History
  useEffect(() => {
    api.get('/users/history')
      .then(res => setHistory(res.data.history || []))
      .catch(err => console.error('Failed to load history:', err));
  }, []);

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileSuccess(null);
    setProfileError(null);
    setIsUpdatingProfile(true);

    try {
      await updateUserPreferences({
        name,
        language: prefLang as 'en' | 'hi' | 'te',
        theme: prefTheme as 'light' | 'dark',
        ...(password ? { password } : {})
      });
      setProfileSuccess('Preferences updated successfully.');
      setPassword('');
    } catch (err: any) {
      setProfileError(err.response?.data?.message || 'Failed to update preferences.');
    } finally {
      setIsUpdatingProfile(false);
    }
  };

  const clearHistory = async () => {
    if (!window.confirm(t('clearHistoryBtn') + '?')) return;

    try {
      await api.delete('/users/history');
      setHistory([]);
    } catch (err) {
      console.error(err);
    }
  };

  const submitFeedback = async (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackSuccess(null);
    setFeedbackError(null);
    setIsSubmittingFeedback(true);

    try {
      await api.post('/users/feedback', {
        name: user?.name || 'Anonymous',
        email: user?.email || 'anonymous@mediplain.com',
        rating: feedbackRating,
        message: feedbackMessage
      });
      setFeedbackSuccess('Thank you! Your feedback has been submitted successfully.');
      setFeedbackMessage('');
      setFeedbackRating(5);
    } catch (err: any) {
      setFeedbackError(err.response?.data?.message || 'Failed to submit feedback.');
    } finally {
      setIsSubmittingFeedback(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto py-2 space-y-8">
      {/* Grid wrapper */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Side: Profile & Settings Form */}
        <div className="lg:col-span-1 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-6 shadow-xl h-fit">
          <h3 className="font-extrabold text-slate-800 dark:text-white text-base mb-6 flex items-center gap-2">
            <User className="text-brand-500" size={20} />
            User Settings
          </h3>

          {profileSuccess && (
            <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-medical-emerald/10 text-medical-emerald text-xs font-semibold border border-medical-emerald/25">
              <CheckCircle2 size={16} />
              <span>{profileSuccess}</span>
            </div>
          )}

          {profileError && (
            <div className="flex items-center gap-2 p-3 mb-4 rounded-xl bg-medical-rose/10 text-medical-rose text-xs font-semibold border border-medical-rose/25">
              <AlertCircle size={16} />
              <span>{profileError}</span>
            </div>
          )}

          <form onSubmit={handleProfileSubmit} className="space-y-4">
            {/* Full name */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={e => setName(e.target.value)}
                required
                className="w-full px-3 py-2 rounded-lg border dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Email (Readonly) */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Email Address</label>
              <input
                type="email"
                value={user?.email || ''}
                readOnly
                disabled
                className="w-full px-3 py-2 rounded-lg border border-slate-100 dark:border-slate-850 bg-slate-100/50 dark:bg-slate-950 text-slate-400 text-xs font-semibold focus:outline-none cursor-not-allowed"
              />
            </div>

            {/* Password edit */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">New Password (optional)</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="Leave blank to keep current"
                className="w-full px-3 py-2 rounded-lg border dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>

            {/* Language Selection */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">{t('language')}</label>
              <select
                value={prefLang}
                onChange={e => setPrefLang(e.target.value as 'en' | 'hi' | 'te')}
                className="w-full px-3 py-2 rounded-lg border dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="en">English</option>
                <option value="hi">हिंदी (Hindi)</option>
                <option value="te">తెలుగు (Telugu)</option>
              </select>
            </div>

            {/* Theme Preference */}
            <div>
              <label className="block text-[11px] font-bold text-slate-400 uppercase mb-1">Theme Mode</label>
              <select
                value={prefTheme}
                onChange={e => setPrefTheme(e.target.value as 'light' | 'dark')}
                className="w-full px-3 py-2 rounded-lg border dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500"
              >
                <option value="light">Light</option>
                <option value="dark">Dark</option>
              </select>
            </div>

            {/* Save */}
            <button
              type="submit"
              disabled={isUpdatingProfile}
              className="w-full py-2 bg-brand-500 hover:bg-brand-600 active:scale-95 text-white font-bold rounded-lg text-xs transition disabled:opacity-50"
            >
              {isUpdatingProfile ? 'Saving...' : t('save')}
            </button>
          </form>
        </div>

        {/* Right Side: Search History (Col 2) & Feedbacks Form (Col 3) */}
        <div className="lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            {/* Search History Panel */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col h-[400px]">
              <div className="flex justify-between items-center mb-4 shrink-0">
                <h3 className="font-extrabold text-slate-800 dark:text-white text-sm flex items-center gap-1.5">
                  <Clock className="text-brand-500" size={16} />
                  Search History
                </h3>
                {history.length > 0 && (
                  <button onClick={clearHistory} className="text-[10px] text-medical-rose hover:underline font-bold">
                    Clear All
                  </button>
                )}
              </div>

              <div className="flex-1 overflow-y-auto space-y-2 pr-1">
                {history.length === 0 ? (
                  <div className="h-full flex items-center justify-center text-slate-450 italic text-[11px]">
                    No search logs found
                  </div>
                ) : (
                  history.map((hist, idx) => (
                    <div key={idx} className="p-2.5 rounded-xl border border-slate-100 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-950 flex items-center justify-between text-xs text-slate-700 dark:text-slate-300">
                      <span className="font-semibold truncate max-w-[130px]">{hist.query}</span>
                      <span className="text-[9px] text-slate-400">
                        {new Date(hist.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Feedback Submission Panel */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 rounded-3xl p-5 shadow-xl flex flex-col justify-between h-[400px]">
              <div>
                <h3 className="font-extrabold text-slate-800 dark:text-white text-sm flex items-center gap-1.5 mb-4">
                  <MessageSquare className="text-brand-500" size={16} />
                  Submit Feedback
                </h3>

                {feedbackSuccess && (
                  <div className="flex items-center gap-2 p-2.5 mb-3 rounded-lg bg-medical-emerald/10 text-medical-emerald text-[11px] font-semibold border border-medical-emerald/25">
                    <CheckCircle2 size={14} className="shrink-0" />
                    <span>{feedbackSuccess}</span>
                  </div>
                )}

                {feedbackError && (
                  <div className="flex items-center gap-2 p-2.5 mb-3 rounded-lg bg-medical-rose/10 text-medical-rose text-[11px] font-semibold border border-medical-rose/25">
                    <AlertCircle size={14} className="shrink-0" />
                    <span>{feedbackError}</span>
                  </div>
                )}

                <form onSubmit={submitFeedback} className="space-y-4">
                  {/* Rating Stars */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Rating</label>
                    <div className="flex gap-1.5">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setFeedbackRating(star)}
                          className="p-1 hover:scale-110 transition"
                        >
                          <Star
                            size={20}
                            className={star <= feedbackRating ? 'text-medical-amber fill-medical-amber' : 'text-slate-300'}
                          />
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-400 uppercase mb-1">Feedback Message</label>
                    <textarea
                      value={feedbackMessage}
                      onChange={e => setFeedbackMessage(e.target.value)}
                      required
                      rows={4}
                      placeholder="Write your suggestions, report missing words, or describe clinical inaccuracies..."
                      className="w-full px-3 py-2 rounded-lg border dark:border-slate-800 bg-slate-50/50 dark:bg-slate-850 dark:text-white text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={isSubmittingFeedback}
                    className="w-full py-2 bg-slate-900 hover:bg-slate-800 text-white dark:bg-slate-800 dark:hover:bg-slate-700 font-bold rounded-lg text-xs transition disabled:opacity-50"
                  >
                    {isSubmittingFeedback ? 'Submitting...' : 'Submit Feedback'}
                  </button>
                </form>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
export default Profile;
