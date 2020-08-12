getShoppingCart();

window.fbAsyncInit = function () {
  FB.init({
    appId: '3210135632370622',
    cookie: true, // Enable cookies to allow the server to access the session.
    xfbml: true, // Parse social plugins on this webpage.
    version: 'v7.0', // Use this Graph API version for this call.
  })
  FB.getLoginStatus(function (response) {
    // See the onlogin handler
    statusChangeCallback(response)
  })
}

function statusChangeCallback(response) {
  // Called with the results from FB.getLoginStatus().
  if (response.status === 'connected') {
    testAPI()
  } else {
    login()
  }
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
        testAPI()
      }
    },
    { scope: 'public_profile,email', return_scopes: true }
  )
}

function testAPI() {
  // Testing Graph API after login.  See statusChangeCallback() for when this call is made.
  console.log('Welcome!  Fetching your information.... ')
  FB.api('/me', 'GET', { fields: 'id,name,email' }, function (
    response
  ) {
    const nameDiv = document.querySelector('.profile__name')
    const emailDiv = document.querySelector('.profile__email')
    const { name, email } = response

    nameDiv.textContent = name
    emailDiv.textContent = email
  })
  FB.api(
    '/me/picture',
    {
      redirect: false,
      height: 200,
      width: 200,
      type: 'normal',
    },
    function (response) {
      console.log(response)
      const picture = response.data.url
      const imgDiv = document.querySelector('.profile__img')
      imgDiv.style.background = 'url(' + picture + ')' + 'no-repeat'
      imgDiv.style.backgroundSize = 'cover'
    }
  )
}

function logout() {
  FB.logout(function(response) {
    window.location.href = "./index.html"
  })
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

