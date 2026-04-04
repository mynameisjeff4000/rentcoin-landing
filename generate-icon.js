import sharp from 'sharp';

const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="32" height="32">
  <rect width="32" height="32" rx="6" fill="#22c55e"/>
  <text x="16" y="24" font-family="Arial, sans-serif" font-size="22" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">R</text>
</svg>`;

sharp(Buffer.from(svgContent))
  .resize(180, 180, {
    fit: 'fill'
  })
  .png()
  .toFile('public/apple-touch-icon.png', (err, info) => {
    if (err) {
      console.error('Error generating icon:', err);
      process.exit(1);
    }
    console.log('Apple touch icon generated:', info);
  });
