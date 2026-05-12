type Product = { n: string; p?: string; qty?: number; custom?: boolean };

const products: Product[] = [
  { n: 'Produit personnalisé', custom: true },
  { n: 'Croissant', p: '1.30' },
  { n: 'Éclair chocolat', p: '2.20' },
  { n: 'Éclair vanille', p: '2.00' },
  { n: 'Brioche', p: '4.50' },
  { n: 'Pain au chocolat', p: '1.40', qty: 1 },
  { n: 'Pain aux raisins', p: '1.60' },
  { n: 'Chausson pomme', p: '1.80' },
  { n: 'Suisse blanc', p: '1.50' },
  { n: 'Tarte citron', p: '2.50', qty: 10 },
  { n: 'Tarte fraise', p: '3.20', qty: 1 },
  { n: 'Tarte poire', p: '2.80' },
];

const cart = [
  { n: 'Tarte citron', q: 10, p: '2.50', t: '25.00' },
  { n: 'Pain au chocolat', q: 1, p: '1.40', t: '1.40' },
  { n: 'Tarte fraise', q: 1, p: '3.20', t: '3.20' },
];

const inputStyle = {
  fontSize: '8.5px',
  color: '#1E1B2E',
  background: '#fbfaf8',
  border: '1px solid #C9C4D9',
  borderRadius: '5px',
  padding: '4px 6px',
  width: '100%',
  outline: 'none',
};

export function TabletMockup() {
  return (
    <div
      className="relative z-[1] w-[680px] max-w-full rounded-[22px] bg-ink p-3 shadow-device shrink-0"
      style={{ aspectRatio: '680 / 500' }}
    >
      <div className="relative w-full h-full rounded-xl overflow-hidden bg-[#FAFAFC] flex">
        <div className="flex-1 px-[18px] py-[14px] flex flex-col min-w-0">
          <div className="flex items-center justify-between mb-2.5">
            <div className="flex items-center gap-1 text-violet-500 text-[11px] font-semibold">
              <span className="text-[13px] leading-none">‹</span>
              <span>Retour</span>
            </div>
            <div className="flex gap-[3px]">
              <span className="w-[26px] h-1 rounded-sm bg-violet-500" />
              <span className="w-[26px] h-1 rounded-sm bg-[#E5E0F0]" />
            </div>
          </div>

          <div className="text-[17px] font-bold text-ink tracking-tight mb-2.5">
            Que commande le client&nbsp;?
          </div>

          <div className="bg-white border border-line rounded-[9px] px-3 py-2 text-[11px] text-slate-soft flex items-center gap-2 mb-2.5">
            <svg
              width="11"
              height="11"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="11" cy="11" r="7" />
              <line x1="20" y1="20" x2="16.65" y2="16.65" />
            </svg>
            <span>Rechercher un produit…</span>
          </div>

          <div className="flex gap-1.5 mb-2.5 flex-wrap">
            <span className="bg-violet-500 text-white text-[10px] font-semibold px-3.5 py-1 rounded-full">
              Tout
            </span>
            {['Viennoiserie', 'Pains', 'Pâtisseries'].map((c) => (
              <span
                key={c}
                className="bg-white text-ink text-[10px] font-medium px-3.5 py-1 rounded-full border border-line"
              >
                {c}
              </span>
            ))}
          </div>

          <div className="grid grid-cols-4 gap-[7px] flex-1 content-start">
            {products.map((p, i) => {
              if (p.custom) {
                return (
                  <div
                    key={i}
                    className="border-[1.5px] border-dashed border-violet-500 rounded-[9px] py-2.5 px-2 flex flex-col items-center justify-center gap-0.5 text-violet-500 min-h-[50px]"
                  >
                    <span className="text-sm leading-none font-semibold">+</span>
                    <span className="text-[9px] font-semibold text-center">
                      Produit personnalisé
                    </span>
                  </div>
                );
              }
              const selected = !!p.qty;
              return (
                <div
                  key={i}
                  className={[
                    'relative rounded-[9px] py-2.5 px-2 flex flex-col items-center justify-center gap-0.5 min-h-[50px] border-[1.5px]',
                    selected
                      ? 'bg-[#F5F0FF] border-violet-500'
                      : 'bg-white border-line',
                  ].join(' ')}
                >
                  <div className="text-[9.5px] font-bold text-ink text-center tracking-tight">
                    {p.n}
                  </div>
                  <div className="text-[8.5px] text-slate font-medium">{p.p} € / pièce</div>
                  {selected && (
                    <div
                      className="absolute -top-[7px] -right-[7px] bg-violet-500 text-white rounded-full min-w-[18px] h-[18px] flex items-center justify-center text-[9px] font-bold px-1.5"
                      style={{ boxShadow: '0 2px 6px rgba(124,58,237,0.35)' }}
                    >
                      {p.qty}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Sidebar droite */}
        <div
          className="w-[196px] bg-white border-l border-line flex flex-col"
          style={{ boxShadow: 'inset 1px 0 0 rgba(0,0,0,0.02)' }}
        >
          {/* Panier header */}
          <div className="px-3.5 pt-3.5 pb-2">
            <div className="text-sm font-bold text-ink tracking-tight">Panier</div>
            <div className="text-[9.5px] text-slate font-medium">3 articles</div>
          </div>

          {/* Lignes panier */}
          <div className="px-3.5 py-1 flex flex-col gap-2 overflow-hidden">
            {cart.map((it, i) => (
              <div key={i} className="flex items-start justify-between gap-1.5">
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] font-semibold text-ink tracking-tight">
                    {it.n}
                  </div>
                  <div className="text-[8.5px] text-slate mt-px">
                    {it.q} × {it.p} €
                  </div>
                </div>
                <div className="text-[10px] font-bold text-ink whitespace-nowrap">
                  {it.t} €
                </div>
                <div className="w-4 h-4 rounded bg-[#FEE2E2] flex items-center justify-center text-[#DC2626] text-[9px] font-bold shrink-0">
                  ×
                </div>
              </div>
            ))}
          </div>

          {/* Infos client */}
          <div className="px-3.5 pt-2 pb-1.5 border-t border-line mt-1">
            <div style={{ fontSize: '7.5px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', color: '#8E89A3', marginBottom: '4px' }}>
              Client
            </div>

            {/* Nom */}
            <div className="mb-1.5">
              <div style={{ ...inputStyle, color: '#8E89A3' }}>Nom du client</div>
            </div>

            {/* Tél + Email */}
            <div className="grid grid-cols-2 gap-1 mb-1.5">
              <div style={{ ...inputStyle, color: '#8E89A3' }}>Téléphone</div>
              <div style={{ ...inputStyle, color: '#8E89A3' }}>Email</div>
            </div>

            {/* Date : boutons rapides */}
            <div style={{ fontSize: '7.5px', fontWeight: 700, color: '#4A4560', marginBottom: '3px' }}>
              Quand ?
            </div>
            <div className="flex gap-[3px] mb-1.5 flex-wrap">
              <div
                className="flex items-center justify-center rounded-[4px]"
                style={{ background: '#5B3FA8', color: '#FFFFFF', fontSize: '7px', fontWeight: 700, padding: '2.5px 5px' }}
              >
                Auj.
              </div>
              {['Demain', 'mer. 14', 'jeu. 15'].map((d) => (
                <div
                  key={d}
                  className="flex items-center justify-center rounded-[4px]"
                  style={{ background: '#fbfaf8', color: '#1E1B2E', fontSize: '7px', fontWeight: 700, padding: '2.5px 5px', border: '1px solid #C9C4D9' }}
                >
                  {d}
                </div>
              ))}
              <div
                className="flex items-center justify-center rounded-[4px]"
                style={{ background: '#fbfaf8', color: '#1E1B2E', fontSize: '7px', fontWeight: 700, padding: '2.5px 5px', border: '1px solid #C9C4D9' }}
              >
                <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: '2px' }}>
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
                </svg>
                Autre
              </div>
            </div>

            {/* Heure */}
            <div style={{ fontSize: '7.5px', fontWeight: 700, color: '#4A4560', marginBottom: '3px' }}>
              Heure ?
            </div>
            <div className="flex items-center gap-1 mb-1.5">
              <div
                className="flex items-center gap-[2px] rounded-[4px]"
                style={{ background: '#fbfaf8', color: '#1E1B2E', fontSize: '7px', fontWeight: 700, padding: '2.5px 5px', border: '1px solid #C9C4D9' }}
              >
                <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#8E89A3" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
                Ajouter une heure
              </div>
            </div>

            {/* Prépayé toggle */}
            <div
              className="flex items-center justify-between rounded-[5px]"
              style={{ background: '#fbfaf8', border: '1px solid #C9C4D9', padding: '3px 6px' }}
            >
              <div className="flex items-center gap-[3px]">
                <svg width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#8E89A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
                </svg>
                <span style={{ fontSize: '7.5px', fontWeight: 600, color: '#1E1B2E' }}>Prépayé</span>
              </div>
              <div style={{ width: '16px', height: '9px', borderRadius: '5px', background: '#C9C4D9', padding: '1px' }}>
                <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: 'white' }} />
              </div>
            </div>
          </div>

          {/* Total + bouton */}
          <div className="px-3.5 pt-2 pb-3 border-t border-line mt-auto">
            <div className="flex justify-between items-baseline mb-2">
              <div className="text-[10px] text-slate font-semibold">Total TTC</div>
              <div className="text-[15px] font-bold text-violet-500 tracking-tight">
                29,60 €
              </div>
            </div>
            <div className="bg-violet-500 text-white text-[10.5px] font-semibold py-2.5 px-3 rounded-lg text-center shadow-[0_2px_8px_rgba(124,58,237,0.3)]">
              Enregistrer la commande
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
