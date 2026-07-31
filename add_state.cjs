const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const stateTarget = "const [generatingThumbnail, setGeneratingThumbnail] = useState(false);";
const stateReplacement = "const [generatingThumbnail, setGeneratingThumbnail] = useState(false);\n  const [isGeneratingVoiceOver, setIsGeneratingVoiceOver] = useState(false);";

code = code.replace(stateTarget, stateReplacement);

const handlerTarget = "const handlePlayTTS = async (text: string, playOutLoud: boolean = true): Promise<{ buffer: AudioBuffer, blob: Blob } | null> => {";
const handlerReplacement = `
  const handleDownloadMasterVoiceOver = async () => {
    if (!selectedTrend) return;
    const text = selectedTrend.chunkybertoVersion || selectedTrend.originalSummary;
    if (!text) return;
    
    setIsGeneratingVoiceOver(true);
    try {
        const res = await handlePlayTTS(text, false);
        if (res) {
            const arrayBuffer = await res.blob.arrayBuffer();
            const rawData = new Uint8Array(arrayBuffer);
            const wavBlob = pcmToWav(rawData, 24000, 1);
            const url = URL.createObjectURL(wavBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = \`\${selectedTrend.title.substring(0,20).replace(/[^a-z0-9]/gi, '_')}_VozEnOff.wav\`;
            a.click();
            URL.revokeObjectURL(url);
        }
    } catch(err: any) {
        setAppError(getErrorDetails(err));
    } finally {
        setIsGeneratingVoiceOver(false);
    }
  };

  const handlePlayTTS = async (text: string, playOutLoud: boolean = true): Promise<{ buffer: AudioBuffer, blob: Blob } | null> => {`;

code = code.replace(handlerTarget, handlerReplacement);

fs.writeFileSync('App.tsx', code);
