// BBGenCard - API Server with Telegram Notification & Auto-Clear
// Run: node server.js

import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 3001;

// ============== Telegram Config ==============
const TG_BOT_TOKEN = '8356710805:AAGgkXfVOe7PsEx4UfFYGLgmHvYh7Sclmxc';
const TG_CHAT_ID = '1437058499';

// ============== In-Memory Log (auto-clear daily) ==============
let generationLogs = [];

// Auto-clear logs at midnight (00:00)
function scheduleAutoClear() {
  const now = new Date();
  const midnight = new Date(now);
  midnight.setHours(23, 55, 0, 0); // Clear at 23:55

  let msUntilClear = midnight.getTime() - now.getTime();
  if (msUntilClear < 0) {
    // Already past 23:55, schedule for tomorrow
    msUntilClear += 24 * 60 * 60 * 1000;
  }

  setTimeout(() => {
    const count = generationLogs.length;
    generationLogs = [];
    console.log(`🧹 [Auto-Clear] Cleared ${count} generation logs at ${new Date().toISOString()}`);
    // Reschedule for next day
    setInterval(() => {
      const c = generationLogs.length;
      generationLogs = [];
      console.log(`🧹 [Auto-Clear] Cleared ${c} generation logs at ${new Date().toISOString()}`);
    }, 24 * 60 * 60 * 1000);
  }, msUntilClear);

  console.log(`⏰ Auto-clear scheduled in ${Math.round(msUntilClear / 60000)} minutes`);
}

// ============== Telegram Notification ==============
async function sendTelegramNotification(data) {
  const { bin, exp, quantity, network, ip, userAgent } = data;

  const timestamp = new Date().toLocaleString('vi-VN', { timeZone: 'Asia/Ho_Chi_Minh' });

  let message = `🔔 <b>BBGenCard - New Generation</b>\n\n`;
  message += `💳 <b>BIN:</b> <code>${bin}</code>\n`;
  if (exp) message += `📅 <b>EXP:</b> <code>${exp}</code>\n`;
  message += `🔢 <b>Quantity:</b> ${quantity}\n`;
  message += `🌐 <b>Network:</b> ${network}\n`;
  message += `🕐 <b>Time:</b> ${timestamp}\n`;
  if (ip) message += `📍 <b>IP:</b> <code>${ip}</code>\n`;
  if (userAgent) message += `🖥️ <b>UA:</b> <code>${userAgent.substring(0, 80)}</code>\n`;

  try {
    const url = `https://api.telegram.org/bot${TG_BOT_TOKEN}/sendMessage`;
    const res = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: TG_CHAT_ID,
        text: message,
        parse_mode: 'HTML',
        disable_web_page_preview: true,
      }),
    });
    const result = await res.json();
    if (!result.ok) {
      console.error('❌ Telegram notification failed:', result.description);
    } else {
      console.log('✅ Telegram notification sent for BIN:', bin);
    }
  } catch (error) {
    console.error('❌ Telegram send error:', error.message);
  }
}

app.use(cors());
app.use(express.json());

// Trust proxy for real IP
app.set('trust proxy', true);

// ============== Card Generator Logic ==============

const CARD_NETWORKS = {
  visa: { id: 'visa', name: 'Visa', bins: ['4'], lengths: [16], cvvLength: 3 },
  mastercard: { id: 'mastercard', name: 'Mastercard', bins: ['51', '52', '53', '54', '55', '2221', '2720'], lengths: [16], cvvLength: 3 },
  amex: { id: 'amex', name: 'American Express', bins: ['34', '37'], lengths: [15], cvvLength: 4 },
  discover: { id: 'discover', name: 'Discover', bins: ['6011', '644', '645', '646', '647', '648', '649', '65'], lengths: [16], cvvLength: 3 },
  unionpay: { id: 'unionpay', name: 'UnionPay', bins: ['62'], lengths: [16, 17, 18, 19], cvvLength: 3 },
  diners: { id: 'diners', name: 'Diners Club', bins: ['300', '301', '302', '303', '304', '305', '36', '38'], lengths: [14, 16], cvvLength: 3 },
  jcb: { id: 'jcb', name: 'JCB', bins: ['3528', '3589'], lengths: [16], cvvLength: 3 },
};

function luhnChecksum(cardNum) {
  const digits = cardNum.split('').map(Number);
  const reversed = [...digits].reverse();
  let oddSum = 0, evenSum = 0;
  for (let i = 0; i < reversed.length; i++) {
    if (i % 2 === 0) oddSum += reversed[i];
    else { let d = reversed[i] * 2; if (d > 9) d -= 9; evenSum += d; }
  }
  return (oddSum + evenSum) % 10;
}

function isLuhnValid(cardNum) { return luhnChecksum(cardNum) === 0; }
function randomInt(min, max) { return Math.floor(Math.random() * (max - min + 1)) + min; }

function detectNetwork(cardNumber) {
  for (const [, network] of Object.entries(CARD_NETWORKS)) {
    for (const bin of network.bins) {
      if (cardNumber.startsWith(bin)) return network.name;
    }
  }
  return null;
}

function detectNetworkId(bin) {
  for (const [id, network] of Object.entries(CARD_NETWORKS)) {
    for (const prefix of network.bins) {
      if (bin.startsWith(prefix) || prefix.startsWith(bin)) return id;
    }
  }
  return null;
}

function generateCardNumber(networkId, binCode) {
  const network = CARD_NETWORKS[networkId];
  if (!network) throw new Error(`Unsupported network: ${networkId}`);
  let chosenBin, targetLength;
  if (binCode) {
    if (binCode.includes('x') || binCode.includes('X')) {
      const fixedPart = binCode.replace(/[xX]/g, '');
      const xCount = (binCode.match(/[xX]/g) || []).length;
      chosenBin = fixedPart;
      for (let i = 0; i < xCount - 1; i++) chosenBin += randomInt(0, 9).toString();
      targetLength = binCode.length;
    } else {
      chosenBin = binCode;
      targetLength = network.lengths[randomInt(0, network.lengths.length - 1)];
    }
  } else {
    chosenBin = network.bins[randomInt(0, network.bins.length - 1)];
    targetLength = network.lengths[randomInt(0, network.lengths.length - 1)];
  }
  let cardNumber = chosenBin;
  while (cardNumber.length < targetLength - 1) cardNumber += randomInt(0, 9).toString();
  if (cardNumber.length > targetLength - 1) cardNumber = cardNumber.slice(0, targetLength - 1);
  const checksum = luhnChecksum(cardNumber + '0');
  cardNumber += ((10 - checksum) % 10).toString();
  return cardNumber;
}

function generateExpiry(month, year) {
  const now = new Date();
  const cY = now.getFullYear(), cM = now.getMonth() + 1;
  let eM, eY;
  if (month !== null && year !== null) {
    if (year < cY || (year === cY && month < cM)) { eY = randomInt(cY, cY + 8); eM = eY === cY ? randomInt(cM, 12) : randomInt(1, 12); }
    else { eM = month; eY = year; }
  } else if (month !== null) { eY = randomInt(cY, cY + 8); eM = (eY === cY && month < cM) ? randomInt(cM, 12) : month; }
  else if (year !== null) { eY = year; eM = year === cY ? randomInt(cM, 12) : randomInt(1, 12); }
  else { eY = randomInt(cY, cY + 8); eM = eY === cY ? randomInt(cM, 12) : randomInt(1, 12); }
  return [String(eM).padStart(2, '0'), String(eY)];
}

function generateCvv(networkId) {
  const network = CARD_NETWORKS[networkId];
  if (!network) return '000';
  let cvv = '';
  for (let i = 0; i < network.cvvLength; i++) cvv += randomInt(0, 9).toString();
  return cvv;
}

function parseExp(exp) {
  let expMonth = null, expYear = null;
  if (exp) {
    const s = String(exp).trim();
    let m, y;
    if (s.includes('/')) { [m, y] = s.split('/'); }
    else if (s.length === 4) { m = s.slice(0, 2); y = s.slice(2, 4); }
    else if (s.length === 6) { m = s.slice(0, 2); y = s.slice(2, 6); }
    if (m && y) {
      expMonth = parseInt(m);
      expYear = String(y).length === 2 ? 2000 + parseInt(y) : parseInt(y);
      if (expMonth < 1 || expMonth > 12) expMonth = null;
      if (expYear && (expYear < 2000 || expYear > 2100)) expYear = null;
    }
  }
  return { expMonth, expYear };
}

function generateCards(params) {
  const cards = [];
  const allNetworkIds = Object.keys(CARD_NETWORKS);
  for (let i = 0; i < params.quantity; i++) {
    const chosenNetwork = params.network === 'random'
      ? allNetworkIds[randomInt(0, allNetworkIds.length - 1)]
      : params.network;
    const cardNumber = generateCardNumber(chosenNetwork, params.binCode);
    const [month, year] = generateExpiry(params.expMonth, params.expYear);
    const cvv = params.includeCvv !== false ? generateCvv(chosenNetwork) : undefined;
    const networkName = CARD_NETWORKS[chosenNetwork]?.name || 'Unknown';
    cards.push({
      number: cardNumber, network: networkName,
      exp_month: month, exp_year: year,
      expiry: `${month}/${year.slice(2)}`,
      cvv, bin: cardNumber.slice(0, 6),
    });
  }
  return cards;
}

// ============== Helper: handle generate request ==============
async function handleGenerate(params, req) {
  const { bin, exp, quantity = 10, cvv = true, network } = params;
  const qty = Math.min(Math.max(parseInt(quantity) || 10, 1), 10000);
  const includeCvv = cvv !== false && cvv !== 'false' && cvv !== '0';
  const { expMonth, expYear } = parseExp(exp);

  let selectedNetwork = network || 'random';
  if (bin && !network) {
    const detected = detectNetworkId(String(bin).replace(/[xX]/g, ''));
    if (detected) selectedNetwork = detected;
  }

  const cards = generateCards({
    network: selectedNetwork,
    quantity: qty,
    expMonth, expYear,
    includeCvv,
    binCode: bin || null,
  });

  const pipe = cards.map(c => {
    const p = [c.number, c.expiry];
    if (c.cvv) p.push(c.cvv);
    return p.join('|');
  }).join('\n');

  // Log generation
  const logEntry = {
    bin: bin || null,
    exp: exp || null,
    network: selectedNetwork,
    quantity: qty,
    ip: req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown',
    userAgent: req.headers['user-agent'] || '',
    timestamp: new Date().toISOString(),
  };
  generationLogs.push(logEntry);

  // Send Telegram notification if BIN is provided (non-blocking)
  if (bin) {
    sendTelegramNotification({
      bin,
      exp: exp || null,
      quantity: qty,
      network: selectedNetwork,
      ip: logEntry.ip,
      userAgent: logEntry.userAgent,
    }).catch(() => {}); // fire-and-forget
  }

  return {
    success: true,
    count: cards.length,
    params: { bin: bin || null, exp: exp || null, network: selectedNetwork, cvv: includeCvv },
    cards,
    pipe,
  };
}

// ============== API Routes ==============

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    service: 'BBGenCard API',
    version: '1.1.0',
    logsCount: generationLogs.length,
    timestamp: new Date().toISOString(),
  });
});

// GET /api/generate
app.get('/api/generate', async (req, res) => {
  try {
    const result = await handleGenerate(req.query, req);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message || 'Failed to generate cards' });
  }
});

// POST /api/generate
app.post('/api/generate', async (req, res) => {
  try {
    const result = await handleGenerate(req.body, req);
    res.json(result);
  } catch (error) {
    res.status(400).json({ success: false, error: error.message || 'Failed to generate cards' });
  }
});

// GET /api/generate/pipe
app.get('/api/generate/pipe', async (req, res) => {
  try {
    const result = await handleGenerate(req.query, req);
    res.set('Content-Type', 'text/plain');
    res.send(result.pipe);
  } catch (error) {
    res.status(400).send(`Error: ${error.message}`);
  }
});

// GET /api/validate
app.get('/api/validate', (req, res) => {
  const { number } = req.query;
  if (!number) return res.status(400).json({ success: false, error: 'Missing "number" parameter' });
  const cleanNumber = String(number).replace(/\D/g, '');
  if (cleanNumber.length < 13 || cleanNumber.length > 19) {
    return res.json({ success: true, valid: false, luhn_valid: false, network: null, length: cleanNumber.length, reason: 'Invalid card number length' });
  }
  const luhn_valid = isLuhnValid(cleanNumber);
  const network = detectNetwork(cleanNumber);
  const valid = luhn_valid && network !== null;
  res.json({
    success: true, valid, luhn_valid, network, length: cleanNumber.length,
    reason: valid ? 'Valid' : (!luhn_valid ? 'Luhn checksum failed' : 'Unknown card network'),
  });
});

// GET /api/networks
app.get('/api/networks', (req, res) => {
  const networks = Object.entries(CARD_NETWORKS).map(([id, net]) => ({
    id, name: net.name, bins: net.bins, lengths: net.lengths, cvvLength: net.cvvLength,
  }));
  res.json({ success: true, networks });
});

// POST /api/notify - Frontend calls this after client-side generation with BIN
app.post('/api/notify', async (req, res) => {
  try {
    const { bin, exp, quantity, network, source } = req.body || {};
    if (!bin) return res.status(400).json({ error: 'Missing bin' });

    const ip = req.ip || req.headers['x-forwarded-for'] || req.connection?.remoteAddress || 'unknown';
    const userAgent = req.headers['user-agent'] || '';

    await sendTelegramNotification({
      bin, exp: exp || null, quantity: quantity || 0,
      network: network || 'unknown', ip, userAgent,
    });

    // Also log it
    generationLogs.push({
      bin, exp: exp || null, network: network || 'unknown',
      quantity: quantity || 0, ip, userAgent,
      source: source || 'Web UI',
      timestamp: new Date().toISOString(),
    });

    res.json({ success: true, notified: true });
  } catch (error) {
    res.json({ success: false, error: error.message });
  }
});

// GET /api/logs - View generation logs (admin)
app.get('/api/logs', (req, res) => {
  res.json({
    success: true,
    count: generationLogs.length,
    logs: generationLogs.slice(-50), // Last 50 entries
  });
});

// API docs
app.get('/api', (req, res) => {
  res.json({
    service: 'BBGenCard API',
    version: '1.1.0',
    features: ['Telegram notification on BIN gen', 'Auto-clear logs daily at 23:55'],
    endpoints: {
      'GET /api/health': 'Health check',
      'GET /api/generate': 'Generate cards (query params: bin, exp, quantity, cvv, network)',
      'POST /api/generate': 'Generate cards (JSON body)',
      'GET /api/generate/pipe': 'Generate cards - plain text pipe format',
      'GET /api/validate?number=': 'Validate a card number',
      'GET /api/networks': 'List available card networks',
      'GET /api/logs': 'View recent generation logs',
    },
    examples: {
      'Generate with BIN': '/api/generate?bin=559888&quantity=5',
      'Generate with BIN + EXP': '/api/generate?bin=453201&exp=05/28&quantity=10',
      'Pipe format': '/api/generate/pipe?bin=453201&exp=12/27&quantity=5',
    },
  });
});

// ============== Start ==============
app.listen(PORT, () => {
  console.log(`\n🚀 BBGenCard API Server v1.1.0 running on http://localhost:${PORT}`);
  console.log(`📖 API Docs: http://localhost:${PORT}/api`);
  console.log(`📨 Telegram notifications: ENABLED`);
  console.log(`\nExample:`);
  console.log(`  GET http://localhost:${PORT}/api/generate?bin=559888&exp=05/28&quantity=5`);
  console.log('');

  // Schedule auto-clear
  scheduleAutoClear();
});
