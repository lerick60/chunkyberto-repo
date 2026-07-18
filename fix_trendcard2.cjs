const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const targetStr = `                <div className="grid grid-cols-2 gap-3 mb-3">
                  <button 
                    type="button" 
                    onClick={(e) => { e.preventDefault(); onGenerateScript(trend); }} 
                    disabled={isGeneratingScript}
                    className={\`w-full flex items-center justify-center gap-2 py-3 mb-2 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all bg-slate-700 hover:bg-slate-600 active:scale-95 text-white shadow-xl\`}
                  >
                    {isGeneratingScript ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />} 
                    {isGeneratingScript ? 'Generando...' : 'Generar Guion'}
                  </button>
                  <div className="flex gap-2">
                  <button 
                    type="button" 
                    onClick={(e) => { e.preventDefault(); onGenerateVideoPrompts(trend); }}`;

const newStr = `                <button 
                  type="button" 
                  onClick={(e) => { e.preventDefault(); onGenerateScript(trend); }} 
                  disabled={isGeneratingScript}
                  className={\`w-full flex items-center justify-center gap-2 py-3 mb-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all bg-slate-700 hover:bg-slate-600 active:scale-95 text-white shadow-xl\`}
                >
                  {isGeneratingScript ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />} 
                  {isGeneratingScript ? 'Generando...' : 'Generar Guion'}
                </button>
                <div className="grid grid-cols-2 gap-3 mb-3">
                  <button 
                    type="button" 
                    onClick={(e) => { e.preventDefault(); onGenerateVideoPrompts(trend); }}`;

const targetEndStr = `                  </button>
                  </div>`;
const newEndStr = `                  </button>`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, newStr);
  if (code.includes(targetEndStr)) {
    code = code.replace(targetEndStr, newEndStr);
  } else { console.log('targetEndStr not found'); }
  fs.writeFileSync('App.tsx', code);
  console.log('Fixed TrendCard UI!');
} else {
  console.log('targetStr not found');
}
