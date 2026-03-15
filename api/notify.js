// Vercel Serverless: /api/notify
// Called by frontend when user generates cards with a BIN (client-side generation)

const TG_BOT_TOKEN = '8356710805:AAGgkXfVOe7PsEx4UfFYGLgmHvYh7Sclmxc';
const TG_CHAT_ID = '1437058499';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { bin, exp, quantity, network, source } = req.body || {};
    if (!bin) return res.status(400).json({ error: 'Missing bin' });

    const ip = req.headers['x-forwarded-for'] || req.headers['x-real-ip'] || '';
    const ua = req.headers['user-agent'] || '';
    const ts = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

    let msg = `🔔 <b>BBGenCard - New Gen</b>\n\n`;
    msg += `💳 <b>BIN:</b> <code>${bin}</code>\n`;
    if (exp) msg += `📅 <b>EXP:</b> <code>${exp}</code>\n`;
    if (quantity) msg += `🔢 <b>Qty:</b> ${quantity}\n`;
    if (network) msg += `🌐 <b>Network:</b> ${network}\n`;
    msg += `🕐 <b>Time:</b> ${ts}\n`;
    if (ip) msg += `📍 <b>IP:</b> <code>${ip}</code>\n`;
    if (ua) msg += `🖥️ <b>UA:</b> <code>${ua.substring(0, 80)}</code>\n`;
    msg += `📱 <b>Source:</b> ${source || 'Web UI'}\n`;

    const tgRes = await fetch(`https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TG_CHAT_ID,
        text: msg,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });
    const tgResult = await tgRes.json();

    res.status(200).json({ success: true, notified: tgResult.ok === true });
  } catch (error) {
    res.status(200).json({ success: false, error: error.message });
  }
}
