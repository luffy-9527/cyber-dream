const fs = require('fs');
let c = fs.readFileSync('src/pages_sub/result/result.vue', 'utf8');
c = c.replace(/class="neuro-bar"/g, 'class="neuro-bar neuro-bar-striped"');
fs.writeFileSync('src/pages_sub/result/result.vue', c);
