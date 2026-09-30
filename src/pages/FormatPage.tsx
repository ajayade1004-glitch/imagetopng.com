import React, { useState } from 'react';
import {
  ChevronDown,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  HelpCircle,
  Cpu,
  Code2,
  Sparkles,
  Layers,
  Terminal,
} from 'lucide-react';
import { FormatData } from '../types';
import { Breadcrumbs } from '../components/Breadcrumbs';
import { MainConverter } from '../components/MainConverter';
import { TransparentPngIllustration } from '../components/OriginalIllustrations';

interface FormatPageProps {
  format: FormatData;
  onNavigate: (path: string) => void;
}

export const FormatPage: React.FC<FormatPageProps> = ({ format, onNavigate }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [activeSnippetIndex, setActiveSnippetIndex] = useState(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // Schema.org FAQPage for this specific format
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: format.faq.map((f) => ({
      '@type': 'Question',
      name: f.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: f.answer,
      },
    })),
  };

  // Schema.org SoftwareApplication / HowTo schema for rich snippets
  const howToSchema = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: `How to Convert ${format.sourceFormat} to PNG`,
    description: format.metaDescription,
    step: format.conversionSteps.map((step) => ({
      '@type': 'HowToStep',
      position: step.step,
      name: step.title,
      text: step.description,
    })),
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Dynamic Schemas */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      {/* Breadcrumbs */}
      <Breadcrumbs
        items={[
          { label: 'Converters', href: '/' },
          { label: `${format.sourceFormat} to PNG` },
        ]}
        onNavigate={onNavigate}
      />

      {/* Hero Section */}
      <section className="pt-5 pb-8 sm:pt-6 sm:pb-10 bg-gradient-to-b from-blue-50/60 via-slate-50 to-slate-50 border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          {/* Quick Technical Specs Badge Bar */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3">
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
              <span>{format.sourceFormat} ➔ PNG</span>
            </span>
            <span className="font-mono text-[11px] bg-slate-100 text-slate-700 px-2 py-0.5 rounded-full border border-slate-200">
              {format.magicBytes}
            </span>
            <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              100% In-Browser
            </span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-3.5xl font-black text-slate-900 tracking-tight leading-tight">
            {format.h1}
          </h1>

          <p className="mt-2 text-xs sm:text-sm text-slate-600 max-w-2xl mx-auto leading-relaxed">
            {format.intro}
          </p>

          {/* Interactive Converter Pre-configured for this format */}
          <div className="mt-5">
            <MainConverter sourceFormatFilter={format.sourceFormat} />
          </div>
        </div>
      </section>

      {/* Main Informational Body */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* GEO Direct Answer Box (for AI Search Engines: ChatGPT, Gemini, Perplexity) */}
        <section className="p-6 sm:p-8 rounded-2xl bg-gradient-to-br from-blue-50/90 to-indigo-50/80 border border-blue-200/80 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-bold text-blue-800 uppercase tracking-wider mb-2">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>Definition & Architectural Summary</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
            What is {format.sourceFormat} to PNG Conversion?
          </h2>
          <p className="text-sm sm:text-base text-slate-700 leading-relaxed font-medium">
            {format.geoDefinition}
          </p>
        </section>

        {/* Section: Technical Deep Dive */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blue-600" />
            <span>Technical Architecture of {format.sourceFormat}</span>
          </h2>
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
            {format.whatIsFormat}
          </p>
        </section>

        {/* Section: Benchmark Comparison Table */}
        {format.benchmarks && format.benchmarks.length > 0 && (
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-2">
              {format.sourceFormat} vs. PNG: Technical Benchmarks
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 mb-6">
              Side-by-side performance, compression fidelity, and software compatibility metrics.
            </p>

            <div className="overflow-x-auto rounded-xl border border-slate-200">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead className="bg-slate-100 text-slate-800 font-bold border-b border-slate-200">
                  <tr>
                    <th className="py-3 px-4">Metric</th>
                    <th className="py-3 px-4">{format.sourceFormat}</th>
                    <th className="py-3 px-4 text-blue-700 bg-blue-50/50">PNG Output</th>
                    <th className="py-3 px-4 text-emerald-700">Advantage</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {format.benchmarks.map((b, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50">
                      <td className="py-3 px-4 font-semibold text-slate-900">{b.metric}</td>
                      <td className="py-3 px-4 text-slate-600">{b.sourceValue}</td>
                      <td className="py-3 px-4 text-blue-700 bg-blue-50/20 font-medium">{b.pngValue}</td>
                      <td className="py-3 px-4 text-emerald-700 font-semibold">{b.advantage}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* Section: Why convert to PNG? */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            <span>Why Convert {format.sourceFormat} to PNG?</span>
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {format.whyConvert.map((reason, idx) => (
              <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-700 leading-relaxed">{reason}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Section: AI Generator Ecosystem & Modern Workflow */}
        {format.aiEcosystemNotes && (
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-indigo-600" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                AI Generation & Modern Design Ecosystem
              </h2>
            </div>
            <p className="text-sm sm:text-base text-slate-600 leading-relaxed">
              {format.aiEcosystemNotes}
            </p>
          </section>
        )}

        {/* Section: Real Industry Use Cases */}
        {format.useCases && format.useCases.length > 0 && (
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
              Practical Industry Use Cases
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {format.useCases.map((uc, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h3 className="font-bold text-slate-900 text-sm mb-1">{uc.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{uc.description}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section: Developer Code Snippets */}
        {format.developerSnippets && format.developerSnippets.length > 0 && (
          <section className="bg-slate-900 text-white p-6 sm:p-8 rounded-2xl shadow-md">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Code2 className="w-5 h-5 text-blue-400" />
                <h2 className="text-lg sm:text-xl font-bold">Developer Implementation Recipes</h2>
              </div>
              <div className="flex items-center gap-1">
                {format.developerSnippets.map((s, sIdx) => (
                  <button
                    key={sIdx}
                    onClick={() => setActiveSnippetIndex(sIdx)}
                    className={`px-2.5 py-1 rounded text-xs font-mono transition-colors cursor-pointer ${
                      activeSnippetIndex === sIdx
                        ? 'bg-blue-600 text-white font-bold'
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {s.language.split(' ')[0]}
                  </button>
                ))}
              </div>
            </div>

            <p className="text-xs text-slate-400 mb-3">
              {format.developerSnippets[activeSnippetIndex]?.title}
            </p>

            <div className="bg-slate-950 p-4 rounded-xl border border-slate-800 font-mono text-xs overflow-x-auto text-emerald-400">
              <pre>{format.developerSnippets[activeSnippetIndex]?.code}</pre>
            </div>
          </section>
        )}

        {/* Graphic Alpha Illustration */}
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs">
          <h3 className="text-base font-bold text-slate-900 mb-3 text-center">
            Alpha Transparency & Background Visualizer
          </h3>
          <TransparentPngIllustration />
        </div>

        {/* Section: Technical Considerations */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
            Technical Considerations ({format.sourceFormat} ➔ PNG)
          </h2>
          <div className="space-y-6">
            <div className="border-l-4 border-blue-600 pl-4 py-1">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Transparency & Alpha Channels
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                {format.transparencySupport}
              </p>
            </div>

            <div className="border-l-4 border-emerald-600 pl-4 py-1">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                Image Quality & Pixel Integrity
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                {format.qualityNotes}
              </p>
            </div>

            <div className="border-l-4 border-amber-500 pl-4 py-1">
              <h3 className="font-bold text-slate-900 text-sm sm:text-base">
                File Size Behavior & Compression
              </h3>
              <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                {format.fileSizeNotes}
              </p>
            </div>
          </div>
        </section>

        {/* Section: Step by Step Guide */}
        <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-6">
            How to Convert {format.sourceFormat} to PNG Step-by-Step
          </h2>
          <div className="space-y-4">
            {format.conversionSteps.map((step) => (
              <div key={step.step} className="flex items-start gap-4">
                <span className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold text-xs flex items-center justify-center shrink-0 mt-0.5 shadow-xs">
                  {step.step}
                </span>
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">{step.title}</h4>
                  <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Section: Troubleshooting & Common Problems */}
        {format.troubleshooting.length > 0 && (
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-4">
              Common Problems & Troubleshooting
            </h2>
            <div className="space-y-3">
              {format.troubleshooting.map((item, idx) => (
                <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <h4 className="font-semibold text-slate-900 text-xs sm:text-sm">
                    {item.issue}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                    {item.solution}
                  </p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Section: Format FAQs */}
        {format.faq.length > 0 && (
          <section className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-xs">
            <div className="flex items-center gap-2 mb-4">
              <HelpCircle className="w-5 h-5 text-blue-600" />
              <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
                {format.sourceFormat} to PNG FAQs
              </h2>
            </div>
            <div className="space-y-3">
              {format.faq.map((faq, idx) => {
                const isOpen = openFaq === idx;
                return (
                  <div key={idx} className="border border-slate-200 rounded-xl overflow-hidden">
                    <button
                      onClick={() => toggleFaq(idx)}
                      className="w-full py-4 px-5 text-left font-semibold text-slate-800 text-xs sm:text-sm flex items-center justify-between cursor-pointer hover:bg-slate-50 transition-colors"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 shrink-0 transition-transform ${
                          isOpen ? 'rotate-180 text-blue-600' : ''
                        }`}
                      />
                    </button>
                    {isOpen && (
                      <div className="px-5 pb-5 pt-1 text-xs sm:text-sm text-slate-600 border-t border-slate-100 leading-relaxed">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </section>
        )}

        {/* Section: Related Converters */}
        <section className="bg-slate-100/70 p-6 sm:p-8 rounded-2xl border border-slate-200">
          <h3 className="font-bold text-slate-900 text-base mb-4">
            Related Converters & Formats
          </h3>
          <div className="flex flex-wrap gap-2">
            {format.relatedFormats.map((rel) => (
              <a
                key={rel}
                href={`/${rel}`}
                onClick={(e) => {
                  e.preventDefault();
                  onNavigate(`/${rel}`);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-xs font-semibold text-slate-700 hover:text-blue-600 hover:border-blue-300 transition-colors shadow-2xs"
              >
                <span>{rel.replace('-to-png', ' to PNG').replace('png-vs-', 'PNG vs ')}</span>
                <ArrowRight className="w-3 h-3 text-slate-400" />
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};
