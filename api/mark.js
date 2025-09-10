// api/mark.js
// This will run as a Vercel serverless function

// Same in-memory storage as register.js
let attendees = global.attendees || [];
global.attendees = attendees;

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { reg_id } = req.body;
  if (!reg_id) {
    return res.json({ success: false, error: 'reg_id missing' });
  }

  const record = attendees.find((a) => a.reg_id === reg_id);
  if (!record) {
    return res.json({ success: false, error: 'Registration not found' });
  }

  record.attended = true;
  return res.json({ success: true, record });
}
