const fs = require('fs');
let content = fs.readFileSync('E:/gemini/cyber-dream-app/src/pages/search/search.vue', 'utf8');

// Update hasMore to return false if searchQuery is empty
content = content.replace(
  /const hasMore = computed\(\(\) => \{\s*return displayedList\.value\.length < allSearchItems\.value\.length;\s*\}\);/,
  "const hasMore = computed(() => {\n  if (!searchQuery.value.trim()) return false;\n  return displayedList.value.length < allSearchItems.value.length;\n});"
);

fs.writeFileSync('E:/gemini/cyber-dream-app/src/pages/search/search.vue', content, 'utf8');