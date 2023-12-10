const NUMBER_OF_STARS = 5;

document.addEventListener("DOMContentLoaded", async function () {
  document.getElementById("home").addEventListener("click", function () {
    chrome.tabs.create({
      url: chrome.runtime.getURL("../page/index.html"),
    });
    window.close();
  });

  document.getElementById("remove").addEventListener("click", function () {
    document.querySelector("p").innerText = "Add Product";
    document.getElementById("rate").style.display = "";
    document.getElementById("remove").style.display = "none";
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.storage.local.get(["data"], function (result) {
      if (chrome.runtime.lastError) {
          console.error('chrome.storage.local.get("data"), Erreur de stockage:', chrome.runtime.lastError);
      } else {
          if (result.data != undefined) {
          let data = result.data;
          let index = data.findIndex((d) => d.url == tabs[0].url);
          if (index !== -1) {
            data.splice(index, 1);
            chrome.storage.local.set({ data: data }, function () {
              if (chrome.runtime.lastError) {
                chrome.runtime.sendMessage({
                action: "showPopup",
                message: "Le produit n'a pas pu être supprimé",
                color: "#ff5555",
                });
                console.error("Erreur de stockage:", chrome.runtime.lastError);
              } else {
                chrome.runtime.sendMessage({
                action: "showPopup",
                message: "Le produit a bien été supprimé",
                color: "#4CAF50",
                });
                console.info("Produit supprimé avec succès");
              }
              window.close();
            });
          } else {
              console.error("Le produit n'a pas pu être supprimé, car le produit n'est pas enregistré");
          }
          } else {
          console.error("Le produit n'a pas pu être supprimé, car les data n'ont pas été trouvées");
          }
        }
      });
    });
  });

  chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    chrome.storage.local.get(["data"], function (result) {
      if (chrome.runtime.lastError) {
        console.error('chrome.storage.local.get("data"), Erreur de stockage:', chrome.runtime.lastError);
      } else {
        if (result.data != undefined) {
          let data = result.data;
          if (data.some((d) => d.url == tabs[0].url)) {
            document.querySelector("p").innerText = "Remove Product";
            document.getElementById("rate").style.display = "none";
            document.getElementById("remove").style.display = "";
          }
        }
      }
    });
  });

  let star_base = document.getElementById("rate_base");

  for (let i = NUMBER_OF_STARS; i > 0; i--) {
    let new_star = star_base.cloneNode(true);
    new_star.id = "rate_" + i;
    new_star.addEventListener("click", function () {
      chrome.runtime.sendMessage({
        action: "addProduct",
        rate: i,
      });
      window.close();
    });
    document.getElementById("rate").appendChild(new_star);
  }

  star_base.remove();
});
