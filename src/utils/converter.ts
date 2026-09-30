import { ConvertedFile } from '../types';

/**
 * Enhanced format helper to detect any and all image types
 */
export function detectFormat(file: File): string {
  const nameParts = file.name.split('.');
  const ext = nameParts.length > 1 ? nameParts[nameParts.length - 1].toUpperCase() : '';

  if (file.type) {
    if (file.type === 'image/jpeg' || file.type === 'image/jpg') return 'JPEG';
    if (file.type === 'image/png') return 'PNG';
    if (file.type === 'image/webp') return 'WEBP';
    if (file.type === 'image/gif') return 'GIF';
    if (file.type === 'image/bmp' || file.type === 'image/x-ms-bmp') return 'BMP';
    if (file.type === 'image/svg+xml') return 'SVG';
    if (file.type === 'image/avif') return 'AVIF';
    if (file.type === 'image/x-icon' || file.type === 'image/vnd.microsoft.icon') return 'ICO';
    if (file.type === 'image/tiff') return 'TIFF';
    if (file.type === 'image/heic' || file.type === 'image/heif') return 'HEIC';
    if (file.type === 'image/vnd.adobe.photoshop') return 'PSD';
  }

  // Extensions check for all known formats
  if (ext === 'JPG' || ext === 'JPEG' || ext === 'JFIF' || ext === 'PJPEG' || ext === 'PJP') return 'JPEG';
  if (ext === 'PNG' || ext === 'APNG') return 'PNG';
  if (ext === 'WEBP') return 'WEBP';
  if (ext === 'GIF') return 'GIF';
  if (ext === 'BMP' || ext === 'DIB') return 'BMP';
  if (ext === 'SVG' || ext === 'SVGZ') return 'SVG';
  if (ext === 'AVIF' || ext === 'AVIFS') return 'AVIF';
  if (ext === 'HEIC' || ext === 'HEIF' || ext === 'HIF') return 'HEIC';
  if (ext === 'TIFF' || ext === 'TIF') return 'TIFF';
  if (ext === 'ICO' || ext === 'CUR') return 'ICO';
  if (ext === 'PSD' || ext === 'PSB') return 'PSD';
  if (ext === 'RAW' || ext === 'CR2' || ext === 'CR3' || ext === 'NEF' || ext === 'ARW' || ext === 'DNG' || ext === 'ORF' || ext === 'RW2') return 'RAW';
  if (ext === 'TGA' || ext === 'TARGA') return 'TGA';
  if (ext === 'DDS') return 'DDS';
  if (ext === 'HDR' || ext === 'EXR') return 'HDR';
  if (ext === 'EPS' || ext === 'AI') return 'VECTOR';
  if (ext === 'WBMP') return 'WBMP';
  if (ext === 'PCX') return 'PCX';

  return ext || 'IMAGE';
}

/**
 * Human readable file size formatter
 */
export function formatBytes(bytes: number, decimals: number = 1): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
}

/**
 * Memory safety limit: 100MB per file warning
 */
export const MAX_SAFE_FILE_SIZE = 100 * 1024 * 1024; // 100MB

export interface ConversionOptions {
  targetWidth?: number;
  targetHeight?: number;
  backgroundColor?: string;
}

/**
 * Universal Multi-Stage Image-to-PNG Converter (Performance Optimized with Dynamic Code-Splitting)
 * Supports ALL image formats: HEIC, HEIF, TIFF, TIF, SVG, WEBP, AVIF, JPG, JPEG, GIF, BMP, ICO, CUR, and raw bitmaps.
 */
export async function convertImageFileToPng(
  file: File,
  onProgress?: (progress: number) => void,
  options?: ConversionOptions
): Promise<{ blob: Blob; url: string; width: number; height: number; size: number }> {
  onProgress?.(10);

  if (file.size === 0) {
    throw new Error('The selected image file is empty (0 bytes).');
  }

  const ext = file.name.split('.').pop()?.toLowerCase() || '';
  const isHeic =
    ext === 'heic' ||
    ext === 'heif' ||
    ext === 'hif' ||
    file.type === 'image/heic' ||
    file.type === 'image/heif';

  const isTiff =
    ext === 'tiff' ||
    ext === 'tif' ||
    file.type === 'image/tiff';

  const isSvg =
    ext === 'svg' ||
    ext === 'svgz' ||
    file.type === 'image/svg+xml';

  // 1. DEDICATED HEIC / HEIF LAZY DECODER (Loaded on demand to preserve 100/100 PageSpeed)
  if (isHeic) {
    onProgress?.(25);
    try {
      const heic2anyModule = await import('heic2any');
      const heic2any = heic2anyModule.default || heic2anyModule;
      const conversionResult = await heic2any({
        blob: file,
        toType: 'image/png',
        quality: 1.0,
      });

      const convertedBlob: Blob = Array.isArray(conversionResult)
        ? conversionResult[0]
        : conversionResult;

      onProgress?.(70);
      return await renderBlobToPngCanvas(convertedBlob, options, onProgress);
    } catch (err) {
      console.warn('heic2any failed, falling back to standard pipeline', err);
    }
  }

  // 2. DEDICATED TIFF / TIF LAZY DECODER (Loaded on demand to preserve 100/100 PageSpeed)
  if (isTiff) {
    onProgress?.(25);
    try {
      const UTIF = await import('utif');
      const arrayBuffer = await file.arrayBuffer();
      const ifds = UTIF.decode(arrayBuffer);
      if (ifds && ifds.length > 0) {
        const firstPage = ifds[0];
        UTIF.decodeImage(arrayBuffer, firstPage);
        const rgba = UTIF.toRGBA8(firstPage);
        const tiffWidth = firstPage.width;
        const tiffHeight = firstPage.height;

        onProgress?.(60);

        const canvas = document.createElement('canvas');
        canvas.width = tiffWidth;
        canvas.height = tiffHeight;
        const ctx = canvas.getContext('2d');

        if (ctx) {
          const imgData = ctx.createImageData(tiffWidth, tiffHeight);
          imgData.data.set(rgba);
          ctx.putImageData(imgData, 0, 0);

          onProgress?.(85);

          const pngBlob = await new Promise<Blob>((resolve, reject) => {
            canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('TIFF to PNG conversion failed'))), 'image/png');
          });

          const pngUrl = URL.createObjectURL(pngBlob);
          onProgress?.(100);

          return {
            blob: pngBlob,
            url: pngUrl,
            width: tiffWidth,
            height: tiffHeight,
            size: pngBlob.size,
          };
        }
      }
    } catch (err) {
      console.warn('UTIF decode failed, falling back to standard pipeline', err);
    }
  }

  // 3. DEDICATED SVG DECODER
  if (isSvg) {
    onProgress?.(25);
    try {
      const text = await file.text();
      const parser = new DOMParser();
      const doc = parser.parseFromString(text, 'image/svg+xml');
      const svgEl = doc.querySelector('svg');

      let svgW = 800;
      let svgH = 600;

      if (svgEl) {
        const widthAttr = parseFloat(svgEl.getAttribute('width') || '0');
        const heightAttr = parseFloat(svgEl.getAttribute('height') || '0');
        const viewBox = svgEl.getAttribute('viewBox');

        if (widthAttr > 0 && heightAttr > 0) {
          svgW = widthAttr;
          svgH = heightAttr;
        } else if (viewBox) {
          const parts = viewBox.split(/[\s,]+/).map(Number);
          if (parts.length === 4 && parts[2] > 0 && parts[3] > 0) {
            svgW = parts[2];
            svgH = parts[3];
          }
        }
      }

      const svgBlob = new Blob([text], { type: 'image/svg+xml;charset=utf-8' });
      return await renderBlobToPngCanvas(svgBlob, {
        targetWidth: options?.targetWidth || svgW,
        targetHeight: options?.targetHeight || svgH,
        backgroundColor: options?.backgroundColor,
      }, onProgress);
    } catch (err) {
      console.warn('SVG DOM parsing failed, trying standard loader', err);
    }
  }

  // 4. MODERN createImageBitmap DECODER (Hardware Accelerated zero-blocking decode)
  onProgress?.(30);
  if (typeof window !== 'undefined' && 'createImageBitmap' in window) {
    try {
      const bitmap = await createImageBitmap(file);
      onProgress?.(60);

      const targetW = options?.targetWidth && options.targetWidth > 0 ? Math.round(options.targetWidth) : bitmap.width;
      const targetH = options?.targetHeight && options.targetHeight > 0 ? Math.round(options.targetHeight) : bitmap.height;

      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d', { alpha: true });

      if (ctx) {
        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';

        if (options?.backgroundColor && options.backgroundColor !== 'transparent') {
          ctx.fillStyle = options.backgroundColor;
          ctx.fillRect(0, 0, targetW, targetH);
        } else {
          ctx.clearRect(0, 0, targetW, targetH);
        }

        ctx.drawImage(bitmap, 0, 0, targetW, targetH);
        bitmap.close();

        onProgress?.(85);

        const pngBlob = await new Promise<Blob>((resolve, reject) => {
          canvas.toBlob((b) => (b ? resolve(b) : reject(new Error('Canvas export failed'))), 'image/png');
        });

        const pngUrl = URL.createObjectURL(pngBlob);
        onProgress?.(100);

        return {
          blob: pngBlob,
          url: pngUrl,
          width: targetW,
          height: targetH,
          size: pngBlob.size,
        };
      }
    } catch (bitmapErr) {
      // Fall through to HTMLImageElement
    }
  }

  // 5. STANDARD HTML5 IMAGE ELEMENT DECODER
  return await renderBlobToPngCanvas(file, options, onProgress);
}

/**
 * Offscreen Canvas rasterizer from any image Blob/File
 */
async function renderBlobToPngCanvas(
  blob: Blob,
  options?: ConversionOptions,
  onProgress?: (progress: number) => void
): Promise<{ blob: Blob; url: string; width: number; height: number; size: number }> {
  const objectUrl = URL.createObjectURL(blob);

  try {
    onProgress?.(45);
    const img = new Image();
    img.crossOrigin = 'anonymous';

    const imageLoadedPromise = new Promise<{ width: number; height: number }>((resolve, reject) => {
      img.onload = () => {
        resolve({
          width: img.naturalWidth || img.width || 800,
          height: img.naturalHeight || img.height || 600,
        });
      };
      img.onerror = () => {
        reject(
          new Error(
            'Unable to decode image. The format may require a specialized viewer or the file may be corrupt.'
          )
        );
      };
    });

    img.src = objectUrl;
    const { width: originalWidth, height: originalHeight } = await imageLoadedPromise;

    onProgress?.(70);

    const finalWidth = options?.targetWidth && options.targetWidth > 0 ? Math.round(options.targetWidth) : originalWidth;
    const finalHeight = options?.targetHeight && options.targetHeight > 0 ? Math.round(options.targetHeight) : originalHeight;

    const canvas = document.createElement('canvas');
    canvas.width = finalWidth;
    canvas.height = finalHeight;

    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) {
      throw new Error('Canvas 2D context unavailable.');
    }

    ctx.imageSmoothingEnabled = true;
    ctx.imageSmoothingQuality = 'high';

    if (options?.backgroundColor && options.backgroundColor !== 'transparent') {
      ctx.fillStyle = options.backgroundColor;
      ctx.fillRect(0, 0, finalWidth, finalHeight);
    } else {
      ctx.clearRect(0, 0, finalWidth, finalHeight);
    }

    ctx.drawImage(img, 0, 0, finalWidth, finalHeight);

    onProgress?.(90);

    const pngBlob = await new Promise<Blob>((resolve, reject) => {
      canvas.toBlob(
        (b) => {
          if (b) resolve(b);
          else reject(new Error('Failed to create PNG blob.'));
        },
        'image/png',
        1.0
      );
    });

    onProgress?.(100);

    const pngUrl = URL.createObjectURL(pngBlob);

    return {
      blob: pngBlob,
      url: pngUrl,
      width: finalWidth,
      height: finalHeight,
      size: pngBlob.size,
    };
  } finally {
    URL.revokeObjectURL(objectUrl);
  }
}

/**
 * Creates a clean PNG filename based on the original filename
 */
export function getPngOutputFilename(originalName: string): string {
  const lastDotIndex = originalName.lastIndexOf('.');
  const baseName = lastDotIndex > 0 ? originalName.substring(0, lastDotIndex) : originalName;
  const cleanBase = baseName.trim().replace(/\s+/g, '-').replace(/[^a-zA-Z0-9_\-\.]/g, '');
  return `${cleanBase || 'converted-image'}.png`;
}

/**
 * Triggers a direct browser file download for a Blob / URL
 */
export function downloadFile(url: string, filename: string): void {
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}

/**
 * Bundles multiple converted PNGs into a single ZIP file (Lazy loaded on demand)
 */
export async function downloadAllAsZip(
  files: ConvertedFile[],
  zipFilename: string = 'imagetopng-converted-images.zip'
): Promise<void> {
  const JSZipModule = await import('jszip');
  const JSZip = JSZipModule.default || JSZipModule;
  const zip = new JSZip();
  const successFiles = files.filter((f) => f.status === 'success' && f.pngBlob);

  if (successFiles.length === 0) {
    throw new Error('No converted PNG files available to bundle.');
  }

  const usedNames = new Set<string>();

  for (const item of successFiles) {
    if (!item.pngBlob) continue;
    let filename = getPngOutputFilename(item.name);

    if (usedNames.has(filename)) {
      let counter = 1;
      const base = filename.replace(/\.png$/i, '');
      while (usedNames.has(`${base}-${counter}.png`)) {
        counter++;
      }
      filename = `${base}-${counter}.png`;
    }

    usedNames.add(filename);
    zip.file(filename, item.pngBlob);
  }

  const zipBlob = await zip.generateAsync({
    type: 'blob',
    compression: 'DEFLATE',
    compressionOptions: { level: 6 },
  });

  const zipUrl = URL.createObjectURL(zipBlob);
  downloadFile(zipUrl, zipFilename);
  setTimeout(() => URL.revokeObjectURL(zipUrl), 30000);
}
