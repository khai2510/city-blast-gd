// O26 "The Bullet" (old-polish batch 2, replaces old L26 "The Bullet", F25 round glass tower). Lesson re-expressed (D-blast-L50: the
// old "steel behind glass: stack on it" needs steel, launched at 40): the legs stand behind a glass skin on a ring; the glass breaks,
// the ring of concrete legs carries it: two legs side by side and it falls onto the pavilion. Concrete + glass + wood. Kit g7oBullet /
// g7oTicket / g7oCott. Earliest slot 20 (glass).
import { scene, E, T } from '../old2-kit.mjs';
const TZ = E('TZ', -8), CX = E('CX', 10.4), SZ = E('SZ', 1.2);
scene({ name: 'The Bullet', bp: 'O26', replaces: 'o26', tnt: 16, launch: { el: ['wood', 'brick', 'concrete', 'glass'], slot: 20, before: ['wood', 'brick', 'concrete', 'glass', 'steel'] },
  pattern: 'glass skin, ring of legs: two legs side by side and the bullet falls onto the pavilion',
  ftip: 'Glass holds nothing. Two legs side by side.',
  parts: [
    { id: 'A', kind: 'g7oBullet', x: 0, z: TZ, r: 3.3, gh: 4.2, sh: 3.2, ns: E('NS', 4) },
    { id: 'S', kind: 'g7oTicket', x: 0, z: SZ, hx: E('SHX', 5.0), hz: 2.6, nb: 2 },
    { id: 'B', kind: 'g7oCott', x: -CX, z: TZ + 0.6, hx: 3.2, hz: 2.8, side: -1 },
    { id: 'C', kind: 'g7oCott', x: CX, z: TZ + 0.6, hx: 3.2, hz: 2.8, side: 1 } ] });
