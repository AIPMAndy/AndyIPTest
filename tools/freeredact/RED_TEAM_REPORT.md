# RED_TEAM_REPORT — FreeRedact v0.2
2026-10-31. Builder and reviewer phases were separated within one assistant; NOT independent autonomous agents.

| Finding | Severity | Evidence | Status |
|---|---|---|---|
| FR01 Cancel move with Esc leaves moved mask | High | Chromium fixture before FAIL | FIXED / PASS |
| FR02 pointercancel commits moved mask | High | Chromium fixture before FAIL | FIXED / PASS |
| FR03 OCR from replaced image leaks suggestions into new image | High | Delayed Promise fixture FAIL | FIXED / PASS |
| FR04 Old image decode overwrites newer image | High | Delayed bitmap fixture FAIL | FIXED / PASS |
| FR05 Old async export completes after image change | High | Delayed toBlob fixture FAIL | FIXED / PASS |
| FR06 Original filename may contain personal data | Low | Direct source review | FIXED: generic filename |
| FR07 Browser TextDetector absent/false negatives | High | Experimental API only | OPEN / manual covers |
| FR08 Mobile OOM and keyboard accessibility | Medium | No quantitative data | OPEN |
| FR09 Real HTTP/CSP and production clipboard path | High release gate | Local navigation blocked | OPEN |

Offline regression old 1/6 → candidate 6/6, 5/5 existing unit tests, 0 observed JS errors in tested fixture contexts. Not representative real-world security effectiveness. Separate human review, CI real navigation, mobile and privacy-leak testing still required. Judge: conditional code-review pass; release NOT approved.
