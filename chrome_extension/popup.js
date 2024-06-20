document.getElementById('identifyText').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
      target: { tabId: tab.id },
      function: identifyFromText
    });
});

async function identifyFromText() {
    const textContent = document.body.innerText;
    const response = await fetch('http://127.0.0.1:8000/assist/text', {
      method: 'POST',
      mode: 'no-cors',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'X-Requested-With'
    },
      body: JSON.stringify({ "text": textContent })
    });

    if (!response.ok) {
      const errorData = await response.json();
      alert(`Error: ${errorData.message}`);
      return;
    }

    const data = await response.json();
    alert(JSON.stringify(data));
}
