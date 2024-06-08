const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new Schema({
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  cart: {
    items: [
      {
        productId: { type: Schema.ObjectId, ref: 'Product', required: true },
        quantity: { type: Number, required: true },
      },
    ],
  },
});

userSchema.methods.addToCart = function (product) {
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
      productId: product._id,
      quantity: newQuantity,
    });
  }

  const updatedCart = {
    items: updatedCartItems,
  };

  this.cart = updatedCart;

  return this.save();
};

userSchema.methods.removeFromCart = function (id) {
  this.cart.items = this.cart.items.filter((item) => {
    return item.productId.toString() !== id.toString();
  });

  return this.save();
};

userSchema.methods.clearCart = function () {
  this.cart.items = [];

  return this.save();
};

module.exports = mongoose.model('User', userSchema);

// const { ObjectId } = require('mongodb');

// const Product = require('./product');

// const getDb = () => {};

// class User {
//   constructor({ username, email, cart, id }) {
//     this.username = username;
//     this.email = email;
//     this.cart = cart || { items: [] };
//     this._id = id;
//   }

//   save() {
//     const db = getDb();

//     return db
//       .collection('users')
//       .insertOne(this)
//       .then()
//       .catch((error) => console.log(error));
//   }

//   getCart() {
//     const db = getDb();

//     const productIds = this.cart.items.map((item) => item.productId);

//     let checkedProductIds;

//     return Product.fetchAll()
//       .then((products) => {
//         checkedProductIds = productIds.filter((id) =>
//           products.some((product) => product._id.toString() === id.toString())
//         );

//         return db
//           .collection('products')
//           .find({ _id: { $in: checkedProductIds } })
//           .toArray();
//       })
//       .then((products) => {
//         return products.map((product) => {
//           return {
//             ...product,
//             quantity: this.cart.items.find(
//               (item) => item.productId.toString() === product._id.toString()
//             ).quantity,
//           };
//         });
//       })
//       .catch((error) => {
//         console.error(error);
//       });
//   }

//   addToCart(product) {
//     const db = getDb();

//     const cartProductIndex = this.cart.items.findIndex((cp) => {
//       return cp.productId.toString() === product._id.toString();
//     });

//     let newQuantity = 1;
//     const updatedCartItems = [...this.cart.items];

//     if (cartProductIndex >= 0) {
//       newQuantity = this.cart.items[cartProductIndex].quantity + 1;
//       updatedCartItems[cartProductIndex].quantity = newQuantity;
//     } else {
//       updatedCartItems.push({
//         productId: new ObjectId(product._id),
//         quantity: newQuantity,
//       });
//     }

//     const updatedCart = {
//       items: updatedCartItems,
//     };

//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: updatedCart } }
//       )
//       .then()
//       .catch((error) => console.log(error));
//   }

//   deleteItemFromCart(id) {
//     const db = getDb();

//     const updatedCartItems = this.cart.items.filter((item) => {
//       return item.productId.toString() !== id.toString();
//     });

//     return db
//       .collection('users')
//       .updateOne(
//         { _id: new ObjectId(this._id) },
//         { $set: { cart: { items: updatedCartItems } } }
//       )
//       .then()
//       .catch((error) => console.log(error));
//   }

//   addOrder() {
//     const db = getDb();

//     return this.getCart()
//       .then((products) => {
//         const order = {
//           items: products,
//           user: {
//             _id: new ObjectId(this._id),
//             name: this.username,
//             email: this.email,
//           },
//         };

//         return db.collection('orders').insertOne(order);
//       })
//       .then(() => {
//         this.cart = { items: [] };

//         return db
//           .collection('users')
//           .updateOne(
//             { _id: new ObjectId(this._id) },
//             { $set: { cart: { items: [] } } }
//           );
//       })
//       .catch((error) => console.log(error));
//   }

//   getOrders() {
//     const db = getDb();

//     return db
//       .collection('orders')
//       .find({ 'user._id': new ObjectId(this._id) })
//       .toArray()
//       .then()
//       .catch((error) => console.log(error));
//   }

//   static findById(id) {
//     const db = getDb();

//     return db
//       .collection('users')
//       .findOne({ _id: new ObjectId(id) })
//       .then((user) => user)
//       .catch((error) => console.log(error));
//   }
// }

// module.exports = User;
