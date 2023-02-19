const queryParams = window.location.search;
const urlParams = new URLSearchParams(queryParams);
const productId = urlParams.get("id");

fetch(`http://localhost:3000/api/products/${productId}`)
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
  })
  .then((data) => displayProduct(data))
  .catch((err) => console.log("Erreur de réception de données", err));

function displayProduct(product) {
  retrieveProductImage(product);
  retrieveProductName(product);
  retrieveProductPrice(product);
  retrieveProductDescription(product);
  retrieveProductcolors(product);
}
manageOrder();

function retrieveProductImage(product) {
  const imgItem = document.querySelector(".item__img");
  imgItem.innerHTML += `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
}

function retrieveProductName(product) {
  const h1 = document.querySelector("#title");
  h1.innerText = product.name;
  return product.name;
}

function retrieveProductPrice(product) {
  const price = document.querySelector("#price");
  price.innerText = product.price;
  return product.price;
}

function retrieveProductDescription(product) {
  const description = document.querySelector("#description");
  description.innerText = product.description;
  return product.description;
}

function retrieveProductcolors(product) {
  const select = document.querySelector("#colors");
  product.colors.forEach((color) => {
    select.innerHTML += `<option value="${color}">${color}</option>`;
  });
}

function manageOrder() {
  const button = document.querySelector("#addToCart");
  button.addEventListener("click", (e) => {
    const color = document.querySelector("#colors").value;
    const quantity = document.querySelector("#quantity").value;
    if (isOrderInvalid(color, quantity)) return;
    saveCartInStorage(color, quantity);
    redirectToCart();
  });
}

function isOrderInvalid(color, quantity) {
  if (color == null || color === "" || quantity == null || quantity == 0) {
    alert(`Veuillez sélectionner une couleur et une quantité`);
    return true;
  }
}

function saveCartInStorage(color, quantity) {
  let cart = JSON.parse(localStorage.getItem("orders")) || [];
  let itemOrder = {
    productId: productId,
    color: color,
    quantity: parseInt(quantity),
  };
  let founded = cart.find(
    (e) => e.productId === productId && e.color === color
  );
  if (founded) {
    founded.quantity = parseInt(quantity) + parseInt(founded.quantity);
  } else {
    cart.push(itemOrder);
  }
  localStorage.setItem("orders", JSON.stringify(cart));
}

function redirectToCart() {
  window.location.href = `./cart.html`;
}
