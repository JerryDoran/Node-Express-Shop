const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');

// MIDDLEWARE
app.use(morgan('dev'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// HEADER INFORMATION MIDDLEWARE - APPENDED TO AN INCOMING REQUEST TO MY API TO PREVENT CORS ERRORS
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header(
    'Access-Control-Allow-Headers',
    'Origin, X-Requested, Content-Type, Accept, Authorization'
  );
  if (req.method === 'OPTIONS') {
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, DELETE, GET');
    return res.status(200).json({});
  }
  next();
});

// PRODUCTS ROUTES MIDDLEWARE
app.use('/products', require('./api/routes/products'));

// ORDERS ROUTES MIDDLEWARE
app.use('/orders', require('./api/routes/orders'));

// ERROR HANDLING MIDDLEWARE
/* Will reach this code only if there is no matching route that was requested */
app.use((req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
});

app.use((error, req, res, next) => {
  res.status(error.status || 500);
  res.json({
    error: {
      message: error.message
    }
  });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
