// O05B "Doorstop Corner" (old-polish batch 2, replaces old L5 "Doorstop Corner", F24 wedge; SLOTS-50 slot 22: glass + blue + turn).
// Lesson kept: turn the view: the wedge's glass nose faces the blue school in front; tipped forward it lands on the school, tipped
// back (two back legs, turn the view) it lands on the timber hall behind. Brick + glass + wood + blue. Code O05B (O05 is the Valley
// Station rebuild of o6). Kit g7oWedge / g7oTicket / g7oCott; the school is the game's keep6.
import { scene, E, T } from '../old2-kit.mjs';
const TZ = E('TZ', -4), CX = E('CX', 10.2), SZ = E('SZ', -13.5), KZ = E('KZ', 6.6);
scene({ name: 'Doorstop Corner', bp: 'O05B', replaces: 'o5', tnt: 12, teaches: 'rotate', launch: { el: ['wood', 'brick', 'glass', 'blue', 'rotate'], slot: 22, before: ['wood', 'brick', 'concrete', 'glass', 'blue', 'rotate'] },
  pattern: 'rotate: the blue school in front of the glass nose, the hall behind; two back legs lay the wedge on the hall',
  ftip: 'Turn the view. Blast the back.',
  faces: { right: ['z-'], wrong: ['z+'] },
  sol: [T('A:z-', 0, 0), T('A:z-', 0, 1), T('S:z+', 0, 0), T('B:z-', 0, 0), T('C:z-', 0, 0)],
  keeps: [{ kind: 'keep6', x: 0, z: KZ, floors: 2, cx: 3, cz: 2, name: 'the school', role: 'school', fixType: 'school' }],
  parts: [
    { id: 'A', kind: 'g7oWedge', x: 0, z: TZ, hx: 3.6, hz: 3.4, gh: 4.0, sh: 3.2, ns: E('NS', 4) },
    { id: 'S', kind: 'g7oTicket', x: 0, z: SZ, hx: E('SHX', 5.0), hz: 3.0, nb: 2 },
    { id: 'B', kind: 'g7oCott', x: -CX, z: TZ, hx: 3.2, hz: 2.8, side: -1 },
    { id: 'C', kind: 'g7oCott', x: CX, z: TZ, hx: 3.2, hz: 2.8, side: 1 } ] });
