#!/usr/bin/env node
// levels-v6.json = L1-12 (src-l1-12.js) + L13-36 carried over from the base checkpoint's embedded V5 list (stub: true = not yet redesigned).
//   node levels6/tools/build-levels.js <base.html> [out.json]
'use strict';
const fs = require('fs'), path = require('path');
const base = fs.readFileSync(process.argv[2], 'utf8');
const a = 'var LEVELS = [', i = base.indexOf(a), j = base.indexOf('}];\n// Hard = the labelled spikes');
if (i < 0 || j < 0) { console.error('level list not found in base'); process.exit(1); }
const old = JSON.parse(base.slice(i + a.length - 1, j + 2));
const src = require('./src-l1-12.js');
const levels = src.concat(old.slice(src.length).map(l => Object.assign({}, l, { stub: true })));
const out = process.argv[3] || path.join(__dirname, '..', 'levels-v6.json');
fs.writeFileSync(out, '{\n "levels": [\n' + levels.map(l => '  ' + JSON.stringify(l)).join(',\n') + '\n ]\n}\n');
console.log('wrote', out, levels.length, 'levels');
