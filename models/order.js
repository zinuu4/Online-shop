const mongoose = require('mongoose');

const { Schema } = mongoose;

const orderSchema = new Schema({
  products: [
    {
      product: {
        type: Object,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
  user: {
    userId: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: 'User',
    },
    username: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
  },
});

module.exports = mongoose.model('Order', orderSchema);
