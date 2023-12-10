const NUMBER_OF_STARS = 5;

document.addEventListener("DOMContentLoaded", async function () {

    document.getElementById("home").addEventListener("click", function () {
        chrome.tabs.create({
            url: chrome.runtime.getURL("../page/index.html")
        });
        window.close();
    });

    document.getElementById("remove").addEventListener("click", function () {
        document.querySelector("p").innerText = "Add Product";
        document.getElementById("rate").style.display = "";
        document.getElementById("remove").style.display = "none";
    });

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.storage.local.get(["data"], function (result) {
            if (chrome.runtime.lastError) {
                console.error(
                    'chrome.storage.local.get("data"), Erreur de stockage:',
                    chrome.runtime.lastError
                );
            } else {
                if (result.data != undefined) {
                    let data = result.data;
                    if (data.some(d => d.url == tabs[0].url)) {
                        document.querySelector("p").innerText = "Remove Product";
                        document.getElementById("rate").style.display = "none";
                        document.getElementById("remove").style.display = "";
                    }
                }
            }
        });
    });

    let star_base = document.getElementById("rate_base");

    for (let i=NUMBER_OF_STARS; i>0; i--) {
        let new_star = star_base.cloneNode(true);
        new_star.id = "rate_" + i;
        new_star.addEventListener("click", function () {
            chrome.runtime.sendMessage({
                action: "addProduct", 
                rate: i
            });
            window.close();
        });
        document.getElementById("rate").appendChild(new_star);
    }

    star_base.remove();
});
