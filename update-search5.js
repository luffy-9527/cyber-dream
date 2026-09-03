const fs = require('fs');
let content = fs.readFileSync('E:/gemini/cyber-dream-app/src/pages/search/search.vue', 'utf8');

content = content.replace(/function onInput\(\) \{\s*\/\/ 输入时清空之前的AI结果，保持体验一.*?\n\s*\/\/ aiRelatedList\.value = \[\];\s*\}/, `function onInput() {
  aiRelatedList.value = [];
}`);

fs.writeFileSync('E:/gemini/cyber-dream-app/src/pages/search/search.vue', content, 'utf8');