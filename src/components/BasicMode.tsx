import { useState } from 'react';
import { Zap, CreditCard } from 'lucide-react';
import { generateCards, getNetworks, getYearOptions, getCurrencies } from '../lib/cardGenerator';
import type { CardData } from '../lib/cardGenerator';

interface BasicModeProps {
  onCardsGenerated: (cards: CardData[]) => void;
}

export default function BasicMode({ onCardsGenerated }: BasicModeProps) {
  const [network, setNetwork] = useState('random');
  const [quantity, setQuantity] = useState(10);
  const [expMonth, setExpMonth] = useState<number | null>(null);
  const [expYear, setExpYear] = useState<number | null>(null);
  const [includeCvv, setIncludeCvv] = useState(true);
  const [includeBalance, setIncludeBalance] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [isGenerating, setIsGenerating] = useState(false);

  const networks = getNetworks();
  const years = getYearOptions();
  const currencies = getCurrencies();

  const handleGenerate = () => {
    setIsGenerating(true);
    setTimeout(() => {
      const cards = generateCards({
        network,
        quantity,
        expMonth,
        expYear,
        includeCvv,
        includeBalance,
        currency: includeBalance ? currency : null,
        binCode: null,
      });
      onCardsGenerated(cards);
      setIsGenerating(false);
    }, 150);
  };

  return (
    <div className="fade-in">
      <div className="panel-header">
        <div className="panel-header-icon">
          <CreditCard />
        </div>
        <div>
          <div className="panel-title">Basic Mode</div>
          <div className="panel-subtitle">Quick card generation</div>
        </div>
      </div>

      <div className="form-group">
        <label className="form-label">Card Network</label>
        <select
          className="form-select"
          value={network}
          onChange={e => setNetwork(e.target.value)}
        >
          <option value="random">🎲 Random</option>
          {networks.map(n => (
            <option key={n.id} value={n.id}>{n.name}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label className="form-label">Quantity ({quantity})</label>
        <div className="quantity-control">
          <input
            type="range"
            min="1"
            max="1000"
            value={quantity}
            onChange={e => setQuantity(Number(e.target.value))}
          />
          <span className="quantity-display">{quantity}</span>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label className="form-label">Exp Month</label>
          <select
            className="form-select"
            value={expMonth ?? ''}
            onChange={e => setExpMonth(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Random</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(m => (
              <option key={m} value={m}>{String(m).padStart(2, '0')}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label className="form-label">Exp Year</label>
          <select
            className="form-select"
            value={expYear ?? ''}
            onChange={e => setExpYear(e.target.value ? Number(e.target.value) : null)}
          >
            <option value="">Random</option>
            {years.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>
      </div>

      <div
        className="toggle-group"
        onClick={() => setIncludeCvv(!includeCvv)}
      >
        <span className="toggle-label">🔒 Include CVV</span>
        <div className={`toggle-switch ${includeCvv ? 'active' : ''}`} />
      </div>

      <div
        className="toggle-group"
        onClick={() => setIncludeBalance(!includeBalance)}
      >
        <span className="toggle-label">💰 Include Balance</span>
        <div className={`toggle-switch ${includeBalance ? 'active' : ''}`} />
      </div>

      {includeBalance && (
        <div className="form-group fade-in">
          <label className="form-label">Currency</label>
          <select
            className="form-select"
            value={currency}
            onChange={e => setCurrency(e.target.value)}
          >
            {currencies.map(([code, name]) => (
              <option key={code} value={code}>{code} — {name}</option>
            ))}
          </select>
        </div>
      )}

      <button
        className="btn btn-primary btn-full"
        onClick={handleGenerate}
        disabled={isGenerating}
        style={{ marginTop: 8 }}
      >
        {isGenerating ? <span className="spinner" /> : <Zap />}
        {isGenerating ? 'Generating...' : `Generate ${quantity} Cards`}
      </button>
    </div>
  );
}
