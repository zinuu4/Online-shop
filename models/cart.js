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

const customWriteFile = (cart, callback) => {
  fs.writeFile(p, JSON.stringify(cart), (err) => {
    if (err) {
      console.log(err);
    } else {
      callback();
    }
  });
};

module.exports = class Cart {
  static fetchCart(callback) {
    getProductsFromFile(callback);
  }

  static deleteProduct(id, callback = () => {}) {
    getProductsFromFile((cart, err) => {
      if (err) {
        return;
      }

      let updatedCart = { ...cart };

      const product = cart.products.find((product) => product.id === id);

      if (!product) {
        return;
      }

      const { price, quantity } = product;

      updatedCart.products = cart.products.filter(
        (product) => product.id !== id
      );
      updatedCart.totalPrice -= +price * +quantity;

      customWriteFile(updatedCart, callback);
    });
  }
};
