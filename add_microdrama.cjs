const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

code = code.replace(
  "| 'movie_scifi' | 'movie_history' | 'movie_horror' | 'movie_romance';",
  "| 'movie_scifi' | 'movie_history' | 'movie_horror' | 'movie_romance' | 'asian_microdrama';"
);

const optionTarget = "    { id: 'movie_romance', label: 'Películas de Amor y Romance', icon: <Heart size={14} /> },\n";
const optionReplacement = "    { id: 'movie_romance', label: 'Películas de Amor y Romance', icon: <Heart size={14} /> },\n    { id: 'asian_microdrama', label: 'Microdramas Estilo Asia', icon: <Smartphone size={14} /> },\n";
code = code.replace(optionTarget, optionReplacement);

fs.writeFileSync('App.tsx', code);
console.log("Asian microdrama added!");
