document.addEventListener('DOMContentLoaded', async () => {
  const input = document.getElementById('urlInput');
  const frame = document.getElementById('viewer');
  const { lastUrl } = await chrome.storage.local.get({ lastUrl: 'https://www.notion.so/kmle/note-208b35c8bd6580b9a097c311507b129e' });
  input.value = lastUrl;
  frame.src = lastUrl;

  input.addEventListener('change', () => {
    const url = input.value.trim();
    frame.src = url;
    chrome.storage.local.set({ lastUrl: url });
  });
});
