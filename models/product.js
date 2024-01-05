const { ObjectId } = require('mongodb');

const { getDb } = require('../utils/database');

module.exports = class Product {
  constructor({ title, imageUrl, description, price, id, userId }) {
    this.title = title;
    this.imageUrl = imageUrl;
    this.description = description;
    this.price = price;
    this._id = id ? new ObjectId(_id) : null;
    this.userId = userId;
  }

  save() {
    const db = getDb();
    let dbOp;
    if (this._id) {
      dbOp = db
        .collection('products')
        .updateOne({ _id: this._id }, { $set: this });
    } else {
      dbOp = db.collection('products').insertOne(this);
    }
    return dbOp.then().catch((error) => console.log(error));
  }

  static fetchAll() {
    const db = getDb();
    return db
      .collection('products')
      .find()
      .toArray()
      .then((products) => products)
      .catch((error) => console.log(error));
  }

  static findById(id) {
    const db = getDb();
    return db
      .collection('products')
      .findOne({ _id: new ObjectId(id) })
      .then((product) => product)
      .catch((error) => console.log(error));
  }

  static deleteById(id) {
    const db = getDb();
    return db
      .collection('products')
      .deleteOne({ _id: new ObjectId(id) })
      .then()
      .catch((error) => console.log(error));
  }
};
