const { getPaypalAccessToken } = require('../middlewares/authMiddleware');
const supabase = require('../utils/supabaseClient');

exports.createOrders = async (req, res) => {

  if (!req.body || !Array.isArray(req.body.cart) || req.body.cart.length === 0) {
    return res.status(400).json({ error: 'Invalid request body. Cart must be an array with at least one item.' });
  }

  for (const item of req.body.cart) {
    if (!item.name || !item.price || !item.quantity) {
      return res.status(400).json({ error: 'Each item in the cart must have a name, price, and quantity.' });
    }
    if (isNaN(item.price) || parseFloat(item.price) <= 0) {
      return res.status(400).json({ error: 'Price must be a valid positive number.' });
    }
    if (!Number.isInteger(item.quantity) || item.quantity <= 0) {
      return res.status(400).json({ error: 'Quantity must be a valid integer greater than 0.' });
    }
  }

  try {
    const accessToken = await getPaypalAccessToken();
    if (!accessToken) {
      throw new Error('Failed to retrieve access token from PayPal');
    }

    const body = {
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
    };

    const response = await fetch(`${process.env.PAYPAL_BASE_URL}/v2/checkout/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`PayPal API error: ${response.status} ${errorBody}`);
    }

    const orderData = await response.json();
    if (!orderData.id) {
      throw new Error('Order ID not found in PayPal response');
    }

    // Store each cart item as a separate order in Supabase
    const item = req.body.cart[0];
    const { data, error } = await supabase.from('orders').insert({
      plan: (item.planKey === 'starter' ? 'standard' : item.planKey === 'professional' ? 'pro' : item.planKey) || '',
      paypal_order_id: orderData.id,
      user_id: req.user.sub, // User id is available in request
      amount: item.price * item.quantity,
      status: 'created',
      description: item.description || ''
    });
    
    if (error) {
      throw new Error(`Failed to insert order for item ${item.name}: ${error.message}`);
    }

    console.log(`Order created with ID: ${orderData.id}`);

    res.status(201).json({ id: orderData.id });

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

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

    const response = await fetch(`${process.env.PAYPAL_BASE_URL}/v2/checkout/orders/${paymentId}/capture`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      throw new Error(`PayPal API error: ${response.status} ${errorBody}`);
    }

    const captureData = await response.json();

    if (!captureData.id) {
      throw new Error('Capture ID not found in PayPal response');
    }

    console.log(`Payment captured:`);
    // update the order status in Supabase
    const { data, error } = await supabase.from('orders').update({
      status: 'completed',
      paypal_order_id: captureData.id,
      currency: captureData.payer?.address?.country_code || 'USD',
      metadata: captureData.payer || {},
    }).eq('paypal_order_id', paymentId).select().single();

    // get the user associated with the order and update their plan
    if (data) {
      console.log('data', data)
      const userId = data.user_id;
      const { error: userError } = await supabase.from('users')
        .update({
          plan: data.plan,
          plan_started_at: new Date(),
          plan_expires_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
        })
        .eq('id', userId);

      if (userError) {
        throw new Error(`Failed to update user plan: ${userError.message}`);
      }

      console.log(`User plan updated for user ID: ${userId}`);
    }

    if (error) {
      throw new Error(`Failed to update order status: ${error.message}`);
    }
    res.status(200).json(captureData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}