const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const target = "} else if (category === 'movie_scripts') {\n      let lengthText = \"longitud adecuada\";\n      if (narrativeLength === 'short') lengthText = \"corta (ideal para un cortometraje o escena puntual)\";\n      if (narrativeLength === 'medium') lengthText = \"mediana (ideal para un episodio o mediometraje)\";\n      if (narrativeLength === 'long') lengthText = \"larga (ideal para un largometraje)\";\n      categoryPrompt = `Crea \\${storyCount} guiones de películas generados con IA con una \\${lengthText}. Varía el género de los guiones entre horror, ficción, drama, acción y comedia. CRÍTICO: Asegúrate de que el gancho al principio sea el mejor posible para atrapar a la audiencia inmediatamente. El guion debe tener una estructura adecuada para su formato. La narración y dirección del guion DEBEN ser contadas y reflejar estrictamente el estilo particular, la personalidad y el punto de vista de \\${activePersona.name}.`;";

const replacement = `} else if (['movie_scripts', 'movie_drama', 'movie_action', 'movie_scifi', 'movie_history', 'movie_horror'].includes(category)) {
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

      categoryPrompt = \`Crea \${storyCount} guiones de películas generados con IA con una \${lengthText}. \${genreInstruction} CRÍTICO: Los personajes deben ser de 1 a 6 como máximo. El formato de la historia DEBE SER ESTRICTAMENTE UN GUION DE CINE ESTRUCTURADO (con Encabezados de Escena, Acción, Nombres de Personajes y Diálogos). Asegúrate de que el gancho al principio sea el mejor posible para atrapar a la audiencia inmediatamente. El guion debe tener una estructura adecuada para su formato. La dirección del guion DEBE reflejar estrictamente el estilo particular, la personalidad y el punto de vista de \${activePersona.name}.\`;`;

code = code.replace(target, replacement);
fs.writeFileSync('App.tsx', code);
