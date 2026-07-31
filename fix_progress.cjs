const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

code = code.replace("const [storyboardProgress, setStoryboardProgress] = useState(0);\n  const [storyboardProgress, setStoryboardProgress] = useState(0);", "const [storyboardProgress, setStoryboardProgress] = useState(0);");
code = code.replace("setStoryboardProgress(0);\n      setStoryboardProgress(0);", "setStoryboardProgress(0);");

fs.writeFileSync('App.tsx', code);
