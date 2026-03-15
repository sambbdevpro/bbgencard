// Utility: Send notification to backend when generating with a BIN
// This works on both local dev (proxy) and Vercel (serverless)

export async function notifyBinGeneration(data: {
  bin: string;
  exp?: string | null;
  quantity: number;
  network: string;
  source?: string;
}): Promise<void> {
  try {
    await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        bin: data.bin,
        exp: data.exp || null,
        quantity: data.quantity,
        network: data.network,
        source: data.source || 'Web UI',
      }),
    });
  } catch {
    // Silent fail — notification is non-critical
  }
}
