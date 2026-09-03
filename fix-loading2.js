const fs = require('fs');
let content = fs.readFileSync('E:/gemini/cyber-dream-app/src/pages/search/search.vue', 'utf8');

content = content.replace(
  /complete: \(\) => \{ uni\.hideLoading\(\); \},/g,
  "complete: () => { setTimeout(() => uni.hideLoading(), 500); },"
);

fs.writeFileSync('E:/gemini/cyber-dream-app/src/pages/search/search.vue', content, 'utf8');