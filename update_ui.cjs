const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const targetUI = `<button onClick={() => handlePlayTTS(selectedTrend.chunkybertoVersion || selectedTrend.originalSummary)} className={\`w-full py-6 rounded-[2rem] bg-slate-900 text-\${activePersona.color} border-2 border-slate-800 hover:border-\${activePersona.color}/50 font-black text-sm uppercase flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl\`}>\n                        <Volume2 size={24} /> ESCUCHAR COMPLETO\n                      </button>\n                      <button onClick={handleSaveDraft} className={\`w-full py-6 mt-4 rounded-[2rem] bg-indigo-600/20 text-indigo-400 border-2 border-indigo-500/30 hover:border-indigo-500/50 font-black text-sm uppercase flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl\`}>\n                        <Archive size={24} /> GUARDAR BORRADOR\n                      </button>`;

const newUI = `<div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="relative">
                          <select value={modelSettings.voiceName} onChange={(e) => setModelSettings({...modelSettings, voiceName: e.target.value})} className="w-full pl-4 pr-10 py-4 bg-slate-900 border-2 border-slate-700 rounded-2xl font-black uppercase text-[10px] tracking-widest text-white appearance-none cursor-pointer focus:border-indigo-500 outline-none">
                            {AVAILABLE_VOICES.map(v => <option key={v.id} value={v.id}>{v.name.toUpperCase()} - {v.gender.toUpperCase()} ({v.accent.toUpperCase()})</option>)}
                          </select>
                          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500"><Mic2 size={16} /></div>
                        </div>
                        <div className="relative">
                          <select value={modelSettings.ttsStyle} onChange={(e) => setModelSettings({...modelSettings, ttsStyle: e.target.value as TtsStyle})} className="w-full pl-4 pr-10 py-4 bg-slate-900 border-2 border-slate-700 rounded-2xl font-black uppercase text-[10px] tracking-widest text-white appearance-none cursor-pointer focus:border-indigo-500 outline-none">
                            {NARRATION_STYLES.map(s => <option key={s.id} value={s.id}>{s.label.toUpperCase()}</option>)}
                          </select>
                          <div className="absolute inset-y-0 right-4 flex items-center pointer-events-none text-slate-500"><Radio size={16} /></div>
                        </div>
                      </div>
                      <div className="flex flex-col sm:flex-row gap-4 mb-4">
                        <button onClick={() => handlePlayTTS(selectedTrend.chunkybertoVersion || selectedTrend.originalSummary)} className={\`flex-1 py-6 rounded-[2rem] bg-slate-900 text-\${activePersona.color} border-2 border-slate-800 hover:border-\${activePersona.color}/50 font-black text-sm uppercase flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl\`}>
                          <Volume2 size={24} /> ESCUCHAR
                        </button>
                        <button onClick={handleDownloadMasterVoiceOver} disabled={isGeneratingVoiceOver} className={\`flex-1 py-6 rounded-[2rem] \${isGeneratingVoiceOver ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-600 text-white'} border-2 border-indigo-500/30 hover:border-indigo-500/50 font-black text-sm uppercase flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl disabled:opacity-50\`}>
                          {isGeneratingVoiceOver ? <Loader2 size={24} className="animate-spin" /> : <Download size={24} />}
                          {isGeneratingVoiceOver ? 'GENERANDO...' : 'DESCARGAR VOZ'}
                        </button>
                      </div>
                      <button onClick={handleSaveDraft} className={\`w-full py-6 rounded-[2rem] bg-indigo-600/20 text-indigo-400 border-2 border-indigo-500/30 hover:border-indigo-500/50 font-black text-sm uppercase flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl\`}>
                        <Archive size={24} /> GUARDAR BORRADOR
                      </button>`;

code = code.replace(targetUI, newUI);

// wait the original code is slightly different in new lines
