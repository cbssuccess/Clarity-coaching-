import { CBNPage } from '../../App';

export const CBN_PAGES: CBNPage[] = [
  {
    id: 'rainbow',
    name: 'Rainbow Sky',
    emoji: '🌈',
    colorMap: {
      1: '#87CEEB', // sky blue
      2: '#FF4444', // red
      3: '#FF8800', // orange
      4: '#FFD700', // yellow
      5: '#44CC44', // green
      6: '#4488FF', // blue
      7: '#9933CC', // violet
      8: '#FFFFFF', // white (clouds)
    },
    regions: [
      // Sky background
      {
        id: 1,
        colorNumber: 1,
        shape: 'rect',
        props: { x: 0, y: 0, width: 300, height: 300 },
        labelX: 18,
        labelY: 20,
      },
      // Red arc (outermost)
      {
        id: 2,
        colorNumber: 2,
        shape: 'path',
        props: {
          d: 'M -60,300 A 210,210 0 0,1 360,300 L 325,300 A 175,175 0 0,0 -25,300 Z',
        },
        labelX: 150,
        labelY: 98,
      },
      // Orange arc
      {
        id: 3,
        colorNumber: 3,
        shape: 'path',
        props: {
          d: 'M -25,300 A 175,175 0 0,1 325,300 L 290,300 A 140,140 0 0,0 10,300 Z',
        },
        labelX: 150,
        labelY: 133,
      },
      // Yellow arc
      {
        id: 4,
        colorNumber: 4,
        shape: 'path',
        props: {
          d: 'M 10,300 A 140,140 0 0,1 290,300 L 255,300 A 105,105 0 0,0 45,300 Z',
        },
        labelX: 150,
        labelY: 168,
      },
      // Green arc
      {
        id: 5,
        colorNumber: 5,
        shape: 'path',
        props: {
          d: 'M 45,300 A 105,105 0 0,1 255,300 L 220,300 A 70,70 0 0,0 80,300 Z',
        },
        labelX: 150,
        labelY: 203,
      },
      // Blue arc
      {
        id: 6,
        colorNumber: 6,
        shape: 'path',
        props: {
          d: 'M 80,300 A 70,70 0 0,1 220,300 L 185,300 A 35,35 0 0,0 115,300 Z',
        },
        labelX: 150,
        labelY: 238,
      },
      // Violet (center semicircle)
      {
        id: 7,
        colorNumber: 7,
        shape: 'path',
        props: {
          d: 'M 115,300 A 35,35 0 0,1 185,300 Z',
        },
        labelX: 150,
        labelY: 275,
      },
      // Left cloud
      {
        id: 8,
        colorNumber: 8,
        shape: 'circle',
        props: { cx: 45, cy: 60, r: 38 },
        labelX: 45,
        labelY: 60,
      },
      // Right cloud
      {
        id: 9,
        colorNumber: 8,
        shape: 'circle',
        props: { cx: 255, cy: 60, r: 38 },
        labelX: 255,
        labelY: 60,
      },
    ],
  },
  {
    id: 'cupcake',
    name: 'Yummy Cupcake',
    emoji: '🧁',
    colorMap: {
      1: '#C8860A', // brown (wrapper lines)
      2: '#F5DEB3', // tan (wrapper body)
      3: '#FF69B4', // pink (frosting)
      4: '#9B59B6', // purple (frosting drip)
      5: '#FFD700', // yellow (sprinkles)
      6: '#FF4444', // red (cherry)
      7: '#5CB85C', // green (stem)
      8: '#FFA07A', // peach (cake)
    },
    regions: [
      // Background
      {
        id: 1,
        colorNumber: 1,
        shape: 'rect',
        props: { x: 0, y: 0, width: 300, height: 300, fill: 'white' },
        labelX: 15,
        labelY: 15,
      },
      // Wrapper body
      {
        id: 2,
        colorNumber: 2,
        shape: 'polygon',
        props: { points: '88,220 62,285 238,285 212,220' },
        labelX: 150,
        labelY: 257,
      },
      // Cake body
      {
        id: 3,
        colorNumber: 8,
        shape: 'rect',
        props: { x: 88, y: 160, width: 124, height: 60 },
        labelX: 150,
        labelY: 192,
      },
      // Main frosting blob
      {
        id: 4,
        colorNumber: 3,
        shape: 'ellipse',
        props: { cx: 150, cy: 145, rx: 72, ry: 50 },
        labelX: 150,
        labelY: 130,
      },
      // Frosting top swirl
      {
        id: 5,
        colorNumber: 4,
        shape: 'ellipse',
        props: { cx: 150, cy: 108, rx: 38, ry: 28 },
        labelX: 150,
        labelY: 108,
      },
      // Frosting swirl tip
      {
        id: 6,
        colorNumber: 3,
        shape: 'circle',
        props: { cx: 150, cy: 84, r: 16 },
        labelX: 150,
        labelY: 84,
      },
      // Cherry stem
      {
        id: 7,
        colorNumber: 7,
        shape: 'rect',
        props: { x: 146, y: 58, width: 8, height: 22 },
        labelX: 150,
        labelY: 68,
      },
      // Cherry
      {
        id: 8,
        colorNumber: 6,
        shape: 'circle',
        props: { cx: 150, cy: 50, r: 16 },
        labelX: 150,
        labelY: 50,
      },
      // Left sprinkle
      {
        id: 9,
        colorNumber: 5,
        shape: 'rect',
        props: { x: 104, y: 140, width: 20, height: 8, rx: 4, transform: 'rotate(-30,114,144)' },
        labelX: 114,
        labelY: 144,
      },
      // Right sprinkle
      {
        id: 10,
        colorNumber: 5,
        shape: 'rect',
        props: { x: 176, y: 140, width: 20, height: 8, rx: 4, transform: 'rotate(30,186,144)' },
        labelX: 186,
        labelY: 144,
      },
      // Wrapper stripe 1
      {
        id: 11,
        colorNumber: 1,
        shape: 'path',
        props: { d: 'M 112,220 L 108,285 L 118,285 L 122,220 Z' },
        labelX: 115,
        labelY: 252,
      },
      // Wrapper stripe 2
      {
        id: 12,
        colorNumber: 1,
        shape: 'path',
        props: { d: 'M 148,220 L 147,285 L 153,285 L 152,220 Z' },
        labelX: 150,
        labelY: 252,
      },
      // Wrapper stripe 3
      {
        id: 13,
        colorNumber: 1,
        shape: 'path',
        props: { d: 'M 178,220 L 182,285 L 192,285 L 188,220 Z' },
        labelX: 185,
        labelY: 252,
      },
    ],
  },
  {
    id: 'underwater',
    name: 'Under the Sea',
    emoji: '🐠',
    colorMap: {
      1: '#006994', // deep ocean blue
      2: '#40C4FF', // light blue (water)
      3: '#FF8F00', // orange (fish body)
      4: '#FFFFFF', // white (fish stripes)
      5: '#FFD600', // yellow (fish fin)
      6: '#2E7D32', // dark green (seaweed)
      7: '#81C784', // light green (seaweed)
      8: '#F06292', // pink (coral)
    },
    regions: [
      // Ocean background
      {
        id: 1,
        colorNumber: 2,
        shape: 'rect',
        props: { x: 0, y: 0, width: 300, height: 300 },
        labelX: 15,
        labelY: 18,
      },
      // Ocean floor
      {
        id: 2,
        colorNumber: 1,
        shape: 'rect',
        props: { x: 0, y: 250, width: 300, height: 50 },
        labelX: 15,
        labelY: 268,
      },
      // Fish body (large oval)
      {
        id: 3,
        colorNumber: 3,
        shape: 'ellipse',
        props: { cx: 148, cy: 130, rx: 65, ry: 42 },
        labelX: 148,
        labelY: 120,
      },
      // Fish tail (triangle)
      {
        id: 4,
        colorNumber: 5,
        shape: 'polygon',
        props: { points: '83,130 55,100 55,160' },
        labelX: 68,
        labelY: 130,
      },
      // Fish white stripe 1
      {
        id: 5,
        colorNumber: 4,
        shape: 'ellipse',
        props: { cx: 148, cy: 130, rx: 20, ry: 38 },
        labelX: 148,
        labelY: 155,
      },
      // Fish eye
      {
        id: 6,
        colorNumber: 1,
        shape: 'circle',
        props: { cx: 192, cy: 120, r: 10 },
        labelX: 192,
        labelY: 120,
      },
      // Fish top fin
      {
        id: 7,
        colorNumber: 5,
        shape: 'polygon',
        props: { points: '140,90 165,90 155,62' },
        labelX: 153,
        labelY: 83,
      },
      // Seaweed stalk 1
      {
        id: 8,
        colorNumber: 6,
        shape: 'rect',
        props: { x: 36, y: 180, width: 14, height: 70, rx: 7 },
        labelX: 43,
        labelY: 220,
      },
      // Seaweed leaf 1
      {
        id: 9,
        colorNumber: 7,
        shape: 'ellipse',
        props: { cx: 25, cy: 205, rx: 22, ry: 12, transform: 'rotate(-30,25,205)' },
        labelX: 18,
        labelY: 205,
      },
      // Seaweed stalk 2
      {
        id: 10,
        colorNumber: 6,
        shape: 'rect',
        props: { x: 248, y: 170, width: 14, height: 80, rx: 7 },
        labelX: 255,
        labelY: 215,
      },
      // Seaweed leaf 2
      {
        id: 11,
        colorNumber: 7,
        shape: 'ellipse',
        props: { cx: 270, cy: 198, rx: 22, ry: 12, transform: 'rotate(30,270,198)' },
        labelX: 272,
        labelY: 198,
      },
      // Coral 1
      {
        id: 12,
        colorNumber: 8,
        shape: 'ellipse',
        props: { cx: 100, cy: 255, rx: 22, ry: 30 },
        labelX: 100,
        labelY: 255,
      },
      // Coral 2
      {
        id: 13,
        colorNumber: 8,
        shape: 'ellipse',
        props: { cx: 200, cy: 258, rx: 18, ry: 24 },
        labelX: 200,
        labelY: 258,
      },
      // Bubble 1
      {
        id: 14,
        colorNumber: 4,
        shape: 'circle',
        props: { cx: 220, cy: 70, r: 15 },
        labelX: 220,
        labelY: 70,
      },
      // Bubble 2
      {
        id: 15,
        colorNumber: 4,
        shape: 'circle',
        props: { cx: 248, cy: 45, r: 10 },
        labelX: 248,
        labelY: 45,
      },
    ],
  },
];
