document.addEventListener('DOMContentLoaded', function() {
    const contactDiv = document.getElementById('contact-div');
    let scriptsInjected = false;

    function isGoogleDriveTab(url) {
        if (url.indexOf('https://drive.google.com/file/') !== -1) {
            return true;
        }

        alert('ERROR! This extension can only download protected PDFs from google drive. It doesn\'t work on this site!');
        return false;
    }

    document.getElementById('download-button').addEventListener('click', function() {
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
    });

    document.getElementById('contact-button').addEventListener('click', function() {
        if (contactDiv.style.display == 'block') {
            contactDiv.style.display = 'none';
        } else {
            contactDiv.style.display = 'block';
        }
    });
});
