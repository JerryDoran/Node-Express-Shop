const express = require('express');
const app = express();

// PRODUCTS ROUTES
app.use('/products', require('./api/routes/products'));

// ORDERS ROUTES
app.use('/orders', require('./api/routes/orders'));

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
