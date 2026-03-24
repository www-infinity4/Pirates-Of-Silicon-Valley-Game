# Pirates of Silicon Valley — The Game

> *"Stay Hungry. Stay Foolish."* — Steve Jobs

An 8-bit retro educational game where **you play as Steve Jobs** — from a garage in 1984 to a holographic iPhone in 2026!

---

## 🎮 How to Play

Open **`index.html`** in any modern browser. No server or installation needed.

### Controls
| Action | Keyboard | Mouse/Touch |
|--------|----------|-------------|
| Confirm / Advance | `Enter` or `Space` | Click anywhere |
| Answer 1–4 | `1` `2` `3` `4` | Click the answer row on screen |

---

## 🕹️ Game Structure

### 10 Levels — Year by Year Apple History

| Level | Year | Product |
|-------|------|---------|
| 1 | 1984 | Macintosh 128K |
| 2 | 1986 | Macintosh Plus |
| 3 | 1987 | Macintosh II |
| 4 | 1989 | Macintosh Portable |
| 5 | 1991 | PowerBook 100 |
| 6 | 1994 | Power Mac 9500 |
| 7 | 1998 | iMac G3 |
| 8 | 2001 | iPod + Mac OS X |
| 9 | 2007 | iPhone |
| 10 | 2026 | Future iPhone Vision |

### Each Level Has Two Phases

**Phase 1 — QUIZ (10 questions)**
- Multiple choice questions about electronics, schematics, hardware & software
- Topics: capacitors, resistors, transistors, PCBs, CPUs, software, AI, and more
- 3 lives — wrong answers cost a life!
- Score based on correct answers

**Phase 2 — ACTION MINI-GAME**
Three rotating challenge types:
- 🔌 **Schematic Debug** — Find the broken component on a circuit board
- 🔥 **Fire Control** — Click overheating components before they explode!
- 💻 **Code Debug** — Find the buggy line of code before the program crashes

---

## 🎨 Visual Style

- **8-bit / NES-inspired** pixel art drawn programmatically on HTML5 Canvas
- **CRT scanline** and vignette effect
- **"Press Start 2P"** pixel font for maximum retro readability
- 6 unique scene backgrounds: Garage, Lab, Xerox PARC, Apple HQ, Stage, Future
- Pixel art of every Apple product from Mac 128K to iPhone 2026

---

## 📁 File Structure

```
index.html          ← Game entry point
style.css           ← CRT/8-bit aesthetic
js/
  data.js           ← 100 questions + level metadata
  renderer.js       ← Canvas drawing engine (pixel art)
  audio.js          ← Web Audio API chiptune sounds
  minigames.js      ← 3 action mini-games
  game.js           ← Game state machine + main loop
```

---

## 🍎 Topics Covered (100 Questions)

- **Level 1** Electronics Fundamentals (capacitors, resistors, binary, RAM)
- **Level 2** Circuits & Components (diodes, PCBs, Ohm's Law, bytes)
- **Level 3** Schematics (symbols, flip-flops, VLSI, I2C)
- **Level 4** Power Systems (capacitance, MOSFETs, PWM, voltage regulators)
- **Level 5** Portable Design (LCD, TFT, CCFL, NiCd batteries, APM)
- **Level 6** RISC Architecture (PowerPC, pipelining, cache, PCI)
- **Level 7** Consumer Revolution (USB, CRT, iMac, FireWire)
- **Level 8** Software Design (APIs, kernels, GUI, Mac OS X, Objective-C)
- **Level 9** Touch Interface (ARM, capacitive touch, LTE, multi-touch)
- **Level 10** Future/AI & Quantum (OLED, 5G, Apple Silicon, Neural Engine, qubits)
 
