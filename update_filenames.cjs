const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

// 1. Add durations to Trend
const targetTrend = "  podcastScript?: string;";
const newTrend = "  podcastScript?: string;\n  videoPromptsDuration?: number;\n  imagePromptsDuration?: number;\n  movieScriptDuration?: number;\n  podcastScriptDuration?: number;";
if (code.includes(targetTrend) && !code.includes('videoPromptsDuration?: number')) {
  code = code.replace(targetTrend, newTrend);
}

// 2. Update setTrends in handlers
// Podcast
code = code.replace("const updatedTrends = trends.map(t => (t.id === trend.id ? { ...t, podcastScript: finalContent } : t));", "const updatedTrends = trends.map(t => (t.id === trend.id ? { ...t, podcastScript: finalContent, podcastScriptDuration: duration } : t));");
code = code.replace("setSelectedTrend({ ...selectedTrend, podcastScript: finalContent });", "setSelectedTrend({ ...selectedTrend, podcastScript: finalContent, podcastScriptDuration: duration });");

// Script
code = code.replace("const updatedTrends = trends.map(t => (t.id === trend.id ? { ...t, movieScript: finalContent } : t));", "const updatedTrends = trends.map(t => (t.id === trend.id ? { ...t, movieScript: finalContent, movieScriptDuration: duration } : t));");
code = code.replace("setSelectedTrend({ ...selectedTrend, movieScript: finalContent });", "setSelectedTrend({ ...selectedTrend, movieScript: finalContent, movieScriptDuration: duration });");

// Video Prompts
code = code.replace("const updatedTrends = trends.map(t => (t.id === trend.id ? { ...t, videoPrompts: finalContent } : t));", "const updatedTrends = trends.map(t => (t.id === trend.id ? { ...t, videoPrompts: finalContent, videoPromptsDuration: duration } : t));");
code = code.replace("setSelectedTrend({ ...selectedTrend, videoPrompts: finalContent });", "setSelectedTrend({ ...selectedTrend, videoPrompts: finalContent, videoPromptsDuration: duration });");

// Image Prompts
code = code.replace("const updatedTrends = trends.map(t => (t.id === trend.id ? { ...t, imagePrompts: finalContent } : t));", "const updatedTrends = trends.map(t => (t.id === trend.id ? { ...t, imagePrompts: finalContent, imagePromptsDuration: duration } : t));");
code = code.replace("setSelectedTrend({ ...selectedTrend, imagePrompts: finalContent });", "setSelectedTrend({ ...selectedTrend, imagePrompts: finalContent, imagePromptsDuration: duration });");


// 3. Update filenames in TrendCard
code = code.replace(
  "filename={`Podcast_${trend.title.replace(/\\s+/g, '_')}.txt`}",
  "filename={`Podcast_${trend.title.replace(/\\s+/g, '_')}_${trend.podcastScriptDuration || 10}S.txt`}"
);

code = code.replace(
  "filename={`Guion_${trend.title.replace(/\\s+/g, '_')}.txt`}",
  "filename={`Guion_${trend.title.replace(/\\s+/g, '_')}_${trend.movieScriptDuration || 10}S.txt`}"
);

code = code.replace(
  "filename={`Video_Prompts_${trend.title.replace(/\\s+/g, '_')}.txt`}",
  "filename={`Video_Prompts_${trend.title.replace(/\\s+/g, '_')}_${trend.videoPromptsDuration || 10}S.txt`}"
);

code = code.replace(
  "filename={`Image_Prompts_${trend.title.replace(/\\s+/g, '_')}.txt`}",
  "filename={`Image_Prompts_${trend.title.replace(/\\s+/g, '_')}_${trend.imagePromptsDuration || 10}S.txt`}"
);

fs.writeFileSync('App.tsx', code);
console.log("Updated filenames and durations.");
