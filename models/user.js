const { ObjectId } = require('mongodb');

const { getDb } = require('../utils/database');

class User {
  constructor({ username, email, cart, id }) {
    this.username = username;
    this.email = email;
    this.cart = cart || { items: [] };
    this._id = id;
  }

  save() {
    const db = getDb();

    return db
      .collection('users')
      .insertOne(this)
      .then()
      .catch((error) => console.log(error));
  }

  getCart() {
    const db = getDb();

    const productIds = this.cart.items.map((item) => {
      return item.productId;
    });

    return db
      .collection('products')
      .find({ _id: { $in: productIds } })
      .toArray()
      .then((products) => {
        return products.map((product) => {
          return {
            ...product,
            quantity: this.cart.items.find((item) => {
              return item.productId.toString() === product._id.toString();
            }).quantity,
          };
        });
      })
      .catch((error) => console.log(error));
  }

  addToCart(product) {
    const db = getDb();

    const cartProductIndex = this.cart.items.findIndex((cp) => {
      return cp.productId.toString() === product._id.toString();
    });

    let newQuantity = 1;
    const updatedCartItems = [...this.cart.items];

    if (cartProductIndex >= 0) {
      newQuantity = this.cart.items[cartProductIndex].quantity + 1;
      updatedCartItems[cartProductIndex].quantity = newQuantity;
    } else {
      updatedCartItems.push({
        productId: new ObjectId(product._id),
        quantity: newQuantity,
      });
    }

    const updatedCart = {
      items: updatedCartItems,
    };

    return db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: updatedCart } }
      )
      .then()
      .catch((error) => console.log(error));
  }

  deleteItemFromCart(id) {
    const db = getDb();

    const updatedCartItems = this.cart.items.filter((item) => {
      return item.productId.toString() !== id.toString();
    });

    return db
      .collection('users')
      .updateOne(
        { _id: new ObjectId(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      )
      .then()
      .catch((error) => console.log(error));
  }

  static findById(id) {
    const db = getDb();

    return db
      .collection('users')
      .findOne({ _id: new ObjectId(id) })
      .then((user) => user)
      .catch((error) => console.log(error));
  }
}

module.exports = User;
