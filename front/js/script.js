fetch("http://localhost:3000/api/products/")
  .then(function (response) {
    if (response.ok) {
      return response.json();
    }
  })
  .then((data) => retriveApiContent(data))
  .catch((err) =>
    console.log(
      "Erreur de réception de données, veuillez verifier si le serveur a bien été demarrer"
    )
  );

function retriveApiContent(productList) {
  for (const product of productList) {
    const link = document.querySelector("#items");
    link.innerHTML += `
         <a href="./product.html?id=${product._id}">
            <article>
              <img src="${product.imageUrl}" alt="${product.altTxt}">
              <h3 class="productName">${product.name}</h3>
              <span>${product.price} €</span>
              <p class="productDescription">${product.description}</p>
            </article>
          </a>`;
  }
}
