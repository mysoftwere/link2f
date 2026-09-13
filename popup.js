document.getElementById('convertBtn').addEventListener('click', () => {
  const input = document.getElementById('inputLink').value.trim();
  const domainInput = document.getElementById('domainInput').value.trim();
  const prefixInput = document.getElementById('prefixInput').value.trim();
  const outputEl = document.getElementById('outputLink');
  
  if (!input) {
    outputEl.value = '';
    return;
  }

  // Clean up domain input if it has a trailing slash
  let newDomain = domainInput;
  if (newDomain && newDomain.endsWith('/')) {
    newDomain = newDomain.slice(0, -1);
  }

  const lines = input.split('\n');
  const results = [];

  for (let line of lines) {
    line = line.trim();
    if (!line) {
      results.push(''); 
      continue;
    }

    try {
      const url = new URL(line);
      const filename = url.pathname.substring(url.pathname.lastIndexOf('/') + 1);
      
      if (prefixInput) {
        // Strategy 2B: Exact Prefix provided
        results.push(prefixInput + filename + url.search + url.hash);
      } else {
        // Strategy 2A or Default: Replace domain (if provided) and convert path slashes
        const pathAfterFirstSlash = url.pathname.substring(1).replace(/\//g, '%2F');
        const baseToUse = newDomain ? newDomain : url.origin;
        results.push(baseToUse + '/' + pathAfterFirstSlash + url.search + url.hash);
      }
    } catch (e) {
      // Fallback
      if (prefixInput) {
        const parts = line.split('/');
        const filename = parts[parts.length - 1];
        results.push(prefixInput + filename);
      } else {
        results.push(line.replace(/\//g, '%2F'));
      }
    }
  }

  outputEl.value = results.join('\n');
});

document.getElementById('copyBtn').addEventListener('click', () => {
  const output = document.getElementById('outputLink');
  if (output.value) {
    output.select();
    document.execCommand('copy');
    
    // Briefly change button text to indicate success
    const btn = document.getElementById('copyBtn');
    const originalText = btn.innerText;
    btn.innerText = 'Copied All!';
    setTimeout(() => {
      btn.innerText = originalText;
    }, 1500);
  }
});
