# FreeRedact CN · 本地截图隐私遮挡

> 免费、开源、免注册的中文截图脱敏工具。拖入或粘贴截图，拖动实心遮挡框，导出新 PNG，原图片不上传服务器。

**产品阶段：v0.2 安全修复候选版（PR 未合并，未部署）**

## 功能

- PNG / JPG / WebP 文件、拖拽和截图粘贴；25 MB 和 3000 万像素上限
- 桌面与移动浏览器里通过拖拽创建遮挡框，可移动、单独删除、清除全部
- 撤销 / 重做，`Ctrl/Cmd+Z`，`Ctrl/Cmd+Shift+Z`；选中后 `Delete`
- 在全新 Canvas 中用不透明实心色块覆盖像素，导出扁平化 PNG；不会保留原图 EXIF / GPS 元数据和可编辑图层
- 复制结果图到剪贴板（需浏览器与安全上下文支持）
- **实验性**的本机自动识别：仅支持实现浏览器 `TextDetector` API 的环境，按邮箱、手机号、身份证、令牌等规则生成待确认建议；不支持的浏览器请手动操作
- 完整中文界面，响应式布局，无统计埋点和远程脚本
- 纯静态项目，无需注册、数据库、API Key 或构建工具

## 快速本地运行

```sh
python3 -m http.server 8000
# http://localhost:8000
```

进入页面后点击「使用示例图」，用虚构数据演示遮挡与导出。若在 `tools/freeredact` 子目录中部署，所有资源采用相对地址，不需改变父项目。

## 隐私与安全边界

- 页面 Content-Security-Policy：`connect-src 'none'`，禁止页面脚本通过 fetch/WebSocket 等建立网络连接；第三方托管仍会产生普通网页访问日志。
- 原图片只存在于浏览器内存，不保存到服务器、IndexedDB 或 localStorage；用户刷新页面后清空。
- 用原图重新绘制全新 PNG，把遮挡框内的实际像素替换成不透明色块；不是视觉叠层。**切勿选择模糊/马赛克代替实心遮挡来保护敏感号码。**
- 导出文件名使用固定 `freeredact-safe.png`，避免意外泄漏原文件名。
- 自动识别有漏检与误报，特别是姓名、门牌号、头像、二维码和中文复杂排版；人工检查必不可少。
- 仅支持图片，不支持 PDF 内部文字、附件、隐藏图层脱敏；处理 PDF 请采用专门的扁平化工具。
- 不能撤销已泄露的密码/密钥；如已公开，请立即撤销或轮换。

## v0.2 安全修复

取消拖动可以回滚遮挡框移动；更换图片会作废旧解码、旧 OCR、旧异步导出；导出使用通用安全文件名。详情参见 [PRODUCT_SCORECARD](PRODUCT_SCORECARD.md)、[COMPETITOR_BENCHMARK](COMPETITOR_BENCHMARK.md)、[RED_TEAM_REPORT](RED_TEAM_REPORT.md)、[EVOLUTION_ROADMAP](EVOLUTION_ROADMAP.md)。本地模拟浏览器测试通过，完整网站浏览器端到端测试待 PR CI 验证，未经用户确认不得正式部署。

## 已知限制与后续工作

1. 默认完整的是**手动可靠遮挡**；浏览器 `TextDetector` 不普及。未来优先考虑将 MIT/Apache 许可允许的 WASM OCR 和中文模型完全打包自托管，不经 CDN 载入可执行第三方脚本。
2. 当前不支持自由多边形、涂抹画笔、触控缩放或多图批量处理。
3. 目前尚无 PDF OCR、中文姓名 NER、身份证校验码和隐私泄漏红队测试；未来采用合成测试数据验证检测率与误报率。

## 验证

```sh
node --check app.js
node --check detector.js
node --test tests/detector.test.mjs
python3 -m http.server 8000
# 可运行 tests/browser_smoke.py，依赖 Playwright 和 Chromium
```

## 开源来源和许可

本项目参考 MIT 开源项目 [RedactShot](https://github.com/darkzOGx/RedactShot) 的检测逻辑和安全设计原则，并重新实现为中文纯网页编辑器。请查看 [THIRD_PARTY_NOTICES.md](./THIRD_PARTY_NOTICES.md)。本项目采用 MIT License。

**品牌说明：** 已有独立运营的 `freeredact.com` 网站。本项目以 **FreeRedact CN** 为暂定名称，无关联关系。公开传播前建议采用更具辨识度的品牌名。

作者：[AI 酋长 Andy](https://metaver.vip/) · [AI+IP 与咨询服务](https://metaver.vip/services)

## Iteration 2 additional export-safety checks (unmerged candidate)

- If a mask changes while PNG generation is pending, the old export is cancelled rather than silently downloading a stale image.
- If an asynchronous clipboard write finishes after an image change, the UI warns that the clipboard may contain an obsolete image; re-copy before sharing.
- Regression suites: `python tests/export_integrity.py`, `python tests/mobile_touch_offline.py`, `python tests/metadata_integrity.py`. All run in candidate PR CI; mobile test uses emulation only.
- A test with a fictional location metadata chunk and a private source filename confirms that the exported PNG drops both. This is targeted evidence, not a blanket anonymity guarantee.

**Current published main site is unchanged.** This is still a Draft PR until owner-approved merge/deployment.

## Website launch candidate · v0.3 (2026-10-31)

- Apple-inspired warm-white and forest-green product page built without third-party fonts, trackers, scripts, or imagery.
- Functional hero links to the live local editor; fictional-before/after mask preview, usage steps, privacy FAQ, favicon, social preview SVG, canonical/OG metadata, mobile responsive fixes and reduced-motion CSS.
- Product core remains a self-contained privacy canvas editor; experimental native TextDetector is not advertised as generally supported.
- Maintains existing GitHub Pages hosting under `https://aipmandy.github.io/AndyIPTest/tools/freeredact/`.
- Before production publish: all CI checks, native HTTP smoke, and post-deploy status verification; do not claim actual iOS Safari testing.
