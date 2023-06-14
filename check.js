let url = window.location.href;
chrome.storage.local.get(["uArray"], function (result) {
    let lst = new Set(result.uArray);
    if (lst.has(url)) {
        alert("Вы заблокировали этот сайт!")
        console.log("Сайт заблокирован")
    }
});
chrome.storage.local.get(["fish"], function (result) {
    let lst = new Set(result.fish);
    if (lst.has(url)) {
        alert("Это фишинговый сайт!")
        console.log("Сайт заблокирован")
    }
});

// Реализация алгоритма Левенштейна
function levenshteinDistance(a, b) {
    if (a.length === 0) return b.length;
    if (b.length === 0) return a.length;

    const matrix = Array.from({length: a.length + 1}, () => Array.from({length: b.length + 1}, (_, i) => i));

    for (let i = 1; i <= a.length; i++) {
        for (let j = 1; j <= b.length; j++) {
            if (a[i - 1] === b[j - 1]) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j] + 1,
                    matrix[i][j - 1] + 1,
                    matrix[i - 1][j - 1] + 1,
                );
            }
        }
    }

    return matrix[a.length][b.length];
}

//функция проверки адреса и словаря по Левенштейну
function check() {
    var url = window.location.href;
    chrome.storage.local.get(["orig"], function (result) {
        var lst = new Set(result.orig);
        const threshold = 0.9;
        for (let item of lst) {
            const distance = levenshteinDistance(url, item);
            const similarity = 1 - (distance / Math.max(url.length, item.length));
            if ((similarity > threshold) && (similarity < 1.0)) {
                alert('Этот сайт ' + url + " похож на " + item + "на " + (similarity.toFixed(2)) * 100 + "%");
                showAddBlackList();
                break;
            }
        }
    });
}

//окно с предложением заблокировать сайт, при запрещеном слове
function showAddBlackList() {
    const dialog = confirm('Вы хотите добавить в черный список?');
    if (dialog === true) {
        chrome.storage.local.get("uArray", function (result) {
            let uArray = result.uArray || []; // Проверяем, что массив уже есть, или создаём новый пустой
            const currentTabUrl = window.location.href;
            if (!uArray.includes(currentTabUrl)) {
                uArray.push(currentTabUrl); // Добавляем новую строку в конец массива, если её ещё нет
                chrome.storage.local.set({uArray: uArray}, function () {
                    console.log('URL сохранен в хранилище');
                });
            } else {
                console.log('Данный URL уже находится в хранилище');
            }
        });
    }
}

function checkPopup() {
    if (window.location.href.indexOf('chrome-extension://') === 0) {
        // Если URL начинается с "chrome-extension://" (т.е. это страница расширения), то не выполняем скрипт
        return;
    }
    //убираем из проверки поиск гугл
    var regex = /https?:\/\/www\.google\.com\/search/i;
    if (regex.test(window.location.href)) {
        // Если URL содержит "https://www.google.com/search", то не выполняем скрипт
        return;
    }
    check(); // Выполняем скрипт
}

checkPopup();