import { useState } from 'react';

export default function VerifyButton({ dataId }) {
  const [verified, setVerified] = useState(null);
  const [username, setUsername] = useState('');
  const [content, setContent] = useState('');
  const [signature, setSignature] = useState('');
  const [signed, setSigned] = useState('');



  const handleVerify = async () => {
    try {
      const response = await fetch('/api/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dataId }),
      });

      const data = await response.json();
      if (data.error) {
        setVerified(false);
        setUsername('');
      } else {
        setVerified(data.validData);
        setUsername(data.username);
        setContent(data.content);
        setSignature(data.data_signature);
        setSigned(data.signed);



      }
    } catch (error) {
      console.error('Verification failed:', error);
      setVerified(false);
    }
  };

  return (
    
    <div className="verification-container">
      {verified == null && (
      <button 
        onClick={handleVerify} 
      >
        Verify
      </button>
 )}
      {verified !== null && (
        <span className="verification-status">
          {verified ? (
            <div className="verified">
              <span>✅ Verified</span>
              <div className="verified-data"> 
              content
              <p>{content}</p>
              credited
              <p>{username}</p>
              signed
              <p>{signed}</p>
              signature
              <p>{signature}</p>
              </div>
              </div>
          ) : (
            <span className="unverified">❌ Invalid Signature: Data is not verified.</span>
          )}
        </span>
      )}
    </div>
  );
}
