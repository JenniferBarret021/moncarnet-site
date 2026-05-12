import { useMemo, useRef, useState } from 'react';
import { actions } from './store';
import { CATEGORIES } from './types';
import type { Product, ProductCategory } from './types';
import { today, parseDate, toISO, formatMonthYear } from './utils';

type Props = {
  products: Product[];
  onCreated: () => void;
};

interface LignePanier {
  productId: string;
  name: string;
  price: number;
  unite: string;
  qty: number;
  freeQty: number;
}

/* ---- Helpers date ---- */

function dateOptions(): { label: string; value: string }[] {
  const JOURS = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
  const now = new Date();
  const opts: { label: string; value: string }[] = [];
  for (let i = 0; i < 7; i++) {
    const d = new Date(now);
    d.setDate(d.getDate() + i);
    const iso = toISO(d);
    let label: string;
    if (i === 0) label = 'Auj.';
    else if (i === 1) label = 'Demain';
    else label = `${JOURS[d.getDay()]} ${d.getDate()}`;
    opts.push({ label, value: iso });
  }
  return opts;
}

function parseDateISO(iso: string): Date {
  return parseDate(iso);
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate();
}

function firstDayOfMonth(year: number, month: number): number {
  const d = new Date(year, month, 1).getDay();
  return d === 0 ? 6 : d - 1; // Monday = 0
}

/* ---- Component ---- */

export function NewOrderView({ products, onCreated }: Props) {
  const [filter, setFilter] = useState<'Tout' | ProductCategory>('Tout');
  const [search, setSearch] = useState('');
  const [panier, setPanier] = useState<LignePanier[]>([]);
  const [clientName, setClientName] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [pickupDate, setPickupDate] = useState(today());
  const [pickupTime, setPickupTime] = useState<string>('');
  const [note, setNote] = useState('');
  const [paid, setPaid] = useState(false);
  const [confirmation, setConfirmation] = useState<string | null>(null);
  const [showDetailMobile, setShowDetailMobile] = useState(false);

  // Modale calendrier
  const [showCalendar, setShowCalendar] = useState(false);
  const [calendarMonth, setCalendarMonth] = useState(() => {
    const d = new Date();
    return { year: d.getFullYear(), month: d.getMonth() };
  });

  // Modale heure
  const [showHeure, setShowHeure] = useState(false);
  const [customHeure, setCustomHeure] = useState('10');
  const [customMinute, setCustomMinute] = useState('00');

  // Modale quantité
  const [produitModal, setProduitModal] = useState<Product | null>(null);
  const [qteModal, setQteModal] = useState('1');
  const [offertModal, setOffertModal] = useState(false);
  const [qteOffertModal, setQteOffertModal] = useState('1');
  const qteInputRef = useRef<HTMLInputElement>(null);

  // Modale produit personnalisé
  const [showCustom, setShowCustom] = useState(false);
  const [customNom, setCustomNom] = useState('');
  const [customPrix, setCustomPrix] = useState('');
  const [customQte, setCustomQte] = useState('1');
  const [customUnite, setCustomUnite] = useState('pièce');

  const visible = products
    .filter((p) => (filter === 'Tout' ? true : p.category === filter))
    .filter((p) =>
      search.trim()
        ? p.name.toLowerCase().includes(search.trim().toLowerCase())
        : true,
    );

  const total = useMemo(
    () => panier.reduce((acc, l) => acc + l.qty * l.price, 0),
    [panier],
  );

  const ouvrirModalQuantite = (p: Product) => {
    const ligne = panier.find((l) => l.productId === p.id);
    const unite = p.unite || 'pièce';
    setQteModal(ligne ? (unite === 'kg' ? ligne.qty.toFixed(1) : String(ligne.qty)) : (unite === 'kg' ? '0.5' : '1'));
    setOffertModal(ligne ? (ligne.freeQty > 0) : false);
    setQteOffertModal(ligne && ligne.freeQty > 0 ? (unite === 'kg' ? ligne.freeQty.toFixed(1) : String(ligne.freeQty)) : (unite === 'kg' ? '0.5' : '1'));
    setProduitModal(p);
    setTimeout(() => qteInputRef.current?.select(), 100);
  };

  const validerQuantite = () => {
    if (!produitModal) return;
    const qty = parseFloat(qteModal) || 0;
    const qtyOffert = offertModal ? (parseFloat(qteOffertModal) || 0) : 0;
    const unite = produitModal.unite || 'pièce';

    if (qty <= 0 && qtyOffert <= 0) {
      setPanier(panier.filter((l) => l.productId !== produitModal.id));
    } else {
      const idx = panier.findIndex((l) => l.productId === produitModal.id);
      if (idx >= 0) {
        const p = [...panier];
        p[idx] = { ...p[idx], qty: Math.max(0, qty), price: produitModal.price, freeQty: qtyOffert > 0 ? qtyOffert : 0 };
        setPanier(p);
      } else {
        setPanier([...panier, {
          productId: produitModal.id,
          name: produitModal.name,
          qty: Math.max(0, qty),
          price: produitModal.price,
          unite,
          freeQty: qtyOffert > 0 ? qtyOffert : 0,
        }]);
      }
    }
    setProduitModal(null);
  };

  const validerCustom = () => {
    if (!customNom.trim()) return;
    const qty = parseFloat(customQte) || 1;
    const prix = parseFloat(customPrix.replace(',', '.')) || 0;
    const id = `custom_${Date.now()}`;
    setPanier([...panier, {
      productId: id,
      name: customNom.trim(),
      qty,
      price: prix,
      unite: customUnite,
      freeQty: 0,
    }]);
    setCustomNom('');
    setCustomPrix('');
    setCustomQte('1');
    setCustomUnite('pièce');
    setShowCustom(false);
  };

  const supprimerLigne = (productId: string) => {
    setPanier(panier.filter((l) => l.productId !== productId));
  };

  function validate(e: React.FormEvent) {
    e.preventDefault();
    if (panier.length === 0) return;
    const items = panier.flatMap((l) => {
      const lines = [];
      if (l.qty > 0) {
        lines.push({ productId: l.productId, name: l.name, price: l.price, qty: l.qty, freeQty: 0 });
      }
      if (l.freeQty > 0) {
        lines.push({ productId: l.productId, name: l.name, price: 0, qty: l.freeQty, freeQty: l.freeQty });
      }
      return lines;
    });
    const order = actions.createOrder({
      clientName,
      phone: clientPhone.trim() || undefined,
      email: clientEmail.trim() || undefined,
      items,
      pickupDate,
      pickupTime: pickupTime || null,
      note: note.trim() || undefined,
      paid,
    });
    setConfirmation(`Commande #${order.number} enregistrée.`);
    setPanier([]);
    setClientName('');
    setClientPhone('');
    setClientEmail('');
    setNote('');
    setPaid(false);
    setPickupTime('');
    setPickupDate(today());
    window.setTimeout(() => {
      onCreated();
    }, 900);
  }

  const [etape, setEtape] = useState<'produits' | 'client'>('produits');

  /* ---- Date picker shared JSX ---- */
  const datePickerUI = (
    <div>
      <p className="text-xs font-bold mb-2" style={{ color: '#4A4560' }}>Quand ?</p>
      <div className="flex gap-1.5 flex-wrap">
        {dateOptions().map((d) => {
          const isActive = pickupDate === d.value;
          return (
            <button
              key={d.value}
              type="button"
              onClick={() => setPickupDate(d.value)}
              className="shrink-0 py-2 px-3 rounded-xl text-xs font-bold transition-all"
              style={isActive
                ? { background: '#5B3FA8', color: '#FFFFFF' }
                : { background: '#fbfaf8', color: '#1E1B2E', border: '1.5px solid #C9C4D9' }
              }
            >
              {d.label}
            </button>
          );
        })}
        <button
          type="button"
          onClick={() => {
            const sel = parseDateISO(pickupDate);
            setCalendarMonth({ year: sel.getFullYear(), month: sel.getMonth() });
            setShowCalendar(true);
          }}
          className="shrink-0 py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center gap-1"
          style={
            !dateOptions().some((o) => o.value === pickupDate)
              ? { background: '#5B3FA8', color: '#FFFFFF' }
              : { background: '#fbfaf8', color: '#1E1B2E', border: '1.5px solid #C9C4D9' }
          }
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="3" y="4" width="18" height="18" rx="2" ry="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /><line x1="3" y1="10" x2="21" y2="10" />
          </svg>
          {!dateOptions().some((o) => o.value === pickupDate)
            ? parseDateISO(pickupDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
            : 'Autre'}
        </button>
      </div>
    </div>
  );

  const timePickerUI = (
    <div>
      <p className="text-xs font-bold mb-2" style={{ color: '#4A4560' }}>Heure ?</p>
      {pickupTime ? (
        <div className="flex items-center gap-2">
          <span
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold"
            style={{ background: '#5B3FA8', color: '#FFFFFF' }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
            {pickupTime.split(':').slice(0, 2).join('h')}
          </span>
          <button type="button" onClick={() => setPickupTime('')} className="text-xs font-semibold" style={{ color: '#8E89A3' }}>Supprimer</button>
          <button type="button" onClick={() => { setCustomHeure(pickupTime.split(':')[0]); setCustomMinute(pickupTime.split(':')[1] || '00'); setShowHeure(true); }} className="text-xs font-semibold" style={{ color: '#5B3FA8' }}>Modifier</button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => setShowHeure(true)}
          className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-bold transition-all"
          style={{ background: '#fbfaf8', color: '#1E1B2E', border: '1.5px solid #C9C4D9' }}
        >
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#8E89A3" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><path d="M12 6v6l4 2" /></svg>
          Ajouter une heure
        </button>
      )}
    </div>
  );

  const prepaidToggleUI = (
    <button
      type="button"
      onClick={() => setPaid(!paid)}
      className="flex items-center justify-between w-full px-3 py-2.5 rounded-xl transition-all"
      style={{ background: paid ? 'rgba(91, 63, 168, 0.08)' : '#fbfaf8', border: paid ? '2px solid #5B3FA8' : '1.5px solid #C9C4D9' }}
    >
      <div className="flex items-center gap-2">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={paid ? '#5B3FA8' : '#8E89A3'} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="1" y="4" width="22" height="16" rx="2" ry="2" /><line x1="1" y1="10" x2="23" y2="10" />
        </svg>
        <span className="text-xs font-semibold" style={{ color: paid ? '#5B3FA8' : '#1E1B2E' }}>Prépayé</span>
      </div>
      <div className="w-9 h-5 rounded-full p-0.5 transition-colors" style={{ background: paid ? '#5B3FA8' : '#C9C4D9' }}>
        <div className="w-4 h-4 rounded-full bg-white transition-transform" style={{ transform: paid ? 'translateX(1rem)' : 'translateX(0)' }} />
      </div>
    </button>
  );

  return (
    <div className="flex flex-col" style={{ minHeight: 'calc(100vh - 8rem)' }}>
      {/* Header avec indicateur d'étape */}
      <header className="flex items-center justify-between pt-2 mb-4">
        <button
          onClick={() => {
            if (etape === 'client') setEtape('produits');
            else onCreated();
          }}
          className="flex items-center gap-1 text-base font-bold"
          style={{ color: '#5B3FA8' }}
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6" />
          </svg>
          Retour
        </button>
        <div className="flex gap-1.5">
          {['produits', 'client'].map((e, i) => (
            <div
              key={e}
              className="h-2 rounded-full transition-all"
              style={{
                width: etape === e ? '2.5rem' : '0.75rem',
                background: ['produits', 'client'].indexOf(etape) >= i ? '#5B3FA8' : '#C9C4D9',
              }}
            />
          ))}
        </div>
      </header>

      {/* ===== ÉTAPE 1: SÉLECTION PRODUITS ===== */}
      {etape === 'produits' && (
        <div className="flex-1 flex flex-col lg:flex-row gap-4 min-h-0">
          {/* Colonne gauche: catalogue */}
          <div className="flex-1 flex flex-col min-h-0 lg:min-w-0">
            <h1 className="text-xl font-bold mb-3">Que commande le client ?</h1>

            {/* Recherche */}
            <div className="relative mb-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#8E89A3" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="absolute left-4 top-1/2 -translate-y-1/2">
                <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Rechercher un produit..."
                style={{ width: '100%', padding: '0.875rem 1rem 0.875rem 3rem', borderRadius: '1rem', border: '1.5px solid #C9C4D9', fontSize: '1rem', background: '#FFFFFF', color: '#1E1B2E', outline: 'none' }}
              />
            </div>

            {/* Onglets catégories */}
            <div className="flex gap-2 overflow-x-auto pb-2 mb-3 -mx-1 px-1">
              <button
                onClick={() => setFilter('Tout')}
                className="shrink-0 px-5 py-3 rounded-2xl text-sm font-bold transition-all"
                style={filter === 'Tout'
                  ? { background: '#5B3FA8', color: '#FFFFFF' }
                  : { background: '#FFFFFF', color: '#1E1B2E', border: '2px solid #C9C4D9', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }
                }
              >
                Tout
              </button>
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setFilter(cat)}
                  className="shrink-0 px-5 py-3 rounded-2xl text-sm font-bold transition-all"
                  style={filter === cat
                    ? { background: '#5B3FA8', color: '#FFFFFF' }
                    : { background: '#FFFFFF', color: '#1E1B2E', border: '2px solid #C9C4D9', boxShadow: '0 2px 6px rgba(0,0,0,0.06)' }
                  }
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Grille produits */}
            <div className={`grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-3 flex-1 auto-rows-min overflow-y-auto pt-3 px-1 ${panier.length > 0 ? 'pb-28 lg:pb-4' : 'pb-4'}`}>
              {/* Produit personnalisé */}
              <button
                type="button"
                onClick={() => setShowCustom(true)}
                className="flex flex-col items-center justify-center text-center rounded-2xl transition-all"
                style={{ minHeight: '7rem', padding: '1rem', background: 'transparent', color: '#5B3FA8', border: '2px dashed #5B3FA8' }}
              >
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#5B3FA8" strokeWidth="2" strokeLinecap="round">
                  <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
                </svg>
                <span className="font-bold text-sm mt-1.5">Produit personnalisé</span>
              </button>

              {visible.map((p) => {
                const ligne = panier.find((l) => l.productId === p.id);
                const qty = ligne?.qty || 0;
                const qtyOffert = ligne?.freeQty || 0;
                const qtyTotal = qty + qtyOffert;
                const unite = p.unite || 'pièce';
                return (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => ouvrirModalQuantite(p)}
                    className="relative flex flex-col items-center justify-center text-center rounded-2xl transition-all"
                    style={{
                      minHeight: '7rem',
                      padding: '1rem',
                      background: qtyTotal > 0 ? 'rgba(91, 63, 168, 0.08)' : '#FFFFFF',
                      color: '#1E1B2E',
                      border: qtyTotal > 0 ? '2.5px solid #5B3FA8' : '2px solid #C9C4D9',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    }}
                  >
                    <span className="font-bold text-base leading-tight">{p.name}</span>
                    {p.price > 0 && (
                      <span className="text-sm mt-1.5 font-bold" style={{ color: '#4A4560' }}>
                        {p.price.toFixed(2)} € / {unite}
                      </span>
                    )}
                    {qtyTotal > 0 && (
                      <>
                        <span
                          className="absolute -top-2 -right-2 min-w-8 h-8 rounded-full text-base font-bold flex items-center justify-center px-1.5"
                          style={{ background: '#5B3FA8', color: '#FFFFFF', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}
                        >
                          {unite === 'kg' ? `${qty}kg` : qty}
                        </span>
                        {qtyOffert > 0 && (
                          <span
                            className="absolute -top-2 -left-2 min-w-7 h-7 rounded-full text-xs font-bold flex items-center justify-center px-1"
                            style={{ background: '#10B981', color: '#FFFFFF', boxShadow: '0 2px 6px rgba(0,0,0,0.15)' }}
                          >
                            +{unite === 'kg' ? `${qtyOffert}kg` : qtyOffert}
                          </span>
                        )}
                      </>
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Sidebar panier — desktop */}
          {panier.length > 0 && (
            <>
              <div
                className="hidden lg:flex flex-col w-80 xl:w-96 shrink-0 rounded-2xl overflow-hidden"
                style={{ background: '#FFFFFF', border: '1px solid #DDD9EA', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}
              >
                <div className="px-5 py-4" style={{ borderBottom: '1px solid #DDD9EA' }}>
                  <h2 className="font-bold text-lg">Panier</h2>
                  <p className="text-sm" style={{ color: '#8E89A3' }}>
                    {panier.length} article{panier.length > 1 ? 's' : ''}
                  </p>
                </div>

                <div className="flex-1 overflow-y-auto px-5 py-3 space-y-2">
                  {panier.map((l) => (
                    <div key={l.productId}>
                      {l.qty > 0 && (
                        <div className="flex items-center gap-3">
                          <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'rgba(91, 63, 168, 0.08)', color: '#5B3FA8' }}>
                            {l.qty}
                          </span>
                          <p className="font-semibold text-sm truncate flex-1 min-w-0">{l.name}</p>
                          <p className="font-bold text-sm shrink-0">{(l.qty * l.price).toFixed(2)} €</p>
                          <button
                            onClick={() => supprimerLigne(l.productId)}
                            className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                            style={{ background: '#FEF2F2' }}
                          >
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round">
                              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
                            </svg>
                          </button>
                        </div>
                      )}
                      {l.freeQty > 0 && (
                        <div className="flex items-center gap-3 mt-1">
                          <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{ background: '#ECFDF5', color: '#10B981' }}>
                            {l.freeQty}
                          </span>
                          <p className="text-sm truncate flex-1 min-w-0" style={{ color: '#10B981' }}>
                            {l.name} <span className="font-semibold">— offert</span>
                          </p>
                          <p className="font-bold text-sm shrink-0" style={{ color: '#10B981' }}>0,00 €</p>
                          {!l.qty && (
                            <button onClick={() => supprimerLigne(l.productId)} className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#FEF2F2' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                          )}
                          {l.qty > 0 && <div className="w-8 shrink-0" />}
                        </div>
                      )}
                    </div>
                  ))}
                </div>

                {/* Infos client */}
                <div className="px-5 py-3 space-y-3" style={{ borderTop: '1px solid #DDD9EA' }}>
                  <p style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8E89A3' }}>Client</p>
                  <input
                    type="text"
                    value={clientName}
                    onChange={(e) => setClientName(e.target.value)}
                    placeholder="Nom du client"
                    style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.75rem', border: '1.5px solid #C9C4D9', fontSize: '0.875rem', background: '#fbfaf8', color: '#1E1B2E', outline: 'none' }}
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="tel"
                      value={clientPhone}
                      onChange={(e) => setClientPhone(e.target.value)}
                      placeholder="Téléphone"
                      style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.75rem', border: '1.5px solid #C9C4D9', fontSize: '0.875rem', background: '#fbfaf8', color: '#1E1B2E', outline: 'none' }}
                    />
                    <input
                      type="email"
                      value={clientEmail}
                      onChange={(e) => setClientEmail(e.target.value)}
                      placeholder="Email"
                      style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.75rem', border: '1.5px solid #C9C4D9', fontSize: '0.875rem', background: '#fbfaf8', color: '#1E1B2E', outline: 'none' }}
                    />
                  </div>
                  {datePickerUI}
                  {timePickerUI}
                  <textarea
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    rows={2}
                    placeholder="Note (optionnel)"
                    style={{ width: '100%', padding: '0.625rem 0.875rem', borderRadius: '0.75rem', border: '1.5px solid #C9C4D9', fontSize: '0.875rem', background: '#fbfaf8', color: '#1E1B2E', resize: 'none' }}
                  />
                  {prepaidToggleUI}
                </div>

                {/* Total + valider */}
                <div className="px-5 py-4" style={{ borderTop: '1.5px solid #C9C4D9' }}>
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-bold text-base">Total TTC</span>
                    <span className="font-bold text-2xl" style={{ color: '#5B3FA8' }}>{total.toFixed(2)} €</span>
                  </div>
                  <button
                    onClick={(e) => { e.preventDefault(); validate(e as unknown as React.FormEvent); }}
                    disabled={panier.length === 0}
                    className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 px-4 font-bold text-base transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                    style={{ background: '#5B3FA8', color: '#FFFFFF', minHeight: '3.5rem' }}
                  >
                    Enregistrer la commande
                  </button>
                  {confirmation && (
                    <div className="text-sm font-medium rounded-xl px-4 py-3 mt-3" style={{ color: '#10B981', background: '#ECFDF5' }}>
                      {confirmation}
                    </div>
                  )}
                </div>
              </div>

              {/* Barre panier mobile */}
              <div
                className="lg:hidden fixed bottom-0 left-0 right-0 z-40 px-4 py-3"
                style={{ background: 'rgba(255,255,255,0.95)', backdropFilter: 'blur(20px)', borderTop: '1px solid #DDD9EA', paddingBottom: 'calc(0.75rem + env(safe-area-inset-bottom))' }}
              >
                {showDetailMobile && (
                  <div className="mb-3 space-y-2 max-h-52 overflow-y-auto">
                    {panier.map((l) => (
                      <div key={l.productId}>
                        {l.qty > 0 && (
                          <div className="flex items-center gap-3">
                            <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{ background: 'rgba(91, 63, 168, 0.08)', color: '#5B3FA8' }}>{l.qty}</span>
                            <p className="font-semibold text-sm truncate flex-1 min-w-0">{l.name}</p>
                            <p className="font-bold text-sm shrink-0">{(l.qty * l.price).toFixed(2)} €</p>
                            <button onClick={() => supprimerLigne(l.productId)} className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#FEF2F2' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                            </button>
                          </div>
                        )}
                        {l.freeQty > 0 && (
                          <div className="flex items-center gap-3 mt-1">
                            <span className="w-7 h-7 rounded-lg flex items-center justify-center text-xs font-bold shrink-0" style={{ background: '#ECFDF5', color: '#10B981' }}>{l.freeQty}</span>
                            <p className="text-sm truncate flex-1 min-w-0" style={{ color: '#10B981' }}>{l.name} <span className="font-semibold">— offert</span></p>
                            <p className="font-bold text-sm shrink-0" style={{ color: '#10B981' }}>0,00 €</p>
                            {!l.qty ? (
                              <button onClick={() => supprimerLigne(l.productId)} className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0" style={{ background: '#FEF2F2' }}>
                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2.5" strokeLinecap="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
                              </button>
                            ) : <div className="w-8 shrink-0" />}
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <div className="flex-1">
                    <p className="text-sm font-medium" style={{ color: '#4A4560' }}>{panier.length} article{panier.length > 1 ? 's' : ''}</p>
                    <p className="text-xl font-bold" style={{ color: '#5B3FA8' }}>{total.toFixed(2)} €</p>
                  </div>
                  <button
                    onClick={() => setShowDetailMobile(!showDetailMobile)}
                    className="px-4 py-2.5 rounded-xl text-sm font-bold"
                    style={{ background: '#FFFFFF', color: '#1E1B2E', border: '1.5px solid #C9C4D9', minHeight: '3.25rem' }}
                  >
                    {showDetailMobile ? 'Masquer' : 'Détail'}
                  </button>
                  <button
                    onClick={() => setEtape('client')}
                    className="px-6 py-2.5 rounded-xl text-base font-bold"
                    style={{ background: '#5B3FA8', color: '#FFFFFF', minHeight: '3.25rem' }}
                  >
                    Valider
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="inline ml-1"><polyline points="9 18 15 12 9 6" /></svg>
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      )}

      {/* ===== ÉTAPE 2: CLIENT ===== */}
      {etape === 'client' && (
        <form onSubmit={validate} className="flex-1 flex flex-col max-w-lg mx-auto w-full">
          <h1 className="text-xl font-bold mb-5">Informations client</h1>

          <div className="flex flex-col gap-4 flex-1">
            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-bold" style={{ color: '#1E1B2E' }}>Nom du client</span>
              <input
                type="text"
                value={clientName}
                onChange={(e) => setClientName(e.target.value)}
                placeholder="ex. Jennifer Barret"
                style={{ padding: '0.875rem 1rem', borderRadius: '1rem', border: '1.5px solid #C9C4D9', fontSize: '1rem', background: '#FFFFFF', color: '#1E1B2E', outline: 'none' }}
              />
            </label>

            <div className="grid grid-cols-2 gap-3">
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-bold" style={{ color: '#1E1B2E' }}>Téléphone <span style={{ color: '#8E89A3', fontWeight: 400 }}>(optionnel)</span></span>
                <input
                  type="tel"
                  value={clientPhone}
                  onChange={(e) => setClientPhone(e.target.value)}
                  placeholder="06 12 34 56 78"
                  style={{ padding: '0.875rem 1rem', borderRadius: '1rem', border: '1.5px solid #C9C4D9', fontSize: '1rem', background: '#FFFFFF', color: '#1E1B2E', outline: 'none' }}
                />
              </label>
              <label className="flex flex-col gap-1.5">
                <span className="text-sm font-bold" style={{ color: '#1E1B2E' }}>Email <span style={{ color: '#8E89A3', fontWeight: 400 }}>(optionnel)</span></span>
                <input
                  type="email"
                  value={clientEmail}
                  onChange={(e) => setClientEmail(e.target.value)}
                  placeholder="client@email.com"
                  style={{ padding: '0.875rem 1rem', borderRadius: '1rem', border: '1.5px solid #C9C4D9', fontSize: '1rem', background: '#FFFFFF', color: '#1E1B2E', outline: 'none' }}
                />
              </label>
            </div>

            {/* Date custom picker */}
            <div>
              <span className="text-sm font-bold block mb-2" style={{ color: '#1E1B2E' }}>Date de retrait</span>
              {datePickerUI}
            </div>

            {/* Heure custom picker */}
            <div>
              <span className="text-sm font-bold block mb-2" style={{ color: '#1E1B2E' }}>Heure de retrait</span>
              {timePickerUI}
            </div>

            <label className="flex flex-col gap-1.5">
              <span className="text-sm font-bold" style={{ color: '#1E1B2E' }}>Note (optionnel)</span>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Allergies, instructions de préparation..."
                style={{ padding: '0.875rem 1rem', borderRadius: '1rem', border: '1.5px solid #C9C4D9', fontSize: '1rem', background: '#FFFFFF', color: '#1E1B2E', resize: 'none' }}
              />
            </label>

            {prepaidToggleUI}
          </div>

          {/* Résumé + validation */}
          <div className="mt-6 pt-4" style={{ borderTop: '1.5px solid #C9C4D9' }}>
            <div className="flex justify-between items-center mb-4">
              <span className="font-bold text-base">Total TTC</span>
              <span className="font-bold text-2xl" style={{ color: '#5B3FA8' }}>{total.toFixed(2)} €</span>
            </div>

            {confirmation && (
              <div className="text-sm font-medium rounded-xl px-4 py-3 mb-3" style={{ color: '#10B981', background: '#ECFDF5' }}>
                {confirmation}
              </div>
            )}

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 rounded-xl py-3.5 px-4 font-bold text-base transition-all"
              style={{ background: '#5B3FA8', color: '#FFFFFF', minHeight: '3.5rem' }}
            >
              Enregistrer la commande
            </button>
          </div>
        </form>
      )}

      {/* ===== MODALE QUANTITÉ ===== */}
      {produitModal && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          onClick={() => setProduitModal(null)}
        >
          <div className="absolute inset-0" style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)' }} />
          <div
            className="relative w-full max-w-sm rounded-2xl p-6"
            style={{ background: '#FFFFFF', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-xl mb-1 text-center">{produitModal.name}</h3>
            {produitModal.price > 0 && (
              <p className="text-base mb-5 text-center" style={{ color: '#4A4560' }}>
                {produitModal.price.toFixed(2)} € / {produitModal.unite || 'pièce'}
              </p>
            )}

            <label className="block text-base font-bold mb-3 text-center">
              Quantité {(produitModal.unite || 'pièce') === 'kg' ? '(en kg)' : '(unités)'}
            </label>

            <div className="flex items-center justify-center gap-3 mb-5">
              <button
                type="button"
                onClick={() => {
                  const step = (produitModal.unite || 'pièce') === 'kg' ? 0.5 : 1;
                  const v = Math.max(step, parseFloat(qteModal || '0') - step);
                  setQteModal((produitModal.unite || 'pièce') === 'kg' ? v.toFixed(1) : String(v));
                }}
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold"
                style={{ background: '#fbfaf8', color: '#1E1B2E' }}
              >
                -
              </button>
              <input
                ref={qteInputRef}
                type="number"
                value={qteModal}
                onChange={(e) => setQteModal(e.target.value)}
                step={(produitModal.unite || 'pièce') === 'kg' ? '0.1' : '1'}
                min="0"
                className="text-center text-2xl font-bold"
                style={{ padding: '0.875rem', maxWidth: '8rem', borderRadius: '1rem', border: '1.5px solid #C9C4D9', background: '#FFFFFF', color: '#1E1B2E', MozAppearance: 'textfield', WebkitAppearance: 'none' }}
                onKeyDown={(e) => { if (e.key === 'Enter') validerQuantite(); }}
              />
              <button
                type="button"
                onClick={() => {
                  const step = (produitModal.unite || 'pièce') === 'kg' ? 0.5 : 1;
                  const v = parseFloat(qteModal || '0') + step;
                  setQteModal((produitModal.unite || 'pièce') === 'kg' ? v.toFixed(1) : String(v));
                }}
                className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-bold"
                style={{ background: '#fbfaf8', color: '#1E1B2E' }}
              >
                +
              </button>
            </div>

            {produitModal.price > 0 && (
              <p className="text-center text-lg font-bold mb-4" style={{ color: '#5B3FA8' }}>
                = {(parseFloat(qteModal || '0') * produitModal.price).toFixed(2)} €
              </p>
            )}

            {/* Toggle produit offert */}
            {produitModal.price > 0 && (
              <button
                type="button"
                onClick={() => setOffertModal(!offertModal)}
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl mb-3 transition-all"
                style={{
                  background: offertModal ? '#ECFDF5' : '#fbfaf8',
                  border: offertModal ? '2px solid #10B981' : '2px solid #DDD9EA',
                }}
              >
                <span className="flex items-center gap-2 text-sm font-semibold" style={{ color: offertModal ? '#10B981' : '#1E1B2E' }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="20 12 20 22 4 22 4 12" /><rect x="2" y="7" width="20" height="5" rx="1" /><line x1="12" y1="22" x2="12" y2="7" /><path d="M12 7H7.5a2.5 2.5 0 010-5C11 2 12 7 12 7z" /><path d="M12 7h4.5a2.5 2.5 0 000-5C13 2 12 7 12 7z" />
                  </svg>
                  Ajouter des produits offerts
                </span>
                <div
                  className="w-11 h-6 rounded-full p-0.5 transition-colors"
                  style={{ background: offertModal ? '#10B981' : '#C9C4D9' }}
                >
                  <div
                    className="w-5 h-5 rounded-full bg-white transition-transform"
                    style={{ transform: offertModal ? 'translateX(1.25rem)' : 'translateX(0)' }}
                  />
                </div>
              </button>
            )}

            {/* Quantité offerte */}
            {offertModal && (
              <div className="mb-4 px-4 py-3 rounded-xl" style={{ background: '#ECFDF5', border: '1.5px solid #10B981' }}>
                <label className="block text-sm font-bold mb-2 text-center" style={{ color: '#10B981' }}>
                  Quantité offerte {(produitModal.unite || 'pièce') === 'kg' ? '(en kg)' : '(unités)'}
                </label>
                <div className="flex items-center justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => {
                      const step = (produitModal.unite || 'pièce') === 'kg' ? 0.5 : 1;
                      const v = Math.max(step, parseFloat(qteOffertModal || '0') - step);
                      setQteOffertModal((produitModal.unite || 'pièce') === 'kg' ? v.toFixed(1) : String(v));
                    }}
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl font-bold"
                    style={{ background: 'white', color: '#10B981' }}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    value={qteOffertModal}
                    onChange={(e) => setQteOffertModal(e.target.value)}
                    step={(produitModal.unite || 'pièce') === 'kg' ? '0.1' : '1'}
                    min="0"
                    className="text-center text-xl font-bold"
                    style={{ padding: '0.5rem', maxWidth: '6rem', background: 'white', borderRadius: '0.75rem', border: '1.5px solid #10B981', color: '#10B981', MozAppearance: 'textfield', WebkitAppearance: 'none' }}
                  />
                  <button
                    type="button"
                    onClick={() => {
                      const step = (produitModal.unite || 'pièce') === 'kg' ? 0.5 : 1;
                      const v = parseFloat(qteOffertModal || '0') + step;
                      setQteOffertModal((produitModal.unite || 'pièce') === 'kg' ? v.toFixed(1) : String(v));
                    }}
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-xl font-bold"
                    style={{ background: 'white', color: '#10B981' }}
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* Actions */}
            <div className="flex gap-3 mt-2">
              <button
                type="button"
                onClick={() => setProduitModal(null)}
                className="flex-1 py-3 rounded-xl font-bold text-sm"
                style={{ background: '#FFFFFF', color: '#1E1B2E', border: '1.5px solid #C9C4D9' }}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={validerQuantite}
                className="flex-1 py-3 rounded-xl font-bold text-sm"
                style={{ background: '#5B3FA8', color: '#FFFFFF' }}
              >
                Valider
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODALE PRODUIT PERSONNALISÉ ===== */}
      {showCustom && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          onClick={() => setShowCustom(false)}
        >
          <div className="absolute inset-0" style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)' }} />
          <div
            className="relative w-full max-w-sm rounded-2xl p-6"
            style={{ background: '#FFFFFF', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-xl mb-4 text-center">Produit personnalisé</h3>

            <div className="flex flex-col gap-3">
              <input
                type="text"
                value={customNom}
                onChange={(e) => setCustomNom(e.target.value)}
                placeholder="Nom du produit"
                autoFocus
                style={{ padding: '0.875rem 1rem', borderRadius: '1rem', border: '1.5px solid #C9C4D9', fontSize: '1rem', background: '#FFFFFF', color: '#1E1B2E' }}
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="text"
                  inputMode="decimal"
                  value={customPrix}
                  onChange={(e) => setCustomPrix(e.target.value)}
                  placeholder="Prix (€)"
                  style={{ padding: '0.875rem 1rem', borderRadius: '1rem', border: '1.5px solid #C9C4D9', fontSize: '1rem', background: '#FFFFFF', color: '#1E1B2E' }}
                />
                <input
                  type="number"
                  value={customQte}
                  onChange={(e) => setCustomQte(e.target.value)}
                  min="1"
                  placeholder="Qté"
                  style={{ padding: '0.875rem 1rem', borderRadius: '1rem', border: '1.5px solid #C9C4D9', fontSize: '1rem', background: '#FFFFFF', color: '#1E1B2E' }}
                />
              </div>
              <select
                value={customUnite}
                onChange={(e) => setCustomUnite(e.target.value)}
                style={{ padding: '0.875rem 1rem', borderRadius: '1rem', border: '1.5px solid #C9C4D9', fontSize: '1rem', background: '#FFFFFF', color: '#1E1B2E', appearance: 'none' }}
              >
                <option value="pièce">Pièce</option>
                <option value="kg">Kg</option>
                <option value="L">Litre</option>
              </select>
            </div>

            <div className="flex gap-3 mt-4">
              <button
                type="button"
                onClick={() => setShowCustom(false)}
                className="flex-1 py-3 rounded-xl font-bold text-sm"
                style={{ background: '#FFFFFF', color: '#1E1B2E', border: '1.5px solid #C9C4D9' }}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={validerCustom}
                className="flex-1 py-3 rounded-xl font-bold text-sm"
                style={{ background: '#5B3FA8', color: '#FFFFFF' }}
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ===== MODALE CALENDRIER ===== */}
      {showCalendar && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          onClick={() => setShowCalendar(false)}
        >
          <div className="absolute inset-0" style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)' }} />
          <div
            className="relative w-full max-w-sm rounded-2xl p-6"
            style={{ background: '#FFFFFF', boxShadow: '0 25px 60px rgba(0,0,0,0.3)' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-lg mb-4 text-center">Choisir une date</h3>

            {/* Navigation mois */}
            <div className="flex items-center justify-between mb-4">
              <button
                type="button"
                onClick={() => {
                  setCalendarMonth((prev) => {
                    const d = new Date(prev.year, prev.month - 1, 1);
                    return { year: d.getFullYear(), month: d.getMonth() };
                  });
                }}
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: '#fbfaf8' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A4560" strokeWidth="2.5" strokeLinecap="round"><polyline points="15 18 9 12 15 6" /></svg>
              </button>
              <span className="text-sm font-bold capitalize">
                {formatMonthYear(new Date(calendarMonth.year, calendarMonth.month, 1))}
              </span>
              <button
                type="button"
                onClick={() => {
                  setCalendarMonth((prev) => {
                    const d = new Date(prev.year, prev.month + 1, 1);
                    return { year: d.getFullYear(), month: d.getMonth() };
                  });
                }}
                className="w-9 h-9 rounded-lg flex items-center justify-center"
                style={{ background: '#fbfaf8' }}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A4560" strokeWidth="2.5" strokeLinecap="round"><polyline points="9 18 15 12 9 6" /></svg>
              </button>
            </div>

            {/* Jours de la semaine */}
            <div className="grid grid-cols-7 gap-1 mb-1">
              {['Lu', 'Ma', 'Me', 'Je', 'Ve', 'Sa', 'Di'].map((j) => (
                <div key={j} className="text-center text-xs font-bold py-1" style={{ color: '#8E89A3' }}>{j}</div>
              ))}
            </div>

            {/* Grille jours */}
            <div className="grid grid-cols-7 gap-1">
              {(() => {
                const { year, month } = calendarMonth;
                const total = daysInMonth(year, month);
                const offset = firstDayOfMonth(year, month);
                const todayISO = today();
                const cells = [];

                for (let i = 0; i < offset; i++) {
                  cells.push(<div key={`empty-${i}`} />);
                }
                for (let day = 1; day <= total; day++) {
                  const iso = toISO(new Date(year, month, day));
                  const isPast = iso < todayISO;
                  const isSelected = iso === pickupDate;
                  const isToday = iso === todayISO;

                  cells.push(
                    <button
                      key={day}
                      type="button"
                      disabled={isPast}
                      onClick={() => {
                        setPickupDate(iso);
                        setShowCalendar(false);
                      }}
                      className="w-full aspect-square rounded-xl flex items-center justify-center text-sm font-semibold transition-all"
                      style={{
                        background: isSelected ? '#5B3FA8' : isToday ? 'rgba(91, 63, 168, 0.08)' : 'transparent',
                        color: isSelected ? '#FFFFFF' : isPast ? '#C9C4D9' : '#1E1B2E',
                        cursor: isPast ? 'not-allowed' : 'pointer',
                        border: isToday && !isSelected ? '1.5px solid #5B3FA8' : 'none',
                      }}
                    >
                      {day}
                    </button>,
                  );
                }
                return cells;
              })()}
            </div>
          </div>
        </div>
      )}

      {/* ===== MODALE HEURE ===== */}
      {showHeure && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center px-4"
          onClick={() => setShowHeure(false)}
        >
          <div className="absolute inset-0" style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)' }} />
          <div
            className="relative w-full max-w-sm rounded-2xl p-6"
            style={{ background: '#FFFFFF', boxShadow: '0 25px 60px rgba(0,0,0,0.3)', maxHeight: '85vh', overflow: 'auto' }}
            onClick={(e) => e.stopPropagation()}
          >
            <h3 className="font-bold text-lg mb-4 text-center">Choisir une heure</h3>

            {/* Heures */}
            <p className="text-xs font-bold mb-2" style={{ color: '#8E89A3' }}>Heure</p>
            <div className="grid grid-cols-6 gap-1.5 mb-4">
              {Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0')).map((h) => (
                <button
                  key={h}
                  type="button"
                  onClick={() => setCustomHeure(h)}
                  className="py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={
                    customHeure === h
                      ? { background: '#5B3FA8', color: '#FFFFFF' }
                      : { background: '#fbfaf8', color: '#1E1B2E' }
                  }
                >
                  {h}
                </button>
              ))}
            </div>

            {/* Minutes */}
            <p className="text-xs font-bold mb-2" style={{ color: '#8E89A3' }}>Minutes</p>
            <div className="grid grid-cols-6 gap-1.5 mb-5">
              {['00', '05', '10', '15', '20', '25', '30', '35', '40', '45', '50', '55'].map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setCustomMinute(m)}
                  className="py-2.5 rounded-xl text-sm font-bold transition-all"
                  style={
                    customMinute === m
                      ? { background: '#5B3FA8', color: '#FFFFFF' }
                      : { background: '#fbfaf8', color: '#1E1B2E' }
                  }
                >
                  {m}
                </button>
              ))}
            </div>

            {/* Aperçu */}
            <p className="text-center text-xl font-bold mb-4" style={{ color: '#5B3FA8' }}>
              {customHeure}h{customMinute}
            </p>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={() => setShowHeure(false)}
                className="flex-1 py-3 rounded-xl font-bold text-sm"
                style={{ background: '#FFFFFF', color: '#1E1B2E', border: '1.5px solid #C9C4D9' }}
              >
                Annuler
              </button>
              <button
                type="button"
                onClick={() => {
                  setPickupTime(`${customHeure.padStart(2, '0')}:${customMinute.padStart(2, '0')}`);
                  setShowHeure(false);
                }}
                className="flex-1 py-3 rounded-xl font-bold text-sm"
                style={{ background: '#5B3FA8', color: '#FFFFFF' }}
              >
                Valider
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
