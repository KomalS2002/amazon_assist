document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('identifyText').addEventListener('click', async () => {
        const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
        chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: identifyFromText
        });
    });

    function identifyFromText() {
        (function() {
            const textContent = document.body.innerText;

            const xhr = new XMLHttpRequest();
            xhr.open('POST', 'http://127.0.0.1:8000/assist/text');
            xhr.setRequestHeader('Content-Type', 'application/json');
            xhr.setRequestHeader('Accept', 'application/json');
            xhr.setRequestHeader('Access-Control-Allow-Origin', '*');
            xhr.setRequestHeader('Access-Control-Allow-Headers', 'X-Requested-With');

            xhr.onload = function() {
                if (xhr.status >= 200 && xhr.status < 300) {
                    const response = JSON.parse(xhr.responseText);
                    injectPopupStructure();
                    showResultsPopup(response);
                } else {
                    const errorData = JSON.parse(xhr.responseText);
                    alert(`Error: ${errorData.message}`);
                }
            };

            xhr.onerror = function() {
                alert('Request failed');
            };

            xhr.send(JSON.stringify({ text: textContent }));

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
                            background: #007BFF;
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

            function showResultsPopup(response) {
                const resultsWrap = document.getElementById('resultsWrap');
                if (resultsWrap) {
                    resultsWrap.innerHTML = ''; // Clear previous results

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

            function updateAmazonUrl(name, tags) {
                const baseUrl = 'https://www.amazon.in/s?k=';
                const query = `${name} ${tags}`.split(' ').join('+');
                return `${baseUrl}${encodeURIComponent(query)}`;
            }

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
        })();
    }
});
