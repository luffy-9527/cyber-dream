const fs = require('fs');

let content = fs.readFileSync('E:/gemini/cyber-dream-app/src/pages/search/search.vue', 'utf8');

// Replace the success and fail blocks for the first uni.request
content = content.replace(
  /success: \(res\) => \{\s*uni\.hideLoading\(\);\s*if \(res\.data/m,
  "complete: () => { uni.hideLoading(); },\n    success: (res) => {\n      if (res.data"
);
content = content.replace(
  /fail: \(\) => \{\s*uni\.hideLoading\(\);\s*\}/m,
  ""
);

fs.writeFileSync('E:/gemini/cyber-dream-app/src/pages/search/search.vue', content, 'utf8');