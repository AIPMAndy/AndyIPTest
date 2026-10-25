/* AndyIPTest — static first, no analytics, no backend. */
'use strict';

const TOOLS = [
  {id:'ip-sb',name:'IP.SB',domain:'ip.sb',url:'https://ip.sb/',category:'IP 信息',icon:'◎',desc:'查看公网 IP、ASN、运营商及网络归属；适合用来核对当前出口。',tag:'快速查询'},
  {id:'ipinfo',name:'IPinfo',domain:'ipinfo.io',url:'https://ipinfo.io/',category:'IP 信息',icon:'◈',desc:'查询任意 IP 的地理位置、ASN、运营组织和网络信息。',tag:'专业资料'},
  {id:'skk',name:'Sukka IP Tools',domain:'ip.skk.moe',url:'https://ip.skk.moe/',category:'IP 信息',icon:'◉',desc:'丰富的 IP、DNS 出口与 CDN 命中节点检测工具。',tag:'进阶工具'},
  {id:'ipcheck',name:'IPCheck.ing',domain:'ipcheck.ing',url:'https://ipcheck.ing/',category:'IP 信息',icon:'◌',desc:'集中查看出口 IP、连通性、DNS、WebRTC 与部分风险信息。',tag:'综合检测'},
  {id:'ipleak',name:'IPLeak.net',domain:'ipleak.net',url:'https://ipleak.net/',category:'泄漏排查',icon:'⟡',desc:'一站式查看连接 IP、DNS 与 WebRTC 等信号，适合切换网络后复测。',tag:'综合检测'},
  {id:'dnsleaktest',name:'DNS Leak Test',domain:'dnsleaktest.com',url:'https://dnsleaktest.com/',category:'泄漏排查',icon:'⌁',desc:'检查域名解析器出口；建议运行 Extended Test 并核对运营商。',tag:'DNS'},
  {id:'dnsleakdev',name:'DNSLeak.dev',domain:'dnsleak.dev',url:'https://dnsleak.dev/',category:'泄漏排查',icon:'⟁',desc:'逐项展示解析器测量依据，便于排查偶发或多解析器情况。',tag:'DNS'},
  {id:'webrtc',name:'BrowserLeaks · WebRTC',domain:'browserleaks.com/webrtc',url:'https://browserleaks.com/webrtc',category:'泄漏排查',icon:'⌾',desc:'查看 WebRTC 公开的本地及公网候选地址，与代理出口交叉对照。',tag:'WebRTC'},
  {id:'browserdns',name:'BrowserLeaks · DNS',domain:'browserleaks.com/dns',url:'https://browserleaks.com/dns',category:'泄漏排查',icon:'∿',desc:'独立 DNS 诊断页面，核对解析服务商与网络配置。',tag:'DNS'},
  {id:'browserleaks',name:'BrowserLeaks',domain:'browserleaks.com',url:'https://browserleaks.com/',category:'浏览器隐私',icon:'◫',desc:'测试指纹、WebGL、Canvas、字体、时区及浏览器公开的信号。',tag:'指纹套件'},
  {id:'pixelscan',name:'Pixelscan',domain:'pixelscan.net',url:'https://pixelscan.net/',category:'浏览器隐私',icon:'◧',desc:'检查浏览器环境与部分反欺诈风险信号；结果仅供排查参考。',tag:'浏览器环境'},
  {id:'amiunique',name:'AmIUnique',domain:'amiunique.org',url:'https://amiunique.org/',category:'浏览器隐私',icon:'◇',desc:'研究浏览器可识别性的公开项目，理解设备指纹来源。',tag:'学术研究'},
  {id:'cover',name:'Cover Your Tracks',domain:'coveryourtracks.eff.org',url:'https://coveryourtracks.eff.org/',category:'浏览器隐私',icon:'✳',desc:'EFF 的隐私测试工具，观察指纹识别及追踪保护表现。',tag:'EFF'},
  {id:'ipapi',name:'IPAPI.is',domain:'ipapi.is',url:'https://ipapi.is/',category:'IP 信誉',icon:'◈',desc:'查询 IP 类型、网络所有权及代理风险信号，注意服务端配额限制。',tag:'IP 情报'},
  {id:'proxycheck',name:'ProxyCheck',domain:'proxycheck.io',url:'https://proxycheck.io/',category:'IP 信誉',icon:'✦',desc:'检查代理、VPN 与部分风险标签；不同数据库可能存在分歧。',tag:'代理识别'},
  {id:'scamalytics',name:'Scamalytics',domain:'scamalytics.com',url:'https://scamalytics.com/',category:'IP 信誉',icon:'⬡',desc:'查看 IP 风险指标，第三方评分不能保证平台账号审核结果。',tag:'风险参考'},
  {id:'testipv6',name:'Test IPv6',domain:'test-ipv6.com',url:'https://test-ipv6.com/',category:'网络诊断',icon:'6',desc:'检查当前浏览器到 IPv6 网络的可达性与优先路径。',tag:'IPv6'},
  {id:'cf-speed',name:'Cloudflare Speed',domain:'speed.cloudflare.com',url:'https://speed.cloudflare.com/',category:'网络诊断',icon:'⌁',desc:'测量下载、上传、抖动与延迟等指标；结果依赖测试节点。',tag:'速度测试'},
  {id:'fast',name:'FAST.com',domain:'fast.com',url:'https://fast.com/',category:'网络诊断',icon:'⇄',desc:'Netflix 提供的简洁网速测试，可展开上传和延迟信息。',tag:'速度测试'},
  {id:'speedtest',name:'Speedtest',domain:'speedtest.net',url:'https://www.speedtest.net/',category:'网络诊断',icon:'◴',desc:'选择测速节点，评估带宽与时延；多次测试更有参考价值。',tag:'速度测试'},
  {id:'checkhost',name:'Check-Host',domain:'check-host.net',url:'https://check-host.net/',category:'网络诊断',icon:'⊞',desc:'通过多个地理区域的节点检查 Ping、HTTP、DNS 等可达性。',tag:'全球节点'},
  {id:'globalping',name:'Globalping',domain:'globalping.io',url:'https://globalping.io/',category:'网络诊断',icon:'✺',desc:'从分布式探针测试 Ping、Traceroute 和 DNS；适合跨区域排障。',tag:'网络探针'},
  {id:'dnschecker',name:'DNSChecker',domain:'dnschecker.org',url:'https://dnschecker.org/',category:'DNS 与路由',icon:'◌',desc:'检查域名 DNS 记录在不同地点的传播情况。',tag:'DNS 解析'},
  {id:'whatsmydns',name:'WhatsMyDNS',domain:'whatsmydns.net',url:'https://www.whatsmydns.net/',category:'DNS 与路由',icon:'◉',desc:'查看全球公共解析器中 A、AAAA、MX、TXT 等记录情况。',tag:'DNS 传播'},
  {id:'bgptools',name:'BGP.Tools',domain:'bgp.tools',url:'https://bgp.tools/',category:'DNS 与路由',icon:'⌘',desc:'查询 ASN、BGP 前缀与路由公告，定位网络运营归属。',tag:'ASN / BGP'},
  {id:'hebgp',name:'Hurricane Electric BGP',domain:'bgp.he.net',url:'https://bgp.he.net/',category:'DNS 与路由',icon:'◎',desc:'调查自治系统、路由前缀、网络互联与 BGP 公告。',tag:'路由信息'}
];
const CATEGORIES = ['all', 'IP 信息', '泄漏排查', 'IP 信誉', '浏览器隐私', '网络诊断', 'DNS 与路由', 'favorites'];
const $ = id => document.getElementById(id);
const ALL_TOOL_IDS = new Set(TOOLS.map(tool => tool.id));
const STORAGE_KEY = 'andyiptest:favorites';
const THEME_KEY = 'andyiptest:theme';
const API = Object.freeze({
  detail: 'https://ipwho.is/',
  fallback: 'https://api64.ipify.org?format=json',
  ipv4: 'https://api.ipify.org?format=json',
  ipv6: 'https://api6.ipify.org?format=json'
});
const storage = {
  get(key) { try { return localStorage.getItem(key); } catch { return null; } },
  set(key, value) { try { localStorage.setItem(key, value); } catch { /* storage is optional */ } }
};

function loadFavorites() {
  try {
    const ids = JSON.parse(storage.get(STORAGE_KEY) || '[]');
    return new Set(Array.isArray(ids) ? ids.filter(id => typeof id === 'string' && ALL_TOOL_IDS.has(id)) : []);
  } catch {
    return new Set();
  }
}

let favorites = loadFavorites();
let category = 'all';
let searchTerm = '';
let lastIP = '';
let toastTimer = null;

function toast(message) {
  const element = $('toast');
  element.textContent = message;
  element.classList.add('visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => element.classList.remove('visible'), 2800);
}

function escapeHtml(value) {
  return String(value).replace(/[&<>"']/g, character => ({
    '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
  })[character]);
}

function applyTheme(theme) {
  const isDark = theme === 'dark';
  document.documentElement.dataset.theme = isDark ? 'dark' : 'light';
  $('theme-icon').textContent = isDark ? '☼' : '☾';
  $('theme-toggle').setAttribute('aria-label', isDark ? '切换到浅色模式' : '切换到深色模式');
}

function initTheme() {
  const saved = storage.get(THEME_KEY);
  const prefersLight = window.matchMedia?.('(prefers-color-scheme: light)').matches;
  applyTheme(saved === 'dark' || saved === 'light' ? saved : (prefersLight ? 'light' : 'dark'));
  $('theme-toggle').addEventListener('click', () => {
    const next = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    storage.set(THEME_KEY, next);
  });
}

function renderFilters() {
  const group = $('category-filters');
  group.replaceChildren();
  for (const value of CATEGORIES) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'filter-chip' + (category === value ? ' active' : '');
    button.dataset.category = value;
    button.setAttribute('aria-pressed', String(category === value));
    button.textContent = value === 'all' ? '全部工具' : value === 'favorites' ? '☆ 我的收藏' : value;
    group.append(button);
  }
}

function toolCard(tool) {
  const isFavorite = favorites.has(tool.id);
  const action = isFavorite ? '取消收藏' : '收藏';
  return `<article class="glass tool-card">
    <div class="tool-head"><div class="tool-identity">
      <div class="tool-icon" aria-hidden="true">${escapeHtml(tool.icon)}</div>
      <div><h3 class="tool-title">${escapeHtml(tool.name)}</h3><div class="tool-domain">${escapeHtml(tool.domain)}</div></div>
    </div><button class="fav-btn ${isFavorite ? 'active' : ''}" type="button" data-fav="${escapeHtml(tool.id)}"
      aria-label="${action} ${escapeHtml(tool.name)}" aria-pressed="${isFavorite}" title="${action}">${isFavorite ? '★' : '☆'}</button></div>
    <p class="tool-desc">${escapeHtml(tool.desc)}</p>
    <div class="tool-bottom"><span class="tool-tag">${escapeHtml(tool.tag)}</span>
    <a class="tool-go" target="_blank" rel="noopener noreferrer" referrerpolicy="no-referrer"
      href="${escapeHtml(tool.url)}" aria-label="打开 ${escapeHtml(tool.name)} 的官方网站">打开工具 ↗</a></div>
  </article>`;
}

function renderTools(focusFavorite = '') {
  const matching = TOOLS.filter(tool =>
    (category === 'all' || category === tool.category || (category === 'favorites' && favorites.has(tool.id))) &&
    `${tool.name} ${tool.desc} ${tool.domain} ${tool.category} ${tool.tag}`.toLowerCase().includes(searchTerm)
  );
  const grid = $('tools-grid');
  grid.innerHTML = matching.map(toolCard).join('');
  $('visible-tool-count').textContent = String(matching.length).padStart(2, '0');
  $('empty-state').hidden = matching.length > 0;
  if (focusFavorite) {
    const target = Array.from(grid.querySelectorAll('[data-fav]'))
      .find(button => button.dataset.fav === focusFavorite);
    if (target) target.focus({ preventScroll: true });
  }
}

function initDirectory() {
  $('hero-tool-count').textContent = TOOLS.length;
  $('hero-category-count').textContent = CATEGORIES.length - 2;
  renderFilters();
  renderTools();

  $('category-filters').addEventListener('click', event => {
    const chip = event.target.closest('[data-category]');
    if (!chip) return;
    category = chip.dataset.category;
    renderFilters();
    renderTools();
    // Restore focus after the filter list is rerendered.
    $('category-filters').querySelector(`[data-category="${category}"]`)?.focus({ preventScroll: true });
  });
  $('tools-grid').addEventListener('click', event => {
    const button = event.target.closest('[data-fav]');
    if (!button) return;
    const id = button.dataset.fav;
    if (!ALL_TOOL_IDS.has(id)) return;
    if (favorites.has(id)) favorites.delete(id);
    else favorites.add(id);
    storage.set(STORAGE_KEY, JSON.stringify([...favorites]));
    renderTools(category === 'favorites' && !favorites.has(id) ? '' : id);
    if (category === 'favorites' && !favorites.has(id)) $('category-filters').querySelector('[data-category="favorites"]')?.focus({ preventScroll: true });
    toast(favorites.has(id) ? '已加入我的收藏' : '已取消收藏');
  });
  $('tool-search').addEventListener('input', event => {
    searchTerm = event.target.value.trim().toLocaleLowerCase();
    renderTools();
  });
  $('reset-filters').addEventListener('click', () => {
    category = 'all'; searchTerm = '';
    $('tool-search').value = '';
    renderFilters(); renderTools();
    $('tool-search').focus();
  });
  window.addEventListener('keydown', event => {
    if (event.metaKey || event.ctrlKey || event.altKey) return;
    const active = document.activeElement;
    if (event.key === '/' && !active.isContentEditable && !['INPUT', 'TEXTAREA', 'SELECT'].includes(active.tagName)) {
      event.preventDefault();
      $('tool-search').focus();
    }
    if (event.key === 'Escape' && active === $('tool-search')) active.blur();
  });
}

function initDevice() {
  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || '未提供';
  const offset = -new Date().getTimezoneOffset();
  $('metric-timezone').textContent = timezone;
  $('metric-language').textContent = navigator.language || '未提供';
  $('device-platform').textContent = navigator.userAgentData?.platform || navigator.platform || '浏览器未提供';
  $('device-screen').textContent = `${screen.width} × ${screen.height}`;
  $('device-secure').textContent = window.isSecureContext ? '安全上下文' : '非安全上下文';
  $('device-offset').textContent = `UTC${offset >= 0 ? '+' : '−'}${String(Math.floor(Math.abs(offset) / 60)).padStart(2, '0')}:${String(Math.abs(offset) % 60).padStart(2, '0')}`;
}

// URL() rejects malformed IPv6; plain numeric parsing enforces strict IPv4 octets.
function ipFamily(input) {
  if (typeof input !== 'string' || input.length > 45 || !input.length || input.trim() !== input) return null;
  if (/^\d+(\.\d+){3}$/.test(input)) {
    const octets = input.split('.');
    return octets.every(part => (part === '0' || !part.startsWith('0')) && Number(part) <= 255) ? 'IPv4' : null;
  }
  if (!/^[0-9a-fA-F:.]+$/.test(input) || !input.includes(':')) return null;
  try {
    new URL(`http://[${input}]/`);
    return 'IPv6';
  } catch {
    return null;
  }
}

function clean(value, maxLength = 100) {
  return typeof value === 'string' && value.trim() ? value.trim().slice(0, maxLength) : '';
}

async function fetchJson(url, timeoutMs = 6500) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const response = await fetch(url, {
      signal: controller.signal, cache: 'no-store', credentials: 'omit', referrerPolicy: 'no-referrer'
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    return await response.json();
  } finally {
    clearTimeout(timeout);
  }
}

function parseIPInfo(data, source) {
  if (!data || data.success === false || !ipFamily(data.ip)) throw new Error('无效 IP 数据');
  return {
    ip: data.ip,
    source,
    location: [clean(data.country, 48), clean(data.region, 48), clean(data.city, 48)].filter(Boolean).join(' · ') || '暂未提供',
    isp: clean(data.connection?.isp) || clean(data.connection?.org) || '暂未提供',
    asn: Number.isSafeInteger(Number(data.connection?.asn)) && Number(data.connection?.asn) > 0
      ? Number(data.connection.asn) : null
  };
}

async function lookupIP() {
  const button = $('scan-button');
  if (button.disabled) return;
  button.disabled = true;
  lastIP = '';
  $('copy-ip').disabled = true;
  $('scan-label').textContent = '正在检测…';
  $('ip-family').textContent = '查询中';
  $('ip-detail').textContent = '正在请求第三方接口（仅本次请求）';
  $('ip-value').textContent = '检测中…';
  $('metric-location').textContent = '—';
  $('metric-isp').textContent = '—';

  try {
    let result;
    try {
      result = parseIPInfo(await fetchJson(API.detail), 'ipwho.is');
    } catch {
      const data = await fetchJson(API.fallback);
      if (!ipFamily(data?.ip)) throw new Error('备用 API 返回无效结果');
      result = { ip: data.ip, source: 'ipify（备用，仅 IP）', location: '无定位数据', isp: '无运营商数据', asn: null };
    }
    lastIP = result.ip;
    $('ip-value').textContent = result.ip;
    $('ip-family').textContent = ipFamily(result.ip);
    $('ip-detail').textContent = `${result.source} · ${result.asn ? 'AS' + result.asn + ' · ' : ''}本次请求观测值`;
    $('metric-location').textContent = result.location;
    $('metric-isp').textContent = result.isp;
    $('copy-ip').disabled = false;
    toast('查询完成；建议对照另一检测站');
  } catch {
    $('ip-value').textContent = '查询失败';
    $('ip-family').textContent = '结果不可用';
    $('ip-detail').textContent = '可能是网络不通、API 限流或浏览器跨域限制。可使用下方独立检测站。';
    toast('接口不可用，可打开 IP.SB 或 IPCheck.ing');
  } finally {
    button.disabled = false;
    $('scan-label').textContent = '重新检测公网 IP';
  }
}

async function probeStack() {
  const button = $('stack-button');
  if (button.disabled) return;
  button.disabled = true;
  button.textContent = '正在检测…';
  $('ipv4-result').textContent = '查询中…';
  $('ipv6-result').textContent = '查询中…';
  const probes = [
    ['ipv4-result', API.ipv4, 'IPv4'],
    ['ipv6-result', API.ipv6, 'IPv6']
  ];
  try {
    await Promise.all(probes.map(async ([id, url, family]) => {
      try {
        const result = await fetchJson(url, 5500);
        $(id).textContent = ipFamily(result?.ip) === family ? result.ip : '接口返回无效数据';
      } catch {
        $(id).textContent = '本次查询失败 / 不可判定';
      }
    }));
  } finally {
    button.disabled = false;
    button.textContent = '重新检测 IPv4 / IPv6 ↗';
  }
}

async function lookupAddress(event) {
  event.preventDefault();
  const button = $('lookup-button');
  const input = $('lookup-input');
  const output = $('lookup-result');
  const address = input.value.trim();
  if (button.disabled) return;
  if (!ipFamily(address)) {
    output.textContent = '请输入格式正确的 IPv4 / IPv6 地址（不含端口、域名或 URL）。';
    input.setAttribute('aria-invalid', 'true');
    input.focus();
    return;
  }
  input.removeAttribute('aria-invalid');
  button.disabled = true;
  button.textContent = '查询中';
  output.textContent = '正在查询 IP 归属数据库…';
  try {
    const result = parseIPInfo(await fetchJson(API.detail + encodeURIComponent(address)), 'ipwho.is');
    output.textContent = `${result.ip} · ${result.location} · ${result.isp}${result.asn ? ` · AS${result.asn}` : ''}（数据库估计）`;
  } catch {
    output.textContent = '未获取到有效结果。该 IP 可能不被收录，或服务当前不可用。';
  } finally {
    button.disabled = false;
    button.textContent = '查询';
  }
}

async function copyIP() {
  if (!lastIP) return;
  try {
    await navigator.clipboard.writeText(lastIP);
    toast('已复制公网 IP');
  } catch {
    toast('无法自动复制，请长按或选中 IP 复制');
  }
}

function init() {
  initTheme();
  initDirectory();
  initDevice();
  $('scan-button').addEventListener('click', lookupIP);
  $('stack-button').addEventListener('click', probeStack);
  $('lookup-form').addEventListener('submit', lookupAddress);
  $('lookup-input').addEventListener('input', () => $('lookup-input').removeAttribute('aria-invalid'));
  $('copy-ip').addEventListener('click', copyIP);
}

document.addEventListener('DOMContentLoaded', init);
