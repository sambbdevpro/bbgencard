import { useState } from 'react';
import { CreditCard, MapPin, Package, LayoutDashboard, ChevronLeft, ChevronRight, Zap, Clock } from 'lucide-react';
import GenCardPage from './pages/GenCardPage';
import GenAddressPage from './pages/GenAddressPage';
import './index.css';

type MenuPage = 'gencard' | 'genaddress' | 'coming1' | 'coming2';

interface MenuItem {
  id: MenuPage;
  label: string;
  icon: React.ReactNode;
  available: boolean;
  description: string;
  gradient: string;
}

const MENU_ITEMS: MenuItem[] = [
  {
    id: 'gencard',
    label: 'GenCard',
    icon: <CreditCard size={20} />,
    available: true,
    description: 'Test Card Generator',
    gradient: 'linear-gradient(135deg, #6c5ce7, #a29bfe)',
  },
  {
    id: 'genaddress',
    label: 'GenAddress',
    icon: <MapPin size={20} />,
    available: true,
    description: 'Fake Address Generator',
    gradient: 'linear-gradient(135deg, #00cec9, #55efc4)',
  },
  {
    id: 'coming1',
    label: 'GenIdentity',
    icon: <Package size={20} />,
    available: false,
    description: 'Coming Soon',
    gradient: 'linear-gradient(135deg, #fd79a8, #e84393)',
  },
  {
    id: 'coming2',
    label: 'GenPayment',
    icon: <Zap size={20} />,
    available: false,
    description: 'Coming Soon',
    gradient: 'linear-gradient(135deg, #fdcb6e, #f39c12)',
  },
];

function App() {
  const [activePage, setActivePage] = useState<MenuPage>('gencard');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  const activeItem = MENU_ITEMS.find(m => m.id === activePage)!;

  return (
    <div className="app-container">
      {/* Background effects */}
      <div className="app-bg-effects">
        <div className="bg-orb bg-orb-1" />
        <div className="bg-orb bg-orb-2" />
        <div className="bg-orb bg-orb-3" />
      </div>

      <div className="app-shell">
        {/* Sidebar */}
        <aside className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-header">
            <div className="sidebar-logo">
              <div className="sidebar-logo-icon">
                <LayoutDashboard size={22} />
              </div>
              {!sidebarCollapsed && (
                <div className="sidebar-logo-text">
                  <span className="sidebar-brand">BBTools</span>
                  <span className="sidebar-version">v2.0</span>
                </div>
              )}
            </div>
            <button
              className="sidebar-toggle"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </div>

          <nav className="sidebar-nav">
            <div className="sidebar-nav-label">
              {!sidebarCollapsed && 'GENERATORS'}
            </div>
            {MENU_ITEMS.map(item => (
              <button
                key={item.id}
                className={`sidebar-item ${activePage === item.id ? 'active' : ''} ${!item.available ? 'disabled' : ''}`}
                onClick={() => item.available && setActivePage(item.id)}
                title={sidebarCollapsed ? `${item.label} — ${item.description}` : ''}
              >
                <div className="sidebar-item-icon" style={{ background: item.gradient }}>
                  {item.icon}
                </div>
                {!sidebarCollapsed && (
                  <div className="sidebar-item-text">
                    <span className="sidebar-item-label">{item.label}</span>
                    <span className="sidebar-item-desc">
                      {item.available ? item.description : (
                        <span className="coming-soon-tag"><Clock size={10} /> Coming Soon</span>
                      )}
                    </span>
                  </div>
                )}
                {!sidebarCollapsed && activePage === item.id && (
                  <div className="sidebar-active-indicator" />
                )}
              </button>
            ))}
          </nav>

          {!sidebarCollapsed && (
            <div className="sidebar-footer">
              <div className="sidebar-footer-text">
                Powered by React + Vite
                <br />
                <span className="sidebar-footer-link">For Testing Only 🔒</span>
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="main-content">
          {/* Page Header */}
          <header className="page-header">
            <div className="page-header-info">
              <div className="page-header-icon" style={{ background: activeItem.gradient }}>
                {activeItem.icon}
              </div>
              <div>
                <h1 className="page-title">{activeItem.label}</h1>
                <p className="page-subtitle">{activeItem.description}</p>
              </div>
            </div>
          </header>

          {/* Page Content */}
          <div className="page-content">
            {activePage === 'gencard' && <GenCardPage />}
            {activePage === 'genaddress' && <GenAddressPage />}
            {(activePage === 'coming1' || activePage === 'coming2') && (
              <div className="coming-soon-page glass-panel">
                <div className="coming-soon-icon" style={{ background: activeItem.gradient }}>
                  {activeItem.icon}
                </div>
                <h2>{activeItem.label}</h2>
                <p>This feature is currently under development and will be available soon.</p>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;
