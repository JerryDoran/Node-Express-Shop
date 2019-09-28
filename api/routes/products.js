const express = require('express');
const router = express.Router();
const Product = require('../models/product');
const mongoose = require('mongoose');
const multer = require('multer');
const checkAuth = require('../middleware/check-auth');

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
router.get('/', (req, res, next) => {
  Product.find()
    .select('name price _id productImage')
    .exec()
    .then(docs => {
      const response = {
        count: docs.length,
        products: docs.map(doc => {
          return {
            name: doc.name,
            price: doc.price,
            productImage: doc.productImage,
            _id: doc._id,
            request: {
              type: 'GET',
              url: 'http://localhost:3000/products/' + doc._id
            }
          };
        })
      };
      if (docs.length > 0) {
        res.status(200).json(response);
      } else {
        res.status(404).json({
          message: 'No entries found'
        });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
  // res.status(200).json({
  //   message: 'Handling GET requests to /products'
  // });
});

// THIS ROUTE '/' IMPLIES '/PRODUCTS'
router.post('/', checkAuth, upload.single('productImage'), (req, res, next) => {
  // Create new instance of the Product Model
  const product = new Product({
    // This will create a new Id for the record to be stored on Mongo
    _id: new mongoose.Types.ObjectId(),

    // This will just parse bodies that are url encoded and json data
    name: req.body.name,
    price: req.body.price,
    productImage: req.file.path
  });

  product
    .save()
    .then(result => {
      console.log(result);
      res.status(201).json({
        message: 'Created product successfully',
        createdProduct: {
          name: result.name,
          price: result.price,
          _id: result._id,
          request: {
            type: 'POST',
            url: 'http://localhost:3000/products/' + result._id
          }
        }
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.get('/:productId', (req, res, next) => {
  const id = req.params.productId;
  Product.findById(id)
    .select('name price _id productImage')
    .exec()
    .then(doc => {
      console.log('From database', doc);
      if (doc) {
        res.status(200).json({
          product: doc,
          request: {
            type: 'GET',
            description: `Got the product with id: ${id}`,
            url: 'http://localhost:3000/products/'
          }
        });
      } else {
        res
          .status(404)
          .json({ message: 'No valid entry found for provided Id' });
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({ error: err });

      // if (id === 'special') {
      //   res.status(200).json({
      //     message: 'You discovered the special ID',
      //     id: id
      //   });
      // } else {
      //   res.status(200).json({
      //     message: `You passed an ID which was ${id}`
      //   });
      // }
    });
});

router.patch('/:productId', checkAuth, (req, res, next) => {
  const id = req.params.productId;
  const updateOps = {};
  for (const ops of req.body) {
    updateOps[ops.propName] = ops.value;
  }
  Product.update({ _id: id }, { $set: updateOps })
    .exec()
    .then(result => {
      console.log(result);
      res.status(200).json({
        message: 'Product information updated',
        request: {
          type: 'GET',
          url: 'http//localhost:3000/products/' + id
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });

  // Send patch request in this format
  // [
  //   { "propName": "price", "value": "121.99" }
  // ]

  // res.status(200).json({
  //   message: 'Updated Product'
  // });
});

router.delete('/:productId', checkAuth, (req, res, next) => {
  const id = req.params.productId;
  Product.deleteOne({ _id: id })
    .exec()
    .then(result => {
      res.status(200).json({
        message: 'Product deleted',
        request: {
          type: 'POST',
          url: 'http//localhost:3000/products',
          body: { name: 'String', price: 'Number' }
        }
      });
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err
      });
    });
  // const id = req.params.productId;
  // res.status(200).json({
  //   message: `You deleted the product with id ${id}`
  // });
});

module.exports = router;
