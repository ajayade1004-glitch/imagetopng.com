import React, { useState, useRef, useEffect } from 'react';
import {
  X,
  Stamp,
  Check,
  Download,
  Sliders,
  Type,
  Grid,
  RotateCw,
  Palette,
  Eye,
} from 'lucide-react';
import { ConvertedFile } from '../types';
import { downloadFile, getPngOutputFilename } from '../utils/converter';

interface WatermarkModalProps {
  file: ConvertedFile | null;
  isOpen: boolean;
  onClose: () => void;
  onApply: (fileId: string, updated: { blob: Blob; url: string; width: number; height: number; size: number }) => void;
}

type Position = 'top-left' | 'top-center' | 'top-right' | 'middle-left' | 'center' | 'middle-right' | 'bottom-left' | 'bottom-center' | 'bottom-right' | 'tile';

export const WatermarkModal: React.FC<WatermarkModalProps> = ({
  file,
  isOpen,
  onClose,
  onApply,
}) => {
  const [text, setText] = useState<string>('© Copyright');
  const [position, setPosition] = useState<Position>('bottom-right');
  const [fontSize, setFontSize] = useState<number>(24);
  const [opacity, setOpacity] = useState<number>(65);
  const [color, setColor] = useState<string>('#ffffff');
  const [angle, setAngle] = useState<number>(0); // 0 or -30 (for tile)
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const loadedImgRef = useRef<HTMLImageElement | null>(null);

  useEffect(() => {
    if (!file || !isOpen) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      loadedImgRef.current = img;
      renderWatermark();
    };

    if (file.pngUrl) {
      img.src = file.pngUrl;
    } else {
      const url = URL.createObjectURL(file.originalFile);
      img.src = url;
    }
  }, [file, isOpen]);

  const renderWatermark = () => {
    const canvas = canvasRef.current;
    const img = loadedImgRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const w = img.naturalWidth || file?.width || 800;
    const h = img.naturalHeight || file?.height || 600;

    canvas.width = w;
    canvas.height = h;

    // Draw base image
    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, 0, 0, w, h);

    if (!text.trim()) return;

    ctx.save();
    ctx.globalAlpha = opacity / 100;
    ctx.fillStyle = color;
    ctx.font = `bold ${fontSize}px sans-serif`;
    ctx.textBaseline = 'middle';

    // Shadow for legibility against any background
    ctx.shadowColor = 'rgba(0, 0, 0, 0.6)';
    ctx.shadowBlur = 4;
    ctx.shadowOffsetX = 1;
    ctx.shadowOffsetY = 1;

    const textWidth = ctx.measureText(text).width;
    const padding = 20;

    if (position === 'tile') {
      ctx.textAlign = 'center';
      const gapX = textWidth + 80;
      const gapY = fontSize + 60;
      const tileAngle = -30 * (Math.PI / 180);

      for (let x = -w; x < w * 2; x += gapX) {
        for (let y = -h; y < h * 2; y += gapY) {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(tileAngle);
          ctx.fillText(text, 0, 0);
          ctx.restore();
        }
      }
    } else {
      let x = padding;
      let y = padding + fontSize / 2;

      if (position.includes('left')) {
        ctx.textAlign = 'left';
        x = padding;
      } else if (position.includes('center')) {
        ctx.textAlign = 'center';
        x = w / 2;
      } else if (position.includes('right')) {
        ctx.textAlign = 'right';
        x = w - padding;
      }

      if (position.startsWith('top')) {
        y = padding + fontSize / 2;
      } else if (position.startsWith('middle') || position === 'center') {
        y = h / 2;
      } else if (position.startsWith('bottom')) {
        y = h - padding - fontSize / 2;
      }

      ctx.save();
      ctx.translate(x, y);
      if (angle !== 0) {
        ctx.rotate((angle * Math.PI) / 180);
      }
      ctx.fillText(text, 0, 0);
      ctx.restore();
    }

    ctx.restore();
  };

  useEffect(() => {
    if (loadedImgRef.current) {
      renderWatermark();
    }
  }, [text, position, fontSize, opacity, color, angle]);

  const handleApply = async () => {
    const canvas = canvasRef.current;
    if (!canvas || !file) return;

    setIsProcessing(true);
    try {
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => (b ? resolve(b) : reject(new Error('Canvas export error'))),
          'image/png',
          1.0
        );
      });

      const url = URL.createObjectURL(blob);
      onApply(file.id, {
        blob,
        url,
        width: canvas.width,
        height: canvas.height,
        size: blob.size,
      });

      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  if (!isOpen || !file) return null;

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fade-in text-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl flex flex-col overflow-hidden relative max-h-[92vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-gradient-to-tr from-purple-600 to-indigo-600 text-white shadow-xs">
              <Stamp className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                  Watermark & Copyright Studio
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-purple-100 text-purple-700">
                  100% Free
                </span>
              </div>
              <p className="text-[11px] text-slate-500 truncate max-w-xs sm:max-w-md">
                Protect and brand your images with custom watermark stamps
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

        {/* Body Split */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Left Canvas Preview */}
          <div
            className="flex-1 bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden"
            style={{
              backgroundImage: `
                linear-gradient(45deg, #1e293b 25%, transparent 25%), 
                linear-gradient(-45deg, #1e293b 25%, transparent 25%), 
                linear-gradient(45deg, transparent 75%, #1e293b 75%), 
                linear-gradient(-45deg, transparent 75%, #1e293b 75%)
              `,
              backgroundSize: '16px 16px',
              backgroundColor: '#0f172a',
            }}
          >
            <canvas
              ref={canvasRef}
              className="max-h-[35vh] md:max-h-[55vh] max-w-full object-contain rounded-lg shadow-xl border border-slate-700/60"
            />
          </div>

          {/* Right Controls */}
          <div className="w-full md:w-80 p-4 border-t md:border-t-0 md:border-l border-slate-200 bg-white overflow-y-auto space-y-4 shrink-0">
            {/* Watermark Text */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Watermark Text
              </label>
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="e.g. © 2026 MyBrand"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-medium focus:ring-1 focus:ring-purple-500"
              />
            </div>

            {/* Position Grid */}
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Stamp Placement
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'top-left', label: 'TL' },
                  { id: 'top-center', label: 'TC' },
                  { id: 'top-right', label: 'TR' },
                  { id: 'middle-left', label: 'ML' },
                  { id: 'center', label: 'Center' },
                  { id: 'middle-right', label: 'MR' },
                  { id: 'bottom-left', label: 'BL' },
                  { id: 'bottom-center', label: 'BC' },
                  { id: 'bottom-right', label: 'BR' },
                ].map((pos) => (
                  <button
                    key={pos.id}
                    type="button"
                    onClick={() => setPosition(pos.id as Position)}
                    className={`py-1.5 text-center rounded-md font-semibold text-[11px] transition-colors cursor-pointer border ${
                      position === pos.id
                        ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                        : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {pos.label}
                  </button>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setPosition('tile')}
                className={`w-full mt-1.5 py-1.5 rounded-md font-semibold text-[11px] border cursor-pointer transition-colors ${
                  position === 'tile'
                    ? 'bg-purple-600 text-white border-purple-600 shadow-2xs'
                    : 'bg-slate-50 border-slate-200 text-slate-700 hover:bg-slate-100'
                }`}
              >
                Repeat Pattern (Full Diagonal Tile)
              </button>
            </div>

            {/* Sliders: Size & Opacity */}
            <div className="space-y-3 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div>
                <div className="flex justify-between text-[11px] text-slate-700 mb-1">
                  <span className="font-semibold">Font Size</span>
                  <span className="font-mono">{fontSize}px</span>
                </div>
                <input
                  type="range"
                  min="12"
                  max="96"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-slate-700 mb-1">
                  <span className="font-semibold">Opacity</span>
                  <span className="font-mono">{opacity}%</span>
                </div>
                <input
                  type="range"
                  min="10"
                  max="100"
                  value={opacity}
                  onChange={(e) => setOpacity(Number(e.target.value))}
                  className="w-full accent-purple-600"
                />
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[11px] font-semibold text-slate-700">Text Color</span>
                <div className="flex items-center gap-1.5">
                  <button
                    type="button"
                    onClick={() => setColor('#ffffff')}
                    className="w-5 h-5 rounded-full border border-slate-300 bg-white"
                    title="White"
                  />
                  <button
                    type="button"
                    onClick={() => setColor('#000000')}
                    className="w-5 h-5 rounded-full border border-slate-300 bg-black"
                    title="Black"
                  />
                  <input
                    type="color"
                    value={color}
                    onChange={(e) => setColor(e.target.value)}
                    className="w-6 h-6 rounded border border-slate-300 cursor-pointer p-0"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between gap-2 shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-3.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApply}
            disabled={isProcessing}
            className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold cursor-pointer shadow-md shadow-purple-600/20 disabled:opacity-50"
          >
            <Check className="w-4 h-4" />
            <span>{isProcessing ? 'Watermarking...' : 'Apply Watermark'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
