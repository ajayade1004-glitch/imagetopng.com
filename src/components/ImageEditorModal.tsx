import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  X,
  RotateCw,
  RotateCcw,
  FlipHorizontal,
  FlipVertical,
  Maximize2,
  Crop as CropIcon,
  Sliders,
  Palette,
  Sparkles,
  RotateCcw as ResetIcon,
  Check,
  Link,
  Unlink,
  ShieldCheck,
  Copy,
  Lock,
  MapPin,
  Camera,
  Calendar,
  EyeOff,
  Move,
  CheckCircle2,
} from 'lucide-react';
import { ConvertedFile } from '../types';

export type EditorTabType =
  | 'resize'
  | 'crop'
  | 'rotate'
  | 'adjust'
  | 'background'
  | 'corners'
  | 'palette'
  | 'privacy';

interface ImageEditorModalProps {
  file: ConvertedFile | null;
  isOpen: boolean;
  initialTab?: EditorTabType;
  onClose: () => void;
  onSave: (fileId: string, updated: {
    blob: Blob;
    url: string;
    width: number;
    height: number;
    size: number;
  }) => void;
}

export const ImageEditorModal: React.FC<ImageEditorModalProps> = ({
  file,
  isOpen,
  initialTab = 'resize',
  onClose,
  onSave,
}) => {
  const [activeTab, setActiveTab] = useState<EditorTabType>(initialTab);

  // 1. Dimensions
  const [width, setWidth] = useState<number>(0);
  const [height, setHeight] = useState<number>(0);
  const [lockAspect, setLockAspect] = useState<boolean>(true);
  const [originalRatio, setOriginalRatio] = useState<number>(1);

  // 2. Rotate & Flip
  const [rotation, setRotation] = useState<number>(0);
  const [flipH, setFlipH] = useState<boolean>(false);
  const [flipV, setFlipV] = useState<boolean>(false);

  // 3. Color Adjustments
  const [brightness, setBrightness] = useState<number>(100);
  const [contrast, setContrast] = useState<number>(100);
  const [saturation, setSaturation] = useState<number>(100);
  const [grayscale, setGrayscale] = useState<number>(0);
  const [blur, setBlur] = useState<number>(0);
  const [invert, setInvert] = useState<number>(0);
  const [sepia, setSepia] = useState<number>(0);

  // 4. Background Fill
  const [bgType, setBgType] = useState<'transparent' | 'white' | 'black' | 'custom'>('transparent');
  const [customBgColor, setCustomBgColor] = useState<string>('#ffffff');

  // 5. Rounded Corners
  const [cornerRadius, setCornerRadius] = useState<number>(0);

  // 6. Interactive Drag-to-Select Crop Box State (% 0..100)
  const [cropBox, setCropBox] = useState<{ x: number; y: number; width: number; height: number }>({
    x: 10,
    y: 10,
    width: 80,
    height: 80,
  });
  const [cropAspect, setCropAspect] = useState<'free' | '1:1' | '4:3' | '16:9' | '3:2' | '9:16'>('free');
  const [cropAppliedToast, setCropAppliedToast] = useState<boolean>(false);

  // Canvas & Overlay Refs
  const previewCanvasRef = useRef<HTMLCanvasElement>(null);
  const cropOverlayRef = useRef<HTMLDivElement>(null);
  const loadedImageRef = useRef<HTMLImageElement | null>(null);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);

  // Drag interaction state ref for performance
  const dragRef = useRef<{
    active: boolean;
    mode: 'move' | 'create' | 'handle';
    handle?: string;
    startX: number;
    startY: number;
    initialBox: { x: number; y: number; width: number; height: number };
  }>({
    active: false,
    mode: 'move',
    startX: 0,
    startY: 0,
    initialBox: { x: 10, y: 10, width: 80, height: 80 },
  });

  // 7. Palette & Copy states
  const [paletteColors, setPaletteColors] = useState<{ hex: string; rgb: string }[]>([]);
  const [copiedHex, setCopiedHex] = useState<string | null>(null);
  const [hasCopiedImage, setHasCopiedImage] = useState<boolean>(false);

  // Extract palette when Palette tab is opened
  useEffect(() => {
    if (activeTab === 'palette' && previewCanvasRef.current) {
      try {
        const canvas = previewCanvasRef.current;
        const sampleW = Math.min(canvas.width, 100);
        const sampleH = Math.min(canvas.height, 100);
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = sampleW;
        tempCanvas.height = sampleH;
        const tempCtx = tempCanvas.getContext('2d', { willReadFrequently: true });
        if (!tempCtx) return;
        tempCtx.drawImage(canvas, 0, 0, sampleW, sampleH);
        const imgData = tempCtx.getImageData(0, 0, sampleW, sampleH).data;
        const colorCounts: { [hex: string]: { count: number; r: number; g: number; b: number } } = {};
        for (let i = 0; i < imgData.length; i += 4) {
          if (imgData[i + 3] < 128) continue;
          const r = Math.round(imgData[i] / 24) * 24;
          const g = Math.round(imgData[i + 1] / 24) * 24;
          const b = Math.round(imgData[i + 2] / 24) * 24;
          const hex = `#${((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1).toUpperCase()}`;
          if (!colorCounts[hex]) colorCounts[hex] = { count: 0, r, g, b };
          colorCounts[hex].count++;
        }
        const sorted = Object.entries(colorCounts)
          .sort((a, b) => b[1].count - a[1].count)
          .slice(0, 8)
          .map(([hex, info]) => ({ hex, rgb: `rgb(${info.r}, ${info.g}, ${info.b})` }));
        setPaletteColors(sorted);
      } catch (err) {
        console.error(err);
      }
    }
  }, [activeTab]);

  const handleCopyImage = async () => {
    const canvas = previewCanvasRef.current;
    if (!canvas) return;
    try {
      canvas.toBlob(async (blob) => {
        if (!blob) return;
        await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })]);
        setHasCopiedImage(true);
        setTimeout(() => setHasCopiedImage(false), 2000);
      }, 'image/png');
    } catch {
      // Fallback
    }
  };

  const handleCopyHex = (hex: string) => {
    navigator.clipboard.writeText(hex);
    setCopiedHex(hex);
    setTimeout(() => setCopiedHex(null), 2000);
  };

  // Sync initial tab when changed from props
  useEffect(() => {
    setActiveTab(initialTab);
  }, [initialTab]);

  // Load source image when modal opens
  useEffect(() => {
    if (!file) return;

    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      loadedImageRef.current = img;
      const naturalW = img.naturalWidth || file.width || 800;
      const naturalH = img.naturalHeight || file.height || 600;

      setWidth(naturalW);
      setHeight(naturalH);
      setOriginalRatio(naturalW / naturalH);
      setCropBox({ x: 0, y: 0, width: 100, height: 100 });

      renderPreview();
    };

    if (file.pngUrl) {
      img.src = file.pngUrl;
    } else {
      const objUrl = URL.createObjectURL(file.originalFile);
      img.src = objUrl;
    }
  }, [file]);

  // Dimension Handlers
  const handleWidthChange = (val: number) => {
    setWidth(val);
    if (lockAspect && originalRatio > 0) {
      setHeight(Math.max(1, Math.round(val / originalRatio)));
    }
  };

  const handleHeightChange = (val: number) => {
    setHeight(val);
    if (lockAspect && originalRatio > 0) {
      setWidth(Math.max(1, Math.round(val * originalRatio)));
    }
  };

  const applyScalePreset = (scale: number) => {
    if (!loadedImageRef.current) return;
    const baseW = loadedImageRef.current.naturalWidth;
    const baseH = loadedImageRef.current.naturalHeight;
    setWidth(Math.max(1, Math.round(baseW * scale)));
    setHeight(Math.max(1, Math.round(baseH * scale)));
  };

  // Render Preview on Canvas with all applied transforms
  const renderPreview = useCallback(() => {
    const canvas = previewCanvasRef.current;
    const img = loadedImageRef.current;
    if (!canvas || !img) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Handle 90/270 deg rotation swapping display aspect
    const isRotated90or270 = rotation === 90 || rotation === 270;
    const targetW = isRotated90or270 ? height : width;
    const targetH = isRotated90or270 ? width : height;

    canvas.width = targetW;
    canvas.height = targetH;

    ctx.clearRect(0, 0, targetW, targetH);

    // Apply Background Fill if not transparent
    if (bgType !== 'transparent') {
      let bg = '#ffffff';
      if (bgType === 'black') bg = '#000000';
      else if (bgType === 'custom') bg = customBgColor;
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, targetW, targetH);
    }

    // Apply Rounded Corner Clipping if requested
    if (cornerRadius > 0) {
      ctx.save();
      ctx.beginPath();
      const r = Math.min(cornerRadius, targetW / 2, targetH / 2);
      ctx.moveTo(r, 0);
      ctx.lineTo(targetW - r, 0);
      ctx.quadraticCurveTo(targetW, 0, targetW, r);
      ctx.lineTo(targetW, targetH - r);
      ctx.quadraticCurveTo(targetW, targetH, targetW - r, targetH);
      ctx.lineTo(r, targetH);
      ctx.quadraticCurveTo(0, targetH, 0, targetH - r);
      ctx.lineTo(0, r);
      ctx.quadraticCurveTo(0, 0, r, 0);
      ctx.closePath();
      ctx.clip();
    }

    // Apply CSS Filter Effects
    ctx.filter = `brightness(${brightness}%) contrast(${contrast}%) saturate(${saturation}%) grayscale(${grayscale}%) blur(${blur}px) invert(${invert}%) sepia(${sepia}%)`;

    // Transformation Matrix for Rotation and Flip
    ctx.save();
    ctx.translate(targetW / 2, targetH / 2);
    ctx.rotate((rotation * Math.PI) / 180);
    ctx.scale(flipH ? -1 : 1, flipV ? -1 : 1);

    const drawW = isRotated90or270 ? targetH : targetW;
    const drawH = isRotated90or270 ? targetW : targetH;

    ctx.drawImage(
      img,
      0,
      0,
      img.naturalWidth,
      img.naturalHeight,
      -drawW / 2,
      -drawH / 2,
      drawW,
      drawH
    );

    ctx.restore();

    if (cornerRadius > 0) {
      ctx.restore();
    }
  }, [
    width,
    height,
    rotation,
    flipH,
    flipV,
    brightness,
    contrast,
    saturation,
    grayscale,
    blur,
    invert,
    sepia,
    bgType,
    customBgColor,
    cornerRadius,
  ]);

  // Re-render preview whenever parameters change
  useEffect(() => {
    if (loadedImageRef.current) {
      renderPreview();
    }
  }, [renderPreview]);

  // Aspect ratio helper calculation for crop box
  const applyAspectRatioToBox = (
    box: { x: number; y: number; width: number; height: number },
    ratioType: 'free' | '1:1' | '4:3' | '16:9' | '3:2' | '9:16'
  ) => {
    if (ratioType === 'free') return box;
    const canvas = previewCanvasRef.current;
    if (!canvas) return box;

    let targetRatio = 1;
    if (ratioType === '1:1') targetRatio = 1;
    else if (ratioType === '4:3') targetRatio = 4 / 3;
    else if (ratioType === '16:9') targetRatio = 16 / 9;
    else if (ratioType === '3:2') targetRatio = 3 / 2;
    else if (ratioType === '9:16') targetRatio = 9 / 16;

    const canvasAspect = canvas.width / canvas.height;
    // Percentage aspect = targetRatio / canvasAspect
    const percentRatio = targetRatio / canvasAspect;

    let newW = box.width;
    let newH = newW / percentRatio;

    if (newH > 100) {
      newH = 100;
      newW = newH * percentRatio;
    }
    if (newW > 100) {
      newW = 100;
      newH = newW / percentRatio;
    }

    const newX = Math.max(0, Math.min(100 - newW, box.x));
    const newY = Math.max(0, Math.min(100 - newH, box.y));

    return { x: newX, y: newY, width: newW, height: newH };
  };

  const handleSetAspect = (ratioType: 'free' | '1:1' | '4:3' | '16:9' | '3:2' | '9:16') => {
    setCropAspect(ratioType);
    setCropBox((prev) => applyAspectRatioToBox(prev, ratioType));
  };

  // Drag-to-crop pointer interaction handlers
  const handlePointerDownOverlay = (e: React.PointerEvent<HTMLDivElement>) => {
    if (activeTab !== 'crop') return;
    const overlay = cropOverlayRef.current;
    if (!overlay) return;

    const rect = overlay.getBoundingClientRect();
    const clientX = e.clientX;
    const clientY = e.clientY;

    const target = e.target as HTMLElement;
    const handle = target.getAttribute('data-handle');
    const isMove = target.getAttribute('data-action') === 'move';

    let mode: 'move' | 'create' | 'handle' = 'create';
    if (handle) {
      mode = 'handle';
    } else if (isMove) {
      mode = 'move';
    }

    dragRef.current = {
      active: true,
      mode,
      handle: handle || undefined,
      startX: clientX,
      startY: clientY,
      initialBox: { ...cropBox },
    };

    if (mode === 'create') {
      const clickXPercent = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      const clickYPercent = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
      setCropBox({
        x: clickXPercent,
        y: clickYPercent,
        width: 0,
        height: 0,
      });
    }

    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMoveOverlay = (e: React.PointerEvent<HTMLDivElement>) => {
    if (!dragRef.current.active || activeTab !== 'crop') return;
    const overlay = cropOverlayRef.current;
    if (!overlay) return;

    const rect = overlay.getBoundingClientRect();
    const { mode, handle, startX, startY, initialBox } = dragRef.current;

    const deltaXPercent = ((e.clientX - startX) / rect.width) * 100;
    const deltaYPercent = ((e.clientY - startY) / rect.height) * 100;

    if (mode === 'move') {
      const newX = Math.max(0, Math.min(100 - initialBox.width, initialBox.x + deltaXPercent));
      const newY = Math.max(0, Math.min(100 - initialBox.height, initialBox.y + deltaYPercent));
      setCropBox((prev) => ({ ...prev, x: newX, y: newY }));
    } else if (mode === 'create') {
      const curX = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
      const curY = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
      const originX = Math.max(0, Math.min(100, ((startX - rect.left) / rect.width) * 100));
      const originY = Math.max(0, Math.min(100, ((startY - rect.top) / rect.height) * 100));

      let boxX = Math.min(originX, curX);
      let boxY = Math.min(originY, curY);
      let boxW = Math.max(2, Math.abs(curX - originX));
      let boxH = Math.max(2, Math.abs(curY - originY));

      const updated = applyAspectRatioToBox({ x: boxX, y: boxY, width: boxW, height: boxH }, cropAspect);
      setCropBox(updated);
    } else if (mode === 'handle' && handle) {
      let newX = initialBox.x;
      let newY = initialBox.y;
      let newW = initialBox.width;
      let newH = initialBox.height;

      if (handle.includes('w')) {
        const potentialW = initialBox.width - deltaXPercent;
        if (potentialW >= 4) {
          newX = Math.max(0, initialBox.x + deltaXPercent);
          newW = initialBox.width + (initialBox.x - newX);
        }
      }
      if (handle.includes('e')) {
        newW = Math.max(4, Math.min(100 - initialBox.x, initialBox.width + deltaXPercent));
      }
      if (handle.includes('n')) {
        const potentialH = initialBox.height - deltaYPercent;
        if (potentialH >= 4) {
          newY = Math.max(0, initialBox.y + deltaYPercent);
          newH = initialBox.height + (initialBox.y - newY);
        }
      }
      if (handle.includes('s')) {
        newH = Math.max(4, Math.min(100 - initialBox.y, initialBox.height + deltaYPercent));
      }

      const updated = applyAspectRatioToBox({ x: newX, y: newY, width: newW, height: newH }, cropAspect);
      setCropBox(updated);
    }
  };

  const handlePointerUpOverlay = (e: React.PointerEvent<HTMLDivElement>) => {
    if (dragRef.current.active) {
      dragRef.current.active = false;
      try {
        (e.currentTarget as HTMLElement).releasePointerCapture(e.pointerId);
      } catch {
        // Ignored
      }
      // Guarantee minimum 5% dimensions if user just clicked
      setCropBox((prev) => {
        if (prev.width < 5 || prev.height < 5) {
          return { x: 5, y: 5, width: 90, height: 90 };
        }
        return prev;
      });
    }
  };

  // Commit crop directly onto the current image canvas
  const handleApplyCrop = () => {
    const canvas = previewCanvasRef.current;
    if (!canvas || !loadedImageRef.current) return;

    const realCropX = Math.round((cropBox.x / 100) * canvas.width);
    const realCropY = Math.round((cropBox.y / 100) * canvas.height);
    const realCropW = Math.max(1, Math.round((cropBox.width / 100) * canvas.width));
    const realCropH = Math.max(1, Math.round((cropBox.height / 100) * canvas.height));

    const offCanvas = document.createElement('canvas');
    offCanvas.width = realCropW;
    offCanvas.height = realCropH;
    const offCtx = offCanvas.getContext('2d');
    if (!offCtx) return;

    offCtx.drawImage(canvas, realCropX, realCropY, realCropW, realCropH, 0, 0, realCropW, realCropH);

    const croppedDataUrl = offCanvas.toDataURL('image/png');
    const newImg = new Image();
    newImg.crossOrigin = 'anonymous';
    newImg.onload = () => {
      loadedImageRef.current = newImg;
      setWidth(realCropW);
      setHeight(realCropH);
      setOriginalRatio(realCropW / realCropH);

      // Reset transformations since they are now baked into the cropped image
      setRotation(0);
      setFlipH(false);
      setFlipV(false);
      setBrightness(100);
      setContrast(100);
      setSaturation(100);
      setGrayscale(0);
      setBlur(0);
      setInvert(0);
      setSepia(0);
      setBgType('transparent');
      setCornerRadius(0);
      setCropBox({ x: 0, y: 0, width: 100, height: 100 });

      setCropAppliedToast(true);
      setTimeout(() => setCropAppliedToast(false), 2500);
    };
    newImg.src = croppedDataUrl;
  };

  // Reset to default
  const handleReset = () => {
    if (!loadedImageRef.current) return;
    const naturalW = loadedImageRef.current.naturalWidth;
    const naturalH = loadedImageRef.current.naturalHeight;
    setWidth(naturalW);
    setHeight(naturalH);
    setRotation(0);
    setFlipH(false);
    setFlipV(false);
    setBrightness(100);
    setContrast(100);
    setSaturation(100);
    setGrayscale(0);
    setBlur(0);
    setInvert(0);
    setSepia(0);
    setBgType('transparent');
    setCornerRadius(0);
    setCropBox({ x: 0, y: 0, width: 100, height: 100 });
  };

  // Save Final High-Quality PNG
  const handleSave = async () => {
    const canvas = previewCanvasRef.current;
    if (!canvas || !file) return;

    setIsProcessing(true);

    try {
      const blob = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob(
          (b) => {
            if (b) resolve(b);
            else reject(new Error('Canvas export failed'));
          },
          'image/png',
          1.0
        );
      });

      const url = URL.createObjectURL(blob);
      onSave(file.id, {
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

  // Calculate live pixel selection dimensions
  const cropPixelW = Math.max(1, Math.round((cropBox.width / 100) * width));
  const cropPixelH = Math.max(1, Math.round((cropBox.height / 100) * height));

  return (
    <div
      className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-fade-in text-xs"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl max-w-4xl w-full h-[90vh] max-h-[820px] shadow-2xl flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Top Header */}
        <div className="px-5 py-3.5 border-b border-slate-200 flex items-center justify-between bg-slate-50/80 shrink-0">
          <div className="flex items-center gap-2">
            <span className="p-1.5 rounded-lg bg-blue-600 text-white">
              <Sliders className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-tight">
                Image Editor & PNG Studio
              </h3>
              <p className="text-[11px] text-slate-500 truncate max-w-xs sm:max-w-md">
                {file.name} • <span className="font-mono">{width}×{height}px</span>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-200 transition-colors cursor-pointer"
              title="Reset all edits to original"
            >
              <ResetIcon className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded-lg cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Main Body */}
        <div className="flex-1 flex flex-col md:flex-row min-h-0 overflow-hidden">
          {/* Left Canvas Preview Area with Interactive Crop Layer */}
          <div
            className="flex-1 bg-slate-900 flex items-center justify-center p-4 relative overflow-hidden select-none"
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
            <div className="relative max-w-full max-h-full flex items-center justify-center shadow-2xl rounded-lg overflow-hidden border border-slate-700/60">
              <canvas
                ref={previewCanvasRef}
                className="max-h-[38vh] md:max-h-[62vh] max-w-full object-contain block"
              />

              {/* Interactive Drag-to-Select Crop Overlay */}
              {activeTab === 'crop' && (
                <div
                  ref={cropOverlayRef}
                  onPointerDown={handlePointerDownOverlay}
                  onPointerMove={handlePointerMoveOverlay}
                  onPointerUp={handlePointerUpOverlay}
                  className="absolute inset-0 cursor-crosshair z-20 touch-none select-none"
                >
                  {/* 4 Darkened Mask Panes Around Selection */}
                  <div
                    className="absolute bg-black/60 pointer-events-none"
                    style={{ top: 0, left: 0, right: 0, height: `${cropBox.y}%` }}
                  />
                  <div
                    className="absolute bg-black/60 pointer-events-none"
                    style={{
                      top: `${cropBox.y + cropBox.height}%`,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    }}
                  />
                  <div
                    className="absolute bg-black/60 pointer-events-none"
                    style={{
                      top: `${cropBox.y}%`,
                      left: 0,
                      width: `${cropBox.x}%`,
                      height: `${cropBox.height}%`,
                    }}
                  />
                  <div
                    className="absolute bg-black/60 pointer-events-none"
                    style={{
                      top: `${cropBox.y}%`,
                      left: `${cropBox.x + cropBox.width}%`,
                      right: 0,
                      height: `${cropBox.height}%`,
                    }}
                  />

                  {/* Active Crop Box Rect */}
                  <div
                    data-action="move"
                    className="absolute border-2 border-white shadow-[0_0_0_1px_rgba(0,0,0,0.6),inset_0_0_0_1px_rgba(0,0,0,0.6)] cursor-move z-30 group"
                    style={{
                      top: `${cropBox.y}%`,
                      left: `${cropBox.x}%`,
                      width: `${cropBox.width}%`,
                      height: `${cropBox.height}%`,
                    }}
                  >
                    {/* Rule of Thirds Grid */}
                    <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none opacity-40">
                      <div className="border-r border-b border-white border-dashed" />
                      <div className="border-r border-b border-white border-dashed" />
                      <div className="border-b border-white border-dashed" />
                      <div className="border-r border-b border-white border-dashed" />
                      <div className="border-r border-b border-white border-dashed" />
                      <div className="border-b border-white border-dashed" />
                      <div className="border-r border-white border-dashed" />
                      <div className="border-r border-white border-dashed" />
                      <div className="border-transparent" />
                    </div>

                    {/* Floating Dimensions Pill */}
                    <div className="absolute top-1.5 left-1.5 bg-black/85 backdrop-blur-xs text-white px-2 py-0.5 rounded text-[10px] font-mono pointer-events-none flex items-center gap-1 border border-white/20 shadow-md">
                      <CropIcon className="w-3 h-3 text-blue-400" />
                      <span>{cropPixelW} × {cropPixelH} px</span>
                    </div>

                    {/* 4 Corner Resize Handles */}
                    <div
                      data-handle="nw"
                      className="absolute -top-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-blue-600 rounded-xs shadow-md cursor-nwse-resize z-40"
                    />
                    <div
                      data-handle="ne"
                      className="absolute -top-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-blue-600 rounded-xs shadow-md cursor-nesw-resize z-40"
                    />
                    <div
                      data-handle="sw"
                      className="absolute -bottom-1.5 -left-1.5 w-3.5 h-3.5 bg-white border-2 border-blue-600 rounded-xs shadow-md cursor-nesw-resize z-40"
                    />
                    <div
                      data-handle="se"
                      className="absolute -bottom-1.5 -right-1.5 w-3.5 h-3.5 bg-white border-2 border-blue-600 rounded-xs shadow-md cursor-nwse-resize z-40"
                    />

                    {/* 4 Midpoint Edge Handles */}
                    <div
                      data-handle="n"
                      className="absolute -top-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-white border border-blue-600 rounded-xs shadow-md cursor-ns-resize z-40"
                    />
                    <div
                      data-handle="s"
                      className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-6 h-2 bg-white border border-blue-600 rounded-xs shadow-md cursor-ns-resize z-40"
                    />
                    <div
                      data-handle="w"
                      className="absolute top-1/2 -translate-y-1/2 -left-1 w-2 h-6 bg-white border border-blue-600 rounded-xs shadow-md cursor-ew-resize z-40"
                    />
                    <div
                      data-handle="e"
                      className="absolute top-1/2 -translate-y-1/2 -right-1 w-2 h-6 bg-white border border-blue-600 rounded-xs shadow-md cursor-ew-resize z-40"
                    />
                  </div>
                </div>
              )}
            </div>

            {/* Quick Dimension on Preview Bottom */}
            <div className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-xs text-white px-2.5 py-1 rounded-md text-[11px] font-mono border border-white/10 flex items-center gap-1.5">
              <span>{width} × {height} px</span>
            </div>

            {/* Crop Applied Notification Toast */}
            {cropAppliedToast && (
              <div className="absolute top-4 bg-emerald-600 text-white px-3.5 py-1.5 rounded-full text-xs font-semibold shadow-xl flex items-center gap-1.5 animate-fade-in z-50">
                <CheckCircle2 className="w-4 h-4" />
                <span>Crop applied! Image updated to {width}×{height}px</span>
              </div>
            )}
          </div>

          {/* Right Editing Control Panel */}
          <div className="w-full md:w-80 lg:w-96 flex flex-col border-t md:border-t-0 md:border-l border-slate-200 bg-white shrink-0">
            {/* Tool Tabs */}
            <div className="flex items-center gap-1 p-2 border-b border-slate-200 bg-slate-50 overflow-x-auto shrink-0">
              {[
                { id: 'resize', label: 'Resize', icon: Maximize2 },
                { id: 'crop', label: 'Crop Tool', icon: CropIcon },
                { id: 'rotate', label: 'Rotate', icon: RotateCw },
                { id: 'adjust', label: 'Filters', icon: Sliders },
                { id: 'background', label: 'Color', icon: Palette },
                { id: 'corners', label: 'Corners', icon: Sparkles },
                { id: 'palette', label: 'Palette', icon: Palette },
                { id: 'privacy', label: 'Privacy', icon: ShieldCheck },
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as EditorTabType)}
                    className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                      isActive
                        ? 'bg-blue-600 text-white shadow-2xs'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/70'
                    }`}
                  >
                    <Icon className="w-3.5 h-3.5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tool Tab Content (Scrollable) */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4">
              {/* 1. RESIZE TAB */}
              {activeTab === 'resize' && (
                <div className="space-y-4">
                  <div>
                    <span className="font-bold text-slate-800 block mb-1.5">
                      Scale Presets
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {[
                        { label: '100%', scale: 1 },
                        { label: '75%', scale: 0.75 },
                        { label: '50%', scale: 0.5 },
                        { label: '25%', scale: 0.25 },
                      ].map((p) => (
                        <button
                          key={p.scale}
                          type="button"
                          onClick={() => applyScalePreset(p.scale)}
                          className="py-1.5 px-2 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded-lg text-slate-700 font-semibold transition-colors cursor-pointer text-center text-xs"
                        >
                          {p.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-slate-800">Custom Dimensions</span>
                      <button
                        type="button"
                        onClick={() => setLockAspect(!lockAspect)}
                        className={`inline-flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded cursor-pointer transition-colors ${
                          lockAspect
                            ? 'bg-blue-100 text-blue-700 font-semibold'
                            : 'bg-slate-200 text-slate-600'
                        }`}
                      >
                        {lockAspect ? <Link className="w-3 h-3" /> : <Unlink className="w-3 h-3" />}
                        <span>{lockAspect ? 'Aspect Locked' : 'Free Aspect'}</span>
                      </button>
                    </div>

                    <div className="grid grid-cols-2 gap-2.5">
                      <div>
                        <label className="text-[11px] text-slate-500 font-mono block mb-1">
                          Width (px)
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={16000}
                          value={width}
                          onChange={(e) => handleWidthChange(parseInt(e.target.value) || 0)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono text-xs focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <label className="text-[11px] text-slate-500 font-mono block mb-1">
                          Height (px)
                        </label>
                        <input
                          type="number"
                          min={1}
                          max={16000}
                          value={height}
                          onChange={(e) => handleHeightChange(parseInt(e.target.value) || 0)}
                          className="w-full px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono text-xs focus:ring-1 focus:ring-blue-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* 2. DRAG-TO-SELECT CROP TAB */}
              {activeTab === 'crop' && (
                <div className="space-y-4">
                  {/* Instructions */}
                  <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-blue-900 text-xs">
                    <p className="font-semibold flex items-center gap-1.5 text-blue-800 mb-1">
                      <CropIcon className="w-4 h-4 text-blue-600" />
                      <span>Drag to Crop on Preview</span>
                    </p>
                    <p className="text-[11px] text-blue-700 leading-relaxed">
                      Click and drag on the image preview to draw a crop box. Drag handles to resize, or move the box to reposition.
                    </p>
                  </div>

                  {/* Aspect Ratio Presets */}
                  <div>
                    <span className="font-bold text-slate-800 block text-xs mb-2">
                      Crop Aspect Ratio
                    </span>
                    <div className="grid grid-cols-3 gap-1.5">
                      {[
                        { id: 'free', label: 'Freeform' },
                        { id: '1:1', label: '1:1 Square' },
                        { id: '4:3', label: '4:3 Standard' },
                        { id: '16:9', label: '16:9 Wide' },
                        { id: '3:2', label: '3:2 Photo' },
                        { id: '9:16', label: '9:16 Story' },
                      ].map((ratio) => (
                        <button
                          key={ratio.id}
                          type="button"
                          onClick={() => handleSetAspect(ratio.id as any)}
                          className={`py-1.5 px-2 rounded-lg text-xs font-semibold transition-colors cursor-pointer text-center ${
                            cropAspect === ratio.id
                              ? 'bg-blue-600 text-white shadow-2xs'
                              : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                          }`}
                        >
                          {ratio.label}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Crop Dimensions Summary Card */}
                  <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-700 font-semibold">
                      <span>Selected Crop Area:</span>
                      <span className="font-mono text-blue-700 font-bold">
                        {cropPixelW} × {cropPixelH} px
                      </span>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-500 pt-1 border-t border-slate-200">
                      <div>
                        Position: <span className="font-mono text-slate-700 font-medium">X:{Math.round(cropBox.x)}% Y:{Math.round(cropBox.y)}%</span>
                      </div>
                      <div>
                        Coverage: <span className="font-mono text-slate-700 font-medium">{Math.round((cropBox.width * cropBox.height) / 100)}%</span>
                      </div>
                    </div>
                  </div>

                  {/* Crop Action Buttons */}
                  <div className="space-y-2 pt-1">
                    <button
                      type="button"
                      onClick={handleApplyCrop}
                      className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-sm transition-all cursor-pointer"
                    >
                      <Check className="w-4 h-4" />
                      <span>Apply Crop (Keep Selection)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setCropBox({ x: 0, y: 0, width: 100, height: 100 });
                        setCropAspect('free');
                      }}
                      className="w-full py-1.5 px-3 bg-white border border-slate-300 hover:bg-slate-100 rounded-lg text-slate-700 font-semibold text-xs transition-colors cursor-pointer text-center"
                    >
                      Reset Selection (Full Image)
                    </button>
                  </div>
                </div>
              )}

              {/* 3. ROTATE & FLIP TAB */}
              {activeTab === 'rotate' && (
                <div className="space-y-4">
                  <div>
                    <span className="font-bold text-slate-800 block mb-2 text-xs">
                      Rotate 90° Clockwise / Counter-Clockwise
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setRotation((r) => (r + 90) % 360)}
                        className="py-2.5 px-3 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
                      >
                        <RotateCw className="w-4 h-4 text-blue-600" />
                        <span>Rotate +90°</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setRotation((r) => (r - 90 + 360) % 360)}
                        className="py-2.5 px-3 bg-slate-100 hover:bg-blue-50 hover:text-blue-700 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs"
                      >
                        <RotateCcw className="w-4 h-4 text-blue-600" />
                        <span>Rotate -90°</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <span className="font-bold text-slate-800 block mb-2 text-xs">
                      Mirror Flip
                    </span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => setFlipH(!flipH)}
                        className={`py-2 px-3 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs ${
                          flipH
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        <FlipHorizontal className="w-4 h-4" />
                        <span>Flip Horizontal</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setFlipV(!flipV)}
                        className={`py-2 px-3 rounded-xl font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer text-xs ${
                          flipV
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                        }`}
                      >
                        <FlipVertical className="w-4 h-4" />
                        <span>Flip Vertical</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 4. FILTERS TAB */}
              {activeTab === 'adjust' && (
                <div className="space-y-3.5">
                  <div>
                    <div className="flex justify-between text-xs text-slate-700 font-medium mb-1">
                      <span>Brightness</span>
                      <span className="font-mono">{brightness}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="200"
                      value={brightness}
                      onChange={(e) => setBrightness(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-700 font-medium mb-1">
                      <span>Contrast</span>
                      <span className="font-mono">{contrast}%</span>
                    </div>
                    <input
                      type="range"
                      min="20"
                      max="200"
                      value={contrast}
                      onChange={(e) => setContrast(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-700 font-medium mb-1">
                      <span>Saturation</span>
                      <span className="font-mono">{saturation}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="200"
                      value={saturation}
                      onChange={(e) => setSaturation(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-700 font-medium mb-1">
                      <span>Grayscale (B&W)</span>
                      <span className="font-mono">{grayscale}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={grayscale}
                      onChange={(e) => setGrayscale(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-700 font-medium mb-1">
                      <span>Sepia Tint</span>
                      <span className="font-mono">{sepia}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={sepia}
                      onChange={(e) => setSepia(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between text-xs text-slate-700 font-medium mb-1">
                      <span>Invert Colors</span>
                      <span className="font-mono">{invert}%</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={invert}
                      onChange={(e) => setInvert(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />
                  </div>
                </div>
              )}

              {/* 5. BACKGROUND COLOR TAB */}
              {activeTab === 'background' && (
                <div className="space-y-4">
                  <span className="font-bold text-slate-800 block text-xs">
                    Alpha Transparency or Solid Fill
                  </span>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setBgType('transparent')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-colors cursor-pointer text-xs font-semibold ${
                        bgType === 'transparent'
                          ? 'border-blue-600 bg-blue-50/60 text-blue-700'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg border border-slate-300 bg-[linear-gradient(45deg,#cbd5e1_25%,transparent_25%),linear-gradient(-45deg,#cbd5e1_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#cbd5e1_75%),linear-gradient(-45deg,transparent_75%,#cbd5e1_75%)] bg-[size:8px_8px] bg-slate-100" />
                      <span>Transparent (Alpha)</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBgType('white')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-colors cursor-pointer text-xs font-semibold ${
                        bgType === 'white'
                          ? 'border-blue-600 bg-blue-50/60 text-blue-700'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg border border-slate-300 bg-white shadow-2xs" />
                      <span>Pure White</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBgType('black')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-colors cursor-pointer text-xs font-semibold ${
                        bgType === 'black'
                          ? 'border-blue-600 bg-blue-50/60 text-blue-700'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg border border-slate-700 bg-black shadow-2xs" />
                      <span>Solid Black</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => setBgType('custom')}
                      className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-colors cursor-pointer text-xs font-semibold ${
                        bgType === 'custom'
                          ? 'border-blue-600 bg-blue-50/60 text-blue-700'
                          : 'border-slate-200 bg-white hover:bg-slate-50 text-slate-700'
                      }`}
                    >
                      <div
                        className="w-8 h-8 rounded-lg border border-slate-300 shadow-2xs"
                        style={{ backgroundColor: customBgColor }}
                      />
                      <span>Custom Color</span>
                    </button>
                  </div>

                  {bgType === 'custom' && (
                    <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-2">
                      <label className="text-[11px] font-semibold text-slate-700 block">
                        Choose Background Color:
                      </label>
                      <div className="flex items-center gap-2">
                        <input
                          type="color"
                          value={customBgColor}
                          onChange={(e) => setCustomBgColor(e.target.value)}
                          className="w-9 h-9 rounded-lg border border-slate-300 cursor-pointer p-0.5 bg-white"
                        />
                        <input
                          type="text"
                          value={customBgColor}
                          onChange={(e) => setCustomBgColor(e.target.value)}
                          className="flex-1 px-2.5 py-1.5 rounded-lg border border-slate-300 font-mono text-xs uppercase"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* 6. ROUNDED CORNERS TAB */}
              {activeTab === 'corners' && (
                <div className="space-y-4">
                  <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-3">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-bold text-slate-800">Corner Radius</span>
                      <span className="font-mono text-blue-700 font-bold">{cornerRadius}px</span>
                    </div>

                    <input
                      type="range"
                      min="0"
                      max={Math.round(Math.min(width, height) / 2)}
                      value={cornerRadius}
                      onChange={(e) => setCornerRadius(Number(e.target.value))}
                      className="w-full accent-blue-600"
                    />

                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => setCornerRadius(0)}
                        className="flex-1 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium cursor-pointer"
                      >
                        Square (0px)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCornerRadius(24)}
                        className="flex-1 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium cursor-pointer"
                      >
                        Soft (24px)
                      </button>
                      <button
                        type="button"
                        onClick={() => setCornerRadius(Math.round(Math.min(width, height) / 2))}
                        className="flex-1 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium cursor-pointer"
                      >
                        Circle / Oval
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* 7. PALETTE TAB */}
              {activeTab === 'palette' && (
                <div className="space-y-3">
                  <div>
                    <span className="font-bold text-slate-800 block text-xs">
                      Dominant Color Palette & HEX Codes
                    </span>
                    <p className="text-[11px] text-slate-500 mt-0.5">
                      Click any swatch or HEX code below to copy it directly to your clipboard:
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    {paletteColors.map((c) => (
                      <button
                        key={c.hex}
                        type="button"
                        onClick={() => handleCopyHex(c.hex)}
                        className="p-2 rounded-xl border border-slate-200 hover:border-pink-500 bg-white flex items-center gap-2.5 transition-colors cursor-pointer text-left"
                      >
                        <div
                          className="w-8 h-8 rounded-lg shadow-xs border border-black/10 shrink-0"
                          style={{ backgroundColor: c.hex }}
                        />
                        <div className="min-w-0 flex-1">
                          <span className="font-mono font-bold text-slate-800 text-xs block truncate">
                            {c.hex}
                          </span>
                          <span className="text-[10px] text-slate-400 font-mono block truncate">
                            {copiedHex === c.hex ? 'Copied!' : c.rgb}
                          </span>
                        </div>
                      </button>
                    ))}
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      const css = paletteColors.map((c, i) => `  --color-${i + 1}: ${c.hex};`).join('\n');
                      navigator.clipboard.writeText(`:root {\n${css}\n}`);
                      setCopiedHex('ALL_CSS');
                      setTimeout(() => setCopiedHex(null), 2000);
                    }}
                    className="w-full py-2 px-3 rounded-lg border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold text-xs cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Copy className="w-3.5 h-3.5 text-slate-500" />
                    <span>{copiedHex === 'ALL_CSS' ? 'Copied CSS Variables!' : 'Copy All as CSS Variables'}</span>
                  </button>
                </div>
              )}

              {/* 8. PRIVACY TAB */}
              {activeTab === 'privacy' && (
                <div className="space-y-3">
                  <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200">
                    <div className="flex items-start gap-2.5">
                      <Lock className="w-4 h-4 text-emerald-600 mt-0.5 shrink-0" />
                      <div>
                        <h4 className="font-bold text-emerald-950 text-xs">
                          Browser-Based Privacy Sanitized
                        </h4>
                        <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                          Your output PNG is rasterized from pure raw canvas pixels. Camera serial numbers, GPS geolocation tags, and date stamps are excluded.
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5 bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                    <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                      <div className="flex items-center gap-2 text-slate-700">
                        <MapPin className="w-3.5 h-3.5 text-emerald-600" />
                        <span>GPS Geolocation</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Scrubbed
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Camera className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Camera Hardware</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Sanitized
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1 border-b border-slate-200/60">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Calendar className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Date / Timestamp</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Cleaned
                      </span>
                    </div>

                    <div className="flex items-center justify-between py-1">
                      <div className="flex items-center gap-2 text-slate-700">
                        <EyeOff className="w-3.5 h-3.5 text-emerald-600" />
                        <span>Software Tags</span>
                      </div>
                      <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">
                        Zero Traces
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Bottom Actions Bar */}
            <div className="p-3.5 border-t border-slate-200 bg-slate-50/80 flex items-center justify-between gap-2 shrink-0">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-3.5 py-1.5 rounded-lg bg-slate-200 hover:bg-slate-300 text-slate-700 font-semibold cursor-pointer text-xs"
                >
                  Cancel
                </button>

                {/* Copy Image Button inside Edit Image */}
                <button
                  type="button"
                  onClick={handleCopyImage}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-semibold cursor-pointer shadow-2xs text-xs"
                  title="Copy PNG directly to clipboard"
                >
                  {hasCopiedImage ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-600" />
                      <span className="text-emerald-700">Image Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-500" />
                      <span>Copy Image</span>
                    </>
                  )}
                </button>
              </div>

              <button
                type="button"
                onClick={handleSave}
                disabled={isProcessing}
                className="inline-flex items-center gap-1.5 px-5 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold cursor-pointer shadow-md shadow-blue-600/20 disabled:opacity-50 text-xs sm:text-sm"
              >
                <Check className="w-4 h-4" />
                <span>{isProcessing ? 'Rendering...' : 'Apply & Save PNG'}</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
