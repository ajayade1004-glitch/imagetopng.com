import React, { useState } from 'react';
import {
  X,
  Link as LinkIcon,
  Download,
  AlertCircle,
  Check,
  Globe,
} from 'lucide-react';

export type ImportSourceType = 'url' | 'drive' | 'dropbox' | 'onedrive';

interface CloudImportModalProps {
  source: ImportSourceType | null;
  isOpen: boolean;
  onClose: () => void;
  onImportFile: (file: File) => void;
}

export const CloudImportModal: React.FC<CloudImportModalProps> = ({
  source,
  isOpen,
  onClose,
  onImportFile,
}) => {
  const [urlInput, setUrlInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen || !source) return null;

  const getSourceDetails = () => {
    switch (source) {
      case 'drive':
        return {
          title: 'Import from Google Drive',
          badge: 'No Login Required',
          placeholder: 'Paste Google Drive file link (e.g. https://drive.google.com/file/d/.../view)',
          help: 'Make sure your Google Drive link sharing is set to "Anyone with the link". We will fetch the image directly in your browser without requiring account credentials.',
          iconBg: 'bg-amber-500',
          logo: (
            <svg className="w-5 h-5" viewBox="0 0 87.3 78" fill="none">
              <path d="m6.6 66.85 3.85 6.65c.8 1.4 1.95 2.5 3.3 3.3l13.75-23.8H0c0 1.55.4 3.1 1.2 4.5z" fill="#0066DA"/>
              <path d="M43.65 25 29.9 1.2c-1.35.8-2.5 1.9-3.3 3.3l-25.4 44C.4 50 0 51.55 0 53.1h27.5z" fill="#00AC47"/>
              <path d="M73.55 76.8c1.35-.8 2.5-1.9 3.3-3.3l1.6-2.75 7.65-13.25c.8-1.4 1.2-2.95 1.2-4.5H59.8l5.85 10.15z" fill="#EA4335"/>
              <path d="M43.65 25 57.4 1.2C56.05.4 54.5 0 52.95 0H34.35c-1.55 0-3.1.4-4.45 1.2z" fill="#00832D"/>
              <path d="M59.8 53.1H87.3c0-1.55-.4-3.1-1.2-4.5l-25.4-44c-.8-1.4-1.95-2.5-3.3-3.3L43.65 25z" fill="#FFBA00"/>
              <path d="M73.55 76.8H27.5l-13.75 23.8c1.35.8 2.9 1.2 4.45 1.2h50.9c1.55 0 3.1-.4 4.45-1.2z" fill="#2684FC"/>
            </svg>
          ),
        };
      case 'dropbox':
        return {
          title: 'Import from Dropbox',
          badge: 'No Login Required',
          placeholder: 'Paste Dropbox shared link (e.g. https://www.dropbox.com/s/.../photo.jpg)',
          help: 'Paste any public Dropbox shared link. We automatically route it to direct download (dl=1) in your browser with zero login.',
          iconBg: 'bg-blue-600',
          logo: (
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M6.02 1.83 0 5.75l6.02 3.92 6-4.04-6-3.8zM17.98 1.83l-6 3.8 6 4.04 6.02-3.92-6.02-3.92zM0 13.59l6.02 3.92 6-3.8-6.02-4.04L0 13.59zm17.98-3.92-6.02 4.04 6 3.8 6.02-3.92-6-3.92zM6 19.46l6.02 3.89 6.02-3.89-6.02-3.8-6.02 3.8z"/>
            </svg>
          ),
        };
      case 'onedrive':
        return {
          title: 'Import from OneDrive',
          badge: 'No Login Required',
          placeholder: 'Paste OneDrive public shared link',
          help: 'Paste any OneDrive shared image link. No Microsoft account sign-in required on this website.',
          iconBg: 'bg-sky-600',
          logo: (
            <svg className="w-5 h-5 fill-white" viewBox="0 0 24 24">
              <path d="M19.35 10.04C18.67 6.59 15.64 4 12 4 9.11 4 6.6 5.64 5.35 8.04 2.34 8.36 0 10.91 0 14c0 3.31 2.69 6 6 6h13c2.76 0 5-2.24 5-5 0-2.64-2.05-4.78-4.65-4.96z"/>
            </svg>
          ),
        };
      default:
        return {
          title: 'Import Image from URL',
          badge: 'Direct Web Fetch',
          placeholder: 'https://example.com/image.jpg (or webp, png, avif)',
          help: 'Paste any direct image URL. It will be loaded and converted to PNG locally in your browser memory.',
          iconBg: 'bg-indigo-600',
          logo: <LinkIcon className="w-5 h-5 text-white" />,
        };
    }
  };

  const details = getSourceDetails();

  const normalizeUrl = (raw: string): string => {
    let u = raw.trim();
    if (!u) return '';

    // Handle Google Drive Links: https://drive.google.com/file/d/FILE_ID/view...
    if (source === 'drive' || u.includes('drive.google.com')) {
      const match = u.match(/\/d\/([a-zA-Z0-9_-]+)/);
      if (match && match[1]) {
        return `https://drive.google.com/uc?export=download&id=${match[1]}`;
      }
    }

    // Handle Dropbox Links: convert dl=0 to dl=1
    if (source === 'dropbox' || u.includes('dropbox.com')) {
      if (u.includes('dl=0')) {
        return u.replace('dl=0', 'dl=1');
      }
      if (!u.includes('dl=1')) {
        return u + (u.includes('?') ? '&dl=1' : '?dl=1');
      }
    }

    return u;
  };

  const handleImport = async () => {
    setError(null);
    const targetUrl = normalizeUrl(urlInput);

    if (!targetUrl) {
      setError('Please enter a valid URL or link.');
      return;
    }

    setIsLoading(true);

    try {
      // 1. Try direct fetch
      let blob: Blob | null = null;
      try {
        const response = await fetch(targetUrl, { mode: 'cors' });
        if (response.ok) {
          blob = await response.blob();
        }
      } catch {
        // CORS blocked, fallback to Image object loading
      }

      // 2. If direct fetch was blocked by CORS, try loading via Image element onto canvas
      if (!blob || !blob.type.startsWith('image/')) {
        blob = await new Promise<Blob>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = 'anonymous';
          img.onload = () => {
            const canvas = document.createElement('canvas');
            canvas.width = img.naturalWidth || img.width;
            canvas.height = img.naturalHeight || img.height;
            const ctx = canvas.getContext('2d');
            if (!ctx) {
              reject(new Error('Canvas context unavailable'));
              return;
            }
            ctx.drawImage(img, 0, 0);
            canvas.toBlob(
              (b) => {
                if (b) resolve(b);
                else reject(new Error('Failed to convert image to blob'));
              },
              'image/png',
              1.0
            );
          };
          img.onerror = () => {
            reject(
              new Error(
                'Could not load image from this URL. Please verify the link is publicly accessible or download it to your device first.'
              )
            );
          };
          img.src = targetUrl;
        });
      }

      // Extract filename from URL or default
      let filename = 'cloud-image.png';
      try {
        const parsed = new URL(targetUrl);
        const segments = parsed.pathname.split('/');
        const last = segments[segments.length - 1];
        if (last && last.includes('.')) {
          filename = decodeURIComponent(last);
        } else {
          filename = `${source || 'imported'}-photo.png`;
        }
      } catch {
        filename = 'cloud-image.png';
      }

      const file = new File([blob], filename, {
        type: blob.type || 'image/png',
        lastModified: Date.now(),
      });

      onImportFile(file);
      onClose();
      setUrlInput('');
    } catch (err: any) {
      console.error(err);
      setError(
        err.message ||
          'Failed to load image. The link might be private or protected by CORS. Try downloading the file to your device.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasteClipboard = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setUrlInput(text.trim());
      }
    } catch {
      // Clipboard permission denied
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fade-in text-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2.5">
            <span className={`p-2 rounded-xl ${details.iconBg} text-white shadow-xs`}>
              {details.logo}
            </span>
            <div>
              <div className="flex items-center gap-1.5">
                <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                  {details.title}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-blue-100 text-blue-800">
                  {details.badge}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Browser-Based • No Credentials Required
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
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-slate-800">
                Image Link or URL:
              </label>
              <button
                type="button"
                onClick={handlePasteClipboard}
                className="text-[11px] text-blue-600 hover:text-blue-800 font-semibold cursor-pointer"
              >
                Paste from Clipboard
              </button>
            </div>

            <input
              type="url"
              value={urlInput}
              onChange={(e) => setUrlInput(e.target.value)}
              placeholder={details.placeholder}
              className="w-full px-3 py-2 rounded-xl border border-slate-300 text-xs focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              autoFocus
            />
          </div>

          <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-[11px] text-slate-600 leading-relaxed">
            {details.help}
          </div>

          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-red-500 mt-0.5" />
              <p>{error}</p>
            </div>
          )}
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
            onClick={handleImport}
            disabled={isLoading || !urlInput.trim()}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold cursor-pointer shadow-md shadow-blue-600/20 disabled:opacity-50 transition-all active:scale-95"
          >
            {isLoading ? (
              <>
                <div className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Loading Image...</span>
              </>
            ) : (
              <>
                <Download className="w-4 h-4" />
                <span>Import & Convert</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};
