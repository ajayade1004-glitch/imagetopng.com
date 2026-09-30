import React from 'react';
import {
  Zap,
  ShieldCheck,
  Stamp,
  Palette,
  FileEdit,
  Sparkles,
  CheckCircle2,
} from 'lucide-react';

export const ProFeatureShowcase: React.FC = () => {
  const features = [
    {
      icon: Zap,
      color: 'from-amber-500 to-orange-500',
      badge: 'OPTIMIZATION',
      title: 'PNG Optimization',
      description:
        'Optionally optimize generated PNG files directly on your device using client-side color quantization to reduce file size while preserving high visual quality.',
    },
    {
      icon: Stamp,
      color: 'from-purple-500 to-indigo-600',
      badge: 'UTILITY',
      title: 'Watermark & Stamp Tool',
      description:
        'Protect your creative and commercial images with custom text or tiled watermark overlays, adjustable opacity, and configurable placement grids.',
    },
    {
      icon: ShieldCheck,
      color: 'from-emerald-500 to-teal-600',
      badge: 'METADATA',
      title: 'EXIF Metadata Exclusion',
      description:
        'Our client-side canvas rasterization renders raw pixel data into the PNG container, naturally excluding original container EXIF, camera, and GPS tags.',
    },
    {
      icon: Palette,
      color: 'from-pink-500 to-rose-600',
      badge: 'DESIGNER',
      title: 'Dominant Color & HEX Extractor',
      description:
        'Sample dominant color harmonies from your converted image and copy standard HEX color codes or CSS variables directly to your clipboard.',
    },
    {
      icon: FileEdit,
      color: 'from-cyan-500 to-blue-600',
      badge: 'PRODUCTIVITY',
      title: 'Batch Filename Formatter',
      description:
        'Organize your converted files with custom naming templates, automated numbering sequences, date prefixes, and standardized web slugs.',
    },
    {
      icon: Sparkles,
      color: 'from-blue-600 to-indigo-600',
      badge: 'EFFICIENCY',
      title: 'In-Browser Image Studio',
      description:
        'Crop, rotate, flip, adjust contrast and brightness, apply rounded corners, or customize background fills before downloading your final PNG.',
    },
  ];

  return (
    <section className="py-12 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase bg-blue-50 text-blue-700 border border-blue-200 mb-3 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5 text-blue-600" />
          <span>More Free Image Tools</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Additional Client-Side Editing Tools
        </h2>
        <p className="text-slate-600 text-xs sm:text-sm mt-2 leading-relaxed">
          Powered by HTML5 Canvas and modern browser capabilities. All tools operate locally in your web browser with no account or subscription required.
        </p>
      </div>

      {/* Feature Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {features.map((f, i) => {
          const Icon = f.icon;
          return (
            <div
              key={i}
              className="bg-white border border-slate-200/80 rounded-2xl p-5 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-tr ${f.color} text-white flex items-center justify-center shadow-sm group-hover:scale-105 transition-transform`}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-[10px] font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-slate-100 text-slate-700">
                    {f.badge}
                  </span>
                </div>

                <h3 className="text-sm font-bold text-slate-900 mb-1.5 group-hover:text-blue-600 transition-colors">
                  {f.title}
                </h3>
                <p className="text-slate-500 text-xs leading-relaxed">
                  {f.description}
                </p>
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                <span>Runs Locally in Browser</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
