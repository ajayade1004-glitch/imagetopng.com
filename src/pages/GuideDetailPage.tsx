import React from 'react';
import { Clock, Calendar, ArrowRight, Zap, BookOpen } from 'lucide-react';
import { GuideArticle } from '../types';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { AdPlaceholder } from '../components/AdPlaceholder';

interface GuideDetailPageProps {
  guide: GuideArticle;
  onNavigate: (path: string) => void;
}

export const GuideDetailPage: React.FC<GuideDetailPageProps> = ({ guide, onNavigate }) => {
  // Schema.org Article JSON-LD
  const articleSchema = {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: guide.title,
    description: guide.metaDescription,
    author: {
      '@type': 'Organization',
      name: 'ImageToPNG Engineering Team',
    },
    publisher: {
      '@type': 'Organization',
      name: 'ImageToPNG',
      logo: {
        '@type': 'ImageObject',
        url: 'https://imagetopng.com/icon.svg',
      },
    },
    dateModified: '2026-09-30',
    mainEntityOfPage: `https://imagetopng.com/guides/${guide.slug}`,
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

      <Breadcrumbs
        items={[
          { label: 'Guides', href: '/guides' },
          { label: guide.title },
        ]}
        onNavigate={onNavigate}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <header className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 mb-8">
          <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mb-4">
            <span className="font-semibold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200 uppercase tracking-wider text-[11px]">
              {guide.category}
            </span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5 text-slate-400" />
              {guide.readingTime}
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              Updated {guide.lastUpdated}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
            {guide.title}
          </h1>

          <p className="mt-4 text-sm sm:text-base text-slate-600 leading-relaxed border-l-2 border-blue-600 pl-4 py-0.5">
            {guide.summary}
          </p>
        </header>

        {/* Ad slot placeholder */}
        <AdPlaceholder format="horizontal" />

        {/* Article Body */}
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-slate-200 space-y-8 text-slate-700">
          {guide.content.map((section, idx) => (
            <section key={idx} className="space-y-4">
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight">
                {section.sectionHeading}
              </h2>

              {section.paragraphs.map((p, pIdx) => (
                <p key={pIdx} className="text-sm sm:text-base leading-relaxed text-slate-600">
                  {p}
                </p>
              ))}

              {section.listItems && (
                <ul className="space-y-2 pl-4 text-sm sm:text-base text-slate-600 list-disc">
                  {section.listItems.map((li, lIdx) => (
                    <li key={lIdx}>{li}</li>
                  ))}
                </ul>
              )}

              {section.callout && (
                <div className="my-6 p-4 rounded-xl bg-blue-50/70 border border-blue-200">
                  <h4 className="font-bold text-blue-900 text-sm mb-1">{section.callout.title}</h4>
                  <p className="text-xs sm:text-sm text-blue-800 leading-relaxed">
                    {section.callout.text}
                  </p>
                </div>
              )}
            </section>
          ))}

          {/* Inline Action CTA */}
          <div className="mt-10 p-6 rounded-xl bg-slate-50 border border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div>
              <h3 className="font-bold text-slate-900 text-base">Test Image to PNG Conversion Now</h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Convert your images 100% locally in your browser with zero data uploads.
              </p>
            </div>
            <button
              onClick={() => {
                onNavigate('/');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-sm transition-colors cursor-pointer shrink-0"
            >
              <Zap className="w-4 h-4" />
              <span>Open Converter</span>
            </button>
          </div>
        </div>

        {/* Related Guides */}
        {guide.relatedGuides.length > 0 && (
          <div className="mt-8 bg-white p-6 rounded-2xl border border-slate-200">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-4 h-4 text-blue-600" />
              <h3 className="font-bold text-slate-900 text-base">Recommended Reading</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {guide.relatedGuides.map((relSlug) => (
                <button
                  key={relSlug}
                  onClick={() => {
                    onNavigate(`/guides/${relSlug}`);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 hover:bg-blue-50 border border-slate-200 text-xs font-medium text-slate-700 hover:text-blue-700 transition-colors cursor-pointer"
                >
                  <span className="capitalize">{relSlug.replace(/-/g, ' ')}</span>
                  <ArrowRight className="w-3 h-3 text-slate-400" />
                </button>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  );
};
