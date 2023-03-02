let cart = JSON.parse(localStorage.getItem("orders"));
sortItems(cart);
/**
 * Sort Product by color 
 * @param {array} cart - Array of object
 * @returns 
 */
function sortItems(cart) {
    cart.sort((e1, e2) => {
      return e1.productId < e2.productId ? -1 : e1.productId > e2.productId ? 1 : 0;
    });
    return cart;
}
/**
 * Send custom request using fetch api
 * @return {Promise}
 */
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
    submitForm();
}
retrieveData();

/**
 * Dysplays the cart and its contents
 * @param {object array} data -Api content data
 * @param {object} order -Selected product
 */
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

/**
 * Display the total quantity of orders
 * @return {Number} 
 */
function displayTotalOrderQuantity() {
    let totalOrderQuantity = 0;
    const totalQuantity = document.querySelector("#totalQuantity");
    cart.forEach((order) => {
        const orderQuantity = order.quantity;
        totalOrderQuantity += orderQuantity;
    });
    totalQuantity.innerText = totalOrderQuantity;
}

/**
 * Adjust the selected products number
 */
function adjustItemQuantity() {
    let inputs = document.querySelectorAll(".itemQuantity");
    inputs.forEach((input) => {
        input.addEventListener("change", (e) => {
        adjustTotalQuantityAndTotalCartPrice(input);
        });
    });
}

/**
 * Adjust total product count and total cart price
 * @param {Number} input  dataset.id and data.set color element
 */
function adjustTotalQuantityAndTotalCartPrice(input) {
    const article = input.closest("article");
    const id = article.dataset.id;
    const color = article.dataset.color;
    const quantity = input.value;
    const founded = cart.find((e) => e.productId === id && e.color === color);
    if (founded) {
        founded.quantity = parseInt(quantity);
    }
    localStorage.setItem("orders", JSON.stringify(cart));
    displayTotalOrderQuantity();
    retrieveData();
    location.reload();
}

/**
 * Remove a selected product
 */
function removeItem() {
    let paragraphs = document.querySelectorAll(".deleteItem");
    paragraphs.forEach((paragraph) => {
        paragraph.addEventListener("click", (e) => {
        const article = paragraph.closest("article");
        const id = article.dataset.id;
        const color = article.dataset.color;
        const item = cart.findIndex(
            (e) => e.productId === id && e.color === color
        );
        if (item != -1) {
            cart.splice(item, 1);
            localStorage.setItem("orders", JSON.stringify(cart));
            location.reload();
        }
        });
    });
}

/**
 * Submit the user form
 */
function submitForm() {
    const submitButton = document.querySelector("#order");
    submitButton.addEventListener("click", (e) => {
        manageFormDatas(e);
    });
}

/**
 * Send user data to api
 * @param {Event} e - Mouse event
 * @returns 
 */
function manageFormDatas(e) {
  e.preventDefault();
  if (cart.length === 0) {
    alert(`Merci de choisir au moins un canapé`);
    return;
  }
  if (validateForm()) {
    const jsonBody = makeJsonBody();
      fetch("http://localhost:3000/api/products/order", {
          method: "POST",
          headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
          },
          body: JSON.stringify(jsonBody),
      })
          .then((response) => {
              if (response.ok) {
                  return response.json();
              }
          })
          .then((data) => {
              const orderId = data.orderId
              redirectToConfirmation(orderId);
          })
      .catch((err) => console.error(err));
  }
}

/**
 * Cheks the user datas validity
 * @return {boolean} retError
 */
function validateForm() {
    let retError = true;

    //Validate firstName
    const firstName = document.querySelector("#firstName").value.trim();
    const firstNameRegex = /^[a-zA-Z\s]+$/;
    if (firstNameRegex.test(firstName) === false) {
        retError = false;
        firstNameErrorMsg.innerText = `Veuillez s'il vous plaît entrer un prénom valide`;
    }

        // Validate Name
    const lastName = document.querySelector("#lastName").value.trim();
    const lastNameRegex = /^[a-zA-Z\s]+$/;
    if (lastNameRegex.test(lastName) === false) {
        retError = false;
        lastNameErrorMsg.innerText = `Veuillez s'il vous plaît entrer un nom valide`;
    }
    
    // Validate adress
    const address = document.querySelector("#address").value.trim();
    const addressRegex = /^[-\w\s]+$/;
    if (addressRegex.test(address) === false) {
        retError = false;
        addressErrorMsg.innerText = `Veuillez s'il vous plaît entrer une addresse valide`;
    }
        
    // Validate city
        const city = document.querySelector("#city").value.trim(); 
    const cityRegex = /^[-\w\s]+$/;
    if (cityRegex.test(city) === false) {
        retError = false;
        cityErrorMsg.innerText = `Veuillez s'il vous plaît entrer une ville valide`;
    }
    // Validate email
        const email = document.querySelector("#email").value.trim();  
    const emailRegex = /^[\w\.\-]+@([\w\.])+[\w-]{2,4}$/;
    if (emailRegex.test(email) === false) {
        retError = false;
        emailErrorMsg.innerText = `Veuillez s'il vous plaît entrer une addresse e-mail valide`;
    }
    return retError;
}

/**
 *  Make the request body
 * @return {Json}
 */
function makeJsonBody() {
  const form = document.querySelector(".cart__order__form");
  const firstName = form.elements.firstName.value;
  const lastName = form.elements.lastName.value;
  const address = form.elements.address.value;
  const city = form.elements.city.value;
  const email = form.elements.email.value;
  const jsonBody = {
    contact: {
      firstName: firstName,
      lastName: lastName,
      address: address,
      city: city,
      email: email,
    },
    products: getIdFromStorage(),
  };
  return jsonBody;
}

/**
 * Make the ids array
 * @return {[id]}
 */
function getIdFromStorage() {
  let ids = [];
  cart.forEach((order) => {
    ids.push(order.productId);
  });
  return ids;
}

/**
 * Redirect to confirmation page
 * @param {String} orderId - the user order id
 */
function redirectToConfirmation(orderId) {
  window.location.href = `./confirmation.html?orderId=${orderId}`;
}
