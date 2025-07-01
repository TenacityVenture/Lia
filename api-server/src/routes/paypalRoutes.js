const express = require('express');
const dotenv = require('dotenv');
const { authenticate } = require('../middlewares/authMiddleware');
const { getPaypalAccessToken } = require('../services/getPaypalAccessToken');
const { 
    createOrders, 
    captureOrder
 } = require('../controllers/paypalController');
dotenv.config();

// Initialize the express router
const router = express.Router();

// create a new PayPal order
// This endpoint creates a new order with the items in the cart
// POST /api/paypal/orders
// The request body should contain a cart array with items
// Each item should have a name, price, and quantity
// Example request body:
// {
//   "cart": [
//     {
//       "name": "Item 1",
//       "price": "10.00",
//       "quantity": 1
//     },
//   ]
// }
router.post('/orders', authenticate, createOrders)

// Capture an order
// This endpoint captures an order by its payment ID
// GET /api/paypal/orders/capture/:paymentId
// The paymentId is the ID of the order to capture
router.get('/orders/capture/:paymentId', authenticate, captureOrder);

module.exports = router;