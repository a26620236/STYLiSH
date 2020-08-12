var source, nextPage, isLoading;
var host = 'https://api.appworks-school.tw/api/1.0/products/';
var slideIndex = 0;

getUrl();
slideShow();
getShoppingCart();

function getUrl() {
  const url = new URL(document.URL)
  const params = url.searchParams
  
  if (params.toString()) {
    if (params.has('tag')) {
      getProducts(params.get('tag'))
    }
    if (params.has('keyword')) {
      getProducts('search?keyword=' + params.get('keyword'))
    }
  }
  else {
    getProducts();
  }
};

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
  source = url.split('?')[0];
  nextPage = res.next_paging;
  const productDiv = document.getElementById('product');
  const products = res.data;
  const clearFix = document.createElement('div');
  
  clearFix.className = 'clear-fix';

  if (products.length > 0) {
    for (let index in products) {
      const newDiv = document.createElement('a')
      const newColorDiv = document.createElement('div')
      const newImg = document.createElement('img')
      const newTitle = document.createElement('span')
      const newPrice = document.createElement('span')
      const clearFix = document.createElement('div')

      newDiv.className = 'product__items'
      newDiv.href = "productDetail.html?id=" + products[index].id

      newImg.src = products[index].main_image
      newDiv.appendChild(newImg)

      for (let color in products[index].colors) {
        const newColor = document.createElement('div')
        newColor.className = 'product__items__color'
        newColor.style.backgroundColor =
          '#' + products[index].colors[color].code
        newColorDiv.appendChild(newColor)
        newDiv.appendChild(newColorDiv)
      }

      newTitle.textContent = products[index].title
      newPrice.textContent = 'NTD.' + products[index].price

      newDiv.appendChild(newTitle)
      newDiv.appendChild(newPrice)
      productDiv.appendChild(newDiv)
    }
    productDiv.appendChild(clearFix)
    isLoading = false
  }
  else {
    const newDiv = document.createElement('h1');
    newDiv.textContent = '查無此商品';
    productDiv.appendChild(newDiv);
    isLoading = false
  }
};

function showPic(res, url) {
  const img = res.data;
  const newDotDiv = document.createElement('div');
  const bannerDiv = document.getElementById('banner')
  const wrapperDiv = document.getElementById('wrapper')

  for (let index in img) {
    const newDiv = document.createElement('div');
    const newInnerDiv = document.createElement('div');
    const newContent = document.createElement('p');
    const re = /\r\n/g;
    let content = img[index].story.replace(re, "<br>");

    newDiv.className = 'banner__img';
    newDotDiv.className = 'banner__dots'
    newInnerDiv.className = 'banner__content';
    newDiv.style.background = "url(" + 'https://api.appworks-school.tw/' + img[index].picture + ")" + "no-repeat";
    newDiv.style.backgroundSize = 'cover';
    newContent.innerHTML = content; 
    bannerDiv.style.setProperty('--n', img.length)

    //create dots
    const newDot = document.createElement('div')
    newDot.className = 'banner__dot'
    newDot.key = index
    newDot.onclick = clickDot
    newDotDiv.appendChild(newDot)

    newInnerDiv.appendChild(newContent);
    newDiv.appendChild(newInnerDiv);
    bannerDiv.appendChild(newDiv);
  };
  wrapperDiv.appendChild(newDotDiv)
  isLoading = false;

  if (!isLoading) {
    autoSlide(slideIndex)
  }
};

function getProducts(key) {
  const productDiv = document.getElementById('product')
  productDiv.innerHTML = ''
  if (key) {
    getData(host + key, showData)
  }
  else {
    getData(host + 'all', showData)
  }
};

document.getElementById('web-input').addEventListener('keydown', (e) => {
  const input = document.getElementById('web-input').value

  if (e.keyCode === 13 && input) {
    window.location.href = './index.html?keyword=' + input
    input.value = ''
  }
});

document.getElementById('mobile-input').addEventListener('keydown', (e) => {
  const input = document.getElementById('mobile-input').value

  if (e.keyCode === 13 && input) {
    window.location.href = './index.html?keyword=' + input
    input.value = ''
  }
});

window.addEventListener('scroll', (e) => {
  if (nextPage && !isLoading) {
    let scrollTop = main.getBoundingClientRect().height - window.innerHeight;
    if ( window.scrollY >= scrollTop - 200) {
      getData(source + '?paging=' + nextPage, showData)
    }
  }
});

function clickInput() {
  document.getElementById('logo').style.display = 'none'
  document.getElementById('mobile-search-img').style.display = 'none'
  document.getElementById('mobile-search').style.display = 'inline'
};

function cancelInput() {
  document.getElementById('logo').style.display = 'inline-block'
  document.getElementById('mobile-search-img').style.display = 'inline-block'
  document.getElementById('mobile-search').style.display = 'none'
};

function slideShow() {
  getData('https://api.appworks-school.tw/api/1.0/marketing/campaigns', showPic)
};

function autoSlide() {
  let banner = document.getElementById('banner');
  let x = document.getElementsByClassName('banner__img');
  let dots = document.getElementsByClassName('banner__dot');
  
  for (let i = 0; i < x.length; i++) {
    
    dots[i].style.backgroundColor = '#' + '9e9e9e'
  };

  slideIndex++;

  if (slideIndex > x.length) slideIndex = 1;

  dots[slideIndex - 1].style.backgroundColor = '#' + 'FFFFFF'
  banner.style.setProperty('--i', slideIndex - 1)
  setTimeout(autoSlide, 10000);
};

function clickDot(e) {
  let banner = document.getElementById('banner')
  let x = document.getElementsByClassName('banner__img')
  let dots = document.getElementsByClassName('banner__dot')

  for (let i = 0; i < x.length; i++) {
    dots[i].style.backgroundColor = '#' + '9e9e9e'
  }
  slideIndex = e.target.key
  e.target.style.backgroundColor = '#' + 'FFFFFF';
  banner.style.setProperty('--i', slideIndex)

};

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

function successSignIn(res) {
  const token = res.data.access_token
  localStorage.setItem('stylish-token', JSON.stringify(token))
}


