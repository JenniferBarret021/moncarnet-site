import { useEffect, useState, useCallback } from 'react';
import { OrdersView } from './OrdersView';
import { CatalogView } from './CatalogView';
import { NewOrderView } from './NewOrderView';
import { useCrossTabSync, actions, useDemoStore } from './store';
import { today, tomorrow, isSameDay, isBetween, endOfWeek } from './utils';

type View = 'today' | 'tomorrow' | 'week' | 'catalog' | 'commandes' | 'new';

export function DemoApp() {
  const [view, setView] = useState<View>('today');
  useCrossTabSync();

  const orders = useDemoStore((s) => s.orders);
  const products = useDemoStore((s) => s.products);
  const shopName = useDemoStore((s) => s.shopName);
  const ownerName = useDemoStore((s) => s.ownerName);

  const t = today();
  const tom = tomorrow();
  const weekEnd = endOfWeek(t);

  const countToday = orders.filter((o) => isSameDay(o.pickupDate, t) && !['recuperee', 'annulee'].includes(o.status)).length;
  const countTomorrow = orders.filter((o) => isSameDay(o.pickupDate, tom) && !['recuperee', 'annulee'].includes(o.status)).length;
  const countWeek = orders.filter((o) => isBetween(o.pickupDate, t, weekEnd) && !['recuperee', 'annulee'].includes(o.status)).length;

  const initials = ownerName
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  useEffect(() => {
    document.title = 'Démo - Mon carnet de commandes';
  }, []);

  const navigateToNew = useCallback(() => setView('new'), []);
  const navigateToOrders = useCallback(() => setView('today'), []);

  // Hide new order from bottom nav
  const showBottomNav = view !== 'new';

  return (
    <div style={{ minHeight: '100vh', background: '#fbfaf8', color: '#1E1B2E', fontFamily: 'Inter, system-ui, -apple-system, sans-serif' }}>
      <div className="flex flex-1" style={{ minHeight: '100vh' }}>

        {/* ===== DESKTOP SIDEBAR ===== */}
        <aside
          className="hidden md:flex flex-col w-64 shrink-0 h-screen sticky top-0 py-6 px-5"
          style={{ borderRight: '1px solid #DDD9EA' }}
        >
          {/* Logo */}
          <div className="flex items-center gap-3 mb-6 px-2">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
              style={{ background: '#5B3FA8' }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
              </svg>
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold leading-tight">Mon carnet</p>
              <p className="text-xs" style={{ color: '#8E89A3' }}>de commandes</p>
            </div>
          </div>

          {/* Nouvelle commande */}
          <button
            onClick={navigateToNew}
            className="flex items-center justify-center gap-2 rounded-xl py-3 px-4 font-bold text-sm mb-6 transition-all"
            style={{ background: '#5B3FA8', color: '#FFFFFF' }}
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
            Nouvelle commande
          </button>

          {/* Journee */}
          <div className="mb-6">
            <p style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8E89A3' }} className="px-2 mb-2">
              Journée
            </p>
            <div className="space-y-0.5">
              {([
                { key: 'today' as const, label: "Aujourd'hui", count: countToday },
                { key: 'tomorrow' as const, label: 'Demain', count: countTomorrow },
                { key: 'week' as const, label: 'Cette semaine', count: countWeek },
              ]).map((link) => {
                const isActive = view === link.key;
                return (
                  <button
                    key={link.key}
                    onClick={() => setView(link.key)}
                    className="w-full flex items-center gap-2 px-3 py-2.5 rounded-xl text-sm transition-all text-left"
                    style={{
                      background: isActive ? 'rgba(91, 63, 168, 0.08)' : 'transparent',
                      color: isActive ? '#5B3FA8' : '#1E1B2E',
                      fontWeight: isActive ? 700 : 500,
                    }}
                  >
                    {link.label}
                    {link.count > 0 && (
                      <span
                        className="min-w-5 h-5 rounded-full flex items-center justify-center px-1.5 opacity-50"
                        style={{ background: '#5B3FA8', color: '#FFFFFF', fontSize: '0.65rem', fontWeight: 700 }}
                      >
                        {link.count}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Gestion */}
          <div className="mb-6">
            <p style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8E89A3' }} className="px-2 mb-2">
              Gestion
            </p>
            <div className="space-y-0.5">
              {([
                {
                  key: 'catalog' as const,
                  label: 'Catalogue',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                      <line x1="7" y1="7" x2="7.01" y2="7" />
                    </svg>
                  ),
                },
                {
                  key: 'commandes' as const,
                  label: 'Commandes',
                  icon: (
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                      <rect x="9" y="3" width="6" height="4" rx="1" />
                    </svg>
                  ),
                },
              ]).map((link) => {
                const isActive = view === link.key;
                return (
                  <button
                    key={link.key}
                    onClick={() => setView(link.key)}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm transition-all text-left"
                    style={{
                      background: isActive ? 'rgba(91, 63, 168, 0.08)' : 'transparent',
                      color: isActive ? '#5B3FA8' : '#1E1B2E',
                      fontWeight: isActive ? 700 : 500,
                    }}
                  >
                    <span style={{ color: isActive ? '#5B3FA8' : '#8E89A3' }}>{link.icon}</span>
                    {link.label}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Demo badge + reset */}
          <div className="mb-4 px-2">
            <span
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold uppercase tracking-wider"
              style={{ background: 'rgba(91, 63, 168, 0.08)', color: '#5B3FA8' }}
            >
              Démo interactive
            </span>
            <button
              type="button"
              onClick={() => {
                if (window.confirm('Réinitialiser la démo avec les données par défaut ?')) {
                  actions.reset();
                  setView('today');
                }
              }}
              className="block text-xs mt-2 transition-colors"
              style={{ color: '#8E89A3' }}
            >
              Réinitialiser
            </button>
          </div>

          {/* Spacer */}
          <div className="flex-1" />

          {/* Utilisateur */}
          <div className="flex items-center gap-3 px-2 pt-4" style={{ borderTop: '1px solid #DDD9EA' }}>
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center shrink-0 text-xs font-bold"
              style={{ background: 'rgba(91, 63, 168, 0.08)', color: '#5B3FA8' }}
            >
              {initials}
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold truncate">{ownerName}</p>
              <p className="text-xs truncate" style={{ color: '#8E89A3' }}>
                {shopName}
              </p>
            </div>
          </div>

          {/* Retour au site */}
          <a
            href="/"
            className="flex items-center justify-center gap-2 mt-4 py-2.5 px-4 rounded-xl text-sm font-bold transition-all"
            style={{ background: '#5B3FA8', color: '#FFFFFF' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="15 18 9 12 15 6" />
            </svg>
            Retour au site
          </a>
        </aside>

        {/* ===== MAIN CONTENT ===== */}
        <div className="flex-1 flex flex-col min-w-0">

          {/* Mobile header */}
          {view !== 'new' && (
            <header
              className="flex items-center gap-3 px-4 py-3 md:hidden"
              style={{ borderBottom: '2px solid #5B3FA8' }}
            >
              <div
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: '#5B3FA8' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M4 19.5A2.5 2.5 0 016.5 17H20" />
                  <path d="M6.5 2H20v20H6.5A2.5 2.5 0 014 19.5v-15A2.5 2.5 0 016.5 2z" />
                </svg>
              </div>
              <div className="flex-1 min-w-0 text-center">
                <p style={{ fontSize: '0.65rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#5B3FA8' }}>
                  Mon carnet de commandes
                </p>
                <p className="text-sm font-semibold truncate">{shopName}</p>
              </div>
              <a
                href="/"
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: '#5B3FA8' }}
                aria-label="Retour au site"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </a>
            </header>
          )}

          {/* New order mobile header */}
          {view === 'new' && (
            <header
              className="flex items-center gap-3 px-4 py-3 md:hidden"
              style={{ borderBottom: '1px solid #DDD9EA' }}
            >
              <button
                onClick={navigateToOrders}
                className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0"
                style={{ background: '#fbfaf8' }}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1E1B2E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
              </button>
              <div className="flex-1 min-w-0 text-center">
                <p className="text-sm font-bold">Nouvelle commande</p>
              </div>
              <div className="w-9 shrink-0" />
            </header>
          )}

          {/* Content */}
          <main className="flex-1 px-4 md:px-8 md:py-6" style={{ paddingBottom: '6rem' }}>
            {view === 'today' && <OrdersView dayFilter="today" />}
            {view === 'tomorrow' && <OrdersView dayFilter="tomorrow" />}
            {view === 'week' && <OrdersView dayFilter="week" />}
            {view === 'catalog' && <CatalogView />}
            {view === 'commandes' && <OrdersView dayFilter="week" />}
            {view === 'new' && (
              <NewOrderView
                products={products}
                onCreated={navigateToOrders}
              />
            )}
          </main>
        </div>
      </div>

      {/* ===== MOBILE FAB NOUVELLE COMMANDE ===== */}
      {showBottomNav && (
        <button
          onClick={navigateToNew}
          className="fixed z-50 md:hidden flex items-center justify-center rounded-full"
          style={{
            bottom: 'calc(5.5rem + env(safe-area-inset-bottom))',
            right: '1rem',
            width: '52px',
            height: '52px',
            background: '#5B3FA8',
            color: '#FFFFFF',
            boxShadow: '0 6px 20px rgba(91, 63, 168, 0.4), 0 2px 6px rgba(0,0,0,0.1)',
          }}
          aria-label="Nouvelle commande"
        >
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
        </button>
      )}

      {/* ===== MOBILE BOTTOM NAV ===== */}
      {showBottomNav && (
        <nav
          className="fixed bottom-3 left-3 right-3 z-50 md:hidden"
          style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
        >
          <div
            className="relative max-w-lg mx-auto px-2 py-2"
            style={{
              borderRadius: '1.25rem',
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(28px) saturate(200%)',
              WebkitBackdropFilter: 'blur(28px) saturate(200%)',
              boxShadow: '0 8px 40px rgba(0,0,0,0.10), 0 2px 8px rgba(0,0,0,0.06), inset 0 1px 0 rgba(255,255,255,0.6)',
              border: '1px solid rgba(255,255,255,0.5)',
            }}
          >
            <div className="flex justify-around items-center">
              {([
                {
                  key: 'today' as View,
                  label: "Aujourd'hui",
                  icon: (active: boolean) => (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" stroke={active ? '#5B3FA8' : 'currentColor'} strokeWidth="2" />
                      <line x1="8" y1="2" x2="8" y2="6" stroke={active ? '#5B3FA8' : 'currentColor'} strokeWidth="2" />
                      <line x1="3" y1="10" x2="21" y2="10" stroke={active ? 'white' : 'currentColor'} strokeWidth="1.8" />
                    </svg>
                  ),
                },
                {
                  key: 'commandes' as View,
                  label: 'Commandes',
                  icon: (active: boolean) => (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                      <rect x="9" y="3" width="6" height="4" rx="1" stroke={active ? '#5B3FA8' : 'currentColor'} strokeWidth="1.8" fill={active ? 'white' : 'none'} />
                    </svg>
                  ),
                },
                {
                  key: 'catalog' as View,
                  label: 'Produits',
                  icon: (active: boolean) => (
                    <svg width="22" height="22" viewBox="0 0 24 24" fill={active ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth={active ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                      <circle cx="7" cy="7" r="1.5" fill={active ? 'white' : 'none'} stroke={active ? 'white' : 'currentColor'} strokeWidth="1.8" />
                    </svg>
                  ),
                },
              ]).map((tab) => {
                const isActive = tab.key === 'today'
                  ? (view === 'today' || view === 'tomorrow' || view === 'week')
                  : view === tab.key;
                return (
                  <button
                    key={tab.key}
                    onClick={() => setView(tab.key)}
                    className="flex flex-col items-center gap-1 py-1.5 px-3 transition-all duration-200 relative"
                    style={{ color: isActive ? '#5B3FA8' : '#8E89A3' }}
                  >
                    <div
                      className="w-14 h-9 rounded-2xl flex items-center justify-center transition-all duration-300"
                      style={{
                        background: isActive ? '#5B3FA8' : 'transparent',
                        boxShadow: isActive ? '0 4px 14px rgba(91, 63, 168, 0.4)' : 'none',
                        transform: isActive ? 'scale(1)' : 'scale(0.9)',
                      }}
                    >
                      <span style={{ color: isActive ? 'white' : '#8E89A3' }}>
                        {tab.icon(isActive)}
                      </span>
                    </div>
                    <span
                      className="text-xs leading-none transition-all duration-200"
                      style={{
                        color: isActive ? '#5B3FA8' : '#8E89A3',
                        fontWeight: isActive ? 700 : 500,
                      }}
                    >
                      {tab.label}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </nav>
      )}

      {/* Footer desktop */}
      <div className="hidden md:block border-t px-8 py-4" style={{ borderColor: '#DDD9EA', background: '#F4F1EA' }}>
        <div className="max-w-[1200px] mx-auto flex items-center justify-between text-xs" style={{ color: '#8E89A3' }}>
          <span>Démo fictive. Vos modifications restent uniquement dans ce navigateur.</span>
          <a href="/" className="font-medium transition-colors" style={{ color: '#8E89A3' }}>
            &larr; Retour au site
          </a>
        </div>
      </div>
    </div>
  );
}
