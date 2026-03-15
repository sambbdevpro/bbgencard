import { useState } from 'react';
import { Wrench, Search, CheckCircle, XCircle } from 'lucide-react';
import { validateCard } from '../lib/cardGenerator';
import type { ValidationResult } from '../lib/cardGenerator';

export default function ToolsMode() {
  const [cardInput, setCardInput] = useState('');
  const [validationResult, setValidationResult] = useState<ValidationResult | null>(null);

  const handleValidate = () => {
    if (!cardInput.trim()) return;
    const result = validateCard(cardInput);
    setValidationResult(result);
  };

  return (
    <div className="fade-in">
      <div className="panel-header">
        <div className="panel-header-icon">
          <Wrench />
        </div>
        <div>
          <div className="panel-title">Tools</div>
          <div className="panel-subtitle">Validation & utilities</div>
        </div>
      </div>

      <div className="tools-grid">
        {/* Card Validator */}
        <div className="tool-section">
          <div className="tool-title">
            <Search /> Card Number Validator
          </div>
          <div className="form-group">
            <input
              type="text"
              className="form-input"
              placeholder="Enter card number to validate..."
              value={cardInput}
              onChange={e => setCardInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleValidate()}
              style={{ fontFamily: "'JetBrains Mono', monospace", letterSpacing: '0.1em' }}
            />
          </div>
          <button className="btn btn-secondary btn-full" onClick={handleValidate}>
            <Search /> Validate
          </button>

          {validationResult && (
            <div className={`validation-result fade-in ${validationResult.valid ? 'valid' : 'invalid'}`}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10, fontWeight: 700, fontSize: '0.95rem' }}>
                {validationResult.valid ? (
                  <><CheckCircle style={{ color: 'var(--accent-success)' }} /> Valid Card</>
                ) : (
                  <><XCircle style={{ color: 'var(--accent-danger)' }} /> Invalid Card</>
                )}
              </div>
              <div className="validation-row">
                <span className="validation-row-label">Luhn Check</span>
                <span className={`validation-row-value ${validationResult.luhn_valid ? 'valid' : 'invalid'}`}>
                  {validationResult.luhn_valid ? '✓ Pass' : '✗ Fail'}
                </span>
              </div>
              <div className="validation-row">
                <span className="validation-row-label">Network</span>
                <span className="validation-row-value" style={{ color: 'var(--text-primary)' }}>
                  {validationResult.network || 'Unknown'}
                </span>
              </div>
              <div className="validation-row">
                <span className="validation-row-label">Length</span>
                <span className="validation-row-value" style={{ color: 'var(--text-primary)' }}>
                  {validationResult.length} digits
                </span>
              </div>
              <div className="validation-row">
                <span className="validation-row-label">Status</span>
                <span className={`validation-row-value ${validationResult.valid ? 'valid' : 'invalid'}`}>
                  {validationResult.reason}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
