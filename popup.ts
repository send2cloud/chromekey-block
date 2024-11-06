interface KeywordPair {
  keyword: string;
  redirectUrl: string;
}

let pairs: KeywordPair[] = [];

document.addEventListener('DOMContentLoaded', async () => {
  const result = await chrome.storage.sync.get('keywordPairs');
  pairs = result.keywordPairs || [];
  renderPairs();

  document.getElementById('addPair')?.addEventListener('click', addNewPair);
  document.getElementById('save')?.addEventListener('click', saveSettings);
});

function renderPairs() {
  const container = document.getElementById('pairs');
  if (!container) return;

  container.innerHTML = '';
  pairs.forEach((pair, index) => {
    const div = document.createElement('div');
    div.className = 'pair';
    div.innerHTML = `
      <input type="text" placeholder="Keyword" value="${pair.keyword}" data-index="${index}" class="keyword">
      <input type="text" placeholder="Redirect URL" value="${pair.redirectUrl}" data-index="${index}" class="redirect">
      <button onclick="removePair(${index})">X</button>
    `;
    container.appendChild(div);
  });
}

function addNewPair() {
  pairs.push({ keyword: '', redirectUrl: '' });
  renderPairs();
}

function removePair(index: number) {
  pairs.splice(index, 1);
  renderPairs();
}

async function saveSettings() {
  const keywordInputs = document.querySelectorAll('.keyword') as NodeListOf<HTMLInputElement>;
  const redirectInputs = document.querySelectorAll('.redirect') as NodeListOf<HTMLInputElement>;

  pairs = Array.from(keywordInputs).map((input, index) => ({
    keyword: input.value.trim(),
    redirectUrl: redirectInputs[index].value.trim()
  })).filter(pair => pair.keyword && pair.redirectUrl);

  await chrome.storage.sync.set({ keywordPairs: pairs });
  alert('Settings saved!');
}