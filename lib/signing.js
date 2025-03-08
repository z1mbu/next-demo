// lib/signing.js
import crypto from 'crypto';

export function signData(data) {
  const privateKey = process.env.PRIVATE_KEY;
  const sign = crypto.createSign('RSA-SHA256');
  sign.update(data);
  sign.end();
  const signature = sign.sign(privateKey, 'hex');
  return signature;
}


export function verifySignature(data, signature) {
  try {
    const publicKey = process.env.PUBLIC_KEY;
    if (!publicKey) {
      console.error("Public key is missing");
      return false; // Return false if there's no public key
    }
    const verify = crypto.createVerify('RSA-SHA256');
    verify.update(data);
    verify.end();
    return verify.verify(publicKey, signature, 'hex'); // Returns true or false
  } catch (error) {
    console.error("Error verifying signature:", error);
    return false; // Return false in case of any error
  }
}


export function verifyDataSignature(data, data_signature) {
    try {
      const publicKey = process.env.PUBLIC_KEY;
      if (!publicKey) {
        console.error("Public key is missing");
        return false; // Return false if there's no public key
      }
      const verify = crypto.createVerify('RSA-SHA256');
      verify.update(data);
      verify.end();
      return verify.verify(publicKey, data_signature, 'hex'); // Returns true or false
    } catch (error) {
      console.error("Error verifying signature:", error);
      return false; // Return false in case of any error
    }
  }
