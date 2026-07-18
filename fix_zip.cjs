const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const oldZip = `        if (selectedTrend.advance) rootFolder?.file("AVANCE_HISTORIA.txt", selectedTrend.advance);
        if (selectedTrend.thumbnailUrl) { rootFolder?.file("YOUTUBE_THUMBNAIL.png", selectedTrend.thumbnailUrl.split(',')[1], { base64: true }); }`;

const newZip = `        if (selectedTrend.advance) rootFolder?.file("AVANCE_HISTORIA.txt", selectedTrend.advance);
        if (selectedTrend.podcastScript) rootFolder?.file(\`Podcast_\${selectedTrend.podcastScriptDuration || 10}S.txt\`, selectedTrend.podcastScript);
        if (selectedTrend.movieScript) rootFolder?.file(\`Guion_\${selectedTrend.movieScriptDuration || 10}S.txt\`, selectedTrend.movieScript);
        if (selectedTrend.videoPrompts) rootFolder?.file(\`VideoPrompts_\${selectedTrend.videoPromptsDuration || 10}S.txt\`, selectedTrend.videoPrompts);
        if (selectedTrend.imagePrompts) rootFolder?.file(\`ImagePrompts_\${selectedTrend.imagePromptsDuration || 10}S.txt\`, selectedTrend.imagePrompts);
        if (selectedTrend.thumbnailUrl) { rootFolder?.file("YOUTUBE_THUMBNAIL.png", selectedTrend.thumbnailUrl.split(',')[1], { base64: true }); }`;

code = code.replace(oldZip, newZip);

fs.writeFileSync('App.tsx', code);
console.log('Zip fixed.');
