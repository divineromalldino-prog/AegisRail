const pool = require('../config/db');
const bcrypt = require('bcrypt');

const loginMerchant = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Email and password are required'
    });
  }

  try {
    const result = await pool.query(
      'SELECT * FROM merchants WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    const merchant = result.rows[0];
    const validPassword = await bcrypt.compare(password, merchant.password_hash);

    if (!validPassword) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password'
      });
    }

    return res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        id: merchant.id,
        business_name: merchant.business_name,
        email: merchant.email,
        api_key: merchant.api_key
      }
    });

  } catch (error) {
    console.error('Login error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = { loginMerchant };
