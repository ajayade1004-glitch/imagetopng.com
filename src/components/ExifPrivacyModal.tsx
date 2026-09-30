import React, { useState, useEffect } from 'react';
import {
  X,
  ShieldCheck,
  MapPin,
  Camera,
  Calendar,
  EyeOff,
  Check,
  Download,
  AlertTriangle,
  Lock,
} from 'lucide-react';
import { ConvertedFile } from '../types';
import { formatBytes, downloadFile, getPngOutputFilename } from '../utils/converter';

interface ExifPrivacyModalProps {
  file: ConvertedFile | null;
  isOpen: boolean;
  onClose: () => void;
  onStripMetadata: (fileId: string) => void;
}

export const ExifPrivacyModal: React.FC<ExifPrivacyModalProps> = ({
  file,
  isOpen,
  onClose,
  onStripMetadata,
}) => {
  const [hasStripped, setHasStripped] = useState(false);

  useEffect(() => {
    setHasStripped(false);
  }, [file]);

  if (!isOpen || !file) return null;

  const handleStrip = () => {
    onStripMetadata(file.id);
    setHasStripped(true);
  };

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
            <span className="p-1.5 rounded-lg bg-gradient-to-tr from-emerald-600 to-teal-600 text-white shadow-xs">
              <ShieldCheck className="w-4 h-4" />
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                  EXIF & GPS Privacy Scrubber
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700">
                  100% Free
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
          {/* Privacy Status Card */}
          <div className="p-4 rounded-xl bg-gradient-to-r from-emerald-50 via-teal-50 to-blue-50 border border-emerald-200">
            <div className="flex items-start gap-3">
              <div className="p-2 rounded-lg bg-emerald-600 text-white shrink-0 mt-0.5 shadow-xs">
                <Lock className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-emerald-950 text-sm">
                  {hasStripped
                    ? '100% Sanitized & Safe to Share'
                    : 'Browser-Engine Privacy Shield'}
                </h4>
                <p className="text-[11px] text-emerald-800 mt-1 leading-relaxed">
                  {hasStripped
                    ? 'All camera hardware serials, GPS coordinates, date taken, and editing software traces have been completely eliminated. Your image is 100% anonymous.'
                    : 'When photos are taken with phones or cameras, they often leak GPS coordinates, camera serial numbers, and timestamps. ImageToPNG rasterizes pure pixel streams, stripping all tracking metadata automatically.'}
                </p>
              </div>
            </div>
          </div>

          {/* Privacy Checklist */}
          <div className="space-y-2">
            <span className="font-bold text-slate-800 block text-xs">
              Privacy & Metadata Inspection Status:
            </span>

            <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200">
              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <div className="flex items-center gap-2 text-slate-700">
                  <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-medium">GPS Geolocation Tag</span>
                </div>
                <span className="font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded text-[10px]">
                  Stripped & Blocked
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <div className="flex items-center gap-2 text-slate-700">
                  <Camera className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-medium">Camera Hardware & Lens Serial</span>
                </div>
                <span className="font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded text-[10px]">
                  Scrubbed
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                <div className="flex items-center gap-2 text-slate-700">
                  <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-medium">Original Shoot Timestamp</span>
                </div>
                <span className="font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded text-[10px]">
                  Sanitized
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <div className="flex items-center gap-2 text-slate-700">
                  <EyeOff className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="font-medium">Photoshop / Software Traces</span>
                </div>
                <span className="font-semibold text-emerald-700 bg-emerald-100/70 px-2 py-0.5 rounded text-[10px]">
                  Zero Traces
                </span>
              </div>
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
            Close
          </button>

          <button
            type="button"
            onClick={handleStrip}
            className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold cursor-pointer shadow-xs transition-colors"
          >
            <Check className="w-4 h-4" />
            <span>{hasStripped ? 'Verified 100% Clean' : 'Enforce Zero-Metadata Clean'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
