# AndyIPTest

**开源的一站式 IP / 网络环境诊断工具箱。** 本站负责「按需查询 + 排障导航」，高级 DNS 泄漏、WebRTC、IP 信誉与全球节点检测由独立第三方工具完成。

![GitHub Pages](https://img.shields.io/badge/GitHub-Pages-111827) ![MIT](https://img.shields.io/badge/license-MIT-0b8c89) ![No Backend](https://img.shields.io/badge/backend-none-6b7280)

- **项目仓库（创建并发布后生效）：** https://github.com/AIPMAndy/AndyIPTest
- **网站（启用 GitHub Pages 后生效）：** https://aipmandy.github.io/AndyIPTest/
- 作者：AI 酋长 Andy · https://metaver.vip/

> 本仓库当前提供的是待发布源码。**源码存在 ≠ GitHub 仓库已经建立 ≠ GitHub Pages 已经发布。**

## 功能与实现边界

| 功能 | 实现方式 | 点击是否访问第三方 | 局限 |
| --- | --- | --- | --- |
| 当前公网 IP / ISP / ASN / 归属地 | `ipwho.is`，失败时回退 `api64.ipify.org` | 是 | 回退接口只有 IP；数据库位置非 GPS |
| IPv4 / IPv6 出口分别测试 | `api.ipify.org` 和 `api6.ipify.org` | 是 | 任一查询失败不等于该协议不支持 |
| 手动 IP 查询 | `ipwho.is/{ip}` | 是 | 数据库收录、频率配额、跨域策略可能限制 |
| 浏览器语言、时区、平台、屏幕 | 浏览器原生 API 本地读取 | 否 | 不代表完整的设备指纹或系统安全状态 |
| 26 个专业工具目录 | 官方 HTTPS 外部链接 | 打开外链时 | 外部结果和服务条款由各站负责 |
| 分类搜索、收藏、主题 | 原生 JavaScript、`localStorage` | 否 | 无账号同步；浏览器清理数据会丢失收藏 |

不自动检测 IP，不自动运行 DNS / WebRTC 探测，不收集设备指纹，不伪造“纯净度 100 分”。页面及源码没有自建后台、第三方统计脚本或外部字体。GitHub Pages 托管方与第三方 API/网站仍可能分别记录请求数据。

### ⚠️ 第三方服务配额

`ipwho.is` 官方文档目前列出的免费额度为 **每个客户端 IP 1,000 次/天**；浏览器 CORS 请求按**发起网站的域名**计算共享配额。热门网站可能很快达到上限并收到 HTTP 429。主 IP 检测会退回 `api64.ipify.org`（只展示 IP），手动归属查询则会暂时不可用。**不能将本项目理解为可无上限扩容的地理归属 API 服务。** 见：[ipwhois.io 官方 API 文档](https://ipwhois.io/documentation)。配额与规则可能变化。

`ipify` 的 IPv4、IPv6、双栈域名见：[ipify 官方接口说明](https://www.ipify.org/)。这不意味着它对任意网络、任意地区、任意浏览器始终可访问。所有结果以实际请求为准。

## 本地使用

不需要构建步骤，也不需要 npm 依赖：

```bash
python3 -m http.server 8000
# 浏览器打开 http://localhost:8000/
```

或直接将整个目录部署到任意支持静态 HTML 的平台。相对路径结构兼容 GitHub Pages 的项目子路径。

## GitHub Pages 发布步骤

1. 在 https://github.com/new 创建 `AIPMAndy/AndyIPTest` **公开**仓库，名称与大小写需一致；可以不初始化 README。
2. 将本项目根目录的所有文件推送到 `main`，保留 `.nojekyll`、`assets/`、`tests/` 和 `.github/`。
3. 在仓库的 **Settings → Pages → Build and deployment → Deploy from a branch** 中选择 **main** 和 **/(root)**，保存。
4. 到 **Actions** 中检查验证流程，在 **Pages** 中核对部署成功后，访问 https://aipmandy.github.io/AndyIPTest/ 。
5. 手动从真实浏览器核对 IP 查询、IPv4/IPv6 与手动查询、深浅主题、外部链接，确认 CSP、CORS、地区可达性没有阻断。
6. 将 `assets/og-cover.png` 上传到 **Settings → General → Social preview**（GitHub 仓库卡片预览图需人工配置），设置仓库 About / Topics。

官方文档：[Configuring a publishing source for GitHub Pages](https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site)。

## 测试

```bash
node --check assets/app.js
node tests/verify.mjs
```

另外提供可选的 Chromium 浏览器交互测试，覆盖 1440、768、390 和 320px 视口及 API Mock。它**不访问真实第三方 API**，因此不能替代上线后真实浏览器中的 CORS / 连通性验证。

```bash
# 安装 Python Playwright 与 Chromium 后执行；默认使用 /usr/bin/chromium
python3 tests/browser_smoke.py
```

持续集成使用 `.github/workflows/checks.yml`，不需要任何密钥。

## 工具收录和贡献

- 目录数据位于 `assets/app.js` 的 `TOOLS` 数组。每项包含 `id`、`name`、`domain`、`url`、`category`、`icon`、`desc`、`tag`。
- 仅收录与 IP / 网络诊断有关的可信 HTTPS 官方入口；描述必须准确表述「它能观测什么」「不能证明什么」。
- 外站链接不保证长期有效；发现变更可提 Issue / PR。详见 [CONTRIBUTING.md](CONTRIBUTING.md)。
- 审核修复记录、剩余风险及发布前门槛见 [AUDIT.md](AUDIT.md)。

## 数据使用与免责声明

访问本网站时：静态文件来自 GitHub Pages。只有点击查询按钮，浏览器才向 IP 信息服务发送请求；其服务器会自然获知本次请求来源的公网 IP、时间和常规 HTTP 请求信息。指定 IP 查询也会发送输入的 IP。点击工具卡片会访问相应独立网站。

「IP 查询成功」「VPN / 代理标签」「DNS 测试结果」**均不保证匿名、安全、账号不会被风控，也不能代替完整网络审计**。访问第三方网站时应阅读其政策。本站与所链接的第三方服务无隶属、担保或商业授权关系。服务名称和商标均属于相应权利人。

## 许可

项目原创源码采用 [MIT License](LICENSE)；项目没有把第三方网站的代码或素材重新授权为 MIT。欢迎遵守许可使用、改进、贡献。
