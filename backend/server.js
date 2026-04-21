const express = require('express');
const cors = require('cors');
const { analyzeTransaction, getTransactions, getStats } = require('./fraudEngine');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// =============================================
// ROUTES
// =============================================

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'online',
    service: 'Fraud Detection API',
    version: '1.0.0',
    endpoints: ['/api/analyze', '/api/transactions', '/api/stats']
  });
});

// Analyze a transaction
app.post('/api/analyze', (req, res) => {
  try {
    const result = analyzeTransaction(req.body);
    res.json({ success: true, data: result });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
});

// Get all transactions (with optional filters)
app.get('/api/transactions', (req, res) => {
  try {
    const { status, limit } = req.query;
    const data = getTransactions({ status, limit });
    res.json({ success: true, data, total: data.length });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get dashboard stats
app.get('/api/stats', (req, res) => {
  try {
    const data = getStats();
    res.json({ success: true, data });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`\n🛡️  Fraud Detection API running on port ${PORT}`);
  console.log(`📡  Health check: http://localhost:${PORT}`);
  console.log(`📊  Stats: http://localhost:${PORT}/api/stats`);
  console.log(`🔍  Analyze: POST http://localhost:${PORT}/api/analyze\n`);
});
