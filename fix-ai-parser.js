const fs = require('fs');
let content = fs.readFileSync('E:/gemini/cyber-dream-app/src/pages/search/search.vue', 'utf8');

content = content.replace(
  /const items = content\.split\(\/\[,,\\\\n\]\/\)\.map\(i => i\.trim\(\)\.replace\(\/\[\\\[\\\]"'\/g, ''\)\)\.filter\(i => i && i\.startsWith\('梦见'\)\);/g,
  "const items = content.split(/[,，\\n]/).map(i => i.trim().replace(/[\\\\[\\\\]\"'0-9.、]/g, '')).filter(i => i && i.includes('梦见')).map(i => '梦见' + i.split('梦见')[1]);"
);

// Fallback regex replacement in case the above fails due to escaping
content = content.replace(
  /const items = content\.split\(\/\\[,，\\\\n\\]\/\)\.map.*?startsWith\('梦见'\)\);/g,
  "const items = content.split(/[,，\\n]/).map(i => i.trim().replace(/^[0-9.、\\s-]+/, '').replace(/[\\\\[\\\\]\"']/g, '')).filter(i => i && i.includes('梦见')).map(i => '梦见' + i.split('梦见')[1]);"
);

fs.writeFileSync('E:/gemini/cyber-dream-app/src/pages/search/search.vue', content, 'utf8');