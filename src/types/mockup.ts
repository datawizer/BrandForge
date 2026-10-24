export type ProductType = 'mug' | 'tshirt' | 'hoodie' | 'totebag' | 'cap' | 'phonecase';

export type BlendMode = 'normal' | 'multiply' | 'screen' | 'overlay' | 'darken';

export type PlacementPreset = 'center' | 'pocket' | 'large' | 'subtle' | 'wrap';

export interface MockupConfig {
  productType: ProductType;
  productColor: string; // Hex color
  logoUrl: string;
  logoScale: number; // 0.2 to 2.5 (1 = standard)
  logoX: number; // -100 to 100 (%)
  logoY: number; // -100 to 100 (%)
  logoRotation: number; // -180 to 180 degrees
  logoOpacity: number; // 0 to 100
  blendMode: BlendMode;
  displacementDepth: number; // 0 to 100 (wrinkle/curve warp)
  lightingHighlight: number; // 0 to 100 (specular sheen)
  shadowIntensity: number; // 0 to 100
  invertLogo: boolean;
  monochromeColor?: string | null;
}

export interface SampleLogo {
  id: string;
  name: string;
  category: string;
  svgDataUri: string;
}

export type ResolutionOption = '1K' | '2K' | '4K';

export interface AIGenerateParams {
  prompt: string;
  imageSize: ResolutionOption;
  aspectRatio: '1:1' | '3:4' | '4:3' | '16:9';
  stylePreset?: string;
}

export interface AIEditParams {
  prompt: string;
  imageBase64: string;
  mimeType: string;
  imageSize: ResolutionOption;
}

export interface ProductDefinition {
  id: ProductType;
  name: string;
  category: string;
  tagline: string;
  defaultColor: string;
  palette: { name: string; hex: string }[];
  printableArea: {
    x: number; // % from left
    y: number; // % from top
    width: number; // % width
    height: number; // % height
    cylinderCurve?: boolean;
    hasFabricWrinkles?: boolean;
  };
}
