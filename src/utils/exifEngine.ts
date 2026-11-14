export type TagCategory = 'ai' | 'camera' | 'date' | 'location' | 'file' | 'custom';

export interface ExifTagItem {
  id: string;
  key: string;
  value: string;
  category: TagCategory;
  isAiTrace: boolean;
  aiReason?: string;
  sourceSegment: string; // e.g., 'EXIF IFD0', 'Exif SubIFD', 'PNG tEXt', 'XMP', 'C2PA / JUMBF'
  isModified?: boolean;
}

export interface ParsedImageMetadata {
  format: 'JPEG' | 'PNG' | 'WEBP' | 'UNKNOWN';
  tags: ExifTagItem[];
  byteSize: number;
}

export interface CameraProfile {
  id: string;
  label: string;
  shortName: string;
  subLabel: string;
  deviceType: 'camera' | 'phone';
  make: string;
  model: string;
  lensModel: string;
  software: string;
  fNumber: string;
  exposureTime: string;
  iso: string;
  focalLength: string;
  colorSpace: string;
}

export const CAMERA_PROFILES: CameraProfile[] = [
  {
    id: 'sony-a7rv',
    label: 'Sony α7R V + FE 24-70mm GM II',
    shortName: 'Sony α7R V',
    subLabel: '24-70mm GM',
    deviceType: 'camera',
    make: 'SONY',
    model: 'ILCE-7RM5',
    lensModel: 'FE 24-70mm F2.8 GM II',
    software: 'ILCE-7RM5 v2.01',
    fNumber: 'f/2.8',
    exposureTime: '1/250 sec',
    iso: 'ISO 100',
    focalLength: '50.0 mm',
    colorSpace: 'sRGB',
  },
  {
    id: 'canon-r5',
    label: 'Canon EOS R5 + RF 50mm F1.2L USM',
    shortName: 'Canon R5',
    subLabel: 'RF 50mm F1.2',
    deviceType: 'camera',
    make: 'Canon',
    model: 'Canon EOS R5',
    lensModel: 'RF50mm F1.2 L USM',
    software: 'Firmware Version 2.0.0',
    fNumber: 'f/1.8',
    exposureTime: '1/500 sec',
    iso: 'ISO 160',
    focalLength: '50.0 mm',
    colorSpace: 'sRGB',
  },
  {
    id: 'nikon-d7000',
    label: 'Nikon D7000 + AF-S DX NIKKOR 35mm f/1.8G',
    shortName: 'Nikon D7000',
    subLabel: 'DX 35mm f/1.8',
    deviceType: 'camera',
    make: 'NIKON CORPORATION',
    model: 'NIKON D7000',
    lensModel: 'AF-S DX Nikkor 35mm f/1.8G',
    software: 'Ver.1.05',
    fNumber: 'f/2.2',
    exposureTime: '1/400 sec',
    iso: 'ISO 200',
    focalLength: '35.0 mm',
    colorSpace: 'sRGB',
  },
  {
    id: 'huawei-pura-90',
    label: 'Huawei Pura 90 Ultra (XMAGE 1-inch Main)',
    shortName: 'Pura 90',
    subLabel: 'XMAGE 22.5mm',
    deviceType: 'phone',
    make: 'HUAWEI',
    model: 'HBP-AL00 (Pura 90)',
    lensModel: 'HUAWEI XMAGE Ultra Lighting Pop-Out Lens 22.5mm f/1.6',
    software: 'HarmonyOS 5.0.1.120',
    fNumber: 'f/1.6',
    exposureTime: '1/160 sec',
    iso: 'ISO 50',
    focalLength: '22.5 mm',
    colorSpace: 'sRGB',
  },
  {
    id: 'samsung-galaxy-s26',
    label: 'Samsung Galaxy S26 Ultra (200MP Wide)',
    shortName: 'Galaxy S26',
    subLabel: '200MP 23mm',
    deviceType: 'phone',
    make: 'samsung',
    model: 'SM-S948B (Galaxy S26 Ultra)',
    lensModel: 'Samsung S26 Ultra Rear Wide 23mm f/1.7 OIS',
    software: 'S948BXXU1AYA4 (One UI 8.1)',
    fNumber: 'f/1.7',
    exposureTime: '1/200 sec',
    iso: 'ISO 64',
    focalLength: '23.0 mm',
    colorSpace: 'Display P3',
  },
  {
    id: 'iphone-16-pro',
    label: 'Apple iPhone 16 Pro (Main 24mm)',
    shortName: 'iPhone 16 Pro',
    subLabel: 'Main 24mm',
    deviceType: 'phone',
    make: 'Apple',
    model: 'iPhone 16 Pro',
    lensModel: 'iPhone 16 Pro back triple camera 6.765mm f/1.78',
    software: '18.1',
    fNumber: 'f/1.8',
    exposureTime: '1/120 sec',
    iso: 'ISO 64',
    focalLength: '24.0 mm (35mm equiv)',
    colorSpace: 'Display P3',
  },
  {
    id: 'fujifilm-xt5',
    label: 'Fujifilm X-T5 + XF 33mm F1.4 R LM WR',
    shortName: 'Fujifilm X-T5',
    subLabel: 'XF 33mm F1.4',
    deviceType: 'camera',
    make: 'FUJIFILM',
    model: 'X-T5',
    lensModel: 'XF33mmF1.4 R LM WR',
    software: 'Digital Camera X-T5 Ver3.01',
    fNumber: 'f/2.0',
    exposureTime: '1/320 sec',
    iso: 'ISO 125',
    focalLength: '33.0 mm',
    colorSpace: 'sRGB',
  },
  {
    id: 'nikon-z8',
    label: 'Nikon Z8 + NIKKOR Z 50mm f/1.2 S',
    shortName: 'Nikon Z8',
    subLabel: 'Z 50mm f/1.2',
    deviceType: 'camera',
    make: 'NIKON CORPORATION',
    model: 'NIKON Z 8',
    lensModel: 'NIKKOR Z 50mm f/1.2 S',
    software: 'Ver.02.01',
    fNumber: 'f/1.8',
    exposureTime: '1/640 sec',
    iso: 'ISO 64',
    focalLength: '50.0 mm',
    colorSpace: 'sRGB',
  },
  {
    id: 'leica-q3',
    label: 'Leica Q3 + Summilux 28mm f/1.7 ASPH.',
    shortName: 'Leica Q3',
    subLabel: '28mm Summilux',
    deviceType: 'camera',
    make: 'LEICA CAMERA AG',
    model: 'LEICA Q3',
    lensModel: 'SUMMILUX 1:1.7/28 ASPH.',
    software: '2.0.1',
    fNumber: 'f/2.0',
    exposureTime: '1/500 sec',
    iso: 'ISO 100',
    focalLength: '28.0 mm',
    colorSpace: 'sRGB',
  },
];

// Known TIFF/EXIF tag IDs
const TIFF_TAG_NAMES: Record<number, { key: string; category: TagCategory }> = {
  0x010e: { key: 'ImageDescription', category: 'custom' },
  0x010f: { key: 'Make', category: 'camera' },
  0x0110: { key: 'Model', category: 'camera' },
  0x0112: { key: 'Orientation', category: 'file' },
  0x011a: { key: 'XResolution', category: 'file' },
  0x011b: { key: 'YResolution', category: 'file' },
  0x0128: { key: 'ResolutionUnit', category: 'file' },
  0x0131: { key: 'Software', category: 'camera' },
  0x0132: { key: 'DateTime', category: 'date' },
  0x013b: { key: 'Artist', category: 'custom' },
  0x8298: { key: 'Copyright', category: 'custom' },
  0x829a: { key: 'ExposureTime', category: 'camera' },
  0x829d: { key: 'FNumber', category: 'camera' },
  0x8827: { key: 'ISO', category: 'camera' },
  0x9000: { key: 'ExifVersion', category: 'file' },
  0x9003: { key: 'DateTimeOriginal', category: 'date' },
  0x9004: { key: 'DateTimeDigitized', category: 'date' },
  0x920a: { key: 'FocalLength', category: 'camera' },
  0x9286: { key: 'UserComment', category: 'custom' },
  0xa001: { key: 'ColorSpace', category: 'file' },
  0xa002: { key: 'PixelXDimension', category: 'file' },
  0xa003: { key: 'PixelYDimension', category: 'file' },
  0xa433: { key: 'LensMake', category: 'camera' },
  0xa434: { key: 'LensModel', category: 'camera' },
};

const AI_KEY_PATTERNS = [
  /^parameters$/i,
  /^prompt$/i,
  /^negative_prompt$/i,
  /^workflow$/i,
  /^c2pa/i,
  /^jumbf/i,
  /^digitalsourcetype$/i,
  /^credit$/i,
  /^ai_generator$/i,
  /^dream$/i,
  /^sd-metadata$/i,
  /^midjourney/i,
  /^dalle/i,
  /^comfyui/i,
  /^sui_image_params$/i,
  /^aigc[-_]?label$/i,
  /^tc260/i,
  /^fooocus/i,
];

const AI_VALUE_PATTERNS = [
  /midjourney/i,
  /stable\s*diffusion/i,
  /automatic1111/i,
  /comfyui/i,
  /dall[\s-]*e/i,
  /openai/i,
  /adobe\s*firefly/i,
  /trainedAlgorithmicMedia/i,
  /compositeSynthetic/i,
  /algorithmicMedia/i,
  /c2pa\.actions/i,
  /c2pa\.claim/i,
  /c2pa\.assertions/i,
  /steps:\s*\d+.*sampler:/i,
  /cfg\s*scale:/i,
  /flux\.1/i,
  /leonardo\.ai/i,
  /runwayml/i,
  /invokeai/i,
  /novelai/i,
  /bing\s*image\s*creator/i,
  /microsoft\s*(designer|copilot|corporation\s*signer)/i,
  /mai-image/i,
  /meta\s*ai/i,
  /imagine\s*with\s*meta/i,
  /image\s*playground/i,
  /amazon\s*titan/i,
  /nova\s*canvas/i,
  /aws\s*bedrock/i,
  /seedream/i,
  /bytedance/i,
  /recraft/i,
  /qwen[-_\s]*image/i,
  /tc260/i,
  /aigc[-_\s]*label/i,
  /fooocus/i,
  /swarmui/i,
  /sui_image_params/i,
  /kohya/i,
  /imagen/i,
  /--ar\s+\d+:\d+/i,
  /--v\s+\d+(\.\d+)?/i,
  /--style\s+\w+/i,
  /job\s*id:\s*[0-9a-f-]{8,}/i,
  /negative\s*prompt:/i,
];

/**
 * Evaluates whether a given metadata key/value pair represents an AI generation signature.
 */
export function detectAiSignature(key: string, value: string, sourceSegment = ''): { isAi: boolean; reason?: string } {
  const combinedSource = `${key} ${sourceSegment}`;
  if (/c2pa|jumbf|caBX/i.test(combinedSource)) {
    return { isAi: true, reason: 'C2PA Content Credentials Manifest' };
  }
  for (const pat of AI_KEY_PATTERNS) {
    if (pat.test(key.trim())) {
      if (key.toLowerCase() === 'credit' && !AI_VALUE_PATTERNS.some((vp) => vp.test(value))) {
        continue;
      }
      return { isAi: true, reason: `AI Metadata Key (${key})` };
    }
  }
  for (const pat of AI_VALUE_PATTERNS) {
    if (pat.test(value)) {
      return { isAi: true, reason: `AI Generator Footprint in ${key}` };
    }
  }
  return { isAi: false };
}

/**
 * Infers the appropriate TagCategory for a tag.
 */
export function inferCategory(key: string, value: string, sourceSegment = ''): TagCategory {
  const aiCheck = detectAiSignature(key, value, sourceSegment);
  if (aiCheck.isAi) return 'ai';
  const k = key.toLowerCase();
  if (
    k.includes('make') ||
    k.includes('model') ||
    k.includes('lens') ||
    k.includes('exposure') ||
    k.includes('fnumber') ||
    k.includes('iso') ||
    k.includes('focal') ||
    k.includes('aperture') ||
    k.includes('shutter') ||
    k.includes('software')
  ) {
    return 'camera';
  }
  if (k.includes('date') || k.includes('time')) return 'date';
  if (k.includes('gps') || k.includes('latitude') || k.includes('longitude') || k.includes('altitude')) {
    return 'location';
  }
  if (
    k.includes('resolution') ||
    k.includes('orientation') ||
    k.includes('color') ||
    k.includes('dimension') ||
    k.includes('width') ||
    k.includes('height') ||
    k.includes('exifversion')
  ) {
    return 'file';
  }
  return 'custom';
}

function readAscii(bytes: Uint8Array, start: number, length: number): string {
  let out = '';
  const end = Math.min(bytes.length, start + length);
  for (let i = start; i < end; i++) {
    const c = bytes[i];
    if (c === 0) break;
    if (c >= 32 && c <= 126) {
      out += String.fromCharCode(c);
    } else if (c === 10 || c === 13 || c === 9) {
      out += ' ';
    }
  }
  return out.trim();
}

function readUtf8(bytes: Uint8Array, start: number, length: number): string {
  const slice = bytes.subarray(start, Math.min(bytes.length, start + length));
  // Strip trailing nulls
  let actualEnd = slice.length;
  while (actualEnd > 0 && slice[actualEnd - 1] === 0) {
    actualEnd--;
  }
  try {
    return new TextDecoder('utf-8', { fatal: false }).decode(slice.subarray(0, actualEnd)).trim();
  } catch {
    return readAscii(bytes, start, length);
  }
}

function readU16(bytes: Uint8Array, offset: number, littleEndian: boolean): number {
  if (offset + 2 > bytes.length) return 0;
  return littleEndian
    ? bytes[offset] | (bytes[offset + 1] << 8)
    : (bytes[offset] << 8) | bytes[offset + 1];
}

function readU32(bytes: Uint8Array, offset: number, littleEndian: boolean): number {
  if (offset + 4 > bytes.length) return 0;
  if (littleEndian) {
    return (
      (bytes[offset] |
        (bytes[offset + 1] << 8) |
        (bytes[offset + 2] << 16) |
        (bytes[offset + 3] << 24)) >>>
      0
    );
  }
  return (
    ((bytes[offset] << 24) |
      (bytes[offset + 1] << 16) |
      (bytes[offset + 2] << 8) |
      bytes[offset + 3]) >>>
    0
  );
}

/**
 * Parses a TIFF header & IFDs (used inside JPEG APP1 Exif and PNG eXIf chunks).
 */
function parseTiffBlock(tiffBytes: Uint8Array, sourcePrefix: string): ExifTagItem[] {
  const items: ExifTagItem[] = [];
  if (tiffBytes.length < 8) return items;

  const byteOrder = String.fromCharCode(tiffBytes[0], tiffBytes[1]);
  const littleEndian = byteOrder === 'II';
  if (!littleEndian && byteOrder !== 'MM') return items;

  const magic = readU16(tiffBytes, 2, littleEndian);
  if (magic !== 42) return items;

  const ifd0Offset = readU32(tiffBytes, 4, littleEndian);

  const parseIfd = (ifdOffset: number, ifdName: string) => {
    if (ifdOffset <= 0 || ifdOffset + 2 > tiffBytes.length) return;
    const entryCount = readU16(tiffBytes, ifdOffset, littleEndian);
    if (entryCount > 256) return;

    for (let i = 0; i < entryCount; i++) {
      const entryOffset = ifdOffset + 2 + i * 12;
      if (entryOffset + 12 > tiffBytes.length) break;

      const tagId = readU16(tiffBytes, entryOffset, littleEndian);
      const fieldType = readU16(tiffBytes, entryOffset + 2, littleEndian);
      const count = readU32(tiffBytes, entryOffset + 4, littleEndian);
      const valueOffsetField = entryOffset + 8;

      // SubIFD pointer (ExifOffset = 0x8769)
      if (tagId === 0x8769) {
        const subIfdOffset = readU32(tiffBytes, valueOffsetField, littleEndian);
        parseIfd(subIfdOffset, `${sourcePrefix} SubIFD`);
        continue;
      }

      // GPS IFD pointer (0x8825)
      if (tagId === 0x8825) {
        items.push({
          id: `gps-${entryOffset}`,
          key: 'GPSInfoPresent',
          value: 'Coordinates Embedded (GPS IFD)',
          category: 'location',
          isAiTrace: false,
          sourceSegment: `${sourcePrefix} GPS`,
        });
        continue;
      }

      const tagMeta = TIFF_TAG_NAMES[tagId];
      if (!tagMeta) continue;

      let valueStr = '';
      // Type 2 = ASCII string
      if (fieldType === 2) {
        const strOffset = count <= 4 ? valueOffsetField : readU32(tiffBytes, valueOffsetField, littleEndian);
        if (strOffset + count <= tiffBytes.length) {
          valueStr = readUtf8(tiffBytes, strOffset, count);
        }
      } else if (fieldType === 3) {
        // SHORT (16-bit)
        const num = readU16(tiffBytes, valueOffsetField, littleEndian);
        valueStr = String(num);
      } else if (fieldType === 4) {
        // LONG (32-bit)
        const num = readU32(tiffBytes, valueOffsetField, littleEndian);
        valueStr = String(num);
      } else if (fieldType === 5) {
        // RATIONAL (two LONGs)
        const ratOffset = readU32(tiffBytes, valueOffsetField, littleEndian);
        if (ratOffset + 8 <= tiffBytes.length) {
          const num = readU32(tiffBytes, ratOffset, littleEndian);
          const den = readU32(tiffBytes, ratOffset + 4, littleEndian);
          if (den !== 0) {
            if (tagId === 0x829a) {
              // ExposureTime
              valueStr = num < den ? `${num}/${den} sec` : `${(num / den).toFixed(2)} sec`;
            } else if (tagId === 0x829d) {
              // FNumber
              valueStr = `f/${(num / den).toFixed(1).replace(/\.0$/, '')}`;
            } else if (tagId === 0x920a) {
              // FocalLength
              valueStr = `${(num / den).toFixed(1)} mm`;
            } else {
              valueStr = `${(num / den).toFixed(2).replace(/\.00$/, '')}`;
            }
          }
        }
      } else if (fieldType === 7) {
        // UNDEFINED (e.g. UserComment or ExifVersion)
        const dataOffset = count <= 4 ? valueOffsetField : readU32(tiffBytes, valueOffsetField, littleEndian);
        if (dataOffset + count <= tiffBytes.length) {
          if (tagId === 0x9286 && count > 8) {
            // Skip 8-byte character code header in UserComment
            valueStr = readUtf8(tiffBytes, dataOffset + 8, count - 8);
          } else {
            valueStr = readUtf8(tiffBytes, dataOffset, count);
          }
        }
      }

      if (!valueStr) continue;

      const aiCheck = detectAiSignature(tagMeta.key, valueStr, ifdName);
      items.push({
        id: `tiff-${tagId}-${entryOffset}`,
        key: tagMeta.key,
        value: valueStr,
        category: aiCheck.isAi ? 'ai' : tagMeta.category,
        isAiTrace: aiCheck.isAi,
        aiReason: aiCheck.reason,
        sourceSegment: ifdName,
      });
    }
  };

  parseIfd(ifd0Offset, `${sourcePrefix} IFD0`);
  return items;
}

/**
 * Extracts key XMP attributes/elements from an XMP XML string.
 */
function parseXmpPacket(xml: string): ExifTagItem[] {
  const items: ExifTagItem[] = [];
  const patterns: Array<{ key: string; regex: RegExp }> = [
    { key: 'CreatorTool', regex: /xmp:CreatorTool[=">]+([^"<]+)/i },
    { key: 'DigitalSourceType', regex: /DigitalSourceType[=">]+([^"<]+)/i },
    { key: 'Credit', regex: /photoshop:Credit[=">]+([^"<]+)/i },
    { key: 'AI_Prompt', regex: /(?:exif:UserComment|dc:description|prompt)[=">]+([^"<]+)/i },
    { key: 'C2PA_Manifest', regex: /(c2pa:[^\s"=<>]+)[=">]+([^"<]+)/i },
  ];

  for (const p of patterns) {
    const match = xml.match(p.regex);
    if (match) {
      const val = (match[2] || match[1] || '').trim();
      if (val) {
        const aiCheck = detectAiSignature(p.key, val, 'XMP');
        items.push({
          id: `xmp-${p.key}`,
          key: p.key,
          value: val,
          category: aiCheck.isAi ? 'ai' : inferCategory(p.key, val, 'XMP'),
          isAiTrace: aiCheck.isAi,
          aiReason: aiCheck.reason,
          sourceSegment: 'XMP Packet',
        });
      }
    }
  }
  return items;
}

/**
 * Parses binary image buffer (JPEG, PNG, WebP) and extracts all EXIF / XMP / PNG / C2PA metadata.
 */
export function parseImageBinary(buffer: Uint8Array): ParsedImageMetadata {
  const tags: ExifTagItem[] = [];

  // 1. Check JPEG (0xFF 0xD8)
  if (buffer.length >= 4 && buffer[0] === 0xff && buffer[1] === 0xd8) {
    let offset = 2;
    while (offset + 4 <= buffer.length) {
      if (buffer[offset] !== 0xff) break;
      const marker = buffer[offset + 1];
      if (marker === 0xda || marker === 0xd9) break; // SOS or EOI

      const segLength = (buffer[offset + 2] << 8) | buffer[offset + 3];
      if (segLength < 2 || offset + 2 + segLength > buffer.length) break;

      const payloadStart = offset + 4;
      const payloadLength = segLength - 2;

      // APP1 (0xFFE1): EXIF or XMP
      if (marker === 0xe1 && payloadLength >= 6) {
        const header = readAscii(buffer, payloadStart, 6);
        if (header === 'Exif') {
          const tiffSlice = buffer.subarray(payloadStart + 6, payloadStart + payloadLength);
          tags.push(...parseTiffBlock(tiffSlice, 'EXIF'));
        } else if (readAscii(buffer, payloadStart, 29).includes('http://ns.adobe.com/xap/1.0/')) {
          const xml = readUtf8(buffer, payloadStart + 29, payloadLength - 29);
          tags.push(...parseXmpPacket(xml));
        }
      }

      // APP11 (0xFFEB): JUMBF / C2PA Content Credentials
      if (marker === 0xeb && payloadLength >= 8) {
        const jumbfText = readUtf8(buffer, payloadStart, payloadLength);
        tags.push({
          id: `c2pa-app11-${offset}`,
          key: 'C2PA_ContentCredentials',
          value: jumbfText.replace(/[^\x20-\x7E]+/g, ' ').trim() || 'JUMBF C2PA Signed AI Manifest',
          category: 'ai',
          isAiTrace: true,
          aiReason: 'C2PA / JUMBF Content Credentials Signature',
          sourceSegment: 'JPEG APP11 (C2PA)',
        });
      }

      // COM (0xFFFE): JPEG Comment
      if (marker === 0xfe && payloadLength > 0) {
        const comment = readUtf8(buffer, payloadStart, payloadLength);
        if (comment) {
          const aiCheck = detectAiSignature('Comment', comment, 'JPEG COM');
          tags.push({
            id: `com-${offset}`,
            key: 'Comment',
            value: comment,
            category: aiCheck.isAi ? 'ai' : 'custom',
            isAiTrace: aiCheck.isAi,
            aiReason: aiCheck.reason,
            sourceSegment: 'JPEG COM',
          });
        }
      }

      offset += 2 + segLength;
    }

    return { format: 'JPEG', tags: deduplicateTags(tags), byteSize: buffer.length };
  }

  // 2. Check PNG (89 50 4E 47 0D 0A 1A 0A)
  if (
    buffer.length >= 8 &&
    buffer[0] === 0x89 &&
    buffer[1] === 0x50 &&
    buffer[2] === 0x4e &&
    buffer[3] === 0x47
  ) {
    let offset = 8;
    while (offset + 12 <= buffer.length) {
      const length = readU32(buffer, offset, false);
      const chunkType = readAscii(buffer, offset + 4, 4);
      const dataStart = offset + 8;

      if (dataStart + length > buffer.length) break;

      if (chunkType === 'IHDR' && length >= 8) {
        const width = readU32(buffer, dataStart, false);
        const height = readU32(buffer, dataStart + 4, false);
        tags.push({
          id: 'png-ihdr-size',
          key: 'ImageDimensions',
          value: `${width} × ${height} px`,
          category: 'file',
          isAiTrace: false,
          sourceSegment: 'PNG IHDR',
        });
      } else if (chunkType === 'tEXt' || chunkType === 'iTXt') {
        const rawChunk = buffer.subarray(dataStart, dataStart + length);
        const nullIdx = rawChunk.indexOf(0);
        if (nullIdx > 0) {
          const key = readUtf8(rawChunk, 0, nullIdx);
          // For iTXt, skip compression flags/language tags if present
          let valStart = nullIdx + 1;
          if (chunkType === 'iTXt' && valStart + 4 <= rawChunk.length) {
            // compression flag (1), compression method (1), lang tag (null-term), translated keyword (null-term)
            valStart += 2;
            while (valStart < rawChunk.length && rawChunk[valStart] !== 0) valStart++;
            valStart++;
            while (valStart < rawChunk.length && rawChunk[valStart] !== 0) valStart++;
            valStart++;
          }
          const val = readUtf8(rawChunk, valStart, rawChunk.length - valStart);
          if (key && val) {
            if (key.includes('XML:com.adobe.xmp')) {
              tags.push(...parseXmpPacket(val));
            } else {
              const aiCheck = detectAiSignature(key, val, `PNG ${chunkType}`);
              tags.push({
                id: `png-${chunkType}-${offset}`,
                key,
                value: val,
                category: aiCheck.isAi ? 'ai' : inferCategory(key, val, `PNG ${chunkType}`),
                isAiTrace: aiCheck.isAi,
                aiReason: aiCheck.reason,
                sourceSegment: `PNG ${chunkType}`,
              });
            }
          }
        }
      } else if (chunkType === 'eXIf') {
        const tiffSlice = buffer.subarray(dataStart, dataStart + length);
        tags.push(...parseTiffBlock(tiffSlice, 'PNG eXIf'));
      } else if (chunkType === 'caBX' || chunkType === 'jumb') {
        const c2paInfo = readUtf8(buffer, dataStart, length);
        tags.push({
          id: `png-c2pa-${offset}`,
          key: 'C2PA_Manifest',
          value: c2paInfo.replace(/[^\x20-\x7E]+/g, ' ').trim() || 'C2PA Content Credentials Chunk',
          category: 'ai',
          isAiTrace: true,
          aiReason: 'PNG C2PA Content Credentials Chunk',
          sourceSegment: `PNG ${chunkType}`,
        });
      }

      if (chunkType === 'IEND') break;
      offset += 12 + length;
    }

    return { format: 'PNG', tags: deduplicateTags(tags), byteSize: buffer.length };
  }

  // 3. Check WebP (RIFF....WEBP)
  if (
    buffer.length >= 12 &&
    readAscii(buffer, 0, 4) === 'RIFF' &&
    readAscii(buffer, 8, 4) === 'WEBP'
  ) {
    let offset = 12;
    while (offset + 8 <= buffer.length) {
      const chunkFourCC = readAscii(buffer, offset, 4);
      const chunkSize = readU32(buffer, offset + 4, true);
      const payloadStart = offset + 8;
      if (payloadStart + chunkSize > buffer.length) break;

      if (chunkFourCC === 'EXIF') {
        let tiffStart = payloadStart;
        if (readAscii(buffer, payloadStart, 4) === 'Exif') {
          tiffStart += 6;
        }
        tags.push(...parseTiffBlock(buffer.subarray(tiffStart, payloadStart + chunkSize), 'WebP EXIF'));
      } else if (chunkFourCC === 'XMP ') {
        const xml = readUtf8(buffer, payloadStart, chunkSize);
        tags.push(...parseXmpPacket(xml));
      } else if (
        chunkFourCC === 'C2PA' ||
        chunkFourCC === 'c2pa' ||
        chunkFourCC === 'JUMB' ||
        chunkFourCC === 'jumb'
      ) {
        const c2paText = readUtf8(buffer, payloadStart, chunkSize);
        tags.push({
          id: `webp-c2pa-${offset}`,
          key: 'C2PA_Manifest',
          value: c2paText.replace(/[^\x20-\x7E]+/g, ' ').trim() || 'WebP JUMBF C2PA Signed Manifest',
          category: 'ai',
          isAiTrace: true,
          aiReason: 'WebP C2PA / JUMBF Content Credentials Chunk',
          sourceSegment: `WebP ${chunkFourCC}`,
        });
      }

      offset += 8 + chunkSize + (chunkSize % 2);
    }
    return { format: 'WEBP', tags: deduplicateTags(tags), byteSize: buffer.length };
  }

  return { format: 'UNKNOWN', tags: [], byteSize: buffer.length };
}

function deduplicateTags(tags: ExifTagItem[]): ExifTagItem[] {
  const seen = new Map<string, ExifTagItem>();
  for (const t of tags) {
    const compositeKey = `${t.key}::${t.sourceSegment}`;
    if (!seen.has(compositeKey)) {
      seen.set(compositeKey, t);
    }
  }
  return Array.from(seen.values());
}

/**
 * Automatically removes all AI-related metadata traces while keeping or normalizing standard camera/file EXIF.
 */
export function autoCleanMetadata(tags: ExifTagItem[]): ExifTagItem[] {
  const cleaned = tags
    .filter((tag) => !tag.isAiTrace && tag.category !== 'ai')
    .map((tag) => ({ ...tag }));

  // Ensure standard ColorSpace and Resolution exist if cleaning left only minimal tags
  const hasColorSpace = cleaned.some((t) => t.key.toLowerCase() === 'colorspace');
  if (!hasColorSpace) {
    cleaned.push({
      id: 'std-colorspace',
      key: 'ColorSpace',
      value: 'sRGB',
      category: 'file',
      isAiTrace: false,
      sourceSegment: 'EXIF SubIFD',
      isModified: true,
    });
  }

  const hasOrientation = cleaned.some((t) => t.key.toLowerCase() === 'orientation');
  if (!hasOrientation) {
    cleaned.push({
      id: 'std-orientation',
      key: 'Orientation',
      value: '1 (Normal)',
      category: 'file',
      isAiTrace: false,
      sourceSegment: 'EXIF IFD0',
      isModified: true,
    });
  }

  return cleaned;
}

/**
 * Applies a realistic camera profile and scrubs all AI metadata traces.
 */
export function applyCameraProfileToTags(
  currentTags: ExifTagItem[],
  profile: CameraProfile,
  timestampIso?: string
): ExifTagItem[] {
  const base = currentTags.filter(
    (t) =>
      !t.isAiTrace &&
      t.category !== 'ai' &&
      ![
        'make',
        'model',
        'lensmodel',
        'software',
        'fnumber',
        'exposuretime',
        'iso',
        'focallength',
        'colorspace',
        'datetime',
        'datetimeoriginal',
      ].includes(t.key.toLowerCase())
  );

  const now = timestampIso ? new Date(timestampIso) : new Date();
  const pad = (n: number) => String(n).padStart(2, '0');
  const exifDate = `${now.getFullYear()}:${pad(now.getMonth() + 1)}:${pad(now.getDate())} ${pad(
    now.getHours()
  )}:${pad(now.getMinutes())}:${pad(now.getSeconds())}`;

  const profileTags: ExifTagItem[] = [
    {
      id: 'prof-make',
      key: 'Make',
      value: profile.make,
      category: 'camera',
      isAiTrace: false,
      sourceSegment: 'EXIF IFD0',
      isModified: true,
    },
    {
      id: 'prof-model',
      key: 'Model',
      value: profile.model,
      category: 'camera',
      isAiTrace: false,
      sourceSegment: 'EXIF IFD0',
      isModified: true,
    },
    {
      id: 'prof-lens',
      key: 'LensModel',
      value: profile.lensModel,
      category: 'camera',
      isAiTrace: false,
      sourceSegment: 'EXIF SubIFD',
      isModified: true,
    },
    {
      id: 'prof-software',
      key: 'Software',
      value: profile.software,
      category: 'camera',
      isAiTrace: false,
      sourceSegment: 'EXIF IFD0',
      isModified: true,
    },
    {
      id: 'prof-fnumber',
      key: 'FNumber',
      value: profile.fNumber,
      category: 'camera',
      isAiTrace: false,
      sourceSegment: 'EXIF SubIFD',
      isModified: true,
    },
    {
      id: 'prof-exposure',
      key: 'ExposureTime',
      value: profile.exposureTime,
      category: 'camera',
      isAiTrace: false,
      sourceSegment: 'EXIF SubIFD',
      isModified: true,
    },
    {
      id: 'prof-iso',
      key: 'ISO',
      value: profile.iso,
      category: 'camera',
      isAiTrace: false,
      sourceSegment: 'EXIF SubIFD',
      isModified: true,
    },
    {
      id: 'prof-focal',
      key: 'FocalLength',
      value: profile.focalLength,
      category: 'camera',
      isAiTrace: false,
      sourceSegment: 'EXIF SubIFD',
      isModified: true,
    },
    {
      id: 'prof-datetime',
      key: 'DateTimeOriginal',
      value: exifDate,
      category: 'date',
      isAiTrace: false,
      sourceSegment: 'EXIF SubIFD',
      isModified: true,
    },
    {
      id: 'prof-colorspace',
      key: 'ColorSpace',
      value: profile.colorSpace,
      category: 'file',
      isAiTrace: false,
      sourceSegment: 'EXIF SubIFD',
      isModified: true,
    },
  ];

  return [...profileTags, ...base];
}

// Known reverse mapping for writing ASCII/Rational/Short tags into binary TIFF IFD0 & SubIFD
const REVERSE_TIFF_MAP: Record<string, { tagId: number; subIfd: boolean }> = {
  imagedescription: { tagId: 0x010e, subIfd: false },
  make: { tagId: 0x010f, subIfd: false },
  model: { tagId: 0x0110, subIfd: false },
  software: { tagId: 0x0131, subIfd: false },
  datetime: { tagId: 0x0132, subIfd: false },
  artist: { tagId: 0x013b, subIfd: false },
  copyright: { tagId: 0x8298, subIfd: false },
  exposuretime: { tagId: 0x829a, subIfd: true },
  fnumber: { tagId: 0x829d, subIfd: true },
  iso: { tagId: 0x8827, subIfd: true },
  datetimeoriginal: { tagId: 0x9003, subIfd: true },
  focallength: { tagId: 0x920a, subIfd: true },
  usercomment: { tagId: 0x9286, subIfd: true },
  colorspace: { tagId: 0xa001, subIfd: true },
  lensmake: { tagId: 0xa433, subIfd: true },
  lensmodel: { tagId: 0xa434, subIfd: true },
};

/**
 * Builds a valid little-endian TIFF block containing IFD0 and Exif SubIFD from ExifTagItem[].
 */
export function buildTiffBlockFromTags(tags: ExifTagItem[]): Uint8Array {
  const ifd0Entries: Array<{ tagId: number; bytes: Uint8Array }> = [];
  const subIfdEntries: Array<{ tagId: number; bytes: Uint8Array }> = [];
  const customCommentParts: string[] = [];

  const enc = new TextEncoder();

  for (const t of tags) {
    const lower = t.key.toLowerCase();
    const mapped = REVERSE_TIFF_MAP[lower];
    const encoded = enc.encode(`${t.value}\0`);
    if (mapped) {
      if (mapped.subIfd) {
        subIfdEntries.push({ tagId: mapped.tagId, bytes: encoded });
      } else {
        ifd0Entries.push({ tagId: mapped.tagId, bytes: encoded });
      }
    } else if (lower !== 'imagedimensions' && lower !== 'orientation') {
      customCommentParts.push(`${t.key}: ${t.value}`);
    }
  }

  if (customCommentParts.length > 0 && !subIfdEntries.some((e) => e.tagId === 0x9286)) {
    const joined = customCommentParts.join(' | ');
    const encoded = enc.encode(`${joined}\0`);
    subIfdEntries.push({ tagId: 0x9286, bytes: encoded });
  }

  // Sort entries by tagId as required by TIFF spec
  ifd0Entries.sort((a, b) => a.tagId - b.tagId);
  subIfdEntries.sort((a, b) => a.tagId - b.tagId);

  const hasSubIfd = subIfdEntries.length > 0;
  if (hasSubIfd) {
    // Placeholder for 0x8769 ExifOffset
    ifd0Entries.push({ tagId: 0x8769, bytes: new Uint8Array(0) });
    ifd0Entries.sort((a, b) => a.tagId - b.tagId);
  }

  // Calculate layout:
  // Header: 8 bytes (II, 42, offset=8)
  // IFD0: 2 + ifd0Entries.length * 12 + 4 (nextIFD=0)
  // IFD0 heap data
  // SubIFD: 2 + subIfdEntries.length * 12 + 4
  // SubIFD heap data
  const ifd0Start = 8;
  const ifd0HeaderSize = 2 + ifd0Entries.length * 12 + 4;
  let heapCursor = ifd0Start + ifd0HeaderSize;

  for (const e of ifd0Entries) {
    if (e.tagId !== 0x8769 && e.bytes.length > 4) {
      heapCursor += e.bytes.length + (e.bytes.length % 2);
    }
  }

  const subIfdStart = hasSubIfd ? heapCursor : 0;
  const subIfdHeaderSize = hasSubIfd ? 2 + subIfdEntries.length * 12 + 4 : 0;
  let subHeapCursor = subIfdStart + subIfdHeaderSize;

  for (const e of subIfdEntries) {
    if (e.bytes.length > 4) {
      subHeapCursor += e.bytes.length + (e.bytes.length % 2);
    }
  }

  const totalSize = hasSubIfd ? subHeapCursor : heapCursor;
  const out = new Uint8Array(totalSize);
  const view = new DataView(out.buffer);

  // TIFF Header: "II", 42, 8
  out[0] = 0x49;
  out[1] = 0x49;
  view.setUint16(2, 42, true);
  view.setUint32(4, ifd0Start, true);

  // Write IFD0
  view.setUint16(ifd0Start, ifd0Entries.length, true);
  let currentIfd0Heap = ifd0Start + ifd0HeaderSize;

  ifd0Entries.forEach((entry, idx) => {
    const pos = ifd0Start + 2 + idx * 12;
    view.setUint16(pos, entry.tagId, true);
    if (entry.tagId === 0x8769) {
      view.setUint16(pos + 2, 4, true); // LONG
      view.setUint32(pos + 4, 1, true);
      view.setUint32(pos + 8, subIfdStart, true);
    } else {
      view.setUint16(pos + 2, 2, true); // ASCII
      view.setUint32(pos + 4, entry.bytes.length, true);
      if (entry.bytes.length <= 4) {
        out.set(entry.bytes, pos + 8);
      } else {
        view.setUint32(pos + 8, currentIfd0Heap, true);
        out.set(entry.bytes, currentIfd0Heap);
        currentIfd0Heap += entry.bytes.length + (entry.bytes.length % 2);
      }
    }
  });

  // Write SubIFD
  if (hasSubIfd) {
    view.setUint16(subIfdStart, subIfdEntries.length, true);
    let currentSubHeap = subIfdStart + subIfdHeaderSize;

    subIfdEntries.forEach((entry, idx) => {
      const pos = subIfdStart + 2 + idx * 12;
      view.setUint16(pos, entry.tagId, true);
      view.setUint16(pos + 2, 2, true); // ASCII representation for universal compatibility
      view.setUint32(pos + 4, entry.bytes.length, true);
      if (entry.bytes.length <= 4) {
        out.set(entry.bytes, pos + 8);
      } else {
        view.setUint32(pos + 8, currentSubHeap, true);
        out.set(entry.bytes, currentSubHeap);
        currentSubHeap += entry.bytes.length + (entry.bytes.length % 2);
      }
    });
  }

  return out;
}

/**
 * Rewrites a JPEG binary buffer: strips all existing APP1 (Exif/XMP), APP11 (C2PA/JUMBF), APP13 (IPTC), and COM segments,
 * and injects a clean APP1 Exif segment built from `tags` (if `tags` is non-empty).
 */
export function writeJpegWithTags(originalJpeg: Uint8Array, tags: ExifTagItem[]): Uint8Array {
  if (originalJpeg.length < 4 || originalJpeg[0] !== 0xff || originalJpeg[1] !== 0xd8) {
    throw new Error('Invalid JPEG buffer');
  }

  const keptChunks: Uint8Array[] = [new Uint8Array([0xff, 0xd8])];

  // Build new APP1 Exif segment if there are tags to write
  const writableTags = tags.filter((t) => t.key.toLowerCase() !== 'imagedimensions');
  if (writableTags.length > 0) {
    const tiffBytes = buildTiffBlockFromTags(writableTags);
    const app1Length = 2 + 6 + tiffBytes.length;
    if (app1Length <= 65535) {
      const app1 = new Uint8Array(2 + app1Length);
      app1[0] = 0xff;
      app1[1] = 0xe1;
      app1[2] = (app1Length >> 8) & 0xff;
      app1[3] = app1Length & 0xff;
      // "Exif\0\0"
      app1[4] = 0x45;
      app1[5] = 0x78;
      app1[6] = 0x69;
      app1[7] = 0x66;
      app1[8] = 0x00;
      app1[9] = 0x00;
      app1.set(tiffBytes, 10);
      keptChunks.push(app1);
    }
  }

  let offset = 2;
  while (offset + 4 <= originalJpeg.length) {
    if (originalJpeg[offset] !== 0xff) {
      keptChunks.push(originalJpeg.subarray(offset));
      break;
    }
    const marker = originalJpeg[offset + 1];
    // Start of Scan (0xDA) or End of Image (0xD9): copy the rest of the image stream verbatim
    if (marker === 0xda || marker === 0xd9) {
      keptChunks.push(originalJpeg.subarray(offset));
      break;
    }

    const segLength = (originalJpeg[offset + 2] << 8) | originalJpeg[offset + 3];
    if (segLength < 2 || offset + 2 + segLength > originalJpeg.length) {
      keptChunks.push(originalJpeg.subarray(offset));
      break;
    }

    // Strip all APP1..APP15 (0xE1..0xEF: EXIF, XMP, Extended XMP, ICC, JUMBF/C2PA 0xEB, IPTC 0xED, Adobe 0xEE) and COM (0xFE)
    const shouldStrip = (marker >= 0xe1 && marker <= 0xef) || marker === 0xfe;
    if (!shouldStrip) {
      keptChunks.push(originalJpeg.subarray(offset, offset + 2 + segLength));
    }

    offset += 2 + segLength;
  }

  const totalLen = keptChunks.reduce((acc, c) => acc + c.length, 0);
  const out = new Uint8Array(totalLen);
  let pos = 0;
  for (const c of keptChunks) {
    out.set(c, pos);
    pos += c.length;
  }
  return out;
}

// CRC32 table for PNG chunks
const CRC_TABLE = (() => {
  const table = new Uint32Array(256);
  for (let n = 0; n < 256; n++) {
    let c = n;
    for (let k = 0; k < 8; k++) {
      c = c & 1 ? 0xedb88320 ^ (c >>> 1) : c >>> 1;
    }
    table[n] = c >>> 0;
  }
  return table;
})();

function crc32(bytes: Uint8Array): number {
  let c = 0xffffffff;
  for (let i = 0; i < bytes.length; i++) {
    c = CRC_TABLE[(c ^ bytes[i]) & 0xff] ^ (c >>> 8);
  }
  return (c ^ 0xffffffff) >>> 0;
}

function makePngChunk(type: string, data: Uint8Array): Uint8Array {
  const chunk = new Uint8Array(12 + data.length);
  const view = new DataView(chunk.buffer);
  view.setUint32(0, data.length, false);
  for (let i = 0; i < 4; i++) {
    chunk[4 + i] = type.charCodeAt(i);
  }
  chunk.set(data, 8);
  const crcVal = crc32(chunk.subarray(4, 8 + data.length));
  view.setUint32(8 + data.length, crcVal, false);
  return chunk;
}

/**
 * Rewrites a PNG binary buffer: removes existing tEXt, iTXt, zTXt, eXIf, caBX, jumb chunks
 * and inserts clean eXIf + tEXt chunks for the provided `tags`.
 */
export function writePngWithTags(originalPng: Uint8Array, tags: ExifTagItem[]): Uint8Array {
  if (
    originalPng.length < 8 ||
    originalPng[0] !== 0x89 ||
    originalPng[1] !== 0x50 ||
    originalPng[2] !== 0x4e ||
    originalPng[3] !== 0x47
  ) {
    throw new Error('Invalid PNG buffer');
  }

  const keptChunks: Uint8Array[] = [originalPng.subarray(0, 8)];
  const writableTags = tags.filter((t) => t.key.toLowerCase() !== 'imagedimensions');

  let offset = 8;
  let injectedAfterIhdr = false;

  while (offset + 12 <= originalPng.length) {
    const length = readU32(originalPng, offset, false);
    const chunkType = readAscii(originalPng, offset + 4, 4);
    const fullChunkEnd = offset + 12 + length;
    if (fullChunkEnd > originalPng.length) break;

    const isMetadataChunk =
      chunkType === 'tEXt' ||
      chunkType === 'iTXt' ||
      chunkType === 'zTXt' ||
      chunkType === 'eXIf' ||
      chunkType === 'caBX' ||
      chunkType === 'jumb' ||
      chunkType === 'c2pa' ||
      chunkType === 'c2pA' ||
      chunkType === 'tIME' ||
      chunkType === 'dSIG';

    if (!isMetadataChunk) {
      keptChunks.push(originalPng.subarray(offset, fullChunkEnd));
    }

    if (chunkType === 'IHDR' && !injectedAfterIhdr && writableTags.length > 0) {
      injectedAfterIhdr = true;
      // Inject eXIf chunk with TIFF data
      const tiffBytes = buildTiffBlockFromTags(writableTags);
      keptChunks.push(makePngChunk('eXIf', tiffBytes));

      // Also write non-TIFF custom or explicit PNG tEXt tags if any
      const enc = new TextEncoder();
      for (const t of writableTags) {
        if (!REVERSE_TIFF_MAP[t.key.toLowerCase()]) {
          const keyBytes = enc.encode(t.key.slice(0, 78));
          const valBytes = enc.encode(t.value);
          const payload = new Uint8Array(keyBytes.length + 1 + valBytes.length);
          payload.set(keyBytes, 0);
          payload[keyBytes.length] = 0;
          payload.set(valBytes, keyBytes.length + 1);
          keptChunks.push(makePngChunk('tEXt', payload));
        }
      }
    }

    if (chunkType === 'IEND') break;
    offset = fullChunkEnd;
  }

  const totalLen = keptChunks.reduce((acc, c) => acc + c.length, 0);
  const out = new Uint8Array(totalLen);
  let pos = 0;
  for (const c of keptChunks) {
    out.set(c, pos);
    pos += c.length;
  }
  return out;
}

/**
 * Rewrites a WebP binary buffer: strips existing EXIF, XMP , C2PA, JUMB chunks,
 * appends a clean EXIF chunk built from `tags`, and updates the RIFF container length.
 */
export function writeWebpWithTags(originalWebp: Uint8Array, tags: ExifTagItem[]): Uint8Array {
  if (
    originalWebp.length < 12 ||
    readAscii(originalWebp, 0, 4) !== 'RIFF' ||
    readAscii(originalWebp, 8, 4) !== 'WEBP'
  ) {
    throw new Error('Invalid WebP buffer');
  }

  const keptChunks: Uint8Array[] = [];
  let offset = 12;

  while (offset + 8 <= originalWebp.length) {
    const chunkFourCC = readAscii(originalWebp, offset, 4);
    const chunkSize = readU32(originalWebp, offset + 4, true);
    const paddedSize = chunkSize + (chunkSize % 2);
    const chunkEnd = offset + 8 + paddedSize;
    if (chunkEnd > originalWebp.length) break;

    const isMeta =
      chunkFourCC === 'EXIF' ||
      chunkFourCC === 'XMP ' ||
      chunkFourCC === 'C2PA' ||
      chunkFourCC === 'c2pa' ||
      chunkFourCC === 'JUMB' ||
      chunkFourCC === 'jumb';

    if (!isMeta) {
      keptChunks.push(originalWebp.subarray(offset, chunkEnd));
    }

    offset = chunkEnd;
  }

  const writableTags = tags.filter((t) => t.key.toLowerCase() !== 'imagedimensions');
  if (writableTags.length > 0) {
    const tiffBytes = buildTiffBlockFromTags(writableTags);
    const paddedLen = tiffBytes.length + (tiffBytes.length % 2);
    const exifChunk = new Uint8Array(8 + paddedLen);
    const view = new DataView(exifChunk.buffer);
    exifChunk[0] = 0x45; // 'E'
    exifChunk[1] = 0x58; // 'X'
    exifChunk[2] = 0x49; // 'I'
    exifChunk[3] = 0x46; // 'F'
    view.setUint32(4, tiffBytes.length, true);
    exifChunk.set(tiffBytes, 8);
    keptChunks.push(exifChunk);
  }

  const bodyLen = keptChunks.reduce((acc, c) => acc + c.length, 0);
  const out = new Uint8Array(12 + bodyLen);
  const outView = new DataView(out.buffer);
  // "RIFF" + size + "WEBP"
  out[0] = 0x52;
  out[1] = 0x49;
  out[2] = 0x46;
  out[3] = 0x46;
  outView.setUint32(4, 4 + bodyLen, true);
  out[8] = 0x57;
  out[9] = 0x45;
  out[10] = 0x42;
  out[11] = 0x50;

  let pos = 12;
  for (const c of keptChunks) {
    out.set(c, pos);
    pos += c.length;
  }
  return out;
}

/**
 * Rewrites a JPEG, PNG, or WebP binary with the updated metadata tags.
 */
export function writeImageBinaryWithTags(
  originalBuffer: Uint8Array,
  format: 'JPEG' | 'PNG' | 'WEBP' | 'UNKNOWN',
  tags: ExifTagItem[]
): Uint8Array {
  if (format === 'PNG') {
    return writePngWithTags(originalBuffer, tags);
  }
  if (format === 'JPEG') {
    return writeJpegWithTags(originalBuffer, tags);
  }
  if (format === 'WEBP') {
    return writeWebpWithTags(originalBuffer, tags);
  }
  return originalBuffer;
}
