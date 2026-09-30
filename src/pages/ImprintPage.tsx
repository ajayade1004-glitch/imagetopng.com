import React from 'react';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface ImprintPageProps {
  onNavigate: (path: string) => void;
}

export const ImprintPage: React.FC<ImprintPageProps> = ({ onNavigate }) => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Breadcrumbs items={[{ label: 'Imprint (Impressum)' }]} onNavigate={onNavigate} />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="bg-white p-6 sm:p-12 rounded-2xl border border-slate-200 prose prose-slate max-w-none">
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-2">
            Imprint / Legal Information
          </h1>
          <p className="text-xs text-slate-500 mb-8">Published in accordance with statutory information requirements.</p>

          <h2 className="text-lg font-bold text-slate-900 mt-6 mb-2">Service Provider & Publication</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            <strong>Website:</strong> ImageToPNG Pro (https://imagetopng.com)<br />
            <strong>Primary Operation:</strong> Free Online Image to PNG Conversion Utility<br />
            <strong>Location:</strong> Mumbai, India
          </p>

          <h2 className="text-lg font-bold text-slate-900 mt-6 mb-2">Contact Details</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            <strong>General Inquiries:</strong> support@imagetopng.com<br />
            <strong>Privacy & Security:</strong> privacy@imagetopng.com<br />
            <strong>Legal Correspondence:</strong> legal@imagetopng.com
          </p>

          <h2 className="text-lg font-bold text-slate-900 mt-6 mb-2">Technical Delivery & Architecture</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            ImageToPNG operates as a client-side digital utility. All raster and vector image transformations, pixel readbacks, and PNG encodings occur locally within the end-user’s web browser. No user-supplied media files or images are stored or processed on web servers.
          </p>

          <h2 className="text-lg font-bold text-slate-900 mt-6 mb-2">Disclaimer & Intellectual Property</h2>
          <p className="text-sm text-slate-600 leading-relaxed">
            The content, design, code, and graphical illustrations on this website are protected under copyright laws. All trademarks, registered trademarks, product names, and company names or logos mentioned on the site belong to their respective owners.
          </p>
        </div>
      </div>
    </div>
  );
};
