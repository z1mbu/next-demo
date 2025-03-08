import jwt from 'jsonwebtoken';
import { parse } from 'cookie';

export default function handler(req, res) {
    const cookies = parse(req.headers.cookie || '');
    const token = cookies.token;

    if (!token) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const secret = process.env.JWT_SECRET;
        const decoded = jwt.verify(token, secret);
        return res.status(200).json({ user: decoded });
    } catch (error) {
        return res.status(401).json({ message: 'Invalid token' });
    }
}
