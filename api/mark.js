let attendees = []; // must be the same array; for demo only

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { reg_id } = req.body;
  if (!reg_id) return res.status(400).json({ success: false, error: 'reg_id missing' });

  const record = attendees.find(a => a.reg_id === reg_id);
  if (!record) return res.status(404).json({ success: false, error: 'Registration not found' });

  record.attended = true;
  res.status(200).json({ success: true, record });
}
