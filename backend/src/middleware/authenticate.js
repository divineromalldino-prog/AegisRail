const pool = require('../config/db');

const authenticate = async (req, res, next) => {
  const authHeader = req.headers['authorization'];

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({
      success: false,
      message: 'Missing or invalid authorization header'
    });
  }

  const api_key = authHeader.split(' ')[1];

  try {
    const result = await pool.query(
      'SELECT * FROM merchants WHERE api_key = $1 AND is_active = true',
      [api_key]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({
        success: false,
        message: 'Invalid or inactive API key'
      });
    }

    req.merchant = result.rows[0];
    next();

  } catch (error) {
    console.error('Auth error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = authenticate;
