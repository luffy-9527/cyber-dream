const https = require('https');

const target = '西瓜';
const prompt = `请列出20个关于“${target}”的具体梦境搜索词，必须以“梦见”开头。仅返回纯JSON数组格式，不要任何其他文字。示例：["梦见${target}","梦见很多${target}"]`;

const data = JSON.stringify({
  model: 'Qwen/Qwen2.5-7B-Instruct',
  messages: [{ role: 'user', content: prompt }]
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
    const json = JSON.parse(body);
    console.log('Response Content:', json.choices[0].message.content);
  });
});

req.write(data);
req.end();