const pool = require('../config/db');

const getTransactions = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT id, amount, currency, email, reference, provider, status, created_at
       FROM transactions
       WHERE merchant_id = $1
       ORDER BY created_at DESC`,
      [req.merchant.id]
    );

    const total = result.rows.reduce((sum, tx) => sum + parseFloat(tx.amount), 0);
    const successful = result.rows.filter(tx => tx.status === 'success').length;
    const pending = result.rows.filter(tx => tx.status === 'pending').length;

    return res.status(200).json({
      success: true,
      data: {
        summary: {
          total_transactions: result.rows.length,
          total_volume: total,
          successful,
          pending
        },
        transactions: result.rows
      }
    });

  } catch (error) {
    console.error('Transactions error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

const getTransactionByReference = async (req, res) => {
  const { reference } = req.params;

  try {
    const result = await pool.query(
      `SELECT id, amount, currency, email, reference, provider, status, created_at
       FROM transactions
       WHERE reference = $1 AND merchant_id = $2`,
      [reference, req.merchant.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Transaction not found'
      });
    }

    return res.status(200).json({
      success: true,
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Transaction lookup error:', error.message);
    return res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

module.exports = { getTransactions, getTransactionByReference };
