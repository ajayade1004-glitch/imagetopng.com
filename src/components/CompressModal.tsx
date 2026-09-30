import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Zap,
  ArrowDown,
  Check,
  Download,
  Sliders,
  Sparkles,
  Layers,
  Info,
} from 'lucide-react';
import { ConvertedFile } from '../types';
import { formatBytes, downloadFile, getPngOutputFilename } from '../utils/converter';
import { compressPng, CompressResult } from '../utils/compressor';

interface CompressModalProps {
  file: ConvertedFile | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (fileId: string, updated: {
    blob: Blob;
    url: string;
    width: number;
    height: number;
    size: number;
  }) => void;
}

export const CompressModal: React.FC<CompressModalProps> = ({
  file,
  isOpen,
  onClose,
  onApply,
}) => {
  const [level, setLevel] = useState<number>(55); // 0 to 100
  const [scale, setScale] = useState<number>(1.0); // 0.3 to 1.0
  const [preset, setPreset] = useState<'light' | 'balanced' | 'max' | 'custom'>('balanced');
  const [result, setResult] = useState<CompressResult | null>(null);
  const [isCalculating, setIsCalculating] = useState<boolean>(false);

  const prevResultUrlRef = useRef<string | null>(null);

  // Recalculate compressed size whenever level, scale or file changes
  useEffect(() => {
    if (!file || !isOpen) return;

    let isCurrent = true;
    const runCompression = async () => {
      setIsCalculating(true);
      try {
        const source = file.pngBlob || file.originalFile;
        const res = await compressPng(source, { level, scale });

        if (isCurrent) {
          if (prevResultUrlRef.current) {
            URL.revokeObjectURL(prevResultUrlRef.current);
          }
          prevResultUrlRef.current = res.url;
          setResult(res);
        }
      } catch (err) {
        console.error('Compression error:', err);
      } finally {
        if (isCurrent) {
          setIsCalculating(false);
        }
      }
    };

    const timer = setTimeout(runCompression, 120);
    return () => {
      isCurrent = false;
      clearTimeout(timer);
    };
  }, [file, isOpen, level, scale]);

  // Clean up object URLs on unmount
  useEffect(() => {
    return () => {
      if (prevResultUrlRef.current) {
        URL.revokeObjectURL(prevResultUrlRef.current);
      }
    };
  }, []);

  if (!isOpen || !file) return null;

  const currentSize = file.pngSize || file.originalSize;
  const originalSize = file.originalSize;
  const compressedSize = result?.size || currentSize;
  const savedBytes = Math.max(0, currentSize - compressedSize);
  const reductionPercent = currentSize > 0
    ? Math.max(0, Math.round((savedBytes / currentSize) * 100))
    : 0;

  const handleApplyPreset = (p: 'light' | 'balanced' | 'max') => {
    setPreset(p);
    if (p === 'light') {
      setLevel(25);
      setScale(1.0);
    } else if (p === 'balanced') {
      setLevel(55);
      setScale(1.0);
    } else if (p === 'max') {
      setLevel(80);
      setScale(0.85);
    }
  };

  const handleApplyToQueue = () => {
    if (!result) return;
    onApply(file.id, {
      blob: result.blob,
      url: result.url,
      width: result.width,
      height: result.height,
      size: result.size,
    });
    // Nullify ref so unmount cleanup doesn't revoke the applied URL
    prevResultUrlRef.current = null;
    onClose();
  };

  const handleDirectDownload = () => {
    if (!result) return;
    const outputName = getPngOutputFilename(file.name).replace('.png', '-compressed.png');
    downloadFile(result.url, outputName);
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fade-in text-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-xl w-full shadow-2xl flex flex-col overflow-hidden relative max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-gradient-to-tr from-amber-500 to-orange-500 text-white shadow-xs">
              <Zap className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                Compress PNG (Size Reducer)
              </h3>
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

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-4">
          {/* Real-Time Size Reduction Hero Banner */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-blue-50 via-indigo-50 to-emerald-50 border border-blue-100 flex items-center justify-between shadow-2xs">
            <div>
              <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider block">
                Original Size
              </span>
              <span className="text-base sm:text-lg font-bold text-slate-700 line-through">
                {formatBytes(currentSize)}
              </span>
            </div>

            <div className="flex flex-col items-center">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-emerald-600 text-white shadow-xs animate-pulse">
                <ArrowDown className="w-3.5 h-3.5" />
                <span>{reductionPercent}% REDUCED</span>
              </span>
              {savedBytes > 0 && (
                <span className="text-[10px] text-emerald-800 font-semibold mt-1">
                  Save {formatBytes(savedBytes)}
                </span>
              )}
            </div>

            <div className="text-right">
              <span className="text-[11px] font-semibold text-emerald-700 uppercase tracking-wider block">
                Compressed Size
              </span>
              <span className="text-base sm:text-lg font-black text-emerald-600 font-mono">
                {isCalculating ? 'Calculating...' : formatBytes(compressedSize)}
              </span>
            </div>
          </div>

          {/* Quick Compression Presets */}
          <div>
            <span className="font-bold text-slate-800 block mb-1.5 text-xs">
              Choose Compression Mode:
            </span>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => handleApplyPreset('light')}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                  preset === 'light'
                    ? 'border-blue-600 bg-blue-50/70 text-blue-900 font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-bold">Light</span>
                  <span className="text-[10px] text-blue-600 font-semibold">~25%</span>
                </div>
                <p className="text-[10px] text-slate-500 font-normal leading-tight">
                  100% Visual Fidelity
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleApplyPreset('balanced')}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all relative ${
                  preset === 'balanced'
                    ? 'border-emerald-600 bg-emerald-50/70 text-emerald-950 font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-bold">Balanced</span>
                  <span className="text-[10px] text-emerald-600 font-semibold">~55%</span>
                </div>
                <p className="text-[10px] text-slate-500 font-normal leading-tight">
                  Recommended Best Ratio
                </p>
              </button>

              <button
                type="button"
                onClick={() => handleApplyPreset('max')}
                className={`p-2.5 rounded-xl border text-left cursor-pointer transition-all ${
                  preset === 'max'
                    ? 'border-amber-600 bg-amber-50/70 text-amber-950 font-bold shadow-xs'
                    : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <span className="text-xs font-bold">Maximum</span>
                  <span className="text-[10px] text-amber-600 font-semibold">~75%+</span>
                </div>
                <p className="text-[10px] text-slate-500 font-normal leading-tight">
                  Smallest File Size
                </p>
              </button>
            </div>
          </div>

          {/* Custom Sliders for Fine-Tuning */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <div>
              <div className="flex justify-between text-[11px] text-slate-700 mb-1">
                <span className="font-semibold">Compression Strength</span>
                <span className="font-mono font-bold text-blue-700">{level}%</span>
              </div>
              <input
                type="range"
                min="5"
                max="95"
                value={level}
                onChange={(e) => {
                  setLevel(Number(e.target.value));
                  setPreset('custom');
                }}
                className="w-full accent-blue-600"
              />
              <p className="text-[10px] text-slate-500 mt-0.5">
                Reduces color entropy while keeping transparency intact.
              </p>
            </div>

            <div>
              <div className="flex justify-between text-[11px] text-slate-700 mb-1">
                <span className="font-semibold">Resolution Scale (Dimensions)</span>
                <span className="font-mono font-bold text-blue-700">
                  {Math.round(scale * 100)}%
                  {result && ` (${result.width}×${result.height}px)`}
                </span>
              </div>
              <input
                type="range"
                min="40"
                max="100"
                step="5"
                value={Math.round(scale * 100)}
                onChange={(e) => {
                  setScale(Number(e.target.value) / 100);
                  setPreset('custom');
                }}
                className="w-full accent-blue-600"
              />
              <p className="text-[10px] text-slate-500 mt-0.5">
                Scale down image dimensions to achieve extreme byte savings.
              </p>
            </div>
          </div>

          {/* Real-Time Preview Thumbnail Frame */}
          {result && result.url && (
            <div className="space-y-1.5">
              <span className="text-[11px] font-semibold text-slate-600 block">
                Compressed Image Preview:
              </span>
              <div
                className="rounded-xl border border-slate-200 p-2 flex items-center justify-center max-h-[180px] overflow-hidden"
                style={{
                  backgroundImage: `
                    linear-gradient(45deg, #e2e8f0 25%, transparent 25%), 
                    linear-gradient(-45deg, #e2e8f0 25%, transparent 25%), 
                    linear-gradient(45deg, transparent 75%, #e2e8f0 75%), 
                    linear-gradient(-45deg, transparent 75%, #e2e8f0 75%)
                  `,
                  backgroundSize: '10px 10px',
                  backgroundColor: '#f8fafc',
                }}
              >
                <img
                  src={result.url}
                  alt="Compressed preview"
                  className="max-h-[160px] max-w-full object-contain drop-shadow-xs"
                />
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold cursor-pointer"
          >
            Cancel
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDirectDownload}
              disabled={isCalculating || !result}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-800 font-semibold cursor-pointer transition-colors"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download</span>
            </button>

            <button
              type="button"
              onClick={handleApplyToQueue}
              disabled={isCalculating || !result}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-md shadow-emerald-600/20 disabled:opacity-50 transition-colors"
            >
              <Check className="w-4 h-4" />
              <span>Apply to Queue</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
