import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface PrivacyPolicyPageProps {
  onNavigate: (path: string) => void;
}

export const PrivacyPolicyPage: React.FC<PrivacyPolicyPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Breadcrumbs items={[{ label: 'Privacy Policy' }]} onNavigate={onNavigate} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white p-6 sm:p-12 rounded-2xl border border-slate-200 prose prose-slate max-w-none">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Privacy Policy
          </h1>
          <p className="text-xs text-slate-500 mb-8">Effective Date: September 30, 2026</p>

          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">1. Overview & Core Privacy Guarantee</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            At ImageToPNG (accessible from https://imagetopng.com), one of our primary priorities is the privacy of our visitors. This Privacy Policy document outlines the types of information that is collected and recorded by ImageToPNG and how we use it.
          </p>
          <div className="p-4 my-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-900">
            <strong>Key Guarantee:</strong> Image conversion performed on ImageToPNG takes place entirely within your local web browser. Your uploaded images are never transferred over the internet to our web servers, never stored in remote databases, and never inspected by third parties.
          </div>

          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">2. In-Browser Image Processing</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            When you select or drag an image into ImageToPNG:
          </p>
          <ul className="text-sm text-slate-600 space-y-1 list-disc pl-5 mt-2">
            <li>The image file is read locally via the HTML5 File API.</li>
            <li>Image rasterization and PNG encoding take place in your device’s volatile RAM memory using the Canvas API.</li>
            <li>Temporary memory references (Object URLs) are systematically released and revoked once the download is initiated or when you leave the page.</li>
            <li>No copies of your image data are sent to any remote server or third-party cloud processing API.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">3. Log Files & Server Metrics</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Like most websites, our web hosting provider may log non-identifiable technical requests (such as your browser type, operating system, referring URL, time stamp, and internet protocol IP address) strictly for load balancing, DDoS protection, and server health diagnostics. These server logs do not contain any visual data, photo content, or personal files.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">4. Cookies and Local Storage</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            ImageToPNG uses browser <code className="text-xs bg-slate-100 px-1 py-0.5 rounded">localStorage</code> to remember your privacy choices (e.g. cookie banner consent status). We do not use intrusive cross-site tracking cookies. If advertising or analytics networks are integrated in the future, cookie preferences will be governed by explicit user consent in accordance with GDPR and CCPA.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">5. Third-Party Advertising Partners</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            Third-party ad servers or ad networks (such as Google AdSense) may serve advertisements directly to your browser when ads are enabled. They automatically receive your IP address when this occurs. You may consult the respective privacy policies of these third-party ad servers for more detailed information on their practices.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">6. GDPR Data Protection Rights</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            We ensure you are fully aware of all your data protection rights. Every user is entitled to the following:
          </p>
          <ul className="text-sm text-slate-600 space-y-1 list-disc pl-5 mt-2">
            <li>The right to access – You have the right to request copies of your personal data.</li>
            <li>The right to rectification – You have the right to request that we correct any information you believe is inaccurate.</li>
            <li>The right to erasure – You have the right to request that we erase your personal data under certain conditions.</li>
          </ul>

          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">7. Contact Information</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            If you have additional questions or require more information about our Privacy Policy, do not hesitate to contact us at <strong className="font-mono text-slate-800">privacy@imagetopng.com</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
