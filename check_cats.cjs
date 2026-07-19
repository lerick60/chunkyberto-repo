const fs = require('fs');
const code = fs.readFileSync('App.tsx', 'utf8');

const typeMatch = code.match(/type Category =\s*([^;]+);/);
if (!typeMatch) { console.log('no type match'); process.exit(0); }
const typeRaw = typeMatch[1];
const typeIds = [...typeRaw.matchAll(/'([^']+)'/g)].map(m => m[1]);

const optMatch = code.match(/const categoryOptions = \[([\s\S]+?)\];/);
if (!optMatch) { console.log('no opts match'); process.exit(0); }
const optRaw = optMatch[1];
const optIds = [...optRaw.matchAll(/id:\s*'([^']+)'/g)].map(m => m[1]);

const missingInOpts = typeIds.filter(id => !optIds.includes(id));
console.log("In Type but not in Opts:", missingInOpts);

const missingInType = optIds.filter(id => !typeIds.includes(id));
console.log("In Opts but not in Type:", missingInType);
