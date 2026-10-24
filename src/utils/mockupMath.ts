import { PlacementPreset, ProductType, BlendMode, ResolutionOption } from '../types/mockup';

/**
 * Clamps a number between min and max.
 */
export function clamp(val: number, min: number, max: number): number {
  return Math.min(Math.max(val, min), max);
}

/**
 * Calculates perceived brightness / luminance from a hex color string (0 to 1).
 */
export function getHexLuminance(hex: string): number {
  const cleanHex = hex.replace('#', '');
  if (cleanHex.length !== 6) return 0.5;
  const r = parseInt(cleanHex.substring(0, 2), 16) / 255;
  const g = parseInt(cleanHex.substring(2, 4), 16) / 255;
  const b = parseInt(cleanHex.substring(4, 6), 16) / 255;
  // Standard perceived luminance weights rounded to avoid floating point precision issues
  return Math.round((0.299 * r + 0.587 * g + 0.114 * b) * 1000) / 1000;
}

/**
 * Recommends optimal blend mode for printing onto a product color.
 * Dark colors benefit from normal or screen; light colors blend naturally with multiply.
 */
export function recommendBlendMode(hexColor: string): BlendMode {
  const luminance = getHexLuminance(hexColor);
  if (luminance > 0.65) {
    return 'multiply'; // ink sinks naturally into light cotton / ceramic
  } else if (luminance < 0.25) {
    return 'normal'; // avoid disappearing on black
  }
  return 'multiply';
}

/**
 * Calculates preset placement offsets and scale for each product type.
 */
export function getPlacementPreset(
  preset: PlacementPreset,
  product: ProductType
): { x: number; y: number; scale: number } {
  switch (preset) {
    case 'pocket':
      if (product === 'tshirt' || product === 'hoodie') {
        return { x: 28, y: -22, scale: 0.5 };
      }
      return { x: 20, y: -15, scale: 0.55 };

    case 'large':
      if (product === 'mug') {
        return { x: 0, y: 0, scale: 1.45 };
      }
      if (product === 'cap') {
        return { x: 0, y: -5, scale: 1.1 };
      }
      return { x: 0, y: 4, scale: 1.6 };

    case 'subtle':
      return { x: 0, y: -4, scale: 0.65 };

    case 'wrap':
      if (product === 'mug') {
        return { x: 0, y: 2, scale: 1.6 };
      }
      return { x: 0, y: 0, scale: 1.3 };

    case 'center':
    default:
      if (product === 'cap') {
        return { x: 0, y: -8, scale: 0.85 };
      }
      if (product === 'mug') {
        return { x: 0, y: 2, scale: 0.95 };
      }
      return { x: 0, y: 0, scale: 1.0 };
  }
}

/**
 * Calculates cylindrical perspective compression for mug wrapping.
 * Items near the edges compress horizontally to mimic curvature.
 */
export function computeCylindricalTransform(
  xPercent: number,
  baseScale: number
): { scaleX: number; skewY: number; opacityMultiplier: number } {
  const normX = clamp(xPercent / 50, -1, 1);
  const cosFactor = Math.cos((normX * Math.PI) / 2.6);
  const scaleX = clamp(baseScale * cosFactor, 0.2, 2.5);
  const skewY = normX * 4.5; // slight tilt on cylinder horizon
  const opacityMultiplier = 0.8 + 0.2 * cosFactor;
  return { scaleX, skewY, opacityMultiplier };
}

/**
 * Validates resolution string for AI generation.
 */
export function isValidResolution(res: string): res is ResolutionOption {
  return res === '1K' || res === '2K' || res === '4K';
}

/**
 * Formats a descriptive prompt for AI image generation.
 */
export function formatAIPromptForMockup(
  userPrompt: string,
  productType: ProductType,
  colorName: string
): string {
  const productTerms: Record<ProductType, string> = {
    mug: 'ceramic coffee mug with smooth glossy finish',
    tshirt: 'cotton crewneck t-shirt with soft fabric drape',
    hoodie: 'heavyweight streetwear pullover hoodie',
    totebag: 'natural woven canvas tote bag with sturdy handles',
    cap: 'structured baseball cap dad hat with curved visor',
    phonecase: 'matte slim protective smartphone case'
  };

  const productTerm = productTerms[productType] || 'merchandise item';
  return `A high-end commercial studio product photography shot of a ${colorName} ${productTerm}. ${userPrompt.trim()}. Studio lighting, pristine clean background, ultra-crisp detail, commercial mockup presentation.`;
}
