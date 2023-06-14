chrome.runtime.onInstalled.addListener(function () {
    readOrigTxtAndPushToStorage();
    readFishTxtAndPushToStorage();
});
//открытие welcome page
chrome.runtime.onInstalled.addListener(function (details) {
    if (details.reason == "install") {
        chrome.tabs.create({url: "welcome.html"});
    }
});

//считывает myArray.txt
function readOrigTxtAndPushToStorage() {
    fetch(chrome.runtime.getURL('orig.txt'))
        .then(response => response.text())
        .then(text => {
            const lines = text.split('\n').map(line => line.trim());
            chrome.storage.local.get('orig', result => {
                const orig = result.orig || [];
                if (orig.length === 0) {
                    orig.push(...lines);
                    chrome.storage.local.set({orig: orig}, () => {
                        console.log('orig updated:', orig);
                    });
                }
            });
        })
        .catch(error => console.error('Failed to fetch orig.txt:', error));
}

//считывает fish.txt
function readFishTxtAndPushToStorage() {
    fetch(chrome.runtime.getURL('fish.txt'))
        .then(response => response.text())
        .then(text => {
            const lines = text.split('\n').map(line => line.trim());
            chrome.storage.local.get('fish', result => {
                const fish = result.fish || [];
                if (fish.length === 0) {
                    fish.push(...lines);
                    chrome.storage.local.set({fish: fish}, () => {
                        console.log('fish updated:', fish);
                    });
                }
            });
        })
        .catch(error => console.error('Failed to fetch fish.txt:', error));
}