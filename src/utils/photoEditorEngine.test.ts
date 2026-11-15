import test from 'node:test';
import assert from 'node:assert/strict';
import {
  PHOTO_FILTERS,
  createDefaultPhotoEditState,
  computeTargetDimensions,
  computeAspectCropRect,
  clampCropRect,
  buildCompositeCssFilter,
  resolveOutputFormat,
  hasVisualOrFormatChanges,
} from './photoEditorEngine';

test('ships Original plus 10 distinct photo filters', () => {
  assert.equal(PHOTO_FILTERS.length, 11);
  assert.equal(PHOTO_FILTERS[0].id, 'original');
  const ids = new Set(PHOTO_FILTERS.map((f) => f.id));
  assert.equal(ids.size, 11);
});

test('computes 4K and 8K target dimensions preserving aspect ratio and rotation', () => {
  const state4k = createDefaultPhotoEditState(1200, 800);
  state4k.resolutionPreset = '4k';
  const res4k = computeTargetDimensions(1200, 800, state4k);
  assert.equal(res4k.width, 3840);
  assert.equal(res4k.height, 2560);

  const state8k = createDefaultPhotoEditState(1200, 800);
  state8k.resolutionPreset = '8k';
  state8k.rotation = 90;
  const res8k = computeTargetDimensions(1200, 800, state8k);
  // Rotated 90 deg -> portrait 800x1200 -> long edge is height 7680
  assert.equal(res8k.height, 7680);
  assert.equal(res8k.width, 5120);
});

test('computes centered aspect-ratio crop rectangles and clamps bounds', () => {
  const squareOnWide = computeAspectCropRect('1:1', 1600, 800);
  assert.equal(squareOnWide.height, 1);
  assert.equal(squareOnWide.width, 0.5);
  assert.equal(squareOnWide.x, 0.25);
  assert.equal(squareOnWide.y, 0);

  const clamped = clampCropRect({ x: 0.9, y: -0.2, width: 0.4, height: 0.01 });
  assert.equal(clamped.y, 0);
  assert.equal(clamped.height, 0.05);
  assert.ok(clamped.x + clamped.width <= 1);
});

test('builds composite CSS filter strings and detects visual/format changes', () => {
  const def = createDefaultPhotoEditState(1000, 1000);
  assert.equal(buildCompositeCssFilter(def), 'none');
  assert.equal(hasVisualOrFormatChanges(def, 'JPEG'), false);

  def.outputFormat = 'PNG';
  assert.equal(hasVisualOrFormatChanges(def, 'JPEG'), true);
  assert.equal(resolveOutputFormat('ORIGINAL', 'WEBP'), 'WEBP');
  assert.equal(resolveOutputFormat('ORIGINAL', 'UNKNOWN'), 'PNG');

  def.filterId = 'warm';
  def.brightness = 115;
  const css = buildCompositeCssFilter(def);
  assert.match(css, /sepia/);
  assert.match(css, /brightness\(1\.15\)/);
});
