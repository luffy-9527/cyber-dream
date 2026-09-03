const fs = require('fs');

const disclaimerHTML = `\n    <view class="disclaimer-footer">\n      <text>内容仅供个人娱乐，禁止作为任何参考</text>\n    </view>\n`;
const disclaimerCSS = `\n.disclaimer-footer {\n  text-align: center;\n  font-size: 24rpx;\n  color: #999;\n  padding: 40rpx 0;\n  width: 100%;\n}\n</style>\n`;

function addDisclaimer(filePath, isSearch = false) {
  if (!fs.existsSync(filePath)) return;
  let content = fs.readFileSync(filePath, 'utf8');
  
  if (isSearch) {
    // Search page has a specific logic for no-more, we replace it and place footer at very bottom of container
    content = content.replace(/<view class="no-more"[\s\S]*?<\/view>/, '');
  }
  
  // Insert before the last closing tag of the main container, usually right before </view>\n</template>
  // A safe way is to find </template> and insert right before the last </view>
  content = content.replace(/(<\/view>\s*)(<\/template>)/, disclaimerHTML + "$1$2");
  
  // Insert CSS
  if (!content.includes('.disclaimer-footer')) {
    content = content.replace(/<\/style>/, disclaimerCSS);
  }
  
  fs.writeFileSync(filePath, content, 'utf8');
}

addDisclaimer('E:/gemini/cyber-dream-app/src/pages/index/index.vue');
addDisclaimer('E:/gemini/cyber-dream-app/src/pages/archive/archive.vue');
addDisclaimer('E:/gemini/cyber-dream-app/src/pages_sub/dict_detail/dict_detail.vue');
addDisclaimer('E:/gemini/cyber-dream-app/src/pages_sub/result/result.vue');
addDisclaimer('E:/gemini/cyber-dream-app/src/pages/search/search.vue', true);

// Fix search.vue featured content logic
let searchCode = fs.readFileSync('E:/gemini/cyber-dream-app/src/pages/search/search.vue', 'utf8');
searchCode = searchCode.replace(
  /import \{ ref, computed \} from 'vue';/,
  "import { ref, computed, onMounted } from 'vue';"
);

const featuredLogic = `
function initFeatured() {
  const allAvailable = [
    ...localDb.value.map(d => ({ title: d.title, id: d.id, hasDetail: true })),
    ...dreamSearchIndex.map(t => ({ title: t, id: null, hasDetail: false }))
  ];
  const shuffled = allAvailable.sort(() => 0.5 - Math.random());
  allSearchItems.value = deduplicate(shuffled.slice(0, 15));
  currentPage.value = 1;
}

onMounted(() => {
  initFeatured();
});

function onInput() {
  if (!searchQuery.value.trim()) {
    initFeatured();
  }
}
`;

searchCode = searchCode.replace(
  /function onInput\(\) \{[\s\S]*?\}/,
  featuredLogic
);

fs.writeFileSync('E:/gemini/cyber-dream-app/src/pages/search/search.vue', searchCode, 'utf8');