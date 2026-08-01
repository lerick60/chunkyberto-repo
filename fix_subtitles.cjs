const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

// Fix subtitle regex
code = code.replace(
  "const text = frame.narrationText.replace(/^\\(Voz.*?\\):\\s*/i, '').trim();", 
  "const text = frame.narrationText.trim().replace(/^\\(Voz.*?\\):\\s*/i, '').trim();"
);

// Fix TTS regex
code = code.replace(
  "const cleanText = text.replace(/^\\(Voz.*?\\):\\s*/i, '').trim();", 
  "const cleanText = text.trim().replace(/^\\(Voz.*?\\):\\s*/i, '').trim();"
);

// Fix subtitle pagination logic
const oldSubtitleLogic = `                    for (const page of pages) {
                       // Cada página se muestra mientras las palabras visibles estén en su rango
                       if (visibleWordsCount >= page.totalWordsBefore && 
                           visibleWordsCount < page.totalWordsBefore + page.totalWordsInPage) {
                           activePage = page;
                           break;
                       }
                    }`;

const newSubtitleLogic = `                    for (let pIdx = 0; pIdx < pages.length; pIdx++) {
                       const page = pages[pIdx];
                       if (pIdx === pages.length - 1) {
                           if (visibleWordsCount >= page.totalWordsBefore) {
                               activePage = page;
                               break;
                           }
                       } else {
                           if (visibleWordsCount >= page.totalWordsBefore && 
                               visibleWordsCount <= page.totalWordsBefore + page.totalWordsInPage) {
                               activePage = page;
                               break;
                           }
                       }
                    }`;

code = code.replace(oldSubtitleLogic, newSubtitleLogic);

fs.writeFileSync('App.tsx', code);
