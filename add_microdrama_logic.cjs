const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

// 1. Add to isMovieCategory
code = code.replace(
  /\['movie_scripts', 'movie_drama', 'movie_action', 'movie_scifi', 'movie_history', 'movie_horror', 'movie_romance'\]/g,
  "['movie_scripts', 'movie_drama', 'movie_action', 'movie_scifi', 'movie_history', 'movie_horror', 'movie_romance', 'asian_microdrama']"
);

// 2. Add prompt logic
const newLogic = `    } else if (category === 'asian_microdrama') {
      categoryPrompt = \`Genera \${storyCount} guiones de microdramas estilo asiático. 
CRÍTICO - REGLAS DE ESTRUCTURA Y RETENCIÓN:
1. Bloque 1 (Gancho): Ep 1 plantea el conflicto central (infidelidad, humillación) in media res (en mitad de la acción). Ep 2-5 intensifican la humillación. Ep 6-10 dan pistas del poder del protagonista. Termina en cliffhanger (paywall).
2. Bloque 2 (Ciclo): Bucle de injusticia corta y venganza rápida. El secreto se mantiene por interrupciones absurdas.
3. Bloque 3 (Clímax): Revelación total, caída dramática del villano y cierre catártico.
4. Diseño de personajes extremo (arquetipos visuales instantáneos), sin sutilezas.
5. Usa el efecto de 'Indignación Provocada' en los primeros segundos de cada episodio.
6. Cada episodio debe terminar con un 'Cliffhanger' de micro-episodio.
El formato DEBE SER ESTRICTAMENTE UN GUION DE CINE ESTRUCTURADO (Encabezados de Escena, Acción, Personajes, Diálogos). La dirección del guion DEBE reflejar el estilo particular y punto de vista de \${activePersona.name}.\`;
`;
const insertionTarget = "    } else if (['movie_scripts', 'movie_drama', 'movie_action', 'movie_scifi', 'movie_history', 'movie_horror', 'movie_romance'].includes(category)) {";

code = code.replace(insertionTarget, newLogic + insertionTarget);

fs.writeFileSync('App.tsx', code);
console.log("Microdrama logic added");
