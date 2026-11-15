import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Sparkles,
  ShieldCheck,
  AlertTriangle,
  Download,
  RotateCcw,
  Trash2,
  Camera,
  Smartphone,
  CheckCircle2,
  FileImage,
  RefreshCw,
  Sliders,
  Shield,
} from 'lucide-react';
import heroBannerImg from './assets/images/hero_exif_optical_banner_1794670846357.jpg';
import { Language, translations } from './utils/i18n';
import {
  ExifTagItem,
  TagCategory,
  CAMERA_PROFILES,
  parseImageBinary,
  autoCleanMetadata,
  applyCameraProfileToTags,
  writeImageBinaryWithTags,
  detectAiSignature,
  inferCategory,
} from './utils/exifEngine';
import {
  PhotoEditState,
  createDefaultPhotoEditState,
  computeTargetDimensions,
  resolveOutputFormat,
  getFormatMimeAndExt,
  hasVisualOrFormatChanges,
  buildCompositeCssFilter,
  renderEditedImageWithTags,
} from './utils/photoEditorEngine';
import {
  SamplePresetId,
  generateSampleImageBinary,
} from './utils/sampleGenerator';
import { Header } from './components/Header';
import { MetadataTable, ActiveTab } from './components/MetadataTable';
import { PhotoEditorPanel } from './components/PhotoEditorPanel';
import { InfoSections } from './components/InfoSections';

interface LoadedImageState {
  fileName: string;
  format: 'JPEG' | 'PNG' | 'WEBP' | 'UNKNOWN';
  mimeType: string;
  byteSize: number;
  width: number;
  height: number;
  previewUrl: string;
  originalBytes: Uint8Array;
}

export default function App() {
  const [lang, setLang] = useState<Language>('tr');
  const t = translations[lang];

  const [imageState, setImageState] = useState<LoadedImageState | null>(null);
  const [originalTags, setOriginalTags] = useState<ExifTagItem[]>([]);
  const [currentTags, setCurrentTags] = useState<ExifTagItem[]>([]);
  const [activeTab, setActiveTab] = useState<ActiveTab>('all');
  const [workspaceMode, setWorkspaceMode] = useState<'exif' | 'editor'>('exif');
  const [photoEditState, setPhotoEditState] = useState<PhotoEditState>(() =>
    createDefaultPhotoEditState(1024, 768)
  );
  const [isExporting, setIsExporting] = useState(false);
  const [heroImgError, setHeroImgError] = useState(false);
  const [selectedProfileId, setSelectedProfileId] = useState<string>(CAMERA_PROFILES[0].id);
  const [statusKey, setStatusKey] = useState<keyof typeof t | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const showToast = (key: keyof typeof t) => {
    setStatusKey(key);
  };

  useEffect(() => {
    if (!statusKey) return;
    const timer = setTimeout(() => setStatusKey(null), 4500);
    return () => clearTimeout(timer);
  }, [statusKey]);

  // Support ?autostart=1 to load the Midjourney sample automatically if desired
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get('autostart') === '1') {
      handleLoadSample('midjourney');
    }
  }, []);

  const loadFromBinary = (
    bytes: Uint8Array,
    fileName: string,
    mimeType: string,
    previewUrl: string,
    width: number,
    height: number
  ) => {
    const parsed = parseImageBinary(bytes);
    const detectedFormat =
      parsed.format !== 'UNKNOWN'
        ? parsed.format
        : mimeType.includes('png')
        ? 'PNG'
        : mimeType.includes('webp')
        ? 'WEBP'
        : mimeType.includes('jpeg') || mimeType.includes('jpg')
        ? 'JPEG'
        : 'UNKNOWN';

    setImageState({
      fileName,
      format: detectedFormat,
      mimeType,
      byteSize: bytes.length,
      width,
      height,
      previewUrl,
      originalBytes: bytes,
    });
    setOriginalTags(parsed.tags.map((item) => ({ ...item })));
    setCurrentTags(parsed.tags.map((item) => ({ ...item })));
    setPhotoEditState(createDefaultPhotoEditState(width, height));
    setActiveTab('all');
  };

  const handleFileUpload = async (file: File) => {
    const arrayBuffer = await file.arrayBuffer();
    const bytes = new Uint8Array(arrayBuffer);
    const previewUrl = URL.createObjectURL(file);

    // Measure image dimensions
    const dims = await new Promise<{ width: number; height: number }>((resolve) => {
      const img = new Image();
      img.onload = () => resolve({ width: img.naturalWidth || 1024, height: img.naturalHeight || 768 });
      img.onerror = () => resolve({ width: 1024, height: 768 });
      img.src = previewUrl;
    });

    loadFromBinary(bytes, file.name, file.type || 'image/jpeg', previewUrl, dims.width, dims.height);
  };

  const handleLoadSample = async (preset: SamplePresetId) => {
    const sample = await generateSampleImageBinary(preset);
    loadFromBinary(
      sample.bytes,
      sample.fileName,
      sample.mimeType,
      sample.dataUrl,
      sample.width,
      sample.height
    );
  };

  const handleAutoClean = () => {
    const cleaned = autoCleanMetadata(currentTags);
    setCurrentTags(cleaned);
    showToast('toastAutoCleaned');
  };

  const handleApplyCameraProfile = (profileId?: string) => {
    const targetId = profileId || selectedProfileId;
    setSelectedProfileId(targetId);
    const profile = CAMERA_PROFILES.find((p) => p.id === targetId) || CAMERA_PROFILES[0];
    const updated = applyCameraProfileToTags(currentTags, profile);
    setCurrentTags(updated);
    showToast('toastProfileApplied');
  };

  const handleStripAll = () => {
    setCurrentTags([]);
    showToast('toastStrippedAll');
  };

  const handleResetOriginal = () => {
    setCurrentTags(originalTags.map((item) => ({ ...item })));
    showToast('toastRestored');
  };

  const handleUpdateTag = (id: string, newKey: string, newValue: string) => {
    setCurrentTags((prev) =>
      prev.map((item) => {
        if (item.id !== id) return item;
        const aiCheck = detectAiSignature(newKey, newValue, item.sourceSegment);
        const category = aiCheck.isAi ? 'ai' : inferCategory(newKey, newValue, item.sourceSegment);
        return {
          ...item,
          key: newKey,
          value: newValue,
          isAiTrace: aiCheck.isAi,
          aiReason: aiCheck.reason,
          category,
          isModified: true,
        };
      })
    );
    showToast('toastTagSaved');
  };

  const handleDeleteTag = (id: string) => {
    setCurrentTags((prev) => prev.filter((item) => item.id !== id));
    showToast('toastTagDeleted');
  };

  const handleAddTag = (key: string, value: string, category: TagCategory) => {
    const aiCheck = detectAiSignature(key, value, 'Custom EXIF');
    const newItem: ExifTagItem = {
      id: `custom-${Date.now()}`,
      key,
      value,
      category: aiCheck.isAi ? 'ai' : category,
      isAiTrace: aiCheck.isAi,
      aiReason: aiCheck.reason,
      sourceSegment: 'EXIF IFD0 / Custom',
      isModified: true,
    };
    setCurrentTags((prev) => [newItem, ...prev]);
    showToast('toastTagAdded');
  };

  const buildExportBinary = async (): Promise<{
    bytes: Uint8Array;
    mimeType: string;
    outName: string;
    previewUrl: string;
    width: number;
    height: number;
  } | null> => {
    if (!imageState) return null;
    const baseName = imageState.fileName.replace(/\.[^.]+$/, '');

    if (hasVisualOrFormatChanges(photoEditState, imageState.format)) {
      const rendered = await renderEditedImageWithTags(
        imageState.previewUrl,
        imageState.format,
        photoEditState,
        currentTags
      );
      const blob = new Blob([rendered.bytes as unknown as BlobPart], { type: rendered.mimeType });
      const newPreviewUrl = URL.createObjectURL(blob);
      return {
        bytes: rendered.bytes,
        mimeType: rendered.mimeType,
        outName: `${baseName}_edited.${rendered.extension}`,
        previewUrl: newPreviewUrl,
        width: rendered.width,
        height: rendered.height,
      };
    }

    const outFormat = resolveOutputFormat(photoEditState.outputFormat, imageState.format);
    const outBytes = writeImageBinaryWithTags(
      imageState.originalBytes,
      imageState.format,
      currentTags
    );
    const { mimeType, extension } = getFormatMimeAndExt(outFormat);
    return {
      bytes: outBytes,
      mimeType,
      outName: `${baseName}_cleaned.${extension}`,
      previewUrl: imageState.previewUrl,
      width: imageState.width,
      height: imageState.height,
    };
  };

  const handleDownloadCleaned = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const built = await buildExportBinary();
      if (!built) return;

      const blob = new Blob([built.bytes as unknown as BlobPart], { type: built.mimeType });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = built.outName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(url), 3000);
      showToast('toastDownloaded');
    } finally {
      setIsExporting(false);
    }
  };

  const handleVerifyReupload = async () => {
    if (isExporting) return;
    setIsExporting(true);
    try {
      const built = await buildExportBinary();
      if (!built) return;
      loadFromBinary(
        built.bytes,
        built.outName,
        built.mimeType,
        built.previewUrl,
        built.width,
        built.height
      );
      showToast('toastAutoCleaned');
    } finally {
      setIsExporting(false);
    }
  };

  const handleResetPhotoEdits = () => {
    if (!imageState) return;
    setPhotoEditState(createDefaultPhotoEditState(imageState.width, imageState.height));
    showToast('toastPhotoReset');
  };

  const handleOpenPhotoEditor = () => {
    setWorkspaceMode('editor');
    const targetEl =
      document.getElementById('photo-editor') || document.getElementById('workspace');
    targetEl?.scrollIntoView({ behavior: 'smooth', block: 'start' });
  };

  const aiTracesCount = currentTags.filter((item) => item.isAiTrace || item.category === 'ai').length;
  const formatKb = (bytes: number) => `${(bytes / 1024).toFixed(1)} KB`;
  const hasPhotoChanges = imageState ? hasVisualOrFormatChanges(photoEditState, imageState.format) : false;
  const targetDims = imageState
    ? computeTargetDimensions(imageState.width, imageState.height, photoEditState)
    : null;
  const targetFormat = imageState
    ? resolveOutputFormat(photoEditState.outputFormat, imageState.format)
    : 'JPEG';

  return (
    <div className="min-h-screen flex flex-col bg-[#F4F8FB] text-[#0F2537]">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*,.jpg,.jpeg,.png,.webp,.gif,.bmp,.avif"
        aria-label={t.selectFileBtn}
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) handleFileUpload(f);
          e.target.value = '';
        }}
        className="hidden"
      />

      {/* Strict 3-Zone Top Bar */}
      <Header
        t={t}
        onTriggerUpload={() => fileInputRef.current?.click()}
        onOpenPhotoEditor={handleOpenPhotoEditor}
      />

      {/* Main Content Container */}
      <main id="workspace" className="flex-1 max-w-[1280px] w-full mx-auto px-6 pt-8 pb-16">
        {/* Top Utility Strip: Kicker + Bilingual Switcher (TR | EN) */}
        <div className="flex flex-wrap items-center justify-between gap-4 mb-5">
          <p className="text-xs font-semibold text-sky-700">
            {t.heroKicker}
          </p>

          <div
            role="group"
            aria-label="Language Selector"
            className="inline-flex items-center p-1 bg-[#E3EFFA] border border-[#C8DDF0] rounded-lg"
          >
            <button
              type="button"
              onClick={() => setLang('tr')}
              aria-pressed={lang === 'tr'}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                lang === 'tr'
                  ? 'bg-white text-[#0F2537] shadow-xs'
                  : 'text-[#4A6B88] hover:text-[#0F2537]'
              }`}
            >
              Türkçe (TR)
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              aria-pressed={lang === 'en'}
              className={`px-3 py-1 text-xs font-semibold rounded-md transition-colors whitespace-nowrap cursor-pointer ${
                lang === 'en'
                  ? 'bg-white text-[#0F2537] shadow-xs'
                  : 'text-[#4A6B88] hover:text-[#0F2537]'
              }`}
            >
              English (EN)
            </button>
          </div>
        </div>

        {/* Visual Hero Banner Split (12-Column Stretch Layout) */}
        <div className="mb-8 bg-white border border-[#D8E6F3] rounded-2xl overflow-hidden grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Left Column: Editorial Headline, Description, Extra Note & Quick Action */}
          <div className="lg:col-span-7 p-6 sm:p-9 flex flex-col justify-between">
            <div>
              <h1
                className="text-2xl sm:text-4xl font-bold text-[#0F2537] tracking-tight leading-tight mb-3.5"
                style={{ textWrap: 'balance' }}
              >
                {t.heroTitle}
              </h1>
              <p className="text-sm sm:text-base text-[#4A6B88] leading-relaxed">
                {t.heroSubtitle}
              </p>
              <p className="mt-3.5 text-xs sm:text-sm font-medium text-teal-700">
                {t.heroExtraNote}
              </p>
            </div>

            <div className="mt-6 pt-5 border-t border-[#E5EFF8] flex flex-wrap items-center justify-between gap-4">
              <div className="flex flex-wrap items-center gap-2 text-xs text-[#4A6B88] font-mono tabular-nums">
                <span>TIFF IFD0 / SubIFD</span>
                <span aria-hidden="true">·</span>
                <span>C2PA JUMBF</span>
                <span aria-hidden="true">·</span>
                <span>PNG tEXt / eXIf</span>
              </div>
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer"
              >
                <Upload className="w-3.5 h-3.5" />
                <span>{t.selectFileBtn}</span>
              </button>
            </div>
          </div>

          {/* Right Column: High-Fidelity Optical Camera Lens Banner with Bundled Asset Import */}
          <div className="lg:col-span-5 relative min-h-[240px] lg:min-h-full bg-[#162C42] overflow-hidden">
            {!heroImgError ? (
              <img
                src={heroBannerImg}
                alt={
                  lang === 'tr'
                    ? 'Optik kamera lensi ve EXIF meta veri analizi'
                    : 'Precision optical camera lens and EXIF metadata analysis'
                }
                className="w-full h-full object-cover"
                onError={() => setHeroImgError(true)}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#0F2537] via-[#173A58] to-[#0A1929]">
                <Camera className="w-16 h-16 text-sky-400/60" />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-[#091929]/85 via-[#091929]/25 to-transparent flex flex-col justify-end p-5">
              <div className="text-xs font-semibold text-white mb-1">
                {lang === 'tr'
                  ? 'Gerçek Optik EXIF & Temiz Meta Veri'
                  : 'Authentic Optical EXIF & Clean Metadata'}
              </div>
              <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono tabular-nums text-sky-200">
                <span>50.0 mm</span>
                <span aria-hidden="true">·</span>
                <span>f/1.4</span>
                <span aria-hidden="true">·</span>
                <span>1/500 sec</span>
                <span aria-hidden="true">·</span>
                <span>ISO 100</span>
                <span aria-hidden="true">·</span>
                <span>sRGB</span>
              </div>
            </div>
          </div>
        </div>

        {/* Status Feedback Toast Banner */}
        {statusKey && (
          <div
            role="status"
            aria-live="polite"
            className="mb-6 px-4 py-3 bg-[#E6F4FE] border border-sky-300 rounded-xl flex items-center justify-between gap-3 text-xs font-medium text-[#0B3B5B]"
          >
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-sky-700 shrink-0" />
              <span>{t[statusKey]}</span>
            </div>
            <button
              type="button"
              onClick={() => setStatusKey(null)}
              className="text-xs font-semibold text-sky-800 hover:underline cursor-pointer"
            >
              ×
            </button>
          </div>
        )}

        {/* Quick Sample Selector Bar (always accessible for testing & comparison) */}
        <div id="photo-editor" className="scroll-mt-24 mb-8 bg-white border border-[#D8E6F3] rounded-xl p-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
            <div>
              <h2 className="text-xs font-semibold text-[#0F2537] mb-1">
                {t.orTrySample}
              </h2>
              <p className="text-xs text-[#4A6B88]">
                {t.dropzoneFormats}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2.5">
              <button
                type="button"
                onClick={() => handleLoadSample('midjourney')}
                className="px-3.5 py-2 text-xs font-semibold text-[#0F2537] bg-[#F2F8FD] hover:bg-[#E2EFFB] border border-[#C5D9EC] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                {t.sampleMidjourney}
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('sdxl')}
                className="px-3.5 py-2 text-xs font-semibold text-[#0F2537] bg-[#F2F8FD] hover:bg-[#E2EFFB] border border-[#C5D9EC] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                {t.sampleSDXL}
              </button>
              <button
                type="button"
                onClick={() => handleLoadSample('dalle')}
                className="px-3.5 py-2 text-xs font-semibold text-[#0F2537] bg-[#F2F8FD] hover:bg-[#E2EFFB] border border-[#C5D9EC] rounded-lg transition-colors whitespace-nowrap cursor-pointer"
              >
                {t.sampleDalle}
              </button>
            </div>
          </div>
        </div>

        {/* Empty State Dropzone OR Active Split-Screen EXIF Workspace */}
        {!imageState ? (
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragging(true);
            }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setIsDragging(false);
              const f = e.dataTransfer.files?.[0];
              if (f) handleFileUpload(f);
            }}
            className={`bg-white border-2 border-dashed rounded-xl p-12 text-center transition-colors ${
              isDragging
                ? 'border-sky-600 bg-[#EEF7FF]'
                : 'border-[#B9D3EB] hover:border-sky-500'
            }`}
          >
            <div className="w-12 h-12 rounded-xl bg-[#EAF3FB] border border-[#C5D9EC] flex items-center justify-center mx-auto mb-4">
              <Upload className="w-6 h-6 text-sky-700" />
            </div>
            <h2 className="text-lg font-bold text-[#0F2537] mb-1.5">
              {t.dropzoneTitle}
            </h2>
            <p className="text-xs text-[#4A6B88] max-w-md mx-auto mb-6">
              {t.dropzoneSubtitle}
            </p>
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors cursor-pointer"
            >
              {t.selectFileBtn}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column: Image Preview, AI Status & One-Click Cleaning Actions (4 cols) */}
            <div className="lg:col-span-4 space-y-5">
              {/* Image Preview & Summary Panel */}
              <div className="bg-white border border-[#D8E6F3] rounded-xl overflow-hidden">
                <div className="aspect-4/3 bg-[#0C1F30] relative flex items-center justify-center overflow-hidden">
                  {imageState.previewUrl ? (
                    <img
                      src={imageState.previewUrl}
                      alt={imageState.fileName}
                      referrerPolicy="no-referrer"
                      className="w-full h-full object-cover transition-[filter] duration-150"
                      style={{
                        filter: buildCompositeCssFilter(photoEditState),
                        transform: [
                          photoEditState.rotation !== 0 ? `rotate(${photoEditState.rotation}deg)` : '',
                          photoEditState.flipH ? 'scaleX(-1)' : '',
                          photoEditState.flipV ? 'scaleY(-1)' : '',
                        ]
                          .filter(Boolean)
                          .join(' ') || 'none',
                      }}
                    />
                  ) : (
                    <FileImage className="w-10 h-10 text-sky-300" />
                  )}
                </div>

                {/* Unboxed File Specs Summary */}
                <div className="p-5 divide-y divide-[#E5EFF8]">
                  <div className="pb-3.5">
                    <h3 className="text-xs font-bold text-[#0F2537] truncate" title={imageState.fileName}>
                      {imageState.fileName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-1.5 text-xs text-[#4A6B88] font-mono tabular-nums mt-1">
                      <span>
                        {imageState.format}
                        {hasPhotoChanges && targetFormat !== imageState.format ? ` → ${targetFormat}` : ''}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>
                        {hasPhotoChanges && targetDims
                          ? `${targetDims.width} × ${targetDims.height} px`
                          : `${imageState.width} × ${imageState.height} px`}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{formatKb(imageState.byteSize)}</span>
                    </div>
                  </div>

                  {/* AI Trace Status Indicator */}
                  <div className="py-3.5">
                    {aiTracesCount > 0 ? (
                      <div className="flex items-start gap-2.5">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-bold text-amber-800">
                            {t.statusAiDetected}
                          </div>
                          <div className="text-xs text-[#4A6B88] font-mono tabular-nums mt-0.5">
                            {aiTracesCount} {t.aiTracesFound}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-2.5">
                        <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-xs font-bold text-emerald-800">
                            {t.statusClean}
                          </div>
                          <div className="text-xs text-[#4A6B88] mt-0.5">
                            {t.noAiTraces}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Primary Action: Auto-Clean AI Traces */}
                  <div className="pt-4 space-y-2.5">
                    <button
                      type="button"
                      onClick={handleAutoClean}
                      className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-sky-600 hover:bg-sky-700 rounded-lg transition-colors cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{t.autoCleanBtn}</span>
                    </button>
                    <p className="text-[11px] text-[#4A6B88] leading-normal">
                      {t.autoCleanDesc}
                    </p>
                  </div>
                </div>
              </div>

              {/* Camera Profile Replacer Panel (Side-by-Side Icon Grid) */}
              <div className="bg-white border border-[#D8E6F3] rounded-xl p-5 space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Camera className="w-4 h-4 text-sky-700" />
                    <h3 className="text-xs font-bold text-[#0F2537]">
                      {t.cameraProfileLabel}
                    </h3>
                  </div>
                  <span className="text-[11px] text-[#4A6B88]">
                    {lang === 'tr' ? 'Tek tıkla uygula' : 'Click to apply'}
                  </span>
                </div>

                <div
                  role="group"
                  aria-label={t.cameraProfileLabel}
                  className="grid grid-cols-3 gap-2"
                >
                  {CAMERA_PROFILES.map((prof) => {
                    const isSelected = selectedProfileId === prof.id;
                    const IconComp = prof.deviceType === 'phone' ? Smartphone : Camera;
                    return (
                      <button
                        key={prof.id}
                        type="button"
                        onClick={() => handleApplyCameraProfile(prof.id)}
                        title={prof.label}
                        aria-pressed={isSelected}
                        className={`flex flex-col items-center justify-center text-center p-2.5 rounded-lg border transition-colors cursor-pointer ${
                          isSelected
                            ? 'bg-[#E6F4FE] border-sky-500 text-[#0B3B5B]'
                            : 'bg-[#F8FBFE] hover:bg-[#EAF3FB] border-[#D8E6F3] text-[#0F2537]'
                        }`}
                      >
                        <IconComp
                          className={`w-4 h-4 mb-1.5 shrink-0 ${
                            isSelected ? 'text-sky-700' : 'text-[#4A6B88]'
                          }`}
                        />
                        <span className="text-[11px] font-semibold leading-tight truncate w-full">
                          {prof.shortName}
                        </span>
                        <span className="text-[10px] text-[#4A6B88] font-mono leading-tight truncate w-full mt-0.5">
                          {prof.subLabel}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Export & Reset Controls Panel */}
              <div className="bg-white border border-[#D8E6F3] rounded-xl p-5 space-y-3">
                <button
                  type="button"
                  disabled={isExporting}
                  onClick={handleDownloadCleaned}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-[#0F2537] hover:bg-[#1B3B56] disabled:opacity-60 rounded-lg transition-colors cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>
                    {isExporting
                      ? t.editorProcessingBtn
                      : `${t.downloadCleanBtn} (${targetFormat})`}
                  </span>
                </button>

                <button
                  type="button"
                  disabled={isExporting}
                  onClick={handleVerifyReupload}
                  title={t.verifyReuploadHint}
                  className="w-full flex items-center justify-center gap-2 px-3 py-2 text-xs font-semibold text-sky-800 bg-[#F2F8FD] hover:bg-[#E2EFFB] disabled:opacity-60 border border-[#C5D9EC] rounded-lg transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isExporting ? 'animate-spin' : ''}`} />
                  <span>{t.verifyReuploadBtn}</span>
                </button>

                <div className="grid grid-cols-2 gap-2 pt-1">
                  <button
                    type="button"
                    onClick={handleStripAll}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-rose-700 bg-rose-50/70 hover:bg-rose-100/80 border border-rose-200 rounded-lg transition-colors cursor-pointer"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span className="truncate">{t.stripAllBtn}</span>
                  </button>
                  <button
                    type="button"
                    onClick={handleResetOriginal}
                    className="flex items-center justify-center gap-1.5 px-3 py-2 text-xs font-medium text-[#4A6B88] bg-[#F4F8FB] hover:bg-[#E6F0F9] border border-[#D8E6F3] rounded-lg transition-colors cursor-pointer"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span className="truncate">{t.resetOriginalBtn}</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Right Column: Workspace Mode Switcher + EXIF Table OR Photo Editor & Format Converter (8 cols) */}
            <div className="lg:col-span-8 space-y-4">
              <div
                role="tablist"
                aria-label="Workspace Mode"
                className="inline-flex items-center p-1 bg-[#E3EFFA] border border-[#C8DDF0] rounded-xl"
              >
                <button
                  type="button"
                  role="tab"
                  aria-selected={workspaceMode === 'exif'}
                  onClick={() => setWorkspaceMode('exif')}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    workspaceMode === 'exif'
                      ? 'bg-white text-[#0F2537] shadow-xs'
                      : 'text-[#4A6B88] hover:text-[#0F2537]'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-sky-700" />
                  <span>{t.modeExifTab}</span>
                </button>
                <button
                  type="button"
                  role="tab"
                  aria-selected={workspaceMode === 'editor'}
                  onClick={() => setWorkspaceMode('editor')}
                  className={`inline-flex items-center gap-2 px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                    workspaceMode === 'editor'
                      ? 'bg-white text-[#0F2537] shadow-xs'
                      : 'text-[#4A6B88] hover:text-[#0F2537]'
                  }`}
                >
                  <Sliders className="w-3.5 h-3.5 text-sky-700" />
                  <span>{t.modePhotoEditorTab}</span>
                </button>
              </div>

              {workspaceMode === 'exif' ? (
                <MetadataTable
                  t={t}
                  originalTags={originalTags}
                  currentTags={currentTags}
                  activeTab={activeTab}
                  setActiveTab={setActiveTab}
                  onUpdateTag={handleUpdateTag}
                  onDeleteTag={handleDeleteTag}
                  onAddTag={handleAddTag}
                />
              ) : (
                <PhotoEditorPanel
                  t={t}
                  lang={lang}
                  previewUrl={imageState.previewUrl}
                  fileName={imageState.fileName}
                  srcWidth={imageState.width}
                  srcHeight={imageState.height}
                  originalFormat={imageState.format}
                  editState={photoEditState}
                  onChange={setPhotoEditState}
                  onReset={handleResetPhotoEdits}
                />
              )}
            </div>
          </div>
        )}

        {/* Lower Explanatory Sections */}
        <InfoSections t={t} />
      </main>

      {/* Minimalist Quiet Footer */}
      <footer className="border-t border-[#D8E6F3] bg-white py-6 px-6">
        <div className="max-w-[1280px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#4A6B88]">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <span className="font-semibold text-[#0F2537]">
              Remphin / Powered by Serkan Çakmak
            </span>
            <span aria-hidden="true">·</span>
            <span>
              {t.appName} ({lang === 'tr' ? 'Tarayıcı İçi EXIF ve AI Meta Veri Temizleyici' : 'In-Browser EXIF & AI Metadata Cleaner'})
            </span>
          </div>
          <div className="flex items-center gap-4">
            <a href="#workspace" className="hover:text-[#0F2537]">
              {t.navWorkspace}
            </a>
            <span aria-hidden="true">·</span>
            <a href="#how-it-works" className="hover:text-[#0F2537]">
              {t.navHowItWorks}
            </a>
            <span aria-hidden="true">·</span>
            <a href="#privacy" className="hover:text-[#0F2537]">
              {t.navPrivacy}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
