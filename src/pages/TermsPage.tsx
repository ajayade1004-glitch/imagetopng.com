import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface TermsPageProps {
  onNavigate: (path: string) => void;
}

export const TermsPage: React.FC<TermsPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Breadcrumbs items={[{ label: 'Terms of Use' }]} onNavigate={onNavigate} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white p-6 sm:p-12 rounded-2xl border border-slate-200 prose prose-slate max-w-none">
          <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mb-2">
            Terms of Use
          </h1>
          <p className="text-xs text-slate-500 mb-8">Last Updated: September 30, 2026</p>

          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">1. Agreement to Terms</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            By accessing or using ImageToPNG (https://imagetopng.com), you agree to be bound by these Terms of Use. If you do not agree to all terms, please refrain from using our service.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">2. Description of Service</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            ImageToPNG provides a free, client-side digital conversion utility allowing users to convert raster and vector image formats (including JPG, WEBP, GIF, BMP, SVG, and others) into the Portable Network Graphics (PNG) format using local web browser capabilities.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">3. Acceptable Use and User Responsibility</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            You retain all ownership and copyright to any images you convert using ImageToPNG. Because conversion occurs locally within your web browser, you are exclusively responsible for the content of your files and ensuring that your use of the images does not infringe upon any third-party intellectual property rights.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">4. Intellectual Property</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            All proprietary code, branding, layouts, graphic illustrations, and educational content on ImageToPNG are the property of ImageToPNG and are protected by applicable copyright laws.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">5. Disclaimer of Warranties</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            ImageToPNG is provided on an "AS IS" and "AS AVAILABLE" basis without warranties of any kind. While our conversion algorithms are rigorously engineered for accuracy and safety, we do not warrant that the service will be uninterrupted, error-free, or compatible with corrupted or non-standard file encodings.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">6. Limitation of Liability</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            In no event shall ImageToPNG or its contributors be liable for any indirect, incidental, or consequential damages resulting from the use or inability to use the service.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">7. Modifications to Terms</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            We reserve the right to revise these Terms of Use at any time. Continued use of ImageToPNG following changes indicates acceptance of the updated terms.
          </p>

          <h2 className="text-xl font-bold text-slate-900 mt-6 mb-3">8. Contact Information</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            For questions regarding these Terms, contact us at <strong className="font-mono text-slate-800">legal@imagetopng.com</strong>.
          </p>
        </div>
      </div>
    </div>
  );
};
