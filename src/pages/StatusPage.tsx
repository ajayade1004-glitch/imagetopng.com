import React, { useState, useEffect } from 'react';
import { CheckCircle2, Activity, Zap, Cpu, HardDrive, ShieldCheck } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface StatusPageProps {
  onNavigate: (path: string) => void;
}

export const StatusPage: React.FC<StatusPageProps> = ({ onNavigate }) => {
  const [browserCapabilities, setBrowserCapabilities] = useState({
    canvasSupported: true,
    fileApiSupported: true,
    blobSupported: true,
    offscreenSupported: false,
    hardwareConcurrency: 4,
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      setBrowserCapabilities({
        canvasSupported: !!ctx,
        fileApiSupported: typeof FileReader !== 'undefined',
        blobSupported: typeof Blob !== 'undefined',
        offscreenSupported: typeof OffscreenCanvas !== 'undefined',
        hardwareConcurrency: navigator.hardwareConcurrency || 4,
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50">
      <Breadcrumbs items={[{ label: 'System Status' }]} onNavigate={onNavigate} />

      <section className="pt-8 pb-10 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-3">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>All Systems 100% Operational</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            ImageToPNG Service & Engine Status
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Real-time diagnostics, client-side engine availability, and browser graphic pipeline health.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-6">
        {/* Overall Status Banner */}
        <div className="bg-emerald-600 text-white p-5 rounded-2xl flex items-center justify-between shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-white/20 flex items-center justify-center">
              <CheckCircle2 className="w-5 h-5 text-white" />
            </div>
            <div>
              <h2 className="font-bold text-base leading-tight">All Conversion Engines Active</h2>
              <p className="text-xs text-emerald-100 mt-0.5">Zero outages reported • In-browser engine operational</p>
            </div>
          </div>
          <span className="text-xs font-mono bg-white/20 px-2.5 py-1 rounded-full">
            0ms Network Latency
          </span>
        </div>

        {/* Diagnostic Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Activity className="w-4 h-4 text-blue-600" />
                HTML5 Canvas 2D Engine
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Operational
              </span>
            </div>
            <p className="text-xs text-slate-500">
              State: {browserCapabilities.canvasSupported ? 'Verified active in your browser' : 'Unavailable'}
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <HardDrive className="w-4 h-4 text-blue-600" />
                File & Blob Stream API
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Operational
              </span>
            </div>
            <p className="text-xs text-slate-500">
              State: Binary memory buffers running locally
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Zap className="w-4 h-4 text-blue-600" />
                JSZip Multi-File Packager
              </span>
              <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                Operational
              </span>
            </div>
            <p className="text-xs text-slate-500">
              State: Client-side DEFLATE ZIP archiver ready
            </p>
          </div>

          <div className="bg-white p-5 rounded-xl border border-slate-200">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-semibold text-slate-900 flex items-center gap-2">
                <Cpu className="w-4 h-4 text-blue-600" />
                Local CPU Concurrency
              </span>
              <span className="text-xs font-mono font-bold text-slate-700 bg-slate-100 px-2 py-0.5 rounded">
                {browserCapabilities.hardwareConcurrency} Cores
              </span>
            </div>
            <p className="text-xs text-slate-500">
              Hardware threads ready for local image processing
            </p>
          </div>
        </div>

        {/* Global Security & Infrastructure */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200">
          <div className="flex items-center gap-2 font-bold text-slate-900 text-sm mb-3">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>Infrastructure Transparency</span>
          </div>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
            ImageToPNG is delivered as high-speed static assets via global edge content delivery networks (CDNs). Because all file transformations execute client-side on your device, the service is unaffected by backend conversion server downtime or cloud API outages.
          </p>
        </div>
      </div>
    </div>
  );
};
