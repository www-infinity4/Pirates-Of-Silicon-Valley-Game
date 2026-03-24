/* ==========================================================
   PIRATES OF SILICON VALLEY — DATA
   100 Questions (10 levels × 10) + Level Metadata
   ========================================================== */

'use strict';

/* ---------- LEVEL DEFINITIONS ---------- */
const LEVELS = [
  {
    num: 1, year: 1984, product: 'Macintosh 128K',
    tagline: '"The computer for the rest of us!"',
    desc: '128KB RAM  |  8 MHz 68000 CPU\nBuilt-in 9" monochrome screen\nFirst mass-market GUI computer',
    bgScene: 'garage', miniGame: 'schematic',
    mgDesc: 'SCHEMATIC FAULT!\nThe Mac logic board has a\nbad component.\nClick the BROKEN part!',
    color: '#3CBCFC'
  },
  {
    num: 2, year: 1986, product: 'Macintosh Plus',
    tagline: '"More power, more memory!"',
    desc: '1 MB RAM (upgradeable to 4MB)\nSCSI interface added\nMost successful Mac to date',
    bgScene: 'lab', miniGame: 'fire',
    mgDesc: 'COMPONENTS OVERHEATING!\nClick the HOT parts\nbefore they EXPLODE!',
    color: '#00E8D8'
  },
  {
    num: 3, year: 1987, product: 'Macintosh II',
    tagline: '"Color at last!"',
    desc: 'First Mac with COLOR display\n8 MHz 68020  |  NuBus slots\nRevolutionary open architecture',
    bgScene: 'xerox', miniGame: 'code',
    mgDesc: 'BUGGY SOFTWARE!\nOne line of code is WRONG.\nClick the line with the BUG!',
    color: '#F83800'
  },
  {
    num: 4, year: 1989, product: 'Macintosh Portable',
    tagline: '"Power to go!"',
    desc: 'First portable Mac  |  16 lbs\n16 MHz 68000  |  Lead-acid battery\nActive-matrix backlit LCD',
    bgScene: 'apple_hq', miniGame: 'schematic',
    mgDesc: 'POWER CIRCUIT FAIL!\nDebug the portable\npower schematic now!',
    color: '#FBE830'
  },
  {
    num: 5, year: 1991, product: 'PowerBook 100',
    tagline: '"The laptop reimagined!"',
    desc: 'Revolutionary laptop design\nTrackball + palm rest pioneer\n16 MHz 68000  |  2.5" HDD',
    bgScene: 'lab', miniGame: 'fire',
    mgDesc: 'BATTERY OVERLOAD!\nCool down the cells\nbefore MELTDOWN!',
    color: '#00B800'
  },
  {
    num: 6, year: 1994, product: 'Power Mac 9500',
    tagline: '"RISC power unleashed!"',
    desc: 'PowerPC 604  |  120 MHz RISC\nApple + IBM + Motorola AIM\nSix PCI expansion slots',
    bgScene: 'xerox', miniGame: 'code',
    mgDesc: 'KERNEL CRASH DETECTED!\nFind the fatal bug\nin the PowerPC code!',
    color: '#6844FC'
  },
  {
    num: 7, year: 1998, product: 'iMac G3',
    tagline: '"Think Different!"',
    desc: 'iMac G3 — Bondi Blue icon\nUSB replaces all legacy ports\nSteve returns to save Apple!',
    bgScene: 'apple_hq', miniGame: 'schematic',
    mgDesc: 'USB CIRCUIT FAULT!\nDebug the new\ninterface board!',
    color: '#0058F8'
  },
  {
    num: 8, year: 2001, product: 'iPod + Mac OS X',
    tagline: '"1000 songs in your pocket!"',
    desc: 'iPod: 5GB  |  10 hrs battery\nMac OS X 10.0 Cheetah\nBased on NeXT / XNU kernel',
    bgScene: 'stage', miniGame: 'fire',
    mgDesc: 'SERVER ROOM ON FIRE!\nSave the iTunes launch\nservers — HURRY!',
    color: '#F878F8'
  },
  {
    num: 9, year: 2007, product: 'iPhone',
    tagline: '"An iPod, a phone & internet!"',
    desc: '3.5" capacitive Multi-Touch\n412 MHz ARM  |  2MP camera\nRevolutionary — no stylus!',
    bgScene: 'stage', miniGame: 'code',
    mgDesc: 'iOS LAUNCH CRASH!\nFind the touchscreen\nbug before launch!',
    color: '#E45C10'
  },
  {
    num: 10, year: 2026, product: 'iPhone 2026 Vision',
    tagline: '"The future is now!"',
    desc: 'Holographic OLED display\n6G  |  Quantum Neural Engine\nApple Silicon A22 — AI-first',
    bgScene: 'future', miniGame: 'schematic',
    mgDesc: 'QUANTUM CIRCUIT BUG!\nDebug the A22 chip\nschematic NOW!',
    color: '#FCFCFC'
  }
];

/* ---------- ALL 100 QUESTIONS ---------- */
const ALL_QUESTIONS = [

  /* ====== LEVEL 1 — 1984 — Electronics Fundamentals ====== */
  {
    text: "What component STORES\nelectrical charge?",
    opts: ["Resistor", "Capacitor", "Inductor", "Diode"],
    ans: 1,
    hint: "A capacitor stores charge between\ntwo conductive plates."
  },
  {
    text: "What unit measures\nelectrical RESISTANCE?",
    opts: ["Volt (V)", "Ampere (A)", "Ohm (Ω)", "Watt (W)"],
    ans: 2,
    hint: "Georg Ohm gave us the unit\nfor resistance."
  },
  {
    text: "In a digital circuit,\na transistor acts as a:",
    opts: ["Battery", "Switch", "Antenna", "Display"],
    ans: 1,
    hint: "Transistors switch current ON/OFF\n— the basis of all logic!"
  },
  {
    text: "In binary, what does\nthe digit '0' represent?",
    opts: ["ON / HIGH", "OFF / LOW", "5 Volts", "Error state"],
    ans: 1,
    hint: "Binary: 0 = OFF/LOW, 1 = ON/HIGH."
  },
  {
    text: "What is the PURPOSE\nof a resistor?",
    opts: ["Store charge", "Emit light", "Limit current", "Amplify signal"],
    ans: 2,
    hint: "Resistors resist current flow\nand drop voltage."
  },
  {
    text: "Voltage is measured in:",
    opts: ["Watts", "Ohms", "Amperes", "Volts"],
    ans: 3,
    hint: "Named after Alessandro Volta,\nit measures electric potential."
  },
  {
    text: "RAM stands for:",
    opts: ["Read Access Memory", "Random Access Memory", "Rapid Array Module", "Row Address Matrix"],
    ans: 1,
    hint: "Random Access Memory — you\ncan access any byte instantly."
  },
  {
    text: "The Macintosh 128K\nhad how much RAM?",
    opts: ["64 KB", "128 KB", "256 KB", "512 KB"],
    ans: 1,
    hint: "128K is right in the name!\nIt was later upgraded to 512K."
  },
  {
    text: "Conductive paths on a\nPCB are called:",
    opts: ["Wires", "Bridges", "Traces", "Conduits"],
    ans: 2,
    hint: "Copper traces connect\ncomponents on PCBs."
  },
  {
    text: "The Mac 128K CPU ran at:",
    opts: ["4 MHz", "6 MHz", "8 MHz", "12 MHz"],
    ans: 2,
    hint: "The Motorola 68000 ran\nat 7.8336 MHz (≈ 8 MHz)."
  },

  /* ====== LEVEL 2 — 1986 — Circuits & Components ====== */
  {
    text: "A diode allows current to\nflow in:",
    opts: ["Both directions", "No direction", "One direction only", "AC only"],
    ans: 2,
    hint: "Diodes are one-way valves\nfor electrical current."
  },
  {
    text: "PCB stands for:",
    opts: ["Power Circuit Board", "Printed Circuit Board", "Processed Computer Bus", "Primary Control Bridge"],
    ans: 1,
    hint: "Printed Circuit Board —\ncopper traces on insulator."
  },
  {
    text: "Ohm's Law states that\nV equals:",
    opts: ["I + R", "I × R", "I / R", "I² × R"],
    ans: 1,
    hint: "Voltage = Current × Resistance\n(V = IR)."
  },
  {
    text: "How many BITS\nare in a BYTE?",
    opts: ["4", "6", "8", "16"],
    ans: 2,
    hint: "8 bits = 1 byte.\nThis has been true since the 1960s!"
  },
  {
    text: "A breadboard is used for:",
    opts: ["Making permanent circuits", "Prototyping & testing", "Cutting PCBs", "Soldering components"],
    ans: 1,
    hint: "Breadboards let you prototype\nwithout soldering."
  },
  {
    text: "The Mac Plus added\nwhat interface?",
    opts: ["Ethernet", "WiFi", "SCSI", "USB"],
    ans: 2,
    hint: "SCSI (Small Computer System Interface)\nallowed external hard drives."
  },
  {
    text: "An LED is a:\n(what type of component?)",
    opts: ["Resistor type", "Capacitor type", "Diode type", "Transistor type"],
    ans: 2,
    hint: "LED = Light Emitting DIODE.\nIt only lets current flow one way."
  },
  {
    text: "What does ROM store?",
    opts: ["User files", "Temporary data", "Permanent firmware", "GPU textures"],
    ans: 2,
    hint: "Read Only Memory holds\npermanent, non-volatile data."
  },
  {
    text: "A ground plane on a PCB\nprimarily:",
    opts: ["Cools the board", "Acts as antenna", "Reduces interference", "Boosts voltage"],
    ans: 2,
    hint: "Ground planes provide a\nlow-impedance return path."
  },
  {
    text: "What does the Mac Plus'\nSCSI connector look like?",
    opts: ["25-pin D-sub", "9-pin mini-DIN", "50-pin Centronics", "40-pin flat ribbon"],
    ans: 0,
    hint: "Mac Plus used a 25-pin\nD-subminiature SCSI connector."
  },

  /* ====== LEVEL 3 — 1987 — Schematics ====== */
  {
    text: "In a schematic, a BATTERY\nis shown as:",
    opts: ["A circle with +/-", "Two parallel lines (long + short)", "A triangle", "An arrow"],
    ans: 1,
    hint: "Long line = positive (+),\nshort line = negative (-)."
  },
  {
    text: "In a schematic, a ZIGZAG\nsymbol represents:",
    opts: ["Capacitor", "Inductor", "Resistor", "Ground"],
    ans: 2,
    hint: "Zigzag = resistor.\nBox shape is also used in Europe."
  },
  {
    text: "The Macintosh II was the\nfirst Mac to support:",
    opts: ["USB ports", "Color display", "CD-ROM", "Touchscreen"],
    ans: 1,
    hint: "Mac II supported 8-bit color\nwith NuBus graphics cards."
  },
  {
    text: "A MUX (Multiplexer)\nselects from:",
    opts: ["Multiple outputs", "Multiple inputs", "Multiple power rails", "Multiple clocks"],
    ans: 1,
    hint: "A MUX routes one of N inputs\nto a single output."
  },
  {
    text: "In digital electronics,\na FLIP-FLOP is a:",
    opts: ["Oscillator", "Memory cell (1-bit)", "Amplifier", "Voltage regulator"],
    ans: 1,
    hint: "A flip-flop stores 1 bit of data\nand is triggered by a clock."
  },
  {
    text: "VLSI stands for:",
    opts: ["Variable Logic Signal Interface", "Very Large Scale Integration", "Virtual Layer System Input", "Volatile Logic Storage Index"],
    ans: 1,
    hint: "VLSI = millions of transistors\non a single chip."
  },
  {
    text: "A DIP-8 IC package\nhas how many pins?",
    opts: ["4", "6", "8", "16"],
    ans: 2,
    hint: "DIP-8: Dual Inline Package\nwith 8 pins (4 per side)."
  },
  {
    text: "I2C stands for:",
    opts: ["Input-2-Control", "Inter-Integrated Circuit", "Intel Interface Circuit", "Isolated 2-wire Connector"],
    ans: 1,
    hint: "I2C is a 2-wire serial bus\ninvented by Philips in 1982."
  },
  {
    text: "In a schematic, the\nGROUND symbol looks like:",
    opts: ["Lines going UP", "Downward lines decreasing", "A crossed circle", "An arrow right"],
    ans: 1,
    hint: "Ground symbol: horizontal lines\ndecreasing in width downward."
  },
  {
    text: "An op-amp is an:\n(what type of component?)",
    opts: ["Digital gate", "Operational amplifier", "Optical module", "Output amplifier only"],
    ans: 1,
    hint: "Operational amplifier:\nhigh-gain differential amplifier."
  },

  /* ====== LEVEL 4 — 1989 — Power Systems ====== */
  {
    text: "The unit of CAPACITANCE is:",
    opts: ["Henry (H)", "Farad (F)", "Tesla (T)", "Weber (Wb)"],
    ans: 1,
    hint: "Named after Michael Faraday.\n1 Farad = 1 Coulomb/Volt."
  },
  {
    text: "What type of battery did\nthe Mac Portable use?",
    opts: ["NiCd (Nickel-Cadmium)", "Lead-acid", "Lithium-ion", "Alkaline"],
    ans: 1,
    hint: "The Mac Portable used lead-acid\nbatteries, making it very heavy!"
  },
  {
    text: "PWM stands for:",
    opts: ["Power With Modulation", "Pulse Width Modulation", "Phase Width Multiplier", "Power Wave Minimum"],
    ans: 1,
    hint: "PWM controls power by switching\nhigh-frequency on/off pulses."
  },
  {
    text: "Power (P) in Watts equals:",
    opts: ["V / R", "V × I", "I² / R", "V + I"],
    ans: 1,
    hint: "P = V × I (Power = Voltage\ntimes Current)."
  },
  {
    text: "A heat sink is used to:",
    opts: ["Store electrical power", "Dissipate heat", "Filter signals", "Boost voltage"],
    ans: 1,
    hint: "Heat sinks conduct heat away\nfrom components to the air."
  },
  {
    text: "A MOSFET stands for:",
    opts: ["Metal Oxide Semiconductor FET", "Magnetic Output Signal FET", "Multi Output Signal Filter", "Modulated Oscillating Signal FE"],
    ans: 0,
    hint: "Metal-Oxide-Semiconductor\nField-Effect Transistor."
  },
  {
    text: "A bypass capacitor is placed\nnear a chip to:",
    opts: ["Increase voltage", "Filter power supply noise", "Store large charge", "Convert AC to DC"],
    ans: 1,
    hint: "Decoupling capacitors absorb\nhigh-frequency voltage spikes."
  },
  {
    text: "A voltage regulator\nmaintains:",
    opts: ["Constant output voltage", "Maximum current", "Oscillating output", "Input impedance"],
    ans: 0,
    hint: "Voltage regulators keep\noutput stable regardless of load."
  },
  {
    text: "The Mac Portable weighed\napproximately:",
    opts: ["7 lbs (3 kg)", "10 lbs (4.5 kg)", "16 lbs (7.3 kg)", "22 lbs (10 kg)"],
    ans: 2,
    hint: "At 16 lbs (7.3 kg), it was\nhardly 'portable'!"
  },
  {
    text: "Inductance is measured in:",
    opts: ["Farads", "Ohms", "Henries", "Watts"],
    ans: 2,
    hint: "Named after Joseph Henry.\nInductors store energy in\na magnetic field."
  },

  /* ====== LEVEL 5 — 1991 — Portable Design ====== */
  {
    text: "The PowerBook was\nrevolutionary due to its:",
    opts: ["Color LCD screen", "Trackball + wrist rest design", "Built-in CD-ROM", "Voice control"],
    ans: 1,
    hint: "The palm rest + trackball design\nset the laptop standard still used today."
  },
  {
    text: "LCD stands for:",
    opts: ["Light Crystal Display", "Liquid Crystal Display", "Low Current Detector", "Layered Color Display"],
    ans: 1,
    hint: "Liquid Crystal Display:\ncrystals twist to block/pass light."
  },
  {
    text: "Early laptop screens used\nthis for backlighting:",
    opts: ["OLED", "LED strips", "CCFL tubes", "EL wire"],
    ans: 2,
    hint: "CCFL = Cold Cathode Fluorescent\nLamp. Replaced by LEDs later."
  },
  {
    text: "TFT in display tech means:",
    opts: ["Thin Film Transistor", "Total Frame Transfer", "Transparent Film Tech", "Thermal Frequency Tech"],
    ans: 0,
    hint: "TFT: each pixel has its own\ntransistor for active control."
  },
  {
    text: "NiCd battery chemistry is:",
    opts: ["Nickel + Cadmium", "Nickel + Carbon", "Nano Circuit", "Nitrogen + Cadmium"],
    ans: 0,
    hint: "NiCd = Nickel-Cadmium.\nSuffered from 'memory effect'."
  },
  {
    text: "APM in laptops stands for:",
    opts: ["Apple Power Manager", "Advanced Power Management", "Automatic Program Module", "Adaptive Peripheral Mode"],
    ans: 1,
    hint: "APM = Advanced Power Management:\nstandardized laptop sleep/hibernate."
  },
  {
    text: "The PowerBook 100 used\nwhat CPU?",
    opts: ["68020 @ 12 MHz", "68030 @ 20 MHz", "68000 @ 16 MHz", "PowerPC 601"],
    ans: 2,
    hint: "PowerBook 100 used a Motorola\n68000 running at 16 MHz."
  },
  {
    text: "Sleep mode exists to:",
    opts: ["Speed up processing", "Reduce power consumption", "Increase screen brightness", "Cache data to disk"],
    ans: 1,
    hint: "Sleep mode saves battery by\npausing the CPU and peripherals."
  },
  {
    text: "A lithium-ion battery's\nvoltage per cell is about:",
    opts: ["1.2V", "1.5V", "3.7V", "6V"],
    ans: 2,
    hint: "Li-ion cells are 3.6-3.7V nominal,\nhigher energy density than NiCd."
  },
  {
    text: "What does the PowerBook 100's\n'active matrix' display mean?",
    opts: ["Each pixel has its own TFT", "It auto-adjusts brightness", "It uses plasma technology", "It's always on"],
    ans: 0,
    hint: "Active matrix: each pixel has\na dedicated TFT transistor."
  },

  /* ====== LEVEL 6 — 1994 — RISC Architecture ====== */
  {
    text: "RISC stands for:",
    opts: ["Rapid Instruction Set Computer", "Reduced Instruction Set Computer", "Random Instruction Set Comp.", "Reliable Instruction Set Comp."],
    ans: 1,
    hint: "RISC: simple instructions that\nexecute in one clock cycle."
  },
  {
    text: "The PowerPC chip was\ndeveloped by:",
    opts: ["Apple alone", "Apple, IBM & Motorola (AIM)", "Intel & Apple", "AMD & Motorola"],
    ans: 1,
    hint: "The AIM alliance: Apple, IBM,\nand Motorola made the PowerPC."
  },
  {
    text: "CPU pipelining means:",
    opts: ["Network data routing", "Executing multiple instructions\nin overlapping stages", "Clearing L1 cache", "RAM memory management"],
    ans: 1,
    hint: "Pipelining: fetch + decode + execute\noverlap like an assembly line."
  },
  {
    text: "Cache memory is:",
    opts: ["Permanent HDD storage", "A fast memory layer\nclose to the CPU", "Network packet buffer", "Dedicated GPU memory"],
    ans: 1,
    hint: "CPU cache is SRAM, much faster\nthan main DRAM memory."
  },
  {
    text: "PCI bus stands for:",
    opts: ["Peripheral Computer Interface", "Peripheral Component Interconnect", "Primary Circuit Interface", "Processor Control Input"],
    ans: 1,
    hint: "PCI = Peripheral Component\nInterconnect. 33 MHz, 32-bit bus."
  },
  {
    text: "A cache MISS means:",
    opts: ["Data found in cache", "Cache write succeeded", "Data NOT in cache,\nmust fetch from RAM", "Cache is full"],
    ans: 2,
    hint: "Cache miss: CPU must wait\nfor slower RAM access."
  },
  {
    text: "Out-of-order execution means\nthe CPU:",
    opts: ["Has a software bug", "Reorders instructions\nto improve efficiency", "Loses network packets", "Has memory errors"],
    ans: 1,
    hint: "OoO exec: CPU reorders\noperations to avoid stalls."
  },
  {
    text: "SMP stands for:",
    opts: ["Single Memory Processor", "Serial Memory Port", "Symmetric Multi-Processing", "Signal Memory Processor"],
    ans: 2,
    hint: "SMP: multiple CPUs share\nthe same memory and OS."
  },
  {
    text: "The Power Mac 9500 had\nhow many PCI slots?",
    opts: ["3", "4", "6", "8"],
    ans: 2,
    hint: "The Power Mac 9500 had\nsix PCI expansion slots."
  },
  {
    text: "What is a branch predictor?",
    opts: ["Predicts network routes", "Guesses future code paths\nto avoid pipeline stalls", "Manages cache eviction", "Controls power states"],
    ans: 1,
    hint: "Branch prediction: CPU guesses\nif/else outcomes in advance."
  },

  /* ====== LEVEL 7 — 1998 — Consumer Revolution ====== */
  {
    text: "Steve Jobs returned\nto Apple in:",
    opts: ["1995", "1996", "1997", "1998"],
    ans: 2,
    hint: "Jobs returned in 1997 after\nApple acquired NeXT for $400M."
  },
  {
    text: "USB stands for:",
    opts: ["Universal System Bus", "Unified Serial Bridge", "Universal Serial Bus", "Upper Speed Bus"],
    ans: 2,
    hint: "Universal Serial Bus: one plug\nfor keyboard, mouse, etc."
  },
  {
    text: "USB 1.1 full-speed\ntransfer rate was:",
    opts: ["480 Mbps", "12 Mbps", "5 Gbps", "1.5 Mbps"],
    ans: 1,
    hint: "USB 1.1 full speed = 12 Mbps.\nLow speed = 1.5 Mbps."
  },
  {
    text: "The iMac G3 used what\ntype of display?",
    opts: ["LCD flat panel", "OLED", "CRT (cathode-ray tube)", "Plasma"],
    ans: 2,
    hint: "iMac G3 had an integrated\nCRT — that's what made it round!"
  },
  {
    text: "The iMac's original 'i'\nstood for:",
    opts: ["Innovation", "Intelligent", "Internet", "Interface"],
    ans: 2,
    hint: "Jobs said 'i' = Internet,\nindividual, instruct, inform, inspire."
  },
  {
    text: "FireWire 400 (IEEE 1394)\nruns at:",
    opts: ["100 Mbps", "200 Mbps", "400 Mbps", "800 Mbps"],
    ans: 2,
    hint: "FireWire 400 = 400 Mbps.\nFireWire 800 came later."
  },
  {
    text: "The iMac G3 processor\narchitecture was:",
    opts: ["x86 (CISC)", "RISC-based G3", "VLIW", "ARM"],
    ans: 1,
    hint: "iMac G3 used the PowerPC G3\n(750) — a RISC processor."
  },
  {
    text: "Classic Mac OS before\nMac OS X was called:",
    opts: ["System 7", "BeOS", "Classic Mac OS", "NeXTSTEP"],
    ans: 2,
    hint: "The OS was called 'Mac OS'\n(Classic Mac OS), versions 7-9."
  },
  {
    text: "The iMac G3's 'Bondi Blue'\ncolor was inspired by:",
    opts: ["The sky above Apple HQ", "Bondi Beach, Australia", "Steve's favourite sweater", "The IBM logo"],
    ans: 1,
    hint: "Designer Jonathan Ive was\ninspired by Bondi Beach, Sydney."
  },
  {
    text: "What did the iMac G3 NOT\nhave at launch?",
    opts: ["USB port", "CD-ROM drive", "Floppy disk drive", "Ethernet port"],
    ans: 2,
    hint: "Jobs famously removed the\nfloppy drive — the internet\nwas the new floppy!"
  },

  /* ====== LEVEL 8 — 2001 — Software Design ====== */
  {
    text: "API stands for:",
    opts: ["App Processing Interface", "Application Programming Interface", "Automated Program Integration", "Advanced Protocol Interface"],
    ans: 1,
    hint: "API: a defined interface that\nlets software talk to software."
  },
  {
    text: "Mac OS X is built on:",
    opts: ["Linux kernel", "Windows NT core", "XNU / Darwin kernel", "BSD kernel directly"],
    ans: 2,
    hint: "XNU = X is Not Unix.\nHybrid of Mach + BSD, from NeXT."
  },
  {
    text: "The iPod's scroll wheel\nused which technology?",
    opts: ["Resistive pressure", "Capacitive sensing", "Mechanical encoder", "Optical sensor"],
    ans: 1,
    hint: "The Click Wheel used\ncapacitive touch sensing."
  },
  {
    text: "The original iPod (2001)\nstored how much music?",
    opts: ["1 GB (≈250 songs)", "5 GB (≈1000 songs)", "10 GB (≈2000 songs)", "20 GB (≈5000 songs)"],
    ans: 1,
    hint: "The original iPod had 5 GB —\n'1000 songs in your pocket'."
  },
  {
    text: "GUI stands for:",
    opts: ["General User Interface", "Grid User Integration", "Graphical User Interface", "Global Unified Interface"],
    ans: 2,
    hint: "Graphical User Interface —\nwindows, icons, menus, pointer."
  },
  {
    text: "Mac OS X uses which\nprogramming language heavily?",
    opts: ["Java", "C++", "Objective-C", "Python"],
    ans: 2,
    hint: "Objective-C (from NeXT) was\nApple's main language until Swift."
  },
  {
    text: "POSIX stands for:",
    opts: ["Portable Operating System Interface", "Professional OS Integration", "Parallel OS Extended", "Process OS System Index"],
    ans: 0,
    hint: "POSIX: IEEE standard for\nUnix-compatible OS interfaces."
  },
  {
    text: "Mac OS X 10.0 was\ncodenamed:",
    opts: ["Jaguar", "Puma", "Cheetah", "Panther"],
    ans: 2,
    hint: "Mac OS X 10.0 = Cheetah (2001).\n10.1 = Puma. 10.2 = Jaguar."
  },
  {
    text: "What is the purpose of\na kernel?",
    opts: ["Render graphics", "Manage hardware &\nOS services", "Run user apps", "Encrypt data"],
    ans: 1,
    hint: "The kernel is the core of the OS,\nmanaging CPU, memory, I/O."
  },
  {
    text: "An event-driven program\nresponds to:",
    opts: ["Only mouse clicks", "Pre-planned code paths only", "User/system events\nas they occur", "Only keyboard input"],
    ans: 2,
    hint: "GUIs are event-driven:\nthey wait and respond\nto user/system events."
  },

  /* ====== LEVEL 9 — 2007 — Touch Interface ====== */
  {
    text: "The original iPhone's\nCPU ran at:",
    opts: ["300 MHz", "412 MHz", "533 MHz", "620 MHz"],
    ans: 1,
    hint: "Samsung-made ARM at 412 MHz.\nApple throttled it to save battery."
  },
  {
    text: "What was the iPhone's\nrevolutionary gesture?",
    opts: ["Single tap", "Pinch-to-zoom", "Triple tap", "Swipe up"],
    ans: 1,
    hint: "Pinch-to-zoom multi-touch was\nthe killer feature of iPhone."
  },
  {
    text: "ARM stands for:",
    opts: ["Advanced Reduced Microprocessor", "Advanced RISC Machine", "Automated Runtime Module", "Application Runtime Manager"],
    ans: 1,
    hint: "ARM = Advanced RISC Machine.\nPowers almost all mobile devices."
  },
  {
    text: "A capacitive touchscreen\ndetects:",
    opts: ["Pressure / force", "Electrical charge from finger", "Infrared beam breaks", "Camera motion"],
    ans: 1,
    hint: "Capacitive screens detect the\nchange in electric field from\nyour finger's charge."
  },
  {
    text: "The original iPhone screen\nsize was:",
    opts: ["2.5 inches", "3.5 inches", "4.0 inches", "4.7 inches"],
    ans: 1,
    hint: "3.5\" diagonal, 320×480 pixels —\nconsidered large in 2007!"
  },
  {
    text: "The original iPhone did\nNOT support:",
    opts: ["WiFi (802.11b/g)", "Bluetooth 2.0", "3G (UMTS)", "EDGE (2G data)"],
    ans: 2,
    hint: "No 3G! Jobs said 3G chips\ndrained too much battery."
  },
  {
    text: "A GPU is optimized for:",
    opts: ["Running the OS kernel", "General computation", "Parallel graphics processing", "Managing RAM"],
    ans: 2,
    hint: "GPUs have thousands of small\ncores for parallel pixel math."
  },
  {
    text: "LTE stands for:",
    opts: ["Long Term Evolution", "Linear Transmission Exchange", "Low Timed Encoding", "Layered Transceiver Element"],
    ans: 0,
    hint: "LTE = Long Term Evolution.\n4G LTE delivers ~50-150 Mbps."
  },
  {
    text: "Steve Jobs introduced iPhone\nby calling it three things. One was:",
    opts: ["A digital camera", "A phone", "A gaming console", "A GPS device"],
    ans: 1,
    hint: "\"An iPod, a phone, and an\ninternet communicator.\"\n— Steve Jobs, Jan 9, 2007"
  },
  {
    text: "What makes multi-touch\ndifferent from single-touch?",
    opts: ["Faster response", "Tracks multiple simultaneous\nfinger contacts", "Only works with stylus", "Uses more power"],
    ans: 1,
    hint: "Multi-touch: detects and tracks\nmultiple fingers simultaneously."
  },

  /* ====== LEVEL 10 — 2026 — Future / AI & Quantum ====== */
  {
    text: "OLED stands for:",
    opts: ["Optical Light Emitting Display", "Organic Light Emitting Diode", "Optimized LED Display", "Optical Layer Emitter"],
    ans: 1,
    hint: "OLED: organic compounds emit\nlight when electricity passes through.\nTrue blacks, no backlight needed."
  },
  {
    text: "5G mmWave means:",
    opts: ["Millimeter Wave (24-100 GHz)", "Multi-mode Wave", "Minimum Maximum Wave", "Modular Microwave"],
    ans: 0,
    hint: "mmWave = millimeter wave.\nUltra-fast but short range."
  },
  {
    text: "Apple Silicon (M-series)\nis based on:",
    opts: ["Intel x86 CISC", "ARM-based RISC", "AMD64", "SPARC RISC"],
    ans: 1,
    hint: "Apple Silicon uses ARM RISC\nwith custom Apple enhancements."
  },
  {
    text: "The Neural Engine in Apple\nchips is for:",
    opts: ["Traditional CPU tasks", "Machine learning operations", "3D graphics rendering", "Network routing"],
    ans: 1,
    hint: "Neural Engine: dedicated silicon\nfor ML/AI inference at high speed."
  },
  {
    text: "FOV in AR/VR means:",
    opts: ["Full Output Velocity", "Field of View", "Frame Output Video", "Forward Optical Vector"],
    ans: 1,
    hint: "Field of View: the angle of\nvision the display covers."
  },
  {
    text: "A quantum computer's\nbasic unit is:",
    opts: ["A classical bit", "A qubit", "A byte", "A pixel"],
    ans: 1,
    hint: "Qubit (quantum bit) can be\n0, 1, or superposition of both!"
  },
  {
    text: "USB4 maximum speed is:",
    opts: ["10 Gbps", "20 Gbps", "40 Gbps", "80 Gbps"],
    ans: 2,
    hint: "USB4 Gen 3×2 = 40 Gbps.\nUSB4 v2 can do 80 Gbps."
  },
  {
    text: "TSMC's chip 'nm' refers to:",
    opts: ["Nanomaterial composition", "Transistor node size", "Network module density", "Neural matrix layers"],
    ans: 1,
    hint: "nm = nanometer node size.\n3nm chips pack billions of\ntransistors per mm²."
  },
  {
    text: "Apple Vision Pro uses\nwhat display type?",
    opts: ["Regular LCD", "OLED panels", "Micro-OLED (Sony-built)", "Mini-LED backlit"],
    ans: 2,
    hint: "Vision Pro uses Sony micro-OLED:\ntinier pixels, higher PPI\nthan any phone display."
  },
  {
    text: "On-device AI processing\nprimarily provides:",
    opts: ["Faster internet speed", "Privacy + speed without\nsending data to cloud", "Better screen graphics", "Longer standby time"],
    ans: 1,
    hint: "On-device AI keeps your data\nprivate — no cloud round-trip."
  }
];

/* ---------- UTILITY: get questions for a level ---------- */
function getQuestionsForLevel(levelIndex) {
  const start = levelIndex * 10;
  return ALL_QUESTIONS.slice(start, start + 10);
}
