const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const storyboardTarget = "      const promptText = `Analyze the following narrative paragraph by paragraph: \\\"${selectedTrend.chunkybertoVersion}\\\". \\nFor EACH paragraph, generate between 1 and 4 cinematic scenes, depending on the number of complete ideas in that paragraph.";
const storyboardReplacement = `      const isMovieCategory = ['movie_scripts', 'movie_drama', 'movie_action', 'movie_scifi', 'movie_history', 'movie_horror'].includes(category);
      const generationInstruction = isMovieCategory
        ? \`Analyze the following movie script SCENE by SCENE: "\${selectedTrend.chunkybertoVersion}". \\nFor EACH SCENE, generate 1 cinematic scene.\`
        : \`Analyze the following narrative paragraph by paragraph: "\${selectedTrend.chunkybertoVersion}". \\nFor EACH paragraph, generate between 1 and 4 cinematic scenes, depending on the number of complete ideas in that paragraph.\`;

      const promptText = \`\${generationInstruction}`;

code = code.replace(storyboardTarget, storyboardReplacement);
fs.writeFileSync('App.tsx', code);
