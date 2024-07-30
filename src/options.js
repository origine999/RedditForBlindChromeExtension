function initializeOptions() {
    // Load saved settings
    chrome.storage.sync.get(['linkOption'], (result) => {
      if (result.linkOption === 'replace') {
        document.getElementById('replaceLinks').checked = true;
      } else {
        document.getElementById('addLinks').checked = true;
      }
    });
  
    // Save settings
    document.getElementById('saveButton').addEventListener('click', () => {
      const linkOption = document.querySelector('input[name="linkOption"]:checked').value;
      chrome.storage.sync.set({ linkOption }, () => {
        const alertContainer = document.getElementById('alertContainer');
    alertContainer.textContent = 'Settings saved';
    alertContainer.style.display = 'block';
    setTimeout(() => {
      alertContainer.style.display = 'none';
    }, 3000);
      });
    });
  }
  
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeOptions);
  } else {
    initializeOptions();
  }