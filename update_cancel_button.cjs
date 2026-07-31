const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const buttonTarget = `<button onClick={handleDownloadMasterVoiceOver} disabled={isGeneratingVoiceOver} className={\`flex-1 py-6 rounded-[2rem] \${isGeneratingVoiceOver ? 'bg-indigo-900/50 text-indigo-400' : 'bg-indigo-600 text-white'} border-2 border-indigo-500/30 hover:border-indigo-500/50 font-black text-sm uppercase flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl disabled:opacity-50\`}>
                          {isGeneratingVoiceOver ? <Loader2 size={24} className="animate-spin" /> : <Download size={24} />}
                          {isGeneratingVoiceOver ? 'GENERANDO...' : 'DESCARGAR VOZ'}
                        </button>`;

const newButton = `<button onClick={() => {
                          if (isGeneratingVoiceOver) {
                            abortTTS.current = true;
                            setIsGeneratingVoiceOver(false);
                          } else {
                            handleDownloadMasterVoiceOver();
                          }
                        }} className={\`flex-1 py-6 rounded-[2rem] \${isGeneratingVoiceOver ? 'bg-red-900/50 text-red-400 border-red-500/30 hover:bg-red-900/80' : 'bg-indigo-600 text-white border-indigo-500/30 hover:border-indigo-500/50'} border-2 font-black text-sm uppercase flex items-center justify-center gap-3 transition-all active:scale-95 shadow-2xl\`}>
                          {isGeneratingVoiceOver ? <XCircle size={24} /> : <Download size={24} />}
                          {isGeneratingVoiceOver ? 'CANCELAR' : 'DESCARGAR VOZ'}
                        </button>`;

code = code.replace(buttonTarget, newButton);
fs.writeFileSync('App.tsx', code);
