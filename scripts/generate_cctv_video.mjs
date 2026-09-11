import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const FRAMES_DIR = '/tmp/cctv_frames';
if (!fs.existsSync(FRAMES_DIR)) {
  fs.mkdirSync(FRAMES_DIR, { recursive: true });
}

const TOTAL_FRAMES = 60; // 4 seconds at 15 fps
const FPS = 15;
const WIDTH = 1280;
const HEIGHT = 720;

console.log(`Generating ${TOTAL_FRAMES} frames...`);

for (let i = 0; i < TOTAL_FRAMES; i++) {
  const t = i / TOTAL_FRAMES; // 0.0 to 1.0
  const seconds = (i / FPS).toFixed(2);
  const ms = Math.floor((i % FPS) * (1000 / FPS)).toString().padStart(3, '0');
  const timestampStr = `2026-09-11 19:02:${(19 + Math.floor(i / FPS)).toString().padStart(2, '0')}.${ms} IST REC`;

  // Subject movement trajectory:
  // Starts at left (x = -80 to +1100), walks across the sidewalk in front of barriers
  const subjectX = -120 + t * 1400;
  const subjectY = 460 + Math.sin(t * Math.PI * 8) * 4; // slight walking bobbing

  // Looking at camera around t = 0.45 to 0.75
  const isLookingAtCam = t >= 0.42 && t <= 0.72;
  const lookIntensity = isLookingAtCam ? Math.sin(((t - 0.42) / 0.3) * Math.PI) : 0;

  // Face rotation: 0 (facing right/profile) to 1 (facing camera directly)
  const faceFacingCam = lookIntensity;

  // Eye and face details
  const headX = subjectX + 80;
  const headY = subjectY - 90;

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${WIDTH}" height="${HEIGHT}" viewBox="0 0 ${WIDTH} ${HEIGHT}">
    <defs>
      <!-- Gradients -->
      <linearGradient id="skyGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#3b4b45"/>
        <stop offset="100%" stop-color="#606c64"/>
      </linearGradient>
      <linearGradient id="wallGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#9a9585"/>
        <stop offset="100%" stop-color="#736d5e"/>
      </linearGradient>
      <linearGradient id="roadGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#4d4f48"/>
        <stop offset="100%" stop-color="#3a3c36"/>
      </linearGradient>
      <linearGradient id="barrierGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#a8a9a0"/>
        <stop offset="50%" stop-color="#8c8d84"/>
        <stop offset="100%" stop-color="#5f6158"/>
      </linearGradient>
      <linearGradient id="pavementGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stop-color="#454642"/>
        <stop offset="100%" stop-color="#2a2c28"/>
      </linearGradient>
      <radialGradient id="vignette" cx="50%" cy="50%" r="55%">
        <stop offset="70%" stop-color="#000000" stop-opacity="0"/>
        <stop offset="100%" stop-color="#000000" stop-opacity="0.65"/>
      </radialGradient>
      <filter id="cctvNoise">
        <feTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="3" result="noise" />
        <feColorMatrix type="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 0.05 0"/>
        <feBlend in="SourceGraphic" in2="noise" mode="screen"/>
      </filter>
    </defs>

    <!-- Sky / Distant Horizon -->
    <rect width="${WIDTH}" height="180" fill="url(#skyGrad)"/>
    
    <!-- Treeline / Shrubbery behind perimeter wall -->
    <path d="M0 160 Q80 140 160 160 Q240 135 340 155 Q440 130 560 160 Q680 140 800 158 Q920 135 1060 160 Q1180 140 1280 160 L1280 180 L0 180 Z" fill="#2d3826"/>

    <!-- Concrete Security Perimeter Wall -->
    <rect y="160" width="${WIDTH}" height="130" fill="url(#wallGrad)"/>
    <!-- Wall expansion joints -->
    <line x1="240" y1="160" x2="240" y2="290" stroke="#5a5649" stroke-width="3"/>
    <line x1="560" y1="160" x2="560" y2="290" stroke="#5a5649" stroke-width="3"/>
    <line x1="880" y1="160" x2="880" y2="290" stroke="#5a5649" stroke-width="3"/>
    <line x1="1160" y1="160" x2="1160" y2="290" stroke="#5a5649" stroke-width="3"/>

    <!-- Asphalt Road Area -->
    <rect y="280" width="${WIDTH}" height="150" fill="url(#roadGrad)"/>

    <!-- Military Transport Truck 1 (Left: Stallion 4x4) -->
    <g transform="translate(60, 110)">
      <!-- Truck Shadow -->
      <ellipse cx="140" cy="185" rx="150" ry="18" fill="#1b1d1a" opacity="0.8"/>
      <!-- Wheels -->
      <circle cx="50" cy="180" r="28" fill="#181a17"/>
      <circle cx="50" cy="180" r="14" fill="#363934"/>
      <circle cx="210" cy="180" r="28" fill="#181a17"/>
      <circle cx="210" cy="180" r="14" fill="#363934"/>
      <!-- Chassis & Mudguards -->
      <rect x="20" y="145" width="220" height="22" fill="#222620"/>
      <!-- Cab -->
      <path d="M190 85 L245 100 L245 155 L180 155 Z" fill="#3a4533"/>
      <!-- Cab windshield -->
      <polygon points="195,95 235,108 235,128 190,128" fill="#1b2520"/>
      <!-- Cargo Bed Canvas Tarp -->
      <path d="M20 50 L185 50 L185 155 L20 155 Z" fill="#46543b"/>
      <line x1="60" y1="50" x2="60" y2="155" stroke="#333e2c" stroke-width="2"/>
      <line x1="110" y1="50" x2="110" y2="155" stroke="#333e2c" stroke-width="2"/>
      <line x1="150" y1="50" x2="150" y2="155" stroke="#333e2c" stroke-width="2"/>
    </g>

    <!-- Military Transport Truck 2 (Center Right) -->
    <g transform="translate(720, 85)">
      <!-- Shadow -->
      <ellipse cx="160" cy="205" rx="170" ry="20" fill="#1b1d1a" opacity="0.8"/>
      <!-- Wheels -->
      <circle cx="70" cy="200" r="30" fill="#181a17"/>
      <circle cx="70" cy="200" r="15" fill="#363934"/>
      <circle cx="240" cy="200" r="30" fill="#181a17"/>
      <circle cx="240" cy="200" r="15" fill="#363934"/>
      <!-- Chassis -->
      <rect x="35" y="160" width="235" height="24" fill="#222620"/>
      <!-- Cab facing right -->
      <path d="M210 95 L275 110 L275 170 L200 170 Z" fill="#3d4936"/>
      <polygon points="215,105 265,118 265,140 210,140" fill="#1b2520"/>
      <!-- Cargo Canvas Tarp -->
      <path d="M35 55 L205 55 L205 170 L35 170 Z" fill="#4a5a3f"/>
      <line x1="80" y1="55" x2="80" y2="170" stroke="#35422e" stroke-width="2"/>
      <line x1="130" y1="55" x2="130" y2="170" stroke="#35422e" stroke-width="2"/>
      <line x1="175" y1="55" x2="175" y2="170" stroke="#35422e" stroke-width="2"/>
    </g>

    <!-- Concrete Jersey Barriers Section (Middle Ground) -->
    <!-- Barrier Shadow on Ground -->
    <polygon points="0,520 1280,510 1280,550 0,560" fill="#1a1c18" opacity="0.75"/>

    <!-- Barrier 1 -->
    <g transform="translate(20, 370)">
      <polygon points="0,90 20,10 520,10 540,90" fill="url(#barrierGrad)"/>
      <rect x="0" y="90" width="540" height="60" fill="#696b62"/>
      <line x1="270" y1="10" x2="270" y2="150" stroke="#3a3c36" stroke-width="4"/>
    </g>

    <!-- Barrier 2 -->
    <g transform="translate(620, 370)">
      <polygon points="0,90 20,10 540,10 560,90" fill="url(#barrierGrad)"/>
      <rect x="0" y="90" width="560" height="60" fill="#696b62"/>
      <line x1="280" y1="10" x2="280" y2="150" stroke="#3a3c36" stroke-width="4"/>
    </g>

    <!-- Paved Walkway in Foreground -->
    <rect y="520" width="${WIDTH}" height="200" fill="url(#pavementGrad)"/>
    <!-- Paver lines -->
    <g stroke="#353732" stroke-width="1.5" opacity="0.6">
      <line x1="0" y1="560" x2="1280" y2="560"/>
      <line x1="0" y1="610" x2="1280" y2="610"/>
      <line x1="0" y1="660" x2="1280" y2="660"/>
      <!-- Vertical interlocks -->
      ${Array.from({ length: 25 }).map((_, idx) => `<line x1="${idx * 60}" y1="520" x2="${idx * 60}" y2="720"/>`).join('')}
    </g>

    <!-- Walking Subject Shadow -->
    <ellipse cx="${subjectX + 70}" cy="${subjectY + 180}" rx="65" ry="16" fill="#101210" opacity="0.85"/>

    <!-- WALKING SUBJECT (Human Target) -->
    <g transform="translate(${subjectX}, ${subjectY})">
      <!-- Legs & Jeans (Blue denim #283e56) -->
      <!-- Left leg -->
      <path d="M55 120 L40 185 L25 190 L50 190 L68 125 Z" fill="#24374c"/>
      <!-- Right leg -->
      <path d="M75 120 L95 180 L115 185 L85 190 L70 125 Z" fill="#1d2e40"/>
      <!-- Shoes -->
      <rect x="22" y="186" width="30" height="10" rx="3" fill="#15171a"/>
      <rect x="85" y="183" width="32" height="10" rx="3" fill="#15171a"/>

      <!-- Torso: Black Leather Jacket -->
      <path d="M40 25 C30 50 25 100 35 125 L95 125 C105 100 102 50 90 25 Z" fill="#16181b"/>
      <!-- Jacket highlights & collar -->
      <path d="M50 25 L65 75 L80 25 Z" fill="#2c2f35"/>
      <path d="M48 20 L58 40 L72 40 L82 20 Z" fill="#111315"/>

      <!-- Arms -->
      <path d="M35 30 L22 80 L32 95 L42 75 Z" fill="#1a1c20"/>
      <path d="M92 30 L108 75 L100 95 L88 75 Z" fill="#141618"/>

      <!-- Head & Neck -->
      <rect x="58" y="8" width="16" height="18" fill="#a47b59"/>
      
      <!-- Head Base -->
      <ellipse cx="66" cy="0" rx="20" ry="24" fill="#bb8c67"/>
      
      <!-- Hair (Dark, stylized pompadour) -->
      <path d="M45 -10 C45 -30 85 -32 88 -8 C85 -5 85 8 82 8 C80 -18 52 -18 48 -2 Z" fill="#1a1815"/>
      <path d="M44 -8 L48 8 L54 6 L52 -8 Z" fill="#1a1815"/>

      <!-- Facial Features Based on Look Intensity (Turns to camera) -->
      ${faceFacingCam > 0.2 ? `
        <!-- Facing camera: both eyes visible, beard outline -->
        <!-- Eyes & Eyebrows -->
        <line x1="56" y1="-4" x2="63" y2="-4" stroke="#12100d" stroke-width="2"/>
        <line x1="68" y1="-4" x2="75" y2="-4" stroke="#12100d" stroke-width="2"/>
        <circle cx="60" cy="0" r="2.5" fill="#1a1816"/>
        <circle cx="71" cy="0" r="2.5" fill="#1a1816"/>
        <!-- Nose bridge -->
        <line x1="66" y1="-2" x2="65" y2="8" stroke="#8d6342" stroke-width="2"/>
        <!-- Mouth -->
        <line x1="60" y1="12" x2="71" y2="12" stroke="#5d3e2a" stroke-width="1.8"/>
        <!-- Stubble / Beard -->
        <path d="M52 4 C54 18 78 18 80 4 C80 18 74 24 66 25 C58 24 52 18 52 4 Z" fill="#2b2119" opacity="0.7"/>
      ` : `
        <!-- Profile / 3/4 view facing forward right -->
        <line x1="68" y1="-4" x2="76" y2="-4" stroke="#12100d" stroke-width="2"/>
        <circle cx="72" cy="0" r="2.5" fill="#1a1816"/>
        <path d="M76 -2 L82 4 L76 7 Z" fill="#a47b59"/>
        <line x1="70" y1="12" x2="78" y2="12" stroke="#5d3e2a" stroke-width="1.8"/>
        <path d="M60 4 C64 18 80 18 82 4 C82 18 76 24 68 25 C62 24 60 18 60 4 Z" fill="#2b2119" opacity="0.6"/>
      `}
    </g>

    <!-- Fisheye lens vignette & CCTV frame overlay -->
    <rect width="${WIDTH}" height="${HEIGHT}" fill="url(#vignette)"/>

    <!-- Subtle CCTV Scanlines -->
    <g stroke="#ffffff" stroke-width="0.75" opacity="0.04">
      ${Array.from({ length: 36 }).map((_, idx) => `<line x1="0" y1="${idx * 20}" x2="${WIDTH}" y2="${idx * 20}"/>`).join('')}
    </g>

    <!-- Top Left CCTV Telemetry (Burnt-in) -->
    <text x="35" y="45" fill="#ffffff" opacity="0.85" font-family="Courier, monospace" font-size="16" font-weight="bold">
      ● REC [CAM-05] FPS: 30.0 BITRATE: 4120 KBPS
    </text>

    <!-- Bottom Right Burn-in CCTV Timestamp as in user's video -->
    <text x="${WIDTH - 40}" y="${HEIGHT - 35}" fill="#ffffff" opacity="0.92" font-family="Courier, monospace" font-size="22" font-weight="bold" text-anchor="end">
      CAM-05 | BASE_PERIMETER_GATE | ${timestampStr}
    </text>
  </svg>`;

  const frameFileName = path.join(FRAMES_DIR, `frame_${i.toString().padStart(4, '0')}.svg`);
  fs.writeFileSync(frameFileName, svg);
}

console.log('Rendering video using ffmpeg...');
const outputVideo = '/app/applet/public/videos/cctv-base-perimeter.mp4';
const cmd = `ffmpeg -y -framerate ${FPS} -i /tmp/cctv_frames/frame_%04d.svg -c:v libx264 -pix_fmt yuv420p -movflags +faststart ${outputVideo}`;
execSync(cmd, { stdio: 'inherit' });

console.log('Successfully generated CCTV video at:', outputVideo);
