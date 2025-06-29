import got from got

/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 * * Creates a new PayPal order with the items in the cart.
 * * The request body should contain a cart array with items.
 * * Each item should have a name, price, and quantity.
 * * Example request body:
 * * {
 * *   "cart": [
 * *     {
 * *       "name": "Item 1",
 * *       "price": "10.00",
 * *       "quantity": 1
 * *     },
 * *   ]
 * * }
 * @returns 
 */
exports.createOrders = async (req, res) => {
  // Validate request body
  // ensure that req.body is an object and has a cart array with at least one item
  if (!req.body || !Array.isArray(req.body.cart) || req.body.cart.length === 0) {
    return res.status(400).json({ error: 'Invalid request body. Cart must be an array with at least one item.' });
  }

  // ensure that each item in the cart has a name, price, and quantity
  for (const item of req.body.cart) {
    if (!item.name || !item.price || !item.quantity) {
      return res.status(400).json({ error: 'Each item in the cart must have a name, price, and quantity.' });
    }
    // ensure that price is a valid number
    if (isNaN(item.price) || parseFloat(item.price) <= 0) {
      return res.status(400).json({ error: 'Price must be a valid positive number.' });
    }
    // ensure that quantity is a valid integer greater than 0
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be a valid integer greater than 0.' });
    }
  }

  try {
    // Get access token from PayPal
    // retrieves access token from PayPal for subsequent API calls
    const accessToken = await getPaypalAccessToken();
    if (!accessToken) {
      throw new Error('Failed to retrieve access token from PayPal');
    }
    // Create a new order with the items in the cart
    // The order is created with the intent to capture the payment immediately
    const response = await got.post(`${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      json: {
        intent: 'CAPTURE',
        purchase_units:
            req.body.cart.map(item => ({
            amount: {
              currency_code: 'USD',
              value: item.price,
              breakdown: {
                item_total: {
                  currency_code: 'USD',
                  value: item.price,
                },
              },
            },
            items: [{
              name: item.name,
              unit_amount: {
                currency_code: 'USD',
                value: item.price,
              },
              quantity: item.quantity.toString(),
            }],
          })),
        payment_source: {
          paypal: {
            experience_context: {
              payment_method_preference: 'IMMEDIATE_PAYMENT_REQUIRED',
              payment_method_selected: 'PAYPAL',
              brand_name: 'Local Store',
              locale: 'en-US',
              user_action: 'PAY_NOW',
              shipping_preference: 'NO_SHIPPING',
              return_url: `${process.env.PAYPAL_REDIRECT_BASE_URL}/success`,
              cancel_url: `${process.env.PAYPAL_REDIRECT_BASE_URL}/cancel`,
            },
          },
        },
      },
    });

    
    const orderData = JSON.parse(response.body);
    res.status(201).json({ id: orderData.id });
    
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

/**
 * 
 * @param {Object} req 
 * @param {Object} res 
 * @param {string} req.params.paymentId - The ID of the order to capture.
 * * Captures an order by its payment ID.
 * * @example
 * * POST /api/paypal/orders/capture/:paymentId
 * * The paymentId is the ID of the order to capture.
 * @returns 
 */
exports.captureOrder = async (req, res) => {
  const { paymentId } = req.params;
  if (!paymentId) {
    return res.status(400).json({ error: 'Order ID is required' });
  }

  try {
    const accessToken = await getPaypalAccessToken();
    if (!accessToken) {
      throw new Error('Failed to retrieve access token from PayPal');
    }
    const response = await got.post(`${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${paymentId}/capture`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      responseType: 'json',
    });

    if (!response || !response.body) {
      throw new Error('No response received from PayPal');
    }
    const captureData = response.body;
    res.status(200).json(captureData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}