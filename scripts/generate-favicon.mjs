import fs from 'fs';
import path from 'path';

// Read profile.png as base64
const profileImgPath = path.resolve("./public/profile.png");
const imgBuffer = fs.readFileSync(profileImgPath);
const base64Img = imgBuffer.toString('base64');
const dataUri = `data:image/png;base64,${base64Img}`;

// Create high-res circular SVG favicon with glowing cyan/violet ring & dark background
// Renelle's head is in the top-center part of the image
// In a 100x100 viewBox, we zoom in on the head/face:
const svgFavicon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100">
  <defs>
    <linearGradient id="ring" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#06b6d4" />
      <stop offset="50%" stop-color="#3b82f6" />
      <stop offset="100%" stop-color="#8b5cf6" />
    </linearGradient>
    <clipPath id="circleClip">
      <circle cx="50" cy="50" r="44" />
    </clipPath>
  </defs>

  <!-- Outer background & glowing ring -->
  <circle cx="50" cy="50" r="49" fill="#070b14" />
  <circle cx="50" cy="50" r="48" fill="none" stroke="url(#ring)" stroke-width="3.5" />

  <!-- Clipped Face/Headshot -->
  <g clip-path="url(#circleClip)">
    <circle cx="50" cy="50" r="45" fill="#0a0f1d" />
    <!-- Image positioned to zoom in on Renelle's face and smile -->
    <image
      href="${dataUri}"
      x="-14"
      y="-8"
      width="128"
      height="160"
      preserveAspectRatio="xMidYMid slice"
    />
  </g>
</svg>`;

fs.writeFileSync(path.resolve("./public/favicon.svg"), svgFavicon, 'utf8');
console.log("Successfully generated public/favicon.svg with circular headshot and glowing cyan ring!");
