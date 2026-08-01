const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const target = "const text = frame.narrationText.replace(/^\\(Voz (masculina|femenina)\\):\\s*/i, '').trim();";
const replacement = "const text = frame.narrationText.replace(/^\\(Voz.*?\\):\\s*/i, '').trim();";
code = code.replace(target, replacement);

fs.writeFileSync('App.tsx', code);
