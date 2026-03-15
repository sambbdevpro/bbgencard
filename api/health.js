// Vercel Serverless: /api/health

export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.json({
    status: 'ok',
    service: 'BBGenCard API',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  });
}
