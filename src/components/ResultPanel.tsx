import { useState } from 'react';
import {
  BarChart3, Copy, Download, Trash2,
  CreditCard, LayoutGrid, List, Table
} from 'lucide-react';
import { exportCards } from '../lib/cardGenerator';
import type { CardData, ExportFormat } from '../lib/cardGenerator';

interface ResultPanelProps {
  cards: CardData[];
  onClear: () => void;
  onToast: (message: string) => void;
}

type ViewMode = 'cards' | 'table' | 'raw';

export default function ResultPanel({ cards, onClear, onToast }: ResultPanelProps) {
  const [exportFormat, setExportFormat] = useState<ExportFormat>('PIPE');
  const [viewMode, setViewMode] = useState<ViewMode>('cards');

  const formats: ExportFormat[] = ['PIPE', 'CSV', 'JSON', 'XML', 'SQL', 'CARD'];

  const getExportedText = () => {
    if (cards.length === 0) return '';
    return exportCards(cards, exportFormat);
  };

  const handleCopy = async () => {
    const text = getExportedText();
    if (!text) return;
    try {
      if (navigator.clipboard && window.isSecureContext) {
        await navigator.clipboard.writeText(text);
      } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        textarea.style.position = 'fixed';
        textarea.style.left = '-999999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
      }
      onToast('Copied to clipboard!');
    } catch {
      onToast('Failed to copy');
    }
  };

  const handleDownload = () => {
    const text = getExportedText();
    if (!text) return;
    const extensions: Record<ExportFormat, string> = {
      CARD: 'txt', PIPE: 'txt', CSV: 'csv', JSON: 'json', XML: 'xml', SQL: 'sql'
    };
    const ext = extensions[exportFormat];
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cards-${Date.now()}.${ext}`;
    a.click();
    URL.revokeObjectURL(url);
    onToast(`Downloaded as .${ext}`);
  };

  const getCardClass = (networkName: string): string => {
    const lower = networkName.toLowerCase();
    if (lower.includes('visa')) return 'visa';
    if (lower.includes('master')) return 'mastercard';
    if (lower.includes('amex') || lower.includes('american')) return 'amex';
    if (lower.includes('discover')) return 'discover';
    if (lower.includes('union')) return 'unionpay';
    if (lower.includes('diners')) return 'diners';
    if (lower.includes('jcb')) return 'jcb';
    return 'default-card';
  };

  const formatCardNumber = (num: string): string => {
    return num.replace(/(.{4})/g, '$1 ').trim();
  };

  // Unique networks count
  const uniqueNetworks = new Set(cards.map(c => c.network)).size;

  return (
    <div className="result-container">
      <div className="glass-panel">
        <div className="panel-header">
          <div className="panel-header-icon">
            <BarChart3 />
          </div>
          <div style={{ flex: 1 }}>
            <div className="panel-title">Results</div>
            <div className="panel-subtitle">{cards.length} cards generated</div>
          </div>
          {cards.length > 0 && (
            <div className="view-toggle">
              <button
                className={`view-toggle-btn ${viewMode === 'cards' ? 'active' : ''}`}
                onClick={() => setViewMode('cards')}
                title="Card View"
              >
                <LayoutGrid />
              </button>
              <button
                className={`view-toggle-btn ${viewMode === 'table' ? 'active' : ''}`}
                onClick={() => setViewMode('table')}
                title="Table View"
              >
                <Table />
              </button>
              <button
                className={`view-toggle-btn ${viewMode === 'raw' ? 'active' : ''}`}
                onClick={() => setViewMode('raw')}
                title="Raw View"
              >
                <List />
              </button>
            </div>
          )}
        </div>

        {cards.length > 0 && (
          <div className="result-stats fade-in">
            <div className="stat-card">
              <div className="stat-value">{cards.length}</div>
              <div className="stat-label">Cards</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{uniqueNetworks}</div>
              <div className="stat-label">Networks</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">{cards[0]?.cvv ? 'Yes' : 'No'}</div>
              <div className="stat-label">CVV</div>
            </div>
          </div>
        )}

        {cards.length === 0 ? (
          <div className="result-empty">
            <CreditCard />
            <div className="result-empty-text">
              Generate cards to see results
            </div>
          </div>
        ) : (
          <>
            {/* Export formats */}
            <div className="export-formats">
              {formats.map(f => (
                <button
                  key={f}
                  className={`format-pill ${exportFormat === f ? 'active' : ''}`}
                  onClick={() => setExportFormat(f)}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* View modes */}
            {viewMode === 'cards' && (
              <div className="card-visual-grid fade-in">
                {cards.slice(0, 20).map((card, i) => (
                  <div
                    key={i}
                    className={`credit-card-visual ${getCardClass(card.network)}`}
                    onClick={() => {
                      const text = `${card.number}|${card.expiry}${card.cvv ? `|${card.cvv}` : ''}`;
                      navigator.clipboard?.writeText(text);
                      onToast(`Card #${i + 1} copied!`);
                    }}
                  >
                    <div className="card-pattern" />
                    <div className="card-top">
                      <div className="card-chip" />
                      <div className="card-network-label">{card.network}</div>
                    </div>
                    <div className="card-number-display">
                      {formatCardNumber(card.number)}
                    </div>
                    <div className="card-bottom">
                      <div className="card-detail">
                        <div className="card-detail-label">Expiry</div>
                        <div className="card-detail-value">{card.expiry}</div>
                      </div>
                      {card.cvv && (
                        <div className="card-detail">
                          <div className="card-detail-label">CVV</div>
                          <div className="card-detail-value">{card.cvv}</div>
                        </div>
                      )}
                      {card.balance && (
                        <div className="card-detail">
                          <div className="card-detail-label">Balance</div>
                          <div className="card-detail-value">
                            {card.balance.toFixed(2)} {card.currency}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
                {cards.length > 20 && (
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: 20,
                    color: 'var(--text-muted)',
                    fontSize: '0.85rem',
                    gridColumn: '1 / -1'
                  }}>
                    +{cards.length - 20} more cards (switch to Table or Raw view)
                  </div>
                )}
              </div>
            )}

            {viewMode === 'table' && (
              <div className="cards-table-wrapper fade-in">
                <table className="cards-table">
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>Number</th>
                      <th>Network</th>
                      <th>Expiry</th>
                      {cards[0]?.cvv && <th>CVV</th>}
                      {cards[0]?.balance && <th>Balance</th>}
                      <th>BIN</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cards.map((card, i) => (
                      <tr key={i}>
                        <td>{i + 1}</td>
                        <td className="card-number-cell">{card.number}</td>
                        <td>{card.network}</td>
                        <td>{card.expiry}</td>
                        {card.cvv !== undefined && <td>{card.cvv}</td>}
                        {card.balance !== undefined && (
                          <td>{card.balance.toFixed(2)} {card.currency}</td>
                        )}
                        <td>{card.bin}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {viewMode === 'raw' && (
              <div className="result-output fade-in">
                {getExportedText()}
              </div>
            )}

            {/* Actions */}
            <div className="result-actions">
              <button className="btn btn-secondary btn-sm" onClick={handleCopy}>
                <Copy /> Copy
              </button>
              <button className="btn btn-success btn-sm" onClick={handleDownload}>
                <Download /> Download
              </button>
              <button className="btn btn-danger btn-sm" onClick={onClear} style={{ marginLeft: 'auto' }}>
                <Trash2 /> Clear
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
