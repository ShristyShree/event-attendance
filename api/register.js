// api/register.js
// This will run as a Vercel serverless function

// In-memory storage – resets on every cold start
let attendees = global.attendees || [];
global.attendees = attendees;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email } = req.body;
  if (!name || !email) {
    return res
      .status(400)
      .json({ success: false, error: 'Name & Email required' });
  }

  // Generate reg_id
  const reg_id =
    'REG' + (attendees.length + 1).toString().padStart(3, '0');
  const record = { name, email, reg_id, attended: false };
  attendees.push(record);

  // Generate QR code
  const QRCode = await import('qrcode');
  const payload = JSON.stringify({ reg_id: record.reg_id });
  const qrDataUrl = await QRCode.toDataURL(payload);

  return res.json({ success: true, record, qr: qrDataUrl });
}
