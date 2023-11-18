const fs = require('fs');
const path = require('path');

const rootDir = require('../utils/path');

const p = path.join(rootDir, 'data', 'cart.json');

const getProductsFromFile = (callback) => {
  fs.readFile(p, (err, fileContent) => {
    let cart = { products: [], totalPrice: 0 };
    if (err) {
      callback(cart, err);
    } else {
      callback(JSON.parse(fileContent));
    }
  });
};

const customWriteFile = (cart) => {
  fs.writeFile(p, JSON.stringify(cart), (err) => {
    console.log(err);
  });
};

module.exports = class Cart {
  static addProduct({ id, productPrice }) {
    getProductsFromFile((cart) => {
      const existingProductIndex = cart.products.findIndex(
        (product) => product.id === id
      );
      const existingProduct = cart.products[existingProductIndex];

      let updatedProduct;

      if (existingProduct) {
        updatedProduct = {
          ...existingProduct,
          quantity: existingProduct.quantity + 1,
        };
        cart.products[existingProductIndex] = updatedProduct;
      } else {
        updatedProduct = { id, price: productPrice, quantity: 1 };
        cart.products = [...cart.products, updatedProduct];
      }

      cart.totalPrice += +productPrice;
      customWriteFile(cart);
    });
  }

  static deleteProduct({ id }) {
    getProductsFromFile((cart, err) => {
      if (err) {
        return;
      }
      let updatedCart = { ...cart };

      const product = cart.products.find((product) => product.id === id);
      const { quantity, price } = product;

      updatedCart.products = cart.products.filter(
        (product) => product.id !== id
      );
      updatedCart.totalPrice -= +price * +quantity;

      customWriteFile(updatedCart);
    });
  }
};
