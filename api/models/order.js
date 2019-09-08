const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,

  // Need to connect our Order schema to the Product schema for a relationship.  Need to
  // use the 'ref' keyword.
  product: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: { type: Number, default: 1 }
});

module.exports = mongoose.model('Order', orderSchema);
