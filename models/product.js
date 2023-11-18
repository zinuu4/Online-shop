const fs = require('fs');
const path = require('path');

const rootDir = require('../utils/path');
const Cart = require('./cart');

const p = path.join(rootDir, 'data', 'products.json');

const getProductsFromFile = (callback) => {
  fs.readFile(p, (err, fileContent) => {
    if (err) {
      callback([], err);
    } else {
      callback(JSON.parse(fileContent));
    }
  });
};

const customWriteFile = (products, callback) => {
  fs.writeFile(p, JSON.stringify(products), (err) => {
    if (err) {
      console.log(err);
    } else {
      callback();
    }
  });
};

module.exports = class Product {
  constructor({ title, imageUrl, description, price }) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
  }

  save() {
    this.id = Math.random().toString();
    getProductsFromFile((products) => {
      products.push(this);
      customWriteFile(products);
    });
  }

  static fetchAll(callback) {
    getProductsFromFile(callback);
  }

  static findById(id, callback) {
    getProductsFromFile((products) => {
      const desiredProduct = products.find((product) => product.id === id);
      callback(desiredProduct || {});
    });
  }

  static updateProduct(updatedProduct, callback) {
    getProductsFromFile((products) => {
      const desiredProductIndex = products.findIndex(
        (product) => product.id === updatedProduct.id
      );
      products[desiredProductIndex] = updatedProduct;
      customWriteFile(products, callback);
    });
  }

  static deleteProduct(id, callback) {
    getProductsFromFile((products, err) => {
      if (err) {
        return;
      }

      Cart.deleteProduct({ id });

      const updatedProducts = products.filter((product) => product.id !== id);
      customWriteFile(updatedProducts, callback);
    });
  }
};
