import React, { useState } from 'react';
import { Download, Sparkles, Eye, Layers } from 'lucide-react';
import { downloadFile } from '../utils/converter';

export const FreePngSamples: React.FC = () => {
  const [activeBackground, setActiveBackground] = useState<'checkerboard' | 'dark' | 'light'>('checkerboard');

  // Generates genuine high-definition transparent PNG sample assets on-the-fly using Canvas
  const downloadSamplePng = (sampleId: string, name: string) => {
    const canvas = document.createElement('canvas');
    canvas.width = 600;
    canvas.height = 600;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, 600, 600);

    if (sampleId === 'logo') {
      // 1. Transparent Brand Logo & Emblem with feathered shadow
      ctx.shadowColor = 'rgba(0, 50, 150, 0.25)';
      ctx.shadowBlur = 24;
      ctx.shadowOffsetY = 12;

      // Hexagon base
      ctx.beginPath();
      const cx = 300, cy = 290, r = 160;
      for (let i = 0; i < 6; i++) {
        const a = (Math.PI / 3) * i - Math.PI / 6;
        const x = cx + r * Math.cos(a);
        const y = cy + r * Math.sin(a);
        if (i === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.closePath();

      const grad = ctx.createLinearGradient(140, 130, 460, 450);
      grad.addColorStop(0, '#2563eb');
      grad.addColorStop(1, '#059669');
      ctx.fillStyle = grad;
      ctx.fill();

      // Reset shadow for crisp inner icon
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = '#ffffff';

      // Inner 'PNG' Emblem text
      ctx.font = 'bold 72px system-ui, -apple-system, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText('PNG', cx, cy - 10);

      // Subtitle
      ctx.font = '600 24px system-ui, -apple-system, sans-serif';
      ctx.fillStyle = 'rgba(255, 255, 255, 0.85)';
      ctx.fillText('LOSSLESS', cx, cy + 45);

    } else if (sampleId === 'product') {
      // 2. Product-Style Graphic (Modern Audio Headphone / Gadget)
      // Soft translucent ground shadow (alpha blending)
      ctx.fillStyle = 'rgba(15, 23, 42, 0.18)';
      ctx.beginPath();
      ctx.ellipse(300, 490, 160, 24, 0, 0, Math.PI * 2);
      ctx.fill();

      // Headband arc
      ctx.strokeStyle = '#334155';
      ctx.lineWidth = 26;
      ctx.lineCap = 'round';
      ctx.beginPath();
      ctx.arc(300, 310, 140, Math.PI * 0.95, Math.PI * 2.05);
      ctx.stroke();

      // Ear cups
      const drawCup = (x: number, y: number) => {
        ctx.fillStyle = '#0f172a';
        ctx.beginPath();
        ctx.roundRect(x - 28, y - 55, 56, 110, 24);
        ctx.fill();

        // Cushion
        ctx.fillStyle = '#0284c7';
        ctx.beginPath();
        ctx.roundRect(x - 18, y - 45, 36, 90, 16);
        ctx.fill();
      };

      drawCup(170, 350);
      drawCup(430, 350);

    } else if (sampleId === 'ui-icon') {
      // 3. UI Icon & Translucent Glass Badge
      ctx.shadowColor = 'rgba(16, 185, 129, 0.3)';
      ctx.shadowBlur = 30;
      ctx.shadowOffsetY = 16;

      // Squircle background
      const grad = ctx.createLinearGradient(160, 160, 440, 440);
      grad.addColorStop(0, '#10b981');
      grad.addColorStop(1, '#047857');
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.roundRect(170, 170, 260, 260, 60);
      ctx.fill();

      // Shield graphic inside
      ctx.shadowColor = 'transparent';
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 14;
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      ctx.beginPath();
      ctx.moveTo(300, 230);
      ctx.lineTo(360, 260);
      ctx.lineTo(360, 320);
      ctx.quadraticCurveTo(360, 370, 300, 395);
      ctx.quadraticCurveTo(240, 370, 240, 320);
      ctx.lineTo(240, 260);
      ctx.closePath();
      ctx.stroke();

      // Checkmark
      ctx.beginPath();
      ctx.moveTo(275, 310);
      ctx.lineTo(295, 330);
      ctx.lineTo(335, 285);
      ctx.stroke();

    } else if (sampleId === 'gradient-orb') {
      // 4. Abstract Gradient Orb with Multi-Layer Alpha Blending
      const radGrad = ctx.createRadialGradient(260, 250, 20, 300, 300, 180);
      radGrad.addColorStop(0, 'rgba(251, 146, 60, 0.95)');
      radGrad.addColorStop(0.5, 'rgba(217, 70, 239, 0.85)');
      radGrad.addColorStop(0.85, 'rgba(79, 70, 229, 0.7)');
      radGrad.addColorStop(1, 'rgba(59, 130, 246, 0)');

      ctx.fillStyle = radGrad;
      ctx.beginPath();
      ctx.arc(300, 300, 180, 0, Math.PI * 2);
      ctx.fill();

      // Inner soft highlight
      const hlGrad = ctx.createRadialGradient(240, 220, 5, 240, 220, 80);
      hlGrad.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
      hlGrad.addColorStop(1, 'rgba(255, 255, 255, 0)');
      ctx.fillStyle = hlGrad;
      ctx.beginPath();
      ctx.arc(240, 220, 80, 0, Math.PI * 2);
      ctx.fill();
    }

    canvas.toBlob((blob) => {
      if (blob) {
        const url = URL.createObjectURL(blob);
        downloadFile(url, `${sampleId}-transparent-sample.png`);
        setTimeout(() => URL.revokeObjectURL(url), 10000);
      }
    }, 'image/png');
  };

  const samples = [
    {
      id: 'logo',
      name: 'Transparent Brand Logo',
      format: 'PNG (RGBA 32-bit)',
      size: '14.2 KB',
      description: 'Vector-sharp geometry with smooth anti-aliased contours and zero background fringing.',
      badge: 'Vector to PNG',
    },
    {
      id: 'product',
      name: 'Product-Style Graphic',
      format: 'PNG (RGBA 32-bit)',
      size: '22.8 KB',
      description: 'Floating hardware illustration with semi-transparent alpha shadow for e-commerce layouts.',
      badge: 'Product Cutout',
    },
    {
      id: 'ui-icon',
      name: 'App UI Icon & Badge',
      format: 'PNG (RGBA 32-bit)',
      size: '18.6 KB',
      description: 'Squircle security badge with translucent drop shadow designed for software interfaces.',
      badge: 'UI Asset',
    },
    {
      id: 'gradient-orb',
      name: 'Abstract Gradient Orb',
      format: 'PNG (RGBA 32-bit)',
      size: '28.4 KB',
      description: 'Continuous radial gradient demonstrating 256 levels of smooth alpha opacity.',
      badge: 'Alpha Blending',
    },
  ];

  return (
    <section className="py-14 bg-white border-y border-slate-200">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-700 border border-blue-200 mb-3">
            <Layers className="w-4 h-4 text-blue-600" />
            <span>Original Asset Demonstrations</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
            Transparent PNG Asset Examples
          </h2>
          <p className="mt-2 text-slate-600 text-sm sm:text-base leading-relaxed">
            Examine how 8-bit alpha transparency preserves soft contours, drop shadows, and anti-aliased boundaries seamlessly across varied background surfaces.
          </p>

          {/* Interactive Background Toggle */}
          <div className="mt-6 inline-flex items-center gap-1 bg-slate-100 p-1.5 rounded-xl border border-slate-200 text-xs font-semibold">
            <span className="text-slate-500 px-2 flex items-center gap-1">
              <Eye className="w-3.5 h-3.5" />
              <span>Backdrop:</span>
            </span>
            <button
              onClick={() => setActiveBackground('checkerboard')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                activeBackground === 'checkerboard'
                  ? 'bg-white text-blue-700 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Alpha Grid
            </button>
            <button
              onClick={() => setActiveBackground('dark')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                activeBackground === 'dark'
                  ? 'bg-slate-900 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Dark Surface
            </button>
            <button
              onClick={() => setActiveBackground('light')}
              className={`px-3 py-1 rounded-lg transition-colors cursor-pointer ${
                activeBackground === 'light'
                  ? 'bg-white text-slate-900 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Light Surface
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {samples.map((item) => (
            <div
              key={item.id}
              className="bg-slate-50 border border-slate-200 rounded-2xl overflow-hidden hover:shadow-md transition-all flex flex-col justify-between"
            >
              {/* Preview with Dynamic Backdrop */}
              <div
                className={`h-56 w-full flex items-center justify-center relative overflow-hidden border-b border-slate-200 transition-colors ${
                  activeBackground === 'dark' ? 'bg-slate-900' : activeBackground === 'light' ? 'bg-white' : ''
                }`}
                style={
                  activeBackground === 'checkerboard'
                    ? {
                        backgroundImage: `
                          linear-gradient(45deg, #cbd5e1 25%, transparent 25%), 
                          linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), 
                          linear-gradient(45deg, transparent 75%, #cbd5e1 75%), 
                          linear-gradient(-45deg, transparent 75%, #cbd5e1 75%)
                        `,
                        backgroundSize: '12px 12px',
                        backgroundColor: '#f1f5f9',
                      }
                    : undefined
                }
              >
                {/* SVG Visual Representation */}
                <div className="w-36 h-36 flex items-center justify-center">
                  {item.id === 'logo' && (
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                      <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill="url(#sampleLogoGrad)" />
                      <defs>
                        <linearGradient id="sampleLogoGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#2563eb" />
                          <stop offset="100%" stopColor="#059669" />
                        </linearGradient>
                      </defs>
                      <text x="50" y="47" fill="#ffffff" fontSize="18" fontWeight="900" textAnchor="middle">PNG</text>
                      <text x="50" y="63" fill="#ffffff" opacity="0.85" fontSize="7" fontWeight="700" textAnchor="middle">LOSSLESS</text>
                    </svg>
                  )}

                  {item.id === 'product' && (
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                      <ellipse cx="50" cy="85" rx="30" ry="5" fill="#0f172a" opacity="0.2" />
                      <path d="M 22 55 A 28 28 0 0 1 78 55" fill="none" stroke="#334155" strokeWidth="6" strokeLinecap="round" />
                      <rect x="18" y="48" width="10" height="22" rx="4" fill="#0f172a" />
                      <rect x="20" y="51" width="6" height="16" rx="3" fill="#0284c7" />
                      <rect x="72" y="48" width="10" height="22" rx="4" fill="#0f172a" />
                      <rect x="74" y="51" width="6" height="16" rx="3" fill="#0284c7" />
                    </svg>
                  )}

                  {item.id === 'ui-icon' && (
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-lg">
                      <rect x="15" y="15" width="70" height="70" rx="18" fill="url(#uiIconGrad)" />
                      <defs>
                        <linearGradient id="uiIconGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                          <stop offset="0%" stopColor="#10b981" />
                          <stop offset="100%" stopColor="#047857" />
                        </linearGradient>
                      </defs>
                      <path d="M 50 30 L 68 38 L 68 55 C 68 68 50 75 50 75 C 50 75 32 68 32 55 L 32 38 Z" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinejoin="round" />
                      <path d="M 43 52 L 48 57 L 58 46" fill="none" stroke="#ffffff" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  )}

                  {item.id === 'gradient-orb' && (
                    <svg viewBox="0 0 100 100" className="w-full h-full drop-shadow-md">
                      <circle cx="50" cy="50" rx="38" ry="38" fill="url(#orbGrad)" />
                      <circle cx="40" cy="38" rx="14" ry="14" fill="url(#orbHl)" />
                      <defs>
                        <radialGradient id="orbGrad" cx="40%" cy="38%" r="60%">
                          <stop offset="0%" stopColor="#fb923c" stopOpacity="0.95" />
                          <stop offset="50%" stopColor="#d946ef" stopOpacity="0.85" />
                          <stop offset="85%" stopColor="#4f46e5" stopOpacity="0.7" />
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
                        </radialGradient>
                        <radialGradient id="orbHl" cx="50%" cy="50%" r="50%">
                          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.75" />
                          <stop offset="100%" stopColor="#ffffff" stopOpacity="0" />
                        </radialGradient>
                      </defs>
                    </svg>
                  )}
                </div>

                <span className="absolute top-2.5 right-2.5 bg-black/60 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                  {item.badge}
                </span>
              </div>

              {/* Card Meta & Action */}
              <div className="p-4 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-bold text-slate-900 text-sm">{item.name}</h3>
                  <div className="flex items-center gap-1.5 mt-1 text-[11px] text-slate-500 font-mono">
                    <span>{item.format}</span>
                    <span>•</span>
                    <span className="text-emerald-700 font-bold">{item.size}</span>
                  </div>
                  <p className="mt-2 text-slate-600 text-xs leading-relaxed">
                    {item.description}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-200">
                  <button
                    onClick={() => downloadSamplePng(item.id, item.name)}
                    className="w-full py-2 px-3 rounded-lg bg-white border border-slate-300 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700 text-slate-700 font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer shadow-2xs"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Download Sample PNG</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};
