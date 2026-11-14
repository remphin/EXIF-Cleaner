export type Language = 'tr' | 'en';

export interface Translations {
  appName: string;
  navWorkspace: string;
  navHowItWorks: string;
  navAiSignatures: string;
  navPrivacy: string;
  uploadNewBtn: string;
  heroKicker: string;
  heroTitle: string;
  heroSubtitle: string;
  heroExtraNote: string;
  dropzoneTitle: string;
  dropzoneSubtitle: string;
  dropzoneFormats: string;
  selectFileBtn: string;
  orTrySample: string;
  sampleMidjourney: string;
  sampleSDXL: string;
  sampleDalle: string;
  sampleDescMidjourney: string;
  sampleDescSDXL: string;
  sampleDescDalle: string;
  statusAiDetected: string;
  statusClean: string;
  aiTracesFound: string;
  noAiTraces: string;
  autoCleanBtn: string;
  autoCleanDesc: string;
  stripAllBtn: string;
  resetOriginalBtn: string;
  downloadCleanBtn: string;
  cameraProfileLabel: string;
  cameraProfilePlaceholder: string;
  applyProfileBtn: string;
  tabAllTags: string;
  tabAiTraces: string;
  tabCameraExif: string;
  tabDiffView: string;
  searchPlaceholder: string;
  addCustomTagBtn: string;
  colTagKey: string;
  colCategory: string;
  colValue: string;
  colStatus: string;
  colActions: string;
  catAi: string;
  catCamera: string;
  catDate: string;
  catLocation: string;
  catFile: string;
  catCustom: string;
  flagAiTrace: string;
  flagModified: string;
  flagStandard: string;
  editBtn: string;
  saveBtn: string;
  cancelBtn: string;
  deleteTagBtn: string;
  emptyTagsTitle: string;
  emptyTagsDesc: string;
  diffBefore: string;
  diffAfter: string;
  diffRemoved: string;
  diffModified: string;
  diffKept: string;
  diffAdded: string;
  fileSummaryTitle: string;
  fileName: string;
  fileFormat: string;
  fileDimensions: string;
  fileSize: string;
  totalTagsCount: string;
  aiTagsCount: string;
  modalAddTitle: string;
  modalTagKeyLabel: string;
  modalTagCategoryLabel: string;
  modalTagValueLabel: string;
  modalConfirmAdd: string;
  howItWorksTitle: string;
  step1Title: string;
  step1Desc: string;
  step2Title: string;
  step2Desc: string;
  step3Title: string;
  step3Desc: string;
  supportedSignaturesTitle: string;
  supportedSignaturesDesc: string;
  privacyNoticeTitle: string;
  privacyNoticeDesc: string;
  stegoNoticeTitle: string;
  stegoNoticeDesc: string;
  toastAutoCleaned: string;
  toastProfileApplied: string;
  toastStrippedAll: string;
  toastRestored: string;
  toastTagSaved: string;
  toastTagDeleted: string;
  toastTagAdded: string;
  toastDownloaded: string;
  verifyReuploadBtn: string;
  verifyReuploadHint: string;
}

export const translations: Record<Language, Translations> = {
  tr: {
    appName: 'EXIF Temizleyici',
    navWorkspace: 'Çalışma Alanı',
    navHowItWorks: 'Nasıl Çalışır',
    navAiSignatures: 'AI İmzaları',
    navPrivacy: 'Gizlilik',
    uploadNewBtn: 'Görsel Yükle',
    heroKicker: 'Yerel Binary EXIF ve C2PA Motoru · %100 Tarayıcı İçi İşleme',
    heroTitle: 'Yapay zeka izlerini temizleyin, EXIF verilerini dilediğiniz gibi düzenleyin.',
    heroSubtitle:
      'Görsellerinizdeki Midjourney, Stable Diffusion, DALL·E, ComfyUI, Adobe Firefly ve C2PA yapay zeka meta verilerini anında tespit edin. Tek tıkla otomatik temizleyin veya gerçek kamera profilleriyle değiştirin.',
    heroExtraNote:
      'EXIF Temizleyici ile sadece yapay zeka görsellerini değil, herhangi bir cihazla çekilen görsellerinizdeki EXIF bilgilerini de değiştirebilirsiniz.',
    dropzoneTitle: 'Görselinizi buraya sürükleyin veya dosya seçin',
    dropzoneSubtitle: 'JPEG, PNG ve WebP dosyalarındaki EXIF, XMP, IPTC, C2PA ve PNG metin bloklarını okur ve düzenler.',
    dropzoneFormats: 'Desteklenen formatlar: JPG, JPEG, PNG, WEBP · Maksimum 50 MB',
    selectFileBtn: 'Bilgisayardan Görsel Seç',
    orTrySample: 'Hemen test etmek için gerçek AI meta verili örnek bir görsel yükleyin:',
    sampleMidjourney: 'Midjourney v6.1 Örneği',
    sampleSDXL: 'Stable Diffusion / ComfyUI',
    sampleDalle: 'DALL·E 3 (C2PA İmzalı)',
    sampleDescMidjourney: 'Prompt, Job ID ve DigitalSourceType içerir',
    sampleDescSDXL: 'PNG tEXt parameters, Seed, Sampler ve CFG içerir',
    sampleDescDalle: 'C2PA JUMBF manifestosu ve OpenAI XMP verisi içerir',
    statusAiDetected: 'Yapay Zeka İzi Tespit Edildi',
    statusClean: 'Yapay Zeka İzi Yok (Temiz)',
    aiTracesFound: 'yapay zeka meta veri kaydı bulundu',
    noAiTraces: 'Görselde bilinen bir yapay zeka imzası bulunmuyor',
    autoCleanBtn: 'Otomatik Temizle (AI İzlerini Sil)',
    autoCleanDesc: 'Yapay zeka komutlarını, C2PA imzalarını ve yazılım etiketlerini kaldırır; standart fotoğraf verilerini korur.',
    stripAllBtn: 'Tüm EXIF Verisini Sıfırla',
    resetOriginalBtn: 'Orijinale Dön',
    downloadCleanBtn: 'Temiz Görseli İndir',
    cameraProfileLabel: 'Gerçek Kamera Profili Uygula',
    cameraProfilePlaceholder: 'Kamera profili seçin...',
    applyProfileBtn: 'Profili Uygula',
    tabAllTags: 'Tüm Meta Veriler',
    tabAiTraces: 'Yapay Zeka İzleri',
    tabCameraExif: 'Kamera & EXIF',
    tabDiffView: 'Önce / Sonra Karşılaştırma',
    searchPlaceholder: 'Etiket adı veya değer ara (örn. Software, Prompt, Canon)...',
    addCustomTagBtn: 'Yeni EXIF Etiketi Ekle',
    colTagKey: 'Etiket (Tag)',
    colCategory: 'Kategori',
    colValue: 'Değer (Value)',
    colStatus: 'Durum',
    colActions: 'İşlem',
    catAi: 'Yapay Zeka / C2PA',
    catCamera: 'Kamera & Lens',
    catDate: 'Tarih & Zaman',
    catLocation: 'Konum (GPS)',
    catFile: 'Dosya & Renk',
    catCustom: 'Özel / Diğer',
    flagAiTrace: 'AI İzi',
    flagModified: 'Düzenlendi',
    flagStandard: 'Standart',
    editBtn: 'Düzenle',
    saveBtn: 'Kaydet',
    cancelBtn: 'İptal',
    deleteTagBtn: 'Sil',
    emptyTagsTitle: 'Gösterilecek meta veri kaydı yok',
    emptyTagsDesc: 'Seçili filtrede kayıt bulunmadı veya tüm meta veriler temizlendi.',
    diffBefore: 'Orijinal Görsel Meta Verisi',
    diffAfter: 'Çıktı Görseli Meta Verisi',
    diffRemoved: 'Silindi',
    diffModified: 'Değiştirildi',
    diffKept: 'Korundu',
    diffAdded: 'Eklendi',
    fileSummaryTitle: 'Dosya ve İnceleme Özeti',
    fileName: 'Dosya Adı',
    fileFormat: 'Format',
    fileDimensions: 'Çözünürlük',
    fileSize: 'Dosya Boyutu',
    totalTagsCount: 'Toplam Etiket',
    aiTagsCount: 'AI İz Sayısı',
    modalAddTitle: 'Özel EXIF Etiketi Ekle',
    modalTagKeyLabel: 'Etiket Adı (Örn. Artist, Copyright, Make)',
    modalTagCategoryLabel: 'Kategori',
    modalTagValueLabel: 'Etiket Değeri',
    modalConfirmAdd: 'Etiketi Ekle',
    howItWorksTitle: 'Nasıl Çalışır?',
    step1Title: '01. Derin Binary Analizi',
    step1Desc:
      'Görselinizin JPEG APP1 (TIFF/EXIF/XMP), APP11 (C2PA/JUMBF) ve PNG tEXt/iTXt/eXIf bloklarını bayt düzeyinde tarar.',
    step2Title: '02. Otomatik veya Özel Düzenleme',
    step2Desc:
      'Tek tıkla tüm AI üretim izlerini (Prompt, Seed, ComfyUI düğümleri, C2PA manifestosu) silin veya istediğiniz etiketi elle değiştirin.',
    step3Title: '03. Yeniden Paketleme ve İndirme',
    step3Desc:
      'Düzenlenen EXIF alanları gerçek TIFF/EXIF binary başlığına dönüştürülerek görüntü kalitesi bozulmadan indirilir.',
    supportedSignaturesTitle: 'Tespit Edilen ve Temizlenen Yapay Zeka İmzaları',
    supportedSignaturesDesc:
      'Platformumuz aşağıdaki üretken yapay zeka araçlarının bıraktığı görünmez meta veri izlerini otomatik olarak tanır:',
    privacyNoticeTitle: 'Tam Gizlilik: Görselleriniz Cihazınızdan Çıkmaz',
    privacyNoticeDesc:
      'Tüm EXIF okuma, AI izi temizleme (JPEG APP1/APP11 JUMBF, PNG tEXt/iTXt/caBX, WebP EXIF/XMP/C2PA) ve binary yeniden yazma işlemleri doğrudan tarayıcınızın belleğinde (Web API & ArrayBuffer) gerçekleşir. Hiçbir görsel sunucuya yüklenmez veya kaydedilmez.',
    stegoNoticeTitle: 'Teknik Bilgi Notu: Meta Veri ve Steganografik Filigran Ayrımı',
    stegoNoticeDesc:
      'Bu platform dosya başlıklarındaki ve konteyner segmentlerindeki tüm EXIF, XMP, IPTC, PNG tEXt/iTXt/caBX ve C2PA (APP11 / JUMBF) meta verilerini bayt düzeyinde tamamen temizler. Piksel düzeyindeki görünmez steganografik filigranlar (Google SynthID vb.) doğrudan görüntü piksellerine işlendiği için meta veri kapsamı dışındadır.',
    toastAutoCleaned: 'Tüm yapay zeka meta verileri otomatik olarak temizlendi ve standart EXIF korundu.',
    toastProfileApplied: 'Kamera profili uygulandı ve yapay zeka izleri kaldırıldı.',
    toastStrippedAll: 'Görseldeki tüm EXIF ve meta veri kayıtları tamamen sıfırlandı.',
    toastRestored: 'Orijinal görsel meta verileri geri yüklendi.',
    toastTagSaved: 'Meta veri etiketi güncellendi.',
    toastTagDeleted: 'Meta veri etiketi kaldırıldı.',
    toastTagAdded: 'Yeni EXIF etiketi eklendi.',
    toastDownloaded: 'Temizlenmiş görsel yeni EXIF verileriyle indirildi.',
    verifyReuploadBtn: 'Çıktıyı Doğrula (Yeniden Oku)',
    verifyReuploadHint: 'Oluşturulan binary dosyayı tekrar okuyarak AI izlerinin silindiğini kanıtlar',
  },
  en: {
    appName: 'EXIF Cleaner',
    navWorkspace: 'Workspace',
    navHowItWorks: 'How It Works',
    navAiSignatures: 'AI Signatures',
    navPrivacy: 'Privacy',
    uploadNewBtn: 'Upload Image',
    heroKicker: 'Local Binary EXIF & C2PA Engine · 100% In-Browser Processing',
    heroTitle: 'Scrub AI generation metadata and customize EXIF tags with precision.',
    heroSubtitle:
      'Instantly detect hidden Midjourney, Stable Diffusion, DALL·E, ComfyUI, Adobe Firefly, and C2PA metadata inside your images. Auto-clean with one click or replace with authentic camera profiles.',
    heroExtraNote:
      'With EXIF Cleaner, you can also modify and customize EXIF metadata on standard photos captured with any camera or device.',
    dropzoneTitle: 'Drag and drop your image here, or browse files',
    dropzoneSubtitle: 'Reads and edits EXIF, XMP, IPTC, C2PA, and PNG text chunks in JPEG, PNG, and WebP files.',
    dropzoneFormats: 'Supported formats: JPG, JPEG, PNG, WEBP · Max 50 MB',
    selectFileBtn: 'Choose Image from Device',
    orTrySample: 'Or load a sample image with real embedded AI metadata to test immediately:',
    sampleMidjourney: 'Midjourney v6.1 Sample',
    sampleSDXL: 'Stable Diffusion / ComfyUI',
    sampleDalle: 'DALL·E 3 (C2PA Signed)',
    sampleDescMidjourney: 'Contains Prompt, Job ID & DigitalSourceType',
    sampleDescSDXL: 'Contains PNG tEXt parameters, Seed, Sampler & CFG',
    sampleDescDalle: 'Contains C2PA JUMBF manifest & OpenAI XMP data',
    statusAiDetected: 'AI Metadata Detected',
    statusClean: 'No AI Traces (Clean)',
    aiTracesFound: 'AI metadata records detected',
    noAiTraces: 'No known AI generation signatures found in this image',
    autoCleanBtn: 'Auto-Clean (Remove AI Traces)',
    autoCleanDesc: 'Removes AI prompts, C2PA manifests, and generator software tags while keeping standard photo metadata.',
    stripAllBtn: 'Strip All Metadata',
    resetOriginalBtn: 'Reset to Original',
    downloadCleanBtn: 'Download Cleaned Image',
    cameraProfileLabel: 'Apply Authentic Camera Profile',
    cameraProfilePlaceholder: 'Select a camera profile...',
    applyProfileBtn: 'Apply Profile',
    tabAllTags: 'All Metadata',
    tabAiTraces: 'AI Traces',
    tabCameraExif: 'Camera & EXIF',
    tabDiffView: 'Before / After Diff',
    searchPlaceholder: 'Search tag key or value (e.g. Software, Prompt, Canon)...',
    addCustomTagBtn: 'Add Custom EXIF Tag',
    colTagKey: 'Tag Key',
    colCategory: 'Category',
    colValue: 'Value',
    colStatus: 'Status',
    colActions: 'Actions',
    catAi: 'AI / C2PA',
    catCamera: 'Camera & Lens',
    catDate: 'Date & Time',
    catLocation: 'Location (GPS)',
    catFile: 'File & Color',
    catCustom: 'Custom / Other',
    flagAiTrace: 'AI Trace',
    flagModified: 'Modified',
    flagStandard: 'Standard',
    editBtn: 'Edit',
    saveBtn: 'Save',
    cancelBtn: 'Cancel',
    deleteTagBtn: 'Delete',
    emptyTagsTitle: 'No metadata entries to display',
    emptyTagsDesc: 'No entries match your active filter, or all metadata has been scrubbed.',
    diffBefore: 'Original Image Metadata',
    diffAfter: 'Output Image Metadata',
    diffRemoved: 'Removed',
    diffModified: 'Modified',
    diffKept: 'Kept',
    diffAdded: 'Added',
    fileSummaryTitle: 'File & Inspection Summary',
    fileName: 'File Name',
    fileFormat: 'Format',
    fileDimensions: 'Resolution',
    fileSize: 'File Size',
    totalTagsCount: 'Total Tags',
    aiTagsCount: 'AI Traces',
    modalAddTitle: 'Add Custom EXIF Tag',
    modalTagKeyLabel: 'Tag Name (e.g. Artist, Copyright, Make)',
    modalTagCategoryLabel: 'Category',
    modalTagValueLabel: 'Tag Value',
    modalConfirmAdd: 'Add Tag',
    howItWorksTitle: 'How It Works',
    step1Title: '01. Deep Binary Inspection',
    step1Desc:
      'Scans JPEG APP1 (TIFF/EXIF/XMP), APP11 (C2PA/JUMBF), and PNG tEXt/iTXt/eXIf binary chunks at the byte level.',
    step2Title: '02. Auto-Scrub or Custom Edit',
    step2Desc:
      'Remove all AI generation traces (Prompts, Seeds, ComfyUI workflows, C2PA manifests) in one click, or edit any tag inline.',
    step3Title: '03. Binary Repackaging & Export',
    step3Desc:
      'Edited EXIF fields are serialized into a genuine binary TIFF/EXIF header and written to the downloadable image.',
    supportedSignaturesTitle: 'Detected & Scrubbed AI Signatures',
    supportedSignaturesDesc:
      'Our engine automatically identifies and strips invisible metadata footprints left by generative AI tools:',
    privacyNoticeTitle: 'Complete Privacy: Images Never Leave Your Browser',
    privacyNoticeDesc:
      'All EXIF parsing, AI signature scrubbing (JPEG APP1/APP11 JUMBF, PNG tEXt/iTXt/caBX, WebP EXIF/XMP/C2PA), and binary rewriting happen 100% locally in your browser memory via ArrayBuffer. Zero server uploads.',
    stegoNoticeTitle: 'Technical Note: Metadata vs. Pixel-Level Steganographic Watermarks',
    stegoNoticeDesc:
      'This platform completely scrubs all container and header metadata at the byte level, including EXIF, XMP, IPTC, PNG tEXt/iTXt/caBX, and C2PA (APP11 / JUMBF) segments. Pixel-level steganographic watermarks (such as Google SynthID) are embedded directly into pixel values and are outside the scope of file metadata.',
    toastAutoCleaned: 'All AI metadata traces automatically scrubbed while preserving standard EXIF.',
    toastProfileApplied: 'Camera profile applied and AI traces removed.',
    toastStrippedAll: 'All EXIF and metadata chunks stripped from the image.',
    toastRestored: 'Original image metadata restored.',
    toastTagSaved: 'Metadata tag updated.',
    toastTagDeleted: 'Metadata tag removed.',
    toastTagAdded: 'Custom EXIF tag added.',
    toastDownloaded: 'Cleaned image downloaded with updated binary EXIF.',
    verifyReuploadBtn: 'Verify Output Binary (Re-parse)',
    verifyReuploadHint: 'Re-parses the generated output binary to prove AI traces are completely gone',
  },
};
