import { useState } from 'react';
import { Code, Copy, CheckCircle, ExternalLink, Play, Loader } from 'lucide-react';

interface ApiResponse {
  status: number;
  body: string;
  time: number;
}

export default function ApiDocsMode() {
  const [activeEndpoint, setActiveEndpoint] = useState(0);
  const [tryBin, setTryBin] = useState('559888');
  const [tryExp, setTryExp] = useState('05/28');
  const [tryQty, setTryQty] = useState('5');
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [apiResponse, setApiResponse] = useState<ApiResponse | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const baseUrl = window.location.origin;
  const apiBase = `${baseUrl}/api`;

  const endpoints = [
    {
      method: 'GET',
      path: '/api/generate',
      title: 'Generate Cards',
      description: 'Generate test card numbers with optional BIN and expiry date.',
      params: [
        { name: 'bin', type: 'string', required: false, desc: 'BIN prefix (e.g., 559888, 453201xxxxxxxxxx)' },
        { name: 'exp', type: 'string', required: false, desc: 'Expiry date (MM/YY, MM/YYYY, MMYY, MMYYYY)' },
        { name: 'quantity', type: 'number', required: false, desc: 'Number of cards to generate (1-10000, default: 10)' },
        { name: 'cvv', type: 'boolean', required: false, desc: 'Include CVV (default: true)' },
        { name: 'network', type: 'string', required: false, desc: 'Card network (visa, mastercard, amex, discover, unionpay, diners, jcb, random)' },
      ],
      examples: [
        { label: 'Basic by BIN', url: '/api/generate?bin=559888&quantity=5' },
        { label: 'BIN + Expiry', url: '/api/generate?bin=453201&exp=05/28&quantity=10' },
        { label: 'BIN with pattern', url: '/api/generate?bin=559888039xxxxxxx&quantity=5' },
        { label: 'By network', url: '/api/generate?network=visa&quantity=3' },
      ],
      response: `{
  "success": true,
  "count": 5,
  "params": {
    "bin": "559888",
    "exp": null,
    "network": "mastercard",
    "cvv": true
  },
  "cards": [
    {
      "number": "5598880391234567",
      "network": "Mastercard",
      "exp_month": "08",
      "exp_year": "2029",
      "expiry": "08/29",
      "cvv": "432",
      "bin": "559888"
    }
  ],
  "pipe": "5598880391234567|08/29|432\\n..."
}`,
    },
    {
      method: 'POST',
      path: '/api/generate',
      title: 'Generate Cards (POST)',
      description: 'Same as GET but accepts JSON body.',
      params: [
        { name: 'bin', type: 'string', required: false, desc: 'BIN prefix' },
        { name: 'exp', type: 'string', required: false, desc: 'Expiry date' },
        { name: 'quantity', type: 'number', required: false, desc: 'Number of cards (1-10000)' },
        { name: 'cvv', type: 'boolean', required: false, desc: 'Include CVV' },
        { name: 'network', type: 'string', required: false, desc: 'Card network' },
      ],
      examples: [
        {
          label: 'cURL example',
          url: `curl -X POST ${apiBase}/generate \\
  -H "Content-Type: application/json" \\
  -d '{"bin":"559888","exp":"05/28","quantity":5}'`,
        },
      ],
      response: `// Same response format as GET /api/generate`,
    },
    {
      method: 'GET',
      path: '/api/generate/pipe',
      title: 'Generate Cards (Pipe Format)',
      description: 'Returns plain text in pipe-delimited format. Perfect for scripts and automation.',
      params: [
        { name: 'bin', type: 'string', required: false, desc: 'BIN prefix' },
        { name: 'exp', type: 'string', required: false, desc: 'Expiry date' },
        { name: 'quantity', type: 'number', required: false, desc: 'Number of cards' },
        { name: 'cvv', type: 'boolean', required: false, desc: 'Include CVV' },
      ],
      examples: [
        { label: 'Pipe output', url: '/api/generate/pipe?bin=559888&exp=05/28&quantity=3' },
      ],
      response: `5598881234567890|05/28|432
5598889876543210|05/28|891
5598885555666677|05/28|256`,
    },
    {
      method: 'GET',
      path: '/api/validate',
      title: 'Validate Card Number',
      description: 'Check if a card number passes Luhn validation and detect network.',
      params: [
        { name: 'number', type: 'string', required: true, desc: 'Card number to validate' },
      ],
      examples: [
        { label: 'Valid card', url: '/api/validate?number=4532015112830366' },
      ],
      response: `{
  "success": true,
  "valid": true,
  "luhn_valid": true,
  "network": "Visa",
  "length": 16,
  "reason": "Valid"
}`,
    },
    {
      method: 'GET',
      path: '/api/networks',
      title: 'List Networks',
      description: 'List all available card networks with their BIN ranges and card lengths.',
      params: [],
      examples: [
        { label: 'List all', url: '/api/networks' },
      ],
      response: `{
  "success": true,
  "networks": [
    {
      "id": "visa",
      "name": "Visa",
      "bins": ["4"],
      "lengths": [16],
      "cvvLength": 3
    },
    ...
  ]
}`,
    },
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard?.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  const handleTryApi = async () => {
    setIsLoading(true);
    setApiResponse(null);
    const params = new URLSearchParams();
    if (tryBin) params.set('bin', tryBin);
    if (tryExp) params.set('exp', tryExp);
    if (tryQty) params.set('quantity', tryQty);

    const url = `/api/generate?${params.toString()}`;
    const start = performance.now();

    try {
      const res = await fetch(url);
      const elapsed = performance.now() - start;
      const body = await res.text();
      setApiResponse({
        status: res.status,
        body: JSON.stringify(JSON.parse(body), null, 2),
        time: Math.round(elapsed),
      });
    } catch {
      setApiResponse({
        status: 0,
        body: 'Failed to connect. Make sure the API server is running (node server.js)',
        time: 0,
      });
    }
    setIsLoading(false);
  };

  const ep = endpoints[activeEndpoint];

  return (
    <div className="fade-in">
      <div className="panel-header">
        <div className="panel-header-icon">
          <Code />
        </div>
        <div>
          <div className="panel-title">API Documentation</div>
          <div className="panel-subtitle">REST API for card generation</div>
        </div>
      </div>

      {/* API Base URL */}
      <div className="api-base-url">
        <span className="api-base-label">Base URL</span>
        <code className="api-base-value">{apiBase}</code>
      </div>

      {/* Endpoint selector */}
      <div className="api-endpoint-list">
        {endpoints.map((ep, i) => (
          <button
            key={i}
            className={`api-endpoint-item ${activeEndpoint === i ? 'active' : ''}`}
            onClick={() => setActiveEndpoint(i)}
          >
            <span className={`api-method api-method-${ep.method.toLowerCase()}`}>
              {ep.method}
            </span>
            <span className="api-path">{ep.path}</span>
          </button>
        ))}
      </div>

      {/* Endpoint detail */}
      <div className="api-detail fade-in" key={activeEndpoint}>
        <h3 className="api-detail-title">{ep.title}</h3>
        <p className="api-detail-desc">{ep.description}</p>

        {/* Parameters */}
        {ep.params.length > 0 && (
          <div className="api-params-section">
            <div className="api-section-title">Parameters</div>
            <div className="api-params-table">
              <div className="api-param-header">
                <span>Name</span>
                <span>Type</span>
                <span>Required</span>
                <span>Description</span>
              </div>
              {ep.params.map((param, i) => (
                <div key={i} className="api-param-row">
                  <code className="api-param-name">{param.name}</code>
                  <span className="api-param-type">{param.type}</span>
                  <span className={`api-param-required ${param.required ? 'yes' : 'no'}`}>
                    {param.required ? 'Yes' : 'No'}
                  </span>
                  <span className="api-param-desc">{param.desc}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Examples */}
        <div className="api-section-title">Examples</div>
        {ep.examples.map((ex, i) => (
          <div key={i} className="api-example">
            <div className="api-example-header">
              <span className="api-example-label">{ex.label}</span>
              <button
                className="api-copy-btn"
                onClick={() => handleCopy(ex.url.startsWith('curl') ? ex.url : `${apiBase}${ex.url.replace('/api', '')}`, i)}
              >
                {copiedIndex === i ? (
                  <><CheckCircle size={14} /> Copied</>
                ) : (
                  <><Copy size={14} /> Copy</>
                )}
              </button>
            </div>
            <code className="api-example-code">
              {ex.url.startsWith('curl') ? ex.url : `${apiBase}${ex.url.replace('/api', '')}`}
            </code>
            {!ex.url.startsWith('curl') && (
              <a
                href={ex.url}
                target="_blank"
                rel="noopener noreferrer"
                className="api-try-link"
              >
                <ExternalLink size={12} /> Open in browser
              </a>
            )}
          </div>
        ))}

        {/* Response */}
        <div className="api-section-title">Response</div>
        <div className="api-response-block">
          <pre>{ep.response}</pre>
        </div>
      </div>

      {/* Interactive Try It */}
      <div className="api-try-section">
        <div className="api-section-title" style={{ marginBottom: 12 }}>
          <Play size={16} /> Try It Live
        </div>
        <div className="api-try-form">
          <div className="form-group">
            <label className="form-label">BIN</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 559888"
              value={tryBin}
              onChange={e => setTryBin(e.target.value)}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            />
          </div>
          <div className="form-group">
            <label className="form-label">EXP</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. 05/28"
              value={tryExp}
              onChange={e => setTryExp(e.target.value)}
              style={{ fontFamily: "'JetBrains Mono', monospace" }}
            />
          </div>
          <div className="form-group">
            <label className="form-label">Quantity</label>
            <input
              type="number"
              className="form-input"
              min="1"
              max="100"
              value={tryQty}
              onChange={e => setTryQty(e.target.value)}
            />
          </div>
        </div>
        <button
          className="btn btn-primary btn-full"
          onClick={handleTryApi}
          disabled={isLoading}
          style={{ marginTop: 8 }}
        >
          {isLoading ? <Loader size={18} className="spin-icon" /> : <Play size={18} />}
          {isLoading ? 'Requesting...' : 'Send Request'}
        </button>
        {apiResponse && (
          <div className="api-live-response fade-in">
            <div className="api-live-response-header">
              <span className={`api-status-badge ${apiResponse.status === 200 ? 'success' : 'error'}`}>
                {apiResponse.status || 'ERR'}
              </span>
              {apiResponse.time > 0 && (
                <span className="api-response-time">{apiResponse.time}ms</span>
              )}
            </div>
            <pre className="api-live-response-body">{apiResponse.body}</pre>
          </div>
        )}
      </div>
    </div>
  );
}
