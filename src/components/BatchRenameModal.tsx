import React, { useState } from 'react';
import {
  X,
  FileEdit,
  Check,
  Hash,
  ArrowRight,
} from 'lucide-react';
import { ConvertedFile } from '../types';

interface BatchRenameModalProps {
  files: ConvertedFile[];
  isOpen: boolean;
  onClose: () => void;
  onApply: (renamedMap: { [id: string]: string }) => void;
}

export const BatchRenameModal: React.FC<BatchRenameModalProps> = ({
  files,
  isOpen,
  onClose,
  onApply,
}) => {
  const [prefix, setPrefix] = useState<string>('');
  const [suffix, setSuffix] = useState<string>('');
  const [customBase, setCustomBase] = useState<string>('');
  const [addNumbering, setAddNumbering] = useState<boolean>(true);
  const [caseFormat, setCaseFormat] = useState<'none' | 'lower' | 'kebab' | 'snake'>('none');

  if (!isOpen) return null;

  // Format filename logic
  const formatName = (originalName: string, index: number): string => {
    let nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');

    if (customBase.trim()) {
      nameWithoutExt = customBase.trim();
    }

    if (caseFormat === 'lower') {
      nameWithoutExt = nameWithoutExt.toLowerCase();
    } else if (caseFormat === 'kebab') {
      nameWithoutExt = nameWithoutExt.toLowerCase().replace(/[\s_]+/g, '-');
    } else if (caseFormat === 'snake') {
      nameWithoutExt = nameWithoutExt.toLowerCase().replace(/[\s-]+/g, '_');
    }

    const numStr = addNumbering ? `_${String(index + 1).padStart(2, '0')}` : '';
    const finalBase = `${prefix}${nameWithoutExt}${suffix}${numStr}`;
    return `${finalBase}.png`;
  };

  const handleApply = () => {
    const map: { [id: string]: string } = {};
    files.forEach((f, idx) => {
      map[f.id] = formatName(f.name, idx);
    });
    onApply(map);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fade-in text-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-lg w-full shadow-2xl flex flex-col overflow-hidden relative max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-gradient-to-tr from-cyan-600 to-blue-600 text-white shadow-xs">
              <FileEdit className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                  Batch Filename Formatter
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-cyan-100 text-cyan-800">
                  Free Batch Tool
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Rename all {files.length} images with uniform prefixes, numbers, & patterns
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
        <div className="p-5 overflow-y-auto space-y-4">
          <div className="space-y-3 bg-slate-50 p-3.5 rounded-xl border border-slate-200">
            <div>
              <label className="text-[11px] font-bold text-slate-700 block mb-1">
                Custom Base Name (Optional - leave empty to keep original):
              </label>
              <input
                type="text"
                value={customBase}
                onChange={(e) => setCustomBase(e.target.value)}
                placeholder="e.g. product-photo, company-logo"
                className="w-full px-3 py-1.5 rounded-lg border border-slate-300 text-xs font-mono focus:ring-1 focus:ring-blue-500 bg-white"
              />
            </div>

            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Prefix:
                </label>
                <input
                  type="text"
                  value={prefix}
                  onChange={(e) => setPrefix(e.target.value)}
                  placeholder="e.g. web-"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono bg-white"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-700 block mb-1">
                  Suffix:
                </label>
                <input
                  type="text"
                  value={suffix}
                  onChange={(e) => setSuffix(e.target.value)}
                  placeholder="e.g. -png"
                  className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 text-xs font-mono bg-white"
                />
              </div>
            </div>

            {/* Checkboxes & Case format */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1 border-t border-slate-200/60">
              <label className="flex items-center gap-1.5 cursor-pointer text-slate-700 font-medium">
                <input
                  type="checkbox"
                  checked={addNumbering}
                  onChange={(e) => setAddNumbering(e.target.checked)}
                  className="rounded text-blue-600 focus:ring-blue-500"
                />
                <span>Auto Numbering (_01, _02...)</span>
              </label>

              <select
                value={caseFormat}
                onChange={(e) => setCaseFormat(e.target.value as any)}
                className="px-2 py-1 bg-white border border-slate-300 rounded-lg text-xs font-medium cursor-pointer"
              >
                <option value="none">Original Case</option>
                <option value="lower">lowercase</option>
                <option value="kebab">kebab-case</option>
                <option value="snake">snake_case</option>
              </select>
            </div>
          </div>

          {/* Live Preview List */}
          <div>
            <span className="font-bold text-slate-800 block mb-1.5 text-xs">
              Live Output Filenames:
            </span>
            <div className="max-h-36 overflow-y-auto space-y-1.5 border border-slate-200 rounded-xl p-2.5 bg-slate-50/50">
              {files.slice(0, 5).map((f, idx) => (
                <div key={f.id} className="flex items-center justify-between text-[11px] py-0.5">
                  <span className="text-slate-500 truncate max-w-[160px]" title={f.name}>
                    {f.name}
                  </span>
                  <ArrowRight className="w-3 h-3 text-slate-400 shrink-0 mx-1.5" />
                  <span className="text-blue-700 font-mono font-bold truncate max-w-[190px]">
                    {formatName(f.name, idx)}
                  </span>
                </div>
              ))}
              {files.length > 5 && (
                <p className="text-[10px] text-slate-400 text-center pt-1 italic">
                  + {files.length - 5} more files will follow this pattern
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between">
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
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-xs transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>Apply to All Files</span>
          </button>
        </div>
      </div>
    </div>
  );
};
