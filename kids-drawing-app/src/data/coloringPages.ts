export type ColoringPageData = {
  id: string;
  name: string;
  emoji: string;
  svgData: string;
};

// Each svgData is the inner content of an SVG (paths/shapes) drawn as black outlines
// The viewBox is 300x300, strokes are thick for kid-friendly coloring
export const COLORING_PAGES: ColoringPageData[] = [
  {
    id: 'sun',
    name: 'Happy Sun',
    emoji: '☀️',
    svgData: `
      <circle cx="150" cy="150" r="55" fill="none" stroke="black" stroke-width="6"/>
      <circle cx="150" cy="90" r="10" fill="none" stroke="black" stroke-width="5"/>
      <circle cx="150" cy="210" r="10" fill="none" stroke="black" stroke-width="5"/>
      <circle cx="90" cy="150" r="10" fill="none" stroke="black" stroke-width="5"/>
      <circle cx="210" cy="150" r="10" fill="none" stroke="black" stroke-width="5"/>
      <circle cx="107" cy="107" r="10" fill="none" stroke="black" stroke-width="5"/>
      <circle cx="193" cy="107" r="10" fill="none" stroke="black" stroke-width="5"/>
      <circle cx="107" cy="193" r="10" fill="none" stroke="black" stroke-width="5"/>
      <circle cx="193" cy="193" r="10" fill="none" stroke="black" stroke-width="5"/>
      <line x1="150" y1="95" x2="150" y2="110" stroke="black" stroke-width="5" stroke-linecap="round"/>
      <line x1="150" y1="205" x2="150" y2="190" stroke="black" stroke-width="5" stroke-linecap="round"/>
      <line x1="95" y1="150" x2="110" y2="150" stroke="black" stroke-width="5" stroke-linecap="round"/>
      <line x1="205" y1="150" x2="190" y2="150" stroke="black" stroke-width="5" stroke-linecap="round"/>
      <line x1="112" y1="112" x2="122" y2="122" stroke="black" stroke-width="5" stroke-linecap="round"/>
      <line x1="188" y1="112" x2="178" y2="122" stroke="black" stroke-width="5" stroke-linecap="round"/>
      <line x1="112" y1="188" x2="122" y2="178" stroke="black" stroke-width="5" stroke-linecap="round"/>
      <line x1="188" y1="188" x2="178" y2="178" stroke="black" stroke-width="5" stroke-linecap="round"/>
      <circle cx="135" cy="145" r="8" fill="black"/>
      <circle cx="165" cy="145" r="8" fill="black"/>
      <path d="M 130 165 Q 150 180 170 165" fill="none" stroke="black" stroke-width="5" stroke-linecap="round"/>
    `,
  },
  {
    id: 'star',
    name: 'Big Star',
    emoji: '⭐',
    svgData: `
      <polygon
        points="150,40 178,120 265,120 197,168 222,250 150,202 78,250 103,168 35,120 122,120"
        fill="none" stroke="black" stroke-width="6" stroke-linejoin="round"/>
      <circle cx="150" cy="148" r="28" fill="none" stroke="black" stroke-width="4"/>
      <circle cx="138" cy="142" r="6" fill="black"/>
      <circle cx="162" cy="142" r="6" fill="black"/>
      <path d="M 138 158 Q 150 168 162 158" fill="none" stroke="black" stroke-width="4" stroke-linecap="round"/>
    `,
  },
  {
    id: 'flower',
    name: 'Pretty Flower',
    emoji: '🌸',
    svgData: `
      <ellipse cx="150" cy="80" rx="30" ry="45" fill="none" stroke="black" stroke-width="5"/>
      <ellipse cx="220" cy="110" rx="30" ry="45" fill="none" stroke="black" stroke-width="5" transform="rotate(60,220,110)"/>
      <ellipse cx="220" cy="190" rx="30" ry="45" fill="none" stroke="black" stroke-width="5" transform="rotate(120,220,190)"/>
      <ellipse cx="150" cy="220" rx="30" ry="45" fill="none" stroke="black" stroke-width="5"/>
      <ellipse cx="80" cy="190" rx="30" ry="45" fill="none" stroke="black" stroke-width="5" transform="rotate(60,80,190)"/>
      <ellipse cx="80" cy="110" rx="30" ry="45" fill="none" stroke="black" stroke-width="5" transform="rotate(120,80,110)"/>
      <circle cx="150" cy="150" r="40" fill="none" stroke="black" stroke-width="6"/>
      <circle cx="138" cy="144" r="7" fill="black"/>
      <circle cx="162" cy="144" r="7" fill="black"/>
      <path d="M 136 162 Q 150 174 164 162" fill="none" stroke="black" stroke-width="5" stroke-linecap="round"/>
      <line x1="150" y1="260" x2="150" y2="310" stroke="black" stroke-width="6" stroke-linecap="round"/>
      <path d="M 150 290 Q 175 270 195 280" fill="none" stroke="black" stroke-width="5" stroke-linecap="round"/>
    `,
  },
  {
    id: 'butterfly',
    name: 'Butterfly',
    emoji: '🦋',
    svgData: `
      <path d="M150 150 Q90 80 50 100 Q20 120 50 170 Q80 210 140 180 Z"
        fill="none" stroke="black" stroke-width="5" stroke-linejoin="round"/>
      <path d="M150 150 Q210 80 250 100 Q280 120 250 170 Q220 210 160 180 Z"
        fill="none" stroke="black" stroke-width="5" stroke-linejoin="round"/>
      <path d="M150 150 Q100 160 80 210 Q70 240 110 240 Q140 230 150 195 Z"
        fill="none" stroke="black" stroke-width="5" stroke-linejoin="round"/>
      <path d="M150 150 Q200 160 220 210 Q230 240 190 240 Q160 230 150 195 Z"
        fill="none" stroke="black" stroke-width="5" stroke-linejoin="round"/>
      <ellipse cx="150" cy="150" rx="10" ry="45" fill="none" stroke="black" stroke-width="5"/>
      <circle cx="150" cy="105" r="10" fill="none" stroke="black" stroke-width="4"/>
      <line x1="145" y1="96" x2="135" y2="82" stroke="black" stroke-width="3" stroke-linecap="round"/>
      <line x1="155" y1="96" x2="165" y2="82" stroke="black" stroke-width="3" stroke-linecap="round"/>
      <circle cx="134" cy="80" r="4" fill="black"/>
      <circle cx="166" cy="80" r="4" fill="black"/>
    `,
  },
  {
    id: 'house',
    name: 'My House',
    emoji: '🏠',
    svgData: `
      <polygon points="150,40 260,130 40,130" fill="none" stroke="black" stroke-width="6" stroke-linejoin="round"/>
      <rect x="60" y="130" width="180" height="140" fill="none" stroke="black" stroke-width="6" rx="4"/>
      <rect x="115" y="195" width="70" height="75" fill="none" stroke="black" stroke-width="5" rx="4"/>
      <rect x="75" y="155" width="50" height="45" fill="none" stroke="black" stroke-width="5" rx="4"/>
      <rect x="175" y="155" width="50" height="45" fill="none" stroke="black" stroke-width="5" rx="4"/>
      <line x1="100" y1="155" x2="100" y2="200" stroke="black" stroke-width="3"/>
      <line x1="75" y1="177" x2="125" y2="177" stroke="black" stroke-width="3"/>
      <line x1="200" y1="155" x2="200" y2="200" stroke="black" stroke-width="3"/>
      <line x1="175" y1="177" x2="225" y2="177" stroke="black" stroke-width="3"/>
      <circle cx="180" cy="237" r="5" fill="black"/>
      <line x1="150" y1="60" x2="150" y2="128" stroke="black" stroke-width="3" stroke-dasharray="6,4"/>
    `,
  },
  {
    id: 'cat',
    name: 'Cute Cat',
    emoji: '🐱',
    svgData: `
      <circle cx="150" cy="165" r="80" fill="none" stroke="black" stroke-width="6"/>
      <polygon points="95,100 80,55 120,88" fill="none" stroke="black" stroke-width="5" stroke-linejoin="round"/>
      <polygon points="205,100 220,55 180,88" fill="none" stroke="black" stroke-width="5" stroke-linejoin="round"/>
      <circle cx="122" cy="155" r="14" fill="none" stroke="black" stroke-width="4"/>
      <circle cx="178" cy="155" r="14" fill="none" stroke="black" stroke-width="4"/>
      <circle cx="126" cy="158" r="6" fill="black"/>
      <circle cx="182" cy="158" r="6" fill="black"/>
      <path d="M 138 185 Q 150 196 162 185" fill="none" stroke="black" stroke-width="5" stroke-linecap="round"/>
      <circle cx="150" cy="183" r="7" fill="none" stroke="black" stroke-width="4"/>
      <line x1="150" y1="183" x2="90" y2="173" stroke="black" stroke-width="3" stroke-linecap="round"/>
      <line x1="150" y1="183" x2="90" y2="183" stroke="black" stroke-width="3" stroke-linecap="round"/>
      <line x1="150" y1="183" x2="90" y2="193" stroke="black" stroke-width="3" stroke-linecap="round"/>
      <line x1="150" y1="183" x2="210" y2="173" stroke="black" stroke-width="3" stroke-linecap="round"/>
      <line x1="150" y1="183" x2="210" y2="183" stroke="black" stroke-width="3" stroke-linecap="round"/>
      <line x1="150" y1="183" x2="210" y2="193" stroke="black" stroke-width="3" stroke-linecap="round"/>
    `,
  },
];
