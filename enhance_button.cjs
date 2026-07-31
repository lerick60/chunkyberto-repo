const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const buttonTarget = `<div className="w-16 h-16 bg-slate-950/20 rounded-full flex items-center justify-center">{producingImages ? <Loader2 size={32} className="animate-spin" /> : <Sparkles size={32} />}</div>{producingImages ? \`PROCESANDO... \${storyboardProgress}%\` : 'SINTETIZAR TODO'}</button>`;

const enhancedButton = `<div className="w-16 h-16 bg-slate-950/20 rounded-full flex items-center justify-center">{producingImages ? <Loader2 size={32} className="animate-spin" /> : <Sparkles size={32} />}</div>
{producingImages ? (
  <div className="flex flex-col items-center w-full gap-2 mt-2">
    <span>PROCESANDO... {storyboardProgress}%</span>
    <div className="w-full h-2 bg-slate-950/20 rounded-full overflow-hidden">
      <div className="h-full bg-slate-950/50 transition-all duration-300" style={{ width: \`\${storyboardProgress}%\` }}></div>
    </div>
  </div>
) : 'SINTETIZAR TODO'}
</button>`;

code = code.replace(buttonTarget, enhancedButton);
fs.writeFileSync('App.tsx', code);
