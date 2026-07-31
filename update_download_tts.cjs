const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const target = `const handleDownloadMasterVoiceOver = async () => {
    if (!selectedTrend) return;
    const text = selectedTrend.chunkybertoVersion || selectedTrend.originalSummary;
    if (!text) return;
    
    setIsGeneratingVoiceOver(true);
    abortTTS.current = false;
    try {
        const res = await handlePlayTTS(text, false);
        if (abortTTS.current) {
            console.log('Voice over generation cancelled by user.');
            return;
        }
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
        if (!abortTTS.current) setAppError(getErrorDetails(err));
    } finally {
        setIsGeneratingVoiceOver(false);
    }
  };`;

const replacement = `const handleDownloadMasterVoiceOver = async () => {
    if (!selectedTrend) return;
    const text = selectedTrend.chunkybertoVersion || selectedTrend.originalSummary;
    if (!text) return;
    
    setIsGeneratingVoiceOver(true);
    setVoiceOverProgress(0);
    abortTTS.current = false;
    try {
        const paragraphs = text.split('\\n').filter(p => p.trim().length > 0);
        const pcmChunks: Uint8Array[] = [];
        
        for (let i = 0; i < paragraphs.length; i++) {
            if (abortTTS.current) {
                console.log('Voice over generation cancelled by user.');
                return;
            }
            
            setVoiceOverProgress(Math.round((i / paragraphs.length) * 100));
            const res = await handlePlayTTS(paragraphs[i], false);
            
            if (res) {
                const arrayBuffer = await res.blob.arrayBuffer();
                pcmChunks.push(new Uint8Array(arrayBuffer));
            }
            
            // Wait slightly between requests
            await new Promise(r => setTimeout(r, 500));
        }
        
        if (abortTTS.current) return;
        
        setVoiceOverProgress(100);
        
        // Combine all chunks
        const totalLength = pcmChunks.reduce((acc, chunk) => acc + chunk.length, 0);
        const combinedRawData = new Uint8Array(totalLength);
        let offset = 0;
        for (const chunk of pcmChunks) {
            combinedRawData.set(chunk, offset);
            offset += chunk.length;
        }
        
        const wavBlob = pcmToWav(combinedRawData, 24000, 1);
        const url = URL.createObjectURL(wavBlob);
        const a = document.createElement('a');
        a.href = url;
        a.download = \`\${selectedTrend.title.substring(0,20).replace(/[^a-z0-9]/gi, '_')}_VozEnOff.wav\`;
        a.click();
        URL.revokeObjectURL(url);
    } catch(err: any) {
        if (!abortTTS.current) setAppError(getErrorDetails(err));
    } finally {
        setIsGeneratingVoiceOver(false);
        setVoiceOverProgress(0);
    }
  };`;

code = code.replace(target, replacement);
fs.writeFileSync('App.tsx', code);
