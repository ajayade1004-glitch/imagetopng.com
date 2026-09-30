import React from 'react';
import { ShieldCheck, Cpu, EyeOff, Zap, CheckCircle2 } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface AboutPageProps {
  onNavigate: (path: string) => void;
}

export const AboutPage: React.FC<AboutPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Breadcrumbs items={[{ label: 'About Us' }]} onNavigate={onNavigate} />

      <section className="pt-8 pb-12 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-3">
            <span>Our Mission & Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            About ImageToPNG
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            ImageToPNG is a focused online image conversion utility built to provide fast, browser-based PNG conversions with no account or server uploads required.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
            Our Purpose & Philosophy
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            The web is flooded with image conversion websites that require users to upload confidential photos and documents to remote cloud servers, wait in artificial rate-limited queues, navigate misleading download buttons, or purchase monthly subscriptions for basic file format changes.
          </p>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed mt-3">
            ImageToPNG was created with a straightforward philosophy: modern web browsers possess sufficient graphics processing power through HTML5 Canvas and Web APIs to convert images locally on your device in milliseconds. By eliminating server-side processing, we offer an image utility that is faster, completely private, and forever free.
          </p>
        </section>

        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
            Core Principles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center mb-3">
                <EyeOff className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Total Privacy By Design</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Your images never leave your computer or mobile device. Conversion is executed entirely in client-side memory using the browser’s canvas rendering engine.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center mb-3">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Instant Local Execution</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                No network upload latency, no queue delays, and no server timeouts. Processing starts immediately when you choose your file.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-indigo-100 text-indigo-700 flex items-center justify-center mb-3">
                <Cpu className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Technical Honesty</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                We clearly document what PNG conversion can and cannot do. We will never falsely promise that converting a compressed JPEG into a PNG magically enhances lost image resolution.
              </p>
            </div>

            <div className="p-5 rounded-xl bg-slate-50 border border-slate-100">
              <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center mb-3">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h3 className="font-bold text-slate-900 text-sm mb-1">Accessible & Universal</h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                Engineered to run seamlessly across desktops, laptops, tablets, and smartphones on Windows, macOS, Linux, iOS, and Android.
              </p>
            </div>
          </div>
        </section>

        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
            Technical Architecture
          </h2>
          <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
            ImageToPNG is built using modern TypeScript, React, and native browser APIs including HTML5 Canvas 2D, File, Blob, and URL.createObjectURL. Multi-file batch archives are compressed directly in the browser using client-side DEFLATE algorithms via JSZip.
          </p>
          <div className="mt-4 space-y-2">
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Full compliance with W3C PNG Specification and modern web standards.</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Zero server-side image processing or remote file caching.</span>
            </div>
            <div className="flex items-center gap-2 text-xs sm:text-sm text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Automatic browser memory reclamation to prevent device sluggishness.</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
