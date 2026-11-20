// Smash Fest -> City Blast blueprints (pipeline7). Every blueprint is ONE Smash Fest pattern measured in
// research/smashfest-ytscan/metrics-120-200.csv, with the SF levels it comes from and the SF metric row it copies:
// hard/soft share, where the hard sits, core, hard layers, front/depth layers, stacks, the difficulty source.
// The physics differ (a ball pushes, TNT breaks bonds) but the lever is the same: WHERE the hard part sits decides
// how much one hit can take, so the player has to read the building and plan several blasts.
//
// Recipe vocabulary (gen.mjs turns it into City Blast parts):
//   frame   hard piers on the perimeter (all floors), soft infill inside          (SF: hard frame round a soft core)
//   cap     soft tower, unbreakable steel top storey (+ tank)                     (SF: heavy cap that lands and stays)
//   shelf   soft storeys with a hard deep floor every `every` storeys              (SF: stone shelves split the tower)
//   spine   soft shell round a reinforced core that rises above the roof          (SF: hard spine / core in the middle)
//   checker wide frame, hard and soft columns alternating                         (SF: checker / brick-bond interlock)
//   block   plain soft building (a side building)                                  (SF: soft items)
//   piers   ground storey on hard piers, soft above                               (SF: hard base)
//   deck    a steel bridge between two parts                                      (SF: bridge over a gap)
// Every level has a MAIN building and SIDE buildings (separate parts with a gap: SF split stacks).
export const BLUEPRINTS = [
  { id: 'B1', name: 'Corner Posts', tier: 'N', sf: [131, 152, 165], pattern: 'frame-corners',
    story: 'Four hard corner posts hold the tower; the soft middle falls first and the posts stay standing.',
    sfMetric: { hard_pct: 20, hard_pos: 'corners (front+back) full height', core: 'no', hard_layers: 1, front: 1, depth: 2, stacks: 1, source: 'vertical hard spines' },
    main: { r: 'frame', f: 6, cx: 3, cz: 3, soft: 'conc', hard: 'corners' }, stage: 3,
    sides: [{ r: 'block', f: 2, cx: 2, cz: 2, mat: 'wood', x: -10 }, { r: 'block', f: 3, cx: 2, cz: 2, mat: 'wood', x: 10 }],
    tip: 'Dark corners only break\nwith TNT right on them.' },
  { id: 'B2', name: 'Hard Ring', tier: 'N', sf: [123, 140, 171], pattern: 'frame-ring',
    story: 'A ring of hard piers round a soft hall: the inside goes easily, the ring needs a TNT on each pier.',
    sfMetric: { hard_pct: 30, hard_pos: 'perimeter', core: 'no', hard_layers: 1, front: 1, depth: 2, stacks: 1, source: 'hard frame + flat slabs that stay' },
    main: { r: 'frame', f: 4, cx: 4, cz: 3, soft: 'brick', hard: 'ring' }, stage: 3,
    sides: [{ r: 'block', f: 3, cx: 2, cz: 2, mat: 'wood', x: -12 }],
    tip: 'The dark ring holds it.\nBreak the ring.' },
  { id: 'B3', name: 'Iron Hat', tier: 'N', sf: [121, 134, 141, 151], pattern: 'cap',
    story: 'A steel top storey TNT cannot break: it comes down whole and has to be knocked off the stage.',
    sfMetric: { hard_pct: 20, hard_pos: 'top (full width cap)', core: 'no', hard_layers: 1, front: 1, depth: 1, stacks: 1, source: 'heavy cap lands on table' },
    main: { r: 'cap', f: 6, cx: 3, cz: 3, soft: 'conc', corners: true }, stage: 3,
    sides: [{ r: 'block', f: 2, cx: 2, cz: 2, mat: 'wood', x: -9, z: 1 }, { r: 'block', f: 2, cx: 2, cz: 2, mat: 'wood', x: 9, z: 1 }],
    tip: 'The steel hat won\'t break.\nBlow it off the stage.' },
  { id: 'B4', name: 'Shelf Tower', tier: 'H', sf: [127, 137, 177], pattern: 'shelf',
    story: 'Hard deep floors split the tower into blocks: a blast drops only the storeys up to the next shelf.',
    sfMetric: { hard_pct: 35, hard_pos: 'mid shelves + pillars', core: 'no', hard_layers: 3, front: 1, depth: 1, stacks: 2, source: 'stone shelves split the tower into floors' },
    main: { r: 'shelf', f: 9, cx: 3, cz: 3, soft: 'conc', every: 3, corners: true }, stage: 3,
    sides: [{ r: 'shelf', f: 6, cx: 2, cz: 2, soft: 'brick', every: 3, corners: true, x: 12 }],
    tip: 'HARD. Dark floors hold\nwhat\'s above them.' },
  { id: 'B5', name: 'Checker Hall', tier: 'N', sf: [126, 129, 162, 175], pattern: 'checker',
    story: 'Hard and soft columns alternate: each TNT takes one soft cell, the hard neighbours keep the row up.',
    sfMetric: { hard_pct: 50, hard_pos: 'checker', core: 'no', hard_layers: 6, front: 1, depth: 1, stacks: 1, source: 'checker interlock' },
    main: { r: 'checker', f: 5, cx: 5, cz: 2, soft: 'conc' }, stage: 3,
    sides: [{ r: 'block', f: 2, cx: 2, cz: 2, mat: 'brick', x: -13 }],
    tip: 'Light and dark columns.\nWhich ones carry it?' },
  { id: 'B6', name: 'The Spine', tier: 'N', sf: [128, 131, 170], pattern: 'spine',
    story: 'A dark core rises through a brick shell: the shell falls, the core stands until TNT sits right on it.',
    sfMetric: { hard_pct: 25, hard_pos: 'center column', core: 'yes', hard_layers: 1, front: 1, depth: 2, stacks: 1, source: 'hard core in the middle' },
    main: { r: 'spine', f: 6, cx: 4, cz: 3, soft: 'brick' }, stage: 3,
    sides: [{ r: 'block', f: 3, cx: 2, cz: 2, mat: 'wood', x: -12 }, { r: 'block', f: 2, cx: 2, cz: 2, mat: 'wood', x: 12 }],
    tip: 'The dark core stands.\nTNT right on its piers.' },
  { id: 'B7', name: 'Shell and Core', tier: 'H', sf: [124, 144, 147, 154, 179], pattern: 'shell-core',
    story: 'A hard ground ring in front, a soft shell, and a core behind it: three layers, three jobs.',
    sfMetric: { hard_pct: 30, hard_pos: 'top + front-bottom, core inside', core: 'yes', hard_layers: 3, front: 1, depth: 3, stacks: 1, source: 'depth layering + wide table' },
    main: { r: 'spine', f: 5, cx: 4, cz: 3, soft: 'brick', piers: true }, stage: 3,
    sides: [{ r: 'frame', f: 4, cx: 2, cz: 2, soft: 'brick', hard: 'corners', x: 13 }], keep: { kind: 'school', x: -15 },
    tip: 'HARD. Ring, shell, core.\nAnd mind the school.' },
  { id: 'B8', name: 'Front and Back', tier: 'N', sf: [139, 142, 164], pattern: 'depth',
    story: 'A low hard-fronted block stands in front of a tall soft one: blasting the front never reaches the back.',
    sfMetric: { hard_pct: 25, hard_pos: 'front + bottom', core: 'no', hard_layers: 2, front: 1, depth: 3, stacks: 2, source: 'depth only' },
    main: { r: 'frame', f: 7, cx: 4, cz: 3, soft: 'conc', hard: 'corners', z: -8 }, stage: 3,
    sides: [{ r: 'piers', f: 3, cx: 3, cz: 2, soft: 'brick', z: 3 }],
    tip: 'Two rows. The back one\nis the big one.' },
  { id: 'B9', name: 'Sky Bridge', tier: 'N', sf: [174], pattern: 'bridge',
    story: 'Two towers tied by a steel bridge: cut one and it hangs on the other.',
    sfMetric: { hard_pct: 15, hard_pos: 'middle bridge', core: 'no', hard_layers: 2, front: 1, depth: 1, stacks: 2, source: 'bridge over a gap' },
    main: { r: 'frame', f: 6, cx: 3, cz: 3, soft: 'conc', hard: 'corners', x: -9 }, stage: 3,
    sides: [{ r: 'frame', f: 6, cx: 3, cz: 3, soft: 'conc', hard: 'corners', x: 9 }, { r: 'deck', y: 3, len: 12.1 }],
    tip: 'The bridge holds\nwhat you don\'t cut.', tntStart: 22 },
  { id: 'B10', name: 'The Citadel', tier: 'SH', boss: true, sf: [130, 140, 170], pattern: 'citadel',
    story: 'Super Hard: hard corner posts round a core, a hard-cornered side tower, a soft annex, the hospital behind.',
    sfMetric: { hard_pct: 30, hard_pos: 'back wall + center column + sides', core: 'yes', hard_layers: 2, front: 1, depth: 3, stacks: 3, source: 'hard frame + core + count' },
    main: { r: 'spine', f: 6, cx: 4, cz: 3, soft: 'conc', corners: true }, stage: 3,
    sides: [{ r: 'frame', f: 4, cx: 2, cz: 2, soft: 'brick', hard: 'corners', x: -13 }, { r: 'block', f: 3, cx: 2, cz: 2, mat: 'wood', x: 13 }],
    keep: { kind: 'hospital', x: 0, z: -16 },
    tip: 'SUPER HARD. Posts, core,\nthen the heap.' }
];
