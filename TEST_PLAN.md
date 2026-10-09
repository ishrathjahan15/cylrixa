# Clyrixa — Test Plan & Verification Matrix

## Automated & Heuristic Verification Matrix

| Test Case | Input | Expected Outcome | Verification Status |
| :--- | :--- | :--- | :--- |
| **TC-01: Legitimate Developer Link** | `https://github.com/clyrixa/security` | `LOW_RISK` (Score < 20). No brand anomalies. Safe to open. | Verified |
| **TC-02: Subdomain Brand Spoofing** | `https://paypal.com.account-verify.tk/login` | `CRITICAL_RISK` (Score >= 80). Subdomain deception flagged. | Verified |
| **TC-03: Typosquatting & Suspicious TLD** | `https://paypa1-security-update.xyz/login?ref=urgent` | `HIGH_RISK` (Score >= 50). Typosquatting ("paypa1") detected. | Verified |
| **TC-04: URL Shortener Masking** | `https://bit.ly/3xSampleShortener` | `MODERATE_RISK` (Score 20-49). Redirect hop flagged. | Verified |
| **TC-05: Direct Numerical IP** | `http://185.193.66.45/login.php` | `HIGH_RISK`. Unencrypted HTTP + IP-as-host flagged. | Verified |
| **TC-06: Inconclusive Telemetry** | `https://unverified-host.biz` | `INCONCLUSIVE`. Never treated as safe. Warning triggered. | Verified |
| **TC-07: SSRF / Loopback Attempt** | `http://127.0.0.1:8080/admin` | `CRITICAL_RISK`. Blocked by SSRF boundary rule. | Verified |
| **TC-08: Urgent Banking SMS** | "SBI account blocked in 24 hours, update KYC at https://sbikyc.top" | Psychological Urgency: HIGH. Extracted URL scored independently. | Verified |
| **TC-09: Quishing Image Decode** | QR Code image encoding URL | Decoded purely on canvas client-side; passed to scanner. | Verified |
| **TC-10: Extension Click Interception** | Link click on external webpage | Intercepted in content script; low-risk proceeds; high-risk halts. | Verified |
