const https = require('https');

const data = JSON.stringify({
  model: 'Qwen/Qwen2.5-7B-Instruct',
  messages: [{ role: 'user', content: '请输出数字1到50，用逗号分隔。' }]
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