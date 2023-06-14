// Получить массив из хранилища и показать его в div
chrome.storage.local.get(["orig"], function (result) {
    console.log("Array is " + result.orig);
    document.getElementById("orig").innerHTML = result.orig;
});
chrome.storage.local.get(["fish"], function (result) {
    console.log("Array is " + result.fish);
    document.getElementById("fish").innerHTML = result.fish;
});
//Кнопка удаления
chrome.storage.local.get("uArray", function (data) {
    let uArray = data.uArray || []; // Получаем список адресов из storage, или создаем пустой список, если его там еще нет
    let websiteList = document.getElementById("website-list"); // Получаем доступ к списку на странице

    // Для каждого адреса в списке uArray создаем новый элемент li, содержащий адрес и кнопку для удаления
    for (let i = 0; i < uArray.length; i++) {
        let li = document.createElement("li"); // Создаем новый элемент li
        let website = document.createTextNode(uArray[i]); // Создаем текстовый узел с адресом сайта
        let deleteButton = document.createElement("button"); // Создаем новую кнопку

        deleteButton.innerHTML = "Удалить";
        deleteButton.setAttribute("class", "button2"); // Добавляем атрибут class="button2" к кнопке удаления
        deleteButton.onclick = function () {
            removeFromArray(uArray, i); // Вызываем функцию удаления элемента из списка
            saveArray(uArray); // Сохраняем обновленный список в хранилище
            websiteList.removeChild(li); // Удаляем элемент li из списка на странице
        };

        li.appendChild(website); // Добавляем текстовый узел в элемент li
        li.appendChild(deleteButton); // Добавляем кнопку в элемент li
        websiteList.appendChild(li); // Добавляем элемент li в список на странице
    }
});

// Функция удаления элемента из списка
function removeFromArray(arr, index) {
    if (index > -1) {
        arr.splice(index, 1);
    }
}

// Функция сохранения списка в хранилище
function saveArray(arr) {
    chrome.storage.local.set({uArray: arr}, function () {
        console.log("Список сохранен");
    });
}

//Добавление пользовательских нежелательных сайтов
function addBlackList() {
    chrome.tabs.query({active: true, currentWindow: true}, function (tabs) {
        var currentTab = tabs[0];
        var currentTabUrl = currentTab.url;
        chrome.storage.local.get("uArray", function (result) {
            let uArray = result.uArray || []; // Проверяем, что массив уже есть, или создаём новый пустой
            if (!uArray.includes(currentTabUrl)) {
                uArray.push(currentTabUrl); // Добавляем новую строку в конец массива, если её ещё нет
                chrome.storage.local.set({uArray: uArray}, function () {
                    console.log('URL сохранен в хранилище');
                });
            } else {
                console.log('Данный URL уже находится в хранилище');
            }
        });
    });
}

//Обработчик кнопки, который запускает function addBlackList()
document.addEventListener("DOMContentLoaded", function () {
    var addBlackListButton = document.getElementById("addBlackListButton");
    addBlackListButton.addEventListener("click", function () {
        addBlackList();
    });
});