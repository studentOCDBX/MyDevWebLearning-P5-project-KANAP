let cart = JSON.parse(localStorage.getItem("orders"));
async function retrieveData() {
  let totalCartPrice = 0;
  for (const order of cart) {
    await fetch(`http://localhost:3000/api/products/${order.productId}`)
      .then((response) => {
        if (response.ok) {
          return response.json();
        }
      })
      .then((data) => {
        totalCartPrice += data.price * order.quantity;
        document.querySelector("#totalPrice").innerText = totalCartPrice;
        displayCart(data, order);
      })
      .catch((err) => console.log(`Erreur de reception de données`));
  }
  displayTotalOrderQuantity();
  adjustItemQuantity();
  removeItem();
}
retrieveData();
function displayCart(data, order) {
  const section = document.querySelector("#cart__items");
  section.innerHTML += `<article class="cart__item" data-id="${order.productId}" data-color="${order.color}">
                <div class="cart__item__img">
                  <img src="${data.imageUrl}" alt="${data.altTxt}">
                </div>
                <div class="cart__item__content">
                  <div class="cart__item__content__description">
                    <h2>${data.name}</h2>
                    <p>${order.color}</p>
                    <p>${data.price} €</p>
                  </div>
                  <div class="cart__item__content__settings">
                    <div class="cart__item__content__settings__quantity">
                      <p>Qté :</p>
                      <input type="number" class="itemQuantity" name="itemQuantity" min="1" max="100" value="${order.quantity}">
                    </div>
                    <div class="cart__item__content__settings__delete">
                      <p class="deleteItem">Supprimer</p>
                    </div>
                  </div>
                </div>
              </article>`;
}

function displayTotalOrderQuantity() {
  let totalOrderQuantity = 0;
  const totalQuantity = document.querySelector("#totalQuantity");
  cart.forEach((order) => {
    const orderQuantity = order.quantity;
    totalOrderQuantity += orderQuantity;
  });
  totalQuantity.innerText = totalOrderQuantity;
}

function adjustItemQuantity() {
  let inputs = document.querySelectorAll(".itemQuantity");
  inputs.forEach((input) => {
    input.addEventListener("change", (e) => {
      adjustTotalQuantityAndTotalCartPrice(input);
    });
  });
}

function adjustTotalQuantityAndTotalCartPrice(input) {
  const article = input.closest("article");
  const id = article.dataset.id;
  const color = article.dataset.color;
  const quantity = input.value;
  const founded = cart.find((e) => e.productId === id && e.color === color);
  if (founded) {
    founded.quantity = parseInt(quantity);
    cart.sort((e) => e.productId === id && e.color === color);
  }
  localStorage.setItem("orders", JSON.stringify(cart));
  displayTotalOrderQuantity();
  retrieveData();
  location.reload();
}
function removeItem() {
  let paragraphs = document.querySelectorAll(".deleteItem");
  paragraphs.forEach((paragraph) => {
    paragraph.addEventListener("click", (e) => {
      const article = paragraph.closest("article");
      const id = article.dataset.id;
      const color = article.dataset.color;
      const item = cart.find((e) => e.productId === id && e.color === color);
      if (item) {
        cart.splice(item, 1);
        localStorage.setItem("orders", JSON.stringify(cart));
        location.reload();
      }
    });
  });
}
