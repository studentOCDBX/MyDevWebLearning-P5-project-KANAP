displayOrderId();

//Récupère le numéro de commande
function getOrderId() {
  const queryParams = window.location.search;
    const urlParams = new URLSearchParams(queryParams);
    return urlParams.get("orderId");
     
}
//Affiche le numéro de commande
function displayOrderId() {
    const orderId = document.querySelector("#orderId");
    orderId.innerText = getOrderId();
    clearStorage();
    
}
//Vide le cache
function clearStorage() {
    localStorage.clear();
}