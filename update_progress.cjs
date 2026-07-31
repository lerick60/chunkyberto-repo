const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const stateTarget = "const [producingImages, setProducingImages] = useState(false);";
const stateReplacement = "const [producingImages, setProducingImages] = useState(false);\n  const [storyboardProgress, setStoryboardProgress] = useState(0);";
code = code.replace(stateTarget, stateReplacement);

const loopTarget = "setSelectedTrend(prev => (prev ? { ...prev, storyboard: [...frames] } : null));";
const loopReplacement = "setSelectedTrend(prev => (prev ? { ...prev, storyboard: [...frames] } : null));\n      setStoryboardProgress(0);";
code = code.replace(loopTarget, loopReplacement);

const loopEndTarget = "setSelectedTrend(prev => (prev ? { ...prev, storyboard: updatedFrames } : null));\n        await new Promise(r => setTimeout(r, 4000)); // Increased to 4s to avoid rate limits";
const loopEndReplacement = "setSelectedTrend(prev => (prev ? { ...prev, storyboard: updatedFrames } : null));\n        setStoryboardProgress(Math.round(((i + 1) / frames.length) * 100));\n        await new Promise(r => setTimeout(r, 4000)); // Increased to 4s to avoid rate limits";
code = code.replace(loopEndTarget, loopEndReplacement);

const buttonTarget = "{producingImages ? 'PROCESANDO...' : 'SINTETIZAR TODO'}";
const buttonReplacement = "{producingImages ? `PROCESANDO... ${storyboardProgress}%` : 'SINTETIZAR TODO'}";
code = code.replace(buttonTarget, buttonReplacement);

fs.writeFileSync('App.tsx', code);
