import test from 'node:test';
import assert from 'node:assert/strict';
import {
  detectAiSignature,
  parseImageBinary,
  autoCleanMetadata,
  applyCameraProfileToTags,
  CAMERA_PROFILES,
  writeJpegWithTags,
  writePngWithTags,
} from './exifEngine';
import {
  createMinimalJpegBytes,
  createMinimalPngBytes,
  getSamplePresetTags,
} from './sampleGenerator';

test('detectAiSignature identifies Midjourney, Stable Diffusion, ComfyUI, C2PA, and expanded AI tools', () => {
  const mj = detectAiSignature('Software', 'Midjourney v6.1');
  assert.equal(mj.isAi, true);

  const sd = detectAiSignature('parameters', 'Steps: 30, Sampler: Euler a, CFG scale: 7.0');
  assert.equal(sd.isAi, true);

  const c2pa = detectAiSignature('UserComment', 'digitalSourceType: trainedAlgorithmicMedia');
  assert.equal(c2pa.isAi, true);

  const ms = detectAiSignature('Software', 'Microsoft Designer (MAI-Image)');
  assert.equal(ms.isAi, true);

  const meta = detectAiSignature('Software', 'Meta AI Imagine / Apple Image Playground');
  assert.equal(meta.isAi, true);

  const bedrock = detectAiSignature('UserComment', 'Amazon Titan & Nova Canvas (AWS Bedrock)');
  assert.equal(bedrock.isAi, true);

  const seedream = detectAiSignature('AIGC-Label', 'ByteDance Seedream / Recraft / Qwen-Image TC260');
  assert.equal(seedream.isAi, true);

  const swarm = detectAiSignature('sui_image_params', '{"prompt": "portrait", "fooocus": "v2.5"}');
  assert.equal(swarm.isAi, true);

  const camera = detectAiSignature('Make', 'Canon EOS R5');
  assert.equal(camera.isAi, false);
});

test('JPEG binary round-trip: embeds AI EXIF tags, parses them back, and auto-cleans AI traces', () => {
  const baseJpeg = createMinimalJpegBytes();
  const mjTags = getSamplePresetTags('midjourney');

  const encodedJpeg = writeJpegWithTags(baseJpeg, mjTags);
  const parsed = parseImageBinary(encodedJpeg);

  assert.equal(parsed.format, 'JPEG');
  const aiTags = parsed.tags.filter((t) => t.isAiTrace);
  assert.equal(aiTags.length, 4, 'Should detect all 4 embedded Midjourney AI EXIF tags including ImageDescription prompt');

  // Auto-clean the parsed tags and write back to binary JPEG
  const cleanedTags = autoCleanMetadata(parsed.tags);
  assert.equal(cleanedTags.some((t) => t.isAiTrace), false, 'Auto-cleaned tags must have zero AI traces');
  assert.equal(
    cleanedTags.some((t) => t.key === 'ImageDescription'),
    false,
    'Midjourney prompt in ImageDescription must be scrubbed'
  );

  const cleanedJpeg = writeJpegWithTags(encodedJpeg, cleanedTags);
  const reparsed = parseImageBinary(cleanedJpeg);
  assert.equal(
    reparsed.tags.filter((t) => t.isAiTrace).length,
    0,
    'Re-parsed JPEG binary must contain zero AI traces after cleaning'
  );
});

test('PNG binary round-trip: embeds Stable Diffusion tEXt parameters & eXIf, parses and scrubs them', () => {
  const basePng = createMinimalPngBytes();
  const sdTags = getSamplePresetTags('sdxl');

  const encodedPng = writePngWithTags(basePng, sdTags);
  const parsed = parseImageBinary(encodedPng);

  assert.equal(parsed.format, 'PNG');
  const hasParameters = parsed.tags.some((t) => t.key === 'parameters' && t.isAiTrace);
  assert.equal(hasParameters, true, 'Should parse PNG tEXt parameters chunk as AI trace');

  // Apply Sony A7R V camera profile and rewrite PNG
  const sonyProfile = CAMERA_PROFILES[0];
  const profileTags = applyCameraProfileToTags(parsed.tags, sonyProfile, '2026-11-14T10:30:00Z');
  const rewrittenPng = writePngWithTags(encodedPng, profileTags);

  const reparsed = parseImageBinary(rewrittenPng);
  assert.equal(reparsed.tags.some((t) => t.isAiTrace), false, 'Rewritten PNG should have no AI traces');
  assert.equal(
    reparsed.tags.some((t) => t.key === 'Make' && t.value === 'SONY'),
    true,
    'Rewritten PNG should contain SONY Make tag in eXIf'
  );
});

test('CAMERA_PROFILES includes Nikon D7000, Huawei Pura 90, and Samsung Galaxy S26 and applies them cleanly', () => {
  const nikon = CAMERA_PROFILES.find((p) => p.id === 'nikon-d7000');
  const huawei = CAMERA_PROFILES.find((p) => p.id === 'huawei-pura-90');
  const samsung = CAMERA_PROFILES.find((p) => p.id === 'samsung-galaxy-s26');

  assert.ok(nikon, 'Nikon D7000 profile should exist');
  assert.ok(huawei, 'Huawei Pura 90 profile should exist');
  assert.ok(samsung, 'Samsung Galaxy S26 profile should exist');

  const baseJpeg = createMinimalJpegBytes();
  const dalleTags = getSamplePresetTags('dalle');
  const updatedTags = applyCameraProfileToTags(dalleTags, nikon);

  const rewrittenJpeg = writeJpegWithTags(baseJpeg, updatedTags);
  const reparsed = parseImageBinary(rewrittenJpeg);

  assert.equal(reparsed.tags.some((t) => t.isAiTrace), false);
  assert.equal(
    reparsed.tags.some((t) => t.key === 'Model' && t.value === 'NIKON D7000'),
    true
  );
});

test('JPEG APP11 (0xFFEB JUMBF C2PA) segment is detected and physically stripped during cleaning', () => {
  const baseJpeg = createMinimalJpegBytes();
  // Inject a synthetic 0xFF 0xEB (APP11 JUMBF/C2PA) segment right after SOI (0xFFD8)
  const payload = new TextEncoder().encode('jumb jumdc2pa urn:c2pa:microsoft-mai-image');
  const segLen = 2 + payload.length;
  const app11 = new Uint8Array(2 + segLen);
  app11[0] = 0xff;
  app11[1] = 0xeb;
  app11[2] = (segLen >> 8) & 0xff;
  app11[3] = segLen & 0xff;
  app11.set(payload, 4);

  const jpegWithApp11 = new Uint8Array(baseJpeg.length + app11.length);
  jpegWithApp11.set(baseJpeg.subarray(0, 2), 0);
  jpegWithApp11.set(app11, 2);
  jpegWithApp11.set(baseJpeg.subarray(2), 2 + app11.length);

  const parsed = parseImageBinary(jpegWithApp11);
  assert.equal(
    parsed.tags.some((t) => t.key === 'C2PA_ContentCredentials' && t.isAiTrace),
    true,
    'Should detect JPEG APP11 C2PA segment'
  );

  const cleanedTags = autoCleanMetadata(parsed.tags);
  const scrubbedJpeg = writeJpegWithTags(jpegWithApp11, cleanedTags);
  const reparsed = parseImageBinary(scrubbedJpeg);

  assert.equal(
    reparsed.tags.some((t) => t.key === 'C2PA_ContentCredentials'),
    false,
    'APP11 C2PA segment must be physically removed from output JPEG binary'
  );
});
