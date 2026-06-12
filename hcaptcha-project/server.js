const express = require('express');
const fetch = require('node-fetch');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;
const SECRET_KEY = process.env.HCAPTCHA_SECRET_KEY;
const SITE_KEY = process.env.HCAPTCHA_SITE_KEY;

// Middleware
app.use(express.json());
app.use(express.static('public'));
app.use(cors());

// Logging
app.use((req, res, next) => {
  console.log(`📍 ${new Date().toISOString()} - ${req.method} ${req.path}`);
  next();
});

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});

app.get('/api/config', (req, res) => {
  res.json({
    siteKey: SITE_KEY,
    status: '✅ Server läuft'
  });
});

app.post('/api/verify-captcha', async (req, res) => {
  const token = req.body.token;

  console.log('🔍 Verifiziere Token...');
  console.log('Token:', token.substring(0, 20) + '...');

  if (!token) {
    return res.status(400).json({
      success: false,
      message: '❌ Kein Token erhalten'
    });
  }

  try {
    const response = await fetch('https://hcaptcha.com/siteverify', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: `response=${token}&secret=${SECRET_KEY}`,
    });

    const data = await response.json();
    console.log('📊 hCaptcha Response:', data);

    if (data.success) {
      console.log('✅ Verifizierung erfolgreich!');
      res.json({
        success: true,
        message: '✅ Verifizierung erfolgreich! Du bist ein echter Mensch.',
        score: data.score || 'N/A',
        challenge_ts: data.challenge_ts,
        hostname: data.hostname
      });
    } else {
      console.log('❌ Verifizierung fehlgeschlagen');
      res.json({
        success: false,
        message: '❌ Verifizierung fehlgeschlagen. Versuche es erneut.',
        errors: data['error-codes']
      });
    }
  } catch (error) {
    console.error('❌ Server Fehler:', error);
    res.status(500).json({
      success: false,
      message: '❌ Server Fehler: ' + error.message,
      error: error.message
    });
  }
});

// Test Route
app.get('/test', (req, res) => {
  res.sendFile(__dirname + '/test.html');
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Error Handler
app.use((err, req, res, next) => {
  console.error('💥 Error:', err);
  res.status(500).json({ error: 'Internal Server Error' });
});

// Server starten
app.listen(PORT, () => {
  console.log('\n🚀 hCaptcha Server läuft!');
  console.log(`📍 http://localhost:${PORT}`);
  console.log(`🧪 Test: http://localhost:${PORT}/test`);
  console.log(`⚙️  Config: http://localhost:${PORT}/api/config\n`);
});
