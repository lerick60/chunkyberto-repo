const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

// For handleGenerateVideoPrompts
code = code.replace(/const promptText = \`Based on the following narrative, generate video prompts to visually explain the ideas contained in it\. Process the narrative paragraph by paragraph\.\$\{characterContext\}[\s\S]*?\$\{modelSettings\.erickReferenceImage \? '\[^']*' : ''\}\`;/g, 
`      const isMovieCategory = ['movie_scripts', 'movie_drama', 'movie_action', 'movie_scifi', 'movie_history', 'movie_horror'].includes(category);
      const generationInstruction = isMovieCategory ? \`Process the movie script SCENE by SCENE.\` : \`Process the narrative paragraph by paragraph.\`;
      let rulesText = \`Rules for EACH paragraph:
1. Split the paragraph into two sections: Section 1 (the first 2 sentences) and Section 2 (the remaining sentences).
2. For Section 1, generate a highly descriptive video prompt (visuals, lighting, camera angles, action). \${narratorInstruction1}
3. For Section 2, generate another highly descriptive video prompt for the remaining sentences. \${narratorInstruction2}
4. \${narratorBlankLineRule}
5. Target language for the prompts: Spanish (Español).
6. Do not include any conversational filler, just the prompts.
7. \${labelRule}
8. CRITICAL: All generated prompts (both video and image prompts) and narrator expressions MUST be strictly in Spanish ONLY.
9. CRITICAL: The narrator expressions must be written to be spoken by a \${voiceDesc} voice.
10. CRITICAL: Identify any secondary characters. Establish a consistent, highly detailed visual description for each secondary character. You MUST use this exact same detailed visual description for that character across ALL frames they appear in. \${modelSettings.erickReferenceImage ? '\\n11. CRITICAL: A reference image of Erick is provided. If the narrative mentions Erick, use the visual details from the provided image to describe him accurately in the video prompts.' : ''}\`;

      if (isMovieCategory) {
        rulesText = \`Rules for EACH SCENE:
1. For each scene in the script, generate ONE highly descriptive video prompt describing the visual action, camera angle, and lighting.
2. \${narratorInstruction1.replace('the first 2 sentences', 'the scene')}
3. \${narratorBlankLineRule}
4. Target language for the prompts: Spanish (Español).
5. Do not include any conversational filler, just the prompts.
6. \${labelRule}
7. CRITICAL: All generated prompts (both video and image prompts) and narrator expressions MUST be strictly in Spanish ONLY.
8. CRITICAL: The narrator expressions must be written to be spoken by a \${voiceDesc} voice.
9. CRITICAL: Identify any secondary characters. Establish a consistent, highly detailed visual description for each secondary character. You MUST use this exact same detailed visual description for that character across ALL frames they appear in. \${modelSettings.erickReferenceImage ? '\\n10. CRITICAL: A reference image of Erick is provided. If the narrative mentions Erick, use the visual details from the provided image to describe him accurately.' : ''}\`;
      }

      const promptText = \`Based on the following narrative, generate video prompts to visually explain the ideas contained in it. \${generationInstruction}\${characterContext}
\${CHARACTER_CONSISTENCY_RULE}
\${LOCATION_CONSISTENCY_RULE}
CRITICAL STYLE RULE: All generated video prompts MUST explicitly include the instruction to use the "\${visualStyle}" visual style.
        
Narrative:
\${trend.chunkybertoVersion}

\${rulesText}\`;`);

// For handleGenerateImagePrompts
code = code.replace(/const promptText = \`Based on the following narrative, generate image prompts to visually explain the ideas contained in it\. Process the narrative paragraph by paragraph\.\$\{characterContext\}[\s\S]*?\$\{modelSettings\.erickReferenceImage \? '\[^']*' : ''\}\`;/g, 
`      const isMovieCategory = ['movie_scripts', 'movie_drama', 'movie_action', 'movie_scifi', 'movie_history', 'movie_horror'].includes(category);
      const generationInstruction = isMovieCategory ? \`Process the movie script SCENE by SCENE.\` : \`Process the narrative paragraph by paragraph.\`;
      let rulesText = \`Rules for EACH paragraph:
1. Split the paragraph into two sections: Section 1 (the first 2 sentences) and Section 2 (the remaining sentences).
2. For Section 1, generate a highly descriptive image prompt (visuals, lighting, camera angles, action). \${narratorInstruction1}
3. For Section 2, generate another highly descriptive image prompt for the remaining sentences. \${narratorInstruction2}
4. \${narratorBlankLineRule}
5. Target language for the prompts: Spanish (Español).
6. Do not include any conversational filler, just the prompts.
7. \${labelRule}
8. CRITICAL: All generated prompts (both video and image prompts) and narrator expressions MUST be strictly in Spanish ONLY.
9. CRITICAL: The narrator expressions must be written to be spoken by a \${voiceDesc} voice.
10. CRITICAL: Identify any secondary characters. Establish a consistent, highly detailed visual description for each secondary character. You MUST use this exact same detailed visual description for that character across ALL frames they appear in. \${modelSettings.erickReferenceImage ? '\\n11. CRITICAL: A reference image of Erick is provided. If the narrative mentions Erick, use the visual details from the provided image to describe him accurately in the image prompts.' : ''}\`;

      if (isMovieCategory) {
        rulesText = \`Rules for EACH SCENE:
1. For each scene in the script, generate ONE highly descriptive image prompt describing the visual action, camera angle, and lighting.
2. \${narratorInstruction1.replace('the first 2 sentences', 'the scene')}
3. \${narratorBlankLineRule}
4. Target language for the prompts: Spanish (Español).
5. Do not include any conversational filler, just the prompts.
6. \${labelRule}
7. CRITICAL: All generated prompts (both video and image prompts) and narrator expressions MUST be strictly in Spanish ONLY.
8. CRITICAL: The narrator expressions must be written to be spoken by a \${voiceDesc} voice.
9. CRITICAL: Identify any secondary characters. Establish a consistent, highly detailed visual description for each secondary character. You MUST use this exact same detailed visual description for that character across ALL frames they appear in. \${modelSettings.erickReferenceImage ? '\\n10. CRITICAL: A reference image of Erick is provided. If the narrative mentions Erick, use the visual details from the provided image to describe him accurately.' : ''}\`;
      }

      const promptText = \`Based on the following narrative, generate image prompts to visually explain the ideas contained in it. \${generationInstruction}\${characterContext}
\${CHARACTER_CONSISTENCY_RULE}
\${LOCATION_CONSISTENCY_RULE}
CRITICAL STYLE RULE: All generated image prompts MUST explicitly include the instruction to use the "\${visualStyle}" visual style.
        
Narrative:
\${trend.chunkybertoVersion}

\${rulesText}\`;`);

fs.writeFileSync('App.tsx', code);
