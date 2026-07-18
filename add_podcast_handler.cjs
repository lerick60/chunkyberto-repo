const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const targetFn = "  const handleGenerateScript = async (trend: Trend) => {";

const newFn = `  const handleGeneratePodcast = async (trend: Trend) => {
    setGeneratingPodcastId(trend.id); setAppError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: getSafeApiKey() });
      const languageText = getLanguageName(language);
      
      let lengthText = "longitud adecuada";
      if (narrativeLength === 'short') lengthText = "corta (ideal para un segmento rápido)";
      if (narrativeLength === 'medium') lengthText = "mediana (ideal para un episodio de podcast estándar)";
      if (narrativeLength === 'long') lengthText = "larga (ideal para un debate profundo)";

      const podcastRules = \`
1. El podcast DEBE ser escrito en \${languageText}.
2. Crea un guion de podcast donde \${activePersona.name} y los personajes de la historia tengan un divertido análisis y debate sobre los aspectos clave de la historia generada.
3. El formato debe ser un diálogo de podcast claro (ej. **\${activePersona.name}:** [diálogo]).
4. Sigue la personalidad de \${activePersona.name} (\${activePersona.role}).
5. La longitud del podcast debe ser \${lengthText}.
\`;

      const promptText = \`Por favor, genera un guion de podcast basado en la siguiente historia y en las reglas proporcionadas.

Reglas:
\${podcastRules}

Historia generada:
\${trend.chunkybertoVersion}
\`;

      const response = await apiRetry(() => ai.models.generateContent({
        model: modelSettings.text,
        contents: promptText,
        config: { systemInstruction: \`Eres un experto productor y guionista de podcasts interactivos.\` }
      })) as any;
      
      const finalContent = response.text || "";
      const updatedTrends = trends.map(t => (t.id === trend.id ? { ...t, podcastScript: finalContent } : t));
      setTrends(updatedTrends);
      if (selectedTrend && selectedTrend.id === trend.id) {
        setSelectedTrend({ ...selectedTrend, podcastScript: finalContent });
      }
    } catch (err: any) { setAppError(getErrorDetails(err)); } finally { setGeneratingPodcastId(null); }
  };

` + targetFn;

code = code.replace(targetFn, newFn);
fs.writeFileSync('App.tsx', code);
console.log("Podcast handler added.");
