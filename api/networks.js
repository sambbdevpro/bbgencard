// Vercel Serverless: /api/networks

const CARD_NETWORKS = {
  visa: { id: 'visa', name: 'Visa', bins: ['4'], lengths: [16], cvvLength: 3 },
  mastercard: { id: 'mastercard', name: 'Mastercard', bins: ['51','52','53','54','55','2221','2720'], lengths: [16], cvvLength: 3 },
  amex: { id: 'amex', name: 'American Express', bins: ['34','37'], lengths: [15], cvvLength: 4 },
  discover: { id: 'discover', name: 'Discover', bins: ['6011','644','645','646','647','648','649','65'], lengths: [16], cvvLength: 3 },
  unionpay: { id: 'unionpay', name: 'UnionPay', bins: ['62'], lengths: [16,17,18,19], cvvLength: 3 },
  diners: { id: 'diners', name: 'Diners Club', bins: ['300','301','302','303','304','305','36','38'], lengths: [14,16], cvvLength: 3 },
  jcb: { id: 'jcb', name: 'JCB', bins: ['3528','3589'], lengths: [16], cvvLength: 3 },
};

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  const networks = Object.entries(CARD_NETWORKS).map(([id, n]) => ({
    id, name: n.name, bins: n.bins, lengths: n.lengths, cvvLength: n.cvvLength,
  }));
  res.json({ success: true, networks });
}
