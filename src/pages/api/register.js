// pages/api/register.js
import pool from '../../../lib/db';
import bcrypt from 'bcrypt';
import { encrypt } from '../../../lib/encryption';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  const { username, email, password } = req.body;

  const userCryptoId = crypto.randomUUID(); 

  try {
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 12);
    // Encrypt PII (email)
    const encryptedEmail = encrypt(email);
    // Insert into the users table
    const result = await pool.query(
      'INSERT INTO users (username, email_iv, email_encrypted, password, crypto_id) VALUES ($1, $2, $3, $4, $5) RETURNING id',
      [username, encryptedEmail.iv, encryptedEmail.data, hashedPassword, userCryptoId]
    );
    res.status(200).json({ userId: result.rows[0].id });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Registration failed' });
  }
}
