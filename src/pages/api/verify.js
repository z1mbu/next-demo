import  pool  from '../../../lib/db'; // Adjust import based on your setup
import { verifySignature, verifyDataSignature } from '../../../lib/signing'; // Ensure your verify function is in utils

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { dataId } = req.body;
console.log(dataId);
    // Fetch the stored content, signature, and owner username
    const result = await pool.query(`
      SELECT d.content, d.signature, d.created_at, d.signed, d.data_signature, u.id, u.username, u.crypto_id
      FROM data d
      JOIN users u ON d.owner_id = u.id
      WHERE d.id = $1
    `, [dataId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Data not found' });
    }

    const { content, signature, username, created_at, signed, data_signature, crypto_id } = result.rows[0];
    // Verify signature
    const isValid = verifySignature(content, signature);
    console.log(crypto_id+'.'+content+'.'+signed, data_signature);
    const isValidData = verifyDataSignature(crypto_id+'.'+content+'.'+signed, data_signature);

    res.status(200).json({ verified: isValid, validData: isValidData, username: username, content: content, created_at: created_at, signature: signature, signed: signed, data_signature: data_signature});
  } catch (error) {
    console.error('Error verifying signature:', error);
    res.status(500).json({ error: 'Failed to verify signature' });
  }
}
