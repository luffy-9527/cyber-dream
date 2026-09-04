# 梦源阁 (Cyber Dream)

🔮 **梦源阁** 是一款基于 Vue3 + UniApp 构建的现代化微信解梦小程序。它不仅内置了丰富的离线解梦词典，还深度融合了 AI 大模型（支持 DeepSeek 等主流大模型），能够根据用户的梦境提供极其详尽的定制化解析。

## ✨ 核心功能

- **智能联想搜索**：接入大语言模型，搜索时自动生成 30+ 条相关梦境衍生词汇，支持丝滑的分页加载体验。
- **深度 AI 解析**：通过精心设计的 Prompt，AI 化身解梦大师，提供包含：
  - 📝 一句话概括
  - 📜 《原版周公解梦》仿古风解析
  - 🧠 现代心理学深度剖析
  - 👥 不同人群（孕妇、商人、学生等）的专属解读
  - ⏳ 不同时间段（前半夜、后半夜、午睡等）的寓意
  - 🎂 不同年龄段的心理映射
- **梦境档案库**：自动记录并保存所有解析过的梦境，随时回溯，打造专属于你的私人梦境日记。
- **全网白嫖版大模型兼容**：内置灵活的 API 配置面板，支持用户自定义更换 API Key、Base URL (如硅基流动 SiliconFlow) 以及具体模型名称。

## 🚀 技术栈

- **前端框架**：[Vue 3](https://v3.vuejs.org/) (Composition API)
- **跨端框架**：[UniApp](https://uniapp.dcloud.io/)
- **状态管理**：Pinia 思想封装的轻量级 Store
- **构建工具**：Vite

## 🛠️ 本地运行指南

1. **安装依赖**
   \\\ash
   npm install
   \\\

2. **编译微信小程序**
   \\\ash
   npm run dev:mp-weixin
   \\\

3. **开发者工具导入**
   打开 [微信开发者工具](https://developers.weixin.qq.com/miniprogram/dev/devtools/download.html)，导入本项目根目录下的 \dist/dev/mp-weixin\ 文件夹即可预览效果。

## ⚠️ 注意事项

- 本项目使用大模型接口获取解析内容。在手机端真机调试时，请确保在微信开发者工具中开启了 **“不校验合法域名”**，或在手机端点击右上方 ... 开启 **“开发调试”**，否则请求会被微信拦截。
- 所有的解梦内容仅供个人娱乐，禁止作为任何医疗、投资或生活决策的参考！


## 🔒 API 密钥安全配置说明

为了保障开发者的 API Key 不会意外泄露到公开代码仓库，本项目已在 UI 层彻底移除了大模型 API 和 Dify 的输入配置弹窗。现在的密钥配置采用 **纯本地静态文件硬编码** 的方式，并已通过 `.gitignore` 进行了代码库隔离。

配置步骤如下：

1. 进入项目的 `src/config/` 目录。
2. 复制或者重命名 `env.example.js` 文件，并将其命名为 `env.js`。
3. 打开 `env.js` 文件，填入你真实的 API 信息（例如硅基流动的 API、Dify 知识库的 API 等）：
   ```javascript
   export const ENV = {
     // 大语言模型 API（默认使用硅基流动 / DeepSeek）
     apiUrl: 'https://api.siliconflow.cn/v1/chat/completions',
     apiModel: 'Qwen/Qwen2.5-7B-Instruct',
     apiKey: 'sk-你的专属大模型API_KEY', // 在这里填入你的大模型 Key

     // Dify 知识库/工作流 API (可选)
     difyUrl: 'https://api.dify.ai/v1/chat-messages',
     difyKey: 'app-你的DIFY_API_KEY'
   };
   ```
4. 重新编译小程序（`npm run dev:mp-weixin`）即可生效。

> **注意：** `env.js` 文件已经被加入到了 `.gitignore` 忽略清单中。你在本地所做的任何密钥修改都不会被提交到 GitHub 或其他远程代码库，请放心配置。
