document.addEventListener('DOMContentLoaded', function() {
    const body = document.getElementsByTagName('body')[0];
    const contactDiv = document.getElementById('contact-div');
    const buttonChangeDesign = document.getElementsByClassName('button-change-design')[0]
    let scriptsInjected = false;

    function isGoogleDriveTab(url) {
        if (url.indexOf('https://drive.google.com/file/') !== -1) {
            return true;
        }

        alert('ERROR! This extension can only download protected PDFs from google drive. It doesn\'t work on this site!');
        return false;
    }
    const styleThem = [
        'linear-gradient(90deg, rgb(133, 255, 189) 0%, rgb(255, 251, 125) 100%)',
        'linear-gradient(to top, #2a0845, #6441A5);',
        'linear-gradient(to bottom, #abbaab, #ffffff);',
        'linear-gradient(to right, #485563, #29323c);',
        'linear-gradient(to right, #00c6ff, #0072ff);'
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

    document.getElementById('download-button').addEventListener('click',() => downloadPDF());
    document.getElementById('download-text').addEventListener('click',() => downloadPDF());

    function downloadPDF() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (isGoogleDriveTab(tabs[0].url)) {
                if (!scriptsInjected) {
                    chrome.scripting.executeScript({
                        target: { tabId: tabs[0].id },
                        files: ['scripts/jspdf.js', 'scripts/script.js']
                    });
                    scriptsInjected = true;
                }
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    files: ['scripts/script2.js']
                });
            }
        });
    }
});
