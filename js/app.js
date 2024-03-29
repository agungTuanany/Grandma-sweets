/*
document.getElementById("cart-info").addEventListener("click", function() {
  const cart = document.getElementById("cart");
  cart.classList.toggle("show-cart");
  console.log(cart);
});
*/

/* vanilla JS */
const productsDOM = document.querySelector('.store-item');
const cartItems = document.querySelector('.cart-items');
const cartTotal = document.querySelector('.item-total');
const cartItemTotal = document.querySelector('.cart-item-total');
const cartContent =document.querySelector('.cart-content');
const total = document.querySelector('.cart-total-container');

// cart
let cart = [];

// buttons
let buttonsDOM = [];

class Products {
  async getProducts() {
    try {
      let result = await fetch('products.json');
      let data = await result.json();
      let products = data.items;
      //console.log(products);
      products = products.map(item => {
        const { title, price } = item.fields;
        const { id } = item.sys;
        const image = item.fields.image.fields.file.url;
        return { title, price, id, image };
      });
      return products;
    } catch (error) {
      console.log(error);
    }
  };

}

class UI {
  displayProducts(products) {
    let result = '';
    products.forEach(product => {
      result += `
        <!-- single item -->
        <div class='col-10 col-sm-6 col-lg-4 mx-auto my-3 store-item sweets' data-item='sweets'>
          <div class='card single-item'>
            <div class='img-container'>
              <img src=${product.image} class='card-img-top store-img' alt=${product.title}>
              <button class='bag-button store-item-icon' data-id=${product.id}>
                <i class='fas fa-shopping-cart'></i>
                add to bag
              </button>
            </div>
            <div class='card-body'>
              <div class='card-text d-flex justify-content-between text-capitalize'>
                <h5 id='store-item-name'> ${product.title}</h5>
                <h5 class='store-item-value'>$ <strong id='store-item-price' class='font-weight'>${product.price}</strong></h5>
              </div>
            </div>
          </div>
        </div>
        <!-- end of single item -->

      `;
    });
    productsDOM.innerHTML = result;
  };

  getBagButtons() {
    const buttons = [...document.querySelectorAll('.bag-button')];
    buttonsDOM = buttons;
    // console.log(buttons)
    buttons.forEach(button => {
      let id = button.dataset.id;
      // console.log(id);
      let inCart = cart.find(item => item.id === id);
      // console.log(inCart);
      if(inCart) {
        button.innerText = 'In Cart';
        button.disabled = true;
      } else {
        button.addEventListener('click', (event) => {
          // console.log(event);
          event.target.innerText = 'in Cart';
          event.target.disabled = true;
          // 1. get product from products
          let cartItem = {...Storage.getProduct(id), amount: 1};
          //console.log(cartItem);
          // 2. add product to the cart
          cart = [...cart, cartItem];
          // console.log(cart);
          // 3. save cart in local storage
          Storage.saveCart(cart);
          // 4. set cart values
          this.setCartValues(cart);
          // 5. display cart item | cartItem refer to let cartItem
          this.addCartItem(cartItem)
          // 6. show the cart
        });
      }
    });
  };

  setCartValues(cart) {
    let tempTotal = 0;
    let itemsTotal = 0;

    cart.map(item => {
      tempTotal += item.price * item.amount;
      itemsTotal += item.amount;
    });
    cartTotal.innerText = parseFloat(tempTotal.toFixed(2));
    cartItems.innerText = itemsTotal;
    cartItemTotal.innerText = parseFloat(tempTotal.toFixed(2));
    //console.log(cartTotal, cartItems);
  };

  addCartItem(item) {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item', 'd-flex', 'justify-content-between', 'text-capitalize', 'my-3');
    cartItem.innerHTML = `
      <img src=${item.image} class='item-img img-fluid rounded-circle' id='item-img' alt=''>
      <div class='item-text'>
        <p id='cart-item-title' class='font-weight-bold mb-0'>${item.title}</p>
        <span>$ </span>
        <span id='cart-item-price' class='cart-item-price mb-0'>${item.price}</span>
      </div>
      <a href='#' id='cart-item-remove' class='cart-item-remove'><i class='fas fa-trash'></i></a>
    `;
    cartContent.insertBefore(cartItem,total );
  };

}

class Storage {
  static saveProducts(products) {
    localStorage.setItem("products", JSON.stringify(products));
  };

  static getProduct(id) {
    let products = JSON.parse(localStorage.getItem('products'));
    return products.find(product => product.id === id);
  };

  static saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
  };
};







document.addEventListener('DOMContentLoaded', () => {
  const ui = new UI();
  const products = new Products();

  products.getProducts().then(products => {
    ui.displayProducts(products);
    Storage.saveProducts(products);
  }).then(() => {
    ui.getBagButtons();
  })

});

(function() {

  const cartInfo = document.getElementById('cart-info');
  const cart = document.getElementById('cart');

  cartInfo.addEventListener('click', () => {
    cart.classList.toggle('show-cart');
    console.log( cart );
  })

})();

/*
document.getElementById("cart-info").addEventListener("click", function() {
  const cart = document.getElementById("cart");
  cart.classList.toggle("show-cart");
  console.log(cart);
});
*/

(function() {

  const cartBtn = document.querySelectorAll('.store-item-icon');


  cartBtn.forEach(btn => {
    btn.addEventListener('click',(event) => {
      //console.log(event.targert);

      if (event.target.parentElement.classList.contains('store-item-icon')) {
        //console.log(event.target.parentElement.previousElementsSibling.src);
        let fullPath = event.target.parentElement.previousElementSibling.src;
        let pos = fullPath.indexOf('img') + 3;
        let partPath = fullPath.slice(pos);

        const item = {};
        item.img = `img-cart${partPath}`;
        let name = event.target.parentElement.parentELement.nextElementSibling.children[0].children[0].textContent;
        item.name = name;
        let price = event.target.parentElement.parentELement.nextElementSibling.children[0].children[1].textContent;
        let finalPrice = price.slice(1).trim();
        item.price = finalPrice;
        // console.log(finalPrice);

        // console.log(name);

        // console.log(item);

        const cartItem = document.createElement('div');
        cartItem.classList.add('cart-item ', 'd-flex', 'justify-content-between', 'text-capitalize', 'my-3');
        cartItem.innerHTML = `

          <img src='${item.img}' class='img-fluid rounded-circle' id='item-img' alt='item-cart'>
          <div class='item-text'>
            <p id='cart-item-title' class='font-weight-bold mb-0'>${item.name}</p>
            <span>$</span>
            <span id='cart-item-price' class='cart-item-price'>${item.price}</span>
            <a href="#" id='cart-item-remove' class='cart-item-remove'>
              <i class='fas fa-trash'></i>
            </a>
          </div>
        `;

        // select cart
        const cart =document.getElementByid('cart');
        const total = document.querySelector('.cart-total-container');

        cart.insertBefore(cartItem, total);
        alert('item has been added on cart');

      }
    });
  });


})();

