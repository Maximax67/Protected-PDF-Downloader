document.addEventListener('DOMContentLoaded', function() {
    const contactDiv = document.getElementById('contact-div');

    document.getElementById('download-button').addEventListener('click', function() {
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            if (tabs[0].url.indexOf('https://drive.google.com/file/') !== -1) {
                chrome.scripting.executeScript({
                    target: { tabId: tabs[0].id },
                    files: ["scripts/jspdf.js", "scripts/script.js"]
                });
            } else {
                alert("ERROR! This extension can only download protected PDFs from google drive. It doesn't work on this site!");
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
