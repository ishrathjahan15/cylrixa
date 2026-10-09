# CLYRIXA — Click Before You Trust

### Context-Aware Phishing Detection, Real-Time Link Protection & Cyber Safety Platform
**Track 02 — Cyber Security: Phishing & Malicious Link Detection**

---

## 1. Product Overview
Users frequently encounter deceptive links through emails, SMS, messaging applications, and social media. Distinguishing authentic web destinations from lookalikes, credential-harvesting portals, and malware distribution points is difficult for ordinary users.

**Clyrixa** provides an end-to-end cyber safety platform connecting four essential stages:
**DETECT → EXPLAIN → PROTECT → RECOVER**

- **Detect**: Deterministic structural analysis, punycode Cyrillic homoglyph checks, brand impersonation and typosquatting recognition, URL shortening inspection, and multi-source threat intelligence connectors.
- **Explain**: Grounded server-side Gemini AI explaining evidence in plain language, detailing realistic consequences, and supporting **English**, **Telugu (తెలుగు)**, and **Hindi (हिन्दी)**.
- **Protect**: Full Chromium Manifest V3 browser extension intercepting external HTTP/HTTPS clicks before navigation, halting malicious destinations while automatically continuing low-risk clicks.
- **Recover**: Incident triage assistant guiding victims through immediate containment steps and official emergency cyber reporting channels (e.g. 1930 / cybercrime.gov.in).

---

## 2. Architecture & Tech Stack
- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide icons, client-side QR decoder (`jsqr`).
- **Backend**: Node.js & Express server-side runtime, SSRF isolation checks, sliding-window rate limiting, privacy-preserving URL query sanitization.
- **AI Intelligence**: `@google/genai` TypeScript SDK with `gemini-3.8-flash` on server only (with deterministic offline fallbacks).
- **Extension**: Chromium Manifest V3 in `/extension` with background service worker, in-page click interceptor content script, popup dashboard, options page, and security warning interstitial (`warning.html`).

---

## 3. Threat Intelligence Providers & Truth in Reporting
Unlike platforms that fabricate scan counters or pretend unconfigured engines ran:
- **Google Safe Browsing**: Official v4 API when configured; otherwise displays `not_configured` with direct manual lookup links.
- **VirusTotal**: Official v3 URL analysis when configured; otherwise provides direct lookup portal.
- **urlscan.io, PhishTank, Cisco Talos, Trend Micro, URLVoid**: Verified statuses and official lookup links.
- **Local Engine**: Always active, providing deterministic scoring regardless of external network availability.

---

## 4. How to Run Locally

### Start Dev Server (Vite + Express):
```bash
npm install
npm run dev
```
The server will boot on `http://localhost:3000` with the Vite dev server mounted.


## 5. Live Website

visit our website :
https://clyrixa-real-time-phishing-malicious-link-pr-w7tl-43845123665.asia-southeast1.run.app


### Testing the Browser Extension:
1. Open Google Chrome or Microsoft Edge.
2. Go to `chrome://extensions` or `edge://extensions`.
3. Enable **Developer mode**.
4. Click **Load unpacked** and select the `/extension` directory.
