document.addEventListener('DOMContentLoaded', () => {
  const backendInput = document.getElementById('backend-url');
  const autoOpenInput = document.getElementById('auto-open');
  const enableInput = document.getElementById('enable-interception');
  const btnSave = document.getElementById('btn-save');
  const toast = document.getElementById('toast');

  chrome.storage.local.get(['backendUrl', 'autoOpenLowRisk', 'protectionEnabled'], (data) => {
    backendInput.value = data.backendUrl || 'http://localhost:3000';
    autoOpenInput.checked = data.autoOpenLowRisk ?? true;
    enableInput.checked = data.protectionEnabled ?? true;
  });

  btnSave.addEventListener('click', () => {
    let url = backendInput.value.trim();
    if (url.endsWith('/')) url = url.slice(0, -1);

    chrome.storage.local.set({
      backendUrl: url,
      autoOpenLowRisk: autoOpenInput.checked,
      protectionEnabled: enableInput.checked,
    }, () => {
      toast.style.display = 'block';
      setTimeout(() => { toast.style.display = 'none'; }, 2500);
    });
  });
});
