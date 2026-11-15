import { ExifTagItem, writeImageBinaryWithTags } from './exifEngine';

export type FilterPresetId =
  | 'original'
  | 'vivid'
  | 'warm'
  | 'cool'
  | 'bw'
  | 'vintage'
  | 'sepia'
  | 'cinema'
  | 'pastel'
  | 'crisp'
  | 'moody';

export interface FilterPreset {
  id: FilterPresetId;
  nameTr: string;
  nameEn: string;
  cssFilter: string;
  overlayColor?: string;
  overlayBlend?: GlobalCompositeOperation;
  swatchGradient: string;
}

export const PHOTO_FILTERS: FilterPreset[] = [
  {
    id: 'original',
    nameTr: 'Orijinal',
    nameEn: 'Original',
    cssFilter: 'none',
    swatchGradient: 'linear-gradient(135deg, #E2EFFB 0%, #94B8D7 100%)',
  },
  {
    id: 'vivid',
    nameTr: '1. Canlı Renk',
    nameEn: '1. Vivid Boost',
    cssFilter: 'saturate(1.42) contrast(1.12) brightness(1.03)',
    swatchGradient: 'linear-gradient(135deg, #38BDF8 0%, #0284C7 50%, #F59E0B 100%)',
  },
  {
    id: 'warm',
    nameTr: '2. Altın Sıcaklık',
    nameEn: '2. Golden Warmth',
    cssFilter: 'sepia(0.24) saturate(1.25) brightness(1.04) contrast(1.04)',
    overlayColor: 'rgba(245, 158, 11, 0.08)',
    overlayBlend: 'soft-light',
    swatchGradient: 'linear-gradient(135deg, #FCD34D 0%, #D97706 100%)',
  },
  {
    id: 'cool',
    nameTr: '3. Kuzey Mavisi',
    nameEn: '3. Nordic Cool',
    cssFilter: 'hue-rotate(-8deg) saturate(0.95) contrast(1.08) brightness(1.02)',
    overlayColor: 'rgba(56, 189, 248, 0.12)',
    overlayBlend: 'soft-light',
    swatchGradient: 'linear-gradient(135deg, #BAE6FD 0%, #0369A1 100%)',
  },
  {
    id: 'bw',
    nameTr: '4. Siyah & Beyaz',
    nameEn: '4. Dramatic B&W',
    cssFilter: 'grayscale(1) contrast(1.28) brightness(1.02)',
    swatchGradient: 'linear-gradient(135deg, #F8FAFC 0%, #1E293B 100%)',
  },
  {
    id: 'vintage',
    nameTr: '5. Mat Film',
    nameEn: '5. Matte Vintage',
    cssFilter: 'sepia(0.28) contrast(0.9) brightness(1.06) saturate(0.85)',
    overlayColor: 'rgba(180, 140, 100, 0.12)',
    overlayBlend: 'multiply',
    swatchGradient: 'linear-gradient(135deg, #D6D3D1 0%, #78716C 100%)',
  },
  {
    id: 'sepia',
    nameTr: '6. Klasik Sepya',
    nameEn: '6. Classic Sepia',
    cssFilter: 'sepia(0.78) contrast(1.08) brightness(0.98)',
    swatchGradient: 'linear-gradient(135deg, #E7D5B9 0%, #7C5832 100%)',
  },
  {
    id: 'cinema',
    nameTr: '7. Ege Sineması',
    nameEn: '7. Aegean Cinema',
    cssFilter: 'contrast(1.18) saturate(1.12) brightness(0.97) hue-rotate(-4deg)',
    overlayColor: 'rgba(14, 116, 144, 0.14)',
    overlayBlend: 'soft-light',
    swatchGradient: 'linear-gradient(135deg, #0D9488 0%, #0F172A 100%)',
  },
  {
    id: 'pastel',
    nameTr: '8. Yumuşak Pastel',
    nameEn: '8. Soft Pastel',
    cssFilter: 'brightness(1.1) contrast(0.88) saturate(1.15)',
    overlayColor: 'rgba(244, 248, 255, 0.12)',
    overlayBlend: 'screen',
    swatchGradient: 'linear-gradient(135deg, #E0F2FE 0%, #FBCFE8 100%)',
  },
  {
    id: 'crisp',
    nameTr: '9. Keskin Netlik',
    nameEn: '9. Crisp Clarity',
    cssFilter: 'contrast(1.24) saturate(1.18) brightness(1.02)',
    swatchGradient: 'linear-gradient(135deg, #E0F2FE 0%, #0284C7 100%)',
  },
  {
    id: 'moody',
    nameTr: '10. Derin Dramatik',
    nameEn: '10. Deep Moody',
    cssFilter: 'brightness(0.88) contrast(1.32) saturate(0.82)',
    overlayColor: 'rgba(15, 37, 55, 0.18)',
    overlayBlend: 'multiply',
    swatchGradient: 'linear-gradient(135deg, #334155 0%, #091929 100%)',
  },
];

export type ResolutionPresetId = 'original' | 'hd' | '2k' | '4k' | '8k' | 'custom';

export interface ResolutionPreset {
  id: ResolutionPresetId;
  labelTr: string;
  labelEn: string;
  targetLongEdge: number | null;
}

export const RESOLUTION_PRESETS: ResolutionPreset[] = [
  { id: 'original', labelTr: 'Orijinal', labelEn: 'Original', targetLongEdge: null },
  { id: 'hd', labelTr: 'HD (1080p)', labelEn: 'HD (1080p)', targetLongEdge: 1920 },
  { id: '2k', labelTr: '2K QHD', labelEn: '2K QHD', targetLongEdge: 2560 },
  { id: '4k', labelTr: '4K UHD', labelEn: '4K UHD', targetLongEdge: 3840 },
  { id: '8k', labelTr: '8K UHD', labelEn: '8K UHD', targetLongEdge: 7680 },
  { id: 'custom', labelTr: 'Özel Boyut', labelEn: 'Custom Size', targetLongEdge: null },
];

export type CropAspectId = 'free' | '1:1' | '4:3' | '16:9' | '3:2' | '9:16';

export interface CropRect {
  x: number; // normalized 0..1
  y: number; // normalized 0..1
  width: number; // normalized 0..1
  height: number; // normalized 0..1
}

export type OutputFormatOption = 'ORIGINAL' | 'JPEG' | 'PNG' | 'WEBP';

export interface PhotoEditState {
  filterId: FilterPresetId;
  brightness: number; // 50..150, default 100
  contrast: number; // 50..150, default 100
  saturation: number; // 0..200, default 100
  sharpness: number; // 0..100, default 0
  vignette: number; // 0..100, default 0
  blur: number; // 0..10 px, default 0
  rotation: 0 | 90 | 180 | 270;
  flipH: boolean;
  flipV: boolean;
  cropAspect: CropAspectId;
  cropRect: CropRect;
  resolutionPreset: ResolutionPresetId;
  customWidth: number;
  customHeight: number;
  lockAspectRatio: boolean;
  outputFormat: OutputFormatOption;
  quality: number; // 10..100, default 92
}

export function createDefaultPhotoEditState(width = 1024, height = 768): PhotoEditState {
  return {
    filterId: 'original',
    brightness: 100,
    contrast: 100,
    saturation: 100,
    sharpness: 0,
    vignette: 0,
    blur: 0,
    rotation: 0,
    flipH: false,
    flipV: false,
    cropAspect: 'free',
    cropRect: { x: 0, y: 0, width: 1, height: 1 },
    resolutionPreset: 'original',
    customWidth: width,
    customHeight: height,
    lockAspectRatio: true,
    outputFormat: 'ORIGINAL',
    quality: 92,
  };
}

export function clampCropRect(rect: CropRect): CropRect {
  const minSize = 0.05;
  const width = Math.max(minSize, Math.min(1, rect.width));
  const height = Math.max(minSize, Math.min(1, rect.height));
  const x = Math.max(0, Math.min(1 - width, rect.x));
  const y = Math.max(0, Math.min(1 - height, rect.y));
  return {
    x: Number(x.toFixed(4)),
    y: Number(y.toFixed(4)),
    width: Number(width.toFixed(4)),
    height: Number(height.toFixed(4)),
  };
}

export function getOrientedDimensions(
  srcWidth: number,
  srcHeight: number,
  rotation: 0 | 90 | 180 | 270
): { width: number; height: number } {
  if (rotation === 90 || rotation === 270) {
    return { width: Math.max(1, srcHeight), height: Math.max(1, srcWidth) };
  }
  return { width: Math.max(1, srcWidth), height: Math.max(1, srcHeight) };
}

export function computeAspectCropRect(
  aspectId: CropAspectId,
  orientedWidth: number,
  orientedHeight: number
): CropRect {
  if (aspectId === 'free') {
    return { x: 0, y: 0, width: 1, height: 1 };
  }

  const ratioMap: Record<Exclude<CropAspectId, 'free'>, number> = {
    '1:1': 1,
    '4:3': 4 / 3,
    '16:9': 16 / 9,
    '3:2': 3 / 2,
    '9:16': 9 / 16,
  };

  const targetRatio = ratioMap[aspectId];
  const imgRatio = orientedWidth / Math.max(1, orientedHeight);

  let normW = 1;
  let normH = 1;

  if (imgRatio > targetRatio) {
    // Image is wider than target aspect: full height, crop width
    normH = 1;
    normW = targetRatio / imgRatio;
  } else {
    // Image is taller than target aspect: full width, crop height
    normW = 1;
    normH = imgRatio / targetRatio;
  }

  const x = (1 - normW) / 2;
  const y = (1 - normH) / 2;
  return clampCropRect({ x, y, width: normW, height: normH });
}

export function isFullCrop(cropRect: CropRect): boolean {
  return (
    Math.abs(cropRect.x) < 0.002 &&
    Math.abs(cropRect.y) < 0.002 &&
    Math.abs(cropRect.width - 1) < 0.002 &&
    Math.abs(cropRect.height - 1) < 0.002
  );
}

export function computeTargetDimensions(
  srcWidth: number,
  srcHeight: number,
  editState: Pick<
    PhotoEditState,
    'rotation' | 'cropRect' | 'resolutionPreset' | 'customWidth' | 'customHeight'
  >
): { width: number; height: number; croppedWidth: number; croppedHeight: number } {
  const oriented = getOrientedDimensions(srcWidth, srcHeight, editState.rotation);
  const crop = clampCropRect(editState.cropRect);
  const croppedWidth = Math.max(1, Math.round(oriented.width * crop.width));
  const croppedHeight = Math.max(1, Math.round(oriented.height * crop.height));

  if (editState.resolutionPreset === 'original') {
    return {
      width: croppedWidth,
      height: croppedHeight,
      croppedWidth,
      croppedHeight,
    };
  }

  if (editState.resolutionPreset === 'custom') {
    return {
      width: Math.max(16, Math.min(12000, Math.round(editState.customWidth || croppedWidth))),
      height: Math.max(16, Math.min(12000, Math.round(editState.customHeight || croppedHeight))),
      croppedWidth,
      croppedHeight,
    };
  }

  const preset = RESOLUTION_PRESETS.find((p) => p.id === editState.resolutionPreset);
  const targetLongEdge = preset?.targetLongEdge ?? null;
  if (!targetLongEdge) {
    return {
      width: croppedWidth,
      height: croppedHeight,
      croppedWidth,
      croppedHeight,
    };
  }

  const longEdge = Math.max(croppedWidth, croppedHeight);
  const scale = targetLongEdge / longEdge;
  return {
    width: Math.max(1, Math.round(croppedWidth * scale)),
    height: Math.max(1, Math.round(croppedHeight * scale)),
    croppedWidth,
    croppedHeight,
  };
}

export function buildCompositeCssFilter(
  editState: Pick<PhotoEditState, 'filterId' | 'brightness' | 'contrast' | 'saturation' | 'blur'>
): string {
  const parts: string[] = [];
  const preset = PHOTO_FILTERS.find((f) => f.id === editState.filterId);
  if (preset && preset.cssFilter !== 'none') {
    parts.push(preset.cssFilter);
  }
  if (editState.brightness !== 100) {
    parts.push(`brightness(${(editState.brightness / 100).toFixed(2)})`);
  }
  if (editState.contrast !== 100) {
    parts.push(`contrast(${(editState.contrast / 100).toFixed(2)})`);
  }
  if (editState.saturation !== 100) {
    parts.push(`saturate(${(editState.saturation / 100).toFixed(2)})`);
  }
  if (editState.blur > 0) {
    parts.push(`blur(${editState.blur.toFixed(1)}px)`);
  }
  return parts.length > 0 ? parts.join(' ') : 'none';
}

export function resolveOutputFormat(
  requested: OutputFormatOption,
  originalFormat: 'JPEG' | 'PNG' | 'WEBP' | 'UNKNOWN'
): 'JPEG' | 'PNG' | 'WEBP' {
  if (requested === 'JPEG' || requested === 'PNG' || requested === 'WEBP') {
    return requested;
  }
  if (originalFormat === 'PNG' || originalFormat === 'WEBP' || originalFormat === 'JPEG') {
    return originalFormat;
  }
  return 'PNG';
}

export function getFormatMimeAndExt(format: 'JPEG' | 'PNG' | 'WEBP'): {
  mimeType: string;
  extension: string;
} {
  switch (format) {
    case 'PNG':
      return { mimeType: 'image/png', extension: 'png' };
    case 'WEBP':
      return { mimeType: 'image/webp', extension: 'webp' };
    case 'JPEG':
    default:
      return { mimeType: 'image/jpeg', extension: 'jpg' };
  }
}

export function hasVisualOrFormatChanges(
  editState: PhotoEditState,
  originalFormat: 'JPEG' | 'PNG' | 'WEBP' | 'UNKNOWN'
): boolean {
  const targetFormat = resolveOutputFormat(editState.outputFormat, originalFormat);
  if (originalFormat === 'UNKNOWN' || targetFormat !== originalFormat) {
    return true;
  }
  if (editState.filterId !== 'original') return true;
  if (editState.brightness !== 100) return true;
  if (editState.contrast !== 100) return true;
  if (editState.saturation !== 100) return true;
  if (editState.sharpness > 0) return true;
  if (editState.vignette > 0) return true;
  if (editState.blur > 0) return true;
  if (editState.rotation !== 0) return true;
  if (editState.flipH || editState.flipV) return true;
  if (!isFullCrop(editState.cropRect)) return true;
  if (editState.resolutionPreset !== 'original') return true;
  return false;
}

/**
 * Applies a fast 3x3 unsharp-mask convolution kernel to canvas ImageData.
 */
function applyUnsharpMask(ctx: CanvasRenderingContext2D, width: number, height: number, amountPct: number) {
  // Safeguard for huge 8K images so browser thread stays responsive
  if (width * height > 12_000_000) return;

  const strength = Math.min(1, Math.max(0, amountPct / 100)) * 0.65;
  if (strength <= 0.01) return;

  const imgData = ctx.getImageData(0, 0, width, height);
  const src = imgData.data;
  const out = new Uint8ClampedArray(src.length);
  const rowStride = width * 4;

  // Copy border pixels
  out.set(src);

  for (let y = 1; y < height - 1; y++) {
    const rowOff = y * rowStride;
    for (let x = 1; x < width - 1; x++) {
      const idx = rowOff + x * 4;
      for (let c = 0; c < 3; c++) {
        const center = src[idx + c];
        const neighbors =
          (src[idx - 4 + c] +
            src[idx + 4 + c] +
            src[idx - rowStride + c] +
            src[idx + rowStride + c]) *
          0.25;
        const sharpened = center + (center - neighbors) * strength * 2.2;
        out[idx + c] = sharpened < 0 ? 0 : sharpened > 255 ? 255 : sharpened;
      }
      out[idx + 3] = src[idx + 3];
    }
  }

  imgData.data.set(out);
  ctx.putImageData(imgData, 0, 0);
}

/**
 * Progressive high-quality canvas upscale/downscale + filter/crop/transform + EXIF binary packaging.
 */
export async function renderEditedImageWithTags(
  previewUrl: string,
  originalFormat: 'JPEG' | 'PNG' | 'WEBP' | 'UNKNOWN',
  editState: PhotoEditState,
  tags: ExifTagItem[]
): Promise<{
  bytes: Uint8Array;
  format: 'JPEG' | 'PNG' | 'WEBP';
  mimeType: string;
  extension: string;
  width: number;
  height: number;
}> {
  const img = await new Promise<HTMLImageElement>((resolve, reject) => {
    const el = new Image();
    el.crossOrigin = 'anonymous';
    el.onload = () => resolve(el);
    el.onerror = () => reject(new Error('Failed to decode source image'));
    el.src = previewUrl;
  });

  const srcW = img.naturalWidth || 1024;
  const srcH = img.naturalHeight || 768;

  // Step 1: Apply rotation and flip to an oriented base canvas
  const oriented = getOrientedDimensions(srcW, srcH, editState.rotation);
  const orientedCanvas = document.createElement('canvas');
  orientedCanvas.width = oriented.width;
  orientedCanvas.height = oriented.height;
  const oCtx = orientedCanvas.getContext('2d');
  if (!oCtx) throw new Error('2D Canvas context unavailable');

  oCtx.save();
  oCtx.translate(oriented.width / 2, oriented.height / 2);
  oCtx.rotate((editState.rotation * Math.PI) / 180);
  oCtx.scale(editState.flipH ? -1 : 1, editState.flipV ? -1 : 1);
  oCtx.drawImage(img, -srcW / 2, -srcH / 2, srcW, srcH);
  oCtx.restore();

  // Step 2: Extract cropped region
  const crop = clampCropRect(editState.cropRect);
  const sx = Math.round(crop.x * oriented.width);
  const sy = Math.round(crop.y * oriented.height);
  const sw = Math.max(1, Math.round(crop.width * oriented.width));
  const sh = Math.max(1, Math.round(crop.height * oriented.height));

  const target = computeTargetDimensions(srcW, srcH, editState);
  let curCanvas = document.createElement('canvas');
  curCanvas.width = sw;
  curCanvas.height = sh;
  const cCtx = curCanvas.getContext('2d');
  if (!cCtx) throw new Error('2D Canvas context unavailable');
  cCtx.drawImage(orientedCanvas, sx, sy, sw, sh, 0, 0, sw, sh);

  // Step 3: Progressive multi-step resize toward target.width x target.height
  let curW = sw;
  let curH = sh;
  while (curW < target.width * 0.5 || curH < target.height * 0.5 || curW > target.width * 2 || curH > target.height * 2) {
    const nextW = curW < target.width ? Math.min(target.width, Math.round(curW * 1.8)) : Math.max(target.width, Math.round(curW * 0.5));
    const nextH = curH < target.height ? Math.min(target.height, Math.round(curH * 1.8)) : Math.max(target.height, Math.round(curH * 0.5));
    if (nextW === curW && nextH === curH) break;

    const stepCanvas = document.createElement('canvas');
    stepCanvas.width = nextW;
    stepCanvas.height = nextH;
    const sCtx = stepCanvas.getContext('2d');
    if (!sCtx) break;
    sCtx.imageSmoothingEnabled = true;
    sCtx.imageSmoothingQuality = 'high';
    sCtx.drawImage(curCanvas, 0, 0, curW, curH, 0, 0, nextW, nextH);
    curCanvas = stepCanvas;
    curW = nextW;
    curH = nextH;
  }

  // Step 4: Final target canvas with CSS filter, overlay blend, vignette & sharpen
  const finalCanvas = document.createElement('canvas');
  finalCanvas.width = target.width;
  finalCanvas.height = target.height;
  const fCtx = finalCanvas.getContext('2d');
  if (!fCtx) throw new Error('2D Canvas context unavailable');

  const targetFormat = resolveOutputFormat(editState.outputFormat, originalFormat);
  if (targetFormat === 'JPEG') {
    // Fill white background before drawing in case source PNG had transparency
    fCtx.fillStyle = '#FFFFFF';
    fCtx.fillRect(0, 0, target.width, target.height);
  }

  fCtx.imageSmoothingEnabled = true;
  fCtx.imageSmoothingQuality = 'high';
  fCtx.filter = buildCompositeCssFilter(editState);
  fCtx.drawImage(curCanvas, 0, 0, curW, curH, 0, 0, target.width, target.height);
  fCtx.filter = 'none';

  // Apply preset color overlay tint if configured
  const activeFilter = PHOTO_FILTERS.find((f) => f.id === editState.filterId);
  if (activeFilter?.overlayColor && activeFilter?.overlayBlend) {
    fCtx.save();
    fCtx.globalCompositeOperation = activeFilter.overlayBlend;
    fCtx.fillStyle = activeFilter.overlayColor;
    fCtx.fillRect(0, 0, target.width, target.height);
    fCtx.restore();
  }

  // Apply radial vignette if > 0
  if (editState.vignette > 0) {
    const cx = target.width / 2;
    const cy = target.height / 2;
    const maxR = Math.hypot(cx, cy);
    const alpha = Math.min(0.85, (editState.vignette / 100) * 0.78);
    const grad = fCtx.createRadialGradient(cx, cy, maxR * 0.38, cx, cy, maxR);
    grad.addColorStop(0, 'rgba(0,0,0,0)');
    grad.addColorStop(1, `rgba(6, 15, 24, ${alpha.toFixed(3)})`);
    fCtx.fillStyle = grad;
    fCtx.fillRect(0, 0, target.width, target.height);
  }

  // Apply crisp unsharp mask if sharpness > 0
  if (editState.sharpness > 0) {
    applyUnsharpMask(fCtx, target.width, target.height, editState.sharpness);
  }

  const { mimeType, extension } = getFormatMimeAndExt(targetFormat);
  const qualityParam = targetFormat === 'PNG' ? undefined : Math.max(0.1, Math.min(1, editState.quality / 100));

  const blob = await new Promise<Blob>((resolve, reject) => {
    finalCanvas.toBlob(
      (b) => {
        if (b) resolve(b);
        else reject(new Error('Canvas encoding failed'));
      },
      mimeType,
      qualityParam
    );
  });

  const rawEncoded = new Uint8Array(await blob.arrayBuffer());
  const packagedBytes = writeImageBinaryWithTags(rawEncoded, targetFormat, tags);

  return {
    bytes: packagedBytes,
    format: targetFormat,
    mimeType,
    extension,
    width: target.width,
    height: target.height,
  };
}
