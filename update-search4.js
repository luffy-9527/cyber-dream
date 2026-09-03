const fs = require('fs');
let content = fs.readFileSync('E:/gemini/cyber-dream-app/src/pages/search/search.vue', 'utf8');

content = content.replace(/const filteredList = computed\(\(\) => \{[\s\S]*?\}\);/, `const filteredList = computed(() => {
  const q = searchQuery.value.trim();
  if (!q) {
    return allTitles.value.filter(item => item.hasDetail);
  }
  return allTitles.value.filter(item => item.title.includes(q));
});`);

fs.writeFileSync('E:/gemini/cyber-dream-app/src/pages/search/search.vue', content, 'utf8');