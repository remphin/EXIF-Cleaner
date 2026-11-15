import React, { useEffect, useRef, useState } from 'react';
import {
  Sliders,
  Crop,
  Maximize2,
  FileOutput,
  RotateCcw,
  RotateCw,
  FlipHorizontal,
  FlipVertical,
  Eye,
  Sparkles,
  Lock,
  Unlock,
} from 'lucide-react';
import { Language, Translations } from '../utils/i18n';
import {
  PHOTO_FILTERS,
  RESOLUTION_PRESETS,
  PhotoEditState,
  CropAspectId,
  OutputFormatOption,
  computeAspectCropRect,
  computeTargetDimensions,
  getOrientedDimensions,
  buildCompositeCssFilter,
  clampCropRect,
  resolveOutputFormat,
} from '../utils/photoEditorEngine';

interface PhotoEditorPanelProps {
  t: Translations;
  lang: Language;
  previewUrl: string;
  fileName: string;
  srcWidth: number;
  srcHeight: number;
  originalFormat: 'JPEG' | 'PNG' | 'WEBP' | 'UNKNOWN';
  editState: PhotoEditState;
  onChange: React.Dispatch<React.SetStateAction<PhotoEditState>>;
  onReset: () => void;
}

const CROP_ASPECTS: Array<{ id: CropAspectId; labelKey?: 'editorCropFree'; text?: string }> = [
  { id: 'free', labelKey: 'editorCropFree' },
  { id: '1:1', text: '1:1' },
  { id: '4:3', text: '4:3' },
  { id: '16:9', text: '16:9' },
  { id: '3:2', text: '3:2' },
  { id: '9:16', text: '9:16' },
];

export const PhotoEditorPanel: React.FC<PhotoEditorPanelProps> = ({
  t,
  lang,
  previewUrl,
  fileName,
  srcWidth,
  srcHeight,
  originalFormat,
  editState,
  onChange,
  onReset,
}) => {
  const [showOriginalHold, setShowOriginalHold] = useState(false);
  const [orientedPreviewUrl, setOrientedPreviewUrl] = useState<string>(previewUrl);
  const stageRef = useRef<HTMLDivElement | null>(null);
  const dragStateRef = useRef<{
    mode: 'move' | 'resize';
    startX: number;
    startY: number;
    origRect: PhotoEditState['cropRect'];
  } | null>(null);

  const oriented = getOrientedDimensions(srcWidth, srcHeight, editState.rotation);
  const targetDims = computeTargetDimensions(srcWidth, srcHeight, editState);
  const activeFilterObj = PHOTO_FILTERS.find((f) => f.id === editState.filterId);
  const resolvedFormat = resolveOutputFormat(editState.outputFormat, originalFormat);
  const cssFilter = showOriginalHold ? 'none' : buildCompositeCssFilter(editState);

  useEffect(() => {
    if (editState.rotation === 0 && !editState.flipH && !editState.flipV) {
      setOrientedPreviewUrl(previewUrl);
      return;
    }
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      if (cancelled) return;
      const w = img.naturalWidth || srcWidth;
      const h = img.naturalHeight || srcHeight;
      const o = getOrientedDimensions(w, h, editState.rotation);
      // Scale preview down to max 720px long edge for instant UI responsiveness
      const maxPreview = 720;
      const scale = Math.min(1, maxPreview / Math.max(o.width, o.height));
      const pw = Math.max(1, Math.round(o.width * scale));
      const ph = Math.max(1, Math.round(o.height * scale));
      const canvas = document.createElement('canvas');
      canvas.width = pw;
      canvas.height = ph;
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      ctx.translate(pw / 2, ph / 2);
      ctx.rotate((editState.rotation * Math.PI) / 180);
      ctx.scale(editState.flipH ? -1 : 1, editState.flipV ? -1 : 1);
      const drawW = Math.round(w * scale);
      const drawH = Math.round(h * scale);
      ctx.drawImage(img, -drawW / 2, -drawH / 2, drawW, drawH);
      setOrientedPreviewUrl(canvas.toDataURL('image/png'));
    };
    img.src = previewUrl;
    return () => {
      cancelled = true;
    };
  }, [previewUrl, editState.rotation, editState.flipH, editState.flipV, srcWidth, srcHeight]);

  const handleSelectAspect = (aspectId: CropAspectId) => {
    const nextRect = computeAspectCropRect(aspectId, oriented.width, oriented.height);
    onChange((prev) => ({
      ...prev,
      cropAspect: aspectId,
      cropRect: nextRect,
    }));
  };

  const handleRotate = (delta: -90 | 90) => {
    onChange((prev) => {
      const nextRot = (((prev.rotation + delta) % 360 + 360) % 360) as 0 | 90 | 180 | 270;
      return {
        ...prev,
        rotation: nextRot,
        cropRect: { x: 0, y: 0, width: 1, height: 1 },
        cropAspect: 'free',
      };
    });
  };

  const handlePointerDownCrop = (e: React.PointerEvent, mode: 'move' | 'resize') => {
    e.preventDefault();
    e.stopPropagation();
    (e.currentTarget as HTMLElement).setPointerCapture(e.pointerId);
    dragStateRef.current = {
      mode,
      startX: e.clientX,
      startY: e.clientY,
      origRect: { ...editState.cropRect },
    };
  };

  const handlePointerMoveCrop = (e: React.PointerEvent) => {
    const drag = dragStateRef.current;
    const stage = stageRef.current;
    if (!drag || !stage) return;

    const bounds = stage.getBoundingClientRect();
    if (bounds.width <= 0 || bounds.height <= 0) return;

    const dx = (e.clientX - drag.startX) / bounds.width;
    const dy = (e.clientY - drag.startY) / bounds.height;

    if (drag.mode === 'move') {
      const nextX = Math.max(0, Math.min(1 - drag.origRect.width, drag.origRect.x + dx));
      const nextY = Math.max(0, Math.min(1 - drag.origRect.height, drag.origRect.y + dy));
      onChange((prev) => ({
        ...prev,
        cropRect: clampCropRect({
          ...drag.origRect,
          x: nextX,
          y: nextY,
        }),
      }));
    } else {
      const nextW = Math.max(0.08, Math.min(1 - drag.origRect.x, drag.origRect.width + dx));
      let nextH = Math.max(0.08, Math.min(1 - drag.origRect.y, drag.origRect.height + dy));

      // Respect locked aspect ratio if non-free
      if (editState.cropAspect !== 'free') {
        const ratioMap: Record<Exclude<CropAspectId, 'free'>, number> = {
          '1:1': 1,
          '4:3': 4 / 3,
          '16:9': 16 / 9,
          '3:2': 3 / 2,
          '9:16': 9 / 16,
        };
        const targetRatio = ratioMap[editState.cropAspect];
        const stageAspect = oriented.width / Math.max(1, oriented.height);
        // normalized height = normalized width * stageAspect / targetRatio
        nextH = (nextW * stageAspect) / targetRatio;
        if (drag.origRect.y + nextH > 1) {
          nextH = 1 - drag.origRect.y;
        }
      }

      onChange((prev) => ({
        ...prev,
        cropRect: clampCropRect({
          x: drag.origRect.x,
          y: drag.origRect.y,
          width: nextW,
          height: nextH,
        }),
      }));
    }
  };

  const handlePointerUpCrop = () => {
    dragStateRef.current = null;
  };

  const handleCustomWidthChange = (val: number) => {
    const cleanW = Math.max(16, Math.min(12000, val || 16));
    onChange((prev) => {
      if (!prev.lockAspectRatio) {
        return { ...prev, resolutionPreset: 'custom', customWidth: cleanW };
      }
      const ratio = targetDims.croppedHeight / Math.max(1, targetDims.croppedWidth);
      return {
        ...prev,
        resolutionPreset: 'custom',
        customWidth: cleanW,
        customHeight: Math.max(16, Math.round(cleanW * ratio)),
      };
    });
  };

  const handleCustomHeightChange = (val: number) => {
    const cleanH = Math.max(16, Math.min(12000, val || 16));
    onChange((prev) => {
      if (!prev.lockAspectRatio) {
        return { ...prev, resolutionPreset: 'custom', customHeight: cleanH };
      }
      const ratio = targetDims.croppedWidth / Math.max(1, targetDims.croppedHeight);
      return {
        ...prev,
        resolutionPreset: 'custom',
        customHeight: cleanH,
        customWidth: Math.max(16, Math.round(cleanH * ratio)),
      };
    });
  };

  const formatOptions: Array<{ id: OutputFormatOption; label: string }> = [
    { id: 'ORIGINAL', label: `${t.editorFormatOriginal} (${originalFormat === 'UNKNOWN' ? 'PNG' : originalFormat})` },
    { id: 'JPEG', label: 'JPG (JPEG)' },
    { id: 'PNG', label: 'PNG' },
    { id: 'WEBP', label: 'WebP' },
  ];

  const stageMaxWidthPx = Math.min(540, Math.max(180, Math.round(320 * (oriented.width / Math.max(1, oriented.height)))));

  return (
    <div className="space-y-5">
      {/* Top Studio Header & Interactive Crop / Filter Live Stage */}
      <div className="bg-white border border-[#D8E6F3] rounded-xl overflow-hidden">
        <div className="px-5 py-4 border-b border-[#D8E6F3] bg-[#F9FCFF] flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="text-sm font-bold text-[#0F2537]">{t.editorTitle}</h2>
            <p className="text-xs text-[#4A6B88] mt-0.5">{t.editorSubtitle}</p>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setShowOriginalHold((prev) => !prev)}
              aria-pressed={showOriginalHold}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                showOriginalHold
                  ? 'bg-sky-600 text-white border-sky-600'
                  : 'bg-white text-[#0F2537] border-[#C5D9EC] hover:bg-[#EAF3FB]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{showOriginalHold ? t.editorCompareAfter : t.editorCompareBefore}</span>
            </button>
            <button
              type="button"
              onClick={onReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-[#4A6B88] bg-[#F4F8FB] hover:bg-[#E6F0F9] border border-[#D8E6F3] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.editorResetBtn}</span>
            </button>
          </div>
        </div>

        {/* Live Visual Stage with Interactive Crop Frame */}
        <div className="p-5 bg-[#0C1F30] flex flex-col items-center justify-center">
          <div
            ref={stageRef}
            onPointerMove={handlePointerMoveCrop}
            onPointerUp={handlePointerUpCrop}
            onPointerCancel={handlePointerUpCrop}
            className="relative select-none overflow-hidden rounded-lg border border-white/15 bg-[#071420]"
            style={{
              width: '100%',
              maxWidth: `${stageMaxWidthPx}px`,
              aspectRatio: `${oriented.width} / ${oriented.height}`,
            }}
          >
            <img
              src={showOriginalHold ? previewUrl : orientedPreviewUrl}
              alt={fileName}
              draggable={false}
              className="w-full h-full object-fill pointer-events-none transition-[filter] duration-150"
              style={{
                filter: cssFilter,
              }}
            />

            {/* Optional Filter Tint Overlay */}
            {!showOriginalHold && activeFilterObj?.overlayColor && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  backgroundColor: activeFilterObj.overlayColor,
                  mixBlendMode: (activeFilterObj.overlayBlend as React.CSSProperties['mixBlendMode']) || 'normal',
                }}
              />
            )}

            {/* Optional Vignette Preview Overlay */}
            {!showOriginalHold && editState.vignette > 0 && (
              <div
                className="absolute inset-0 pointer-events-none"
                style={{
                  background: `radial-gradient(circle, rgba(0,0,0,0) 42%, rgba(6,15,24,${((editState.vignette / 100) * 0.78).toFixed(2)}) 100%)`,
                }}
              />
            )}

            {/* Interactive Crop Selection Overlay */}
            {!showOriginalHold && (
              <div
                role="region"
                aria-label={t.editorTransformCropTitle}
                onPointerDown={(e) => handlePointerDownCrop(e, 'move')}
                style={{
                  left: `${editState.cropRect.x * 100}%`,
                  top: `${editState.cropRect.y * 100}%`,
                  width: `${editState.cropRect.width * 100}%`,
                  height: `${editState.cropRect.height * 100}%`,
                  boxShadow: '0 0 0 9999px rgba(6, 16, 28, 0.55)',
                }}
                className="absolute border-2 border-sky-400 cursor-move"
              >
                {/* Rule of Thirds Grid Lines */}
                <div className="absolute inset-0 grid grid-cols-3 grid-rows-3 pointer-events-none">
                  <div className="border-r border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div className="border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div className="border-r border-b border-white/20" />
                  <div className="border-b border-white/20" />
                  <div className="border-r border-white/20" />
                  <div className="border-r border-white/20" />
                  <div />
                </div>

                {/* Bottom-Right Resize Handle */}
                <button
                  type="button"
                  aria-label="Resize crop area"
                  onPointerDown={(e) => handlePointerDownCrop(e, 'resize')}
                  className="absolute -right-2 -bottom-2 w-4 h-4 rounded-sm bg-sky-500 border-2 border-white shadow cursor-nwse-resize"
                />
              </div>
            )}
          </div>

          {/* Live Output Telemetry Strip */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-3 text-[11px] font-mono tabular-nums text-sky-100">
            <span>
              {srcWidth} × {srcHeight} px
            </span>
            <span aria-hidden="true">→</span>
            <span className="text-sky-300 font-semibold">
              {targetDims.width} × {targetDims.height} px
            </span>
            <span aria-hidden="true">·</span>
            <span>{resolvedFormat}</span>
            {editState.filterId !== 'original' && (
              <>
                <span aria-hidden="true">·</span>
                <span>{lang === 'tr' ? activeFilterObj?.nameTr : activeFilterObj?.nameEn}</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Section 1: 10 Curated Color & Film Filters */}
      <div className="bg-white border border-[#D8E6F3] rounded-xl p-5 space-y-3.5">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-sky-700" />
            <h3 className="text-xs font-bold text-[#0F2537]">{t.editorFiltersTitle}</h3>
          </div>
          <span className="text-[11px] font-mono text-[#4A6B88]">
            {lang === 'tr' ? activeFilterObj?.nameTr : activeFilterObj?.nameEn}
          </span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
          {PHOTO_FILTERS.map((preset) => {
            const isSelected = editState.filterId === preset.id;
            return (
              <button
                key={preset.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => onChange((prev) => ({ ...prev, filterId: preset.id }))}
                className={`flex items-center gap-2.5 p-2 rounded-lg border text-left transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-[#E6F4FE] border-sky-500 text-[#0B3B5B]'
                    : 'bg-[#F8FBFE] hover:bg-[#EAF3FB] border-[#D8E6F3] text-[#0F2537]'
                }`}
              >
                <span
                  aria-hidden="true"
                  className="w-6 h-6 rounded-md shrink-0 border border-black/10"
                  style={{ background: preset.swatchGradient }}
                />
                <span className="text-[11px] font-semibold leading-tight truncate">
                  {lang === 'tr' ? preset.nameTr : preset.nameEn}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Section 2: Resolution Upscaler (4K / 8K) & Format Converter (JPG / PNG / WebP) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Resolution Upscaling Card */}
        <div className="bg-white border border-[#D8E6F3] rounded-xl p-5 space-y-3.5">
          <div className="flex items-center gap-2">
            <Maximize2 className="w-4 h-4 text-sky-700" />
            <h3 className="text-xs font-bold text-[#0F2537]">{t.editorUpscaleTitle}</h3>
          </div>
          <p className="text-[11px] text-[#4A6B88] leading-relaxed">{t.editorUpscaleHint}</p>

          <div className="grid grid-cols-3 gap-2">
            {RESOLUTION_PRESETS.map((preset) => {
              const isSelected = editState.resolutionPreset === preset.id;
              return (
                <button
                  key={preset.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() =>
                    onChange((prev) => ({
                      ...prev,
                      resolutionPreset: preset.id,
                      customWidth: targetDims.croppedWidth,
                      customHeight: targetDims.croppedHeight,
                    }))
                  }
                  className={`px-2.5 py-2 text-[11px] font-semibold rounded-lg border transition-colors whitespace-nowrap cursor-pointer ${
                    isSelected
                      ? 'bg-sky-600 text-white border-sky-600'
                      : 'bg-[#F8FBFE] hover:bg-[#EAF3FB] text-[#0F2537] border-[#D8E6F3]'
                  }`}
                >
                  {lang === 'tr' ? preset.labelTr : preset.labelEn}
                </button>
              );
            })}
          </div>

          {editState.resolutionPreset === 'custom' && (
            <div className="pt-2 border-t border-[#E5EFF8] grid grid-cols-12 gap-2 items-end">
              <div className="col-span-5">
                <label htmlFor="custom-width-input" className="block text-[11px] text-[#4A6B88] mb-1">
                  {t.editorCustomWidth}
                </label>
                <input
                  id="custom-width-input"
                  type="number"
                  min={16}
                  max={12000}
                  value={editState.customWidth}
                  onChange={(e) => handleCustomWidthChange(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs font-mono bg-[#F4F8FB] border border-[#C5D9EC] rounded-lg text-[#0F2537]"
                />
              </div>
              <div className="col-span-2 flex justify-center pb-1">
                <button
                  type="button"
                  aria-label={t.editorLockRatio}
                  title={t.editorLockRatio}
                  aria-pressed={editState.lockAspectRatio}
                  onClick={() =>
                    onChange((prev) => ({ ...prev, lockAspectRatio: !prev.lockAspectRatio }))
                  }
                  className={`p-1.5 rounded-lg border cursor-pointer ${
                    editState.lockAspectRatio
                      ? 'bg-[#E6F4FE] border-sky-400 text-sky-700'
                      : 'bg-white border-[#D8E6F3] text-[#4A6B88]'
                  }`}
                >
                  {editState.lockAspectRatio ? <Lock className="w-3.5 h-3.5" /> : <Unlock className="w-3.5 h-3.5" />}
                </button>
              </div>
              <div className="col-span-5">
                <label htmlFor="custom-height-input" className="block text-[11px] text-[#4A6B88] mb-1">
                  {t.editorCustomHeight}
                </label>
                <input
                  id="custom-height-input"
                  type="number"
                  min={16}
                  max={12000}
                  value={editState.customHeight}
                  onChange={(e) => handleCustomHeightChange(Number(e.target.value))}
                  className="w-full px-2.5 py-1.5 text-xs font-mono bg-[#F4F8FB] border border-[#C5D9EC] rounded-lg text-[#0F2537]"
                />
              </div>
            </div>
          )}

          <div className="pt-2 border-t border-[#E5EFF8] flex items-center justify-between text-xs">
            <span className="text-[#4A6B88]">{t.editorTargetDimsLabel}</span>
            <span className="font-mono font-bold text-[#0F2537] tabular-nums">
              {targetDims.width} × {targetDims.height} px
            </span>
          </div>
        </div>

        {/* Universal Format Converter Card */}
        <div className="bg-white border border-[#D8E6F3] rounded-xl p-5 space-y-3.5">
          <div className="flex items-center gap-2">
            <FileOutput className="w-4 h-4 text-sky-700" />
            <h3 className="text-xs font-bold text-[#0F2537]">{t.editorFormatTitle}</h3>
          </div>
          <p className="text-[11px] text-[#4A6B88] leading-relaxed">{t.editorFormatHint}</p>

          <div className="grid grid-cols-2 gap-2">
            {formatOptions.map((opt) => {
              const isSelected = editState.outputFormat === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => onChange((prev) => ({ ...prev, outputFormat: opt.id }))}
                  className={`px-3 py-2 text-[11px] font-semibold rounded-lg border transition-colors whitespace-nowrap truncate cursor-pointer ${
                    isSelected
                      ? 'bg-[#0F2537] text-white border-[#0F2537]'
                      : 'bg-[#F8FBFE] hover:bg-[#EAF3FB] text-[#0F2537] border-[#D8E6F3]'
                  }`}
                >
                  {opt.label}
                </button>
              );
            })}
          </div>

          {resolvedFormat !== 'PNG' ? (
            <div className="pt-2 border-t border-[#E5EFF8]">
              <div className="flex items-center justify-between text-xs mb-1.5">
                <label htmlFor="output-quality-slider" className="text-[#4A6B88]">
                  {t.editorQualityLabel} ({resolvedFormat})
                </label>
                <span className="font-mono font-bold text-[#0F2537] tabular-nums">
                  {editState.quality}%
                </span>
              </div>
              <input
                id="output-quality-slider"
                type="range"
                min={20}
                max={100}
                step={2}
                value={editState.quality}
                onChange={(e) =>
                  onChange((prev) => ({ ...prev, quality: Number(e.target.value) }))
                }
                className="w-full accent-sky-600 cursor-pointer"
              />
            </div>
          ) : (
            <div className="pt-2 border-t border-[#E5EFF8] text-[11px] text-[#4A6B88]">
              {lang === 'tr'
                ? 'PNG çıktısı %100 kayıpsız sıkıştırma ve tam şeffaflık desteği ile kaydedilir.'
                : 'PNG output uses 100% lossless compression with full transparency preservation.'}
            </div>
          )}
        </div>
      </div>

      {/* Section 3: Crop, Rotate & Flip Controls */}
      <div className="bg-white border border-[#D8E6F3] rounded-xl p-5 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Crop className="w-4 h-4 text-sky-700" />
            <h3 className="text-xs font-bold text-[#0F2537]">{t.editorTransformCropTitle}</h3>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <button
              type="button"
              onClick={() => handleRotate(-90)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-[#0F2537] bg-[#F8FBFE] hover:bg-[#EAF3FB] border border-[#D8E6F3] rounded-lg cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>{t.editorRotateLeft}</span>
            </button>
            <button
              type="button"
              onClick={() => handleRotate(90)}
              className="inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold text-[#0F2537] bg-[#F8FBFE] hover:bg-[#EAF3FB] border border-[#D8E6F3] rounded-lg cursor-pointer"
            >
              <RotateCw className="w-3.5 h-3.5" />
              <span>{t.editorRotateRight}</span>
            </button>
            <button
              type="button"
              aria-pressed={editState.flipH}
              onClick={() => onChange((prev) => ({ ...prev, flipH: !prev.flipH }))}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold rounded-lg border cursor-pointer ${
                editState.flipH
                  ? 'bg-[#E6F4FE] border-sky-500 text-[#0B3B5B]'
                  : 'bg-[#F8FBFE] hover:bg-[#EAF3FB] border-[#D8E6F3] text-[#0F2537]'
              }`}
            >
              <FlipHorizontal className="w-3.5 h-3.5" />
              <span>{t.editorFlipH}</span>
            </button>
            <button
              type="button"
              aria-pressed={editState.flipV}
              onClick={() => onChange((prev) => ({ ...prev, flipV: !prev.flipV }))}
              className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-[11px] font-semibold rounded-lg border cursor-pointer ${
                editState.flipV
                  ? 'bg-[#E6F4FE] border-sky-500 text-[#0B3B5B]'
                  : 'bg-[#F8FBFE] hover:bg-[#EAF3FB] border-[#D8E6F3] text-[#0F2537]'
              }`}
            >
              <FlipVertical className="w-3.5 h-3.5" />
              <span>{t.editorFlipV}</span>
            </button>
          </div>
        </div>

        {/* Aspect Ratio Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[11px] font-medium text-[#4A6B88] mr-1">
            {t.editorCropAspectLabel}:
          </span>
          {CROP_ASPECTS.map((asp) => {
            const isSelected = editState.cropAspect === asp.id;
            return (
              <button
                key={asp.id}
                type="button"
                aria-pressed={isSelected}
                onClick={() => handleSelectAspect(asp.id)}
                className={`px-2.5 py-1 text-[11px] font-semibold rounded-md border transition-colors cursor-pointer ${
                  isSelected
                    ? 'bg-sky-600 text-white border-sky-600'
                    : 'bg-[#F4F8FB] hover:bg-[#E6F0F9] text-[#0F2537] border-[#D8E6F3]'
                }`}
              >
                {asp.labelKey ? t[asp.labelKey] : asp.text}
              </button>
            );
          })}
          <button
            type="button"
            onClick={() => handleSelectAspect('free')}
            className="ml-auto text-[11px] font-semibold text-sky-700 hover:underline cursor-pointer"
          >
            {t.editorCropReset}
          </button>
        </div>

        {/* Numeric Crop Controls for Precision */}
        <div className="pt-2 border-t border-[#E5EFF8]">
          <p className="text-[11px] text-[#4A6B88] mb-2">{t.editorCropManualHint}</p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div>
              <label htmlFor="crop-x-pct" className="block text-[11px] text-[#4A6B88] mb-1">
                {t.editorCropX}
              </label>
              <input
                id="crop-x-pct"
                type="number"
                min={0}
                max={95}
                value={Math.round(editState.cropRect.x * 100)}
                onChange={(e) => {
                  const val = Math.max(0, Math.min(95, Number(e.target.value))) / 100;
                  onChange((prev) => ({
                    ...prev,
                    cropRect: clampCropRect({ ...prev.cropRect, x: val }),
                  }));
                }}
                className="w-full px-2.5 py-1.5 text-xs font-mono bg-[#F4F8FB] border border-[#C5D9EC] rounded-lg text-[#0F2537]"
              />
            </div>
            <div>
              <label htmlFor="crop-y-pct" className="block text-[11px] text-[#4A6B88] mb-1">
                {t.editorCropY}
              </label>
              <input
                id="crop-y-pct"
                type="number"
                min={0}
                max={95}
                value={Math.round(editState.cropRect.y * 100)}
                onChange={(e) => {
                  const val = Math.max(0, Math.min(95, Number(e.target.value))) / 100;
                  onChange((prev) => ({
                    ...prev,
                    cropRect: clampCropRect({ ...prev.cropRect, y: val }),
                  }));
                }}
                className="w-full px-2.5 py-1.5 text-xs font-mono bg-[#F4F8FB] border border-[#C5D9EC] rounded-lg text-[#0F2537]"
              />
            </div>
            <div>
              <label htmlFor="crop-w-pct" className="block text-[11px] text-[#4A6B88] mb-1">
                {t.editorCropW}
              </label>
              <input
                id="crop-w-pct"
                type="number"
                min={5}
                max={100}
                value={Math.round(editState.cropRect.width * 100)}
                onChange={(e) => {
                  const val = Math.max(5, Math.min(100, Number(e.target.value))) / 100;
                  onChange((prev) => ({
                    ...prev,
                    cropRect: clampCropRect({ ...prev.cropRect, width: val }),
                  }));
                }}
                className="w-full px-2.5 py-1.5 text-xs font-mono bg-[#F4F8FB] border border-[#C5D9EC] rounded-lg text-[#0F2537]"
              />
            </div>
            <div>
              <label htmlFor="crop-h-pct" className="block text-[11px] text-[#4A6B88] mb-1">
                {t.editorCropH}
              </label>
              <input
                id="crop-h-pct"
                type="number"
                min={5}
                max={100}
                value={Math.round(editState.cropRect.height * 100)}
                onChange={(e) => {
                  const val = Math.max(5, Math.min(100, Number(e.target.value))) / 100;
                  onChange((prev) => ({
                    ...prev,
                    cropRect: clampCropRect({ ...prev.cropRect, height: val }),
                  }));
                }}
                className="w-full px-2.5 py-1.5 text-xs font-mono bg-[#F4F8FB] border border-[#C5D9EC] rounded-lg text-[#0F2537]"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Section 4: Fine Adjustments Sliders */}
      <div className="bg-white border border-[#D8E6F3] rounded-xl p-5 space-y-4">
        <div className="flex items-center gap-2">
          <Sliders className="w-4 h-4 text-sky-700" />
          <h3 className="text-xs font-bold text-[#0F2537]">{t.editorAdjustmentsTitle}</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Brightness */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <label htmlFor="adj-brightness" className="text-[#4A6B88]">
                {t.editorBrightness}
              </label>
              <span className="font-mono text-[#0F2537] tabular-nums">{editState.brightness}%</span>
            </div>
            <input
              id="adj-brightness"
              type="range"
              min={50}
              max={150}
              value={editState.brightness}
              onChange={(e) =>
                onChange((prev) => ({ ...prev, brightness: Number(e.target.value) }))
              }
              className="w-full accent-sky-600 cursor-pointer"
            />
          </div>

          {/* Contrast */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <label htmlFor="adj-contrast" className="text-[#4A6B88]">
                {t.editorContrast}
              </label>
              <span className="font-mono text-[#0F2537] tabular-nums">{editState.contrast}%</span>
            </div>
            <input
              id="adj-contrast"
              type="range"
              min={50}
              max={150}
              value={editState.contrast}
              onChange={(e) =>
                onChange((prev) => ({ ...prev, contrast: Number(e.target.value) }))
              }
              className="w-full accent-sky-600 cursor-pointer"
            />
          </div>

          {/* Saturation */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <label htmlFor="adj-saturation" className="text-[#4A6B88]">
                {t.editorSaturation}
              </label>
              <span className="font-mono text-[#0F2537] tabular-nums">{editState.saturation}%</span>
            </div>
            <input
              id="adj-saturation"
              type="range"
              min={0}
              max={200}
              value={editState.saturation}
              onChange={(e) =>
                onChange((prev) => ({ ...prev, saturation: Number(e.target.value) }))
              }
              className="w-full accent-sky-600 cursor-pointer"
            />
          </div>

          {/* Smart Sharpen */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <label htmlFor="adj-sharpness" className="text-[#4A6B88]">
                {t.editorSharpness}
              </label>
              <span className="font-mono text-[#0F2537] tabular-nums">{editState.sharpness}%</span>
            </div>
            <input
              id="adj-sharpness"
              type="range"
              min={0}
              max={100}
              value={editState.sharpness}
              onChange={(e) =>
                onChange((prev) => ({ ...prev, sharpness: Number(e.target.value) }))
              }
              className="w-full accent-sky-600 cursor-pointer"
            />
          </div>

          {/* Vignette */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <label htmlFor="adj-vignette" className="text-[#4A6B88]">
                {t.editorVignette}
              </label>
              <span className="font-mono text-[#0F2537] tabular-nums">{editState.vignette}%</span>
            </div>
            <input
              id="adj-vignette"
              type="range"
              min={0}
              max={100}
              value={editState.vignette}
              onChange={(e) =>
                onChange((prev) => ({ ...prev, vignette: Number(e.target.value) }))
              }
              className="w-full accent-sky-600 cursor-pointer"
            />
          </div>

          {/* Soft Blur */}
          <div>
            <div className="flex items-center justify-between text-xs mb-1">
              <label htmlFor="adj-blur" className="text-[#4A6B88]">
                {t.editorBlur}
              </label>
              <span className="font-mono text-[#0F2537] tabular-nums">{editState.blur} px</span>
            </div>
            <input
              id="adj-blur"
              type="range"
              min={0}
              max={10}
              step={0.5}
              value={editState.blur}
              onChange={(e) =>
                onChange((prev) => ({ ...prev, blur: Number(e.target.value) }))
              }
              className="w-full accent-sky-600 cursor-pointer"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
