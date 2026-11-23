// D-blast-PAD (Khai 23/11): every building of a level stands inside the yellow sand pad, laid out round the pad centre (0, 0).
// centre(lvl) shifts the whole scene (parts, keeps, barrels) so its footprint is centred on the pad: a rigid shift, the physics
// between the buildings does not change. Footprints are estimated from the part sizes (half sizes + the base pad margin).
// Returns { dx, dz, r }: r = the farthest footprint corner from the centre (compare with the pad radius the camera agent sets).
const half = (p) => {
  if (p.kind === 'g7oHuts') { const W = (p.n || 5) * (p.w || 1.8) + ((p.n || 5) - 1) * 0.25; return [W / 2 + 1, (p.hz || 1.4) + 1.2]; }
  if (p.kind === 'g7oMotel') { const W = (p.n || 4) * (p.w || 3) + ((p.n || 4) - 1) * 0.1; return [W / 2 + 1, (p.hz || 2.6) + 2]; }
  if (p.kind === 'g7oSpan') return [(p.len || 8) / 2 + 0.5, (p.hz || 2) + 0.5];
  const hx = p.hx || p.r || 3, hz = p.hz || p.r || p.hx || 3;
  return [hx + 2, hz + 2];
};
export function centre(lvl, opt = {}) {
  const boxes = lvl.parts.map(p => { const [a, b] = half(p); return [p.x - a, p.x + a, p.z - b, p.z + b]; })
    .concat((lvl.keeps || []).map(k => { const a = (k.cx || 3) * 1.6 + 1.5, b = (k.cz || 3) * 1.6 + 1.5; return [k.x - a, k.x + a, k.z - b, k.z + b]; }))
    .concat((lvl.tanks || []).map(t => [t[0] - 0.5, t[0] + 0.5, t[1] - 0.5, t[1] + 0.5]));
  const x0 = Math.min(...boxes.map(b => b[0])), x1 = Math.max(...boxes.map(b => b[1])), z0 = Math.min(...boxes.map(b => b[2])), z1 = Math.max(...boxes.map(b => b[3]));
  const dx = opt.x === false ? 0 : +(-(x0 + x1) / 2).toFixed(2), dz = +(-(z0 + z1) / 2).toFixed(2);
  lvl.parts.forEach(p => { p.x = +(p.x + dx).toFixed(2); p.z = +(p.z + dz).toFixed(2); });
  (lvl.keeps || []).forEach(k => { k.x = +(k.x + dx).toFixed(2); k.z = +(k.z + dz).toFixed(2); });
  if (lvl.tanks) lvl.tanks = lvl.tanks.map(t => [+(t[0] + dx).toFixed(2), +(t[1] + dz).toFixed(2)]);
  const r = Math.max(...boxes.map(b => Math.max(...[[b[0], b[2]], [b[0], b[3]], [b[1], b[2]], [b[1], b[3]]].map(([x, z]) => Math.hypot(x + dx, z + dz)))));
  lvl.pad = { dx, dz, r: +r.toFixed(1) };   // record (D-blast-PAD): the shift applied and the footprint radius
  return lvl.pad;
}
