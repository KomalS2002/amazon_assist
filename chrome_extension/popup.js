document.getElementById('identifyText').addEventListener('click', async () => {
    const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
    chrome.scripting.executeScript({
        target: { tabId: tab.id },
        function: identifyFromText
    });
});

function identifyFromText() {
    const textContent = document.body.innerText;

    const xhr = new XMLHttpRequest();
    xhr.open('POST', 'http://127.0.0.1:8000/assist/text');
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Accept', 'application/json');
    xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
    xhr.setRequestHeader('Access-Control-Allow-Headers', 'X-Requested-With');

    xhr.onload = function() {
        if (xhr.status >= 200 && xhr.status < 300) {
            alert(xhr.responseText);
        } else {
            const errorData = JSON.parse(xhr.responseText);
            alert(`Error: ${errorData.message}`);
        }
    };

    xhr.onerror = function() {
        alert('Request failed');
    };

    xhr.send(JSON.stringify({ text: textContent }));
}
