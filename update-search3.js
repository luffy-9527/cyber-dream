const fs = require('fs');
let content = fs.readFileSync('E:/gemini/cyber-dream-app/src/pages/search/search.vue', 'utf8');

content = content.replace(/const targetTitle = q\.startsWith[\s\S]*?matched\.unshift[\s\S]*?\}/, '');

fs.writeFileSync('E:/gemini/cyber-dream-app/src/pages/search/search.vue', content, 'utf8');