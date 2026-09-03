const https = require('https');

const data = JSON.stringify({
  model: 'Qwen/Qwen2.5-7B-Instruct',
  messages: [{ role: 'user', content: '测试一下，请返回：1' }]
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
    console.log('Status:', res.statusCode);
    console.log('Response:', body);
  });
});

req.on('error', error => {
  console.error('Error:', error);
});

req.write(data);
req.end();