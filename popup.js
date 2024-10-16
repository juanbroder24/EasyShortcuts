document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('customLinksForm');
  const link1Url = document.getElementById('link1Url');
  const link1Text = document.getElementById('link1Text');
  const link2Url = document.getElementById('link2Url');
  const link2Text = document.getElementById('link2Text');

  // Cargar las opciones guardadas
  chrome.storage.sync.get(['customLink1', 'customLink2'], (result) => {
    if (result.customLink1) {
      link1Url.value = result.customLink1.url;
      link1Text.value = result.customLink1.text;
    }
    if (result.customLink2) {
      link2Url.value = result.customLink2.url;
      link2Text.value = result.customLink2.text;
    }
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const newCustomLinks = {
      customLink1: { url: link1Url.value, text: link1Text.value },
      customLink2: { url: link2Url.value, text: link2Text.value }
    };
    chrome.runtime.sendMessage({ 
      action: "updateCustomLinks", 
      customLinks: newCustomLinks 
    }, () => {
      window.close();
    });
  });
});