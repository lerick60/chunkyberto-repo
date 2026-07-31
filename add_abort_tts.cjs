const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const stateTarget = "const [isGeneratingVoiceOver, setIsGeneratingVoiceOver] = useState(false);";
const stateReplacement = "const [isGeneratingVoiceOver, setIsGeneratingVoiceOver] = useState(false);\n  const abortTTS = useRef(false);";
code = code.replace(stateTarget, stateReplacement);

const handlerTarget = "setIsGeneratingVoiceOver(true);\n    try {";
const handlerReplacement = "setIsGeneratingVoiceOver(true);\n    abortTTS.current = false;\n    try {";
code = code.replace(handlerTarget, handlerReplacement);

const resultTarget = "if (res) {";
const resultReplacement = "if (abortTTS.current) {\n            console.log('Voice over generation cancelled by user.');\n            return;\n        }\n        if (res) {";
code = code.replace(resultTarget, resultReplacement);

const catchTarget = "} catch(err: any) {\n        setAppError(getErrorDetails(err));";
const catchReplacement = "} catch(err: any) {\n        if (!abortTTS.current) setAppError(getErrorDetails(err));";
code = code.replace(catchTarget, catchReplacement);

fs.writeFileSync('App.tsx', code);
