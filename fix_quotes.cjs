const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

code = code.replace(/'\n11\. CRITICAL: /g, "'\\\\n11. CRITICAL: ");
code = code.replace(/'\n10\. CRITICAL: /g, "'\\\\n10. CRITICAL: ");

fs.writeFileSync('App.tsx', code);
