const fs = require('fs');
let content = fs.readFileSync('E:/gemini/cyber-dream-app/src/pages/search/search.vue', 'utf8');

// Ensure watch is imported
content = content.replace(
  /import \{ ref, computed, onMounted \} from 'vue';/,
  "import { ref, computed, onMounted, watch } from 'vue';"
);

// Add the watcher after initFeatured
const watchLogic = `
watch(searchQuery, (newVal) => {
  if (!newVal.trim()) {
    initFeatured();
  }
});
`;

content = content.replace(
  /onMounted\(\(\) => \{\s*initFeatured\(\);\s*\}\);/,
  "onMounted(() => {\n  initFeatured();\n});\n" + watchLogic
);

fs.writeFileSync('E:/gemini/cyber-dream-app/src/pages/search/search.vue', content, 'utf8');