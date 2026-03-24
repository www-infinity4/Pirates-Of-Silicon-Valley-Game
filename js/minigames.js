/* ==========================================================
   PIRATES OF SILICON VALLEY — MINI-GAMES
   Three action-phase mini-games:
     1. SchematicGame  — find the broken component
     2. FireGame       — click overheating components
     3. CodeGame       — find the buggy line of code
   ========================================================== */

'use strict';

/* ============================================================
   1. SCHEMATIC GAME — Find the broken component
   ============================================================ */
const SchematicGame = (() => {

  const COMP_TYPES = ['R', 'C', 'L', 'Q', 'U', 'D', 'V', 'GND'];
  const COMP_LABELS = { R:'Resistor', C:'Capacitor', L:'Inductor', Q:'Transistor', U:'IC', D:'Diode', V:'Power', GND:'Ground' };
  const COMP_COLORS = { R:'#F83800', C:'#0058F8', L:'#6844FC', Q:'#00B800', U:'#FBE830', D:'#E45C10', V:'#F878F8', GND:'#3CBCFC' };

  let components = [];
  let brokenIdx = -1;
  let found = false;
  let timeLeft = 30;
  let score = 0;
  let timer = null;
  let levelNum = 1;
  let onComplete = null;
  let canvas = null;
  let ctx = null;

  /* Generate components for the given level */
  function generate(lvl) {
    components = [];
    const count = 6 + Math.min(lvl, 6);
    const cols = 4, rows = Math.ceil(count / cols);
    const startX = 60, startY = 90, gapX = 170, gapY = 110;
    for (let i = 0; i < count; i++) {
      const type = COMP_TYPES[i % COMP_TYPES.length];
      const valOpts = { R: ['10kΩ','22kΩ','47kΩ','100Ω'], C: ['100pF','47μF','10μF','220μF'],
                        L: ['10μH','47μH','100μH'], Q: ['NPN','PNP','MOSFET'],
                        U: ['74LS04','74LS08','555','4017'], D: ['1N4148','1N4007','Zener'],
                        V: ['+5V','+12V','3.3V'], GND: ['GND'] };
      const vals = valOpts[type] || ['?'];
      components.push({
        x: startX + (i % cols) * gapX,
        y: startY + Math.floor(i / cols) * gapY,
        type, val: vals[Math.floor(Math.random() * vals.length)],
        w: 140, h: 80,
        broken: false, clicked: false
      });
    }
    brokenIdx = Math.floor(Math.random() * components.length);
    components[brokenIdx].broken = true;
    found = false;
    timeLeft = Math.max(20, 35 - lvl * 2);
    score = 0;
    levelNum = lvl;
  }

  function start(cvs, lvl, cb) {
    canvas = cvs;
    ctx = cvs.getContext('2d');
    generate(lvl);
    onComplete = cb;
    clearInterval(timer);
    timer = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(timer);
        render();
        setTimeout(() => cb(score, false), 800);
      } else {
        render();
      }
    }, 1000);
    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchend', handleTouch);
    render();
  }

  function stop() {
    clearInterval(timer);
    if (canvas) {
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchend', handleTouch);
    }
  }

  function handleTouch(e) {
    e.preventDefault();
    const t = e.changedTouches[0];
    const rect2 = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect2.width;
    const scaleY = canvas.height / rect2.height;
    handleAt((t.clientX - rect2.left) * scaleX, (t.clientY - rect2.top) * scaleY);
  }

  function handleClick(e) {
    const rect2 = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect2.width;
    const scaleY = canvas.height / rect2.height;
    handleAt((e.clientX - rect2.left) * scaleX, (e.clientY - rect2.top) * scaleY);
  }

  function handleAt(mx, my) {
    if (found) return;
    components.forEach((c, i) => {
      if (mx >= c.x && mx <= c.x + c.w && my >= c.y && my <= c.y + c.h) {
        c.clicked = true;
        if (i === brokenIdx) {
          found = true;
          score = Math.max(100, timeLeft * 40);
          Audio.playBugFound();
          clearInterval(timer);
          render();
          setTimeout(() => {
            stop();
            onComplete(score, true);
          }, 1200);
        } else {
          Audio.playWrong();
          score = Math.max(0, score - 50);
          setTimeout(() => { c.clicked = false; render(); }, 400);
        }
      }
    });
  }

  function render() {
    const W = canvas.width, H = canvas.height;
    // Background
    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, W, H);

    // Title
    R.drawMiniGameHUD({ num: levelNum }, timeLeft, score, Math.max(20, 35 - levelNum * 2));

    ctx.font = '11px "Press Start 2P", monospace';
    ctx.fillStyle = '#FBE830';
    ctx.textAlign = 'center';
    ctx.fillText('FIND THE BROKEN COMPONENT — CLICK IT!', W/2, 50);

    // Draw circuit traces (connections)
    ctx.strokeStyle = '#1A3A1A';
    ctx.lineWidth = 2;
    for (let i = 0; i < components.length - 1; i++) {
      const a = components[i], b = components[i + 1];
      ctx.beginPath();
      ctx.moveTo(a.x + a.w/2, a.y + a.h/2);
      ctx.lineTo(b.x + b.w/2, b.y + b.h/2);
      ctx.stroke();
    }

    // Draw components
    components.forEach((c, i) => {
      const isBroken = c.broken;
      const isClicked = c.clicked;
      const isFound = found && isBroken;

      // Box background
      let bg = '#0A0A20', border = COMP_COLORS[c.type] || '#AAAAAA';
      if (isFound) { bg = '#002000'; border = '#00FF00'; }
      else if (isClicked) { bg = '#200000'; border = '#FF0000'; }

      ctx.fillStyle = bg;
      ctx.fillRect(c.x, c.y, c.w, c.h);
      ctx.strokeStyle = border;
      ctx.lineWidth = isFound ? 4 : 2;
      ctx.strokeRect(c.x, c.y, c.w, c.h);

      // Component symbol badge
      ctx.fillStyle = border;
      ctx.fillRect(c.x, c.y, 36, 26);
      ctx.font = 'bold 14px "Press Start 2P", monospace';
      ctx.fillStyle = '#000';
      ctx.textAlign = 'center';
      ctx.fillText(c.type, c.x + 18, c.y + 18);

      // Component label
      ctx.font = '9px "Press Start 2P", monospace';
      ctx.fillStyle = isFound ? '#00FF00' : '#FFFFFF';
      ctx.textAlign = 'left';
      ctx.fillText(COMP_LABELS[c.type] || c.type, c.x + 42, c.y + 18);

      // Component value
      ctx.font = '8px "Press Start 2P", monospace';
      ctx.fillStyle = isBroken && !found ? '#FF4444' : '#BCBCBC';
      ctx.fillText(c.val, c.x + 42, c.y + 38);

      // Broken indicator (hidden until found)
      if (isFound) {
        ctx.font = '9px "Press Start 2P", monospace';
        ctx.fillStyle = '#00FF00';
        ctx.textAlign = 'center';
        ctx.fillText('★ FOUND! ★', c.x + c.w/2, c.y + c.h - 8);
      }

      // Visual glitch for broken component (subtle flicker)
      if (isBroken && !found) {
        if (Math.floor(Date.now() / 300) % 3 === 0) {
          ctx.strokeStyle = '#FF444422';
          ctx.lineWidth = 2;
          ctx.strokeRect(c.x + 2, c.y + 2, c.w - 4, c.h - 4);
        }
      }
    });

    // Success overlay
    if (found) {
      ctx.fillStyle = 'rgba(0,100,0,0.3)';
      ctx.fillRect(0, 0, W, H);
      ctx.font = '18px "Press Start 2P", monospace';
      ctx.fillStyle = '#00FF00';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#00FF00';
      ctx.shadowBlur = 10;
      ctx.fillText('✓ SCHEMATIC FIXED!', W/2, H - 60);
      ctx.shadowBlur = 0;
    }
  }

  return { start, stop };
})();


/* ============================================================
   2. FIRE GAME — Click overheating components
   ============================================================ */
const FireGame = (() => {

  const PANEL_LABELS = ['CPU', 'RAM', 'HDD', 'PSU', 'GPU', 'NIC', 'SND', 'USB', 'PCB', 'CAP', 'BUS', 'ROM'];

  let panels = [];
  let timeLeft = 45;
  let score = 0;
  let timer = null;
  let heatTimer = null;
  let levelNum = 1;
  let onComplete = null;
  let canvas = null;
  let ctx = null;
  let explosions = [];
  let explodedCount = 0;
  const MAX_EXPLODED = 3;

  function generate(lvl) {
    panels = [];
    const count = 9 + Math.min(lvl, 3);
    const cols = 4;
    const rows = Math.ceil(count / cols);
    const startX = 60, startY = 90;
    const pw = 150, ph = 90, gapX = 170, gapY = 110;
    for (let i = 0; i < count; i++) {
      panels.push({
        x: startX + (i % cols) * gapX,
        y: startY + Math.floor(i / cols) * gapY,
        w: pw, h: ph,
        label: PANEL_LABELS[i % PANEL_LABELS.length],
        heat: 0,       // 0 = cool, 1-3 = warm, 4-6 = hot, 7+ = critical
        exploded: false,
        cooling: false
      });
    }
    timeLeft = 45;
    score = 0;
    levelNum = lvl;
    explosions = [];
    explodedCount = 0;
  }

  function start(cvs, lvl, cb) {
    canvas = cvs;
    ctx = cvs.getContext('2d');
    generate(lvl);
    onComplete = cb;

    clearInterval(timer);
    clearInterval(heatTimer);

    // Countdown timer
    timer = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        finish(false);
      } else {
        render();
      }
    }, 1000);

    // Heating timer — components heat up over time
    const heatInterval = Math.max(600, 2000 - lvl * 150);
    heatTimer = setInterval(() => {
      // Pick a random non-exploded panel and heat it
      const available = panels.filter(p => !p.exploded && p.heat < 9);
      if (available.length > 0) {
        const p = available[Math.floor(Math.random() * available.length)];
        p.heat += Math.ceil(Math.random() * 2);
        if (p.heat >= 9) {
          p.exploded = true;
          explodedCount++;
          explosions.push({ x: p.x + p.w/2, y: p.y + p.h/2, t: 0 });
          Audio.playExplosion();
          if (explodedCount >= MAX_EXPLODED) {
            clearInterval(timer);
            clearInterval(heatTimer);
            render();
            setTimeout(() => finish(false), 800);
          }
        }
        render();
      }
    }, heatInterval);

    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchend', handleTouch);
    render();
  }

  function finish(passed) {
    clearInterval(timer);
    clearInterval(heatTimer);
    if (canvas) {
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchend', handleTouch);
    }
    const finalPassed = passed || (explodedCount < MAX_EXPLODED && timeLeft <= 0);
    render();
    setTimeout(() => onComplete(score, finalPassed), 600);
  }

  function stop() {
    clearInterval(timer);
    clearInterval(heatTimer);
    if (canvas) {
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchend', handleTouch);
    }
  }

  function handleTouch(e) {
    e.preventDefault();
    const t = e.changedTouches[0];
    const r = canvas.getBoundingClientRect();
    handleAt((t.clientX - r.left) * (canvas.width / r.width),
             (t.clientY - r.top) * (canvas.height / r.height));
  }

  function handleClick(e) {
    const r = canvas.getBoundingClientRect();
    handleAt((e.clientX - r.left) * (canvas.width / r.width),
             (e.clientY - r.top) * (canvas.height / r.height));
  }

  function handleAt(mx, my) {
    panels.forEach(p => {
      if (!p.exploded && p.heat > 0 &&
          mx >= p.x && mx <= p.x + p.w &&
          my >= p.y && my <= p.y + p.h) {
        const heatRemoved = p.heat;
        p.heat = 0;
        p.cooling = true;
        score += heatRemoved * 20;
        Audio.playCooled();
        setTimeout(() => { p.cooling = false; render(); }, 500);
        render();
      }
    });
  }

  function heatColor(heat) {
    if (heat <= 0) return '#1A3A1A';
    if (heat <= 3) return '#806000';
    if (heat <= 6) return '#CC4400';
    return '#FF1100';
  }

  function heatTextColor(heat) {
    if (heat <= 0) return '#66BB66';
    if (heat <= 3) return '#FBE830';
    if (heat <= 6) return '#FF8800';
    return '#FF3300';
  }

  function render() {
    const W = canvas.width, H = canvas.height;
    ctx.fillStyle = '#050510';
    ctx.fillRect(0, 0, W, H);

    R.drawMiniGameHUD({ num: levelNum }, timeLeft, score, 45);

    // Title
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillStyle = '#FF6600';
    ctx.textAlign = 'center';
    ctx.fillText('CLICK HOT COMPONENTS TO COOL THEM!', W/2, 50);

    // Explosion counter
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillStyle = '#FF0000';
    ctx.fillText(`EXPLOSIONS: ${explodedCount} / ${MAX_EXPLODED}`, W - 120, 65);

    // Draw panels
    panels.forEach(p => {
      if (p.exploded) {
        // Exploded panel
        ctx.fillStyle = '#1A0000';
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.strokeStyle = '#440000';
        ctx.lineWidth = 2;
        ctx.strokeRect(p.x, p.y, p.w, p.h);
        ctx.font = '9px "Press Start 2P", monospace';
        ctx.fillStyle = '#660000';
        ctx.textAlign = 'center';
        ctx.fillText('💥 DEAD', p.x + p.w/2, p.y + p.h/2 + 4);
      } else {
        const bg = p.cooling ? '#003030' : heatColor(p.heat);
        ctx.fillStyle = bg;
        ctx.fillRect(p.x, p.y, p.w, p.h);
        ctx.strokeStyle = p.cooling ? '#00FFFF' : heatTextColor(p.heat);
        ctx.lineWidth = p.heat >= 7 ? 3 : 2;
        ctx.strokeRect(p.x, p.y, p.w, p.h);

        // Label
        ctx.font = 'bold 12px "Press Start 2P", monospace';
        ctx.fillStyle = p.cooling ? '#00FFFF' : heatTextColor(p.heat);
        ctx.textAlign = 'center';
        ctx.fillText(p.label, p.x + p.w/2, p.y + 24);

        // Heat indicator bar
        const barW = p.w - 20;
        ctx.fillStyle = '#333';
        ctx.fillRect(p.x + 10, p.y + 34, barW, 10);
        const heatPct = Math.min(p.heat / 9, 1);
        ctx.fillStyle = heatColor(Math.ceil(heatPct * 9));
        ctx.fillRect(p.x + 10, p.y + 34, barW * heatPct, 10);

        // Heat level text
        ctx.font = '8px "Press Start 2P", monospace';
        ctx.fillStyle = heatTextColor(p.heat);
        const tempStr = p.cooling ? 'COOLING...' : p.heat === 0 ? 'COOL' :
                        p.heat <= 3 ? 'WARM' : p.heat <= 6 ? 'HOT!' : '🔥 CRITICAL!';
        ctx.fillText(tempStr, p.x + p.w/2, p.y + 58);

        // Flame animation for critical
        if (p.heat >= 7) {
          const ft = Date.now() / 100;
          ctx.font = '14px monospace';
          ctx.fillText(['🔥','💥','🔥'][Math.floor(ft) % 3], p.x + p.w/2, p.y + p.h - 6);
        }

        // Click hint for hot components
        if (p.heat > 0 && !p.cooling) {
          ctx.font = '7px "Press Start 2P", monospace';
          ctx.fillStyle = '#FFFFFF80';
          ctx.fillText('CLICK!', p.x + p.w/2, p.y + p.h - 8);
        }
      }
    });

    // Explosion particles
    explosions = explosions.filter(ex => ex.t < 20);
    explosions.forEach(ex => {
      const alpha = 1 - ex.t / 20;
      for (let i = 0; i < 8; i++) {
        const angle = (i / 8) * Math.PI * 2;
        const dist = ex.t * 5;
        ctx.fillStyle = `rgba(255,${100 - ex.t * 5},0,${alpha})`;
        ctx.fillRect(
          ex.x + Math.cos(angle) * dist - 4,
          ex.y + Math.sin(angle) * dist - 4,
          8, 8
        );
      }
      ex.t++;
    });

    // Time running out warning
    if (timeLeft <= 10) {
      if (Math.floor(Date.now() / 500) % 2 === 0) {
        ctx.fillStyle = 'rgba(255,0,0,0.1)';
        ctx.fillRect(0, 0, W, H);
      }
    }
  }

  return { start, stop };
})();


/* ============================================================
   3. CODE GAME — Find the buggy line of code
   ============================================================ */
const CodeGame = (() => {

  // Code snippets per level (6, 9 correspond to levelNum 3, 6, 9)
  const CODE_SNIPPETS = {
    3: [
      { code: [
          'void drawColor(int r, int g, int b) {',
          '  setPixel(currentX, currentY, r, g, b);',
          '  clearBuffer(r, g, b, 255);',  // BUG: clearBuffer shouldn't take color args here
          '  currentX += pixelWidth;',
          '  currentY += pixelHeight;',
          '}'
        ], bugLine: 2, hint: 'clearBuffer should not take color params here!' },
      { code: [
          'int getScreenColor(int pixel) {',
          '  if (pixel < 0) return BLACK;',
          '  if (pixel > 255) return WHITE;',
          '  return pixel + 256;',  // BUG: should just be pixel, not pixel+256
          '}'
        ], bugLine: 3, hint: 'Color values exceed 8-bit range!' },
    ],
    6: [
      { code: [
          'void contextSwitch(Task* from, Task* to) {',
          '  saveRegisters(from);',
          '  to->state = RUNNING;',
          '  from->state = RUNNING;',  // BUG: from should be READY/WAITING, not RUNNING
          '  loadRegisters(to);',
          '}'
        ], bugLine: 3, hint: 'from task should be READY/WAITING, not RUNNING!' },
      { code: [
          'int allocMemory(int size) {',
          '  if (size <= 0) return -1;',
          '  int addr = heapPtr;',
          '  heapPtr = heapPtr - size;',  // BUG: should be + not -
          '  return addr;',
          '}'
        ], bugLine: 3, hint: 'Heap pointer should increment, not decrement!' },
    ],
    9: [
      { code: [
          'func handleTouch(event: UITouch) {',
          '  let point = event.location(in: view)',
          '  if point.x < 0 || point.y < 0 { return }',
          '  if point.x > view.width { return }',
          '  processGesture(at: point)',
          '  updateDisplay(point.x, point.x)' // BUG: should be point.y not point.x
        ], bugLine: 5, hint: 'Should use point.y for Y coordinate!' },
      { code: [
          'void renderPixel(int x, int y, Color c) {',
          '  if (x >= SCREEN_W) return;',
          '  if (y >= SCREEN_H) return;',
          '  int idx = y * SCREEN_W + x;',
          '  buffer[idx] = c.r + c.g + c.b;', // BUG: should pack as rgb not add
          '  markDirty(x, y);',
          '}'
        ], bugLine: 4, hint: 'Colors should be packed, not summed!' },
    ],
  };

  // Default fallback snippets for other levels
  const DEFAULT_SNIPPETS = [
    { code: [
        'int calculate(int a, int b) {',
        '  if (a == 0) return 0;',
        '  int result = a * b;',
        '  result = result + result;', // BUG: should just return a*b
        '  return result;',
        '}'
      ], bugLine: 3, hint: 'Result should not be doubled!' },
  ];

  let snippet = null;
  let timeLeft = 30;
  let score = 0;
  let timer = null;
  let found = false;
  let clickedLine = -1;
  let levelNum = 1;
  let onComplete = null;
  let canvas = null;
  let ctx = null;

  function start(cvs, lvl, cb) {
    canvas = cvs;
    ctx = cvs.getContext('2d');
    levelNum = lvl;
    onComplete = cb;
    found = false;
    clickedLine = -1;
    score = 0;
    timeLeft = Math.max(20, 35 - lvl * 2);

    // Pick snippet
    const pool = CODE_SNIPPETS[lvl] || DEFAULT_SNIPPETS;
    snippet = pool[Math.floor(Math.random() * pool.length)];

    clearInterval(timer);
    timer = setInterval(() => {
      timeLeft--;
      if (timeLeft <= 0) {
        clearInterval(timer);
        render();
        setTimeout(() => { stop(); onComplete(0, false); }, 800);
      } else {
        render();
      }
    }, 1000);

    canvas.addEventListener('click', handleClick);
    canvas.addEventListener('touchend', handleTouch);
    render();
  }

  function stop() {
    clearInterval(timer);
    if (canvas) {
      canvas.removeEventListener('click', handleClick);
      canvas.removeEventListener('touchend', handleTouch);
    }
  }

  function handleTouch(e) {
    e.preventDefault();
    const t = e.changedTouches[0];
    const r = canvas.getBoundingClientRect();
    handleAt((t.clientX - r.left) * (canvas.width / r.width),
             (t.clientY - r.top) * (canvas.height / r.height));
  }

  function handleClick(e) {
    const r = canvas.getBoundingClientRect();
    handleAt((e.clientX - r.left) * (canvas.width / r.width),
             (e.clientY - r.top) * (canvas.height / r.height));
  }

  function getLineY(i) {
    return 110 + i * 52;
  }

  function handleAt(mx, my) {
    if (found || !snippet) return;
    snippet.code.forEach((line, i) => {
      const ly = getLineY(i);
      if (my >= ly - 4 && my <= ly + 44) {
        clickedLine = i;
        if (i === snippet.bugLine) {
          found = true;
          score = Math.max(100, timeLeft * 50);
          Audio.playBugFound();
          clearInterval(timer);
          render();
          setTimeout(() => { stop(); onComplete(score, true); }, 1200);
        } else {
          Audio.playWrong();
          score = Math.max(0, score - 30);
          setTimeout(() => { clickedLine = -1; render(); }, 500);
        }
        render();
      }
    });
  }

  function render() {
    if (!snippet) return;
    const W = canvas.width, H = canvas.height;
    ctx.fillStyle = '#050518';
    ctx.fillRect(0, 0, W, H);

    R.drawMiniGameHUD({ num: levelNum }, timeLeft, score, Math.max(20, 35 - levelNum * 2));

    // Title
    ctx.font = '10px "Press Start 2P", monospace';
    ctx.fillStyle = '#F878F8';
    ctx.textAlign = 'center';
    ctx.fillText('CLICK THE LINE WITH THE BUG!', W/2, 50);

    // Hint strip
    ctx.fillStyle = '#1A0030';
    ctx.fillRect(30, 60, W - 60, 28);
    ctx.font = '8px "Press Start 2P", monospace';
    ctx.fillStyle = '#AAAAAA';
    ctx.textAlign = 'center';
    ctx.fillText('HINT: ' + snippet.hint, W/2, 78);

    // Code panel background
    ctx.fillStyle = '#080820';
    ctx.fillRect(30, 95, W - 60, snippet.code.length * 52 + 20);
    ctx.strokeStyle = '#444488';
    ctx.lineWidth = 2;
    ctx.strokeRect(30, 95, W - 60, snippet.code.length * 52 + 20);

    // Line numbers + code
    snippet.code.forEach((line, i) => {
      const ly = getLineY(i);
      const isBug = i === snippet.bugLine;
      const isClicked = i === clickedLine;
      const isFound = found && isBug;
      const isWrong = isClicked && !isBug;

      // Row background
      let rowBg = i % 2 === 0 ? '#0A0A25' : '#080820';
      if (isFound) rowBg = '#002800';
      else if (isWrong) rowBg = '#280000';
      ctx.fillStyle = rowBg;
      ctx.fillRect(30, ly - 4, W - 60, 48);

      // Hover highlight hint: subtle pulse for the bug line
      if (isBug && !found && Math.floor(Date.now() / 800) % 3 === 0) {
        ctx.fillStyle = 'rgba(255,0,0,0.05)';
        ctx.fillRect(30, ly - 4, W - 60, 48);
      }

      // Line number
      ctx.font = '9px "Press Start 2P", monospace';
      ctx.fillStyle = '#445566';
      ctx.textAlign = 'right';
      ctx.fillText(`${i + 1}`, 72, ly + 16);

      // Line border on hover/click
      if (isFound) {
        ctx.strokeStyle = '#00FF00';
        ctx.lineWidth = 2;
        ctx.strokeRect(30, ly - 4, W - 60, 48);
      } else if (isWrong) {
        ctx.strokeStyle = '#FF0000';
        ctx.lineWidth = 2;
        ctx.strokeRect(30, ly - 4, W - 60, 48);
      }

      // Code text (syntax coloring)
      ctx.textAlign = 'left';
      renderCodeLine(ctx, line, 80, ly + 16, isFound, isWrong);

      // Found / wrong indicator
      if (isFound) {
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.fillStyle = '#00FF00';
        ctx.textAlign = 'right';
        ctx.fillText('← BUG!', W - 40, ly + 16);
      } else if (isWrong) {
        ctx.font = '10px "Press Start 2P", monospace';
        ctx.fillStyle = '#FF4444';
        ctx.textAlign = 'right';
        ctx.fillText('← CLEAN', W - 40, ly + 16);
      }

      // Click hint
      if (!found) {
        ctx.font = '7px "Press Start 2P", monospace';
        ctx.fillStyle = '#444466';
        ctx.textAlign = 'right';
        ctx.fillText('CLICK', W - 44, ly + 34);
      }
    });

    // Success overlay
    if (found) {
      ctx.fillStyle = 'rgba(0,80,0,0.3)';
      ctx.fillRect(0, 0, W, H);
      ctx.font = '16px "Press Start 2P", monospace';
      ctx.fillStyle = '#00FF88';
      ctx.textAlign = 'center';
      ctx.shadowColor = '#00FF88';
      ctx.shadowBlur = 12;
      ctx.fillText('✓ BUG SQUASHED!', W/2, H - 50);
      ctx.shadowBlur = 0;
    }
  }

  // Simple syntax highlighter
  function renderCodeLine(ctx2, line, x, y, isFound, isWrong) {
    const keywords = ['void', 'int', 'return', 'if', 'else', 'func', 'let', 'var', 'for', 'while'];
    const tokens = line.split(/(\s+|[(){};<>=+\-*\/,.])/);
    let cx = x;
    tokens.forEach(token => {
      let col = isFound ? '#88FF88' : isWrong ? '#FF8888' : '#CCCCCC';
      if (keywords.includes(token)) col = isFound ? '#88FFAA' : '#7788FF';
      else if (/^[0-9]+$/.test(token)) col = '#FFB86C';
      else if (token.startsWith('"') || token.startsWith("'")) col = '#FF9580';
      else if (/^[A-Z_]+$/.test(token) && token.length > 1) col = '#FFD580';
      else if (/^[A-Z]/.test(token)) col = '#80FFEA';

      ctx2.font = '11px monospace';
      ctx2.fillStyle = col;
      ctx2.textAlign = 'left';
      ctx2.fillText(token, cx, y);
      cx += ctx2.measureText(token).width;
    });
  }

  return { start, stop };
})();


/* ============================================================
   MINI-GAME DISPATCHER
   ============================================================ */
const MiniGameRunner = {
  current: null,

  start(canvas, level, callback) {
    this.stop();
    switch (level.miniGame) {
      case 'schematic':
        this.current = SchematicGame;
        SchematicGame.start(canvas, level.num, callback);
        break;
      case 'fire':
        this.current = FireGame;
        FireGame.start(canvas, level.num, callback);
        break;
      case 'code':
        this.current = CodeGame;
        CodeGame.start(canvas, level.num, callback);
        break;
      default:
        callback(0, false);
    }
  },

  stop() {
    if (this.current) {
      this.current.stop();
      this.current = null;
    }
  }
};
