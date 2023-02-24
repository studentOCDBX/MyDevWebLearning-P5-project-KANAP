let cart = JSON.parse(localStorage.getItem("orders"));
sortItems(cart);
//Trie puis regroupe  les articles.
function sortItems(cart) {
    cart.sort((e1, e2) => {
      return e1.productId < e2.productId ? -1 : e1.productId > e2.productId ? 1 : 0;
    });
    return cart;
}
// Récupère les données de l'API.
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

//Affiche les données de la page.
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

//Affiche le nombre total d'article.
function displayTotalOrderQuantity() {
    let totalOrderQuantity = 0;
    const totalQuantity = document.querySelector("#totalQuantity");
    cart.forEach((order) => {
        const orderQuantity = order.quantity;
        totalOrderQuantity += orderQuantity;
    });
    totalQuantity.innerText = totalOrderQuantity;
}

//Modifie le nombre de produits choisis.
function adjustItemQuantity() {
    let inputs = document.querySelectorAll(".itemQuantity");
    inputs.forEach((input) => {
        input.addEventListener("change", (e) => {
        adjustTotalQuantityAndTotalCartPrice(input);
        });
    });
}

//Ajuste le nombre total d'article et le prix total du panier.
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

//supprime un produit.
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

//Soumet le formulaire
function submitForm() {
    const submitButton = document.querySelector("#order");
    submitButton.addEventListener("click", (e) => {
        manageFormDatas(e);
    });
}

//Envoie les données saisies par l'utilisateur à L'API.
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

//Vérifie la validité des données saisies par l'utilisateur.
function validateForm(data) {
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

//crée le corps de la requête.
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

//Crée le tableau de string (Id).
function getIdFromStorage() {
  let ids = [];
  cart.forEach((order) => {
    ids.push(order.productId);
  });
  return ids;
}

//Redirige vers la page de confirmation
function redirectToConfirmation(orderId) {
  window.location.href = `./confirmation.html?orderId=${orderId}`;
}
