// a test build from the current blueprints with the budgets tuned so far (B8/B9 still being re-tested)
import { writeFileSync } from 'node:fs';
import { BLUEPRINTS } from './blueprints.mjs';
import { generate4b as generate } from './gen.mjs';
import { buildHtml } from './build.mjs';
const T = { B1: 18, B2: 17, B3: 18, B4: 22, B5: 16, B6: 13, B7: 17, B8: 26, B9: 22, B10: 26 };
writeFileSync(process.argv[2], buildHtml(BLUEPRINTS.map(bp => generate(bp, { tnt: T[bp.id] })), true));
console.log('ok');
