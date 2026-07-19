const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

// 1. Category type
code = code.replace(
  "| 'movie_scifi' | 'movie_history' | 'movie_horror';",
  "| 'movie_scifi' | 'movie_history' | 'movie_horror' | 'movie_romance';"
);

// 2. Add to categoryOptions
const optionTarget = "    { id: 'movie_horror', label: 'Películas de Terror', icon: <Clapperboard size={14} />, exclusive: 'movie_generator' },\n";
const optionReplacement = "    { id: 'movie_horror', label: 'Películas de Terror', icon: <Clapperboard size={14} />, exclusive: 'movie_generator' },\n    { id: 'movie_romance', label: 'Películas de Amor y Romance', icon: <Heart size={14} /> },\n";
code = code.replace(optionTarget, optionReplacement);

// 3. Fix movie generation logic
const oldMovieLogic = `    } else if (category === 'movie_scripts') {
      let lengthText = "longitud adecuada";
      if (narrativeLength === 'short') lengthText = "corta (ideal para un cortometraje o escena puntual)";
      if (narrativeLength === 'medium') lengthText = "mediana (ideal para un episodio o mediometraje)";
      if (narrativeLength === 'long') lengthText = "larga (ideal para un largometraje)";
      categoryPrompt = \`Crea \${storyCount} guiones de películas generados con IA con una \${lengthText}. Varía el género de los guiones entre horror, ficción, drama, acción y comedia. CRÍTICO: Asegúrate de que el gancho al principio sea el mejor posible para atrapar a la audiencia inmediatamente. El guion debe tener una estructura adecuada para su formato. La narración y dirección del guion DEBEN ser contadas y reflejar estrictamente el estilo particular, la personalidad y el punto de vista de \${activePersona.name}.\`;
    }`;
    
const newMovieLogic = `    } else if (['movie_scripts', 'movie_drama', 'movie_action', 'movie_scifi', 'movie_history', 'movie_horror', 'movie_romance'].includes(category)) {
      let lengthText = "longitud adecuada";
      if (narrativeLength === 'short') lengthText = "corta (ideal para un cortometraje o escena puntual)";
      if (narrativeLength === 'medium') lengthText = "mediana (ideal para un episodio o mediometraje)";
      if (narrativeLength === 'long') lengthText = "larga (ideal para un largometraje)";
      
      let genreInstruction = "Varía el género de los guiones entre horror, ficción, drama, acción y comedia.";
      if (category === 'movie_drama') genreInstruction = "El género debe ser exclusivamente DRAMA.";
      if (category === 'movie_action') genreInstruction = "El género debe ser exclusivamente ACCIÓN.";
      if (category === 'movie_scifi') genreInstruction = "El género debe ser exclusivamente CIENCIA FICCIÓN.";
      if (category === 'movie_history') genreInstruction = "El género debe ser exclusivamente HISTORIA.";
      if (category === 'movie_horror') genreInstruction = "El género debe ser exclusivamente TERROR.";
      if (category === 'movie_romance') genreInstruction = "El género debe ser exclusivamente AMOR Y ROMANCE.";
      
      categoryPrompt = \`Crea \${storyCount} guiones de películas generados con IA con una \${lengthText}. \${genreInstruction} CRÍTICO: Los personajes deben ser de 1 a 6 como máximo. El formato de la historia DEBE SER ESTRICTAMENTE UN GUION DE CINE ESTRUCTURADO (con Encabezados de Escena, Acción, Nombres de Personajes y Diálogos). Asegúrate de que el gancho al principio sea el mejor posible para atrapar a la audiencia inmediatamente. El guion debe tener una estructura adecuada para su formato. La dirección del guion DEBE reflejar estrictamente el estilo particular, la personalidad y el punto de vista de \${activePersona.name}.\`;
    }`;
code = code.replace(oldMovieLogic, newMovieLogic);

// 4. Add movie_romance to isMovieCategory arrays (there are 2 occurrences in App.tsx)
code = code.replace(
  /\['movie_scripts', 'movie_drama', 'movie_action', 'movie_scifi', 'movie_history', 'movie_horror'\]/g,
  "['movie_scripts', 'movie_drama', 'movie_action', 'movie_scifi', 'movie_history', 'movie_horror', 'movie_romance']"
);

// 5. Remove the inline .filter() from my previous fix, as the array itself is already filtered in its definition!
const oldSelectJSX = `className={\`w-full px-8 py-5 bg-slate-900 border-2 border-slate-800 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] text-white appearance-none cursor-pointer focus:border-\${activePersona.color} focus:outline-none transition-all shadow-2xl\`}>{categoryOptions.filter(opt => !opt.exclusive || opt.exclusive === activePersona.id || (Array.isArray(opt.exclusive) && opt.exclusive.includes(activePersona.id))).map(opt => <option key={opt.id} value={opt.id}>{opt.label.toUpperCase()}</option>)}</select>`;
const newSelectJSX = `className={\`w-full px-8 py-5 bg-slate-900 border-2 border-slate-800 rounded-[1.5rem] font-black uppercase text-xs tracking-[0.2em] text-white appearance-none cursor-pointer focus:border-\${activePersona.color} focus:outline-none transition-all shadow-2xl\`}>{categoryOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label.toUpperCase()}</option>)}</select>`;
code = code.replace(oldSelectJSX, newSelectJSX);

fs.writeFileSync('App.tsx', code);
console.log("Movie romance added successfully!");
