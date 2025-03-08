import dotenv from 'dotenv';
dotenv.config();
import crypto from 'crypto';

const algorithm = 'aes-256-cbc';

// Ensure the key is properly converted from hex to a 32-byte buffer
const keyHex = process.env.ENCRYPTION_KEY.trim();  // Trim any accidental spaces
const key = Buffer.from(keyHex, 'hex');

// Debugging: Ensure correct length
console.log('Raw ENCRYPTION_KEY:', keyHex);
console.log('Key Buffer Length:', key.length);  // Should be 32

// Encryption function
export function encrypt(text) {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return { iv: iv.toString('hex'), data: encrypted };
}

// Decryption function
export function decrypt(encryptedObj) {
  const iv = Buffer.from(encryptedObj.iv, 'hex');
  const decipher = crypto.createDecipheriv(algorithm, key, iv);
  let decrypted = decipher.update(encryptedObj.data, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
}
