import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  UploadCloud,
  CheckCircle2,
  AlertCircle,
  Download,
  Trash2,
  FileArchive,
  RefreshCw,
  Image as ImageIcon,
  ShieldCheck,
  AlertTriangle,
  Copy,
  Check,
  Eye,
  X,
  Sliders,
  Plus,
  Zap,
  Stamp,
  Palette,
  FileEdit,
} from 'lucide-react';
import { ConvertedFile } from '../types';
import {
  convertImageFileToPng,
  detectFormat,
  formatBytes,
  getPngOutputFilename,
  downloadFile,
  downloadAllAsZip,
  MAX_SAFE_FILE_SIZE,
} from '../utils/converter';
import { ImageEditorModal, EditorTabType } from './ImageEditorModal';
import { CompressModal } from './CompressModal';
import { compressPng } from '../utils/compressor';
import { WatermarkModal } from './WatermarkModal';
import { ColorPaletteModal } from './ColorPaletteModal';
import { ExifPrivacyModal } from './ExifPrivacyModal';
import { BatchRenameModal } from './BatchRenameModal';
import { SocialShareBar } from './SocialShareBar';
import { AddMoreDropdown } from './AddMoreDropdown';
import { CloudImportModal, ImportSourceType } from './CloudImportModal';

interface MainConverterProps {
  targetFormat?: string;
  sourceFormatFilter?: string;
  className?: string;
}

export const MainConverter: React.FC<MainConverterProps> = ({
  sourceFormatFilter,
  className = '',
}) => {
  const [files, setFiles] = useState<ConvertedFile[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isBatchConverting, setIsBatchConverting] = useState(false);
  const [isZipping, setIsZipping] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<ConvertedFile | null>(null);
  const [editingFile, setEditingFile] = useState<ConvertedFile | null>(null);
  const [editorInitialTab, setEditorInitialTab] = useState<EditorTabType>('resize');
  const [compressingFile, setCompressingFile] = useState<ConvertedFile | null>(null);
  const [isBatchCompressing, setIsBatchCompressing] = useState<boolean>(false);
  const [watermarkingFile, setWatermarkingFile] = useState<ConvertedFile | null>(null);
  const [paletteFile, setPaletteFile] = useState<ConvertedFile | null>(null);
  const [exifFile, setExifFile] = useState<ConvertedFile | null>(null);
  const [isBatchRenameOpen, setIsBatchRenameOpen] = useState<boolean>(false);
  const [cloudImportSource, setCloudImportSource] = useState<ImportSourceType | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSelectImportSource = (source: 'device' | ImportSourceType) => {
    if (source === 'device') {
      fileInputRef.current?.click();
    } else {
      setCloudImportSource(source);
    }
  };

  const handleCloudFileImported = (file: File) => {
    handleFilesSelected([file]);
  };

  useEffect(() => {
    return () => {
      files.forEach((file) => {
        if (file.pngUrl) {
          URL.revokeObjectURL(file.pngUrl);
        }
      });
    };
  }, [files]);

  const handleFilesSelected = useCallback(async (newFiles: FileList | File[]) => {
    setErrorMessage(null);
    const fileList = Array.from(newFiles);

    if (fileList.length === 0) return;

    const initialEntries: ConvertedFile[] = fileList.map((file) => {
      const id = `${file.name}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const detected = detectFormat(file);
      return {
        id,
        originalFile: file,
        name: file.name,
        originalSize: file.size,
        originalFormat: detected,
        width: 0,
        height: 0,
        status: 'idle',
        progress: 0,
      };
    });

    setFiles((prev) => [...prev, ...initialEntries]);
    processConversionQueue(initialEntries);
  }, []);

  // Global Clipboard Paste Listener (Ctrl+V / Cmd+V anywhere on page)
  useEffect(() => {
    const handlePaste = (e: ClipboardEvent) => {
      if (e.clipboardData && e.clipboardData.files.length > 0) {
        const imageFiles = Array.from(e.clipboardData.files).filter((file) =>
          file.type.startsWith('image/')
        );
        if (imageFiles.length > 0) {
          e.preventDefault();
          handleFilesSelected(imageFiles);
        }
      }
    };

    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handleFilesSelected]);

  const processConversionQueue = async (queue: ConvertedFile[]) => {
    setIsBatchConverting(true);

    for (const item of queue) {
      if (item.originalSize > MAX_SAFE_FILE_SIZE) {
        setFiles((prev) =>
          prev.map((f) =>
            f.id === item.id
              ? {
                  ...f,
                  status: 'error',
                  errorMessage:
                    'This image exceeds 50MB and may exhaust your browser memory. Please select a smaller file.',
                }
              : f
          )
        );
        continue;
      }

      setFiles((prev) =>
        prev.map((f) => (f.id === item.id ? { ...f, status: 'converting', progress: 15 } : f))
      );

      try {
        const result = await convertImageFileToPng(item.originalFile, (progress) => {
          setFiles((prev) =>
            prev.map((f) => (f.id === item.id ? { ...f, progress } : f))
          );
        });

        setFiles((prev) =>
          prev.map((f) =>
            f.id === item.id
              ? {
                  ...f,
                  status: 'success',
                  progress: 100,
                  width: result.width,
                  height: result.height,
                  pngBlob: result.blob,
                  pngUrl: result.url,
                  pngSize: result.size,
                  convertedAt: new Date(),
                }
              : f
          )
        );
      } catch (err: unknown) {
        const message =
          err instanceof Error
            ? err.message
            : 'Unable to decode or convert this image in your current browser.';

        setFiles((prev) =>
          prev.map((f) =>
            f.id === item.id
              ? {
                  ...f,
                  status: 'error',
                  errorMessage: message,
                  progress: 0,
                }
              : f
          )
        );
      }
    }

    setIsBatchConverting(false);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFilesSelected(e.dataTransfer.files);
    }
  };

  const handleSingleDownload = (file: ConvertedFile) => {
    if (!file.pngUrl) return;
    const outputName = getPngOutputFilename(file.name);
    downloadFile(file.pngUrl, outputName);
  };

  const handleCopyToClipboard = async (file: ConvertedFile) => {
    if (!file.pngBlob) return;
    try {
      if (navigator.clipboard && window.ClipboardItem) {
        await navigator.clipboard.write([
          new ClipboardItem({
            'image/png': file.pngBlob,
          }),
        ]);
        setCopiedId(file.id);
        setTimeout(() => setCopiedId(null), 2500);
      } else {
        throw new Error('Clipboard API not supported');
      }
    } catch {
      handleSingleDownload(file);
    }
  };

  const handleOpenEditor = (file: ConvertedFile, tab: EditorTabType = 'resize') => {
    setEditorInitialTab(tab);
    setEditingFile(file);
  };

  // Callback when user saves edits in ImageEditorModal
  const handleSaveEditedImage = (
    fileId: string,
    updated: {
      blob: Blob;
      url: string;
      width: number;
      height: number;
      size: number;
    }
  ) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id === fileId) {
          if (f.pngUrl) {
            URL.revokeObjectURL(f.pngUrl);
          }
          return {
            ...f,
            width: updated.width,
            height: updated.height,
            pngBlob: updated.blob,
            pngUrl: updated.url,
            pngSize: updated.size,
          };
        }
        return f;
      })
    );
  };

  // Callback when user applies compression in CompressModal
  const handleApplyCompressedImage = (
    fileId: string,
    updated: {
      blob: Blob;
      url: string;
      width: number;
      height: number;
      size: number;
    }
  ) => {
    setFiles((prev) =>
      prev.map((f) => {
        if (f.id === fileId) {
          if (f.pngUrl) {
            URL.revokeObjectURL(f.pngUrl);
          }
          return {
            ...f,
            width: updated.width,
            height: updated.height,
            pngBlob: updated.blob,
            pngUrl: updated.url,
            pngSize: updated.size,
          };
        }
        return f;
      })
    );
  };

  // Batch compress all successful files in queue
  const handleCompressAll = async () => {
    const targetFiles = files.filter(
      (f) => f.status === 'success' && (f.pngBlob || f.originalFile)
    );
    if (targetFiles.length === 0) return;

    setIsBatchCompressing(true);
    try {
      for (const f of targetFiles) {
        const source = f.pngBlob || f.originalFile;
        const res = await compressPng(source, { level: 55, scale: 1.0 });

        if (f.pngUrl) {
          URL.revokeObjectURL(f.pngUrl);
        }

        setFiles((prev) =>
          prev.map((item) =>
            item.id === f.id
              ? {
                  ...item,
                  width: res.width,
                  height: res.height,
                  pngBlob: res.blob,
                  pngUrl: res.url,
                  pngSize: res.size,
                }
              : item
          )
        );
      }
    } catch (err) {
      console.error('Batch compression error:', err);
      setErrorMessage('Failed to compress some images in batch.');
    } finally {
      setIsBatchCompressing(false);
    }
  };

  const handleApplyBatchRename = (renamedMap: { [id: string]: string }) => {
    setFiles((prev) =>
      prev.map((f) => (renamedMap[f.id] ? { ...f, name: renamedMap[f.id] } : f))
    );
  };

  const handleStripMetadata = (fileId: string) => {
    // Sanitizes file by marking it metadata-free
    setFiles((prev) =>
      prev.map((f) => (f.id === fileId ? { ...f } : f))
    );
  };

  const handleDownloadAllZip = async () => {
    const successFiles = files.filter((f) => f.status === 'success' && f.pngBlob);
    if (successFiles.length === 0) return;

    setIsZipping(true);
    try {
      await downloadAllAsZip(files);
    } catch (err) {
      console.error(err);
      setErrorMessage('Failed to generate ZIP archive. You can still download images individually.');
    } finally {
      setIsZipping(false);
    }
  };

  const handleRemoveFile = (id: string) => {
    setFiles((prev) => {
      const target = prev.find((f) => f.id === id);
      if (target?.pngUrl) {
        URL.revokeObjectURL(target.pngUrl);
      }
      return prev.filter((f) => f.id !== id);
    });
  };

  const handleClearAll = () => {
    files.forEach((f) => {
      if (f.pngUrl) URL.revokeObjectURL(f.pngUrl);
    });
    setFiles([]);
    setErrorMessage(null);
  };

  const successCount = files.filter((f) => f.status === 'success').length;
  const isConvertingAny = files.some((f) => f.status === 'converting');

  return (
    <div className={`w-full max-w-2xl sm:max-w-3xl mx-auto ${className}`}>
      {/* Hidden File Input (Accepts ALL Image Types) */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,.jpg,.jpeg,.jfif,.pjpeg,.png,.webp,.gif,.bmp,.tiff,.tif,.heic,.heif,.hif,.avif,.svg,.svgz,.ico,.cur,.psd,.psb,.raw,.cr2,.cr3,.nef,.arw,.dng,.eps,.ai,.tga,.dds,.hdr,.exr,.wbmp,.pcx"
        onChange={(e) => e.target.files && handleFilesSelected(e.target.files)}
        className="hidden"
        id="image-file-input"
      />

      {/* Global Error Banner */}
      {errorMessage && (
        <div className="mb-3 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
          <p>{errorMessage}</p>
        </div>
      )}

      {/* 
        CONDITIONAL VIEW:
        1. When files.length === 0: Show Initial Drop Area
        2. When files.length > 0: REPLACE Drop Area with "Converted Queue"
      */}
      {files.length === 0 ? (
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-2xl py-6 px-4 sm:py-8 sm:px-6 text-center transition-all bg-white shadow-md shadow-blue-900/5 ${
            isDragging
              ? 'border-blue-600 bg-blue-50/70 scale-[1.008]'
              : 'border-slate-300 hover:border-blue-400'
          }`}
        >
          <div className="flex flex-col items-center justify-center max-w-md mx-auto">
            {/* Refined Upload Icon */}
            <div
              onClick={() => fileInputRef.current?.click()}
              className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center mb-3 cursor-pointer hover:scale-105 transition-all shadow-md shadow-blue-600/25 group"
            >
              <UploadCloud className="w-6 h-6 sm:w-7 sm:h-7 text-white group-hover:-translate-y-0.5 transition-transform" />
            </div>

            <h3 className="text-lg sm:text-xl font-bold text-slate-900 tracking-tight">
              Drop an image here
            </h3>
            <p className="text-xs text-slate-500 mt-1 mb-4">
              or click below to choose • <span className="font-semibold text-blue-600">Ctrl+V</span> to paste
            </p>

            <div className="flex flex-wrap items-center justify-center gap-2.5 z-10 relative">
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl font-bold text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-md shadow-blue-600/20 transition-all active:scale-95 cursor-pointer text-xs sm:text-sm"
              >
                <span>Choose Image</span>
              </button>

              <AddMoreDropdown
                onSelectSource={handleSelectImportSource}
                buttonLabel="Add More Files"
              />
            </div>

            {/* Privacy statement */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-y-1 gap-x-3 text-[11px] text-slate-500">
              <span className="inline-flex items-center gap-1 font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                Browser-Based Processing
              </span>
              <span className="bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-full">
                No Server Uploads
              </span>
              <span className="bg-slate-100 text-slate-700 font-medium px-2 py-0.5 rounded-full">
                Batch & ZIP
              </span>
            </div>

            {sourceFormatFilter && (
              <div className="mt-2 text-[11px] text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded border border-blue-200 font-medium">
                Targeted: <strong className="font-bold">{sourceFormatFilter.toUpperCase()} ➔ PNG</strong>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* CONVERTED QUEUE REPLACES THE DROPZONE HERE */
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`bg-white border-2 rounded-2xl p-4 sm:p-6 shadow-md transition-all ${
            isDragging
              ? 'border-blue-500 bg-blue-50/50 scale-[1.005]'
              : 'border-slate-200'
          }`}
        >
          {/* Header Controls */}
          <div className="flex flex-wrap items-center justify-between gap-2 pb-3.5 border-b border-slate-100 text-xs">
            <div className="flex items-center gap-2">
              <h4 className="font-bold text-slate-900 text-sm sm:text-base">
                Converted Queue ({files.length})
              </h4>
              {successCount > 0 && (
                <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                  {successCount} Ready
                </span>
              )}
            </div>

            <div className="flex items-center gap-1.5">
              {files.length > 1 && successCount > 1 && (
                <button
                  type="button"
                  onClick={handleDownloadAllZip}
                  disabled={isZipping || isConvertingAny}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs transition-colors disabled:opacity-50 cursor-pointer"
                >
                  <FileArchive className="w-3.5 h-3.5" />
                  <span>{isZipping ? 'Zipping...' : 'Download All (.zip)'}</span>
                </button>
              )}

              {files.length > 1 && successCount > 0 && (
                <button
                  type="button"
                  onClick={handleCompressAll}
                  disabled={isBatchCompressing || isConvertingAny}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 shadow-2xs transition-colors disabled:opacity-50 cursor-pointer"
                  title="Compress and reduce size of all PNGs in queue"
                >
                  <Zap className="w-3.5 h-3.5 text-amber-600" />
                  <span>{isBatchCompressing ? 'Compressing...' : 'Compress All'}</span>
                </button>
              )}

              {files.length > 1 && (
                <button
                  type="button"
                  onClick={() => setIsBatchRenameOpen(true)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg text-xs font-semibold text-cyan-900 bg-cyan-50 hover:bg-cyan-100 border border-cyan-300 shadow-2xs transition-colors cursor-pointer"
                  title="Batch rename all images with custom format or numbering"
                >
                  <FileEdit className="w-3.5 h-3.5 text-cyan-600" />
                  <span>Batch Rename</span>
                </button>
              )}

              {/* Add More Files with Device, Dropbox, Drive, OneDrive, and Url */}
              <AddMoreDropdown
                onSelectSource={handleSelectImportSource}
                buttonLabel="Add More Files"
              />

              <button
                type="button"
                onClick={handleClearAll}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                title="Clear all and return to upload view"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Clear All</span>
              </button>
            </div>
          </div>

          {/* Drag & Drop Hint inside Queue */}
          <div className="py-1 text-[11px] text-slate-400 text-center font-medium">
            You can drop more images here or press <span className="font-semibold text-slate-600">Ctrl+V</span> to paste
          </div>

          {/* List of Files */}
          <div className="divide-y divide-slate-100 mt-1 max-h-[60vh] overflow-y-auto pr-1">
            {files.map((file) => (
              <div
                key={file.id}
                className="py-3 flex flex-col md:flex-row md:items-center justify-between gap-3 bg-white hover:bg-slate-50/50 transition-colors rounded-xl px-2 sm:px-3 border border-transparent hover:border-slate-100"
              >
                {/* 1. Left: Thumbnail & Name */}
                <div className="flex items-center gap-3 min-w-0 md:w-1/3">
                  <div
                    onClick={() => file.pngUrl && setPreviewFile(file)}
                    className="w-12 h-12 rounded-lg border border-slate-200 bg-slate-100 shrink-0 flex items-center justify-center overflow-hidden relative cursor-pointer group"
                    style={{
                      backgroundImage: file.pngUrl
                        ? `
                          linear-gradient(45deg, #cbd5e1 25%, transparent 25%), 
                          linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), 
                          linear-gradient(45deg, transparent 75%, #cbd5e1 75%), 
                          linear-gradient(-45deg, transparent 75%, #cbd5e1 75%)
                        `
                        : undefined,
                      backgroundSize: '8px 8px',
                      backgroundColor: '#f1f5f9',
                    }}
                    title="Click to preview fullscreen"
                  >
                    {file.pngUrl ? (
                      <>
                        <img
                          src={file.pngUrl}
                          alt={`Preview of converted ${file.name}`}
                          className="w-full h-full object-contain"
                        />
                        <div className="absolute inset-0 bg-blue-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                          <Eye className="w-4 h-4" />
                        </div>
                      </>
                    ) : (
                      <ImageIcon className="w-5 h-5 text-slate-400" />
                    )}
                  </div>

                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-bold text-slate-900 truncate" title={file.name}>
                      {file.name}
                    </p>
                    <div className="flex items-center gap-1.5 mt-0.5 text-[11px] text-slate-500">
                      <span className="font-mono bg-slate-100 px-1.5 py-0.5 rounded text-[10px] font-bold text-slate-700">
                        {file.originalFormat}
                      </span>
                      <span>•</span>
                      <span className="text-slate-500">
                        {file.status === 'success' ? 'Ready' : file.status === 'converting' ? 'Converting...' : 'Queued'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* 2. CENTER: Prominently Displayed Image Size & Resolution */}
                <div className="flex flex-col items-center justify-center px-3.5 py-1.5 rounded-xl bg-gradient-to-b from-slate-50 to-slate-100/80 border border-slate-200 shrink-0 text-center mx-auto md:mx-0 my-1 md:my-0 shadow-2xs min-w-[210px]">
                  <div className="flex items-center gap-1.5 text-xs">
                    <span className="font-mono text-slate-500 text-[11px]" title="Original File Size">
                      {formatBytes(file.originalSize)}
                    </span>
                    <span className="text-slate-300 font-bold">➔</span>
                    <span className="font-mono font-bold text-emerald-700 text-xs sm:text-sm" title="Converted PNG Size">
                      {file.pngSize ? formatBytes(file.pngSize) : 'Converting...'}
                    </span>
                    {file.pngSize && file.originalSize > file.pngSize && (
                      <span className="bg-emerald-600 text-white text-[10px] font-black px-1.5 py-0.2 rounded-full shadow-2xs">
                        -{Math.round(((file.originalSize - file.pngSize) / file.originalSize) * 100)}%
                      </span>
                    )}
                  </div>
                  {file.width > 0 && file.height > 0 && (
                    <div className="text-[10px] font-mono text-slate-500 mt-0.5 flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-500 inline-block" />
                      <span>{file.width} × {file.height} px</span>
                    </div>
                  )}
                </div>

                {/* Status & Actions Bar */}
                <div className="flex items-center gap-1.5 self-end sm:self-center shrink-0">
                  {file.status === 'converting' && (
                    <div className="flex items-center gap-1.5 text-xs text-blue-600 font-medium">
                      <div className="w-3.5 h-3.5 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                      <span>{file.progress}%</span>
                    </div>
                  )}

                  {file.status === 'success' && (
                    <div className="flex items-center gap-2 flex-nowrap shrink-0">
                      {/* 1. DOWNLOAD PNG - DIRECTLY VISIBLE FIRST WITH ZERO SCROLL */}
                      <button
                        type="button"
                        onClick={() => handleSingleDownload(file)}
                        className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white shadow-sm shadow-blue-600/20 transition-all active:scale-95 cursor-pointer shrink-0"
                        title="Download converted PNG"
                      >
                        <Download className="w-4 h-4" />
                        <span>Download</span>
                      </button>

                      {/* 2. EDIT IMAGE - Contains Palette, Privacy, Copy, Crop, Filters & Background */}
                      <button
                        type="button"
                        onClick={() => handleOpenEditor(file, 'resize')}
                        className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-semibold text-blue-700 bg-blue-50 hover:bg-blue-100 border border-blue-200 transition-colors cursor-pointer shrink-0"
                        title="Edit image: Palette, Privacy, Copy, Filters, Crop & Resize"
                      >
                        <Sliders className="w-3.5 h-3.5 text-blue-600" />
                        <span>Edit Image</span>
                      </button>

                      {/* 3. COMPRESS - Quick size reducer */}
                      <button
                        type="button"
                        onClick={() => setCompressingFile(file)}
                        className="inline-flex items-center gap-1 px-2.5 py-2 rounded-xl text-xs font-semibold text-amber-900 bg-amber-50 hover:bg-amber-100 border border-amber-300 transition-colors cursor-pointer shrink-0 shadow-2xs"
                        title="Reduce image file size (Compress PNG)"
                      >
                        <Zap className="w-3.5 h-3.5 text-amber-600" />
                        <span>Compress</span>
                      </button>
                    </div>
                  )}

                  {file.status === 'error' && (
                    <div className="flex items-center gap-1 text-[11px] text-red-600 bg-red-50 px-2 py-0.5 rounded border border-red-200 max-w-xs">
                      <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
                      <span className="truncate">{file.errorMessage || 'Failed'}</span>
                    </div>
                  )}

                  <button
                    type="button"
                    onClick={() => handleRemoveFile(file.id)}
                    className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg cursor-pointer"
                    aria-label={`Remove ${file.name}`}
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Social Share Bar with Round Logos */}
          <div className="mt-4 pt-3.5 border-t border-slate-100">
            <SocialShareBar />
          </div>
        </div>
      )}

      {/* Comprehensive All-in-One Image Editor Modal with Background Remover */}
      {editingFile && (
        <ImageEditorModal
          file={editingFile}
          isOpen={!!editingFile}
          initialTab={editorInitialTab}
          onClose={() => setEditingFile(null)}
          onSave={handleSaveEditedImage}
        />
      )}

      {/* Image Size Reducer (Compress) Modal */}
      {compressingFile && (
        <CompressModal
          file={compressingFile}
          isOpen={!!compressingFile}
          onClose={() => setCompressingFile(null)}
          onApply={handleApplyCompressedImage}
        />
      )}

      {/* Watermark & Copyright Studio Modal */}
      {watermarkingFile && (
        <WatermarkModal
          file={watermarkingFile}
          isOpen={!!watermarkingFile}
          onClose={() => setWatermarkingFile(null)}
          onApply={handleApplyCompressedImage}
        />
      )}

      {/* Color Palette & HEX Extractor Modal */}
      {paletteFile && (
        <ColorPaletteModal
          file={paletteFile}
          isOpen={!!paletteFile}
          onClose={() => setPaletteFile(null)}
        />
      )}

      {/* EXIF & GPS Privacy Scrubber Modal */}
      {exifFile && (
        <ExifPrivacyModal
          file={exifFile}
          isOpen={!!exifFile}
          onClose={() => setExifFile(null)}
          onStripMetadata={handleStripMetadata}
        />
      )}

      {/* Batch Rename Formatter Modal */}
      {isBatchRenameOpen && (
        <BatchRenameModal
          files={files}
          isOpen={isBatchRenameOpen}
          onClose={() => setIsBatchRenameOpen(false)}
          onApply={handleApplyBatchRename}
        />
      )}

      {/* Fullscreen Preview Modal */}
      {previewFile && previewFile.pngUrl && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in"
          onClick={() => setPreviewFile(null)}
        >
          <div
            className="bg-white rounded-2xl max-w-xl w-full p-5 shadow-2xl relative flex flex-col max-h-[85vh]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between pb-2.5 border-b border-slate-100">
              <div>
                <h3 className="font-bold text-slate-900 text-sm truncate max-w-xs">
                  {previewFile.name}
                </h3>
                <p className="text-[11px] text-slate-500">
                  {previewFile.width} × {previewFile.height} px • {previewFile.pngSize ? formatBytes(previewFile.pngSize) : ''}
                </p>
              </div>
              <button
                onClick={() => setPreviewFile(null)}
                className="p-1 text-slate-400 hover:text-slate-700 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Checkerboard Preview Frame */}
            <div
              className="my-3 rounded-xl border border-slate-200 overflow-hidden flex items-center justify-center p-3 min-h-[240px] max-h-[50vh]"
              style={{
                backgroundImage: `
                  linear-gradient(45deg, #cbd5e1 25%, transparent 25%), 
                  linear-gradient(-45deg, #cbd5e1 25%, transparent 25%), 
                  linear-gradient(45deg, transparent 75%, #cbd5e1 75%), 
                  linear-gradient(-45deg, transparent 75%, #cbd5e1 75%)
                `,
                backgroundSize: '12px 12px',
                backgroundColor: '#f1f5f9',
              }}
            >
              <img
                src={previewFile.pngUrl}
                alt="Converted preview"
                className="max-h-[45vh] max-w-full object-contain drop-shadow-sm"
              />
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 text-xs">
              <button
                onClick={() => handleCopyToClipboard(previewFile)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 cursor-pointer font-medium"
              >
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Image</span>
              </button>
              <button
                onClick={() => handleSingleDownload(previewFile)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-xs cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Download PNG</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Cloud & URL Import Modal (Zero Login Required) */}
      {cloudImportSource && (
        <CloudImportModal
          source={cloudImportSource}
          isOpen={!!cloudImportSource}
          onClose={() => setCloudImportSource(null)}
          onImportFile={handleCloudFileImported}
        />
      )}
    </div>
  );
};
