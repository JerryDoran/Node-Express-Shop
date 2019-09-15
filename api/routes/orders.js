const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/order');
const Product = require('../models/product');

// SET UP THE ORDERS ROUTES

// Handling incoming GET requests to /orders
router.get('/', (req, res, next) => {
  Order.find()
    .select('product quantity _id')

    // Get product information along with order information
    .populate('product', 'name')
    .exec()
    .then(docs => {
      res.status(200).json({
        count: docs.length,
        orders: docs.map(doc => {
          return {
            _id: doc._id,
            product: doc.product,
            quantity: doc.quantity,
            request: {
              type: 'GET',
              url: 'http//localhost:3000/orders/' + doc._id
            }
          };
        })
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

// Handling incoming POST requests to /orders
router.post('/', (req, res, next) => {
  // Validation for creating orders using products that we do not have in the database
  Product.findById(req.body.productId)
    .then(product => {
      if (!product) {
        return res.status(404).json({
          message: 'Product not found'
        });
      }
      const order = new Order({
        // Creates the Id for each order that is stored
        _id: mongoose.Types.ObjectId(),

        // Comes from the body of the json
        quantity: req.body.quantity,

        // Comes from the body of the json
        product: req.body.productId
      });

      // Saves the order to the database
      return order.save();
    })
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Order stored',
        createdOrder: {
          _id: result._id,
          product: result.product,
          quantity: result.quantity
        },
        request: {
          type: 'GET',
          url: 'http//localhost:3000/orders/' + result._id
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Product not found',
        error: err
      });
    });
});

// Handling incoming GET requests to /orders/? with a specific id targeted
router.get('/:orderId', (req, res, next) => {
  Order.findById(req.params.orderId)
    .populate('product')
    .exec()
    .then(order => {
      if (!order) {
        return res.status(404).json({
          message: 'Order not found'
        });
      }
      res.status(200).json({
        order: order,
        request: {
          type: 'GET',
          url: 'http//localhost:3000/orders'
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Could not find order',
        error: err
      });
    });

  // const id = req.params.orderId;
  // if (id === 'special') {
  //   res.status(200).json({
  //     message: `Order details for special order id ${id}`
  //   });
  // } else {
  //   res.status(200).json({
  //     message: `Order details for non-special order id ${id}`
  //   });
  // }
});

router.delete('/:orderId', (req, res, next) => {
  Order.deleteOne({ _id: req.params.orderId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Order has been deleted',
        request: {
          type: 'POST',
          url: 'http//localhost:3000/orders',
          body: { productId: 'ID', quantity: 'Number' }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Could not find order',
        error: err
      });
    });

  // const id = req.params.productId;
  // res.status(200).json({
  //   message: `You deleted the order with id ${id}`
  // });
});

module.exports = router;
