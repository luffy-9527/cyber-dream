const fs = require('fs');

// Update search.vue
let searchCode = fs.readFileSync('E:/gemini/cyber-dream-app/src/pages/search/search.vue', 'utf8');

searchCode = searchCode.replace(
  /url: 'https:\/\/api\.deepseek\.com\/v1\/chat\/completions'/g,
  "url: dreamStore.settings?.apiUrl || 'https://api.deepseek.com/v1/chat/completions'"
);

searchCode = searchCode.replace(
  /model: 'deepseek-chat'/g,
  "model: dreamStore.settings?.apiModel || 'deepseek-chat'"
);

fs.writeFileSync('E:/gemini/cyber-dream-app/src/pages/search/search.vue', searchCode, 'utf8');

// Update result.vue
let resultCode = fs.readFileSync('E:/gemini/cyber-dream-app/src/pages_sub/result/result.vue', 'utf8');

resultCode = resultCode.replace(
  /url: 'https:\/\/api\.deepseek\.com\/v1\/chat\/completions'/g,
  "url: dreamStore.settings?.apiUrl || 'https://api.deepseek.com/v1/chat/completions'"
);

resultCode = resultCode.replace(
  /model: 'deepseek-chat'/g,
  "model: dreamStore.settings?.apiModel || 'deepseek-chat'"
);

fs.writeFileSync('E:/gemini/cyber-dream-app/src/pages_sub/result/result.vue', resultCode, 'utf8');