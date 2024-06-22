// Listen for messages from the background script
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  // Check if the message type is "check_youtube"
  if (request.type === "check_youtube") {
    // Check if the current host is YouTube
    if (window.location.host.includes("youtube.com")) {
      // Select the video element
      const video = document.querySelector('video');
      // If a video element exists
      if (video) {
        // Get the URL of the current YouTube video
        const videoUrl = window.location.href;
        // Debugging: Alert the video URL
        alert(videoUrl);

        // Send the video URL to the backend
        fetch(`http://127.0.0.1:8000/assist/youtube-video`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: videoUrl })
        })
        .then(response => response.json())
        .then(data => {
          console.log("Received data:", data); // Debugging: Log received data
          // Show the results popup
          injectPopupStructure();
          showResultsPopup(data);
        })
        .catch(error => {
          console.error("Error sending video URL:", error);
        });
      } else {
        // Alert if no video is found on the YouTube page
        alert("Please play a video on YouTube to identify products in the video.");
      }
    } else {
      // Alert if the user is not on YouTube
      alert("Please play a video on YouTube to identify products in the video.");
    }
  }
});

// Function to inject the popup structure
function injectPopupStructure() {
  // Check if the popup structure is already injected
  if (!document.getElementById('resultsPopup')) {
    // Inject HTML structure
    const popupHtml = `
      <div id="resultsPopup" class="hidden">
        <div class="popup">
          <button class="close">X</button>
          <div id="resultsWrap"></div>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML('beforeend', popupHtml);

    // Inject CSS styles
    const style = document.createElement('style');
    style.innerHTML = `
      .hidden {
        display: none;
      }
      .popup {
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 80%;
        max-width: 600px;
        padding: 20px;
        background: white;
        box-shadow: 0 2px 10px rgba(0,0,0,0.1);
        z-index: 1000;
      }
      .popup .close {
        position: absolute;
        top: 10px;
        right: 10px;
        background: transparent;
        border: none;
        font-size: 20px;
        cursor: pointer;
      }
      .resultCard {
        border: 1px solid #ccc;
        padding: 10px;
        margin: 10px 0;
        display: flex;
        align-items: center;
      }
      .resultCard img.resimg {
        max-width: 100px;
        margin-right: 10px;
      }
      .resultCard .btn {
        margin-left: auto;
        padding: 5px 10px;
        background: #f3830c;
        color: white;
        border: none;
        cursor: pointer;
        display: flex;
        align-items: center;
    }
      .resultCard .btn svg {
        margin-left: 5px;
      }
    `;
    document.head.appendChild(style);
  }
}

// Function to display the results popup
function showResultsPopup(response) {
  console.log("showResultsPopup response:", response); // Debugging: Log the response

  const resultsWrap = document.getElementById('resultsWrap');
  if (resultsWrap) {
    resultsWrap.innerHTML = ''; // Clear previous results

    Object.keys(response).forEach(key => {
      const item = response[key];
      console.log("Processing item:", key, item); // Debugging: Log each item
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

// Function to create a result card
function createResultCard(name, tags, imageUrl) {
  const card = document.createElement('div');
  card.className = 'resultCard';

  const image = document.createElement('img');
  image.className = 'resimg';
  image.src = imageUrl;
  image.alt = name;
  card.appendChild(image);

  const title = document.createElement('p');
  title.style.margin = '5px';
  title.textContent = name;
  card.appendChild(title);

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

// Function to update Amazon URL
function updateAmazonUrl(name, tags) {
  const baseUrl = 'https://www.amazon.in/s?k=';
  const query = `${name} ${tags}`.split(' ').join(' ');
  return `${baseUrl}${encodeURIComponent(query)}`;
}
