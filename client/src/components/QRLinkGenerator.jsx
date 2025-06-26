import React, { useRef, useState } from 'react';
import axios from 'axios';
import './QRLinkGenerator.css';

const QRLinkGenerator = () => {
  const [link, setLink] = useState('');
  const [qrImage, setQrImage] = useState('');
  const imgRef = useRef(null);

  const generateQRCode = async () => {
    if (!link) return alert('Please enter a valid URL');

    try {
      const res = await axios.post('http://localhost:4000/generate', { link });
      setQrImage(res.data.qr); // QR code in base64
    } catch (error) {
      console.error('QR generation failed:', error);
      alert('Failed to generate QR code');
    }
  };

  const downloadQRCode = () => {
    if (!qrImage || !imgRef.current) return;

    const a = document.createElement('a');
    a.href = qrImage;
    a.download = 'qr-code.png';
    a.click();
  };

  const shareQRCode = async () => {
    if (!qrImage) return;

    try {
      const blob = await (await fetch(qrImage)).blob();
      const file = new File([blob], 'qr-code.png', { type: blob.type });

      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: 'QR Code',
          text: 'Scan this QR code',
          files: [file],
        });
      } else {
        alert('Sharing not supported on this device');
      }
    } catch (err) {
      console.error('Error sharing QR:', err);
    }
  };

  return (
    <div className="qr-container">
      <input
        type="text"
        className="qr-input"
        value={link}
        placeholder="Enter a URL (https://...)"
        onChange={(e) => setLink(e.target.value)}
      />
      <button className="qr-generate-btn" onClick={generateQRCode}>Generate</button>

      {qrImage && (
        <div className="qr-result">
          <img ref={imgRef} src={qrImage} alt="Generated QR Code" />
          <p>{link}</p>
          <div className="qr-actions">
            <button className="qr-btn" onClick={downloadQRCode}>Download</button>
            <button className="qr-btn" onClick={shareQRCode}>Share</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default QRLinkGenerator;
