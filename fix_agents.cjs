const fs = require('fs');
let code = fs.readFileSync('AGENTS.md', 'utf8');

// The movie category rules were:
// # Movie Generator Persona Rules
// 1. A special Persona called "Generador de Películas" (Movie Generator) is available.
// 2. It generates movie scripts in a structured script format for categories like 'movie_drama', 'movie_action', 'movie_scifi', 'movie_history', 'movie_horror', and 'movie_scripts'.
// 3. The stories MUST respect the narrative length button (short, medium, long).
// 4. The movies must strictly have between 1 and 6 characters maximum.
// 5. When generating Video Prompts or Image Prompts for these specific categories, the prompts MUST be generated SCENE by SCENE for the entire script, instead of paragraph by paragraph.

const oldRules = `2. It generates movie scripts in a structured script format for categories like 'movie_drama', 'movie_action', 'movie_scifi', 'movie_history', 'movie_horror', and 'movie_scripts'.`;
const newRules = `2. It generates movie narratives (not scripts by default) for categories like 'movie_drama', 'movie_action', 'movie_scifi', 'movie_history', 'movie_horror', and 'movie_scripts'.
3. A special "Generar Guion" (Generate Script) button allows any persona to convert any generated narrative into a structured cinematic movie script.
4. The generated cinematic script MUST maintain the rules: proper standard screenplay formatting, best possible narrative hook, and reflecting the persona's style.`;

code = code.replace(oldRules, newRules);

const oldRule9 = `9. Section Splitting: For standard categories, paragraphs must be split into three sections: Section 1 (the first 2 sentences), Section 2 (an idea related to or extending Section 1), and Section 3 (the last idea expressed by the paragraph). The movie category ("Generador de Películas") remains unchanged (processed SCENE by SCENE).`;
const newRule9 = `9. Section Splitting: For standard categories, paragraphs must be split into three sections: Section 1 (the first 2 sentences), Section 2 (an idea related to or extending Section 1), and Section 3 (the last idea expressed by the paragraph). For movie categories, the process remains SCENE by SCENE.`;

code = code.replace(oldRule9, newRule9);

fs.writeFileSync('AGENTS.md', code);
console.log("Updated AGENTS.md");
