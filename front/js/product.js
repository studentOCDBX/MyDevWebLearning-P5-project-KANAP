const queryParams = window.location.search;
const urlParams = new URLSearchParams(queryParams);
const productId = urlParams.get("id");

fetch(`http://localhost:3000/api/products/${productId}`)
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
  })
  .then((data) => showProductDetails(data))
  .catch((err) => console.log("Erreur de réception de données"));

function showProductDetails(product) {
  showProductImage(product);
  showProductName(product);
  showProductPrice(product);
  showProductDescription(product);
  showProductcolors(product);
}

function showProductImage(product) {
  const imgItem = document.querySelector(".item__img");
  imgItem.innerHTML += `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
}

function showProductName(product) {
  const h1 = document.querySelector("#title");
  h1.innerText = product.name;
}

function showProductPrice(product) {
  const price = document.querySelector("#price");
  price.innerText = product.price;
}

function showProductDescription(product) {
  const description = document.querySelector("#description");
  description.innerText = product.description;
}

function showProductcolors(product) {
  const select = document.querySelector("#colors");

  product.colors.forEach((color) => {
    const option = document.createElement("option");
    option.setAttribute("value", color);
    option.innerText = color;
    select.appendChild(option);
  });
}
