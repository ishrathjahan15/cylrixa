# Clyrixa Browser Extension (Manifest V3)

> **Click Before You Trust.** Context-aware link inspection and pre-navigation defense.

---

## 1. Overview
The Clyrixa extension intercepts user clicks on ordinary external HTTP/HTTPS hyperlinks before the browser navigates to the destination. It sends a lightweight inquiry to the Clyrixa risk assessment engine (`/api/scan`).

- **Low Risk (`LOW_RISK`)**: The extension verifies no threats were found and seamlessly allows navigation to proceed immediately.
- **Moderate Risk (`MODERATE_RISK`)**: Pauses navigation and shows an explanatory confirmation interstitial.
- **High / Critical Risk (`HIGH_RISK` / `CRITICAL_RISK`)**: Halts automatic navigation and routes to the security warning interstitial (`warning.html`) displaying the observed evidence, brand impersonation mismatches, and safe retreat options.
- **Inconclusive (`INCONCLUSIVE`)**: Never treats missing data as safe; warns the user that the destination could not be verified.

---

## 2. Installation Instructions (Chrome & Microsoft Edge)

### For Google Chrome & Brave:
1. Open Google Chrome.
2. In the address bar, navigate to: `chrome://extensions`
3. In the top-right corner, enable the **Developer mode** toggle.
4. Click the **Load unpacked** button that appears in the top-left toolbar.
5. In the file picker dialog, select the `extension` folder located inside the Clyrixa project directory.
6. The **Clyrixa — Real-Time Link Protection** extension will now be active in your browser.
7. Click the extensions puzzle icon in your browser toolbar and pin Clyrixa for quick access.

### For Microsoft Edge:
1. Open Microsoft Edge.
2. In the address bar, navigate to: `edge://extensions`
3. In the left navigation sidebar, toggle on **Developer mode**.
4. Click **Load unpacked**.
5. Select the `extension` folder from this repository.

---

## 3. Configuration & Connectivity
By default, the extension connects to `http://localhost:3000` (or your deployed Cloud Run URL).
To configure or test against a remote server:
1. Click the Clyrixa extension icon in your browser toolbar.
2. Click **Settings** (or right-click the icon and choose **Options**).
3. Update the **Clyrixa Server Endpoint** field to your active deployment URL.
4. Click **Save Settings**.

---

## 4. Permissions & Privacy Notice
- `storage`: Used solely to store your extension preferences (e.g. backend URL, protection toggle) and session metrics locally on your device.
- `activeTab`: Used to display the in-page scanning indicator pill without reading sensitive page contents.
- `host_permissions: ["<all_urls>"]`: Required so the content script can intercept external clicks across websites you visit.
- **Privacy Commitment**: Clyrixa never records passwords, form keystrokes, personal messages, or private tokens. Only the destination URL of clicked links is analyzed.
