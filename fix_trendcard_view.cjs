const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const targetView = `            {!trend.isMasterSummary && (
              <>
                {trend.videoPrompts && (`;

const newView = `            {!trend.isMasterSummary && (
              <>
                {trend.movieScript && (
                  <div className="bg-slate-900/60 border-2 border-slate-700/50 rounded-[1.5rem] p-6 shadow-inner max-h-[300px] overflow-y-auto custom-scrollbar mb-3">
                    <div className={\`flex items-center justify-between mb-3 text-\${persona.color} font-black text-[10px] uppercase tracking-widest sticky top-0 bg-slate-900/80 backdrop-blur-sm py-1 z-10\`}>
                      <div className="flex items-center gap-2"><FileText size={14} /> Guion Cinematográfico</div>
                      <div className="flex items-center gap-2">
                        <DownloadButton text={trend.movieScript} filename={\`Guion_\${trend.title.replace(/\\s+/g, '_')}.txt\`} />
                        <CopyButton text={trend.movieScript} />
                      </div>
                    </div>
                    <div className="markdown-body italic text-slate-300 text-xs font-bold leading-relaxed whitespace-pre-wrap">
                      <Markdown remarkPlugins={[remarkGfm]}>{trend.movieScript}</Markdown>
                    </div>
                  </div>
                )}
                {trend.videoPrompts && (`;

if (code.includes(targetView)) {
  code = code.replace(targetView, newView);
  fs.writeFileSync('App.tsx', code);
  console.log("TrendCard view updated");
} else {
  console.log("TrendCard view not found");
}
