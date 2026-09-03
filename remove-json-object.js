const fs = require('fs');

const files = [
  'E:/gemini/cyber-dream-app/src/pages/search/search.vue',
  'E:/gemini/cyber-dream-app/src/pages_sub/result/result.vue'
];

for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  content = content.replace(/,\s*response_format:\s*\{\s*type:\s*'json_object'\s*\}/g, '');
  content = content.replace(/response_format:\s*\{\s*type:\s*'json_object'\s*\}/g, '');
  fs.writeFileSync(file, content, 'utf8');
}