const https = require('https');

const data = JSON.stringify({
  model: 'Qwen/Qwen2-7B-Instruct',
  messages: [{ role: 'user', content: '请列出10个关于“西瓜”的具体梦境搜索词，仅返回逗号分隔的词语。' }]
});

const options = {
  hostname: 'api.siliconflow.cn',
  port: 443,
  path: '/v1/chat/completions',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': 'Bearer sk-fwscfxthntywhggispbunnomdebsnnaaxycbhogeohyniemt'
  }
};

const req = https.request(options, res => {
  let body = '';
  res.on('data', d => { body += d; });
  res.on('end', () => {
    console.log(body);
  });
});

req.write(data);
req.end();