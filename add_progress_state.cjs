const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const target = "const [isGeneratingVoiceOver, setIsGeneratingVoiceOver] = useState(false);\n  const abortTTS = useRef(false);";
const replacement = "const [isGeneratingVoiceOver, setIsGeneratingVoiceOver] = useState(false);\n  const [voiceOverProgress, setVoiceOverProgress] = useState(0);\n  const abortTTS = useRef(false);";
code = code.replace(target, replacement);

fs.writeFileSync('App.tsx', code);
