const express = require('express');
const dotenv = require('dotenv');
const { authenticate, getPaypalAccessToken } = require('../middlewares/authMiddleware');
const { 
    createOrders, 
    captureOrder,
    capturePaymentCompleted
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

// capture payment completed via PayPal webhook
// This endpoint captures the payment completed via PayPal webhook
// POST /api/paypal/webhook
// The request body should contain the webhook event data
// Example request body:
// {
//   "event_type": "PAYMENT.CAPTURE.COMPLETED",
//   "resource": {
//     "id": "PAY-1234567890",
//     "status": "COMPLETED",
//     "amount": {
//       "currency_code": "USD",
//       "value": "10.00"
//     },
//     "invoice_id": "INV-1234567890"
//   }
// }

module.exports = router;