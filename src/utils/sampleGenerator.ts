import {
  ExifTagItem,
  writeJpegWithTags,
  writePngWithTags,
} from './exifEngine';

export type SamplePresetId = 'midjourney' | 'sdxl' | 'dalle';

export interface GeneratedSampleFile {
  fileName: string;
  mimeType: string;
  bytes: Uint8Array;
  dataUrl: string;
  width: number;
  height: number;
}

/**
 * Generates a valid minimal 1x1 JPEG binary (for headless/unit test environments without HTMLCanvasElement)
 * and injects the requested segments.
 */
export function createMinimalJpegBytes(): Uint8Array {
  return new Uint8Array([
    0xff, 0xd8, 0xff, 0xe0, 0x00, 0x10, 0x4a, 0x46, 0x49, 0x46, 0x00, 0x01, 0x01, 0x01, 0x00, 0x48,
    0x00, 0x48, 0x00, 0x00, 0xff, 0xdb, 0x00, 0x43, 0x00, 0x08, 0x06, 0x06, 0x07, 0x06, 0x05, 0x08,
    0x07, 0x07, 0x07, 0x09, 0x09, 0x08, 0x0a, 0x0c, 0x14, 0x0d, 0x0c, 0x0b, 0x0b, 0x0c, 0x19, 0x12,
    0x13, 0x0f, 0x14, 0x1d, 0x1a, 0x1f, 0x1e, 0x1d, 0x1a, 0x1c, 0x1c, 0x20, 0x24, 0x2e, 0x27, 0x20,
    0x22, 0x2c, 0x23, 0x1c, 0x1c, 0x28, 0x37, 0x29, 0x2c, 0x30, 0x31, 0x34, 0x34, 0x34, 0x1f, 0x27,
    0x39, 0x3d, 0x38, 0x32, 0x3c, 0x2e, 0x33, 0x34, 0x32, 0xff, 0xc0, 0x00, 0x0b, 0x08, 0x00, 0x01,
    0x00, 0x01, 0x01, 0x01, 0x11, 0x00, 0xff, 0xc4, 0x00, 0x1f, 0x00, 0x00, 0x01, 0x05, 0x01, 0x01,
    0x01, 0x01, 0x01, 0x01, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x00, 0x01, 0x02, 0x03, 0x04,
    0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0xff, 0xc4, 0x00, 0xb5, 0x10, 0x00, 0x02, 0x01, 0x03,
    0x03, 0x02, 0x04, 0x03, 0x05, 0x05, 0x04, 0x04, 0x00, 0x00, 0x01, 0x7d, 0x01, 0x02, 0x03, 0x00,
    0x04, 0x11, 0x05, 0x12, 0x21, 0x31, 0x41, 0x06, 0x13, 0x51, 0x61, 0x07, 0x22, 0x71, 0x14, 0x32,
    0x81, 0x91, 0xa1, 0x08, 0x23, 0x42, 0xb1, 0xc1, 0x15, 0x52, 0xd1, 0xf0, 0x24, 0x33, 0x62, 0x72,
    0x82, 0x09, 0x0a, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2a, 0x34, 0x35,
    0x36, 0x37, 0x38, 0x39, 0x3a, 0x43, 0x44, 0x45, 0x46, 0x47, 0x48, 0x49, 0x4a, 0x53, 0x54, 0x55,
    0x56, 0x57, 0x58, 0x59, 0x5a, 0x63, 0x64, 0x65, 0x66, 0x67, 0x68, 0x69, 0x6a, 0x73, 0x74, 0x75,
    0x76, 0x77, 0x78, 0x79, 0x7a, 0x83, 0x84, 0x85, 0x86, 0x87, 0x88, 0x89, 0x8a, 0x92, 0x93, 0x94,
    0x95, 0x96, 0x97, 0x98, 0x99, 0x9a, 0xa2, 0xa3, 0xa4, 0xa5, 0xa6, 0xa7, 0xa8, 0xa9, 0xaa, 0xb2,
    0xb3, 0xb4, 0xb5, 0xb6, 0xb7, 0xb8, 0xb9, 0xba, 0xc2, 0xc3, 0xc4, 0xc5, 0xc6, 0xc7, 0xc8, 0xc9,
    0xca, 0xd2, 0xd3, 0xd4, 0xd5, 0xd6, 0xd7, 0xd8, 0xd9, 0xda, 0xe1, 0xe2, 0xe3, 0xe4, 0xe5, 0xe6,
    0xe7, 0xe8, 0xe9, 0xea, 0xf1, 0xf2, 0xf3, 0xf4, 0xf5, 0xf6, 0xf7, 0xf8, 0xf9, 0xfa, 0xff, 0xda,
    0x00, 0x08, 0x01, 0x01, 0x00, 0x00, 0x3f, 0x00, 0xfb, 0xd5, 0xff, 0xd9,
  ]);
}

/**
 * Generates a valid minimal 1x1 PNG binary.
 */
export function createMinimalPngBytes(): Uint8Array {
  return new Uint8Array([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0x00, 0x00, 0x00, 0x0d, 0x49, 0x48, 0x44, 0x52,
    0x00, 0x00, 0x04, 0x00, 0x00, 0x00, 0x03, 0x00, 0x08, 0x02, 0x00, 0x00, 0x00, 0x73, 0x26, 0x4c,
    0x7c, 0x00, 0x00, 0x00, 0x0c, 0x49, 0x44, 0x41, 0x54, 0x08, 0xd7, 0x63, 0xf8, 0xcf, 0xc0, 0x00,
    0x00, 0x03, 0x01, 0x01, 0x00, 0x18, 0xdd, 0x8d, 0xb0, 0x00, 0x00, 0x00, 0x00, 0x49, 0x45, 0x4e,
    0x44, 0xae, 0x42, 0x60, 0x82,
  ]);
}

/**
 * Returns initial tags for a sample preset so we can embed them into a binary JPEG or PNG.
 */
export function getSamplePresetTags(preset: SamplePresetId): ExifTagItem[] {
  if (preset === 'midjourney') {
    return [
      {
        id: 'mj-1',
        key: 'Software',
        value: 'Midjourney v6.1 (nijijourney pipeline)',
        category: 'ai',
        isAiTrace: true,
        sourceSegment: 'EXIF IFD0',
      },
      {
        id: 'mj-2',
        key: 'ImageDescription',
        value:
          'architectural coastal pavilion in Aegean twilight, minimalist glass and travertine, soft blue hour reflection --ar 16:9 --v 6.1 --style raw --q 2 Job ID: 98f4a21c-7b23-4119-9a8d-41c881ef092a',
        category: 'ai',
        isAiTrace: true,
        sourceSegment: 'EXIF IFD0',
      },
      {
        id: 'mj-3',
        key: 'DigitalSourceType',
        value: 'http://cv.iptc.org/newscodes/digitalsourcetype/trainedAlgorithmicMedia',
        category: 'ai',
        isAiTrace: true,
        sourceSegment: 'EXIF SubIFD',
      },
      {
        id: 'mj-4',
        key: 'Artist',
        value: 'Midjourney Bot',
        category: 'ai',
        isAiTrace: true,
        sourceSegment: 'EXIF IFD0',
      },
      {
        id: 'mj-5',
        key: 'DateTimeOriginal',
        value: '2026:11:14 14:22:09',
        category: 'date',
        isAiTrace: false,
        sourceSegment: 'EXIF SubIFD',
      },
      {
        id: 'mj-6',
        key: 'ColorSpace',
        value: 'sRGB',
        category: 'file',
        isAiTrace: false,
        sourceSegment: 'EXIF SubIFD',
      },
    ];
  }

  if (preset === 'sdxl') {
    return [
      {
        id: 'sd-1',
        key: 'parameters',
        value:
          'nordic fjord minimalist lighthouse at dawn, calm cobalt water, crisp atmospheric perspective, 35mm f/2.0\nNegative prompt: blurry, watermark, oversaturated, CGI\nSteps: 32, Sampler: DPM++ 2M Karras, CFG scale: 6.5, Seed: 3891047219, Size: 1024x768, Model hash: e6bb9ea85b, Model: sd_xl_base_1.0.safetensors',
        category: 'ai',
        isAiTrace: true,
        sourceSegment: 'PNG tEXt',
      },
      {
        id: 'sd-2',
        key: 'workflow',
        value: '{"last_node_id": 14, "nodes": [{"type": "KSampler", "ComfyUI": "v0.2.4", "seed": 3891047219}]}',
        category: 'ai',
        isAiTrace: true,
        sourceSegment: 'PNG tEXt',
      },
      {
        id: 'sd-3',
        key: 'Software',
        value: 'Automatic1111 Stable Diffusion WebUI / ComfyUI',
        category: 'ai',
        isAiTrace: true,
        sourceSegment: 'PNG eXIf',
      },
      {
        id: 'sd-4',
        key: 'DateTimeOriginal',
        value: '2026:11:12 09:45:18',
        category: 'date',
        isAiTrace: false,
        sourceSegment: 'PNG eXIf',
      },
      {
        id: 'sd-5',
        key: 'ColorSpace',
        value: 'sRGB',
        category: 'file',
        isAiTrace: false,
        sourceSegment: 'PNG eXIf',
      },
    ];
  }

  // dalle
  return [
    {
      id: 'dl-1',
      key: 'Software',
      value: 'OpenAI DALL-E 3 (C2PA Claim Generator v2.1)',
      category: 'ai',
      isAiTrace: true,
      sourceSegment: 'EXIF IFD0',
    },
    {
      id: 'dl-2',
      key: 'Credit',
      value: 'Made with OpenAI DALL-E 3 · C2PA Content Credentials Signed',
      category: 'ai',
      isAiTrace: true,
      sourceSegment: 'EXIF IFD0',
    },
    {
      id: 'dl-3',
      key: 'UserComment',
      value: 'c2pa.actions: c2pa.created | digitalSourceType: trainedAlgorithmicMedia | Signer: OpenAI CA',
      category: 'ai',
      isAiTrace: true,
      sourceSegment: 'EXIF SubIFD',
    },
    {
      id: 'dl-4',
      key: 'DateTimeOriginal',
        value: '2026:11:13 18:10:04',
      category: 'date',
      isAiTrace: false,
      sourceSegment: 'EXIF SubIFD',
    },
    {
      id: 'dl-5',
      key: 'ColorSpace',
      value: 'sRGB',
      category: 'file',
      isAiTrace: false,
      sourceSegment: 'EXIF SubIFD',
    },
  ];
}

/**
 * Builds a real binary JPEG or PNG with embedded AI metadata for a sample preset.
 * In browser environments, renders an aesthetic canvas illustration first so the preview is crisp and visual.
 */
export async function generateSampleImageBinary(preset: SamplePresetId): Promise<GeneratedSampleFile> {
  const tags = getSamplePresetTags(preset);
  const width = 1024;
  const height = 768;

  if (typeof document !== 'undefined') {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // Draw a serene, calming blue architectural/landscape artwork matching the sample preset
      const grad = ctx.createLinearGradient(0, 0, width, height);
      if (preset === 'midjourney') {
        grad.addColorStop(0, '#0C2340');
        grad.addColorStop(0.55, '#1D4E89');
        grad.addColorStop(1, '#78A2CC');
      } else if (preset === 'sdxl') {
        grad.addColorStop(0, '#0F172A');
        grad.addColorStop(0.5, '#1E3A5F');
        grad.addColorStop(1, '#60A5FA');
      } else {
        grad.addColorStop(0, '#102A43');
        grad.addColorStop(0.5, '#243B53');
        grad.addColorStop(1, '#486581');
      }
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Soft sun / moon orb
      ctx.beginPath();
      ctx.arc(width * 0.72, height * 0.32, 95, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(224, 242, 254, 0.22)';
      ctx.fill();

      ctx.beginPath();
      ctx.arc(width * 0.72, height * 0.32, 54, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(240, 249, 255, 0.75)';
      ctx.fill();

      // Layered serene horizon mountains / waves
      const drawWave = (yBase: number, amp: number, freq: number, color: string) => {
        ctx.beginPath();
        ctx.moveTo(0, height);
        for (let x = 0; x <= width; x += 16) {
          const y = yBase + Math.sin(x * freq + (preset === 'sdxl' ? 1.5 : 0.4)) * amp;
          ctx.lineTo(x, y);
        }
        ctx.lineTo(width, height);
        ctx.closePath();
        ctx.fillStyle = color;
        ctx.fill();
      };

      drawWave(height * 0.54, 38, 0.005, 'rgba(15, 37, 55, 0.38)');
      drawWave(height * 0.66, 26, 0.007, 'rgba(12, 29, 46, 0.62)');
      drawWave(height * 0.78, 16, 0.009, 'rgba(9, 21, 35, 0.85)');

      // Architectural grid lines
      ctx.strokeStyle = 'rgba(224, 242, 254, 0.14)';
      ctx.lineWidth = 1;
      for (let i = 1; i < 6; i++) {
        ctx.beginPath();
        ctx.moveTo(0, (height / 6) * i);
        ctx.lineTo(width, (height / 6) * i);
        ctx.stroke();
      }
    }

    const isPng = preset === 'sdxl';
    const mimeType = isPng ? 'image/png' : 'image/jpeg';
    const dataUrl = canvas.toDataURL(mimeType, 0.92);
    const base64 = dataUrl.split(',')[1];
    const binaryStr = atob(base64);
    const rawBytes = new Uint8Array(binaryStr.length);
    for (let i = 0; i < binaryStr.length; i++) {
      rawBytes[i] = binaryStr.charCodeAt(i);
    }

    const withMetadata = isPng
      ? writePngWithTags(rawBytes, tags)
      : writeJpegWithTags(rawBytes, tags);

    const blob = new Blob([withMetadata as unknown as BlobPart], { type: mimeType });
    const finalUrl = URL.createObjectURL(blob);

    return {
      fileName:
        preset === 'midjourney'
          ? 'midjourney_v6_aegean_pavilion.jpg'
          : preset === 'sdxl'
          ? 'sdxl_comfyui_nordic_fjord.png'
          : 'dalle3_c2pa_signed_concept.jpg',
      mimeType,
      bytes: withMetadata,
      dataUrl: finalUrl,
      width,
      height,
    };
  }

  // Fallback for Node test runner
  if (preset === 'sdxl') {
    const rawPng = createMinimalPngBytes();
    const bytes = writePngWithTags(rawPng, tags);
    return {
      fileName: 'sdxl_comfyui_nordic_fjord.png',
      mimeType: 'image/png',
      bytes,
      dataUrl: '',
      width: 1024,
      height: 768,
    };
  }

  const rawJpeg = createMinimalJpegBytes();
  const bytes = writeJpegWithTags(rawJpeg, tags);
  return {
    fileName:
      preset === 'midjourney'
        ? 'midjourney_v6_aegean_pavilion.jpg'
        : 'dalle3_c2pa_signed_concept.jpg',
    mimeType: 'image/jpeg',
    bytes,
    dataUrl: '',
    width: 1024,
    height: 768,
  };
}
