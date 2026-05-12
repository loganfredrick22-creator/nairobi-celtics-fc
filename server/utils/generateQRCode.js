const QRCode = require('qrcode');

const generateQRCodeBase64 = async (data) => {
  try {
    return await QRCode.toDataURL(JSON.stringify(data), {
      width: 300,
      margin: 2,
      color: { dark: '#00C853', light: '#FFFFFF' },
    });
  } catch (err) {
    console.error('QR generation error:', err);
    return null;
  }
};

module.exports = { generateQRCodeBase64 };
