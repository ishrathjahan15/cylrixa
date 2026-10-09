document.addEventListener('DOMContentLoaded', () => {
  const urlParams = new URLSearchParams(window.location.search);
  const targetUrl = urlParams.get('url') || 'Unknown URL';
  let scanData = {};

  try {
    const rawData = urlParams.get('data');
    if (rawData) {
      scanData = JSON.parse(rawData);
    }
  } catch (e) {
    console.error('Failed parsing scan data', e);
  }

  const targetUrlEl = document.getElementById('target-url');
  const riskScoreEl = document.getElementById('risk-score');
  const meterFillEl = document.getElementById('meter-fill');
  const statusPillEl = document.getElementById('status-pill');
  const headlineEl = document.getElementById('headline');
  const alertTypeEl = document.getElementById('alert-type');
  const findingsListEl = document.getElementById('findings-list');
  const brandAlertEl = document.getElementById('brand-alert');
  const brandTitleEl = document.getElementById('brand-title');
  const brandDescEl = document.getElementById('brand-desc');
  const consequenceTextEl = document.getElementById('consequence-text');
  const btnBack = document.getElementById('btn-back');
  const btnInspect = document.getElementById('btn-inspect');
  const overrideToggle = document.getElementById('override-toggle');
  const overridePanel = document.getElementById('override-panel');
  const btnOverrideConfirm = document.getElementById('btn-override-confirm');

  targetUrlEl.textContent = targetUrl;

  const score = scanData.riskScore ?? 85;
  const status = scanData.status || 'HIGH_RISK';

  riskScoreEl.textContent = `${score}/100`;
  meterFillEl.style.width = `${Math.min(100, Math.max(5, score))}%`;
  statusPillEl.textContent = status.replace('_', ' ');

  if (status === 'MODERATE_RISK') {
    headlineEl.textContent = 'Suspicious Destination Warning';
    alertTypeEl.textContent = 'MODERATE RISK DETECTED';
    alertTypeEl.style.color = '#F6C453';
    statusPillEl.style.color = '#F6C453';
    meterFillEl.style.background = '#F6C453';
  } else if (status === 'INCONCLUSIVE') {
    headlineEl.textContent = 'Unverified Destination';
    alertTypeEl.textContent = 'SCAN INCONCLUSIVE';
    alertTypeEl.style.color = '#9BAABD';
    statusPillEl.style.color = '#9BAABD';
    meterFillEl.style.background = '#9BAABD';
    consequenceTextEl.textContent = 'Clyrixa was unable to verify this destination against threat intelligence. Exercise caution.';
  }

  // Brand comparison
  if (scanData.brandComparison) {
    brandAlertEl.classList.remove('hidden');
    brandTitleEl.textContent = `Impersonation Warning: ${scanData.brandComparison.detectedBrand}`;
    brandDescEl.textContent = scanData.brandComparison.explanation;
  }

  // Findings
  if (scanData.findings && scanData.findings.length > 0) {
    findingsListEl.innerHTML = '';
    scanData.findings.forEach(f => {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${f.title}</strong><br><span style="color:#A8BBCB;">${f.observation}</span>`;
      findingsListEl.appendChild(li);
    });
  } else {
    findingsListEl.innerHTML = '<li>Structural heuristics or unverified domain flags detected.</li>';
  }

  // Consequences
  if (scanData.aiExplanation?.consequences?.length) {
    consequenceTextEl.textContent = scanData.aiExplanation.consequences.join(' ');
  }

  // Handlers
  btnBack.addEventListener('click', () => {
    if (window.history.length > 1) {
      window.history.back();
    } else {
      window.close();
    }
  });

  btnInspect.addEventListener('click', () => {
    chrome.storage.local.get(['backendUrl'], (data) => {
      const backend = data.backendUrl || 'http://localhost:3000';
      const inspectUrl = `${backend}/?inspect=${encodeURIComponent(targetUrl)}`;
      chrome.tabs.create({ url: inspectUrl });
    });
  });

  overrideToggle.addEventListener('click', () => {
    overridePanel.classList.toggle('hidden');
  });

  btnOverrideConfirm.addEventListener('click', () => {
    if (confirm('Are you absolutely sure you want to proceed to this potentially dangerous link? Clyrixa cannot protect you once you proceed.')) {
      window.location.href = targetUrl;
    }
  });
});
