const fs = require('fs');
let content = fs.readFileSync('E:/gemini/cyber-dream-app/src/pages/search/search.vue', 'utf8');

// 1. Replace the clear button to call a function
content = content.replace(
  /@click="searchQuery = ''"/,
  '@click="clearSearch"'
);

// 2. Remove onInput from the <input> tag
content = content.replace(
  /@input="onInput"/,
  ''
);

// 3. Replace the section-title logic
content = content.replace(
  /<view class="section-title" v-if="!hasSearched && !searchQuery\.trim\(\)">/g,
  '<view class="section-title" v-if="!hasSearched">'
);
content = content.replace(
  /<view class="section-title" v-else-if="hasSearched">/g,
  '<view class="section-title" v-else>'
);

// 4. Update script logic
const newLogic = `
function clearSearch() {
  searchQuery.value = '';
  initFeatured();
}
`;

// Replace the old onInput function with clearSearch
content = content.replace(
  /function onInput\(\) \{[\s\S]*?(?=async function onSearch\(\))/g,
  newLogic + '\n'
);

fs.writeFileSync('E:/gemini/cyber-dream-app/src/pages/search/search.vue', content, 'utf8');