var host = 'https://api.appworks-school.tw/api/1.0/products/'
var variants, id, stock, title, main_image, price, color, colorData, colorName, size, quantity

getProductDetail();
getShoppingCart();

function getProductDetail() {
  const productId = document.URL.split('?id=')[1];
  getData(host + 'details?id=' + productId, showData)
}

function getData(url, callback) {
  isLoading = true;
  const xhr = new XMLHttpRequest()
  xhr.open('GET', url);
  xhr.responseType = 'json';
  xhr.send();
  xhr.onload = () => {
    if (xhr.readyState == 4) {
      callback(xhr.response, url)
    }
  }
};

function showData(res, url) {
  const product = res.data;
  variants = product.variants
  id = product.id
  title = product.title
  main_image = product.main_image
  price = product.price
  colorData = product.colors

  const header = document.getElementById('header');
  const cuttingline = document.getElementById('cuttingline');
  const content = document.getElementById('content');

  let newDiv = document.createElement('div');
  let newDiv1 = document.createElement('div');
  let newDiv2 = document.createElement('div');
  let newDiv3 = document.createElement('div');
  let newDiv4 = document.createElement('div');
  let newSpan = document.createElement('span');
  let newP = document.createElement('p');
  let newBr = document.createElement('br');

  //product img
  newDiv = document.createElement('div');
  newDiv.className = 'productdetail__header__img';
  newDiv.style.background = "url(" + product.main_image + ")" + "no-repeat";
  newDiv.style.backgroundSize = 'cover';
  header.appendChild(newDiv);

  //product detail
  newDiv = document.createElement('div');
  newDiv.className = 'productdetail__header__checkout';

  //title
  newDiv1 = document.createElement('div')
  newDiv1.className = 'checkout__title'
  newDiv1.textContent = product.title;
  newDiv.appendChild(newDiv1)

  //id
  newDiv1 = document.createElement('div')
  newDiv1.className = 'checkout__id'
  newDiv1.textContent = product.id;
  newDiv.appendChild(newDiv1)
  
  //price
  newDiv1 = document.createElement('div')
  newDiv1.className = 'checkout__price'
  newDiv1.textContent = 'NTW.' + product.price;
  newSpan = document.createElement('span')
  newDiv1.appendChild(newSpan)
  newDiv.appendChild(newDiv1)

  //prodcut select
  //color
  newDiv1 = document.createElement('div')
  newDiv1.className = 'checkout__select'

  newSpan = document.createElement('span')
  newSpan.textContent = '顏色|';
  newDiv2 = document.createElement('div')
  newDiv2.appendChild(newSpan);

  for (let i = 0; i < product.colors.length; i++) {
    newDiv3 = document.createElement('div')
    newDiv3.className = 'checkout__select__color'
    newDiv3.style.backgroundColor = '#' + product.colors[i].code;
    newDiv3.color = product.colors[i].code;

    if (i === 0) {
      newDiv3.classList.add('c__color');
      color = product.colors[i].code;
    }

    newDiv3.addEventListener('click', selectColor);
    newDiv2.appendChild(newDiv3)
  }
  newDiv1.appendChild(newDiv2)

  //新增 colorName for localStorage
  for (let i = 0; i < colorData.length; i++) {
    if (colorData[i].code === color) {
      colorName = colorData[i].name
    }
  }

  //size
  newDiv2 = document.createElement('div')

  newSpan = document.createElement('span')
  newSpan.textContent = '尺寸|';
  newDiv2.appendChild(newSpan);

  for (let i = 0; i < product.sizes.length; i++) {
    newDiv3 = document.createElement('div');
    newDiv3.className = 'checkout__select__size';
    newDiv3.textContent = product.sizes[i];

    if (i === 0) {
      newDiv3.classList.add('c__size')
      size = product.sizes[i]
    }

    newDiv3.addEventListener('click', selectSize)
    newDiv2.appendChild(newDiv3);
  }
  newDiv1.appendChild(newDiv2)

  //stock
  newDiv2 = document.createElement('div')

  newSpan = document.createElement('span')
  newSpan.textContent = '庫存|'
  newDiv2.appendChild(newSpan)

  newDiv3 = document.createElement('div')
  newDiv2.appendChild(newDiv3)
  newDiv3.className = 'checkout__select__stock'
  newDiv3.textContent = '0000'
  newDiv1.appendChild(newDiv2)

  //quantity
  newSpan = document.createElement('span')
  newSpan.textContent = '數量|'
  newDiv2 = document.createElement('div')
  newDiv2.appendChild(newSpan)
  newDiv3 = document.createElement('div')
  newDiv3.className = 'checkout__select__quantity'

  newDiv4 = document.createElement('div')
  newDiv4.className = 'checkout__select__minus'
  newDiv4.textContent = '-';
  newDiv4.addEventListener('click', minusNum)
  newDiv3.appendChild(newDiv4)

  newDiv4 = document.createElement('div')
  newDiv4.className = 'c__quantity'
  newDiv4.textContent = '1';
  quantity = 1
  newDiv3.appendChild(newDiv4)

  newDiv4 = document.createElement('div')
  newDiv4.className = 'checkout__select__add'
  newDiv4.textContent = '+';
  newDiv4.addEventListener('click', addNum)
  newDiv3.appendChild(newDiv4)

  newDiv2.appendChild(newDiv3)

  newDiv1.appendChild(newDiv2)

  //shopping cart
  newDiv2 = document.createElement('div')
  newDiv2.className = 'checkout__select__send'
  newDiv2.textContent = '加入購物車'
  newDiv2.onclick = addToCart
  newDiv1.appendChild(newDiv2)
  newDiv.appendChild(newDiv1)

  //product inform
  newDiv1 = document.createElement('div')
  newDiv1.className = 'checkout__inform'

  newSpan = document.createElement('span')
  newSpan.textContent = '*' + product.note;
  newDiv1.appendChild(newSpan)

  newSpan = document.createElement('span')
  newSpan.textContent = product.texture;
  newDiv1.appendChild(newSpan)

  newP = document.createElement('p')
  const re = /\r\n/g;
  let des = product.description.replace(re, '<br>')
  newP.innerHTML = des;
  newDiv1.appendChild(newP)

  newDiv2 = document.createElement('div')

  newSpan = document.createElement('span')
  newSpan.textContent = '素材產地 / ' + product.place
  newDiv2.appendChild(newSpan)

  newBr = document.createElement('br')
  newDiv2.appendChild(newBr)

  newSpan = document.createElement('span')
  newSpan.textContent = '加工產地 / ' + product.place
  newDiv2.appendChild(newSpan)
  
  newDiv1.appendChild(newDiv2)

  newDiv.appendChild(newDiv1)
  header.appendChild(newDiv)

  //cuttingline
  newDiv = document.createElement('div')
  newDiv.textContent = '細部說明'
  cuttingline.appendChild(newDiv)

  newDiv = document.createElement('div')
  cuttingline.appendChild(newDiv)
  
  //content
  newDiv = document.createElement('div')
  newDiv.className = 'productdetail__content__desp'
  newDiv.textContent = product.story

  content.appendChild(newDiv)

  for (let i = 0; i < product.images.length; i++) {
    newDiv = document.createElement('div')
    newDiv.className = 'productdetail__content__img'
    newDiv.style.background = 'url(' + product.images[i] + ')' + 'no-repeat'
    content.appendChild(newDiv)
  }
  getStock()
  cleanQuantity()
  getCart()
}

document.getElementById('web-input').addEventListener('keydown', (e) => {
  const input = document.getElementById('web-input').value

  if (e.keyCode === 13 && input) {
    window.location.href = './index.html?keyword=' + input
    input.value = ''
  }
})

document.getElementById('mobile-input').addEventListener('keydown', (e) => {
  const input = document.getElementById('mobile-input').value

  if (e.keyCode === 13 && input) {
    window.location.href = './index.html?keyword=' + input
    input.value = ''
  }
})

const selectColor = (e) => {
  let x = document.getElementsByClassName(e.target.className)
  for (let i = 0; i < x.length; i++) { 
    x[i].classList.remove('c__color')
  }
  e.target.classList.add('c__color')
  color = e.target.color

  for (let i = 0; i < colorData.length; i++) {
    if (colorData[i].code === color) {
      colorName = colorData[i].name
    }
  }
  getStock()
}

const selectSize = (e) => {
  let x = document.getElementsByClassName(e.target.className)
  for (let i = 0; i < x.length; i++) {
    x[i].classList.remove('c__size')
  }
  e.target.classList.add('c__size')
  size = e.target.textContent
  getStock()
}

const addNum = (e) => {
  if (quantity < stock) {
    quantity++
    e.target.previousSibling.textContent = quantity
  }
}

const minusNum = (e) => {
  if (quantity > 1) {
    quantity--
    e.target.nextSibling.textContent = quantity
  }
}

function getStock() {
  const x = document.querySelector('.checkout__select__stock')
  const y = document.querySelector('.checkout__select__quantity')
  const z = document.querySelector('.checkout__select__send')

  for (let i = 0; i < variants.length; i++) {
    if ((variants[i].color_code === color) && (variants[i].size === size)) {
        stock = variants[i].stock
        x.textContent = stock
        if (stock === 0) {
          y.parentElement.style.display = 'none'
          z.textContent = '已售完'
          z.style.opacity = '0.3'
        }
        else {
          y.parentElement.style.display = 'flex'
          z.textContent = '加入購物車'
          z.style.opacity = '1'
        }
        return
    }
  }
}

function cleanQuantity() {
  let x = document.getElementsByClassName('checkout__select__color')
  let y = document.getElementsByClassName('checkout__select__size')
  let z = document.querySelector('.c__quantity')
  
  for(let i = 0; i < x.length; i++) {
    x[i].addEventListener('click', () => {
      quantity = 1
      z.textContent = 1
    })
  }
  for (let i = 0; i < y.length; i++) {
    y[i].addEventListener('click', () => {
      quantity = 1
      z.textContent = 1
    })
  }
}

function addToCart() {
  let item = {
    name: title,
    main_image,
    size,
    price,
    qty: quantity,
    id,
    color: {
      code: color,
      name: colorName,
    }
  }
  if (!localStorage.getItem('cart')) {
    let cart = []
    localStorage.setItem('cart', JSON.stringify(cart))
  }
  const cart = JSON.parse(localStorage.getItem('cart'))

  for(let index in cart) {
    if (cart[index].id === id && cart[index].color.code === color && cart[index].size === size) {
      cart[index].quantity = item.quantity
      localStorage.setItem('cart', JSON.stringify(cart))
      getCart()
      return
    }
  }
  cart.push(item)
  localStorage.setItem('cart', JSON.stringify(cart))
  getCart()
}

function getCart() {
  let x = document.getElementById('cart')
  let y = document.getElementById('m-cart')
  
  let items = 0;
  const cart = JSON.parse(localStorage.getItem('cart'));
  if (cart) {
    for (let index in cart) {
      items += cart[index].qty
    }
    x.dataset.text = items
    y.dataset.text = items
  }
  else {
    x.dataset.text = 0
    y.dataset.text = 0
  }
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
