chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === "check_youtube") {
    if (window.location.host.includes("youtube.com")) {
      const video = document.querySelector('video');
      if (video) {
        const videoUrl = window.location.href;
        alert(videoUrl);
        video.addEventListener('pause', async () => {
          
          console.log("Video URL:", videoUrl);  // Debugging line

          // Function to send video URL to the backend
          async function sendVideoUrl(url, endpoint) {
            const payload = { text: url }; // Payload for /assist/text endpoint
            try {
              const response = await fetch(`http://127.0.0.1:8000${endpoint}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
              });
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
              }
              return await response.json();
            } catch (error) {
              console.error(`Error sending video URL to ${endpoint}:`, error);
              return null;
            }
          }

          const data = await sendVideoUrl(videoUrl, '/assist/text');
          if (data) {
            showResultsPopup(data);
          }

          const button = document.createElement('button');
          button.innerText = "Identify Product";
          button.style.position = "fixed";
          button.style.top = "10px";
          button.style.right = "10px";
          button.style.zIndex = 1000;
          document.body.appendChild(button);

          button.addEventListener('click', async () => {
            const screenshot = await captureScreenshot();
            try {
              const response = await fetch('http://127.0.0.1:8000/assist/image/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: screenshot })
              });
              if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status} - ${response.statusText}`);
              }
              const data = await response.json();
              showResultsPopup(data);
              button.remove();
            } catch (error) {
              console.error("Error sending screenshot:", error);
            }
          });
        }, { once: true });
      } else {
        alert("Please play a video on YouTube to identify products in the video.");
      }
    } else {
      alert("Please play a video on YouTube to identify products in the video.");
    }
  }
});

async function captureScreenshot() {
  return new Promise((resolve, reject) => {
    chrome.tabs.captureVisibleTab(null, {}, (dataUrl) => {
      if (dataUrl) {
        resolve(dataUrl);
      } else {
        reject("Failed to capture screenshot");
      }
    });
  });
}

function showResultsPopup(response) {
  // Create popup structure
  const popupHtml = `
    <div id="resultsPopup" class="hidden">
      <div class="popup">
        <button class="close">X</button>
        <div id="resultsWrap"></div>
      </div>
    </div>
  `;

  // Inject HTML structure
  document.body.insertAdjacentHTML('beforeend', popupHtml);

  // Create and show result cards
  const resultsWrap = document.getElementById('resultsWrap');
  if (resultsWrap) {
    resultsWrap.innerHTML = '';

    Object.keys(response).forEach(key => {
      const item = response[key];
      const card = createResultCard(key, item.tags, item.image_link);
      resultsWrap.appendChild(card);
    });

    const popup = document.getElementById('resultsPopup');
    if (popup) {
      popup.classList.remove('hidden');
    }

    const closeBtn = document.querySelector('.popup .close');
    if (closeBtn) {
      closeBtn.onclick = () => {
        popup.classList.add('hidden');
      };
    }
  } else {
    console.error('Element with id "resultsWrap" not found');
  }
}

function createResultCard(name, tags, imageUrl) {
  const card = document.createElement('div');
  card.className = 'resultCard';

  const title = document.createElement('p');
  title.style.margin = '5px';
  title.textContent = name;
  card.appendChild(title);

  const image = document.createElement('img');
  image.className = 'resimg';
  image.src = imageUrl;
  image.alt = name;
  card.appendChild(image);

  const link = document.createElement('a');
  link.href = updateAmazonUrl(name, tags);
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.className = 'btn';
  link.style.textDecoration = 'none';
  link.textContent = 'Go to Amazon';

  const icon = document.createElement('svg');
  icon.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
  icon.setAttribute('viewBox', '0 0 24 24');
  icon.setAttribute('width', '24');
  icon.setAttribute('height', '24');
  icon.innerHTML = '<path d="M14 2H6c-1.1 0-1.99.9-1.99 2L4 20c0 1.1.89 2 1.99 2H18c1.1 0 2-.9 2-2V8l-6-6zm2 14h-2v-2h-4v2H8v-2.5h8V16zm0-4.5H8V9h8v2.5z"/>';
  link.appendChild(icon);

  card.appendChild(link);

  return card;
}

function updateAmazonUrl(name, tags) {
  const baseUrl = 'https://www.amazon.in/s?k=';
  const query = `${name} ${tags}`.split(' ').join('+');
  return `${baseUrl}${encodeURIComponent(query)}`;
}
