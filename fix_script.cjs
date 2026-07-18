const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const targetState = "  const [generatingImagePromptsId, setGeneratingImagePromptsId] = useState<string | null>(null);";
const newState = targetState + "\n  const [generatingScriptId, setGeneratingScriptId] = useState<string | null>(null);";
code = code.replace(targetState, newState);

const targetTrend = "  imagePrompts?: string;";
const newTrend = targetTrend + "\n  movieScript?: string;";
code = code.replace(targetTrend, newTrend);

const targetFn = "  const handleGenerateVideoPrompts = async (trend: Trend) => {";
const newFn = `  const handleGenerateScript = async (trend: Trend) => {
    setGeneratingScriptId(trend.id); setAppError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: getSafeApiKey() });
      const languageText = getLanguageName(language);
      
      const scriptRules = \`
1. The script MUST be written in \${languageText}.
2. Convert the narrative into a structured cinematic movie script.
3. Follow standard screenplay formatting (Scene Headings, Action Lines, Character Names, Parentheticals, Dialogue).
4. The hook at the beginning MUST be the absolute best possible to grab the audience's attention immediately.
5. Make sure to include all the details, emotions, and events described in the narrative, adapted into a script format.
6. The script direction MUST strictly reflect the style, personality, and point of view of the currently selected persona: \${activePersona.name} (\${activePersona.role}).
\`;

      const promptText = \`Please convert the following narrative into a structured cinematic movie script based on the rules below.

Rules:
\${scriptRules}

Narrative to convert:
\${trend.chunkybertoVersion}
\`;

      const response = await apiRetry(() => ai.models.generateContent({
        model: modelSettings.text,
        contents: promptText,
        config: { systemInstruction: \`You are an expert movie script writer. Convert narratives into highly detailed cinematic scripts.\` }
      })) as any;
      
      const finalContent = response.text || "";
      const updatedTrends = trends.map(t => (t.id === trend.id ? { ...t, movieScript: finalContent } : t));
      setTrends(updatedTrends);
      if (selectedTrend && selectedTrend.id === trend.id) {
        setSelectedTrend({ ...selectedTrend, movieScript: finalContent });
      }
    } catch (err: any) { setAppError(getErrorDetails(err)); } finally { setGeneratingScriptId(null); }
  };

` + targetFn;

code = code.replace(targetFn, newFn);
fs.writeFileSync('App.tsx', code);
console.log("State, Trend, and handleGenerateScript added.");
