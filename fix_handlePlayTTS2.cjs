const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const target = "if (!text || text.trim().length === 0) return null;";
const replacement = "if (!text || text.trim().length === 0) return null;\n    const cleanText = text.replace(/^\\(Voz.*?\\):\\s*/i, '').trim();";

const promptTarget = "const prompt = `Read this text with a ${styleLabel} tone: ${text}`;";
const promptReplacement = "const prompt = `Read this text with a ${styleLabel} tone: ${cleanText}`;";

code = code.replace(target, replacement);
code = code.replace(promptTarget, promptReplacement);

fs.writeFileSync('App.tsx', code);
