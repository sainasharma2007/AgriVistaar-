const fs = require('fs');
const filepath = 'c:/Users/SAINA20/OneDrive/Desktop/INNOVAULT/farmer drone app/farmer-drone-client/src/context/LanguageContext.jsx';
const code = fs.readFileSync(filepath, 'utf8');

const languages = ['en', 'hi', 'ta', 'bn', 'te', 'mr'];
let currentLang = null;
let keysInLang = new Set();
const outLines = [];

const lines = code.split('\n');
let i = 0;
while (i < lines.length) {
    const line = lines[i];
    
    let isLangHeader = false;
    for (let lang of languages) {
        if (line.match(new RegExp(`^\\s*(?:'|")?${lang}(?:'|")?\\s*:\\s*\\{`))) {
            currentLang = lang;
            // Clear the seen keys for new language
            keysInLang.clear();
            outLines.push(line);
            isLangHeader = true;
            break;
        }
    }
    
    if (isLangHeader) {
        i++;
        continue;
    }
    
    // Check if we are ending the language block cleanly
    if (currentLang && line.match(/^\s*\}\s*,/)) {
        currentLang = null;
        outLines.push(line);
        i++;
        continue;
    }

    if (currentLang) {
        // extract object key (e.g. `  keyName: "value"` or `"keyName": "value"`)
        const keyMatch = line.match(/^\s*(?:'|")?([a-zA-Z0-9_]+)(?:'|")?\s*:/);
        // ignore lines with //
        if (keyMatch && !line.includes('//')) {
            const key = keyMatch[1];
            if (keysInLang.has(key)) {
                // console.log(`Removed duplicate key '${key}' in lang '${currentLang}' at line ${i+1}`);
                let j = i;
                let foundEnd = false;
                // Look ahead up to 5 lines for the trailing comma that ends the value
                while (j < lines.length && j < i + 5) {
                    if (lines[j].trim().endsWith(',')) {
                        foundEnd = true;
                        break;
                    }
                    j++;
                }
                if (foundEnd) {
                    // skip the original key line and its corresponding value lines
                    i = j + 1;
                } else {
                    i++;
                }
                continue;
            } else {
                keysInLang.add(key);
            }
        }
    }
    
    outLines.push(line);
    i++;
}

fs.writeFileSync(filepath, outLines.join('\n'), 'utf8');
console.log('Successfully removed ALL duplicate keys from LanguageContext.jsx');
