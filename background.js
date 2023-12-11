function showPopup(message, color) {
  let popup = document.createElement("div");
  popup.style.position = "fixed";
  popup.style.top = "20px";
  popup.style.right = "20px";
  popup.style.padding = "10px";
  popup.style.backgroundColor = color;
  popup.style.color = "#fff";
  popup.style.borderRadius = "5px";
  popup.style.zIndex = "9999";
  popup.style.fontFamily = "Varela Round";
  popup.textContent = message;
  document.body.appendChild(popup);
  popup.style.display = "block";
  setTimeout(function () {
    popup.style.display = "none";
    document.body.removeChild(popup);
  }, 2000);
}

function add_product(rate_level) {

  console.log("ADDOK");

  let product = {
    title: document.querySelector(`h1[id="title"] span[id="productTitle"]`).innerText,
    url: document.URL,
    image: document.querySelector(`div[id="main-image-container"] img[id="landingImage"]`).dataset.oldHires,
    price: document.querySelector(`div[id="desktop_buybox"]`).innerText.match("[0-9]{1,99}[,.]{0,1}[0-9]{0,99}.{0,1}[\$€£¥₽₩฿₺₹₴₱₦₢₡₵¢]{1}")[0],
    rate: rate_level,
    timestamp: Math.floor(Date.now()/1000)
  };

  console.debug(product);

  chrome.storage.local.get(["data"], function (result) {
    let data = [];

    if (result.data != undefined) {
      data = result.data;
    }

    if (!data.some(d => d.url == product.url)) {
      data.push(product);
      chrome.storage.local.set({ data: data }, function () {
        if (chrome.runtime.lastError) {
          chrome.runtime.sendMessage({
            action: "showPopup", 
            message: "Le produit n'a pas pu être ajouté", 
            color: "#ff5555"
          });
          console.error("Erreur de stockage:", chrome.runtime.lastError);
        } else {
          chrome.runtime.sendMessage({
            action: "showPopup", 
            message: "Le produit a bien été ajouté", 
            color: "#4CAF50"
          });
          console.info("Produit sauvegardé avec succès");
        }
      });
    } else {
      console.warn("Le produit est déjà enregistré");
    }
  });
}

chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.action == "showPopup") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: showPopup,
        args: [request.message, request.color],
      });
    });
  } else if (request.action == "addProduct") {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        func: add_product,
        args: [request.rate],
      });
    });
  }
});
