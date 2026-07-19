const fs = require('fs');
let code = fs.readFileSync('App.tsx', 'utf8');

const targetSelect = `onChange={(e) => { setSelectedPersonaId(e.target.value); setTrends([]); hasInitialFetchedRef.current = false; }}`;
const replacementSelect = `onChange={(e) => { 
  const newPersonaId = e.target.value;
  setSelectedPersonaId(newPersonaId); 
  setTrends([]); 
  hasInitialFetchedRef.current = false; 
  const allowed = categoryOptions.filter(opt => !opt.exclusive || opt.exclusive === newPersonaId || (Array.isArray(opt.exclusive) && opt.exclusive.includes(newPersonaId)));
  if (!allowed.find(a => a.id === category)) {
    setCategory(allowed[0].id as Category);
  }
}}`;
if (code.includes(targetSelect)) {
  code = code.replace(targetSelect, replacementSelect);
}

const targetMap = `{categoryOptions.map(opt => <option key={opt.id} value={opt.id}>{opt.label.toUpperCase()}</option>)}`;
const replacementMap = `{categoryOptions.filter(opt => !opt.exclusive || opt.exclusive === activePersona.id || (Array.isArray(opt.exclusive) && opt.exclusive.includes(activePersona.id))).map(opt => <option key={opt.id} value={opt.id}>{opt.label.toUpperCase()}</option>)}`;
if (code.includes(targetMap)) {
  code = code.replace(targetMap, replacementMap);
}

fs.writeFileSync('App.tsx', code);
console.log("Fixed!");
