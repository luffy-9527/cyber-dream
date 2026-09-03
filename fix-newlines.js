const fs = require('fs');
let content = fs.readFileSync('E:/gemini/cyber-dream-app/src/pages/search/search.vue', 'utf8');

// Use regex to fix the swallowed newlines by matching the comment and adding a newline before the next const
content = content.replace(/（本地\+AI）(.*?)const currentPage/g, "（本地+AI）\nconst currentPage");
content = content.replace(/当前页面展示的列表(.*?)const displayedList/g, "当前页面展示的列表\nconst displayedList");

// Alternatively, just replace the entire script with a clean one without Chinese comments at the end of lines
let newContent = content.replace(/\/\/ 存储本次搜索的所有结果（本地\+AI[\s\S]*?const currentPage/, "// items\nconst currentPage");
newContent = newContent.replace(/\/\/ 当前页面展示的列[\s\S]*?const displayedList/, "// list\nconst displayedList");

fs.writeFileSync('E:/gemini/cyber-dream-app/src/pages/search/search.vue', newContent, 'utf8');