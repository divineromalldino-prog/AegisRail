const pool = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const { selectProvider } = require('../services/routing/router');

const createCharge = async (req, res) => {
  const { amount, currency, email, reference } = req.body;

  if (!amount || !currency || !email) {
    return res.status(400).json({
      success: false,
      message: 'amount, currency and email are required'
    });
  }

  try {
    const selectedProvider = selectProvider(currency, amount);

    if (!selectedProvider) {
      return res.status(400).json({
        success: false,
        message: `No available provider supports ${currency}`
      });
    }

    const transaction_ref = reference || 'txn_' + uuidv4().replace(/-/g, '');

    const result = await pool.query(
      `INSERT INTO transactions 
        (merchant_id, amount, currency, email, reference, provider, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [
        req.merchant.id,
        amount,
        currency,
        email,
        transaction_ref,
        selectedProvider.provider_id,
        'pending'
      ]
    );

    return res.status(201).json({
      success: true,
      message: 'Charge created successfully',
      data: {
        transaction_id: result.rows[0].id,
        reference: transaction_ref,
        amount,
        currency,
        email,
        provider: selectedProvider.provider_name,
        routing_reason: selectedProvider.reason,
        status: 'pending',
        created_at: result.rows[0].created_at
      }
    });

  } catch (error) {
    console.error('Charge error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = { createCharge };
