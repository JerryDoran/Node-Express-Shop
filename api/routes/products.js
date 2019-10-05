const express = require('express');
const router = express.Router();
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');
const ProductsController = require('../controllers/products');

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, './uploads/');
  },
  filename: function(req, file, cb) {
    cb(null, new Date().toISOString() + file.originalname);
  }
});

// Can also filter files by type
const fileFilter = (req, file, cb) => {
  // Reject file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
// Initialize multer and store all files in the 'uploads folder' which will be static
const upload = multer({
  storage: storage,
  limits: {
    // Limit file size to 5mb
    fileSize: 1024 * 1024 * 5
  },
  fileFilter: fileFilter
});

// SET UP THE PRODUCTS ROUTES
// THIS ROUTE '/' IMPLIES '/PRODUCTS'
router.get('/', ProductsController.productsGetAll);

// THIS ROUTE '/' IMPLIES '/PRODUCTS'
router.post(
  '/',
  checkAuth,
  upload.single('productImage'),
  ProductsController.productCreateProduct
);

router.get('/:productId', ProductsController.productsGetProduct);

router.patch(
  '/:productId',
  checkAuth,
  ProductsController.productsUpdateProduct
);

router.delete(
  '/:productId',
  checkAuth,
  ProductsController.productsDeleteProduct
);

module.exports = router;
