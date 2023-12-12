const fs = require('fs');
const path = require('path');
const { getDb } = require('../utils/database');

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
    const db = getDb();
    return db
      .collection('products')
      .insertOne(this)
      .then()
      .catch((error) => console.log(error));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then((products) => {
        console.log(products);
        return products;
      })
      .catch((error) => console.log(error));
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

      Cart.deleteProduct(id);

      const updatedProducts = products.filter((product) => product.id !== id);
      customWriteFile(updatedProducts, callback);
    });
  }
};
