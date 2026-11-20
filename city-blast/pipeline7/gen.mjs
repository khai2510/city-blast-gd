// blueprint -> City Blast level object (the same scene format as LEVELS: parts of kind mass / deck6 / plinth7, keeps)
const BAY = 2.7;
const nodes = (cx, cz, f) => { const o = {}; for(let i = 0; i < cx; i++) for(let j = 0; j < cz; j++) if(f(i, j)) o[i + ',' + j] = 'pier'; return o; };
const corners = (cx, cz) => nodes(cx, cz, (i, j) => (i === 0 || i === cx - 1) && (j === 0 || j === cz - 1));
const ring = (cx, cz) => nodes(cx, cz, (i, j) => i === 0 || i === cx - 1 || j === 0 || j === cz - 1);
const checker = (cx, cz) => nodes(cx, cz, (i, j) => (i + j) % 2 === 0);
const width = (cx) => (cx - 1) * BAY + 0.62 + 1.3;

function recipe(r, id, x, z, y){
  const base = { id, kind: 'mass', x: x || 0, z: z || 0 };
  if(y) base.y = y;
  const soft = r.soft || r.mat || 'conc';
  switch(r.r){
    case 'block': return [Object.assign(base, { tiers: [{ f: r.f, cx: r.cx, cz: r.cz, mat: soft, skin: 'alt' }], fh: r.fh || 2.7, roof: { cap: 1 } })];
    case 'frame': {
      const cols = r.hard === 'ring' ? ring(r.cx, r.cz) : corners(r.cx, r.cz);
      return [Object.assign(base, { tiers: [{ f: r.f, cx: r.cx, cz: r.cz, mat: soft, skin: 'alt', cols }], fh: r.fh || 2.7 })];
    }
    case 'cap': { const t0 = { f: r.f - 1, cx: r.cx, cz: r.cz, mat: soft, skin: 'alt' }; if(r.corners) t0.cols = corners(r.cx, r.cz);
      return [Object.assign(base, { tiers: [t0, { f: 1, cx: r.cx, cz: r.cz, mat: 'steel', skin: 'full' }], fh: r.fh || 2.7, roof: { tank: 1 } })]; }
    case 'shelf': {
      const tiers = [], every = r.every || 3; let left = r.f;
      while(left > 0){
        const n = Math.min(every - 1, left), t = { f: n, cx: r.cx, cz: r.cz, mat: soft, skin: 'alt' }; if(r.corners) t.cols = corners(r.cx, r.cz); tiers.push(t); left -= n;
        if(left > 0){ tiers.push({ f: 1, cx: r.cx, cz: r.cz, mat: soft, skin: 'full', slab: 'tdeck', cols: nodes(r.cx, r.cz, () => true) }); left -= 1; }
      }
      return [Object.assign(base, { tiers, fh: r.fh || 2.7, roof: { cap: 1 } })];
    }
    case 'checker': return [Object.assign(base, { tiers: [{ f: r.f, cx: r.cx, cz: r.cz, mat: soft, skin: 'alt', cols: checker(r.cx, r.cz) }], fh: r.fh || 2.7 })];
    case 'piers': return [Object.assign(base, { tiers: [{ f: r.f, cx: r.cx, cz: r.cz, mat: soft, skin: 'alt', g: 'open', cols: nodes(r.cx, r.cz, () => true), colsF: 1 }], fh: r.fh || 2.7 })];
    case 'spine': {
      const t = { f: r.f, cx: r.cx, cz: r.cz, mat: soft, skin: 'alt', core: { i: [1, r.cx - 2], j: [1, Math.max(1, r.cz - 2)], up: 1 } };
      if(r.corners) t.cols = corners(r.cx, r.cz);
      if(r.piers){ t.cols = Object.assign(ring(r.cx, r.cz), t.cols || {}); t.colsF = 1; t.g = 'open'; }
      return [Object.assign(base, { tiers: [t], fh: r.fh || 2.7 })];
    }
    case 'deck': return [{ id, kind: 'deck6', x: 0, y: r.y || 3, dy: y || 0, len: r.len, wd: 2.7, n: 3 }];
  }
  throw new Error('recipe ' + r.r);
}

export function generate(bp, opt){
  opt = opt || {};
  const ids = ['A', 'B', 'C', 'D', 'E'], y = bp.stage || 0, parts = [];
  const all = [Object.assign({}, bp.main), ...bp.sides.map(s => Object.assign({}, s))];
  all.forEach((r, k) => recipe(r, ids[k], r.x, r.z, y).forEach(p => parts.push(p)));
  if(y){   // a stone stage under every target part (SF: the table), wide enough that a heap stays on it
    let x0 = 1e9, x1 = -1e9, z0 = 1e9, z1 = -1e9;
    all.filter(r => r.r !== 'deck').forEach(r => { const w = width(r.cx) / 2, d = width(r.cz) / 2; x0 = Math.min(x0, (r.x || 0) - w); x1 = Math.max(x1, (r.x || 0) + w); z0 = Math.min(z0, (r.z || 0) - d); z1 = Math.max(z1, (r.z || 0) + d); });
    parts.unshift({ id: 'P', kind: 'plinth7', h: y, w: x1 - x0 + 6, d: z1 - z0 + 6, x: (x0 + x1) / 2, z: (z0 + z1) / 2 });
  }
  const lvl = { name: bp.name, f: bp.main.f, tier: bp.tier, kind: 'scene', hero: 'A', heroId: 'F04', teaches: null, target: 0.85, yaw: 0.35, d: 1, fillMax: 0.73,
    parts, charges: { tnt: opt.tnt || bp.tnt || 12 }, tip: bp.tip, bp: bp.id,
    sol: [['tnt', 'A:z+', 0, 0], ['tnt', 'A:z+', 0, 1], ['tnt', 'A:z+', 0, 2]] };
  if(bp.tier !== 'N') lvl.hard = true;
  if(bp.boss) lvl.boss = true;
  if(y) lvl.stage7 = { h: y };
  if(bp.keep){
    const role = bp.keep.kind, name = 'the ' + role;
    lvl.keeps = [{ kind: 'keep6', x: bp.keep.x, z: bp.keep.z || 0, floors: 2, cx: 2, cz: 2, fixType: role, name, role }];
    lvl.keep = { name, sides: [], type: role, role, full: 1 };
  }
  return lvl;
}

// ---- v3 (20/11): rack buildings. A steel frame (not a target) and LOOSE elements of different hardness on every floor,
// laid out floor by floor from a Smash Fest pattern. Element kinds:
//   soft  = wood / light brick cubes (one TNT clears a cluster)      mid  = concrete cubes (need a close blast)
//   hard  = reinforced-concrete block (only a TNT right on it)        drum = hollow steel drum (never breaks: blow it off)
//   glass = a facade pane on the front edge (the front layer)
const EL = { soft: f => (f % 2 ? 'bkw' : 'wpost'), mid: () => 'concrete', hard: () => 'rc', drum: () => 'drum7' };
export function rackItems(r){
  const it = [], bx = r.bx, bz = r.bz, n = r.floors, mid = (v, m) => v > 0 && v < m - 1;
  const kind = (f, i, j) => {
    const edge = i === 0 || i === bx - 1, centre = mid(i, bx), front = j === bz - 1, back = j === 0;
    switch(r.pattern){
      case 'frame':   return edge ? 'hard' : 'soft';                                         // hard frame round a soft middle
      case 'corners': return edge && (front || back) && f % 2 === 0 ? 'hard' : 'soft';       // hard corner blocks, every other floor
      case 'cap':     return f >= n - (n >= 5 ? 2 : 1) ? 'drum' : f < 2 ? 'mid' : 'soft';     // drums on top that will not break
      case 'shelf':   return f % 2 === 1 ? 'hard' : 'soft';                                  // a hard floor every other storey
      case 'spine':   return centre ? 'hard' : 'soft';                                        // hard core column, soft round it
      case 'checker': return (i + j + f) % 2 ? 'drum' : 'soft';                               // drums and crates alternating
      case 'shell':   return centre && (bz < 3 || mid(j, bz)) ? 'hard' : f === n - 1 ? 'drum' : 'soft';   // core in the middle column (deep only if seen) + drum lid, glass front
      case 'depth':   return back ? (f % 2 === 0 ? 'hard' : 'mid') : front ? 'soft' : 'mid'; // soft front, hard back row
      case 'base':    return f === 0 ? 'hard' : 'soft';                                       // hard ground floor, soft above
      default:        return f < 1 ? 'mid' : 'soft';                                          // plain side building
    }
  };
  for(let f = 0; f < n; f++) for(let i = 0; i < bx; i++) for(let j = 0; j < bz; j++){
    if((r.glass || []).includes(f) && j === bz - 1) it.push([f, i, j, 'glass', 2.1, 2.1, 0.14, 0, 1.12]);
    const k = kind(f, i, j);
    if(k === 'hard'){ it.push([f, i, j, EL.hard(f), 0.9, 1.7, 0.9, 0, -0.2]); continue; }
    const key = EL[k](f), s = k === 'drum' ? 1.0 : 1.1;
    it.push([f, i, j, key, s, s, s, -0.6, -0.2]); it.push([f, i, j, key, s, s, s, 0.6, -0.2]);
  }
  return it;
}
export function rackPart(r, id){
  return { id, kind: 'rack7', x: r.x || 0, z: r.z || 0, bx: r.bx, bz: r.bz, floors: r.floors, fh: 2.7, items: rackItems(r) };
}
export function generate3(bp, opt){
  opt = opt || {};
  const ids = ['A', 'B', 'C', 'D'], parts = [bp.main, ...bp.sides].map((r, k) => rackPart(r, ids[k]));
  const lvl = { name: bp.name, f: bp.main.floors, tier: bp.tier, kind: 'scene', hero: 'A', heroId: 'F04', teaches: null, target: 0.85, yaw: 0.35, d: 1, fillMax: 0.73,
    parts, charges: { tnt: opt.tnt || bp.tnt || 12 }, tip: bp.tip, bp: bp.id, rack7: true, sol: [['tnt', 'A:z+', 0, 0], ['tnt', 'A:z+', 0, 1]] };
  if(bp.tier !== 'N') lvl.hard = true;
  if(bp.boss) lvl.boss = true;
  if(bp.keep){ const role = bp.keep.kind, name = 'the ' + role;
    lvl.keeps = [{ kind: 'keep6', x: bp.keep.x, z: bp.keep.z || 0, floors: 2, cx: 2, cz: 2, fixType: role, name, role }];
    lvl.keep = { name, sides: [], type: role, role, full: 1 }; }
  return lvl;
}

// ---- v4 (20/11, Khai: "the building must still fall"): ordinary bonded buildings that collapse, with HARD members
// (hard7 columns, hard7s floors) placed storey by storey from a Smash Fest pattern. A hard member counts until BROKEN.
//   hardCol(f, i, j) / hardSlab(f) per pattern; one tier per storey so every storey can differ.
export function hardTiers(r){
  const n = r.f, cx = r.cx, cz = r.cz, soft = r.soft || 'conc', T = [];
  const edgeI = i => i === 0 || i === cx - 1, edgeJ = j => j === 0 || j === cz - 1;
  const corner = (i, j) => edgeI(i) && edgeJ(j), perim = (i, j) => edgeI(i) || edgeJ(j), inner = (i, j) => !edgeI(i) && !edgeJ(j);
  const P = {
    corners: { col: (f, i, j) => corner(i, j),                                   slab: f => f > 0 && f % 2 === 0 },
    ring:    { col: (f, i, j) => perim(i, j),                                    slab: f => f === n - 1 || f === 1 },
    cap:     { col: (f, i, j) => f >= n - 1 || (corner(i, j)),                   slab: f => f >= n - 1 || f === 1 },
    shelf:   { col: (f, i, j) => corner(i, j),                                   slab: f => f % 3 === 1 },
    spine:   { col: (f, i, j) => inner(i, j) || corner(i, j),                    slab: f => f === Math.floor(n / 2) || f === n - 1 },
    checker: { col: (f, i, j) => (i + j + f) % 2 === 0,                          slab: f => f === n - 1 },
    shell:   { col: (f, i, j) => (perim(i, j) && f === 0) || inner(i, j) || corner(i, j), slab: f => f === n - 1 || f === 2 },
    depth:   { col: (f, i, j) => j === 0 || corner(i, j),                        slab: f => f === n - 1 || f === 2 },
    base:    { col: (f, i, j) => f <= 1 || corner(i, j),                         slab: f => f === 0 },
    plain:   { col: (f, i, j) => corner(i, j),                                   slab: f => false }
  }[r.pattern || 'plain'];
  for(let f = 0; f < n; f++){
    const cols = {}; for(let i = 0; i < cx; i++) for(let j = 0; j < cz; j++) if(P.col(f, i, j)) cols[i + ',' + j] = 'hard7';
    const t = { f: 1, cx, cz, mat: soft, skin: r.skin || 'alt', cols };
    if(P.slab(f)) t.slab = 'hard7s';
    T.push(t);
  }
  return T;
}
export function generate4(bp, opt){
  opt = opt || {};
  const ids = ['A', 'B', 'C', 'D'], parts = [bp.main, ...bp.sides].map((r, k) => ({ id: ids[k], kind: 'mass', x: r.x || 0, z: r.z || 0, tiers: hardTiers(r), fh: 2.7, roof: r.roof || undefined }));
  const lvl = { name: bp.name, f: bp.main.f, tier: bp.tier, kind: 'scene', hero: 'A', heroId: 'F04', teaches: null, target: 0.85, yaw: 0.35, d: 1, fillMax: 0.73,
    parts, charges: { tnt: opt.tnt || bp.tnt || 12 }, tip: bp.tip, bp: bp.id, hard7: true, sol: [['tnt', 'A:z+', 0, 0], ['tnt', 'A:z+', 0, 1], ['tnt', 'A:z+', 0, 2]] };
  if(bp.tier !== 'N') lvl.hard = true;
  if(bp.boss) lvl.boss = true;
  if(bp.keep){ const role = bp.keep.kind, name = 'the ' + role;
    lvl.keeps = [{ kind: 'keep6', x: bp.keep.x, z: bp.keep.z || 0, floors: 2, cx: 2, cz: 2, fixType: role, name, role }];
    lvl.keep = { name, sides: [], type: role, role, full: 1 }; }
  return lvl;
}

// ---- v4b: hard corner columns (light, they keep the frame up) + 2-3 heavy VAULTS per building placed by the pattern
const VAULTS = {   // [floor (0 = ground; 'top' = n-1, 'mid' = n/2), i, j] of the bay the vault sits in
  corners: [['top', 0, 0], ['top', -1, -1]],                 // the heavy pieces up in the corners
  ring:    [['mid', 0, -1], ['mid', -1, 0]],                 // on the ring, half way up
  cap:     [['top', 0, 0], ['top', -1, 0], ['top', 0, -1]],  // the whole top is heavy
  shelf:   [['mid', 0, 0], ['top', -1, -1], [1, -1, 0]],     // heavy shelves at three heights
  spine:   [['mid', 'c', 'c'], [1, 'c', 'c'], ['top', 'c', 'c']],   // stacked in the middle
  checker: [['mid', 0, 0], ['mid', -1, -1]],
  shell:   [['top', 'c', 'c'], ['mid', 'c', 'c']],           // the core and the lid
  depth:   [[1, 0, 0], ['mid', -1, 0]],                      // at the back (j = 0)
  base:    [[0, 0, 0]],                                      // a heavy ground floor
  plain:   [['top', 0, 0]]
};
export function vaultParts(r, id, x0, z0){
  const n = r.f, bays = (c) => c - 1, list = VAULTS[r.pattern || 'plain'] || [];
  const X0 = -(r.cx - 1) * 2.7 / 2, Z0 = -(r.cz - 1) * 2.7 / 2;
  return list.map((v, k) => {
    const fl = v[0] === 'top' ? n - 1 : v[0] === 'mid' ? Math.floor(n / 2) : v[0];
    const bi = v[1] === 'c' ? Math.floor((bays(r.cx) - 1) / 2) : v[1] < 0 ? bays(r.cx) + v[1] : v[1];
    const bj = v[2] === 'c' ? Math.floor((bays(r.cz) - 1) / 2) : v[2] < 0 ? bays(r.cz) + v[2] : v[2];
    return { id: id + 'v' + k, kind: 'vault7', x: (x0 || 0) + X0 + (bi + 0.5) * 2.7, z: (z0 || 0) + Z0 + (bj + 0.5) * 2.7, y: fl * 2.7 + 0.8 + 0.01, fl, w: 1.9, h: 1.6, d: 1.9 };
  });
}
export function generate4b(bp, opt){
  const lvl = generate4(bp, opt), all = [bp.main, ...bp.sides], ids = ['A', 'B', 'C', 'D'];
  lvl.parts.forEach((p, k) => { const r = all[k]; p.tiers = hardTiers(Object.assign({}, r, { pattern: 'plain' })).map(t => { delete t.slab; return t; }); });   // corners only
  all.forEach((r, k) => vaultParts(r, ids[k], r.x, r.z).forEach(v => lvl.parts.push(v)));
  return lvl;
}
