const fs = require('fs');
let code = fs.readFileSync('replace.py', 'utf8');

code = code.replace(
  /\['movie_scripts', 'movie_drama', 'movie_action', 'movie_scifi', 'movie_history', 'movie_horror', 'movie_romance'\]/g,
  "['movie_scripts', 'movie_drama', 'movie_action', 'movie_scifi', 'movie_history', 'movie_horror', 'movie_romance', 'asian_microdrama']"
);

fs.writeFileSync('replace.py', code);
