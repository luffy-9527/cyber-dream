const fs = require('fs');

let searchCode = fs.readFileSync('E:/gemini/cyber-dream-app/src/pages/search/search.vue', 'utf8');

// Update the prompt to ask for 20 results
searchCode = searchCode.replace(
  /请列出10个关于“\$\{target\}”的具体梦境搜索词/,
  "请列出20个关于“${target}”的具体梦境搜索词"
);

// If the API key is missing, show a toast so they know!
searchCode = searchCode.replace(
  /if \(!apiKey \|\| apiKey\.trim\(\)\.length < 10\) \{[\s\S]*?return;\n  \}/m,
  `if (!apiKey || apiKey.trim().length < 10) {
    uni.showToast({ title: '未配置大模型，当前为本地演示数据', icon: 'none', duration: 2500 });
    setTimeout(() => {
      aiRelatedList.value = [
        \`梦见\${target}\`,
        \`梦见买\${target}\`,
        \`梦见很多\${target}\`,
        \`梦见孕妇梦见\${target}\`,
        \`梦见\${target}坏了\`
      ];
    }, 800);
    return;
  }`
);

fs.writeFileSync('E:/gemini/cyber-dream-app/src/pages/search/search.vue', searchCode, 'utf8');