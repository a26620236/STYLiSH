var host = 'https://api.appworks-school.tw/api/1.0/'
var url = host + 'order/checkout'
var isLoading;

getShoppingCart()
RunSDK()

if (localStorage.getItem('cart')) {
    getCart();
    document.getElementById('submit').addEventListener('click', onSubmit)
    document
      .getElementById('mobile-submit')
      .addEventListener('click', onSubmit)
  }

function getCart() {
  let items = JSON.parse(localStorage.getItem('cart'))
  const content = document.getElementById('items')
  const total = document.querySelector('.shopping__cart__subtotal')
  const totalPrice = document.querySelector('.shopping__cart__totolprice')
  const shippingFee = document.querySelector('.shopping__cart__shippingfee')
  let count = 0;

  let newDiv = document.createElement('div');
  let newDiv1 = document.createElement('div');
  let newDiv2 = document.createElement('div');
  let newDiv3 = document.createElement('div');
  let newDiv4 = document.createElement('div');
  let newDiv5 = document.createElement('div');
  let mobileDiv = document.createElement('div');
  let input = document.createElement('input');

  for(let index in items) {
    newDiv = document.createElement('div')
    newDiv.className = 'item';

    //product detail
    newDiv1 = document.createElement('div');

    newDiv2 = document.createElement('div');
    newDiv2.className = 'item__image';
    newDiv2.style.background = 'url(' + items[index].main_image + ')' + 'no-repeat'
    newDiv2.style.backgroundSize = 'cover'
    newDiv1.appendChild(newDiv2);

    newDiv2 = document.createElement('div')
    newDiv2.className = 'item__inform';
    newDiv3 = document.createElement('div');
    newDiv3.textContent = items[index].name;
    newDiv2.appendChild(newDiv3)

    newDiv3 = document.createElement('div')
    newDiv3.textContent = items[index].id
    newDiv2.appendChild(newDiv3)

    newDiv3 = document.createElement('div')
    newDiv4 = document.createElement('div')
    newDiv4.innerHTML = '白色' + '&nbsp;' + '|' + '&nbsp;' + items[index].color.name
    newDiv3.appendChild(newDiv4)

    newDiv4 = document.createElement('div')
    newDiv4.innerHTML = '尺寸' + '&nbsp;' + '|' + '&nbsp;' + items[index].size
    newDiv3.appendChild(newDiv4)
    newDiv2.appendChild(newDiv3)

    newDiv1.appendChild(newDiv2)
    newDiv.appendChild(newDiv1)

    //mobile-items-header
    newDiv1 = document.createElement('div');
    newDiv1.className = 'mobile-items-header';
    newDiv2 = document.createElement('div');
    newDiv2.textContent = '數量';
    newDiv1.appendChild(newDiv2)

    newDiv2 = document.createElement('div')
    newDiv2.textContent = '單價'
    newDiv1.appendChild(newDiv2)
    
    newDiv2 = document.createElement('div')
    newDiv2.textContent = '小計'
    newDiv1.appendChild(newDiv2)

    newDiv.appendChild(newDiv1)

    //product quantity and price
    newDiv1 = document.createElement('div')

    newDiv2 = document.createElement('div')
    newDiv2.className = 'item__quantity';
    input = document.createElement('input')
    input.type = 'number'
    input.id = items[index].id
    input.value = items[index].qty
    input.colorName = items[index].color.name
    input.Size = items[index].size
    input.min = 1
    input.max = 10
    input.addEventListener('click', editItemQuantity)
    input.addEventListener('keydown', editItemQuantity)
    newDiv2.appendChild(input)
    newDiv1.appendChild(newDiv2)

    newDiv2 = document.createElement('div')
    newDiv2.className = 'item__price'
    newDiv2.textContent = 'NT.' + items[index].price
    newDiv1.appendChild(newDiv2)

    newDiv2 = document.createElement('div')
    newDiv2.className = 'item__total'
    newDiv2.textContent = 'NT.' + items[index].price * items[index].qty
    newDiv1.appendChild(newDiv2)

    newDiv2 = document.createElement('div')
    newDiv2.className = 'item__remove'
    newDiv2.id = items[index].id
    newDiv2.value = items[index].qty
    newDiv2.colorName = items[index].color.name
    newDiv2.Size = items[index].size
    newDiv2.addEventListener('click', deleteItem)
    newDiv1.appendChild(newDiv2)
    
    newDiv.appendChild(newDiv1)
    content.appendChild(newDiv)
  }
  
  //count total price
  if (items.length > 0) {
    for (let index in items) {
      count += parseInt(items[index].price * items[index].qty)
    }
    total.textContent = count
    totalPrice.textContent = count + parseInt(shippingFee.textContent)
  } else {
    total.textContent = count
    totalPrice.textContent = 0
    shippingFee.textContent = 0
  }
}

function editItemQuantity(e) {
  if (e.keycode === 13 || e.target.value) {
    if (e.target.value < 0) {
      e.target.value = 1
    }

    if (e.target.value > 10) {
      e.target.value = 10
    }

    let items = JSON.parse(localStorage.getItem('cart'))
    let price = e.target.parentElement.nextSibling.textContent.split('NT.')[1]
    let { id, colorName, Size } = e.target
    id = parseInt(id)

    let total = document.querySelector('.shopping__cart__subtotal')
    let totalPrice = document.querySelector('.shopping__cart__totolprice')
    let shippingFee = document.querySelector('.shopping__cart__shippingfee')
    let count = 0

    //edit item
    for (let index in items) {
      if (
        items[index].id === id &&
        items[index].color.name === colorName &&
        items[index].size === Size
      ) {
        items[index].qty = parseInt(e.target.value)
        localStorage.setItem('cart', JSON.stringify(items))
        e.target.parentElement.nextSibling.nextSibling.textContent =
          'NT.' + price * e.target.value
      }
    }
    //count total price
    if (items.length > 0) {
      for (let index in items) {
        count += parseInt(items[index].price * items[index].qty)
      }
      total.textContent = count
      totalPrice.textContent = count + parseInt(shippingFee.textContent)
    } else {
      total.textContent = count
      totalPrice.textContent = 0
      shippingFee.textContent = 0
    }
    getShoppingCart()
  }
}

function deleteItem(e) {
  let items = JSON.parse(localStorage.getItem('cart')) 
  let { id, colorName, Size } = e.target
  id = parseInt(id) 

  let total = document.querySelector('.shopping__cart__subtotal')
  let totalPrice = document.querySelector('.shopping__cart__totolprice')
  let shippingFee = document.querySelector('.shopping__cart__shippingfee')
  let count = 0

  //remove item
  for (let index in items) {
    if (
      items[index].id === id &&
      items[index].color.name === colorName &&
      items[index].size === Size
    ) {
      items.splice(index, 1)
      localStorage.setItem('cart', JSON.stringify(items))
      e.target.parentElement.parentElement.remove()
    }
  }

  //count total price
  if (items.length > 0) {
    for (let index in items) {
      count += parseInt(items[index].price * items[index].qty)
    }
    total.textContent = count
    totalPrice.textContent = count + parseInt(shippingFee.textContent)
  }
  else {
    total.textContent = count
    totalPrice.textContent = 0
    shippingFee.textContent = 0
  }
  getShoppingCart()
}
function getShoppingCart() {
  let x = document.getElementById('cart')
  let y = document.getElementById('m-cart')
  let z = document.getElementById('cartquantity')
  let alert = document.querySelector('.items__empty')

  let items = 0
  const cart = JSON.parse(localStorage.getItem('cart'))

  if (cart && cart.length > 0) {
    for (let index in cart) {
      items += cart[index].qty
    }
    x.dataset.text = items
    y.dataset.text = items
    z.textContent = '( ' + items + ' )'
    alert.style.display = 'none'
  } else {
    x.dataset.text = 0
    y.dataset.text = 0
    z.textContent = '( ' + 0 + ' )'
    alert.style.display = 'block'
  }
}

function RunSDK() {
  TPDirect.setupSDK(
    12348,
    'app_pa1pQcKoY22IlnSXq5m5WP5jFKzoRG58VEXpT7wU62ud7mMbDOGzCYIlzzLF',
    'sandbox'
  )
  TPDirect.card.setup({
    // Display ccv field
    fields: {
      number: {
        // css selector
        element: '#card-number',
        placeholder: '**** **** **** ****',
      },
      expirationDate: {
        // DOM object
        element: document.getElementById('card-expiration-date'),
        placeholder: 'MM / YY',
      },
      ccv: {
        element: '#card-ccv',
        placeholder: 'ccv',
      },
    },
    styles: {
      // Style all elements
      input: {
        color: 'gray',
      },
      // Styling ccv field
      'input.ccv': {
        // 'font-size': '16px'
      },
      // Styling expiration-date field
      'input.expiration-date': {
        // 'font-size': '16px'
      },
      // Styling card-number field
      'input.card-number': {
        // 'font-size': '16px'
      },
      // style focus state
      ':focus': {
        // 'color': 'black'
      },
      // style valid state
      '.valid': {
        color: 'green',
      },
      // style invalid state
      '.invalid': {
        color: 'red',
      },
      // Media queries
      // Note that these apply to the iframe, not the root window.
      '@media screen and (max-width: 400px)': {
        input: {
          color: 'orange',
        },
      },
    },
  })
}

function onSubmit(event) {
    const name = document.getElementById('name').value
    const phone = document.getElementById('phone').value
    const address = document.getElementById('address').value
    const email = document.getElementById('email').value
  
  if (!name || !phone || !address || !email) {
    alert('請輸入完整訂購資料')
    window.location.href = './shoppingCart.html'
  }
  
  if (!isLoading && name && phone && address && email) {
    isLoading = true
    let container = document.getElementById('main')
    let newDiv = document.createElement('div')
    newDiv.className = 'loading'
    container.appendChild(newDiv)

    newDiv = document.createElement('div')
    newDiv.className = 'loading__img'
    container.appendChild(newDiv)

    // Get prime
    TPDirect.card.getPrime((result) => {
      if (result.status !== 0) {
        alert('get prime error ' + result.msg)
        return
      }
      checkOutApi(result.card.prime)

      // send prime to your server, to pay with Pay by Prime API .
      // Pay By Prime Docs: https://docs.tappaysdk.com/tutorial/zh/back.html#pay-by-prime-api
    })
  }
}

function checkOutApi(res) {
  let deliverytime = document.getElementsByName('deliverytime')

  //get deliverytime
  for (let i = 0; i < deliverytime.length; i++) {
    if (deliverytime[i].checked) {
      deliverytime = deliverytime[i].value
    }
  }

  const cart = JSON.parse(localStorage.getItem('cart'))
  const token = JSON.parse(localStorage.getItem('stylish-token'))
  const prime = res
  const subtotal = document.querySelector('.shopping__cart__subtotal').textContent
  const freight = document.querySelector('.shopping__cart__shippingfee').textContent
  const total = document.querySelector('.shopping__cart__totolprice').textContent
  const recipient = {
    name: document.getElementById('name').value,
    phone: document.getElementById('phone').value,
    address: document.getElementById('address').value,
    email: document.getElementById('email').value,
    time: deliverytime,
  }
  const list = cart
  let data = {
    prime,
    order: {
      shipping: 'delivery',
      payment: 'credit_card',
      subtotal,
      freight,
      total,
      recipient,
      list,
    },
  }
  
  if (token) {
    postUserData(JSON.stringify(data), url, token, getSuccessRes)
    return
  }
  postData(JSON.stringify(data), url, getSuccessRes)
}

function postData(data,url, callback) {
  const xhr = new XMLHttpRequest()
  xhr.open('POST', url);
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.responseType = 'json';
  xhr.send(data);
  xhr.onload = () => {
    if (xhr.readyState == 4) {
      callback(xhr.response, url)
    }
  }
};

function postUserData(data, url, token, callback) {
  const xhr = new XMLHttpRequest()
  xhr.open('POST', url)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.setRequestHeader('Authorization', 'Bearer ' + token)
  xhr.responseType = 'json'
  xhr.send(data)
  xhr.onload = () => {
    if (xhr.readyState == 4) {
      callback(xhr.response, url)
    }
  }
}

function getSuccessRes(res) {
  isLoading = false
  window.location.href = './thankYouPage.html?id=' + res.data.number
}


//fb login
function statusChangeCallback(response) {
  // Called with the results from FB.getLoginStatus().
  console.log('statusChangeCallback')
  console.log(response) // The current login status of the person.
  if (response.status === 'connected') {
    window.location.href = './profile.html'
  } else {
    login()
  }
}

function checkLoginState() {
  // Called when a person is finished with the Login Button.
  FB.getLoginStatus(function (response) {
    // See the onlogin handler
    statusChangeCallback(response)
  })
}

window.fbAsyncInit = function () {
  FB.init({
    appId: '3210135632370622',
    cookie: true, // Enable cookies to allow the server to access the session.
    xfbml: true, // Parse social plugins on this webpage.
    version: 'v7.0', // Use this Graph API version for this call.
  })
}
;(function (d, s, id) {
  // Load the SDK asynchronously
  var js,
    fjs = d.getElementsByTagName(s)[0]
  if (d.getElementById(id)) return
  js = d.createElement(s)
  js.id = id
  js.src = 'https://connect.facebook.net/en_US/sdk.js'
  fjs.parentNode.insertBefore(js, fjs)
})(document, 'script', 'facebook-jssdk')

function login() {
  FB.login(
    function (response) {
      if (response.status === 'connected') {
        const token = response.authResponse.accessToken
        const url = 'https://api.appworks-school.tw/api/1.0/user/signin'
        const data = {
          provider: 'facebook',
          access_token: token,
        }
        postData(JSON.stringify(data), url, successSignIn)
      }
    },
    { scope: 'public_profile,email', return_scopes: true }
  )
}

function postData(data, url, callback) {
  const xhr = new XMLHttpRequest()
  xhr.open('POST', url)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.responseType = 'json'
  xhr.send(data)
  xhr.onload = () => {
    if (xhr.readyState == 4) {
      callback(xhr.response, url)
    }
  }
}

function successSignIn(res) {
  const token = res.data.access_token
  localStorage.setItem('stylish-token', JSON.stringify(token))
}




