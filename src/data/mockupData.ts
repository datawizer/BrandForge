import { ProductDefinition, SampleLogo } from '../types/mockup';

export const SAMPLE_LOGOS: SampleLogo[] = [
  {
    id: 'cyber-wolf',
    name: 'Apex Robotics',
    category: 'Tech & Modern',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" fill="none">
        <circle cx="150" cy="150" r="140" fill="#0f172a" stroke="#38bdf8" stroke-width="6"/>
        <polygon points="150,45 220,120 190,210 150,185 110,210 80,120" fill="none" stroke="#38bdf8" stroke-width="8" stroke-linejoin="round"/>
        <polygon points="150,75 195,125 175,185 150,170 125,185 105,125" fill="#38bdf8" opacity="0.3"/>
        <circle cx="130" cy="125" r="8" fill="#38bdf8"/>
        <circle cx="170" cy="125" r="8" fill="#38bdf8"/>
        <text x="150" y="255" text-anchor="middle" fill="#f8fafc" font-family="'Space Grotesk', sans-serif" font-weight="700" font-size="22" letter-spacing="4">APEX LABS</text>
      </svg>
    `)}`
  },
  {
    id: 'nordic-brew',
    name: 'Nordic Roasters',
    category: 'Artisan Cafe',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" fill="none">
        <rect width="300" height="300" rx="30" fill="none"/>
        <circle cx="150" cy="150" r="125" stroke="#78350f" stroke-width="7" stroke-dasharray="10 6"/>
        <path d="M115,150 C115,110 150,90 150,90 C150,90 185,110 185,150 C185,190 150,210 150,210 C150,210 115,190 115,150 Z" fill="#92400e"/>
        <path d="M150,95 Q140,150 150,205" stroke="#fef3c7" stroke-width="5" stroke-linecap="round"/>
        <path d="M130,130 Q145,145 130,165" stroke="#fef3c7" stroke-width="4" stroke-linecap="round"/>
        <text x="150" y="70" text-anchor="middle" fill="#78350f" font-family="sans-serif" font-weight="800" font-size="16" letter-spacing="5">NORDIC ROAST</text>
        <text x="150" y="245" text-anchor="middle" fill="#78350f" font-family="sans-serif" font-weight="700" font-size="14" letter-spacing="3">EST. 2024</text>
      </svg>
    `)}`
  },
  {
    id: 'wild-mountain',
    name: 'Alpine Outfitters',
    category: 'Outdoor & Gear',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" fill="none">
        <circle cx="150" cy="150" r="130" fill="#064e3b" stroke="#34d399" stroke-width="5"/>
        <polygon points="150,60 230,200 70,200" fill="#047857"/>
        <polygon points="150,60 185,120 160,115 150,130 140,115 115,120" fill="#ecfdf5"/>
        <polygon points="190,130 250,210 130,210" fill="#065f46" opacity="0.8"/>
        <polygon points="190,130 215,170 195,165 190,175 180,165 165,170" fill="#ecfdf5"/>
        <text x="150" y="250" text-anchor="middle" fill="#ecfdf5" font-family="sans-serif" font-weight="800" font-size="18" letter-spacing="4">HIGHLAND CO.</text>
      </svg>
    `)}`
  },
  {
    id: 'minimal-zenith',
    name: 'Zenith Studio',
    category: 'Minimal Luxury',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" fill="none">
        <circle cx="150" cy="150" r="130" stroke="#000000" stroke-width="8"/>
        <circle cx="150" cy="150" r="85" stroke="#000000" stroke-width="4"/>
        <line x1="40" y1="150" x2="260" y2="150" stroke="#000000" stroke-width="4"/>
        <line x1="150" y1="40" x2="150" y2="260" stroke="#000000" stroke-width="4"/>
        <rect x="125" y="125" width="50" height="50" fill="#000000" transform="rotate(45 150 150)"/>
        <text x="150" y="220" text-anchor="middle" fill="#000000" font-family="sans-serif" font-weight="700" font-size="18" letter-spacing="6">ZENITH</text>
      </svg>
    `)}`
  },
  {
    id: 'street-vibes',
    name: 'Vortex Skatewear',
    category: 'Streetwear',
    svgDataUri: `data:image/svg+xml;utf8,${encodeURIComponent(`
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 300" fill="none">
        <polygon points="150,20 280,260 20,260" stroke="#e11d48" stroke-width="12" stroke-linejoin="round"/>
        <path d="M150,80 L220,210 L80,210 Z" fill="#e11d48"/>
        <circle cx="150" cy="170" r="25" fill="#ffffff"/>
        <line x1="150" y1="100" x2="150" y2="190" stroke="#ffffff" stroke-width="6"/>
        <text x="150" y="288" text-anchor="middle" fill="#e11d48" font-family="'Space Grotesk', sans-serif" font-weight="900" font-size="22" letter-spacing="5">VORTEX</text>
      </svg>
    `)}`
  }
];

export const PRODUCTS: ProductDefinition[] = [
  {
    id: 'mug',
    name: 'Ceramic Mug',
    category: 'Drinkware',
    tagline: '11oz High-Gloss Ceramic with Cylindrical Wrap',
    defaultColor: '#f8fafc',
    palette: [
      { name: 'Pure White', hex: '#ffffff' },
      { name: 'Onyx Black', hex: '#1e293b' },
      { name: 'Clay Terracotta', hex: '#c2410c' },
      { name: 'Matcha Cream', hex: '#dcfce7' },
      { name: 'Warm Sand', hex: '#fef3c7' },
      { name: 'Nordic Slate', hex: '#475569' }
    ],
    printableArea: {
      x: 34,
      y: 35,
      width: 32,
      height: 32,
      cylinderCurve: true
    }
  },
  {
    id: 'tshirt',
    name: 'Classic Crewneck T-Shirt',
    category: 'Apparel',
    tagline: '100% Ring-Spun Cotton with Realistic Fabric Folds',
    defaultColor: '#f1f5f9',
    palette: [
      { name: 'Crisp White', hex: '#ffffff' },
      { name: 'Washed Black', hex: '#18181b' },
      { name: 'Heather Grey', hex: '#cbd5e1' },
      { name: 'Vintage Sage', hex: '#84a98c' },
      { name: 'Midnight Navy', hex: '#1e3a8a' },
      { name: 'Desert Oat', hex: '#e2d5c3' }
    ],
    printableArea: {
      x: 35,
      y: 28,
      width: 30,
      height: 38,
      hasFabricWrinkles: true
    }
  },
  {
    id: 'hoodie',
    name: 'Streetwear Heavy Hoodie',
    category: 'Apparel',
    tagline: 'Heavyweight Fleece with Front Kangaroo Pocket',
    defaultColor: '#18181b',
    palette: [
      { name: 'Pitch Black', hex: '#18181b' },
      { name: 'Ash Melange', hex: '#94a3b8' },
      { name: 'Oatmeal Milk', hex: '#f5f5f4' },
      { name: 'Forest Pine', hex: '#14532d' },
      { name: 'Oxblood Maroon', hex: '#831843' }
    ],
    printableArea: {
      x: 35,
      y: 30,
      width: 30,
      height: 34,
      hasFabricWrinkles: true
    }
  },
  {
    id: 'totebag',
    name: 'Canvas Market Tote',
    category: 'Accessories',
    tagline: 'Natural Organic Heavy Canvas Bag',
    defaultColor: '#fef3c7',
    palette: [
      { name: 'Natural Ecru', hex: '#fef3c7' },
      { name: 'Washed Charcoal', hex: '#334155' },
      { name: 'Olive Drab', hex: '#4d7c0f' },
      { name: 'Rust Sienna', hex: '#9a3412' }
    ],
    printableArea: {
      x: 33,
      y: 42,
      width: 34,
      height: 36,
      hasFabricWrinkles: true
    }
  },
  {
    id: 'cap',
    name: 'Classic Dad Cap',
    category: 'Headwear',
    tagline: 'Structured 6-Panel Low Profile Cotton Cap',
    defaultColor: '#475569',
    palette: [
      { name: 'Washed Slate', hex: '#475569' },
      { name: 'Sand Khaki', hex: '#d6d3d1' },
      { name: 'Stealth Black', hex: '#0f172a' },
      { name: 'Heritage Forest', hex: '#166534' }
    ],
    printableArea: {
      x: 36,
      y: 38,
      width: 28,
      height: 22
    }
  },
  {
    id: 'phonecase',
    name: 'Impact Phone Case',
    category: 'Tech Accessories',
    tagline: 'Slim Polycarbonate with Edge Shock Protection',
    defaultColor: '#0f172a',
    palette: [
      { name: 'Matte Obsidian', hex: '#0f172a' },
      { name: 'Frost White', hex: '#f8fafc' },
      { name: 'Lilac Mist', hex: '#e9d5ff' },
      { name: 'Cyber Neon', hex: '#06b6d4' }
    ],
    printableArea: {
      x: 32,
      y: 32,
      width: 36,
      height: 50
    }
  }
];
