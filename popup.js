document.addEventListener("DOMContentLoaded", function () {

    let number_of_stars = 5;

    chrome.storage.local.set({data: []});

    document.getElementById("home").addEventListener("click", function () {
        chrome.tabs.update({ url: chrome.runtime.getURL("home.html") });
    });

    document.getElementById("remove").addEventListener("click", function () {
        document.querySelector("p").innerText = "Add Product";
        document.getElementById("rate").style.display = "";
        document.getElementById("remove").style.display = "none";
    });

    function _add_product_(rate_level) {

        console.log("ADD");

        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            var document = tabs[0];

            console.log(document.url);

            console.log(document.url);
            console.log(document.getElementById("main-image-container").querySelector("ul img").src);
            console.log(document.getElementById("corePriceDisplay_desktop_feature_div").querySelector("div span span").innerText);
            console.log(rate_level);

            chrome.storage.local.get("data", function (result) {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                } else {
                    const data = result.data;
                    console.log("Variable récupérée :", data);
                }
            });

            product = {
                "title": document.querySelector("h1").innerText, 
                "url": document.URL, 
                "image": document.getElementById("main-image-container").querySelector("ul img").src, 
                "price": document.getElementById("corePriceDisplay_desktop_feature_div").querySelector("div span span").innerText, 
                "rate": rate_level
            }

            console.log(product);
            data.push(product);

            chrome.storage.local.set({ data: data }, function () {
                if (chrome.runtime.lastError) {
                    console.error(chrome.runtime.lastError);
                } else {
                    console.log("Variable stockée avec succès !");
                }
            });
        });

        // Script
        document.getElementById("rate").style.display = "none";
        document.querySelector("p").innerText = "Product Added";
        document.getElementById("remove").style.display = "";
    }

    for (let i=1; i<number_of_stars+1; i++) {
        document.getElementById("rate_" + i).addEventListener("click", function () {
            _add_product_(i);
        });
    }
});
