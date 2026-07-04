const pool = require('../config/db');
const bcrypt = require('bcrypt');
const { v4: uuidv4 } = require('uuid');

const registerMerchant = async (req, res) => {
  const { business_name, email, password } = req.body;

  if (!business_name || !email || !password) {
    return res.status(400).json({
      success: false,
      message: 'business_name, email and password are required'
    });
  }

  try {
    const existing = await pool.query(
      'SELECT id FROM merchants WHERE email = $1',
      [email]
    );

    if (existing.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: 'A merchant with this email already exists'
      });
    }

    const password_hash = await bcrypt.hash(password, 10);
    const api_key = 'sk_live_' + uuidv4().replace(/-/g, '');

    const result = await pool.query(
      `INSERT INTO merchants (business_name, email, password_hash, api_key)
       VALUES ($1, $2, $3, $4)
       RETURNING id, business_name, email, api_key, created_at`,
      [business_name, email, password_hash, api_key]
    );

    return res.status(201).json({
      success: true,
      message: 'Merchant registered successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Registration error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = { registerMerchant };
