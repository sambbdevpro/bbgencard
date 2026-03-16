import { useState } from 'react';
import { MapPin, User, Phone, Mail, Copy, Trash2, Download, RefreshCw, ChevronDown, ChevronUp, Hash } from 'lucide-react';
import { generateAddresses, getAvailableStates, getAvailableCountries, type AddressData, type GenerateAddressParams } from '../lib/addressGenerator';

type ViewMode = 'cards' | 'table' | 'text';

export default function GenAddressPage() {
  const [addresses, setAddresses] = useState<AddressData[]>([]);
  const [quantity, setQuantity] = useState(5);
  const [selectedCountry, setSelectedCountry] = useState('US');
  const [selectedState, setSelectedState] = useState('');
  const [gender, setGender] = useState<'random' | 'male' | 'female'>('random');
  const [includePhone, setIncludePhone] = useState(true);
  const [includeEmail, setIncludeEmail] = useState(true);
  const [includeSSN, setIncludeSSN] = useState(true);
  const [includeDOB, setIncludeDOB] = useState(true);
  const [viewMode, setViewMode] = useState<ViewMode>('cards');
  const [toast, setToast] = useState<string | null>(null);
  const [expandedCard, setExpandedCard] = useState<number | null>(null);

  const states = getAvailableStates(selectedCountry);
  const countries = getAvailableCountries();

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleGenerate = () => {
    const params: GenerateAddressParams = {
      quantity,
      country: selectedCountry,
      stateAbbr: selectedState || undefined,
      gender,
      includePhone,
      includeEmail,
      includeSSN,
      includeDOB,
    };
    const result = generateAddresses(params);
    setAddresses(result);
  };

  const handleClear = () => {
    setAddresses([]);
    setExpandedCard(null);
  };

  const copyToClipboard = (text: string, label: string = 'Copied') => {
    navigator.clipboard.writeText(text).then(() => showToast(`${label} to clipboard!`));
  };

  const copyAllAsJSON = () => {
    copyToClipboard(JSON.stringify(addresses, null, 2), 'JSON copied');
  };

  const copyAllAsCSV = () => {
    const headers = ['Full Name', 'Street Address', 'City', 'State', 'Zip', 'Country', 'Phone', 'Email', 'SSN Last 4', 'DOB'];
    const rows = addresses.map(a => [
      a.fullName, a.streetAddress + (a.secondaryAddress ? ` ${a.secondaryAddress}` : ''),
      a.city, a.stateAbbr, a.zipCode, a.countryCode, a.phone, a.email, a.ssnLast4, a.dob,
    ].join(','));
    copyToClipboard([headers.join(','), ...rows].join('\n'), 'CSV copied');
  };

  const copyAllAsText = () => {
    const text = addresses.map(a => {
      let line = `${a.fullName}\n${a.streetAddress}`;
      if (a.secondaryAddress) line += ` ${a.secondaryAddress}`;
      line += `\n${a.city}, ${a.stateAbbr} ${a.zipCode}\n${a.country}`;
      if (a.phone) line += `\nPhone: ${a.phone}`;
      if (a.email) line += `\nEmail: ${a.email}`;
      return line;
    }).join('\n---\n');
    copyToClipboard(text, 'Text copied');
  };

  const downloadJSON = () => {
    const blob = new Blob([JSON.stringify(addresses, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fake_addresses.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  const copySingleAddress = (addr: AddressData) => {
    const text = `${addr.fullName}\n${addr.streetAddress}${addr.secondaryAddress ? ` ${addr.secondaryAddress}` : ''}\n${addr.city}, ${addr.stateAbbr} ${addr.zipCode}`;
    copyToClipboard(text, 'Address copied');
  };

  return (
    <div className="genaddress-page">
      {/* Controls Panel */}
      <div className="ga-controls glass-panel">
        <div className="panel-header">
          <div className="panel-header-icon ga-icon">
            <MapPin size={20} />
          </div>
          <div>
            <h2 className="panel-title">Generate Fake Address</h2>
            <p className="panel-subtitle">Realistic address data for testing — {countries.length} countries</p>
          </div>
        </div>

        {/* Country & State */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Country</label>
            <select
              className="form-select"
              value={selectedCountry}
              onChange={e => { setSelectedCountry(e.target.value); setSelectedState(''); }}
            >
              {countries.map(c => (
                <option key={c.code} value={c.code}>{c.name}</option>
              ))}
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">State / Region</label>
            <select
              className="form-select"
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
            >
              <option value="">Random</option>
              {states.map(s => (
                <option key={s.abbr} value={s.abbr}>{s.name} ({s.abbr})</option>
              ))}
            </select>
          </div>
        </div>

        {/* Gender & Quantity */}
        <div className="form-row">
          <div className="form-group">
            <label className="form-label">Gender</label>
            <select className="form-select" value={gender} onChange={e => setGender(e.target.value as 'random' | 'male' | 'female')}>
              <option value="random">Random</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
            </select>
          </div>
          <div className="form-group">
            <label className="form-label">Quantity ({quantity})</label>
            <div className="quantity-control">
              <input
                type="range"
                min={1}
                max={100}
                value={quantity}
                onChange={e => setQuantity(parseInt(e.target.value))}
              />
              <span className="quantity-display">{quantity}</span>
            </div>
          </div>
        </div>

        {/* Toggles */}
        <div className="ga-toggles">
          <div className="toggle-group" onClick={() => setIncludePhone(!includePhone)}>
            <span className="toggle-label"><Phone size={14} /> Phone</span>
            <div className={`toggle-switch ${includePhone ? 'active' : ''}`} />
          </div>
          <div className="toggle-group" onClick={() => setIncludeEmail(!includeEmail)}>
            <span className="toggle-label"><Mail size={14} /> Email</span>
            <div className={`toggle-switch ${includeEmail ? 'active' : ''}`} />
          </div>
          <div className="toggle-group" onClick={() => setIncludeSSN(!includeSSN)}>
            <span className="toggle-label"><Hash size={14} /> SSN Last 4</span>
            <div className={`toggle-switch ${includeSSN ? 'active' : ''}`} />
          </div>
          <div className="toggle-group" onClick={() => setIncludeDOB(!includeDOB)}>
            <span className="toggle-label"><User size={14} /> Date of Birth</span>
            <div className={`toggle-switch ${includeDOB ? 'active' : ''}`} />
          </div>
        </div>

        {/* Generate Button */}
        <button className="btn btn-primary btn-full ga-generate-btn" onClick={handleGenerate}>
          <RefreshCw size={18} />
          Generate {quantity} Address{quantity > 1 ? 'es' : ''}
        </button>
      </div>

      {/* Results Panel */}
      <div className="ga-results glass-panel">
        <div className="ga-results-header">
          <div className="ga-results-info">
            <h3 className="panel-title">Generated Addresses</h3>
            <span className="ga-count-badge">{addresses.length} results</span>
          </div>

          {addresses.length > 0 && (
            <div className="ga-results-actions">
              {/* View Mode Toggle */}
              <div className="view-toggle">
                <button className={`view-toggle-btn ${viewMode === 'cards' ? 'active' : ''}`} onClick={() => setViewMode('cards')}>Cards</button>
                <button className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`} onClick={() => setViewMode('table')}>Table</button>
                <button className={`view-toggle-btn ${viewMode === 'text' ? 'active' : ''}`} onClick={() => setViewMode('text')}>Text</button>
              </div>
            </div>
          )}
        </div>

        {addresses.length === 0 ? (
          <div className="result-empty">
            <MapPin size={48} />
            <p className="result-empty-text">Click generate to create fake addresses</p>
          </div>
        ) : (
          <>
            {/* Action buttons */}
            <div className="ga-bulk-actions">
              <button className="btn btn-sm btn-secondary" onClick={copyAllAsJSON}>
                <Copy size={14} /> JSON
              </button>
              <button className="btn btn-sm btn-secondary" onClick={copyAllAsCSV}>
                <Copy size={14} /> CSV
              </button>
              <button className="btn btn-sm btn-secondary" onClick={copyAllAsText}>
                <Copy size={14} /> Text
              </button>
              <button className="btn btn-sm btn-secondary" onClick={downloadJSON}>
                <Download size={14} /> Download
              </button>
              <button className="btn btn-sm btn-danger" onClick={handleClear}>
                <Trash2 size={14} /> Clear
              </button>
            </div>

            {/* Cards View */}
            {viewMode === 'cards' && (
              <div className="ga-cards-grid">
                {addresses.map((addr, idx) => (
                  <div
                    key={idx}
                    className={`ga-address-card ${expandedCard === idx ? 'expanded' : ''}`}
                    onClick={() => setExpandedCard(expandedCard === idx ? null : idx)}
                  >
                    <div className="ga-card-main">
                      <div className="ga-card-name">
                        <User size={16} />
                        <strong>{addr.fullName}</strong>
                      </div>
                      <div className="ga-card-address">
                        <MapPin size={14} />
                        <div>
                          <div>{addr.streetAddress}{addr.secondaryAddress && `, ${addr.secondaryAddress}`}</div>
                          <div>{addr.city}, {addr.stateAbbr} {addr.zipCode}</div>
                        </div>
                      </div>
                      {addr.phone && (
                        <div className="ga-card-detail">
                          <Phone size={14} /> {addr.phone}
                        </div>
                      )}
                      {addr.email && (
                        <div className="ga-card-detail">
                          <Mail size={14} /> {addr.email}
                        </div>
                      )}
                    </div>

                    {expandedCard === idx && (
                      <div className="ga-card-expanded fade-in">
                        {addr.dob && <div className="ga-card-detail"><User size={14} /> DOB: {addr.dob}</div>}
                        {addr.ssnLast4 && <div className="ga-card-detail"><Hash size={14} /> SSN: ***-**-{addr.ssnLast4}</div>}
                        <div className="ga-card-detail"><MapPin size={14} /> {addr.country} ({addr.countryCode})</div>
                        <div className="ga-card-copy-row">
                          <button className="btn btn-sm btn-secondary" onClick={(e) => { e.stopPropagation(); copySingleAddress(addr); }}>
                            <Copy size={12} /> Copy Address
                          </button>
                          <button className="btn btn-sm btn-secondary" onClick={(e) => { e.stopPropagation(); copyToClipboard(JSON.stringify(addr, null, 2), 'JSON copied'); }}>
                            <Copy size={12} /> Copy JSON
                          </button>
                        </div>
                      </div>
                    )}

                    <div className="ga-card-expand-hint">
                      {expandedCard === idx ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Table View */}
            {viewMode === 'table' && (
              <div className="cards-table-wrapper">
                <table className="cards-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Name</th>
                      <th>Address</th>
                      <th>City</th>
                      <th>State</th>
                      <th>Zip</th>
                      {includePhone && <th>Phone</th>}
                      {includeEmail && <th>Email</th>}
                    </tr>
                  </thead>
                  <tbody>
                    {addresses.map((addr, idx) => (
                      <tr key={idx} onClick={() => copySingleAddress(addr)} style={{ cursor: 'pointer' }}>
                        <td>{idx + 1}</td>
                        <td className="card-number-cell">{addr.fullName}</td>
                        <td>{addr.streetAddress}</td>
                        <td>{addr.city}</td>
                        <td>{addr.stateAbbr}</td>
                        <td>{addr.zipCode}</td>
                        {includePhone && <td>{addr.phone}</td>}
                        {includeEmail && <td>{addr.email}</td>}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Text View */}
            {viewMode === 'text' && (
              <div className="result-output">
                {addresses.map((addr, idx) => (
                  `[${idx + 1}] ${addr.fullName}\n    ${addr.streetAddress}${addr.secondaryAddress ? ` ${addr.secondaryAddress}` : ''}\n    ${addr.city}, ${addr.stateAbbr} ${addr.zipCode}\n    ${addr.country}${addr.phone ? `\n    Phone: ${addr.phone}` : ''}${addr.email ? `\n    Email: ${addr.email}` : ''}${addr.dob ? `\n    DOB: ${addr.dob}` : ''}${addr.ssnLast4 ? `\n    SSN: ***-**-${addr.ssnLast4}` : ''}\n`
                )).join('\n')}
              </div>
            )}
          </>
        )}
      </div>

      {/* API Reference */}
      <div className="ga-api-ref glass-panel">
        <div className="panel-header">
          <div className="panel-header-icon" style={{ background: 'linear-gradient(135deg, #00cec9, #6c5ce7)' }}>
            <Hash size={20} />
          </div>
          <div>
            <h2 className="panel-title">API Reference</h2>
            <p className="panel-subtitle">Use the API to generate addresses programmatically</p>
          </div>
        </div>

        <div className="api-endpoint-list">
          <div className="api-endpoint-item">
            <span className="api-method api-method-get">GET</span>
            <span className="api-path">/api/address?quantity=5&country=US&state=CA</span>
          </div>
          <div className="api-endpoint-item">
            <span className="api-method api-method-get">GET</span>
            <span className="api-path">/api/address?quantity=10&gender=female</span>
          </div>
          <div className="api-endpoint-item">
            <span className="api-method api-method-post">POST</span>
            <span className="api-path">/api/address</span>
          </div>
        </div>

        <div className="api-detail">
          <h4 className="api-detail-title">Parameters</h4>
          <div className="api-params-table">
            <div className="api-param-header">
              <span>Param</span><span>Type</span><span>Req</span><span>Description</span>
            </div>
            <div className="api-param-row">
              <span className="api-param-name">quantity</span>
              <span className="api-param-type">int</span>
              <span className="api-param-required no">No</span>
              <span className="api-param-desc">Number of addresses (1-100, default: 5)</span>
            </div>
            <div className="api-param-row">
              <span className="api-param-name">country</span>
              <span className="api-param-type">string</span>
              <span className="api-param-required no">No</span>
              <span className="api-param-desc">Country code: US, GB, CA, etc. (default: US)</span>
            </div>
            <div className="api-param-row">
              <span className="api-param-name">state</span>
              <span className="api-param-type">string</span>
              <span className="api-param-required no">No</span>
              <span className="api-param-desc">US state abbreviation: CA, NY, TX, etc.</span>
            </div>
            <div className="api-param-row">
              <span className="api-param-name">gender</span>
              <span className="api-param-type">string</span>
              <span className="api-param-required no">No</span>
              <span className="api-param-desc">Name gender: male, female, random</span>
            </div>
            <div className="api-param-row">
              <span className="api-param-name">phone</span>
              <span className="api-param-type">bool</span>
              <span className="api-param-required no">No</span>
              <span className="api-param-desc">Include phone number (default: true)</span>
            </div>
            <div className="api-param-row">
              <span className="api-param-name">email</span>
              <span className="api-param-type">bool</span>
              <span className="api-param-required no">No</span>
              <span className="api-param-desc">Include email (default: true)</span>
            </div>
          </div>
        </div>

        <div className="api-example">
          <div className="api-example-header">
            <span className="api-example-label">Example Response</span>
            <button className="api-copy-btn" onClick={() => copyToClipboard('/api/address?quantity=3&state=CA', 'URL copied')}>
              <Copy size={12} /> Copy URL
            </button>
          </div>
          <code className="api-example-code">
{`GET /api/address?quantity=1&state=CA

{
  "success": true,
  "count": 1,
  "addresses": [{
    "fullName": "James Wilson",
    "streetAddress": "4521 Oak Avenue",
    "city": "New Jamesport",
    "state": "California",
    "stateAbbr": "CA",
    "zipCode": "90042",
    "country": "United States",
    "phone": "(415) 555-1234",
    "email": "james.wilson@gmail.com"
  }]
}`}
          </code>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className="toast">
          <Copy size={16} />
          {toast}
        </div>
      )}
    </div>
  );
}
