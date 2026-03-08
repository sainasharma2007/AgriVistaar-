const fs = require('fs');
const content = fs.readFileSync('c:/Users/SAINA20/OneDrive/Desktop/INNOVAULT/farmer drone app/farmer-drone-client/src/context/LanguageContext.jsx', 'utf8');
const lines = content.split('\n');

const duplicates = [];
let currentLang = null;
const keys = {};

lines.forEach((line, i) => {
  if (line.includes('en: {') && !line.includes('//')) { currentLang = 'en'; keys[currentLang] = new Set(); }
  else if (line.includes('hi: {') && !line.includes('//')) { currentLang = 'hi'; keys[currentLang] = new Set(); }
  else if (line.includes('ta: {') && !line.includes('//')) { currentLang = 'ta'; keys[currentLang] = new Set(); }
  
  if (currentLang) {
    // try to match key: "value" or 'key': "value" or "key": "value"
    const match = line.match(/^\s*(?:'|")?([a-zA-Z0-9_]+)(?:'|")?\s*:/);
    if (match) {
      const key = match[1];
      if (keys[currentLang].has(key)) {
        duplicates.push({ lang: currentLang, key, line: i + 1, text: line });
      } else {
        keys[currentLang].add(key);
      }
    }
  }
});

console.log(JSON.stringify(duplicates, null, 2));
