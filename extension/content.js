/**
 * Clyrixa Content Script — Pre-Navigation Link Interceptor (Manifest V3)
 */

(function () {
  // Prevent duplicate script injection
  if (window.__CLYRIXA_INTERCEPTOR_ACTIVE) return;
  window.__CLYRIXA_INTERCEPTOR_ACTIVE = true;

  let currentIndicator = null;

  function showScanningIndicator(targetUrl) {
    removeScanningIndicator();

    const container = document.createElement('div');
    container.id = 'clyrixa-scan-overlay';
    container.style.cssText = `
      position: fixed;
      bottom: 24px;
      right: 24px;
      z-index: 2147483647;
      background: #0B1F30;
      color: #F2F7FC;
      border: 1px solid #28D7E5;
      border-radius: 8px;
      padding: 12px 16px;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
      font-size: 13px;
      box-shadow: 0 10px 25px rgba(0,0,0,0.5);
      display: flex;
      align-items: center;
      gap: 10px;
      pointer-events: none;
      animation: clyrixaFadeIn 0.2s ease-out;
    `;

    container.innerHTML = `
      <div style="width: 14px; height: 14px; border: 2px solid #28D7E5; border-top-color: transparent; border-radius: 50%; animation: clyrixaSpin 0.8s linear infinite;"></div>
      <div>
        <strong style="color: #28D7E5; display: block; font-size: 12px; margin-bottom: 2px;">CLYRIXA SHIELD</strong>
        <span>Analyzing destination safety...</span>
      </div>
    `;

    // Add keyframes if not present
    if (!document.getElementById('clyrixa-styles')) {
      const style = document.createElement('style');
      style.id = 'clyrixa-styles';
      style.textContent = `
        @keyframes clyrixaSpin { to { transform: rotate(360deg); } }
        @keyframes clyrixaFadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
      `;
      document.head.appendChild(style);
    }

    document.body.appendChild(container);
    currentIndicator = container;
  }

  function removeScanningIndicator() {
    if (currentIndicator && currentIndicator.parentNode) {
      currentIndicator.parentNode.removeChild(currentIndicator);
      currentIndicator = null;
    }
  }

  // Intercept click events on links
  document.addEventListener('click', async (event) => {
    // Traverse up to find closest <a> tag
    const anchor = event.target.closest('a');
    if (!anchor || !anchor.href) return;

    const href = anchor.href;

    // Ignore non-navigation links
    if (
      href.startsWith('javascript:') ||
      href.startsWith('mailto:') ||
      href.startsWith('tel:') ||
      href.startsWith('#') ||
      href.includes('clyrixa') ||
      href.includes('warning.html')
    ) {
      return;
    }

    let parsedDest;
    try {
      parsedDest = new URL(href);
    } catch {
      return; // Malformed, let browser handle
    }

    // Only inspect HTTP/HTTPS external links
    if (parsedDest.protocol !== 'http:' && parsedDest.protocol !== 'https:') return;

    // Same-origin clicks usually benign, but if target host differs, intercept
    const currentHost = window.location.hostname.toLowerCase();
    const destHost = parsedDest.hostname.toLowerCase();
    const isSameHost = currentHost === destHost;

    if (isSameHost && !parsedDest.pathname.includes('/redirect')) {
      return; // Let standard internal navigation proceed instantly
    }

    // Prevent default navigation while Clyrixa checks the link
    event.preventDefault();
    event.stopPropagation();

    showScanningIndicator(href);

    const isNewTab = anchor.target === '_blank' || event.ctrlKey || event.metaKey;

    try {
      chrome.runtime.sendMessage({ type: 'CHECK_LINK', url: href }, (response) => {
        removeScanningIndicator();

        if (!response) {
          // Timeout or error: open warning interstitial with inconclusive state
          navigateToWarning(href, { status: 'INCONCLUSIVE', error: 'Scan timed out' }, isNewTab);
          return;
        }

        const status = response.status || 'INCONCLUSIVE';

        if (status === 'LOW_RISK') {
          // Policy: low risk automatically proceeds to target
          if (isNewTab) {
            window.open(href, '_blank', 'noopener,noreferrer');
          } else {
            window.location.href = href;
          }
        } else {
          // Policy: moderate, high, critical, or inconclusive triggers warning page
          navigateToWarning(href, response, isNewTab);
        }
      });
    } catch (err) {
      removeScanningIndicator();
      console.warn('[Clyrixa] Message sending error:', err);
      window.location.href = href;
    }
  }, true);

  function navigateToWarning(targetUrl, scanData, isNewTab) {
    const warningUrl = chrome.runtime.getURL('warning.html') +
      `?url=${encodeURIComponent(targetUrl)}` +
      `&data=${encodeURIComponent(JSON.stringify(scanData))}`;

    if (isNewTab) {
      window.open(warningUrl, '_blank');
    } else {
      window.location.href = warningUrl;
    }
  }
})();
