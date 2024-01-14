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
    </div>
    <script>
        console.log("script");
        const img = new Image();
        img.onload = function() {
            draw(this.width, this.height, "${image}");
        }
        img.src = '${image}';
    </script>`;
}

function draw(w, h, src) {
    console.log("DRAW");
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext("2d");
    
    let size = 500;
    let x = size;
    let y = size;
    let border = 10;
    
    canvas.width  = size+(border*2);
    canvas.height = size+(border*2);
    
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, size+(border*2), size+(border*2));
    
    if (w <= h) {
        x = (size*w)/h;
    } else {
        y = (size*h)/w;
    }

    ctx.drawImage(
        document.querySelector(`img[src=${src}]`),
        ((size-x)/2)+border, 
        ((size-y)/2)+border, 
        x, 
        y
    );

    console.log(canvas.toDataURL());

    document.querySelector(`img[src=${src}]`).src = canvas.toDataURL();
}

document.addEventListener("DOMContentLoaded", async function () {
    chrome.storage.local.get(["data"], function (result) {
        let data = result.data;
    
        if (data != undefined && data.length > 0) {
          for (const element of data) {
            let product = element;
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