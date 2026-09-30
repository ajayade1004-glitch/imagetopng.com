import React, { useState } from 'react';
import { Bug, Send } from 'lucide-react';
import { Breadcrumbs } from '../components/Breadcrumbs';

interface ReportBugPageProps {
  onNavigate: (path: string) => void;
}

export const ReportBugPage: React.FC<ReportBugPageProps> = ({ onNavigate }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [browser, setBrowser] = useState('Chrome');
  const [os, setOs] = useState('Windows');
  const [format, setFormat] = useState('JPG');
  const [category, setCategory] = useState('Conversion Failed');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const mailtoRecipient = 'bugs@imagetopng.com';
    const emailSubject = `Bug Report [${category}] - ${format} to PNG`;
    const emailBody = `Reporter: ${name} (${email})\nOperating System: ${os}\nBrowser: ${browser}\nImage Format: ${format}\nCategory: ${category}\n\nBug Description:\n${description}`;
    
    window.location.href = `mailto:${mailtoRecipient}?subject=${encodeURIComponent(
      emailSubject
    )}&body=${encodeURIComponent(emailBody)}`;
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <Breadcrumbs items={[{ label: 'Report a Bug' }]} onNavigate={onNavigate} />

      <section className="pt-8 pb-12 bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-red-50 text-red-700 border border-red-200 mb-3">
            <Bug className="w-3.5 h-3.5" />
            <span>Technical Quality Control</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Report an Issue or Bug
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 max-w-xl mx-auto leading-relaxed">
            Did an image fail to decode, produce unexpected dimensions, or behave erratically on your device? Help us diagnose and resolve browser-specific rendering bugs.
          </p>
        </div>
      </section>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label htmlFor="bug-name" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Your Name
                </label>
                <input
                  id="bug-name"
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Alex Rivera"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="bug-email" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Email Address
                </label>
                <input
                  id="bug-email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="alex@example.com"
                  className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label htmlFor="bug-category" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Category
                </label>
                <select
                  id="bug-category"
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Conversion Failed">Conversion Failed</option>
                  <option value="Upload Failed">Upload Failed</option>
                  <option value="Download Failed">Download Failed</option>
                  <option value="Wrong Output">Wrong Output Dimensions</option>
                  <option value="Mobile Issue">Mobile Browser Issue</option>
                  <option value="Performance Issue">High Memory / Freeze</option>
                  <option value="Other">Other Problem</option>
                </select>
              </div>

              <div>
                <label htmlFor="bug-browser" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Browser
                </label>
                <select
                  id="bug-browser"
                  value={browser}
                  onChange={(e) => setBrowser(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Chrome">Google Chrome</option>
                  <option value="Safari">Apple Safari</option>
                  <option value="Firefox">Mozilla Firefox</option>
                  <option value="Edge">Microsoft Edge</option>
                  <option value="Opera">Opera</option>
                  <option value="Brave">Brave</option>
                  <option value="Other">Other Browser</option>
                </select>
              </div>

              <div>
                <label htmlFor="bug-os" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                  Operating System
                </label>
                <select
                  id="bug-os"
                  value={os}
                  onChange={(e) => setOs(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                  <option value="Windows">Windows</option>
                  <option value="macOS">macOS</option>
                  <option value="iOS">iOS (iPhone/iPad)</option>
                  <option value="Android">Android</option>
                  <option value="Linux">Linux</option>
                  <option value="ChromeOS">ChromeOS</option>
                </select>
              </div>
            </div>

            <div>
              <label htmlFor="bug-format" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Image Format Involved
              </label>
              <input
                id="bug-format"
                type="text"
                value={format}
                onChange={(e) => setFormat(e.target.value)}
                placeholder="e.g. JPG, WEBP, AVIF, HEIC, 48-bit TIFF"
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="bug-description" className="block text-xs font-semibold text-slate-700 uppercase tracking-wider mb-1">
                Detailed Problem Description
              </label>
              <textarea
                id="bug-description"
                rows={4}
                required
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Please describe what happened, including approximate image resolution, file size, or any error message displayed..."
                className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-y"
              />
            </div>

            <button
              type="submit"
              className="w-full inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 shadow-md shadow-blue-600/20 transition-all cursor-pointer text-sm"
            >
              <Send className="w-4 h-4" />
              <span>Submit Report via Email</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
