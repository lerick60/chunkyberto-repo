const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

// 1. Trend interface
const targetTrend = "  movieScript?: string;";
const newTrend = "  movieScript?: string;\n  podcastScript?: string;";
code = code.replace(targetTrend, newTrend);

// 2. State
const targetState = "  const [generatingScriptId, setGeneratingScriptId] = useState<string | null>(null);";
const newState = targetState + "\n  const [generatingPodcastId, setGeneratingPodcastId] = useState<string | null>(null);";
code = code.replace(targetState, newState);

fs.writeFileSync('App.tsx', code);
console.log("State updated.");
