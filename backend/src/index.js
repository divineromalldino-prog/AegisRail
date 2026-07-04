const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();

const merchantRoutes = require('./routes/merchants');

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

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
  console.log(`AegisRail running on port ${PORT}`);
});
