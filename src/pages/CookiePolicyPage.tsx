import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface CookiePolicyPageProps {
  onNavigate: (path: string) => void;
}

export const CookiePolicyPage: React.FC<CookiePolicyPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Breadcrumbs items={[{ label: 'Cookie Policy' }]} onNavigate={onNavigate} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white p-6 sm:p-12 rounded-2xl border border-slate-200 prose prose-slate max-w-none">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Cookie Policy
          </h1>
          <p className="text-xs text-slate-500 mb-8">Last Updated: September 30, 2026</p>

          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">1. What Are Cookies?</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Cookies are small text files that are stored on your device when you visit a website. They allow websites to remember user actions and preferences over a period of time, ensuring smooth operation.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">2. How ImageToPNG Uses Cookies</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            ImageToPNG uses minimal client-side browser storage strictly for:
          </p>
          <ul className="text-sm text-slate-600 space-y-1 list-disc pl-5 mt-2">
            <li><strong>Essential Storage:</strong> Storing your privacy and cookie acceptance preferences in localStorage so you do not see repeated consent banners.</li>
            <li><strong>Session Integrity:</strong> Facilitating temporary client-side memory pointers during active in-browser file conversion.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">3. Third-Party & Advertising Cookies</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            We currently do not deploy intrusive third-party cross-site behavioral tracking cookies. When advertising partners (such as Google AdSense) are active, they may set cookies to serve relevant, non-intrusive ads based on your visit history. You have full control over advertising cookies through your browser settings or privacy consent dialogue.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">4. Managing Your Cookie Preferences</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            You can modify your browser settings to decline all cookies or to alert you when a cookie is being sent. However, declining essential browser storage may impact UI preferences.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">5. Contact Us</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            If you have questions regarding our use of cookies, email us at <strong className="font-mono text-slate-800">support@imagetopng.com</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
