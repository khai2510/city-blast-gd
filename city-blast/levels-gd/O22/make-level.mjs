// O22 "The Pencil" (old-polish batch 2, replaces old L22 "The Pencil", F26 slim tower; rotate practice). Lesson kept: turn the view,
// blast the back: the blue school stands in front of the pencil, its landing (a timber ticket hall) behind it. Two front legs drop it
// onto the blue; two back legs (turn the view) lay it on the hall. Concrete (no steel: D-blast-L50) + wood + blue. Kit g7oPencil /
// g7oTicket / g7oCott; the school is the game's keep6. Earliest slot 15 (blue).
import { scene, E, T } from '../old2-kit.mjs';
const TZ = E('TZ', -4), CX = E('CX', 9.8), SZ = E('SZ', -14), KZ = E('KZ', 5.5);
scene({ name: 'The Pencil', bp: 'O22', replaces: 'o22', tnt: 12, teaches: 'rotate', launch: { el: ['wood', 'brick', 'concrete', 'blue', 'rotate'], slot: 15, before: ['wood', 'concrete', 'steel', 'rotate'] },
  pattern: 'rotate: the blue school in front, the ticket hall behind; tipped back (two back legs) the pencil lies on the hall',
  ftip: 'Turn the view. Blast the back.',
  faces: { right: ['z-'], wrong: ['z+'] },
  sol: [T('A:z-', 0, 0), T('A:z-', 0, 1), T('S:z+', 0, 0), T('B:z+', 0, 0), T('C:z+', 0, 0)],
  keeps: [{ kind: 'keep6', x: 0, z: KZ, floors: 2, cx: 3, cz: 2, name: 'the school', role: 'school', fixType: 'school' }],
  parts: [
    { id: 'A', kind: 'g7oPencil', x: 0, z: TZ, hx: 2.6, gh: 4.4, sh: 3.2, ns: E('NS', 5) },
    { id: 'S', kind: 'g7oTicket', x: 0, z: SZ, hx: E('SHX', 5.0), hz: 3.0, nb: 2 },
    { id: 'B', kind: 'g7oCott', x: -CX, z: TZ, hx: 3.2, hz: 2.8, side: -1 },
    { id: 'C', kind: 'g7oCott', x: CX, z: TZ, hx: 3.2, hz: 2.8, side: 1 } ] });
