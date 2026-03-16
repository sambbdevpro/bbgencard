import { useState, useEffect } from 'react';
import { CreditCard, Settings, Wrench, AlertTriangle, CheckCircle, Code } from 'lucide-react';
import BasicMode from '../components/BasicMode';
import AdvancedMode from '../components/AdvancedMode';
import ToolsMode from '../components/ToolsMode';
import ApiDocsMode from '../components/ApiDocsMode';
import ResultPanel from '../components/ResultPanel';
import type { CardData } from '../lib/cardGenerator';

type Tab = 'basic' | 'advanced' | 'tools' | 'api';

export default function GenCardPage() {
  const [activeTab, setActiveTab] = useState<Tab>('basic');
  const [cards, setCards] = useState<CardData[]>([]);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 2500);
  };

  const handleCardsGenerated = (newCards: CardData[]) => {
    setCards(newCards);
  };

  const handleClear = () => {
    setCards([]);
  };

  // Keyboard shortcut: Ctrl+G to generate
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.key === 'g') {
        e.preventDefault();
        const btn = document.querySelector('.btn-primary.btn-full') as HTMLButtonElement;
        btn?.click();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const showResults = activeTab === 'basic' || activeTab === 'advanced';

  return (
    <div className="gencard-page">
      {/* Disclaimer */}
      <div className="disclaimer-bar">
        <AlertTriangle />
        <span>
          <strong>Disclaimer:</strong> Generated card numbers are for software testing purposes only.
          They are based on the Luhn algorithm and do not correspond to real bank accounts.
        </span>
      </div>

      {/* Navigation Tabs */}
      <nav className="nav-tabs">
        <button
          className={`nav-tab ${activeTab === 'basic' ? 'active' : ''}`}
          onClick={() => setActiveTab('basic')}
        >
          <CreditCard /> Basic
        </button>
        <button
          className={`nav-tab ${activeTab === 'advanced' ? 'active' : ''}`}
          onClick={() => setActiveTab('advanced')}
        >
          <Settings /> Advanced
        </button>
        <button
          className={`nav-tab ${activeTab === 'tools' ? 'active' : ''}`}
          onClick={() => setActiveTab('tools')}
        >
          <Wrench /> Tools
        </button>
        <button
          className={`nav-tab ${activeTab === 'api' ? 'active' : ''}`}
          onClick={() => setActiveTab('api')}
        >
          <Code /> API
        </button>
      </nav>

      {/* Main Content */}
      <div className={`main-layout ${!showResults ? 'full-width' : ''}`}>
        <div className="glass-panel">
          {activeTab === 'basic' && (
            <BasicMode onCardsGenerated={handleCardsGenerated} />
          )}
          {activeTab === 'advanced' && (
            <AdvancedMode onCardsGenerated={handleCardsGenerated} />
          )}
          {activeTab === 'tools' && <ToolsMode />}
          {activeTab === 'api' && <ApiDocsMode />}
        </div>

        {showResults && (
          <ResultPanel
            cards={cards}
            onClear={handleClear}
            onToast={showToast}
          />
        )}
      </div>

      {/* Toast */}
      {toast && (
        <div className="toast">
          <CheckCircle size={16} />
          {toast}
        </div>
      )}
    </div>
  );
}
