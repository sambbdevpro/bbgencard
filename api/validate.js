// Vercel Serverless: /api/validate

const CARD_NETWORKS = {
  visa: { bins: ['4'], name: 'Visa' },
  mastercard: { bins: ['51','52','53','54','55','2221','2720'], name: 'Mastercard' },
  amex: { bins: ['34','37'], name: 'American Express' },
  discover: { bins: ['6011','644','645','646','647','648','649','65'], name: 'Discover' },
  unionpay: { bins: ['62'], name: 'UnionPay' },
  diners: { bins: ['300','301','302','303','304','305','36','38'], name: 'Diners Club' },
  jcb: { bins: ['3528','3589'], name: 'JCB' },
};

function luhnChecksum(cn) {
  const d = cn.split('').map(Number), r = [...d].reverse();
  let o = 0, e = 0;
  for (let i = 0; i < r.length; i++) {
    if (i % 2 === 0) o += r[i];
    else { let v = r[i] * 2; if (v > 9) v -= 9; e += v; }
  }
  return (o + e) % 10;
}

function detectNetwork(cn) {
  for (const [, n] of Object.entries(CARD_NETWORKS))
    for (const b of n.bins) if (cn.startsWith(b)) return n.name;
  return null;
}

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const { number } = req.query;
  if (!number) return res.status(400).json({ success: false, error: 'Missing "number" parameter' });
  const clean = String(number).replace(/\D/g, '');
  if (clean.length < 13 || clean.length > 19) {
    return res.json({ success: true, valid: false, luhn_valid: false, network: null, length: clean.length, reason: 'Invalid card number length' });
  }
  const luhn_valid = luhnChecksum(clean) === 0;
  const network = detectNetwork(clean);
  const valid = luhn_valid && network !== null;
  res.json({ success: true, valid, luhn_valid, network, length: clean.length, reason: valid ? 'Valid' : (!luhn_valid ? 'Luhn checksum failed' : 'Unknown card network') });
}
