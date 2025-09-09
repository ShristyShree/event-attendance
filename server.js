// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const QRCode = require('qrcode'); // Make sure qrcode is installed

const app = express();

// ✅ use the port Vercel/other host gives, or 3000 locally
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));

const attendees = [];

// Register a new attendee and return reg_id + QR code
app.post('/api/register', async (req, res) => {
  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, error: 'Name & Email required' });
  }

  const reg_id = 'REG' + (attendees.length + 1).toString().padStart(3, '0');
  const record = { name, email, reg_id, attended: false };
  attendees.push(record);

  // Payload for QR code
  const payload = JSON.stringify({ reg_id: record.reg_id });
  try {
    const qrDataUrl = await QRCode.toDataURL(payload);
    res.json({ success: true, record, qr: qrDataUrl });
  } catch (err) {
    res.status(500).json({ success: false, error: 'QR code generation failed' });
  }
});

// Mark attendance
app.post('/api/mark', (req, res) => {
  const { reg_id } = req.body;
  if (!reg_id) return res.json({ success: false, error: 'reg_id missing' });

  const record = attendees.find(a => a.reg_id === reg_id);
  if (!record) return res.json({ success: false, error: 'Registration not found' });

  record.attended = true;
  res.json({ success: true, record });
});

// Get all attendees
app.get('/api/attendees', (req, res) => {
  res.json(attendees);
});

// Serve main page
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// ✅ Start server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
