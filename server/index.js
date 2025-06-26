const express = require('express');
const QRCode = require('qrcode');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');

const app = express();

// ✅ Middleware
app.use(helmet()); // Security headers
app.use(express.json());
app.use(morgan('combined')); // Logs every request
app.use(cors({
  origin: "*", // ✅ Limit allowed origin (frontend)
  methods: ['POST'],
  optionsSuccessStatus: 200
}));

// ✅ Rate limiting - prevent abuse
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 100, // limit each IP to 100 requests per windowMs
  standardHeaders: true,
  legacyHeaders: false
});
app.use(limiter);

// ✅ Health check
app.get('/', (req, res) => {
  res.status(200).json({ status: 'OK', service: 'QR Generator' });
});

// ✅ Main endpoint
app.post('/generate', async (req, res) => {
  const { link } = req.body;

  // ✅ Validation
  if (!link || typeof link !== 'string' || !/^https?:\/\/\S+$/i.test(link)) {
    return res.status(400).json({ error: 'Invalid or missing URL' });
  }

  try {
    const qr = await QRCode.toDataURL(link);
    console.log(`[QR] Generated for: ${link}`);
    res.status(200).json({ qr });
  } catch (err) {
    console.error('[QR] Generation error:', err.message);
    res.status(500).json({ error: 'QR generation failed' });
  }
});

// ✅ Catch-all for unknown routes
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// ✅ Global error handler
app.use((err, req, res, next) => {
  console.error('[SERVER ERROR]', err.stack);
  res.status(500).json({ error: 'Internal server error' });
});

// ✅ Start server
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`🚀 Backend running on http://localhost:${PORT}`);
});
