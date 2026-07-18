const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

// handleGeneratePodcast
code = code.replace("const handleGeneratePodcast = async (trend: Trend) => {", "const handleGeneratePodcast = async (trend: Trend, duration: number = 10) => {");
let oldPodcastRule = "5. La longitud del podcast debe ser ${lengthText}.";
let newPodcastRule = "5. La longitud del podcast debe ser ${lengthText}.\n6. CRÍTICO: La longitud de cada intervención o diálogo dicho por cualquier personaje NO DEBE exceder las ${Math.floor(duration * 2.5)} palabras, para que encaje exactamente en una ventana de tiempo de ${duration} segundos en el video.";
code = code.replace(oldPodcastRule, newPodcastRule);

// handleGenerateScript
code = code.replace("const handleGenerateScript = async (trend: Trend) => {", "const handleGenerateScript = async (trend: Trend, duration: number = 10) => {");
let oldScriptRule = "6. The script direction MUST strictly reflect the style, personality, and point of view of the currently selected persona: ${activePersona.name} (${activePersona.role}).";
let newScriptRule = "6. The script direction MUST strictly reflect the style, personality, and point of view of the currently selected persona: ${activePersona.name} (${activePersona.role}).\n7. CRITICAL: The length of the dialogue spoken by any character in a single continuous block MUST NOT exceed ${Math.floor(duration * 2.5)} words, so it fits exactly within a ${duration}-second scene window.";
code = code.replace(oldScriptRule, newScriptRule);

// handleGenerateVideoPrompts
code = code.replace("const handleGenerateVideoPrompts = async (trend: Trend) => {", "const handleGenerateVideoPrompts = async (trend: Trend, duration: number = 10) => {");
let oldVoice1 = `Immediately following the visual description on the next line (WITHOUT a blank line in between), include a descriptive text of a maximum of 22 words as an expression of the narrator. This narrator expression MUST start exactly with the prefix "\${voiceLabel} " (this prefix MUST always be in Spanish, regardless of the selected language).`;
let newVoice1 = `Immediately following the visual description on the next line (WITHOUT a blank line in between), include a descriptive text of a maximum of \${Math.floor(duration * 2.5)} words as an expression of the narrator to fit in a \${duration}-second video. This narrator expression MUST start exactly with the prefix "\${voiceLabel} " (this prefix MUST always be in Spanish, regardless of the selected language).`;
code = code.replace(oldVoice1, newVoice1);

let oldVoice2 = `Immediately following the visual description on the next line (WITHOUT a blank line in between), include a descriptive text of a maximum of 22 words summarizing the idea of these remaining sentences, to be narrated in the video. This narrator expression MUST start exactly with the prefix "\${voiceLabel} " (this prefix MUST always be in Spanish, regardless of the selected language).`;
let newVoice2 = `Immediately following the visual description on the next line (WITHOUT a blank line in between), include a descriptive text of a maximum of \${Math.floor(duration * 2.5)} words summarizing the idea of these remaining sentences, to be narrated in the video to fit in a \${duration}-second window. This narrator expression MUST start exactly with the prefix "\${voiceLabel} " (this prefix MUST always be in Spanish, regardless of the selected language).`;
code = code.replace(oldVoice2, newVoice2);

// handleGenerateImagePrompts
code = code.replace("const handleGenerateImagePrompts = async (trend: Trend) => {", "const handleGenerateImagePrompts = async (trend: Trend, duration: number = 10) => {");
code = code.replace(oldVoice1, newVoice1);
code = code.replace(oldVoice2, newVoice2);

fs.writeFileSync('App.tsx', code);
console.log("Handlers updated.");
