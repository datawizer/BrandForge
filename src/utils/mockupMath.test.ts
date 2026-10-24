import test from 'node:test';
import assert from 'node:assert/strict';
import {
  clamp,
  getHexLuminance,
  recommendBlendMode,
  getPlacementPreset,
  computeCylindricalTransform,
  isValidResolution,
  formatAIPromptForMockup
} from './mockupMath';

test('clamp restricts numbers within bounds', () => {
  assert.equal(clamp(15, 0, 10), 10);
  assert.equal(clamp(-5, 0, 10), 0);
  assert.equal(clamp(5, 0, 10), 5);
});

test('getHexLuminance accurately measures brightness', () => {
  assert.equal(getHexLuminance('#ffffff'), 1);
  assert.equal(getHexLuminance('#000000'), 0);
  // Pure green has higher luminance than pure blue
  const greenLum = getHexLuminance('#00ff00');
  const blueLum = getHexLuminance('#0000ff');
  assert.ok(greenLum > blueLum);
});

test('recommendBlendMode suggests multiply for light and normal for dark colors', () => {
  assert.equal(recommendBlendMode('#ffffff'), 'multiply');
  assert.equal(recommendBlendMode('#f5f5f5'), 'multiply');
  assert.equal(recommendBlendMode('#111111'), 'normal');
  assert.equal(recommendBlendMode('#0a0a0a'), 'normal');
});

test('getPlacementPreset returns appropriate coordinates per product', () => {
  const tshirtPocket = getPlacementPreset('pocket', 'tshirt');
  assert.ok(tshirtPocket.x > 0); // pocket is shifted to one side
  assert.ok(tshirtPocket.scale < 1.0); // smaller scale

  const mugWrap = getPlacementPreset('wrap', 'mug');
  assert.equal(mugWrap.x, 0);
  assert.ok(mugWrap.scale > 1.2);
});

test('computeCylindricalTransform simulates barrel curvature', () => {
  const centerTransform = computeCylindricalTransform(0, 1);
  assert.equal(centerTransform.skewY, 0);
  assert.ok(centerTransform.scaleX >= 0.99);

  const edgeTransform = computeCylindricalTransform(45, 1);
  assert.ok(edgeTransform.scaleX < centerTransform.scaleX); // compressed at edge
  assert.ok(edgeTransform.skewY > 0); // tilted on edge
});

test('isValidResolution accepts 1K, 2K, 4K', () => {
  assert.equal(isValidResolution('1K'), true);
  assert.equal(isValidResolution('2K'), true);
  assert.equal(isValidResolution('4K'), true);
  assert.equal(isValidResolution('8K'), false);
  assert.equal(isValidResolution(''), false);
});

test('formatAIPromptForMockup embeds product term and user prompt', () => {
  const prompt = formatAIPromptForMockup('holding hot matcha latte', 'mug', 'Snow White');
  assert.ok(prompt.includes('ceramic coffee mug'));
  assert.ok(prompt.includes('holding hot matcha latte'));
  assert.ok(prompt.includes('Snow White'));
});
