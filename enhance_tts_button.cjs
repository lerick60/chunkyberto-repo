const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const target = `<button onClick={() => {
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

const replacement = `<button onClick={() => {
                          if (isGeneratingVoiceOver) {
                            abortTTS.current = true;
                            setIsGeneratingVoiceOver(false);
                          } else {
                            handleDownloadMasterVoiceOver();
                          }
                        }} className={\`flex-1 py-6 rounded-[2rem] \${isGeneratingVoiceOver ? 'bg-red-900/50 text-red-400 border-red-500/30 hover:bg-red-900/80' : 'bg-indigo-600 text-white border-indigo-500/30 hover:border-indigo-500/50'} border-2 font-black text-sm uppercase flex flex-col items-center justify-center gap-2 transition-all active:scale-95 shadow-2xl\`}>
                          <div className="flex items-center gap-3">
                            {isGeneratingVoiceOver ? <XCircle size={24} /> : <Download size={24} />}
                            {isGeneratingVoiceOver ? 'CANCELAR' : 'DESCARGAR VOZ'}
                          </div>
                          {isGeneratingVoiceOver && (
                            <div className="w-3/4 max-w-[200px] h-1.5 bg-red-950/50 rounded-full overflow-hidden mt-1">
                              <div className="h-full bg-red-500 transition-all duration-300" style={{ width: \`\${voiceOverProgress}%\` }}></div>
                            </div>
                          )}
                        </button>`;

code = code.replace(target, replacement);
fs.writeFileSync('App.tsx', code);
