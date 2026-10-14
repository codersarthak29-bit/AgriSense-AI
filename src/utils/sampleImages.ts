/**
 * High-quality embedded leaf SVG sample data URIs for instant testing.
 * Allows immediate demonstration of early blight, common rust, late blight, and healthy foliage.
 */

function createLeafSvg(type: 'early_blight' | 'common_rust' | 'late_blight' | 'healthy'): string {
  let content = '';

  if (type === 'healthy') {
    content = `
      <defs>
        <radialGradient id="healthyGrad" cx="40%" cy="40%" r="70%">
          <stop offset="0%" stop-color="#4ade80"/>
          <stop offset="60%" stop-color="#16a34a"/>
          <stop offset="100%" stop-color="#14532d"/>
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="#f1f5f9"/>
      <!-- Healthy Leaf Blade -->
      <path d="M 200 40 C 310 100, 360 250, 200 370 C 40 250, 90 100, 200 40 Z" fill="url(#healthyGrad)" stroke="#15803d" stroke-width="2"/>
      <!-- Main Venation -->
      <path d="M 200 40 Q 200 200, 200 370" stroke="#86efac" stroke-width="5" stroke-linecap="round"/>
      <!-- Lateral Veins -->
      <path d="M 200 120 Q 250 100, 290 120" stroke="#86efac" stroke-width="2.5" fill="none"/>
      <path d="M 200 120 Q 150 100, 110 120" stroke="#86efac" stroke-width="2.5" fill="none"/>
      <path d="M 200 190 Q 260 170, 305 200" stroke="#86efac" stroke-width="2.5" fill="none"/>
      <path d="M 200 190 Q 140 170, 95 200" stroke="#86efac" stroke-width="2.5" fill="none"/>
      <path d="M 200 260 Q 250 240, 290 270" stroke="#86efac" stroke-width="2.5" fill="none"/>
      <path d="M 200 260 Q 150 240, 110 270" stroke="#86efac" stroke-width="2.5" fill="none"/>
      <!-- Sub-veins -->
      <path d="M 240 110 Q 260 90, 280 95" stroke="#bbf7d0" stroke-width="1.5" fill="none"/>
      <path d="M 160 110 Q 140 90, 120 95" stroke="#bbf7d0" stroke-width="1.5" fill="none"/>
    `;
  } else if (type === 'early_blight') {
    content = `
      <defs>
        <radialGradient id="ebLeafGrad" cx="40%" cy="40%" r="70%">
          <stop offset="0%" stop-color="#86efac"/>
          <stop offset="50%" stop-color="#22c55e"/>
          <stop offset="100%" stop-color="#15803d"/>
        </radialGradient>
        <radialGradient id="targetHalo" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stop-color="#3e1a05"/>
          <stop offset="35%" stop-color="#713f12"/>
          <stop offset="70%" stop-color="#ca8a04"/>
          <stop offset="100%" stop-color="#fef08a" stop-opacity="0.8"/>
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="#f8fafc"/>
      <!-- Leaf Blade -->
      <path d="M 200 40 C 310 100, 360 250, 200 370 C 40 250, 90 100, 200 40 Z" fill="url(#ebLeafGrad)" stroke="#166534" stroke-width="2"/>
      <!-- Main Venation -->
      <path d="M 200 40 Q 200 200, 200 370" stroke="#bbf7d0" stroke-width="4.5" stroke-linecap="round"/>
      <path d="M 200 140 Q 260 120, 290 140" stroke="#bbf7d0" stroke-width="2.2" fill="none"/>
      <path d="M 200 140 Q 140 120, 110 140" stroke="#bbf7d0" stroke-width="2.2" fill="none"/>
      <path d="M 200 230 Q 250 210, 295 240" stroke="#bbf7d0" stroke-width="2.2" fill="none"/>
      
      <!-- Alternaria Solani Concentric Ring Lesion 1 (Large Target Spot) -->
      <ellipse cx="250" cy="180" rx="42" ry="38" fill="url(#targetHalo)"/>
      <circle cx="250" cy="180" r="32" fill="none" stroke="#291305" stroke-width="2.5" opacity="0.8"/>
      <circle cx="250" cy="180" r="22" fill="none" stroke="#451a03" stroke-width="2" opacity="0.9"/>
      <circle cx="250" cy="180" r="12" fill="#1c0b02"/>
      
      <!-- Alternaria Solani Concentric Ring Lesion 2 (Medium) -->
      <ellipse cx="140" cy="240" rx="32" ry="28" fill="url(#targetHalo)"/>
      <circle cx="140" cy="240" r="22" fill="none" stroke="#291305" stroke-width="2"/>
      <circle cx="140" cy="240" r="14" fill="none" stroke="#451a03" stroke-width="1.8"/>
      <circle cx="140" cy="240" r="7" fill="#1c0b02"/>
      
      <!-- Smaller secondary lesions -->
      <circle cx="170" cy="130" r="14" fill="#713f12" stroke="#facc15" stroke-width="2"/>
      <circle cx="170" cy="130" r="6" fill="#1c0b02"/>
      <circle cx="270" cy="270" r="16" fill="#713f12" stroke="#facc15" stroke-width="2"/>
      <circle cx="270" cy="270" r="8" fill="#1c0b02"/>
      
      <!-- Chlorotic yellow margin -->
      <path d="M 280 200 Q 320 230, 310 270 Q 280 260, 280 200 Z" fill="#eab308" opacity="0.5"/>
    `;
  } else if (type === 'common_rust') {
    content = `
      <defs>
        <linearGradient id="cornBlade" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stop-color="#15803d"/>
          <stop offset="30%" stop-color="#4ade80"/>
          <stop offset="70%" stop-color="#4ade80"/>
          <stop offset="100%" stop-color="#15803d"/>
        </linearGradient>
      </defs>
      <rect width="400" height="400" fill="#f8fafc"/>
      <!-- Long Corn Leaf Blade -->
      <path d="M 120 20 C 130 180, 110 320, 140 380 L 260 380 C 290 320, 270 180, 280 20 Z" fill="url(#cornBlade)" stroke="#166534" stroke-width="2"/>
      <!-- Corn Parallel Veins -->
      <line x1="200" y1="20" x2="200" y2="380" stroke="#bbf7d0" stroke-width="4"/>
      <line x1="170" y1="20" x2="170" y2="380" stroke="#86efac" stroke-width="1.5"/>
      <line x1="230" y1="20" x2="230" y2="380" stroke="#86efac" stroke-width="1.5"/>
      <line x1="145" y1="20" x2="145" y2="380" stroke="#86efac" stroke-width="1.5"/>
      <line x1="255" y1="20" x2="255" y2="380" stroke="#86efac" stroke-width="1.5"/>

      <!-- Puccinia sorghi Cinnamon Rust Pustules -->
      <ellipse cx="180" cy="110" rx="14" ry="7" fill="#b45309" stroke="#78350f" stroke-width="1.5"/>
      <ellipse cx="225" cy="140" rx="16" ry="8" fill="#b45309" stroke="#78350f" stroke-width="1.5"/>
      <ellipse cx="165" cy="175" rx="15" ry="7" fill="#b45309" stroke="#78350f" stroke-width="1.5"/>
      <ellipse cx="235" cy="195" rx="18" ry="8" fill="#d97706" stroke="#92400e" stroke-width="1.5"/>
      <ellipse cx="185" cy="240" rx="16" ry="9" fill="#92400e" stroke="#78350f" stroke-width="1.5"/>
      <ellipse cx="150" cy="280" rx="14" ry="7" fill="#b45309" stroke="#78350f" stroke-width="1.5"/>
      <ellipse cx="220" cy="300" rx="15" ry="8" fill="#b45309" stroke="#78350f" stroke-width="1.5"/>
      <ellipse cx="190" cy="340" rx="12" ry="6" fill="#b45309" stroke="#78350f" stroke-width="1.5"/>
      
      <!-- Chlorotic Halos around pustules -->
      <ellipse cx="180" cy="110" rx="19" ry="11" fill="none" stroke="#fef08a" stroke-width="1.2" opacity="0.7"/>
      <ellipse cx="225" cy="140" rx="22" ry="12" fill="none" stroke="#fef08a" stroke-width="1.2" opacity="0.7"/>
      <ellipse cx="165" cy="175" rx="20" ry="11" fill="none" stroke="#fef08a" stroke-width="1.2" opacity="0.7"/>
      <ellipse cx="235" cy="195" rx="24" ry="13" fill="none" stroke="#fef08a" stroke-width="1.2" opacity="0.7"/>
    `;
  } else if (type === 'late_blight') {
    content = `
      <defs>
        <radialGradient id="lbLeaf" cx="50%" cy="40%" r="65%">
          <stop offset="0%" stop-color="#4ade80"/>
          <stop offset="60%" stop-color="#15803d"/>
          <stop offset="100%" stop-color="#0f391b"/>
        </radialGradient>
      </defs>
      <rect width="400" height="400" fill="#f8fafc"/>
      <!-- Potato Leaf Lobe -->
      <path d="M 200 45 C 310 90, 350 240, 200 365 C 50 240, 90 90, 200 45 Z" fill="url(#lbLeaf)" stroke="#166534" stroke-width="2"/>
      <path d="M 200 45 Q 200 200, 200 365" stroke="#86efac" stroke-width="4.5"/>
      <path d="M 200 130 Q 250 110, 285 130" stroke="#86efac" stroke-width="2.2" fill="none"/>
      <path d="M 200 130 Q 150 110, 115 130" stroke="#86efac" stroke-width="2.2" fill="none"/>
      
      <!-- Water-soaked expanding dark lesion on tip and margin (Phytophthora infestans) -->
      <path d="M 200 45 C 260 65, 290 120, 250 150 C 210 130, 150 120, 160 70 Z" fill="#262626" stroke="#404040" stroke-width="2"/>
      <!-- Pale water-soaked transition zone -->
      <path d="M 250 150 Q 220 180, 180 150 Q 150 120, 160 70" fill="none" stroke="#a3e635" stroke-width="6" opacity="0.6"/>
      
      <!-- Secondary lateral water-soaked dark lesion -->
      <path d="M 280 200 C 340 230, 310 300, 260 270 C 250 230, 260 210, 280 200 Z" fill="#1c1917" stroke="#292524" stroke-width="2"/>
      
      <!-- White mildew sporulation zone at margin of lesion -->
      <circle cx="215" cy="120" r="3" fill="#ffffff" opacity="0.8"/>
      <circle cx="225" cy="130" r="2.5" fill="#ffffff" opacity="0.8"/>
      <circle cx="205" cy="110" r="2" fill="#ffffff" opacity="0.8"/>
      <circle cx="235" cy="140" r="3" fill="#ffffff" opacity="0.8"/>
      <circle cx="265" cy="245" r="2.5" fill="#ffffff" opacity="0.8"/>
      <circle cx="275" cy="255" r="3" fill="#ffffff" opacity="0.8"/>
    `;
  }

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 400" width="400" height="400">${content}</svg>`;
  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}

export interface SampleLeaf {
  id: string;
  name: string;
  crop: string;
  expectedDisease: string;
  severity: string;
  description: string;
  dataUri: string;
  fileName: string;
}

export const SAMPLE_LEAVES: SampleLeaf[] = [
  {
    id: 'sample-early-blight',
    name: 'Tomato — Early Blight',
    crop: 'Tomato',
    expectedDisease: 'Early Blight (Alternaria solani)',
    severity: 'Moderate',
    description: 'Characteristic concentric target-like rings with yellow chlorotic margin.',
    dataUri: createLeafSvg('early_blight'),
    fileName: 'tomato_early_blight_sample.svg'
  },
  {
    id: 'sample-common-rust',
    name: 'Corn — Common Rust',
    crop: 'Corn (Maize)',
    expectedDisease: 'Common Rust (Puccinia sorghi)',
    severity: 'Low',
    description: 'Elongate cinnamon-brown powdery pustules on corn leaf blade.',
    dataUri: createLeafSvg('common_rust'),
    fileName: 'corn_common_rust_sample.svg'
  },
  {
    id: 'sample-late-blight',
    name: 'Potato — Late Blight',
    crop: 'Potato',
    expectedDisease: 'Late Blight (Phytophthora infestans)',
    severity: 'Severe',
    description: 'Rapidly spreading dark water-soaked lesion with pale halo.',
    dataUri: createLeafSvg('late_blight'),
    fileName: 'potato_late_blight_sample.svg'
  },
  {
    id: 'sample-healthy',
    name: 'Tomato — Healthy Foliage',
    crop: 'Tomato',
    expectedDisease: 'Healthy',
    severity: 'None (Healthy)',
    description: 'Vibrant deep-green leaf blade without chlorosis, spots, or rot.',
    dataUri: createLeafSvg('healthy'),
    fileName: 'tomato_healthy_sample.svg'
  }
];
