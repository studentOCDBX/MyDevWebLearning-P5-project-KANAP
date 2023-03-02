const queryParams = window.location.search;
const urlParams = new URLSearchParams(queryParams);
const productId = urlParams.get("id");
/**
 * Send custom request using fetch api
 * @return {Promise}
 */
fetch(`http://localhost:3000/api/products/${productId}`)
  .then((response) => {
    if (response.ok) {
      return response.json();
    }
  })
  .then((data) => displayProduct(data))
  .catch((err) => console.log("Erreur de réception de données", err));
/**
 * Display the selected product
 * @param {Object} product 
 */
function displayProduct(product) {
  retrieveProductImage(product);
  retrieveProductName(product);
  retrieveProductPrice(product);
  retrieveProductDescription(product);
  retrieveProductcolors(product);
}
manageOrder();
/**
 * Retrieve the selected product image
 * @param {object} product - The product Object
 * @return {HTMLElement} - The product image
 */
function retrieveProductImage(product) {
  const imgItem = document.querySelector(".item__img");
  imgItem.innerHTML += `<img src="${product.imageUrl}" alt="${product.altTxt}">`;
}
/**
 * Retrieve the selected product name
 * @param {*} product - The product Object
 * @return {innerHTML} - The product name
 */
function retrieveProductName(product) {
  const h1 = document.querySelector("#title");
  h1.innerText = product.name;
  return product.name;
}
/**
 * Retrieve the selected product price
 * @param {object} product - The product Object
 * @return {innerHTML} - The product price
 */
function retrieveProductPrice(product) {
  const price = document.querySelector("#price");
  price.innerText = product.price;
  return product.price;
}
/**
 * Retrieve the selected product description
 * @param {object} product - The product Object
 * @return {innerHTML} - The product description
 */
function retrieveProductDescription(product) {
  const description = document.querySelector("#description");
  description.innerText = product.description;
  return product.description;
}
/**
 * Retrieve the selected product color
 * @param {object} product - The product Object
 * @return {HTMLElement} - The product color
 */
function retrieveProductcolors(product) {
  const select = document.querySelector("#colors");
  product.colors.forEach((color) => {
    select.innerHTML += `<option value="${color}">${color}</option>`;
  });
}
/**
 * Manage Order: check order validity and 
 * save the cart in storage
 * and redirect to the cart page.
 */
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
/**
 * Check if order validity
 * @param {String} color 
 * @param {Number} quantity 
 * @return true if order is invalid
 */
function isOrderInvalid(color, quantity) {
  if (color == null || color === "" || quantity == null || quantity == 0) {
    alert(`Veuillez sélectionner une couleur et une quantité`);
    return true;
  }
}
/**
 * Save cart in local storage
 * @param {String} color - Product color
 * @param {Number} quantity - Product quantity
 */
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
/**
 * Redirect to cart.html page
 */
function redirectToCart() {
  window.location.href = `./cart.html`;
}
