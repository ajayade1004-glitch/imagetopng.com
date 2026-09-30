import React, { useState, useEffect } from 'react';
import { ShieldCheck, X } from 'lucide-react';

export const CookieBanner: React.FC = () => {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('imagetopng_cookie_consent');
    if (!consent) {
      // Delay showing slightly so it does not interfere with immediate conversion interaction
      const timer = setTimeout(() => setVisible(true), 1200);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('imagetopng_cookie_consent', 'accepted');
    setVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('imagetopng_cookie_consent', 'declined');
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <aside
      aria-label="Cookie consent banner"
      className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:max-w-md bg-white border border-slate-200 rounded-xl shadow-xl p-5 z-50 transition-all transform animate-fade-in"
    >
      <div className="flex items-start gap-3">
        <div className="p-2 bg-blue-50 text-blue-600 rounded-lg shrink-0">
          <ShieldCheck className="w-5 h-5" />
        </div>
        <div className="flex-1">
          <h2 className="text-sm font-semibold text-slate-900">Privacy & Cookie Preferences</h2>
          <p className="mt-1 text-xs text-slate-600 leading-relaxed">
            ImageToPNG processes your images completely inside your browser without uploading files to our servers. We use basic storage cookies to remember your preferences and ensure security.
          </p>
          <div className="mt-3 flex items-center gap-2">
            <button
              onClick={handleAccept}
              className="px-3.5 py-1.5 text-xs font-semibold rounded-md bg-blue-600 hover:bg-blue-700 text-white transition-colors cursor-pointer"
            >
              Accept Essential
            </button>
            <button
              onClick={handleDecline}
              className="px-3.5 py-1.5 text-xs font-medium rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
            >
              Decline Optional
            </button>
            <a
              href="/cookie-policy"
              className="text-xs text-slate-500 hover:text-blue-600 underline ml-auto"
            >
              Policy
            </a>
          </div>
        </div>
        <button
          onClick={() => setVisible(false)}
          aria-label="Dismiss cookie notice"
          className="text-slate-400 hover:text-slate-600 p-1 cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </aside>
  );
};
