document.getElementById("cart-info").addEventListener("click", function() {
  const cart = document.getElementById("cart");
  cart.classList.toggle("show-cart");
  console.log(cart);
});

/* vanilla JS */
const productsDOM = document.querySelector('.store-item');

class Products {
  async getProducts() {
    try {
      let result = await fetch('products.json');
      let data = await result.json();
      let products = data.items;
      console.log(products);
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
              <span class='store-item-icon'>
                <i class='fas fa-shopping-cart'></i>
              </span>
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
}

document.addEventListener('DOMContentLoaded', () => {
  const ui = new UI();
  const products = new Products();

  products.getProducts().then(products => {
    ui.displayProducts(products);
  });

});
