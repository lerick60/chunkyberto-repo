const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const target = `<button onClick={handleSaveDraft} className={\`w-full py-6 rounded-[2rem] bg-indigo-600/20 text-indigo-400 border-2 border-indigo-500/30 hover:border-indigo-500/50 font-black text-sm uppercase flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl\`}>
                        <Archive size={24} /> GUARDAR BORRADOR
                      </button>`;

const replacement = `<button onClick={handleSaveDraft} className={\`w-full py-6 rounded-[2rem] bg-indigo-600/20 text-indigo-400 border-2 border-indigo-500/30 hover:border-indigo-500/50 font-black text-sm uppercase flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl\`}>
                        <Archive size={24} /> GUARDAR BORRADOR
                      </button>
                      
                      {isGeneratingVoiceOver && (
                        <div className="mt-8 p-6 rounded-[2rem] bg-slate-900/80 border-2 border-slate-700 shadow-xl">
                          <div className="flex items-center justify-between mb-4">
                            <span className="text-[10px] font-black text-indigo-400 uppercase tracking-widest flex items-center gap-2">
                              <Loader2 size={14} className="animate-spin" />
                              SINTETIZANDO VOZ...
                            </span>
                            <span className="text-[10px] font-black text-white">{voiceOverProgress}%</span>
                          </div>
                          <div className="w-full h-3 bg-slate-800 rounded-full overflow-hidden border border-slate-700 shadow-inner">
                            <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-300" style={{ width: \`\${voiceOverProgress}%\` }}></div>
                          </div>
                        </div>
                      )}`;

code = code.replace(target, replacement);
fs.writeFileSync('App.tsx', code);
