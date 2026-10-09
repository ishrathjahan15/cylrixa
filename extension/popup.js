document.addEventListener('DOMContentLoaded', () => {
  const toggle = document.getElementById('protection-toggle');
  const statusDot = document.getElementById('status-dot');
  const statusText = document.getElementById('status-text');
  const urlInput = document.getElementById('url-input');
  const scanBtn = document.getElementById('scan-btn');
  const quickResult = document.getElementById('quick-result');
  const statScanned = document.getElementById('stat-scanned');
  const statBlocked = document.getElementById('stat-blocked');
  const openDashboardBtn = document.getElementById('open-dashboard-btn');
  const openOptionsBtn = document.getElementById('open-options-btn');

  // Load current state
  chrome.storage.local.get(['protectionEnabled', 'backendUrl', 'statsScanned', 'statsBlocked'], (data) => {
    const isEnabled = data.protectionEnabled ?? true;
    toggle.checked = isEnabled;
    updateStatusDisplay(isEnabled);

    statScanned.textContent = data.statsScanned || 0;
    statBlocked.textContent = data.statsBlocked || 0;
  });

  toggle.addEventListener('change', () => {
    const isEnabled = toggle.checked;
    chrome.storage.local.set({ protectionEnabled: isEnabled }, () => {
      updateStatusDisplay(isEnabled);
    });
  });

  function updateStatusDisplay(isEnabled) {
    if (isEnabled) {
      statusDot.className = 'status-dot active';
      statusText.textContent = 'Active';
    } else {
      statusDot.className = 'status-dot inactive';
      statusText.textContent = 'Paused';
    }
  }

  // Quick URL check
  scanBtn.addEventListener('click', async () => {
    const url = urlInput.value.trim();
    if (!url) return;

    scanBtn.disabled = true;
    scanBtn.textContent = '...';
    quickResult.className = 'quick-result hidden';

    chrome.runtime.sendMessage({ type: 'CHECK_LINK', url }, (res) => {
      scanBtn.disabled = false;
      scanBtn.textContent = 'Scan';

      if (!res) {
        quickResult.className = 'quick-result danger';
        quickResult.textContent = 'Unable to reach backend scanner.';
        return;
      }

      if (res.status === 'LOW_RISK') {
        quickResult.className = 'quick-result low';
        quickResult.textContent = `Clean: ${res.riskScore}/100. No threats detected.`;
      } else {
        quickResult.className = 'quick-result danger';
        quickResult.textContent = `Alert: ${res.status} (${res.riskScore}/100)`;
      }
    });
  });

  openDashboardBtn.addEventListener('click', () => {
    chrome.storage.local.get(['backendUrl'], (data) => {
      const url = data.backendUrl || 'http://localhost:3000';
      chrome.tabs.create({ url });
    });
  });

  openOptionsBtn.addEventListener('click', () => {
    chrome.runtime.openOptionsPage();
  });
});
