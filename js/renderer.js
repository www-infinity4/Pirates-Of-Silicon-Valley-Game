/* ==========================================================
   PIRATES OF SILICON VALLEY — RENDERER
   8-bit pixel art canvas drawing engine
   ========================================================== */

'use strict';

const R = (() => {

  /* ---- NES-inspired colour palette ---- */
  const C = {
    BLACK:   '#0F0F0F',  WHITE:   '#FCFCFC',
    RED:     '#F83800',  ORANGE:  '#E45C10',
    YELLOW:  '#FBE830',  GREEN:   '#00B800',
    CYAN:    '#00FCFC',  BLUE:    '#0058F8',
    NAVY:    '#0028B4',  PURPLE:  '#6844FC',
    PINK:    '#F878F8',  BROWN:   '#783000',
    BEIGE:   '#FCE4A0',  GRAY:    '#7C7C7C',
    LGRAY:   '#BCBCBC',  DGRAY:   '#3C3C3C',
    TBLUE:   '#3CBCFC',  TGREEN:  '#00E8D8',
    DBLUE:   '#001880',  MBLUE:   '#0038A8',
  };

  let ctx, W, H;

  function init(canvas) {
    ctx = canvas.getContext('2d');
    W = canvas.width;
    H = canvas.height;
    ctx.imageSmoothingEnabled = false;
  }

  /* ---- Core drawing helpers ---- */
  function rect(x, y, w, h, fill, stroke, sw) {
    ctx.fillStyle = fill || C.WHITE;
    ctx.fillRect(x, y, w, h);
    if (stroke) {
      ctx.strokeStyle = stroke;
      ctx.lineWidth = sw || 2;
      ctx.strokeRect(x + (sw||2)/2, y + (sw||2)/2, w - (sw||2), h - (sw||2));
    }
  }

  function pixel(x, y, size, fill) {
    ctx.fillStyle = fill;
    ctx.fillRect(x, y, size, size);
  }

  /* Draw multiline text with pixel font, returns height used */
  function text(str, x, y, size, fill, align, maxW) {
    ctx.font = `${size}px "Press Start 2P", monospace`;
    ctx.fillStyle = fill || C.WHITE;
    ctx.textAlign = align || 'left';
    if (maxW) ctx.textBaseline = 'top';
    else ctx.textBaseline = 'top';
    const lines = str.split('\n');
    const lineH = size * 1.8;
    lines.forEach((line, i) => {
      ctx.fillText(line, x, y + i * lineH, maxW || undefined);
    });
    return lines.length * lineH;
  }

  /* Shadow text for readability */
  function shadowText(str, x, y, size, fill, align) {
    const old = ctx.fillStyle;
    text(str, x + 2, y + 2, size, C.BLACK, align);
    text(str, x, y, size, fill, align);
    ctx.fillStyle = old;
  }

  /* Outlined box with pixel border */
  function panel(x, y, w, h, bgFill, borderFill, borderW) {
    const bw = borderW || 4;
    rect(x, y, w, h, borderFill || C.BLUE);
    rect(x + bw, y + bw, w - bw*2, h - bw*2, bgFill || C.NAVY);
  }

  /* Flashing text (blink) */
  function blinkText(str, x, y, size, fill, align, phase) {
    if (Math.floor(phase / 30) % 2 === 0) {
      shadowText(str, x, y, size, fill, align);
    }
  }

  /* Clear canvas */
  function clear(fill) {
    ctx.fillStyle = fill || C.BLACK;
    ctx.fillRect(0, 0, W, H);
  }

  /* ---- PIXEL ART SPRITE HELPERS ---- */

  /* Draw a pixelated character using an array of rows */
  function sprite(pixels, px, py, scale, palette) {
    scale = scale || 4;
    pixels.forEach((row, ry) => {
      row.forEach((col, rx) => {
        if (col !== 0 && palette[col]) {
          rect(px + rx * scale, py + ry * scale, scale, scale, palette[col]);
        }
      });
    });
  }

  /* ---- SCENE BACKGROUNDS ---- */

  /* Star field */
  function drawStars(seed) {
    const r = (n) => { seed = (seed * 1664525 + 1013904223) & 0x7FFFFFFF; return (seed % n); };
    for (let i = 0; i < 80; i++) {
      const x = r(W), y = r(H * 0.6);
      const sz = r(3) + 1;
      const bright = r(156) + 100;
      ctx.fillStyle = `rgb(${bright},${bright},${bright})`;
      ctx.fillRect(x, y, sz, sz);
    }
  }

  /* === SCENE: GARAGE (Level 1) === */
  function sceneGarage() {
    // Night sky
    rect(0, 0, W, H * 0.55, '#080818');
    drawStars(42);
    // Moon
    rect(700, 30, 48, 48, '#FFFFCC');
    rect(716, 38, 36, 32, '#E8E8A0');
    rect(708, 42, 8, 8, '#D8D840');
    // Garage exterior wall
    rect(0, H * 0.4, W, H * 0.6, '#8B7355');
    // Garage floor inside
    rect(0, H * 0.65, W, H * 0.35, '#5C4A2A');
    // Garage door (open)
    rect(60, H * 0.35, 300, H * 0.3, '#3A2810');
    // Door panels
    for (let r2 = 0; r2 < 3; r2++)
      for (let c2 = 0; c2 < 3; c2++)
        rect(68 + c2 * 96, H * 0.36 + r2 * 36, 88, 30, '#2A1C0A');
    // Workbench
    rect(50, H * 0.62, 700, 20, '#6B4423');
    rect(50, H * 0.58, 700, 8, '#8B6A3A');
    // Apple II Computer on desk (pixel art)
    drawAppleII(420, 280);
    // Oscilloscope
    drawOscilloscope(580, 290);
    // Shelves with electronics
    rect(450, 170, 280, 12, '#6B4423');
    for (let si = 0; si < 5; si++)
      rect(460 + si * 52, 145, 24, 28, ['#F83800','#0058F8','#00B800','#FBE830','#6844FC'][si]);
    // Steve Jobs silhouette (left)
    drawSteveJobs(130, 320, 1);
    // Wozniak silhouette (right of workbench)
    drawWozniak(320, 315, 1);
    // Light cone from overhead lamp
    ctx.save();
    const grad = ctx.createLinearGradient(W/2, 200, W/2, H);
    grad.addColorStop(0, 'rgba(255,255,200,0.15)');
    grad.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = grad;
    ctx.beginPath();
    ctx.moveTo(W/2 - 10, 200); ctx.lineTo(W/2 + 10, 200);
    ctx.lineTo(W/2 + 200, H); ctx.lineTo(W/2 - 200, H);
    ctx.closePath();
    ctx.fill();
    ctx.restore();
    // Lamp
    rect(W/2 - 8, 160, 16, 40, C.LGRAY);
    rect(W/2 - 24, 155, 48, 14, C.YELLOW);
  }

  /* === SCENE: LAB (Level 2, 5) === */
  function sceneLab() {
    // Ceiling
    rect(0, 0, W, 80, '#C8C8C8');
    // Fluorescent lights
    for (let i = 0; i < 4; i++) {
      rect(40 + i*190, 8, 160, 20, C.YELLOW);
      rect(40 + i*190, 5, 160, 6, C.WHITE);
    }
    // Floor
    rect(0, H - 80, W, 80, '#A0908070');
    // Checkerboard floor tiles
    for (let tx = 0; tx < 10; tx++)
      for (let ty = 0; ty < 2; ty++)
        rect(tx * 80, H - 80 + ty * 40, 80, 40, (tx + ty) % 2 === 0 ? '#E0D8C8' : '#C8C0B0');
    // Back wall
    rect(0, 80, W, H - 160, '#D8D0C0');
    // Window
    rect(320, 100, 160, 120, '#87CEEB');
    rect(320, 100, 160, 6, '#888');
    rect(320, 100, 6, 120, '#888');
    rect(474, 100, 6, 120, '#888');
    rect(320, 158, 160, 6, '#888');
    rect(396, 100, 6, 120, '#888');
    // Big mainframe computer
    drawMainframe(50, 120);
    // Workstations
    for (let i = 0; i < 3; i++) drawWorkstation(250 + i * 180, 320);
    // Circuit board on wall
    drawCircuitDiagram(560, 110);
  }

  /* === SCENE: XEROX PARC (Level 3, 6) === */
  function sceneXerox() {
    // Corporate background
    rect(0, 0, W, H, '#1A1A2E');
    // Building exterior
    rect(0, H * 0.3, W, H * 0.7, '#2A3550');
    // Building windows grid
    for (let row = 0; row < 4; row++)
      for (let col = 0; col < 10; col++) {
        const lit = (row * col + row + col) % 3 !== 0;
        rect(20 + col * 76, H * 0.32 + row * 55, 56, 40, lit ? '#FFD060' : '#1A2030');
        rect(20 + col * 76, H * 0.32 + row * 55, 56, 4, '#3A5080');
      }
    // Parking lot
    rect(0, H * 0.82, W, H * 0.18, '#484848');
    for (let i = 0; i < 6; i++)
      rect(i * 140, H * 0.82, 4, H * 0.18, '#FFFFFF');
    // Xerox Alto computers
    drawXeroxAlto(150, 240);
    drawXeroxAlto(420, 240);
    // Steve looking at Xerox Alto
    drawSteveJobs(300, 290, 1);
    // "XEROX PARC" sign
    panel(280, 40, 240, 60, '#1A1A40', C.TBLUE, 3);
    text('XEROX PARC', 400, 53, 12, C.TBLUE, 'center');
    // Stars
    drawStars(99);
  }

  /* === SCENE: APPLE HQ (Level 4, 7) === */
  function sceneAppleHQ() {
    // Blue sky gradient
    const sky = ctx.createLinearGradient(0, 0, 0, H * 0.6);
    sky.addColorStop(0, '#1A5096');
    sky.addColorStop(1, '#5090D0');
    ctx.fillStyle = sky;
    ctx.fillRect(0, 0, W, H * 0.6);
    // Clouds
    drawCloud(100, 60); drawCloud(500, 40); drawCloud(680, 90);
    // Ground / lawn
    rect(0, H * 0.6, W, H * 0.4, '#2A7020');
    // Apple HQ building (1 Infinite Loop)
    rect(100, H * 0.25, W - 200, H * 0.4, '#C8C8C8');
    rect(100, H * 0.22, W - 200, 20, '#A0A0A0');
    // Glass windows
    for (let row = 0; row < 3; row++)
      for (let col = 0; col < 8; col++)
        rect(120 + col * 70, H * 0.27 + row * 50, 55, 36, '#87CEEB');
    // Giant Rainbow Apple Logo
    drawRainbowApple(W/2 - 60, H * 0.3, 1.8);
    // "APPLE INC" sign
    panel(290, H * 0.65, 220, 44, C.DBLUE, C.BLUE, 3);
    text('APPLE INC.', 400, H * 0.665, 11, C.WHITE, 'center');
    // Trees
    drawTree(80, H * 0.55); drawTree(680, H * 0.55);
  }

  /* === SCENE: STAGE (Level 8, 9) === */
  function sceneStage() {
    // Dark auditorium
    rect(0, 0, W, H, '#0A0A0A');
    // Stage lights beams
    const lightPositions = [150, 300, 500, 650];
    lightPositions.forEach(lx => {
      ctx.save();
      const lg = ctx.createLinearGradient(lx, 0, lx + 60, H * 0.8);
      lg.addColorStop(0, 'rgba(255,255,200,0.25)');
      lg.addColorStop(1, 'rgba(0,0,0,0)');
      ctx.fillStyle = lg;
      ctx.beginPath();
      ctx.moveTo(lx, 0); ctx.lineTo(lx + 40, 0);
      ctx.lineTo(lx + 200, H * 0.8); ctx.lineTo(lx - 100, H * 0.8);
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    });
    // Stage platform
    rect(0, H * 0.72, W, H * 0.28, '#2A2020');
    rect(0, H * 0.72, W, 8, '#4A3030');
    // Big screen on stage
    rect(150, 60, 500, 320, '#111122');
    rect(150, 60, 500, 320, null, C.TBLUE, 4);
    // Apple logo on screen
    drawRainbowApple(370, 110, 2.0);
    // Steve Jobs on stage
    drawSteveJobs(120, 360, 2);
    // Audience silhouettes
    for (let i = 0; i < 16; i++) {
      const hy = H * 0.78 + (i % 3) * 8;
      rect(10 + i * 48, hy, 32, 50, '#1A1A1A');
      rect(22 + i * 48, hy - 18, 18, 18, '#251A10');
    }
    // Spotlight on Steve
    ctx.save();
    const sl = ctx.createRadialGradient(160, 400, 10, 160, 400, 200);
    sl.addColorStop(0, 'rgba(255,255,200,0.3)');
    sl.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = sl;
    ctx.fillRect(0, 200, 400, 400);
    ctx.restore();
  }

  /* === SCENE: FUTURE (Level 10) === */
  function sceneFuture() {
    // Deep space background
    rect(0, 0, W, H, '#000010');
    drawStars(1337);
    // Nebula clouds
    ctx.save();
    const nb1 = ctx.createRadialGradient(200, 200, 0, 200, 200, 300);
    nb1.addColorStop(0, 'rgba(100,0,200,0.3)');
    nb1.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = nb1;
    ctx.fillRect(0, 0, W, H);
    const nb2 = ctx.createRadialGradient(600, 400, 0, 600, 400, 250);
    nb2.addColorStop(0, 'rgba(0,100,200,0.3)');
    nb2.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = nb2;
    ctx.fillRect(0, 0, W, H);
    ctx.restore();
    // Apple Park building (ring shape — top down view approximation)
    ctx.save();
    ctx.translate(400, 300);
    ctx.strokeStyle = '#C0C0C0';
    ctx.lineWidth = 24;
    ctx.beginPath();
    ctx.ellipse(0, 0, 200, 120, 0, 0, Math.PI * 2);
    ctx.stroke();
    ctx.strokeStyle = '#808080';
    ctx.lineWidth = 8;
    ctx.stroke();
    ctx.restore();
    // iPhone 2026 (holographic)
    drawFuturePhone(520, 130);
    // Steve Jobs ghost / inspiration
    drawSteveJobs(120, 280, 2);
    // "2026" text floating
    shadowText('2026', 400, 30, 28, C.TBLUE, 'center');
    shadowText('APPLE PARK', 400, 72, 12, C.LGRAY, 'center');
    // Holographic rings
    ctx.save();
    for (let i = 0; i < 3; i++) {
      ctx.strokeStyle = `rgba(0,252,252,${0.4 - i * 0.1})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.ellipse(400, 300, 220 + i * 30, 130 + i * 20, 0, 0, Math.PI * 2);
      ctx.stroke();
    }
    ctx.restore();
  }

  /* ---- PIXEL ART ELEMENTS ---- */

  function drawAppleII(x, y) {
    // Case
    rect(x, y, 100, 70, '#C8C0A8');
    rect(x, y, 100, 8, '#B8B0A0');
    // Screen
    rect(x + 10, y + 12, 60, 40, '#001000');
    rect(x + 12, y + 14, 56, 36, '#004000');
    // Scan lines on screen
    for (let i = 0; i < 6; i++)
      rect(x + 12, y + 14 + i * 6, 56, 2, '#00600030');
    // Keyboard keys
    for (let k = 0; k < 8; k++)
      rect(x + 76 + k * 3, y + 54, 2, 6, '#888');
    // Apple logo
    ctx.font = '10px monospace';
    ctx.fillStyle = '#888';
    ctx.fillText('', x + 75, y + 20);
    // Rainbow stripes
    const rainbowC = [C.RED, C.ORANGE, C.YELLOW, C.GREEN, C.TBLUE, C.BLUE];
    rainbowC.forEach((c, i) => rect(x + 76, y + 8 + i * 3, 14, 3, c));
  }

  function drawOscilloscope(x, y) {
    rect(x, y, 80, 64, '#2A2A2A');
    rect(x + 6, y + 6, 48, 40, '#001A00');
    // Waveform
    ctx.strokeStyle = '#00FF40';
    ctx.lineWidth = 2;
    ctx.beginPath();
    for (let px = 0; px < 48; px++) {
      const py2 = Math.sin(px * 0.4) * 14 + 26;
      if (px === 0) ctx.moveTo(x + 6 + px, y + 6 + py2);
      else ctx.lineTo(x + 6 + px, y + 6 + py2);
    }
    ctx.stroke();
    // Knobs
    for (let k = 0; k < 3; k++) {
      rect(x + 58 + k * 7, y + 12, 6, 6, '#444');
      rect(x + 59 + k * 7, y + 13, 4, 4, '#888');
    }
  }

  function drawSteveJobs(x, y, scale) {
    const s = scale || 1;
    const ps = 4 * s;
    // Head
    rect(x, y, 32*s, 32*s, '#F8C890');
    // Hair (dark)
    rect(x, y, 32*s, 10*s, '#2A1800');
    rect(x, y, 6*s, 20*s, '#2A1800');
    // Eyes
    rect(x + 8*s, y + 14*s, 5*s, 5*s, C.WHITE);
    rect(x + 10*s, y + 15*s, 3*s, 3*s, '#1A1A1A');
    rect(x + 19*s, y + 14*s, 5*s, 5*s, C.WHITE);
    rect(x + 21*s, y + 15*s, 3*s, 3*s, '#1A1A1A');
    // Glasses
    ctx.strokeStyle = '#333';
    ctx.lineWidth = s;
    ctx.strokeRect(x + 7*s, y + 13*s, 8*s, 7*s);
    ctx.strokeRect(x + 18*s, y + 13*s, 8*s, 7*s);
    ctx.beginPath();
    ctx.moveTo(x + 15*s, y + 16*s);
    ctx.lineTo(x + 18*s, y + 16*s);
    ctx.stroke();
    // Smile
    ctx.beginPath();
    ctx.arc(x + 16*s, y + 23*s, 6*s, 0.2, Math.PI - 0.2);
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = s;
    ctx.stroke();
    // Turtleneck (black)
    rect(x - 4*s, y + 32*s, 40*s, 8*s, '#1A1A1A');
    // Body (jeans)
    rect(x, y + 40*s, 32*s, 48*s, '#2B4A7E');
    // Arms
    rect(x - 8*s, y + 40*s, 10*s, 40*s, '#1A1A1A');
    rect(x + 30*s, y + 40*s, 10*s, 40*s, '#1A1A1A');
    // Shoes
    rect(x - 2*s, y + 88*s, 18*s, 10*s, '#111');
    rect(x + 16*s, y + 88*s, 18*s, 10*s, '#111');
  }

  function drawWozniak(x, y, scale) {
    const s = scale || 1;
    // Head (bigger/rounder)
    rect(x, y, 40*s, 36*s, '#F0C080');
    // Beard/hair
    rect(x, y, 40*s, 12*s, '#6B4020');
    rect(x, y + 24*s, 40*s, 12*s, '#8B5A2A');
    // Eyes
    rect(x + 8*s, y + 14*s, 6*s, 6*s, C.WHITE);
    rect(x + 10*s, y + 16*s, 3*s, 3*s, '#1A1A1A');
    rect(x + 26*s, y + 14*s, 6*s, 6*s, C.WHITE);
    rect(x + 28*s, y + 16*s, 3*s, 3*s, '#1A1A1A');
    // Big smile
    ctx.beginPath();
    ctx.arc(x + 20*s, y + 28*s, 8*s, 0.1, Math.PI - 0.1);
    ctx.strokeStyle = '#8B4513';
    ctx.lineWidth = s * 2;
    ctx.stroke();
    // Plaid shirt
    rect(x - 4*s, y + 36*s, 48*s, 56*s, '#8B2020');
    for (let i = 0; i < 6; i++) rect(x - 4*s + i * 8*s, y + 36*s, 2*s, 56*s, '#FF4444');
    for (let i = 0; i < 8; i++) rect(x - 4*s, y + 36*s + i * 8*s, 48*s, 2*s, '#FF4444');
    // Jeans
    rect(x, y + 92*s, 40*s, 30*s, '#1A3A6E');
    // Shoes
    rect(x - 2*s, y + 118*s, 18*s, 10*s, '#333');
    rect(x + 22*s, y + 118*s, 20*s, 10*s, '#333');
  }

  function drawMainframe(x, y) {
    rect(x, y, 180, 260, '#CCCCCC');
    rect(x + 4, y + 4, 172, 252, '#BBBBBB');
    // Disk drives
    for (let i = 0; i < 4; i++) {
      rect(x + 10, y + 10 + i * 50, 80, 42, '#888');
      rect(x + 15, y + 16 + i * 50, 70, 30, '#555');
      rect(x + 80, y + 24 + i * 50, 14, 14, '#00DD00');
    }
    // Status lights
    for (let i = 0; i < 6; i++)
      rect(x + 110, y + 10 + i * 30, 12, 12, ['#F00','#0F0','#FF0','#0F0','#F80','#0F0'][i]);
  }

  function drawWorkstation(x, y) {
    // Monitor
    rect(x, y - 80, 100, 72, '#C8C8C8');
    rect(x + 8, y - 72, 84, 56, '#001010');
    // Green screen text
    ctx.font = '6px monospace';
    ctx.fillStyle = '#00FF80';
    ['SYS>', 'RUN>', 'OK >', '...>'].forEach((l, i) => ctx.fillText(l, x + 10, y - 66 + i * 12));
    // Stand
    rect(x + 44, y - 8, 12, 12, '#A0A0A0');
    // Keyboard
    rect(x - 10, y, 120, 28, '#D0D0D0');
    for (let r2 = 0; r2 < 3; r2++)
      for (let c2 = 0; c2 < 10; c2++)
        rect(x - 5 + c2 * 11, y + 4 + r2 * 8, 9, 6, '#E8E8E8');
  }

  function drawCircuitDiagram(x, y) {
    rect(x, y, 200, 160, '#F5F5DC');
    rect(x, y, 200, 160, null, '#999', 2);
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    // Traces
    ctx.beginPath();
    ctx.moveTo(x + 20, y + 40); ctx.lineTo(x + 80, y + 40);
    ctx.moveTo(x + 80, y + 40); ctx.lineTo(x + 80, y + 80);
    ctx.moveTo(x + 80, y + 80); ctx.lineTo(x + 160, y + 80);
    ctx.moveTo(x + 20, y + 120); ctx.lineTo(x + 160, y + 120);
    ctx.moveTo(x + 20, y + 40); ctx.lineTo(x + 20, y + 120);
    ctx.stroke();
    // Components
    drawResistorSymbol(x + 36, y + 35);
    drawCapSymbol(x + 75, y + 55);
    // Component labels
    ctx.font = '8px monospace';
    ctx.fillStyle = '#333';
    ctx.fillText('R1', x + 36, y + 30);
    ctx.fillText('C1', x + 78, y + 70);
  }

  function drawResistorSymbol(x, y) {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, 28, 10);
    ctx.beginPath();
    ctx.moveTo(x - 10, y + 5); ctx.lineTo(x, y + 5);
    ctx.moveTo(x + 28, y + 5); ctx.lineTo(x + 38, y + 5);
    ctx.stroke();
  }

  function drawCapSymbol(x, y) {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(x, y); ctx.lineTo(x, y + 10);
    ctx.moveTo(x + 6, y); ctx.lineTo(x + 6, y + 10);
    ctx.moveTo(x - 8, y + 5); ctx.lineTo(x, y + 5);
    ctx.moveTo(x + 6, y + 5); ctx.lineTo(x + 14, y + 5);
    ctx.stroke();
  }

  function drawXeroxAlto(x, y) {
    // Tall box body
    rect(x, y, 80, 120, '#DDDDCC');
    // Screen
    rect(x + 6, y + 6, 68, 60, '#002000');
    // CRT glow
    rect(x + 8, y + 8, 64, 56, '#004800');
    // Mouse (on desk)
    rect(x + 10, y + 130, 24, 16, '#CCC');
    // Keyboard
    rect(x - 20, y + 128, 110, 22, '#DDD');
    // Label
    ctx.font = '8px monospace';
    ctx.fillStyle = '#666';
    ctx.fillText('ALTO', x + 26, y + 116);
  }

  function drawRainbowApple(x, y, scale) {
    const s = scale || 1;
    // Apple shape drawn as stacked rectangles
    const stripes = [
      { y: 0, h: 10, col: '#74C043' },  // green top
      { y: 10, h: 10, col: '#FDB913' }, // yellow
      { y: 20, h: 10, col: '#F5821F' }, // orange
      { y: 30, h: 10, col: '#E2393B' }, // red
      { y: 40, h: 10, col: '#A958A5' }, // purple
      { y: 50, h: 10, col: '#0091CD' }, // blue
    ];
    // Apple silhouette mask (approximate)
    const appleW = 60 * s, appleH = 72 * s;
    // Left bump (apple leaf)
    rect(x + 34*s, y - 10*s, 12*s, 12*s, '#74C043');
    // Apple body
    ctx.save();
    ctx.beginPath();
    // Rough apple shape
    ctx.moveTo(x + 10*s, y + 5*s);
    ctx.bezierCurveTo(x, y, x, y + 30*s, x + 10*s, y + 50*s);
    ctx.bezierCurveTo(x + 20*s, y + 70*s, x + 30*s, y + 75*s, x + 30*s, y + 75*s);
    ctx.bezierCurveTo(x + 30*s, y + 75*s, x + 40*s, y + 70*s, x + 50*s, y + 50*s);
    ctx.bezierCurveTo(x + 60*s, y + 30*s, x + 60*s, y, x + 50*s, y + 5*s);
    ctx.bezierCurveTo(x + 40*s, y - 2*s, x + 35*s, y, x + 30*s, y + 5*s);
    ctx.bezierCurveTo(x + 25*s, y, x + 20*s, y - 2*s, x + 10*s, y + 5*s);
    ctx.closePath();
    stripes.forEach(stripe => {
      ctx.save();
      ctx.clip();
      ctx.fillStyle = stripe.col;
      ctx.fillRect(x, y + stripe.y * s, appleW + 10*s, stripe.h * s);
      ctx.restore();
      ctx.beginPath();
      ctx.moveTo(x + 10*s, y + 5*s);
      ctx.bezierCurveTo(x, y, x, y + 30*s, x + 10*s, y + 50*s);
      ctx.bezierCurveTo(x + 20*s, y + 70*s, x + 30*s, y + 75*s, x + 30*s, y + 75*s);
      ctx.bezierCurveTo(x + 30*s, y + 75*s, x + 40*s, y + 70*s, x + 50*s, y + 50*s);
      ctx.bezierCurveTo(x + 60*s, y + 30*s, x + 60*s, y, x + 50*s, y + 5*s);
      ctx.bezierCurveTo(x + 40*s, y - 2*s, x + 35*s, y, x + 30*s, y + 5*s);
      ctx.bezierCurveTo(x + 25*s, y, x + 20*s, y - 2*s, x + 10*s, y + 5*s);
      ctx.closePath();
    });
    ctx.restore();
  }

  function drawFuturePhone(x, y) {
    // Holographic phone outline
    ctx.strokeStyle = '#00FCFC';
    ctx.lineWidth = 3;
    ctx.shadowColor = '#00FCFC';
    ctx.shadowBlur = 10;
    // Phone body
    ctx.strokeRect(x, y, 80, 160);
    // Screen area
    ctx.strokeStyle = '#0088FF';
    ctx.strokeRect(x + 5, y + 15, 70, 125);
    // Dynamic Island
    ctx.fillStyle = '#00FCFC40';
    ctx.fillRect(x + 27, y + 20, 26, 10);
    // Holographic display content
    ctx.fillStyle = '#00FCFC20';
    ctx.fillRect(x + 5, y + 35, 70, 100);
    // App icons (grid)
    const iconColors = ['#FF6060', '#60FF60', '#6060FF', '#FFFF60',
                        '#FF60FF', '#60FFFF', '#FF8020', '#20FF80'];
    iconColors.forEach((c, i) => {
      ctx.fillStyle = c + '80';
      ctx.fillRect(x + 10 + (i % 4) * 16, y + 40 + Math.floor(i / 4) * 16, 12, 12);
    });
    // Bottom bar
    ctx.strokeStyle = '#00FCFC';
    ctx.strokeRect(x + 25, y + 148, 30, 6);
    ctx.shadowBlur = 0;
  }

  function drawCloud(x, y) {
    ctx.fillStyle = '#FFFFFF';
    [
      [0, 12, 40, 24], [-20, 20, 50, 20], [20, 18, 44, 20], [16, 28, 48, 16]
    ].forEach(([dx, dy, w, h]) => {
      ctx.beginPath();
      ctx.ellipse(x + dx + w/2, y + dy, w/2, h/2, 0, 0, Math.PI * 2);
      ctx.fill();
    });
  }

  function drawTree(x, y) {
    rect(x + 16, y + 40, 8, 50, '#6B4423');
    ctx.fillStyle = '#2A7020';
    ctx.beginPath();
    ctx.moveTo(x + 20, y); ctx.lineTo(x + 40, y + 50); ctx.lineTo(x, y + 50);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = '#3A8830';
    ctx.beginPath();
    ctx.moveTo(x + 20, y + 20); ctx.lineTo(x + 44, y + 64); ctx.lineTo(x - 4, y + 64);
    ctx.closePath(); ctx.fill();
  }

  /* ---- PRODUCT PIXEL ART ---- */
  function drawProductArt(levelIndex, x, y) {
    const drawings = [
      drawMac128K, drawMacPlus, drawMacII, drawMacPortable, drawPowerBook,
      drawPowerMac, drawIMacG3, drawIPod, drawIPhone, drawFuturePhone2026
    ];
    if (drawings[levelIndex]) drawings[levelIndex](x, y);
  }

  function drawMac128K(x, y) {
    // Classic 128K Mac
    rect(x, y, 120, 140, '#C8C0A8');
    rect(x + 4, y + 4, 112, 132, '#B8B0A0');
    // Screen bezel
    rect(x + 14, y + 12, 92, 80, '#555');
    // Screen
    rect(x + 16, y + 14, 88, 76, '#002010');
    // Mac face glow
    const grad = ctx.createRadialGradient(x+60, y+52, 0, x+60, y+52, 50);
    grad.addColorStop(0, '#004820'); grad.addColorStop(1, '#001008');
    ctx.fillStyle = grad; ctx.fillRect(x+16, y+14, 88, 76);
    // Apple logo (small)
    const stripes2 = ['#74C043','#FDB913','#F5821F','#E2393B','#A958A5','#0091CD'];
    stripes2.forEach((c, i) => rect(x + 88, y + 20 + i * 5, 20, 5, c));
    // Disk slot
    rect(x + 24, y + 100, 70, 12, '#888');
    rect(x + 26, y + 102, 66, 8, '#444');
    // Speaker grille (dots)
    for (let r2 = 0; r2 < 3; r2++)
      for (let c2 = 0; c2 < 4; c2++)
        rect(x + 24 + c2 * 10, y + 118 + r2 * 5, 4, 3, '#999');
    // Base
    rect(x + 10, y + 136, 100, 8, '#A0987E');
  }

  function drawMacPlus(x, y) {
    drawMac128K(x, y);
    // Plus has rear SCSI port indicator
    rect(x, y + 50, 6, 8, '#888');
    ctx.font = '7px monospace';
    ctx.fillStyle = '#FBE830';
    ctx.fillText('PLUS', x + 8, y + 150);
  }

  function drawMacII(x, y) {
    // Horizontal tower Mac
    rect(x, y + 40, 180, 50, '#C8C0A8');
    rect(x + 4, y + 44, 172, 42, '#B8B0A0');
    // Power light
    rect(x + 8, y + 56, 10, 10, '#00FF00');
    // Disk drives
    rect(x + 24, y + 48, 60, 18, '#888');
    rect(x + 26, y + 50, 56, 14, '#444');
    rect(x + 90, y + 48, 60, 18, '#888');
    // External color monitor
    rect(x + 10, y - 40, 150, 90, '#D0C8B0');
    rect(x + 18, y - 32, 130, 72, '#002010');
    const cg2 = ctx.createRadialGradient(x+82, y+4, 0, x+82, y+4, 70);
    cg2.addColorStop(0, '#203060'); cg2.addColorStop(1, '#000820');
    ctx.fillStyle = cg2; ctx.fillRect(x+18, y-32, 130, 72);
    ctx.font = '7px monospace';
    ctx.fillStyle = '#FBE830';
    ctx.fillText('Mac II', x + 8, y + 100);
  }

  function drawMacPortable(x, y) {
    // Portable — thick laptop
    rect(x, y, 180, 20, '#B0A888');  // lid back
    rect(x + 10, y + 4, 160, 14, '#002000'); // screen
    rect(x, y + 22, 180, 80, '#C8C0A8'); // base
    // Keyboard
    for (let r2 = 0; r2 < 4; r2++)
      for (let c2 = 0; c2 < 10; c2++)
        rect(x + 10 + c2 * 16, y + 28 + r2 * 14, 13, 11, '#E0D8C0');
    // Trackball
    rect(x + 130, y + 70, 30, 24, '#D0C8B0');
    ctx.beginPath();
    ctx.arc(x + 145, y + 82, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#888';
    ctx.fill();
    ctx.font = '7px monospace';
    ctx.fillStyle = '#FBE830';
    ctx.fillText('PORTABLE', x + 4, y + 115);
  }

  function drawPowerBook(x, y) {
    // Clean thin(ner) laptop
    rect(x, y, 180, 18, '#909080');
    rect(x + 8, y + 3, 164, 13, '#001818');
    rect(x, y + 20, 180, 75, '#C0B8A0');
    for (let r2 = 0; r2 < 4; r2++)
      for (let c2 = 0; c2 < 12; c2++)
        rect(x + 8 + c2 * 13, y + 25 + r2 * 14, 11, 11, '#D8D0B8');
    // Trackball built-in (centered below keyboard)
    rect(x + 74, y + 80, 32, 10, '#AAA');
    ctx.beginPath();
    ctx.arc(x + 90, y + 85, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#888'; ctx.fill();
    ctx.font = '7px monospace';
    ctx.fillStyle = '#FBE830';
    ctx.fillText('POWERBOOK 100', x + 4, y + 108);
  }

  function drawPowerMac(x, y) {
    // Tower
    rect(x + 30, y, 80, 160, '#C8C0B0');
    rect(x + 34, y + 4, 72, 152, '#B8B0A0');
    rect(x + 40, y + 20, 30, 16, '#888');
    rect(x + 42, y + 22, 26, 12, '#444');
    rect(x + 40, y + 44, 30, 16, '#888');
    rect(x + 42, y + 46, 26, 12, '#444');
    for (let i = 0; i < 4; i++) rect(x + 40, y + 66 + i * 8, 8, 6, i%2 ? '#0F0' : '#080');
    // PCI slots
    for (let i = 0; i < 6; i++) rect(x + 80, y + 60 + i * 14, 22, 8, '#666');
    // Monitor
    rect(x - 10, y - 60, 150, 80, '#D0C8B0');
    rect(x - 2, y - 54, 130, 64, '#000820');
    ctx.font = '7px monospace';
    ctx.fillStyle = '#FBE830';
    ctx.fillText('POWER MAC', x + 24, y + 172);
  }

  function drawIMacG3(x, y) {
    // Bondi blue teardrop shape
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(x + 80, y + 90, 80, 95, 0, 0, Math.PI * 2);
    ctx.fillStyle = '#0088BB';
    ctx.fill();
    // Translucent overlay
    const tg = ctx.createRadialGradient(x + 60, y + 60, 0, x + 80, y + 90, 100);
    tg.addColorStop(0, 'rgba(100,220,255,0.4)');
    tg.addColorStop(1, 'rgba(0,80,120,0.1)');
    ctx.fillStyle = tg;
    ctx.fill();
    ctx.restore();
    // Screen
    rect(x + 22, y + 14, 116, 90, '#001820');
    const sg = ctx.createRadialGradient(x+80, y+59, 0, x+80, y+59, 60);
    sg.addColorStop(0, '#102040'); sg.addColorStop(1, '#000408');
    ctx.fillStyle = sg; ctx.fillRect(x+22, y+14, 116, 90);
    // Apple logo on back (visible as reflection)
    ctx.font = 'bold 16px monospace';
    ctx.fillStyle = 'rgba(255,255,255,0.3)';
    ctx.fillText('', x + 68, y + 80);
    // USB ports
    rect(x + 25, y + 164, 12, 8, '#0077AA');
    rect(x + 122, y + 164, 12, 8, '#0077AA');
    ctx.font = '7px monospace';
    ctx.fillStyle = '#FBE830';
    ctx.fillText('iMAC G3', x + 44, y + 185);
  }

  function drawIPod(x, y) {
    // Classic iPod
    rect(x + 20, y, 80, 130, '#F0F0F0');
    rect(x + 22, y + 2, 76, 126, '#E8E8E8');
    // Screen
    rect(x + 28, y + 8, 64, 50, '#001020');
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillStyle = '#88AAFF';
    ctx.fillText('iPod', x + 40, y + 36);
    // Click wheel
    ctx.beginPath();
    ctx.arc(x + 60, y + 100, 28, 0, Math.PI * 2);
    ctx.fillStyle = '#DDDDDD';
    ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 60, y + 100, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#F0F0F0';
    ctx.fill();
    // Navigation text
    ctx.font = '5px monospace';
    ctx.fillStyle = '#888';
    ctx.fillText('MENU', x + 49, y + 78);
    ctx.fillText('▶⏸', x + 50, y + 123);
    ctx.font = '7px monospace';
    ctx.fillStyle = '#FBE830';
    ctx.fillText('iPod (2001)', x + 16, y + 145);
  }

  function drawIPhone(x, y) {
    // Original iPhone
    rect(x + 20, y, 80, 150, '#1A1A1A');
    rect(x + 22, y + 2, 76, 146, '#111');
    // Screen (big for the time!)
    rect(x + 24, y + 16, 72, 100, '#001030');
    const ig = ctx.createRadialGradient(x+60, y+66, 0, x+60, y+66, 40);
    ig.addColorStop(0, '#1030A0'); ig.addColorStop(1, '#001030');
    ctx.fillStyle = ig; ctx.fillRect(x+24, y+16, 72, 100);
    // App icons
    const ic = ['#FF6600','#FF4444','#44BB44','#4488FF','#FFCC00','#AA44FF'];
    ic.forEach((c, i) => rect(x + 26 + (i%3)*22, y + 22 + Math.floor(i/3)*24, 18, 18, c));
    // Home button
    ctx.beginPath();
    ctx.arc(x + 60, y + 134, 12, 0, Math.PI * 2);
    ctx.fillStyle = '#333'; ctx.fill();
    ctx.beginPath();
    ctx.arc(x + 60, y + 134, 8, 0, Math.PI * 2);
    ctx.fillStyle = '#444'; ctx.fill();
    // Status bar
    rect(x + 24, y + 16, 72, 10, '#00000060');
    ctx.font = '7px monospace';
    ctx.fillStyle = '#FBE830';
    ctx.fillText('iPhone (2007)', x + 8, y + 162);
  }

  function drawFuturePhone2026(x, y) {
    // Futuristic phone with holographic display
    ctx.save();
    ctx.shadowColor = '#00FCFC';
    ctx.shadowBlur = 15;
    // Ultra thin body
    rect(x + 20, y, 80, 160, '#1A1A2A');
    ctx.shadowBlur = 0;
    ctx.restore();
    // Edge-to-edge screen
    rect(x + 22, y + 2, 76, 152, '#000028');
    // Holographic app grid
    const hc = ['#FF00FF','#00FFFF','#FF8800','#00FF44',
                 '#8800FF','#FF0044','#44FF00','#0088FF'];
    hc.forEach((c, i) => {
      ctx.fillStyle = c + 'AA';
      ctx.fillRect(x + 24 + (i%4)*17, y + 10 + Math.floor(i/4)*17, 14, 14);
    });
    // Dynamic island
    rect(x + 50, y + 8, 20, 8, '#1A1A1A');
    // Holographic glow
    ctx.save();
    const hg = ctx.createRadialGradient(x+60, y+80, 0, x+60, y+80, 80);
    hg.addColorStop(0, 'rgba(0,200,255,0.15)');
    hg.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = hg;
    ctx.fillRect(x+20, y, 80, 160);
    ctx.restore();
    ctx.font = '6px "Press Start 2P", monospace';
    ctx.fillStyle = '#00FCFC';
    ctx.fillText('iPHONE 2026', x + 6, y + 170);
  }

  /* ---- TITLE SCREEN ---- */
  function drawTitle(frame) {
    clear(C.BLACK);
    sceneGarage();

    // Dark overlay
    ctx.fillStyle = 'rgba(0,0,0,0.65)';
    ctx.fillRect(0, 0, W, H);

    // Title panel
    panel(40, 20, 720, 120, '#0A0025', C.PURPLE, 5);

    // Title text with rainbow color cycling
    const titleColors = [C.RED, C.ORANGE, C.YELLOW, C.GREEN, C.TBLUE, C.BLUE, C.PURPLE];
    const titleStr = 'PIRATES OF';
    const title2Str = 'SILICON VALLEY';
    shadowText(titleStr, W/2, 32, 22, titleColors[Math.floor(frame/8) % titleColors.length], 'center');
    shadowText(title2Str, W/2, 68, 22, titleColors[Math.floor(frame/8 + 3) % titleColors.length], 'center');

    // Subtitle
    shadowText('— THE GAME —', W/2, 108, 10, C.LGRAY, 'center');

    // Steve Jobs description
    panel(100, 155, 600, 80, '#001030', C.TBLUE, 3);
    text('YOU ARE STEVE JOBS — YEAR 1984', W/2, 165, 9, C.YELLOW, 'center');
    text('BUILD APPLE COMPUTERS THROUGH 10 LEVELS', W/2, 185, 8, C.WHITE, 'center');
    text('ELECTRONICS QUIZ + ACTION MINI-GAMES!', W/2, 203, 8, C.TGREEN, 'center');

    // Rainbow Apple logo
    drawRainbowApple(W/2 - 40, 250, 1.3);

    // Controls
    panel(120, 370, 560, 70, '#000820', C.NAVY, 3);
    text('PRESS  [ENTER]  OR  CLICK  TO  START', W/2, 382, 9, C.WHITE, 'center');
    text('KEYBOARD: 1 2 3 4  OR  CLICK  ANSWERS', W/2, 408, 8, C.LGRAY, 'center');

    // Blinking start prompt
    blinkText('▶  START GAME  ◀', W/2, 455, 12, C.YELLOW, 'center', frame);

    // Copyright
    text('© 2026  PIRATES OF SILICON VALLEY GAME', W/2, 510, 7, C.DGRAY, 'center');
    text('EDUCATIONAL RETRO EXPERIENCE', W/2, 530, 7, C.DGRAY, 'center');
  }

  /* ---- STORY SCREEN ---- */
  function drawStory(frame, page) {
    clear(C.BLACK);
    sceneGarage();
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(0, 0, W, H);

    const stories = [
      {
        title: 'THE STORY SO FAR...',
        lines: [
          'CUPERTINO, 1984.',
          '',
          'You are STEVE JOBS, a visionary',
          'in a garage with a dream:',
          'to put a computer in the hands',
          'of every person on Earth.',
          '',
          'But first — you need to understand',
          'the electronics that power it all!'
        ]
      },
      {
        title: 'YOUR MISSION',
        lines: [
          'SURVIVE 10 LEVELS of electronics',
          'questions — from basic capacitors',
          'to quantum computing.',
          '',
          'After each quiz, face an ACTION',
          'challenge: debug circuits, stop fires,',
          'or fix buggy software!',
          '',
          'Release a new Apple product each year!'
        ]
      },
      {
        title: 'HOW TO PLAY',
        lines: [
          'QUIZ PHASE: Answer 10 questions.',
          'Press  1, 2, 3 or 4  to answer.',
          'Or CLICK the answer button.',
          '',
          'You have 3 LIVES. Wrong answers',
          'cost you a life!',
          '',
          'ACTION PHASE: Interactive mini-game.',
          'Click or use keyboard to play!'
        ]
      }
    ];

    const s = stories[page] || stories[0];
    panel(40, 20, 720, 60, '#001030', C.TBLUE, 4);
    shadowText(s.title, W/2, 32, 13, C.YELLOW, 'center');

    panel(40, 90, 720, 360, '#000820', C.NAVY, 3);
    s.lines.forEach((line, i) => {
      const col = line === '' ? C.WHITE :
                  i === 0 ? C.YELLOW :
                  line.startsWith('QUIZ') || line.startsWith('ACTION') ? C.TGREEN : C.WHITE;
      text(line, W/2, 108 + i * 30, 10, col, 'center');
    });

    blinkText('▶  PRESS [ENTER] TO CONTINUE  ◀', W/2, 480, 10, C.YELLOW, 'center', frame);
    text(`STORY  ${page + 1} / 3`, W/2, 550, 8, C.DGRAY, 'center');
  }

  /* ---- LEVEL INTRO ---- */
  function drawLevelIntro(level, frame) {
    clear(C.BLACK);
    // Draw scene for this level
    drawBgScene(level.bgScene);
    ctx.fillStyle = 'rgba(0,0,0,0.70)';
    ctx.fillRect(0, 0, W, H);

    // Year badge
    panel(W/2 - 120, 15, 240, 55, '#001A00', '#00B800', 4);
    shadowText(`YEAR  ${level.year}`, W/2, 25, 16, C.YELLOW, 'center');

    // Level indicator
    panel(20, 15, 120, 55, '#1A0030', C.PURPLE, 3);
    text(`LEVEL ${level.num}`, 80, 25, 9, C.WHITE, 'center');
    text('OF 10', 80, 45, 9, C.LGRAY, 'center');

    // Product reveal panel
    panel(40, 85, 720, 100, '#001030', level.color || C.TBLUE, 4);
    shadowText('NEW PRODUCT RELEASED:', W/2, 96, 10, C.LGRAY, 'center');
    shadowText(level.product, W/2, 120, 14, level.color || C.YELLOW, 'center');
    text(level.tagline, W/2, 153, 9, C.LGRAY, 'center');

    // Product pixel art
    drawProductArt(level.num - 1, W/2 - 90, 195);

    // Level description
    panel(40, 380, 720, 80, '#000820', C.NAVY, 3);
    text(level.desc, W/2, 393, 8, C.WHITE, 'center');

    // Start prompt
    blinkText('▶  PRESS [ENTER] TO START QUIZ  ◀', W/2, 490, 10, C.YELLOW, 'center', frame);
    text('10 QUESTIONS  •  3 LIVES  •  BONUS ROUND AFTER!', W/2, 555, 7, C.TGREEN, 'center');
  }

  /* ---- QUIZ SCREEN ---- */
  function drawQuiz(level, question, qIndex, lives, score, frame, selectedAns, feedback) {
    clear(C.BLACK);
    drawBgScene(level.bgScene);
    ctx.fillStyle = 'rgba(0,0,0,0.72)';
    ctx.fillRect(0, 0, W, H);

    // HUD bar
    rect(0, 0, W, 56, '#000820');
    ctx.strokeStyle = C.TBLUE;
    ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(0, 56); ctx.lineTo(W, 56); ctx.stroke();

    // Level/Year
    text(`LVL ${level.num}  ${level.year}`, 12, 8, 9, C.TBLUE);
    // Question counter
    text(`Q  ${qIndex + 1} / 10`, W/2, 8, 9, C.YELLOW, 'center');
    // Score
    text(`SCORE: ${score}`, W - 12, 8, 9, C.TGREEN, 'right');
    // Lives
    const livesStr = '♥'.repeat(lives) + '♡'.repeat(3 - lives);
    text(livesStr, W/2, 30, 14, C.RED, 'center');

    // Question panel
    panel(30, 68, 740, 140, '#000820', C.TBLUE, 3);
    // Question number badge
    rect(30, 68, 56, 32, C.PURPLE);
    text(`Q${qIndex + 1}`, 58, 76, 11, C.WHITE, 'center');
    // Question text
    const lines = question.text.split('\n');
    lines.forEach((line, i) => {
      shadowText(line, W/2, 88 + i * 38, 14, C.WHITE, 'center');
    });

    // Feedback overlay (if answered)
    if (feedback) {
      const isCorrect = feedback === 'correct';
      const col = isCorrect ? C.GREEN : C.RED;
      const msg = isCorrect ? '✓ CORRECT!' : '✗ WRONG!';
      panel(30, 68, 740, 140, isCorrect ? '#002000' : '#200000', col, 4);
      lines.forEach((line, i) => shadowText(line, W/2, 88 + i * 38, 14, col, 'center'));
      // Show correct answer
      if (!isCorrect) {
        text(`CORRECT: ${question.opts[question.ans]}`, W/2, 160, 8, C.GREEN, 'center');
      }
      // Hint
      panel(30, 220, 740, 72, '#001810', C.TGREEN, 2);
      text('HINT:', 48, 230, 8, C.YELLOW);
      text(question.hint, W/2, 248, 8, C.TGREEN, 'center');
    }

    // Answer options (drawn as canvas elements — actual click handled by HTML buttons)
    if (!feedback) {
      const optColors = [C.YELLOW, C.TGREEN, '#F878F8', C.ORANGE];
      const prefixes = ['1.', '2.', '3.', '4.'];
      question.opts.forEach((opt, i) => {
        const bx = 30, by = 230 + i * 70, bw = 740, bh = 62;
        // Background
        rect(bx, by, bw, bh, '#080820');
        rect(bx, by, bw, bh, null, C.NAVY, 2);
        // Letter badge
        rect(bx, by, 52, bh, '#001850');
        text(prefixes[i], bx + 26, by + 20, 12, optColors[i], 'center');
        // Option text
        const optLines = opt.split('\n');
        optLines.forEach((ol, oi) => {
          text(ol, bx + 66, by + 14 + oi * 22, 10, C.WHITE);
        });
      });
    }
  }

  /* ---- ACTION INTRO ---- */
  function drawActionIntro(level, frame) {
    clear(C.BLACK);
    drawBgScene(level.bgScene);
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(0, 0, W, H);

    panel(40, 30, 720, 72, '#200000', C.RED, 5);
    shadowText('⚡ ACTION PHASE! ⚡', W/2, 44, 16, C.RED, 'center');
    text(`LEVEL ${level.num}  —  ${level.year}`, W/2, 80, 10, C.ORANGE, 'center');

    panel(40, 120, 720, 180, '#001030', C.TBLUE, 3);
    const mgLines = level.mgDesc.split('\n');
    mgLines.forEach((line, i) => {
      const col = i === 0 ? C.YELLOW : i === 1 ? C.WHITE : C.TGREEN;
      shadowText(line, W/2, 138 + i * 44, 13, col, 'center');
    });

    // Mini-game type icon
    const icons = { schematic: '🔌', fire: '🔥', code: '💻' };
    text(icons[level.miniGame] || '⚡', W/2, 320, 48, C.WHITE, 'center');

    panel(120, 390, 560, 60, '#001810', C.GREEN, 3);
    text('SURVIVE THE CHALLENGE!', W/2, 402, 10, C.GREEN, 'center');
    text('HIGH SCORE BONUS ON COMPLETION!', W/2, 424, 8, C.TGREEN, 'center');

    blinkText('▶  PRESS [ENTER] TO BEGIN  ◀', W/2, 490, 11, C.YELLOW, 'center', frame);
  }

  /* ---- HUD for mini-game ---- */
  function drawMiniGameHUD(level, timeLeft, mgScore, maxTime) {
    // Timer bar
    const barW = W - 100;
    const pct = Math.max(0, timeLeft / maxTime);
    const barCol = pct > 0.6 ? C.GREEN : pct > 0.3 ? C.YELLOW : C.RED;
    rect(50, 5, barW, 20, C.DGRAY);
    rect(50, 5, barW * pct, 20, barCol);
    rect(50, 5, barW, 20, null, '#666', 2);
    text(`TIME: ${timeLeft}s`, W/2, 7, 8, C.WHITE, 'center');
    text(`SCORE: ${mgScore}`, W - 12, 7, 8, C.YELLOW, 'right');
    text(`LVL ${level.num}`, 12, 7, 8, C.TBLUE);
  }

  /* ---- ACTION RESULT ---- */
  function drawActionResult(level, mgScore, passed, frame) {
    clear(C.BLACK);
    drawBgScene(level.bgScene);
    ctx.fillStyle = 'rgba(0,0,0,0.75)';
    ctx.fillRect(0, 0, W, H);

    const col = passed ? C.GREEN : C.RED;
    const msg = passed ? '✓ CHALLENGE COMPLETE!' : '✗ CHALLENGE FAILED!';
    panel(40, 30, 720, 72, passed ? '#002000' : '#200000', col, 5);
    shadowText(msg, W/2, 48, 13, col, 'center');

    panel(40, 120, 720, 200, '#001030', C.TBLUE, 3);
    text('ACTION PHASE SCORE:', W/2, 140, 10, C.LGRAY, 'center');
    shadowText(`${mgScore} pts`, W/2, 178, 28, C.YELLOW, 'center');
    text(passed ? 'EXCELLENT WORK, JOBS!' : 'KEEP PRACTICING!', W/2, 250, 10, col, 'center');

    blinkText('▶  PRESS [ENTER] TO CONTINUE  ◀', W/2, 350, 10, C.YELLOW, 'center', frame);
  }

  /* ---- LEVEL COMPLETE ---- */
  function drawLevelComplete(level, quizScore, mgScore, totalScore, lives, frame) {
    clear(C.BLACK);
    drawBgScene(level.bgScene);
    ctx.fillStyle = 'rgba(0,0,0,0.7)';
    ctx.fillRect(0, 0, W, H);

    // Stars (based on lives remaining)
    panel(40, 20, 720, 70, '#001A00', C.GREEN, 5);
    shadowText('✓ LEVEL COMPLETE!', W/2, 32, 16, C.GREEN, 'center');
    shadowText(level.product, W/2, 64, 11, C.YELLOW, 'center');

    // Stars
    const stars = lives === 3 ? 3 : lives === 2 ? 2 : 1;
    const starStr = '★'.repeat(stars) + '☆'.repeat(3 - stars);
    shadowText(starStr, W/2, 108, 28, C.YELLOW, 'center');

    // Score breakdown
    panel(40, 160, 720, 180, '#001030', C.TBLUE, 3);
    text('QUIZ SCORE:', 80, 180, 10, C.LGRAY);
    text(`${quizScore}`, W - 80, 180, 10, C.YELLOW, 'right');
    text('ACTION SCORE:', 80, 212, 10, C.LGRAY);
    text(`${mgScore}`, W - 80, 212, 10, C.ORANGE, 'right');
    text('LIVES BONUS:', 80, 244, 10, C.LGRAY);
    text(`${lives * 100}`, W - 80, 244, 10, C.TGREEN, 'right');
    ctx.strokeStyle = C.TBLUE; ctx.lineWidth = 2;
    ctx.beginPath(); ctx.moveTo(80, 284); ctx.lineTo(W - 80, 284); ctx.stroke();
    text('TOTAL THIS LEVEL:', 80, 294, 10, C.WHITE);
    shadowText(`${totalScore}`, W - 80, 294, 10, C.YELLOW, 'right');

    // Product art
    drawProductArt(level.num - 1, W/2 - 60, 350);

    blinkText(level.num < 10 ? '▶  PRESS [ENTER] FOR NEXT LEVEL  ◀' :
              '▶  PRESS [ENTER] FOR FINAL RESULT  ◀',
              W/2, 510, 9, C.YELLOW, 'center', frame);
  }

  /* ---- GAME OVER ---- */
  function drawGameOver(score, frame) {
    clear(C.BLACK);
    // Flickering red
    if (Math.floor(frame / 6) % 2 === 0) {
      ctx.fillStyle = 'rgba(100,0,0,0.15)';
      ctx.fillRect(0, 0, W, H);
    }

    panel(60, 80, 680, 120, '#200000', C.RED, 6);
    shadowText('GAME  OVER', W/2, 104, 28, C.RED, 'center');
    text('"You got fired. Again."', W/2, 174, 9, C.ORANGE, 'center');

    panel(100, 240, 600, 80, '#001030', C.NAVY, 3);
    text('FINAL SCORE:', W/2, 258, 10, C.LGRAY, 'center');
    shadowText(`${score}  pts`, W/2, 282, 16, C.YELLOW, 'center');

    panel(100, 350, 600, 80, '#001810', C.TGREEN, 3);
    text('STEVE JOBS WAS NEVER AFRAID', W/2, 365, 9, C.WHITE, 'center');
    text('TO TRY AGAIN. NEITHER SHOULD YOU!', W/2, 388, 8, C.TGREEN, 'center');

    blinkText('▶  PRESS [ENTER] TO RETRY  ◀', W/2, 480, 11, C.YELLOW, 'center', frame);
  }

  /* ---- VICTORY ---- */
  function drawVictory(totalScore, frame) {
    clear(C.BLACK);
    sceneStage();
    ctx.fillStyle = 'rgba(0,0,0,0.65)';
    ctx.fillRect(0, 0, W, H);

    // Celebration flicker
    const cols = [C.YELLOW, C.TGREEN, C.PINK, C.TBLUE, C.ORANGE];
    panel(30, 10, 740, 90, '#001A00', cols[Math.floor(frame/10) % cols.length], 5);
    shadowText('YOU WIN!', W/2, 22, 24, C.YELLOW, 'center');
    shadowText('APPLE 2026 VISION PHONE LAUNCHED!', W/2, 66, 9, C.TGREEN, 'center');

    // Apple product timeline
    panel(30, 115, 740, 200, '#000820', C.NAVY, 3);
    text('YOUR APPLE LEGACY:', W/2, 126, 9, C.LGRAY, 'center');
    const products = [
      '1984 Mac 128K  •  1986 Mac Plus  •  1987 Mac II',
      '1989 Portable  •  1991 PowerBook  •  1994 Power Mac',
      '1998 iMac G3  •  2001 iPod+OSX  •  2007 iPhone',
      '2026 Future iPhone Vision  ★  COMPLETE!'
    ];
    products.forEach((p, i) => {
      const pc = i === 3 ? C.YELLOW : C.WHITE;
      text(p, W/2, 152 + i * 36, 8, pc, 'center');
    });

    // Final score
    panel(100, 330, 600, 100, '#001A00', C.GREEN, 4);
    text('FINAL SCORE:', W/2, 347, 10, C.LGRAY, 'center');
    shadowText(`${totalScore}  pts`, W/2, 374, 20, C.YELLOW, 'center');

    // Future phone art
    drawFuturePhone2026(630, 340);

    // Quote
    panel(30, 450, 740, 60, '#1A1000', C.YELLOW, 2);
    text('"Stay Hungry, Stay Foolish."', W/2, 463, 9, C.YELLOW, 'center');
    text('— Steve Jobs', W/2, 490, 8, C.LGRAY, 'center');

    blinkText('▶  PRESS [ENTER] TO PLAY AGAIN  ◀', W/2, 538, 9, C.TGREEN, 'center', frame);
  }

  /* ---- Background scene dispatcher ---- */
  function drawBgScene(sceneName) {
    switch (sceneName) {
      case 'garage':    sceneGarage(); break;
      case 'lab':       sceneLab(); break;
      case 'xerox':     sceneXerox(); break;
      case 'apple_hq':  sceneAppleHQ(); break;
      case 'stage':     sceneStage(); break;
      case 'future':    sceneFuture(); break;
      default:          clear(C.NAVY); break;
    }
  }

  /* ---- Expose public API ---- */
  return {
    init, clear, rect, text, shadowText, blinkText, panel, sprite,
    drawTitle, drawStory, drawLevelIntro, drawQuiz,
    drawActionIntro, drawMiniGameHUD, drawActionResult,
    drawLevelComplete, drawGameOver, drawVictory,
    drawBgScene, drawProductArt, C, W: () => W, H: () => H
  };
})();
