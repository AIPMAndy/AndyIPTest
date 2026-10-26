import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import vm from 'node:vm';

const root = path.resolve(import.meta.dirname, '..');
const read = file => fs.readFileSync(path.join(root, file), 'utf8');
const html = read('index.html');
const script = read('assets/app.js');
const css = read('assets/style.css');
const readme = read('README.md');
const checks = [];
function test(title, fn) { fn(); checks.push(title); }

const elements = new Map();
function el(id) {
  if (!elements.has(id)) elements.set(id, {
    textContent: '', disabled: false, value: '', attributes: {}, classList: { add() {}, remove() {} },
    setAttribute(key, value) { this.attributes[key] = value; },
    removeAttribute(key) { delete this.attributes[key]; },
    focus() {}
  });
  return elements.get(id);
}
let requests = [];
let mockFetch = async () => { throw new Error('Network unavailable'); };
const context = vm.createContext({
  URL, AbortController,
  setTimeout: () => 1, clearTimeout: () => {},
  localStorage: { getItem: () => null, setItem: () => {} },
  document: { getElementById: el, addEventListener: () => {} },
  window: {},
  fetch: async (url, options) => { requests.push({ url, options }); return mockFetch(url, options); }
});
vm.runInContext(script + `\n;globalThis.testApi = { ipFamily, parseIPInfo, escapeHtml, lookupIP, probeStack, lookupAddress, API, TOOLS };`, context);
const lib = context.testApi;
const response = data => ({ ok: true, json: async () => data });

// Source / release integrity.
test('官方项目命名、仓库与 Pages 域名统一', () => {
  for (const file of [html, readme]) assert(file.includes('AndyIPTest'));
  assert(html.includes('https://aipmandy.github.io/AndyIPTest/'));
  assert(!html.includes('IP Atlas'));
});
test('站点文件与搜索引擎入口齐全', () => {
  for (const file of ['index.html', '.nojekyll', 'assets/style.css', 'assets/app.js', 'assets/favicon.svg', 'assets/og-cover.png', 'LICENSE', 'robots.txt', 'sitemap.xml', 'README.md'])
    assert(fs.existsSync(path.join(root, file)), file);
  assert(read('sitemap.xml').includes('https://aipmandy.github.io/AndyIPTest/'));
  assert(read('robots.txt').includes('Sitemap:'));
});
test('所有本地引用路径可用于仓库子目录部署', () => {
  for (const file of ['assets/style.css', 'assets/app.js', 'assets/favicon.svg']) assert(html.includes(`"${file}"`));
  assert(!/\b(?:href|src)="\/(?!\/)/.test(html));
});
test('内容安全策略限制脚本和 API 域名', () => {
  assert(html.includes('Content-Security-Policy'));
  for (const entry of ["default-src 'none'", "script-src 'self'", 'connect-src https://ipwho.is', 'https://api6.ipify.org', "form-action 'none'"])
    assert(html.includes(entry), entry);
  assert(!html.includes('unsafe-inline') && !html.includes('unsafe-eval'));
});
test('IP 检测坚持用户发起、不含访问分析服务', () => {
  assert(script.includes("addEventListener('click', lookupIP)"));
  assert(script.includes("addEventListener('click', probeStack)"));
  assert(script.includes("addEventListener('submit', lookupAddress)"));
  assert(!script.includes('lookupIP();') && !script.includes('probeStack();'));
  assert(!html.includes('googletagmanager') && !html.includes('google-analytics'));
  assert(!html.includes('<iframe'));
});
test('外链 HTTPS，且隔离 opener / referrer', () => {
  for (const [, url] of html.matchAll(/href="(https?:[^"#]+)"/g)) assert(url.startsWith('https://'), url);
  for (const element of html.match(/<a\b[^>]*target="_blank"[^>]*>/g) || [])
    assert(/rel="[^"]*noopener noreferrer/.test(element), element);
  assert(html.includes('name="referrer" content="no-referrer"'));
});
test('工具目录唯一、官方 HTTPS URL、类目准确', () => {
  assert.equal(lib.TOOLS.length, 26);
  const ids = new Set();
  for (const tool of lib.TOOLS) {
    assert(!ids.has(tool.id), tool.id); ids.add(tool.id);
    assert.equal(new URL(tool.url).protocol, 'https:');
    assert(tool.desc.length > 12);
    assert(tool.category && tool.name && tool.domain && tool.tag);
  }
});
test('响应式、小屏输入、减少动画、键盘焦点', () => {
  for (const item of ['@media(max-width:560px)', '@media(max-width:380px)', 'prefers-reduced-motion', ':focus-visible', '[hidden]']) assert(css.includes(item), item);
  assert(html.includes('aria-live="polite"'));
  assert(html.includes('for="lookup-input"'));
});
test('无假状态指示和注册商标暗示', () => {
  assert(!html.includes('NETWORK SIGNAL <strong>ONLINE'));
  assert(!html.includes('<sup>®</sup>'));
  assert(html.includes('本次请求'));
});
test('社交分享图和许可证真实存在', () => {
  assert(html.includes('https://aipmandy.github.io/AndyIPTest/assets/og-cover.png'));
  assert(fs.statSync(path.join(root, 'assets/og-cover.png')).size > 1024);
  assert(read('LICENSE').includes('MIT License'));
});

// Domain validators. In particular reject IPv4 overflow and arbitrary punctuation.
test('严格接受标准 IPv4 地址', () => {
  for (const ip of ['1.1.1.1', '0.0.0.0', '255.255.255.255', '192.168.1.9']) assert.equal(lib.ipFamily(ip), 'IPv4');
});
test('拒绝畸形 IPv4、URL、主机名与注入载荷', () => {
  for (const ip of ['...', '999.1.2.3', '192.168.001.1', '1.2.3', '1.2.3.4:443', '8.8.8.8 ', 'https://ip.sb/', '<script>', 'example.com', '', null])
    assert.equal(lib.ipFamily(ip), null, String(ip));
});
test('接受合法 IPv6、拒绝畸形 IPv6', () => {
  for (const ip of ['2001:4860:4860::8888', '::1', '::ffff:192.0.2.1', '2001:db8:0:0:0:0:0:1']) assert.equal(lib.ipFamily(ip), 'IPv6', ip);
  for (const ip of ['2001:::1', 'gggg::1', 'fe80::1%eth0', '2001:db8::1/64', '1:2:3:4:5:6:7:8:9']) assert.equal(lib.ipFamily(ip), null, ip);
});
test('供应商无效数据被拒绝且 API 字段受长度限制', () => {
  assert.throws(() => lib.parseIPInfo({ success: false, ip: '1.2.3.4' }, 'bad'));
  assert.throws(() => lib.parseIPInfo({ ip: '999.2.3.4' }, 'bad'));
  const good = lib.parseIPInfo({ ip: '1.2.3.4', city: 'a'.repeat(800), connection: { isp: 'b'.repeat(800), asn: 123 } }, 'provider');
  assert(good.location.length <= 48);
  assert(good.isp.length <= 100);
  assert.equal(good.asn, 123);
});
test('HTML 转义阻挡第三方字符串注入', () => {
  const converted = lib.escapeHtml('<img src=x onerror="bad">');
  assert(converted.includes('&lt;img'));
  assert(!converted.includes('<img'));
});

test('26 个工具保留功能信息，不再使用随机 Unicode 图标', () => {
  assert(!script.includes('tool.icon'));
  assert(!script.includes('class="tool-icon"'));
  assert(!/icon:'[^']*'/.test(script));
  assert(script.includes("isFavorite ? '已收藏' : '收藏'"));
  assert(script.includes("value === 'favorites' ? '我的收藏' : value"));
});
test('精简版仍保留全部检测与必要的辅助功能', () => {
  for (const id of ['theme-toggle','scan-button','copy-ip','stack-button','lookup-form','tool-search','category-filters','tools-grid']) {
    assert(html.includes(`id="${id}"`), id);
  }
  assert(html.includes('aria-label="复制当前 IP"'));
  assert(html.includes('assets/editorial.css'));
  assert(!html.includes('class="step-symbol"'));
  assert(!html.includes('class="metric-icon"'));
});

// Stateful behavior; the mocked fetch simulates real outcome combinations.
await (async () => {
  requests = [];
  mockFetch = async () => response({ ip: '8.8.8.8', success: true, country: 'United States', connection: { isp: 'Test ISP', asn: 15169 } });
  await lib.lookupIP();
  assert.equal(el('ip-value').textContent, '8.8.8.8');
  assert.equal(el('ip-family').textContent, 'IPv4');
  assert.equal(el('copy-ip').disabled, false);
  assert.equal(requests.length, 1);
  assert.equal(requests[0].url, lib.API.detail);
  assert.equal(requests[0].options.credentials, 'omit');
  checks.push('主 API 成功：结果、状态、复制按钮、请求策略正确');

  requests = [];
  mockFetch = async url => url === lib.API.detail ? response({ success: false, ip: '1.2.3.4' }) : response({ ip: '2001:db8::42' });
  await lib.lookupIP();
  assert.equal(el('ip-value').textContent, '2001:db8::42');
  assert.equal(el('metric-isp').textContent, '无运营商数据');
  assert.equal(requests.length, 2);
  checks.push('主 API 异常后回退备用 IP 接口，不伪造 ISP');

  requests = [];
  mockFetch = async () => { throw new Error('Network failure'); };
  await lib.lookupIP();
  assert.equal(el('ip-value').textContent, '查询失败');
  assert.equal(el('copy-ip').disabled, true);
  assert.equal(el('scan-button').disabled, false);
  checks.push('双重失败清除旧结果，并恢复按钮可用');

  requests = [];
  mockFetch = async url => url === lib.API.ipv4 ? response({ ip: '8.8.4.4' }) : Promise.reject(new Error('No IPv6'));
  await lib.probeStack();
  assert.equal(el('ipv4-result').textContent, '8.8.4.4');
  assert.equal(el('ipv6-result').textContent, '本次查询失败 / 不可判定');
  assert.equal(requests.length, 2);
  checks.push('双栈检测相互独立；IPv6 查询失败不误判不支持');

  requests = [];
  el('lookup-input').value = '999.1.1.1';
  const event = { preventDefault() {} };
  await lib.lookupAddress(event);
  assert.equal(requests.length, 0);
  assert.equal(el('lookup-input').attributes['aria-invalid'], 'true');
  checks.push('非法 IP 手动查询在前端直接拦截，不发网络请求');

  requests = [];
  el('lookup-input').value = '2001:4860:4860::8888';
  mockFetch = async () => response({ ip: '2001:4860:4860::8888', success: true, country: 'United States', connection: { isp: 'ISP' } });
  await lib.lookupAddress(event);
  assert(requests[0].url.includes('2001%3A4860%3A4860%3A%3A8888'));
  assert(el('lookup-result').textContent.includes('United States'));
  assert.equal(el('lookup-button').disabled, false);
  checks.push('合法 IPv6 查询 URL 编码正确且展示来源数据');
})();

console.log(`${checks.length} checks passed`);
for (const item of checks) console.log(' ✓', item);
