# PRODUCT_SCORECARD — FreeRedact v0.2 PR candidate
2026-10-31. No world ranking or synthetic overall quality score.

Weights: core correctness 30%, privacy & reliability 30%, UX/accessibility 20%, performance 10%, maintainability 10%.

Baseline code: v0.1.0, commit 12f3a5b. Candidate v0.2 unmerged branch.
Reproduction: Node 22.16, Python 3.13.5, headless Chromium, 960×610 fictional image, one mask; offline fixture via Playwright page.set_content because local HTTP/file navigation blocked by runner.

| Targeted assertion | Baseline | Candidate |
|---|---|---|
| Escape rollback | FAIL | PASS |
| pointercancel rollback | FAIL | PASS |
| Flattened opaque mask PNG | PASS | PASS |
| Reject old OCR after image swap | FAIL | PASS |
| Reject old image decode | FAIL | PASS |
| Reject old in-progress export | FAIL | PASS |
| Detector tests | 5/5 | 5/5 |

**1/6 → 6/6 targeted browser assertions**, not a field success rate. P50/P95 export timing on 30 runs had high variance between runs, so no speed improvement claimed. Actual HTTP/CSP, mobile device and memory benchmarks remain unverified.

Run: `npm test && npm run check && python tests/offline_browser_regression.py`; full HTTP smoke: `python tests/browser_smoke.py`. Python playwright, Pillow and Chromium required.

Verdict: conditional code-review pass; NO release approval.
