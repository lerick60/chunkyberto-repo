const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

// 1. Props
const targetProps = "export const TrendCard: React.FC<{ trend: Trend; onRewrite: (trend: Trend) => void; onSelect: (trend: Trend) => void; onGenerateVideoPrompts: (trend: Trend) => void; onGenerateImagePrompts: (trend: Trend) => void; onGenerateScript: (trend: Trend) => void; isRewriting: boolean; isGeneratingVideoPrompts: boolean; isGeneratingImagePrompts: boolean; isGeneratingScript: boolean; language: Language; persona: Persona; }> = ({ trend, onRewrite, onSelect, onGenerateVideoPrompts, onGenerateImagePrompts, onGenerateScript, isRewriting, isGeneratingVideoPrompts, isGeneratingImagePrompts, isGeneratingScript, persona }) => {";
const newProps = "export const TrendCard: React.FC<{ trend: Trend; onRewrite: (trend: Trend) => void; onSelect: (trend: Trend) => void; onGenerateVideoPrompts: (trend: Trend) => void; onGenerateImagePrompts: (trend: Trend) => void; onGenerateScript: (trend: Trend) => void; onGeneratePodcast: (trend: Trend) => void; isRewriting: boolean; isGeneratingVideoPrompts: boolean; isGeneratingImagePrompts: boolean; isGeneratingScript: boolean; isGeneratingPodcast: boolean; language: Language; persona: Persona; }> = ({ trend, onRewrite, onSelect, onGenerateVideoPrompts, onGenerateImagePrompts, onGenerateScript, onGeneratePodcast, isRewriting, isGeneratingVideoPrompts, isGeneratingImagePrompts, isGeneratingScript, isGeneratingPodcast, persona }) => {";

if (code.includes(targetProps)) {
  code = code.replace(targetProps, newProps);
  console.log("TrendCard props updated.");
} else {
  console.log("TrendCard props not found.");
}

// 2. Buttons in TrendCard
// Look for where onGenerateScript is bound.
const targetButtons = `<button 
                  type="button" 
                  onClick={(e) => { e.preventDefault(); onGenerateScript(trend); }} 
                  disabled={isGeneratingScript}
                  className={\`w-full flex items-center justify-center gap-2 py-3 mb-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all bg-slate-700 hover:bg-slate-600 active:scale-95 text-white shadow-xl\`}
                >
                  {isGeneratingScript ? <Loader2 size={14} className="animate-spin" /> : <FileText size={14} />} 
                  {isGeneratingScript ? 'Generando...' : 'Generar Guion'}
                </button>`;

const newButtons = `<button 
                  type="button" 
                  onClick={(e) => { e.preventDefault(); onGeneratePodcast(trend); }} 
                  disabled={isGeneratingPodcast}
                  className={\`w-full flex items-center justify-center gap-2 py-3 mb-3 rounded-xl font-black text-[10px] uppercase tracking-widest transition-all bg-indigo-600 hover:bg-indigo-500 active:scale-95 text-white shadow-xl\`}
                >
                  {isGeneratingPodcast ? <Loader2 size={14} className="animate-spin" /> : <Mic2 size={14} />} 
                  {isGeneratingPodcast ? 'Generando...' : 'Generar Podcast'}
                </button>\n                ` + targetButtons;

if (code.includes(targetButtons)) {
  code = code.replace(targetButtons, newButtons);
  console.log("TrendCard buttons updated.");
} else {
  console.log("TrendCard buttons not found.");
}

// 3. View in TrendCard (add Podcast Script Viewer)
const targetView = `{trend.movieScript && (
                  <div className="bg-slate-900/60 border-2 border-slate-700/50 rounded-[1.5rem] p-6 shadow-inner max-h-[300px] overflow-y-auto custom-scrollbar mb-3">`;

const newView = `{trend.podcastScript && (
                  <div className="bg-indigo-950/40 border-2 border-indigo-500/30 rounded-[1.5rem] p-6 shadow-inner max-h-[300px] overflow-y-auto custom-scrollbar mb-3">
                    <div className={\`flex items-center justify-between mb-3 text-\${persona.color} font-black text-[10px] uppercase tracking-widest sticky top-0 bg-slate-900/80 backdrop-blur-sm py-1 z-10\`}>
                      <div className="flex items-center gap-2"><Mic2 size={14} /> Guion de Podcast</div>
                      <div className="flex items-center gap-2">
                        <DownloadButton text={trend.podcastScript} filename={\`Podcast_\${trend.title.replace(/\\s+/g, '_')}.txt\`} />
                        <CopyButton text={trend.podcastScript} />
                      </div>
                    </div>
                    <div className="markdown-body italic text-slate-300 text-xs font-bold leading-relaxed whitespace-pre-wrap">
                      <Markdown remarkPlugins={[remarkGfm]}>{trend.podcastScript}</Markdown>
                    </div>
                  </div>
                )}
                ` + targetView;

if (code.includes(targetView)) {
  code = code.replace(targetView, newView);
  console.log("TrendCard view updated.");
} else {
  console.log("TrendCard view not found.");
}

// 4. TrendCard usage
const targetUsage = `<TrendCard key={t.id} trend={t} onRewrite={handleRewrite} onSelect={handleSelectTrend} onGenerateVideoPrompts={handleGenerateVideoPrompts} onGenerateImagePrompts={handleGenerateImagePrompts} onGenerateScript={handleGenerateScript} isRewriting={rewritingId === t.id} isGeneratingVideoPrompts={generatingVideoPromptsId === t.id} isGeneratingImagePrompts={generatingImagePromptsId === t.id} isGeneratingScript={generatingScriptId === t.id} language={language} persona={activePersona} />`;
const newUsage = `<TrendCard key={t.id} trend={t} onRewrite={handleRewrite} onSelect={handleSelectTrend} onGenerateVideoPrompts={handleGenerateVideoPrompts} onGenerateImagePrompts={handleGenerateImagePrompts} onGenerateScript={handleGenerateScript} onGeneratePodcast={handleGeneratePodcast} isRewriting={rewritingId === t.id} isGeneratingVideoPrompts={generatingVideoPromptsId === t.id} isGeneratingImagePrompts={generatingImagePromptsId === t.id} isGeneratingScript={generatingScriptId === t.id} isGeneratingPodcast={generatingPodcastId === t.id} language={language} persona={activePersona} />`;

if (code.includes(targetUsage)) {
  code = code.replace(targetUsage, newUsage);
  console.log("TrendCard usage updated.");
} else {
  console.log("TrendCard usage not found.");
}

fs.writeFileSync('App.tsx', code);
