const fs = require('fs');
let content = fs.readFileSync('E:/gemini/cyber-dream-app/src/pages/search/search.vue', 'utf8');

// The original file now has an extra } somewhere around line 112. Let's find and remove it.
// We can just rewrite the entire function block properly.

// Let's replace the whole block starting from `function onInput()` to the next function.
content = content.replace(/function onInput\(\) \{[\s\S]*?(?=async function onSearch\(\))/g, `function onInput() {
  hasSearched.value = false;
  if (!searchQuery.value.trim()) {
    initFeatured();
  } else {
    allSearchItems.value = []; // 清空列表，保持安静，直到点击搜索
  }
}

`);

fs.writeFileSync('E:/gemini/cyber-dream-app/src/pages/search/search.vue', content, 'utf8');