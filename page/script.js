function pattern(title, image, price, url, rate) {
    let solid = '<i class="fa-solid fa-star" alt="navigation"></i>\n'
    let regular = '<i class="fa-regular fa-star" alt="navigation"></i>\n'
    let rate_stars = "";
    for (let i = 0; i < rate; i++) {rate_stars += solid}
    for (let i = 0; i < (5 - rate); i++) {rate_stars += regular}
    return `<div class="col-md-2-5 mb-2-5">
        <div class="card overflow-hidden shadow">
        <img class="card-img-top" src="${image}" alt="Image of '${title}'">
        <div class="card-body py-4 px-3">
            <div class="d-flex flex-column flex-lg-row justify-content-between mb-3">
            <h4 class="text-secondary fw-medium truncate-text">
                <a id="title-url" class="link-900 text-decoration-none stretched-link" href="${url}">${title}</a>
            </h4>
            </div>
            <div class="d-flex align-items-center">
            ${rate_stars}<span class="fs-1 fw-medium">${price}</span>
            </div>
        </div>
        </div>
    </div>`;
}

document.addEventListener("DOMContentLoaded", async function () {
    chrome.storage.local.get(["data"], function (result) {
        let data = result.data;
    
        if (data != undefined && data.length > 0) {
          for (let i = 0; i < data.length; i++) {
            let product = data[i];
            document.getElementById("products").innerHTML += pattern(
                product.title, product.image, product.price, product.url, product.rate
            );
          }

        } else {
            document.getElementById("title-page").style.fontSize = "8em";
            document.getElementById("search-box").style.display = "none";
            document.getElementById("products").style.display = "none";
            document.getElementById("err-title").style.display = "";
            document.getElementById("err-description").style.display = "";
        }
    });
});