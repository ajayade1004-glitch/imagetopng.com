import React from 'react';
import { Home, ArrowRight, Zap, AlertCircle } from 'lucide-react';

interface NotFoundPageProps {
  onNavigate: (path: string) => void;
}

export const NotFoundPage: React.FC<NotFoundPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-[70vh] flex items-center justify-center bg-slate-50 px-4 py-16">
      <div className="max-w-md w-full bg-white p-8 rounded-2xl border border-slate-200 text-center shadow-sm">
        <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
          <AlertCircle className="w-7 h-7" />
        </div>

        <span className="text-xs font-bold text-blue-600 uppercase tracking-widest">404 Error</span>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1 mb-2">
          Page Not Found
        </h1>
        <p className="text-sm text-slate-600 mb-6">
          The page or format converter you requested could not be found or may have been moved.
        </p>

        <div className="space-y-2">
          <button
            onClick={() => {
              onNavigate('/');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm transition-colors cursor-pointer"
          >
            <Zap className="w-4 h-4" />
            <span>Image to PNG Converter</span>
          </button>

          <button
            onClick={() => {
              onNavigate('/');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium text-xs transition-colors cursor-pointer"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return to Homepage</span>
          </button>
        </div>

        <div className="mt-6 pt-6 border-t border-slate-100 text-left">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block mb-2">
            Popular Converters
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <button
              onClick={() => onNavigate('/jpg-to-png')}
              className="text-left py-1 text-slate-600 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
            >
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span>JPG to PNG</span>
            </button>
            <button
              onClick={() => onNavigate('/webp-to-png')}
              className="text-left py-1 text-slate-600 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
            >
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span>WEBP to PNG</span>
            </button>
            <button
              onClick={() => onNavigate('/gif-to-png')}
              className="text-left py-1 text-slate-600 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
            >
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span>GIF to PNG</span>
            </button>
            <button
              onClick={() => onNavigate('/svg-to-png')}
              className="text-left py-1 text-slate-600 hover:text-blue-600 flex items-center gap-1 cursor-pointer"
            >
              <ArrowRight className="w-3 h-3 text-slate-400" />
              <span>SVG to PNG</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
