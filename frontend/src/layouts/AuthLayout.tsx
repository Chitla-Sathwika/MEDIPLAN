import React from 'react';
import { Outlet, Link } from 'react-router-dom';

export const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-tr from-brand-600 to-brand-900 dark:from-slate-900 dark:to-brand-950 p-4 sm:p-6 lg:p-8">
      {/* Dynamic Background Blob Decorations */}
      <div className="absolute top-10 left-10 w-72 h-72 rounded-full bg-brand-400/20 blur-3xl pointer-events-none"></div>
      <div className="absolute bottom-10 right-10 w-96 h-96 rounded-full bg-medical-teal/10 blur-3xl pointer-events-none"></div>

      <div className="w-full max-w-md relative z-10">
        {/* Brand Header */}
        <div className="text-center mb-6">
          <Link to="/" className="inline-flex items-center gap-2">
            <span className="h-10 w-10 rounded-xl bg-white text-brand-600 flex items-center justify-center font-extrabold text-2xl shadow-xl shadow-brand-900/40">
              M
            </span>
            <span className="font-extrabold text-2xl text-white tracking-tight">
              MediPlain
            </span>
          </Link>
        </div>

        {/* Card Frame */}
        <div className="bg-white/95 dark:bg-slate-900/90 backdrop-blur-md rounded-2xl shadow-2xl p-6 sm:p-8 border border-white/20 dark:border-slate-800/80 transition-colors duration-200">
          <Outlet />
        </div>
      </div>
    </div>
  );
};
