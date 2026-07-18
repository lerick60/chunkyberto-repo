const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const oldVideo = "filename={`Prompts_${trend.title.replace(/\\s+/g, '_')}.txt`}";
const newVideo = "filename={`Prompts_${trend.title.replace(/\\s+/g, '_')}_${trend.videoPromptsDuration || 10}S.txt`}";

const oldImage = "filename={`ImagePrompts_${trend.title.replace(/\\s+/g, '_')}.txt`}";
const newImage = "filename={`ImagePrompts_${trend.title.replace(/\\s+/g, '_')}_${trend.imagePromptsDuration || 10}S.txt`}";

code = code.replace(oldVideo, newVideo);
code = code.replace(oldImage, newImage);

fs.writeFileSync('App.tsx', code);
console.log('Filenames fixed.');
