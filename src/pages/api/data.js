// pages/api/data.js
import pool from '../../../lib/db';
import { signData } from '../../../lib/signing';

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userId, content } = req.body;
    try {
      //get chack that user is authenticated get  user uui & timestamp
      const result = await pool.query(`
        SELECT crypto_id
        FROM users 
        WHERE id = $1
      `, [userId]);
      console.log(result);
      if (result.rows.length === 0) {
        return res.status(404).json({ error: 'Data not found' });
      }
  
      const { crypto_id } = result.rows[0];
      const signed = new Date().toString();
      // Digitally sign the content
      const signature = signData(content);
      console.log('data to sign:', crypto_id+'.'+content+'.'+signed);

      const data_signature = signData(crypto_id+'.'+content+'.'+signed);
      console.log('data to sign:', data_signature);

      // Insert data along with owner and signature into the data table
      await pool.query(
        'INSERT INTO data (owner_id, content, signature, data_signature, signed) VALUES ($1, $2, $3, $4, $5)',
        [userId, content, signature, data_signature, signed]
      );
      res.status(200).json({ message: 'Data created successfully', signature, data_signature });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Data creation failed' });
    }
  } else if (req.method === 'GET') {
    // Return all data
    try {
      const result = await pool.query('SELECT d.content, d.owner_id, d.created_at, d.id, u.username FROM data d JOIN users u on d.owner_id = u.id ORDER BY d.created_at DESC');
      res.status(200).json({ data: result.rows });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  } else {
    res.status(405).end();
  }
}
