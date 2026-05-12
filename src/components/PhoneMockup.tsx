import { StackIcon } from './StackIcon';

const orders = [
  { time: '09H30', clients: [
    { name: 'Marie Fontaine', articles: 2, price: '13,40 €', status: 'En préparation', statusColor: '#5B3FA8', statusBg: '#F3EEFF', nextLabel: 'Préparée' },
  ]},
  { time: '12H00', clients: [
    { name: 'Chloé Lambert', articles: 2, price: '7,60 €', status: 'À préparer', statusColor: '#F59E0B', statusBg: '#FFFBEB', nextLabel: 'En préparation' },
    { name: 'Pierre Martin', articles: 2, price: '6,00 €', status: 'À préparer', statusColor: '#F59E0B', statusBg: '#FFFBEB', nextLabel: 'En préparation' },
  ]},
  { time: '16H00', clients: [
    { name: 'Jenn', articles: 3, price: '16,70 €', status: 'Préparée', statusColor: '#10B981', statusBg: '#ECFDF5', nextLabel: 'Récupérée' },
  ]},
];

const filters = [
  { label: 'Tout', active: true, count: 0, color: '' },
  { label: 'À préparer', active: false, count: 2, color: '#F59E0B' },
  { label: 'En préparation', active: false, count: 1, color: '#5B3FA8' },
  { label: 'Préparées', active: false, count: 1, color: '#10B981' },
  { label: 'Récupérées', active: false, count: 1, color: '#94A3B8' },
];

export function PhoneMockup() {
  const now = new Date();
  const dayName = now.toLocaleDateString('fr-FR', { weekday: 'long' });
  const dayNum = now.getDate();
  const monthName = now.toLocaleDateString('fr-FR', { month: 'long' });
  const dateStr = `${dayName.charAt(0).toUpperCase() + dayName.slice(1)} ${dayNum} ${monthName.charAt(0).toUpperCase() + monthName.slice(1)}`;

  return (
    <div className="relative z-[2] w-[195px] h-[405px] rounded-[28px] bg-ink p-1.5 shadow-device-phone shrink-0">
      <div className="relative w-full h-full rounded-[23px] overflow-hidden bg-[#fbfaf8] flex flex-col">
        {/* Notch */}
        <div className="absolute top-2 left-1/2 -translate-x-1/2 w-14 h-3.5 bg-ink rounded-full z-[5]" />

        {/* Status bar */}
        <div className="pt-[8px] px-3.5 flex justify-between text-[7px] font-semibold text-ink">
          <span>9:41</span>
          <span className="w-[40px]" />
          <span>●●●</span>
        </div>

        {/* Header avec bordure violette */}
        <div className="px-2.5 pt-3.5 pb-1.5 flex items-center gap-1.5" style={{ borderBottom: '1.5px solid #5B3FA8' }}>
          <StackIcon size={16} />
          <div className="flex-1 text-center">
            <p style={{ fontSize: '4.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#5B3FA8' }}>
              Mon carnet de commandes
            </p>
            <p className="text-[6.5px] font-semibold text-ink">Boulangerie Démo</p>
          </div>
          <div className="w-[16px]" />
        </div>

        {/* Aujourd'hui + Date */}
        <div className="text-center pt-1.5 pb-1">
          <p style={{ fontSize: '4.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8E89A3' }}>
            Aujourd&rsquo;hui
          </p>
          <p className="text-[9px] font-bold text-ink capitalize">{dateStr}</p>
        </div>

        {/* Filtres statut */}
        <div className="flex gap-[2px] px-2 pb-1 overflow-hidden">
          {filters.map((f) => (
            <div
              key={f.label}
              className="flex items-center gap-[1.5px] shrink-0 px-[3.5px] py-[2px] rounded-[4px]"
              style={f.active
                ? { background: '#5B3FA8', color: '#FFFFFF', fontSize: '5px', fontWeight: 700 }
                : { background: '#FFFFFF', color: '#1E1B2E', fontSize: '5px', fontWeight: 700, border: '0.75px solid #C9C4D9' }
              }
            >
              {f.count > 0 && !f.active && (
                <span
                  className="w-[8px] h-[8px] rounded-full flex items-center justify-center"
                  style={{ background: f.color + '20', color: f.color, fontSize: '4.5px', fontWeight: 700 }}
                >
                  {f.count}
                </span>
              )}
              <span>{f.label}</span>
            </div>
          ))}
        </div>

        {/* Toggle Par commande / Par produit */}
        <div className="flex gap-[2px] mx-2 mb-1">
          <div
            className="flex-1 flex items-center justify-center rounded-[4px]"
            style={{ background: '#5B3FA8', color: '#FFFFFF', fontSize: '5.5px', fontWeight: 700, height: '14px' }}
          >
            Par commande
          </div>
          <div
            className="flex-1 flex items-center justify-center rounded-[4px]"
            style={{ background: '#FFFFFF', color: '#1E1B2E', fontSize: '5.5px', fontWeight: 700, border: '1px solid #C9C4D9', height: '14px' }}
          >
            Par produit
          </div>
        </div>

        {/* Commandes groupées par heure */}
        <div className="flex-1 overflow-hidden px-2 pb-10">
          {orders.map((group) => (
            <div key={group.time} className="mb-1">
              {/* Séparateur heure */}
              <div className="flex items-center gap-0.5 mb-[2px]">
                <span style={{ fontSize: '4.5px', fontWeight: 700, color: '#8E89A3', letterSpacing: '0.04em' }}>
                  {group.time}
                </span>
                <div className="flex-1 h-px" style={{ background: '#DDD9EA' }} />
                <span style={{ fontSize: '4.5px', fontWeight: 600, color: '#8E89A3' }}>
                  {group.clients.length}
                </span>
              </div>

              {/* Cartes commande */}
              {group.clients.map((c) => (
                <div
                  key={c.name}
                  className="rounded-[5px] overflow-hidden mb-[2px]"
                  style={{ background: '#FFFFFF' }}
                >
                  {/* Barre de statut colorée */}
                  <div
                    style={{
                      background: c.statusBg,
                      color: c.statusColor,
                      fontSize: '4.5px',
                      fontWeight: 700,
                      padding: '1.5px 6px',
                      letterSpacing: '0.02em',
                    }}
                  >
                    {c.status}
                  </div>
                  {/* Contenu */}
                  <div className="flex items-center gap-1 px-1.5 py-[3.5px]">
                    <div className="flex-1 min-w-0">
                      <p style={{ fontSize: '6.5px', fontWeight: 600, color: '#1B1530' }} className="truncate">{c.name}</p>
                      <div className="flex items-center gap-0.5 mt-px">
                        <span style={{ fontSize: '5.5px', color: '#8E89A3' }}>
                          {c.articles} art.
                        </span>
                        <span style={{ fontSize: '5.5px', fontWeight: 700, color: '#4A4560' }}>
                          {c.price}
                        </span>
                      </div>
                    </div>
                    <div
                      className="shrink-0 flex items-center gap-[1.5px] px-[3.5px] py-[2px] rounded-[4px]"
                      style={{ background: c.statusBg, color: c.statusColor, fontSize: '4.5px', fontWeight: 700 }}
                    >
                      {c.nextLabel}
                      <svg width="4" height="4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="9 18 15 12 9 6" />
                      </svg>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        {/* Bouton recherche flottant */}
        <div className="absolute bottom-[40px] left-1/2 -translate-x-1/2">
          <div
            className="w-[20px] h-[20px] rounded-[7px] flex items-center justify-center"
            style={{
              background: 'rgba(255,255,255,0.9)',
              boxShadow: '0 2px 8px rgba(0,0,0,0.10), 0 1px 2px rgba(0,0,0,0.05)',
              border: '1px solid rgba(255,255,255,0.6)',
            }}
          >
            <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="#8E89A3" strokeWidth="2.5" strokeLinecap="round">
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
          </div>
        </div>

        {/* Bottom nav glassmorphism */}
        <div
          className="absolute bottom-[5px] left-[5px] right-[5px] z-10"
        >
          <div
            className="flex justify-around items-center py-[3.5px] px-0.5"
            style={{
              borderRadius: '9px',
              background: 'rgba(255,255,255,0.85)',
              backdropFilter: 'blur(12px)',
              boxShadow: '0 3px 12px rgba(0,0,0,0.08), 0 1px 2px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.5)',
              border: '1px solid rgba(255,255,255,0.5)',
            }}
          >
            {[
              { label: "Aujourd'hui", active: true },
              { label: 'Commandes', active: false },
              { label: 'Produits', active: false },
            ].map((tab) => (
              <div key={tab.label} className="flex flex-col items-center gap-[1.5px]">
                <div
                  className="w-[22px] h-[12px] rounded-[5px] flex items-center justify-center"
                  style={{
                    background: tab.active ? '#5B3FA8' : 'transparent',
                    boxShadow: tab.active ? '0 2px 5px rgba(108,58,237,0.35)' : 'none',
                  }}
                >
                  {tab.label === "Aujourd'hui" && (
                    <svg width="7" height="7" viewBox="0 0 24 24" fill={tab.active ? 'white' : 'none'} stroke={tab.active ? 'white' : '#8E89A3'} strokeWidth={tab.active ? 0 : 1.8} strokeLinecap="round" strokeLinejoin="round">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                      <line x1="16" y1="2" x2="16" y2="6" stroke={tab.active ? '#5B3FA8' : '#8E89A3'} strokeWidth="2" />
                      <line x1="8" y1="2" x2="8" y2="6" stroke={tab.active ? '#5B3FA8' : '#8E89A3'} strokeWidth="2" />
                      <line x1="3" y1="10" x2="21" y2="10" stroke={tab.active ? 'white' : '#8E89A3'} strokeWidth="1.8" />
                    </svg>
                  )}
                  {tab.label === 'Commandes' && (
                    <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#8E89A3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" />
                      <rect x="9" y="3" width="6" height="4" rx="1" />
                    </svg>
                  )}
                  {tab.label === 'Produits' && (
                    <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#8E89A3" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M20.59 13.41l-7.17 7.17a2 2 0 01-2.83 0L2 12V2h10l8.59 8.59a2 2 0 010 2.82z" />
                      <circle cx="7" cy="7" r="1.5" />
                    </svg>
                  )}
                </div>
                <span
                  style={{
                    fontSize: '4.5px',
                    fontWeight: tab.active ? 700 : 500,
                    color: tab.active ? '#5B3FA8' : '#8E89A3',
                  }}
                >
                  {tab.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
