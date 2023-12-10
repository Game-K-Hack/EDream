// Constante
const NUMBER_OF_STARS = 5;

document.addEventListener("DOMContentLoaded", async function () {

    document.getElementById("home").addEventListener("click", function () {
        chrome.tabs.create({ url: chrome.runtime.getURL("home.html") });
        document.close();
        window.close();
    });

    document.getElementById("remove").addEventListener("click", function () {
        document.querySelector("p").innerText = "Add Product";
        document.getElementById("rate").style.display = "";
        document.getElementById("remove").style.display = "none";
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
