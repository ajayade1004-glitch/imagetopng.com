import React from 'react';
import { Shield, Lock, EyeOff, Cpu, CheckCircle2, ServerOff } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface SecurityPageProps {
  onNavigate: (path: string) => void;
}

export const SecurityPage: React.FC<SecurityPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Breadcrumbs items={[{ label: 'Security' }]} onNavigate={onNavigate} />

      <section className="pt-8 pb-10 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200 mb-3">
            <Shield className="w-3.5 h-3.5 text-emerald-600" />
            <span>Zero-Trust Architecture</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">
            Security & Data Protection
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            How ImageToPNG protects user files through client-side browser execution with zero server uploads.
          </p>
        </div>
      </section>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
        {/* Core Guarantee Card */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl shrink-0">
              <ServerOff className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold text-slate-900">
                Zero Cloud Uploads: Our Fundamental Security Guarantee
              </h2>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Unlike conventional conversion websites that upload your personal photographs, confidential documents, and proprietary assets to unknown third-party cloud servers, ImageToPNG is engineered with a strict <strong>Zero-Server Data Architecture</strong>.
              </p>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">
                Your images never leave the sandboxed environment of your device’s browser. The conversion algorithm executes locally in volatile system RAM using native HTML5 Canvas and File APIs.
              </p>
            </div>
          </div>
        </section>

        {/* Technical Security Layers */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-4">
            Security Defense Mechanisms
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm mb-1">
                <Lock className="w-4 h-4 text-blue-600" />
                <span>Browser Sandboxing</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Image processing executes within your browser’s isolated security sandbox, preventing external network interception.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm mb-1">
                <EyeOff className="w-4 h-4 text-blue-600" />
                <span>No Data Persistence</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Temporary object memory references are systematically revoked using <code className="font-mono bg-slate-200 px-1 py-0.5 rounded text-[11px]">URL.revokeObjectURL()</code> immediately after download.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm mb-1">
                <Cpu className="w-4 h-4 text-blue-600" />
                <span>Hardware Acceleration</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                Fast local rasterization using client GPU/CPU without transmitting binary data packets across the internet.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
              <div className="flex items-center gap-2 font-semibold text-slate-900 text-sm mb-1">
                <Shield className="w-4 h-4 text-blue-600" />
                <span>HTTPS & Strict Transport</span>
              </div>
              <p className="text-xs text-slate-600 leading-relaxed">
                The static application bundle is delivered over encrypted TLS with modern HTTP security headers.
              </p>
            </div>
          </div>
        </section>

        {/* Verification Checklist */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 mb-3">
            How You Can Verify Locally
          </h3>
          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed mb-4">
            You do not have to take our word for it. You can independently verify that zero image bytes leave your machine:
          </p>
          <div className="space-y-2 text-xs sm:text-sm text-slate-700">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Open your browser’s Developer Tools (Press F12 or Right Click ➔ Inspect).</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Click on the <strong>Network</strong> tab.</span>
            </div>
            <div className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Upload an image and convert it: notice that <strong>zero outbound POST/PUT network requests</strong> containing your image data are sent.</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};
