import QRCode from 'qrcode';

let attendees = []; // in-memory

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email } = req.body;
  if (!name || !email) {
    return res.status(400).json({ success: false, error: 'Name & Email required' });
  }

  const reg_id = 'REG' + (attendees.length + 1).toString().padStart(3, '0');
  const record = { name, email, reg_id, attended: false };
  attendees.push(record);

  const payload = JSON.stringify({ reg_id });
  const qrDataUrl = await QRCode.toDataURL(payload);

  res.status(200).json({ success: true, record, qr: qrDataUrl });
}
