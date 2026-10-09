# Clyrixa — Security Architecture & Threat Model

## 1. Threat Vectors Addressed
1. **Brand Impersonation & Typosquatting**:
   - Swapping visually similar characters (e.g., `paypa1`, `micros0ft`).
   - Keyword stuffing (e.g., `paypal-security-update.xyz`).
   - Subdomain deception (e.g., `paypal.com.account-verify.tk`).
2. **Punycode / IDN Homoglyphs**:
   - Cyrillic lookalikes (`xn--pypal-43a.com` where Cyrillic "а" replaces Latin "a").
3. **URL Shortener Masking**:
   - Bitly, tinyurl, t.co, is.gd hiding real phishing landing points.
4. **Quishing (Malicious QR Codes)**:
   - Physical or email QR codes hiding malicious URLs from desktop text filters.
5. **Psychological Coercion**:
   - SMS/Email messages threatening immediate account suspension, power disconnection, or promising lottery prizes.

---

## 2. Server-Side URL-Fetching & SSRF Protection
To prevent server-side request forgery (SSRF) and private network exploitation:
- **Direct Fetch Isolation**: The Clyrixa server does NOT perform arbitrary unconstrained HTTP proxy fetches of untrusted destinations.
- **Reserved IP Blocking**: Internal loopback (`127.0.0.0/8`), private subnets (`10.0.0.0/8`, `172.16.0.0/12`, `192.168.0.0/16`), AWS metadata (`169.254.169.254`), and IPv6 loopbacks (`::1`) are immediately flagged and blocked.
- **Protocol Restriction**: Only `http:` and `https:` schemes are parsed; `file:`, `data:`, `javascript:` schemes are rejected.

---

## 3. Privacy & Data Handling
- **No Keystroke Tracking**: The extension inspects only the target hyperlink on click; form keystrokes, passwords, and page contents are never logged.
- **Query Parameter Redaction**: Sensitive tokens (e.g., `?token=...`, `?otp=...`, `?password=...`) are stripped from scan history.
- **Consent-Controlled External Transmission**: External threat intelligence queries require explicit toggle or opt-in.
