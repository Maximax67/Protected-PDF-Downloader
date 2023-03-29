document.addEventListener('DOMContentLoaded', function() {
    const body = document.getElementsByTagName('body')[0];
    const buttonDownload = document.getElementById('download-button');
    const textDownload = document.getElementById('download-text');
    const buttonChangeDesign = document.getElementsByClassName('button-change-design')[0];
    let scriptsInjected = false;

    const styleThem = [
        'linear-gradient(90deg, rgb(133, 255, 189) 0%, rgb(255, 251, 125) 100%)',
        'linear-gradient(to top, #2a0845, #6441A5);',
        'linear-gradient(to bottom, #abbaab, #ffffff);',
        'linear-gradient(to right, #485563, #29323c);',
        'linear-gradient(to right, #00c6ff, #0072ff);',
        'linear-gradient(to right, #fbd3e9, #bb377d);'
    ]
    chrome.storage.local.get(['currentThem']).then(currentThem => {
        currentThem = !(currentThem?.['currentThem']) 
            ? 1
            : currentThem?.['currentThem']
        body.style = `background: ${styleThem[currentThem - 1]} !important;`
    })

    buttonChangeDesign.addEventListener('click', function() {
        chrome.storage.local.get(['currentThem'], function(items) {
            let currentThem = items?.['currentThem']
            if (!(currentThem)) {
                chrome.storage.local.set({ 'currentThem': 2 }, function() {
                    console.log('save default');
                });
                return;
            }
            currentThem = currentThem >= styleThem.length
                ? 1
                : currentThem + 1
            chrome.storage.local.set({['currentThem']: currentThem })
            body.style = `background: ${styleThem[currentThem - 1]} !important;`
            console.log(styleThem[currentThem - 1]);
        });
    });

    buttonDownload.addEventListener('click',() => downloadPDF());
    textDownload.addEventListener('click',() => downloadPDF());

    const isGoogleDriveTab = (url) => (url.indexOf('https://drive.google.com/file/') !== -1);

    async function downloadPDF() {
        await chrome.tabs.query({active: true, currentWindow: true}, async function(tabs) {
            if (isGoogleDriveTab(tabs[0].url)) {
                textDownload.innerHTML = 'Downloading';
                buttonDownload.style.background = 'rgba(0, 255, 115, 0.5)';
                buttonDownload.disabled = true;

                if (!scriptsInjected) {
                    await chrome.scripting.executeScript({
                        target: { tabId: tabs[0].id },
                        files: ['scripts/jspdf.js', 'scripts/script.js']
                    });
                    scriptsInjected = true;
                }
                await chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    files: ['scripts/script2.js']
                });

                textDownload.innerHTML = 'Download PDF';
                buttonDownload.style.background = 'rgba(255, 255, 255, 0.5)';
                buttonDownload.disabled = false;
            } else {
                alert('ERROR! This extension can only download protected PDFs from google drive. It doesn\'t work on this site!');
            }
        });
    }
});
