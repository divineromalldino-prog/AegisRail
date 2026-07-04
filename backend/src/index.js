const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const merchantRoutes = require('./routes/merchants');
const authRoutes = require('./routes/auth');
const authenticate = require('./middleware/authenticate');

const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet());

app.get('/', (req, res) => {
  res.json({ 
    message: 'AegisRail API is alive',
    version: '1.0.0',
    status: 'running'
  });
});

app.use('/v1/merchants', merchantRoutes);
app.use('/v1/auth', authRoutes);

app.get('/v1/dashboard', authenticate, (req, res) => {
  res.json({
    success: true,
    message: 'Welcome to your dashboard',
    data: {
      business_name: req.merchant.business_name,
      email: req.merchant.email,
      api_key: req.merchant.api_key,
      member_since: req.merchant.created_at
    }
  });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`AegisRail running on port ${PORT}`);
});
