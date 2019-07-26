const express = require('express');
const router = express.Router();

// SET UP THE PRODUCTS ROUTES
router.get('/', (req, res, next) => {
  res.status(200).json({
    message: 'Handling GET requests to /products'
  });
});

router.post('/', (req, res) => {
  res.status(201).json({
    message: 'Handling POST requests to /products'
  });
});

router.get('/:productId', (req, res) => {
  const id = req.params.productId;
  if (id === 'special') {
    res.status(200).json({
      message: 'You discovered the special ID',
      id: id
    });
  } else {
    res.status(200).json({
      message: `You passed an ID which was ${id}`
    });
  }
});

router.patch('/:productId', (req, res) => {
  res.status(200).json({
    message: 'Updated Product'
  });
});

router.delete('/:productId', (req, res) => {
  const id = req.params.productId;
  res.status(200).json({
    message: `You deleted the product with id ${id}`
  });
});

module.exports = router;
