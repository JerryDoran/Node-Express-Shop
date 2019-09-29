const express = require('express');
const router = express.Router();
const checkAuth = require('../middleware/check-auth');

// SET UP THE ORDERS ROUTES
// THE CODE FOR THESE ROUTES IS IN THE ORDERS CONTROLLER
const OrdersController = require('../controllers/orders');

// Handling incoming GET requests to /orders
router.get('/', checkAuth, OrdersController.ordersGetAll);

// Handling incoming POST requests to /orders
router.post('/', checkAuth, OrdersController.ordersCreateOrder);

// Handling incoming GET requests to /orders/? with a specific id targeted
router.get('/:orderId', checkAuth, OrdersController.ordersGetOrder);

// Handling incoming DELETE requests to /orders/? with a specific id targeted
router.delete('/:orderId', checkAuth, OrdersController.ordersDeleteOrder);

module.exports = router;
