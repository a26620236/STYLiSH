getShippingId();
getShoppingCart();

function getShippingId() {
  const shippingId = document.URL.split('?id=')[1]
  const div = document.getElementById('shippingId')

  div.textContent = shippingId
}

function getShoppingCart() {
  let x = document.getElementById('cart')
  let y = document.getElementById('m-cart')

  let items = 0
  const cart = JSON.parse(localStorage.getItem('cart'))

  if (cart && cart.length > 0) {
    for (let index in cart) {
      items += cart[index].qty
    }
    x.dataset.text = items
    y.dataset.text = items
  } else {
    x.dataset.text = 0
    y.dataset.text = 0
  }
}
