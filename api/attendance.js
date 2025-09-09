// api/attendance.js
const QRCode = require('qrcode');

// ⚠️ In-memory store: fine for demo, resets on redeploy and may not persist across scales.
let attendees = [];

module.exports = async (req, res) => {
  const { action } = req.query || {};
  try {
    // Register a new attendee
    if (req.method === 'POST' && action === 'register') {
      const { name, email } = req.body || {};
      if (!name || !email) {
        return res.status(400).json({ success: false, error: 'Name & Email required' });
      }
      const reg_id = 'REG' + (attendees.length + 1).toString().padStart(3, '0');
      const record = { name, email, reg_id, attended: false };
      attendees.push(record);

      const payload = JSON.stringify({ reg_id: record.reg_id });
      const qr = await QRCode.toDataURL(payload);

      return res.status(200).json({ success: true, record, qr });
    }

    // Mark attendance
    if (req.method === 'POST' && action === 'mark') {
      const { reg_id } = req.body || {};
      if (!reg_id) return res.json({ success: false, error: 'reg_id missing' });

      const record = attendees.find(a => a.reg_id === reg_id);
      if (!record) return res.json({ success: false, error: 'Registration not found' });

      record.attended = true;
      return res.json({ success: true, record });
    }

    // List attendees (for admin)
    if (req.method === 'GET' && action === 'list') {
      return res.json(attendees);
    }

    return res.status(404).json({ success: false, error: 'Not found' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ success: false, error: 'Server error' });
  }
};
