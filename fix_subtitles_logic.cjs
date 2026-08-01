const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const target = `                    for (const page of pages) {
                       // Cada página se muestra mientras las palabras visibles estén en su rango
                       if (visibleWordsCount >= page.totalWordsBefore && 
                           visibleWordsCount < page.totalWordsBefore + page.totalWordsInPage) {
                           activePage = page;
                           break;
                       }
                    }`;

const targetRegex = /for \(const page of pages\) \{\s*\/\/ Cada página se muestra mientras las palabras visibles estén en su rango\s*if \(visibleWordsCount >= page\.totalWordsBefore &&\s*visibleWordsCount < page\.totalWordsBefore \+ page\.totalWordsInPage\) \{\s*activePage = page;\s*break;\s*\}\s*\}/;

const newSubtitleLogic = `for (let pIdx = 0; pIdx < pages.length; pIdx++) {
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

code = code.replace(targetRegex, newSubtitleLogic);

fs.writeFileSync('App.tsx', code);
