const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const target = "const handlePlayTTS = async (text: string, playOutLoud: boolean = true): Promise<{ buffer: AudioBuffer, blob: Blob } | null> => {\\n    if (!text || text.trim().length === 0) return null;";
const replacement = "const handlePlayTTS = async (text: string, playOutLoud: boolean = true): Promise<{ buffer: AudioBuffer, blob: Blob } | null> => {\\n    if (!text || text.trim().length === 0) return null;\\n    text = text.replace(/^\\\\(Voz.*?\\\\):\\\\s*/i, '').trim();";
code = code.replace(new RegExp(target.replace(/[-[\\]{}()*+?.,\\\\^$|#\\s]/g, '\\\\$&'), 'g'), replacement.replace(/\\\\n/g, '\\n').replace(/\\\\\\\\/g, '\\\\'));

// Wait, let's just do a simpler replace.
