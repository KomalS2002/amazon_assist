chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.type === "check_youtube") {
      if (window.location.host.includes("youtube.com")) {
        const video = document.querySelector('video');
        if (video) {
          alert("Please pause the video where you want products to be recognized.");
          video.addEventListener('pause', () => {
            const button = document.createElement('button');
            button.innerText = "Identify Product";
            button.style.position = "fixed";
            button.style.top = "10px";
            button.style.right = "10px";
            button.style.zIndex = 1000;
            document.body.appendChild(button);
  
            button.addEventListener('click', async () => {
              const isWidescreen = document.querySelector('.html5-video-player').classList.contains('ytp-fullscreen');
              const screenshot = await captureScreenshot();
              const response = await fetch('http://127.0.0.1:8000/assist/image/', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ image: screenshot })
              });
              const data = await response.json();
              alert(JSON.stringify(data));
              button.remove();
            });
          });
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
        resolve(dataUrl);
      });
    });
  }
  