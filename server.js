// server.js
const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const QRCode = require('qrcode');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// serve everything inside public automatically
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

  // generate QR code payload
  const payload = JSON.stringify({ reg_id: record.reg_id });
  const qrDataUrl = await QRCode.toDataURL(payload);

  res.json({ success: true, record, qr: qrDataUrl });
});

// Mark attendance by reg_id
app.post('/api/mark', (req, res) => {
  const { reg_id } = req.body;
  if (!reg_id) return res.json({ success: false, error: 'reg_id missing' });

  const record = attendees.find(a => a.reg_id === reg_id);
  if (!record) return res.json({ success: false, error: 'Registration not found' });

  record.attended = true;
  res.json({ success: true, record });
});

// Return all attendees (for admin)
app.get('/api/attendees', (req, res) => {
  res.json(attendees);
});

// --- Explicitly serve the HTML pages so Vercel can find them ---
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/scan.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'scan.html'));
});

app.get('/admin.html', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'admin.html'));
});

// start server locally (Vercel uses its own handler)
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on http://0.0.0.0:${PORT}`);
});
