"""Optional smoke test. Requires: pip install playwright + Chromium.

This runner renders source in an isolated browser via set_content because its
purpose is DOM interactions and viewport layout, not live HTTP/CORS checks.
"""
from pathlib import Path
from playwright.sync_api import sync_playwright
import os

ROOT = Path(__file__).resolve().parent.parent
html = (ROOT / 'index.html').read_text()
html = html.replace('<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; script-src \'self\'; style-src \'self\'; img-src \'self\' data:; connect-src https://ipwho.is https://api64.ipify.org https://api.ipify.org https://api6.ipify.org; font-src \'self\'; base-uri \'none\'; form-action \'none\'; object-src \'none\'; upgrade-insecure-requests">', '')
html = html.replace('<link rel="stylesheet" href="assets/style.css">', '').replace('<script defer src="assets/app.js"></script>', '')
css = (ROOT / 'assets/style.css').read_text()
js = (ROOT / 'assets/app.js').read_text()

def check(condition, msg):
    if not condition: raise AssertionError(msg)

with sync_playwright() as pw:
    browser_kwargs = {'headless': True, 'args': ['--no-sandbox']}
    if Path('/usr/bin/chromium').exists():
        browser_kwargs['executable_path'] = '/usr/bin/chromium'
    browser = pw.chromium.launch(**browser_kwargs)
    passed = []
    for width, height in [(1440, 900), (768, 1024), (390, 844), (320, 700)]:
        print('checking viewport',width,flush=True)
        page = browser.new_page(viewport={'width':width,'height':height})
        errors=[]
        page.on('pageerror', lambda err: errors.append(str(err)))
        page.set_content(html, wait_until='domcontentloaded')
        page.add_style_tag(content=css)
        page.evaluate('''window.__calls=[]; window.fetch=async (url)=>{
            window.__calls.push(url);
            let data;
            if(url === 'https://ipwho.is/') data = {success:true,ip:'23.12.34.56',country:'United States',city:'California',connection:{isp:'Demo ISP',asn:12345}};
            else if(url === 'https://api.ipify.org?format=json') data={ip:'23.12.34.56'};
            else if(url === 'https://api6.ipify.org?format=json') data={ip:'2001:4860:4860::8888'};
            else if(String(url).includes('/1.1.1.1')) data={success:true,ip:'1.1.1.1',country:'Australia',connection:{isp:'Cloudflare',asn:13335}};
            else throw new Error('Mock route missing ' + url);
            return {ok:true, json:async()=>data};
          }; true;''')
        page.add_script_tag(content=js)
        page.evaluate('document.dispatchEvent(new Event("DOMContentLoaded"))')
        check(page.locator('.tool-card').count() == 26, f'{width}: cards')
        check(len(page.evaluate('window.__calls')) == 0, f'{width}: unexpected automatic API')
        check(page.evaluate('document.body.scrollWidth') <= width+1, f'{width}: horizontal overflow')
        check(not page.locator('#empty-state').is_visible(), f'{width}: empty state initially visible')
        if os.getenv('ANDYIPTEST_SCREENSHOT') == '1' and width in [1440, 390]:
            page.screenshot(path=str(ROOT.parent / f'after-{width}.png'), full_page=False)
        search = page.locator('#tool-search')
        search.fill('no-match-string')
        check(page.locator('.tool-card').count() == 0, f'{width}: search no match')
        check(page.locator('#empty-state').is_visible(), f'{width}: empty state hidden')
        page.locator('#reset-filters').click()
        check(page.locator('.tool-card').count()==26, f'{width}: reset filters')
        page.locator('[data-fav="ip-sb"]').click()
        check(page.locator('[data-fav="ip-sb"]').get_attribute('aria-pressed')=='true', f'{width}: favorites')
        page.locator('[data-category="favorites"]').click()
        check(page.locator('.tool-card').count()==1, f'{width}: favorites filter')
        page.locator('[data-category="all"]').click()
        page.locator('#scan-button').click()
        page.wait_for_function("document.querySelector('#ip-value').textContent==='23.12.34.56'")
        check(page.locator('#copy-ip').is_enabled(), f'{width}: copy enabled')
        page.locator('#stack-button').click()
        page.wait_for_function("document.querySelector('#ipv6-result').textContent.includes('2001:4860')")
        page.locator('#lookup-input').fill('bogus!')
        page.locator('#lookup-button').click()
        check(page.locator('#lookup-input').get_attribute('aria-invalid')=='true', f'{width}: invalid lookup')
        page.locator('#lookup-input').fill('1.1.1.1')
        page.locator('#lookup-button').click()
        page.wait_for_function("document.querySelector('#lookup-result').textContent.includes('Australia')")
        check(not errors, f'{width}: Javascript errors: {errors}')
        passed.append(f'{width} x {height}: 26 cards, search, empty, favorite, API mock, dual-stack, lookup, layout')
        page.close()
    browser.close()
    for item in passed: print('PASS',item)
    print(f'{len(passed)} browser viewport suites passed')
