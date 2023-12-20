const { ObjectId } = require('mongodb');

const { getDb } = require('../utils/database');

class User {
  constructor(username, email) {
    this.username = username;
    this.email = email;
  }

  save() {
    const db = getDb();

    return db
      .collection('users')
      .insertOne(this)
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
