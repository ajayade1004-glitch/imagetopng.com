import React, { useState, useEffect } from 'react';
import {
  X,
  Palette,
  Copy,
  Check,
  Download,
  Sparkles,
} from 'lucide-react';
import { ConvertedFile } from '../types';

interface ColorPaletteModalProps {
  file: ConvertedFile | null;
  isOpen: boolean;
  onClose: () => void;
}

interface PaletteColor {
  hex: string;
  rgb: string;
  percentage: number;
}

export const ColorPaletteModal: React.FC<ColorPaletteModalProps> = ({
  file,
  isOpen,
  onClose,
}) => {
  const [colors, setColors] = useState<PaletteColor[]>([]);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [isExtracting, setIsExtracting] = useState<boolean>(false);

  useEffect(() => {
    if (!file || !isOpen) return;

    const extractPalette = () => {
      setIsExtracting(true);
      const img = new Image();
      img.crossOrigin = 'anonymous';

      img.onload = () => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d', { willReadFrequently: true });
        if (!ctx) return;

        // Sample at 100x100 for high speed extraction
        const sampleSize = 100;
        canvas.width = sampleSize;
        canvas.height = sampleSize;
        ctx.drawImage(img, 0, 0, sampleSize, sampleSize);

        const imgData = ctx.getImageData(0, 0, sampleSize, sampleSize);
        const data = imgData.data;

        // Color bucket map (step quantized)
        const colorCounts: { [hex: string]: { count: number; r: number; g: number; b: number } } = {};
        let totalOpaquePixels = 0;

        for (let i = 0; i < data.length; i += 4) {
          const a = data[i + 3];
          if (a < 128) continue; // Ignore transparent pixels

          // Quantize to step 24
          const r = Math.round(data[i] / 24) * 24;
          const g = Math.round(data[i + 1] / 24) * 24;
          const b = Math.round(data[i + 2] / 24) * 24;

          const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;

          if (!colorCounts[hex]) {
            colorCounts[hex] = { count: 0, r, g, b };
          }
          colorCounts[hex].count++;
          totalOpaquePixels++;
        }

        // Sort by frequency and get top 8
        const sorted = Object.entries(colorCounts)
          .sort((a, b) => b[1].count - a[1].count)
          .slice(0, 8)
          .map(([hex, info]) => ({
            hex,
            rgb: `rgb(${info.r}, ${info.g}, ${info.b})`,
            percentage: totalOpaquePixels > 0 ? Math.round((info.count / totalOpaquePixels) * 100) : 0,
          }));

        setColors(sorted);
        setIsExtracting(false);
      };

      img.src = file.pngUrl || URL.createObjectURL(file.originalFile);
    };

    extractPalette();
  }, [file, isOpen]);

  const handleCopy = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  const handleCopyCssVariables = () => {
    const css = colors.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join('\n');
    navigator.clipboard.writeText(`:root {\n${css}\n}`);
    setCopiedHex('ALL_CSS');
    setTimeout(() => setCopiedHex(null), 2000);
  };

  if (!isOpen || !file) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fade-in text-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-gradient-to-tr from-pink-500 to-rose-500 text-white shadow-xs">
              <Palette className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                  Color Palette & HEX Extractor
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-pink-100 text-pink-700">
                  Pro Feature Free
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate max-w-xs">
                {file.name}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-4">
          <p className="text-slate-600 text-xs">
            Dominant colors extracted directly from your image in-browser. Click any swatch or HEX code to copy:
          </p>

          {isExtracting ? (
            <div className="py-8 flex flex-col items-center justify-center text-slate-500 gap-2">
              <div className="w-6 h-6 border-2 border-pink-500 border-t-transparent rounded-full animate-spin" />
              <span>Extracting color harmony...</span>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {colors.map((c) => (
                <div
                  key={c.hex}
                  onClick={() => handleCopy(c.hex)}
                  className="group p-2.5 rounded-xl border border-slate-200 hover:border-pink-500 hover:shadow-md transition-all cursor-pointer bg-white flex flex-col"
                >
                  <div
                    className="w-full h-14 rounded-lg shadow-inner border border-black/10 relative overflow-hidden mb-2"
                    style={{ backgroundColor: c.hex }}
                  >
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                      {copiedHex === c.hex ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="font-mono font-bold text-slate-800 text-xs">
                      {c.hex}
                    </span>
                    <span className="text-[10px] text-slate-500 font-medium">
                      {c.percentage}%
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 truncate font-mono">
                    {c.rgb}
                  </span>
                </div>
              ))}
            </div>
          )}

          {/* Quick Copy Banner */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-200">
            <div>
              <span className="font-bold text-slate-800 block text-xs">
                Copy Full Palette as CSS
              </span>
              <span className="text-[10px] text-slate-500">
                Ready to paste in your CSS `:root` stylesheets
              </span>
            </div>
            <button
              type="button"
              onClick={handleCopyCssVariables}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:border-pink-500 text-slate-700 font-semibold cursor-pointer shadow-2xs transition-colors"
            >
              {copiedHex === 'ALL_CSS' ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5 text-slate-500" />
                  <span>Copy CSS Variables</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 border-t border-slate-200 bg-slate-50/80 flex items-center justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold cursor-pointer"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
