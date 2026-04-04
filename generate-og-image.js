import sharp from 'sharp';
import fs from 'fs';

const width = 1200;
const height = 630;

// Colors
const darkBg = '#09090b'; // zinc-950
const darkBgLight = '#0f0f13'; // slightly lighter at bottom
const greenAccent = '#22c55e'; // green-500
const white = '#ffffff';
const gray = '#a1a1a1'; // neutral gray for subtitle

// Create SVG with all design elements
const svg = `
<svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="bgGradient" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" style="stop-color:${darkBg};stop-opacity:1" />
      <stop offset="100%" style="stop-color:${darkBgLight};stop-opacity:1" />
    </linearGradient>
  </defs>

  <!-- Background with gradient -->
  <rect width="${width}" height="${height}" fill="url(#bgGradient)" />

  <!-- Green square logo (top left) -->
  <rect x="40" y="40" width="80" height="80" fill="${greenAccent}" />

  <!-- "R" in the green square -->
  <text x="80" y="85" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="60" font-weight="bold" fill="${darkBg}" text-anchor="middle" dominant-baseline="middle">R</text>

  <!-- "Rentcoin" title -->
  <text x="160" y="50" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="72" font-weight="bold" fill="${white}">Rentcoin</text>

  <!-- Tagline in green -->
  <text x="160" y="140" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="28" font-weight="bold" fill="${greenAccent}">Immobilien-Investment ab 100€</text>

  <!-- Subtitle in gray (split across two lines) -->
  <text x="50" y="240" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" fill="${gray}">Digitale Immobilienanteile — transparent, flexibel,</text>
  <text x="50" y="275" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-size="20" fill="${gray}">renditeorientiert.</text>
</svg>
`;

// Generate PNG from SVG
try {
  const result = await sharp(Buffer.from(svg))
    .png()
    .toFile('/sessions/charming-festive-volta/rentcoin-repo/public/og-image.png');

  console.log(`✓ OG image generated successfully`);
  console.log(`  Path: /sessions/charming-festive-volta/rentcoin-repo/public/og-image.png`);
  console.log(`  Size: ${width}x${height}px`);
  console.log(`  File size: ${Math.round(result.size / 1024)}KB`);
} catch (err) {
  console.error('Error generating image:', err);
  process.exit(1);
}
