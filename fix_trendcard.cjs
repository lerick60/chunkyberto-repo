const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const targetProps1 = "export const TrendCard: React.FC<{ trend: Trend; onRewrite: (trend: Trend) => void; onSelect: (trend: Trend) => void; onGenerateVideoPrompts: (trend: Trend) => void; onGenerateImagePrompts: (trend: Trend) => void; isRewriting: boolean; isGeneratingVideoPrompts: boolean; isGeneratingImagePrompts: boolean; language: Language; persona: Persona; }> = ({ trend, onRewrite, onSelect, onGenerateVideoPrompts, onGenerateImagePrompts, isRewriting, isGeneratingVideoPrompts, isGeneratingImagePrompts, persona }) => {";
const newProps1 = "export const TrendCard: React.FC<{ trend: Trend; onRewrite: (trend: Trend) => void; onSelect: (trend: Trend) => void; onGenerateVideoPrompts: (trend: Trend) => void; onGenerateImagePrompts: (trend: Trend) => void; onGenerateScript: (trend: Trend) => void; isRewriting: boolean; isGeneratingVideoPrompts: boolean; isGeneratingImagePrompts: boolean; isGeneratingScript: boolean; language: Language; persona: Persona; }> = ({ trend, onRewrite, onSelect, onGenerateVideoPrompts, onGenerateImagePrompts, onGenerateScript, isRewriting, isGeneratingVideoPrompts, isGeneratingImagePrompts, isGeneratingScript, persona }) => {";
if (code.includes(targetProps1)) {
  code = code.replace(targetProps1, newProps1);
} else { console.log('props1 not found'); }

const targetRender = `                  <button 
                    type="button" 
                    onClick={(e) => { e.preventDefault(); onGenerateVideoPrompts(trend); }} `;

const newRender = `                  <button 
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
                    onClick={(e) => { e.preventDefault(); onGenerateVideoPrompts(trend); }} `;
if (code.includes(targetRender)) {
  code = code.replace(targetRender, newRender);
} else { console.log('render not found'); }

const targetRenderEnd = `                    {isGeneratingImagePrompts ? 'Generando...' : 'Image Prompts'}
                  </button>`;
const newRenderEnd = targetRenderEnd + "\n                  </div>";
if (code.includes(targetRenderEnd)) {
  code = code.replace(targetRenderEnd, newRenderEnd);
} else { console.log('renderEnd not found'); }


const targetUsage = `<TrendCard key={t.id} trend={t} onRewrite={handleRewrite} onSelect={handleSelectTrend} onGenerateVideoPrompts={handleGenerateVideoPrompts} onGenerateImagePrompts={handleGenerateImagePrompts} isRewriting={rewritingId === t.id} isGeneratingVideoPrompts={generatingVideoPromptsId === t.id} isGeneratingImagePrompts={generatingImagePromptsId === t.id} language={language} persona={activePersona} />`;
const newUsage = `<TrendCard key={t.id} trend={t} onRewrite={handleRewrite} onSelect={handleSelectTrend} onGenerateVideoPrompts={handleGenerateVideoPrompts} onGenerateImagePrompts={handleGenerateImagePrompts} onGenerateScript={handleGenerateScript} isRewriting={rewritingId === t.id} isGeneratingVideoPrompts={generatingVideoPromptsId === t.id} isGeneratingImagePrompts={generatingImagePromptsId === t.id} isGeneratingScript={generatingScriptId === t.id} language={language} persona={activePersona} />`;
if (code.includes(targetUsage)) {
  code = code.replace(targetUsage, newUsage);
} else { console.log('usage not found'); }

fs.writeFileSync('App.tsx', code);
console.log("TrendCard updated.");
