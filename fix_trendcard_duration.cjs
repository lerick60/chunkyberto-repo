const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const targetProps = "export const TrendCard: React.FC<{ trend: Trend; onRewrite: (trend: Trend) => void; onSelect: (trend: Trend) => void; onGenerateVideoPrompts: (trend: Trend) => void; onGenerateImagePrompts: (trend: Trend) => void; onGenerateScript: (trend: Trend) => void; onGeneratePodcast: (trend: Trend) => void; isRewriting: boolean; isGeneratingVideoPrompts: boolean; isGeneratingImagePrompts: boolean; isGeneratingScript: boolean; isGeneratingPodcast: boolean; language: Language; persona: Persona; }> = ({ trend, onRewrite, onSelect, onGenerateVideoPrompts, onGenerateImagePrompts, onGenerateScript, onGeneratePodcast, isRewriting, isGeneratingVideoPrompts, isGeneratingImagePrompts, isGeneratingScript, isGeneratingPodcast, persona }) => {";

const newProps = "export const TrendCard: React.FC<{ trend: Trend; onRewrite: (trend: Trend) => void; onSelect: (trend: Trend) => void; onGenerateVideoPrompts: (trend: Trend, duration: number) => void; onGenerateImagePrompts: (trend: Trend, duration: number) => void; onGenerateScript: (trend: Trend, duration: number) => void; onGeneratePodcast: (trend: Trend, duration: number) => void; isRewriting: boolean; isGeneratingVideoPrompts: boolean; isGeneratingImagePrompts: boolean; isGeneratingScript: boolean; isGeneratingPodcast: boolean; language: Language; persona: Persona; }> = ({ trend, onRewrite, onSelect, onGenerateVideoPrompts, onGenerateImagePrompts, onGenerateScript, onGeneratePodcast, isRewriting, isGeneratingVideoPrompts, isGeneratingImagePrompts, isGeneratingScript, isGeneratingPodcast, persona }) => {\n  const [duration, setDuration] = useState<number>(10);";

if (code.includes(targetProps)) {
  code = code.replace(targetProps, newProps);
  console.log("TrendCard props updated.");
} else {
  console.log("TrendCard props not found.");
}

const targetButtons = `<button 
                  type="button" 
                  onClick={(e) => { e.preventDefault(); onGeneratePodcast(trend); }} `;

const newButtons = `                <div className="mb-4">
                  <span className="text-[9px] font-black uppercase text-slate-500 tracking-widest block mb-2">Longitud de Diálogo / Narrador</span>
                  <div className="flex gap-2 bg-slate-900 p-1.5 rounded-xl border border-slate-700">
                    {[5, 8, 10, 15].map(d => (
                      <button
                        key={d}
                        type="button"
                        onClick={(e) => { e.preventDefault(); setDuration(d); }}
                        className={\`flex-1 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest transition-all \${duration === d ? 'bg-' + persona.color + ' text-slate-950 shadow-md' : 'text-slate-400 hover:bg-slate-800'}\`}
                      >
                        {d}s
                      </button>
                    ))}
                  </div>
                </div>
                <button 
                  type="button" 
                  onClick={(e) => { e.preventDefault(); onGeneratePodcast(trend, duration); }} `;

if (code.includes(targetButtons)) {
  code = code.replace(targetButtons, newButtons);
  console.log("TrendCard UI updated.");
} else {
  console.log("TrendCard UI not found.");
}

code = code.replace("onGenerateScript(trend);", "onGenerateScript(trend, duration);");
code = code.replace("onGenerateVideoPrompts(trend);", "onGenerateVideoPrompts(trend, duration);");
code = code.replace("onGenerateImagePrompts(trend);", "onGenerateImagePrompts(trend, duration);");

fs.writeFileSync('App.tsx', code);
