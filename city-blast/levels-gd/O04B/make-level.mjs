// O04B "Needle Court" (old-polish batch 2, replaces old L4 "Needle Court", F16 stepped needle; SLOTS-50 slot 20 = the glass card).
// Lesson: glass breaks, it carries nothing: the needle's lower storeys are glass panes on grey concrete posts; a TNT on a pane only
// breaks glass, two concrete legs side by side drop it onto the timber hall in front. The blue hospital stands to one side (blue: 15).
// Code O04B (O04 is the Fire Station rebuild of o36). Kit g7oNeedle / g7oTicket / g7oCott; the hospital is the game's keep6.
import { scene, E, T } from '../old2-kit.mjs';
const TZ = E('TZ', -8), CX = E('CX', 10.6), SZ = E('SZ', 1.4);
scene({ name: 'Needle Court', bp: 'O04B', replaces: 'o4', tnt: 12, tier: 'R', launch: { el: ['wood', 'brick', 'concrete', 'glass', 'blue'], slot: 20, before: ['wood', 'concrete', 'glass', 'blue'] },
  pattern: 'glass teach: glass panes break and carry nothing; two concrete legs side by side drop the needle onto the hall',
  ftip: 'Glass breaks. It holds nothing up.',
  sol: [T('A:z+', 0, 0), T('A:z+', 0, 1), T('S:z+', 0, 0), T('C:z+', 0, 0), T('A:z+', 1, 1)],
  keeps: [{ kind: 'keep6', x: -CX, z: TZ + 0.6, floors: 3, cx: 3, cz: 3, name: 'the hospital', role: 'hospital', fixType: 'hospital' }],
  parts: [
    { id: 'A', kind: 'g7oNeedle', x: 0, z: TZ, hx: 3.4, gh: 4.2, sh: 3.2, ng: 3, nu: E('NU', 2) },
    { id: 'S', kind: 'g7oTicket', x: 0, z: SZ, hx: E('SHX', 5.0), hz: 2.6, nb: 2 },
    { id: 'C', kind: 'g7oCott', x: CX, z: TZ + 0.6, hx: 3.2, hz: 2.8, side: 1 } ] });
