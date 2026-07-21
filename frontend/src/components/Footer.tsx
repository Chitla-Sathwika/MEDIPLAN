import React from 'react';
import { useLanguage } from '../contexts/LanguageContext';
import { Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useLanguage();
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-slate-900 text-slate-400 py-12 border-t border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo & Description */}
          <div className="flex flex-col gap-3">
            <div className="flex items-center gap-2">
              <span className="h-8 w-8 rounded-lg bg-brand-500 flex items-center justify-center text-white font-extrabold text-lg">
                M
              </span>
              <span className="font-bold text-lg text-white tracking-tight">
                {t('appName')}
              </span>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed max-w-sm">
              MediPlain is an AI-powered healthcare platform built to translate clinical terminology, billing items, and physician prescriptions into simple, patient-friendly explanations in Telugu, Hindi, and English.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-sm text-white mb-4">Navigations</h4>
            <ul className="space-y-2 text-xs">
              <li>
                <a href="/" className="hover:text-white transition-colors">{t('home')}</a>
              </li>
              <li>
                <a href="/upload" className="hover:text-white transition-colors">{t('upload')}</a>
              </li>
              <li>
                <a href="/bookmarks" className="hover:text-white transition-colors">{t('bookmarks')}</a>
              </li>
            </ul>
          </div>

          {/* Contact & Feedback */}
          <div>
            <h4 className="font-semibold text-sm text-white mb-4">Feedback</h4>
            <p className="text-xs leading-relaxed mb-3">
              We value your experience. If you encountered bugs, missing words, or have suggestions, please submit feedback in your profile dashboard.
            </p>
            <span className="text-[11px] text-brand-400 font-semibold">Support: support@mediplain.com</span>
          </div>
        </div>

        {/* Medical Disclaimer Section */}
        <div className="mt-10 pt-6 border-t border-slate-800 text-[10px] text-slate-500 leading-relaxed text-center">
          <p className="font-bold text-slate-400 uppercase tracking-wider mb-2">Important Medical Disclaimer</p>
          <p>
            MediPlain is an informational software utility utilizing automated Optical Character Recognition (OCR) and Artificial Intelligence models. All summaries, explanations, and matched clinical descriptions are for educational purposes only. The software does not provide medical diagnosis, clinical opinions, or treatment recommendations. Always consult a certified physician or medical practitioner for clinical consultations, emergencies, or prescription modifications.
          </p>
        </div>

        {/* Copyright */}
        <div className="mt-8 pt-4 border-t border-slate-800/40 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500">
          <p>&copy; {currentYear} MediPlain. All rights reserved.</p>
          <p className="flex items-center gap-1 mt-2 sm:mt-0">
            Made with <Heart size={12} className="text-medical-rose fill-medical-rose" /> for health accessibility.
          </p>
        </div>
      </div>
    </footer>
  );
};
