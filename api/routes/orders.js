const express = require('express');
const router = express.Router();

// SET UP THE ORDERS ROUTES
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Orders were fetched'
  });
});

router.post('/', (req, res, next) => {
  const order = {
    productId: req.body.productId,
    quantity: req.body.quantity
  };
  res.status(201).json({
    message: 'Order was created',
    order: order
  });
});

router.get('/:orderId', (req, res, next) => {
  const id = req.params.orderId;
  if (id === 'special') {
    res.status(200).json({
      message: `Order details for special order id ${id}`
    });
  } else {
    res.status(200).json({
      message: `Order details for non-special order id ${id}`
    });
  }
});

router.delete('/:productId', (req, res, next) => {
  const id = req.params.productId;
  res.status(200).json({
    message: `You deleted the order with id ${id}`
  });
});

module.exports = router;
