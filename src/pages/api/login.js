// pages/api/login.js
import pool from '../../../lib/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { serialize } from 'cookie';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  const { username, password } = req.body;
  try {
    // Lookup the user by username
    const result = await pool.query(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }
    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: 'Invalid credentials..' });
    }
    const secret = process.env.JWT_SECRET || 'your_secret_key';
    const token = jwt.sign({ userId: user.id, userUid:user.crypto_id, username:user.username }, secret, { expiresIn: '1h' });
    res.setHeader('Set-Cookie', serialize('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'strict',
        path: '/',
        maxAge: 3600 // 1 hour
    }));
    res.status(200).json({ token: token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Login failed' });
  }
}
