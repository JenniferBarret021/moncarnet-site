import { useState } from 'react';
import { actions, useDemoStore } from './store';
import { STATUS_META, STATUS_FLOW } from './types';
import type { Order, OrderItem } from './types';
import { formatEuro, today, tomorrow, isSameDay, formatTime } from './utils';

type DayFilter = 'today' | 'tomorrow' | 'week';

export function OrdersView({ dayFilter = 'today' }: { dayFilter?: DayFilter }) {
  const allOrders = useDemoStore((s) => s.orders);
  const products = useDemoStore((s) => s.products);
  const [filtreStatut, setFiltreStatut] = useState<string>('all');
  const [vue, setVue] = useState<'commandes' | 'produits'>('commandes');
  const [prepCommande, setPrepCommande] = useState<Order | null>(null);
  const [lignesFaites, setLignesFaites] = useState<Set<string>>(new Set());
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showAjoutProduit, setShowAjoutProduit] = useState(false);
  const [rechercheProduit, setRechercheProduit] = useState('');
  const [ajoutProduitSelect, setAjoutProduitSelect] = useState<typeof products[0] | null>(null);
  const [ajoutQte, setAjoutQte] = useState('1');

  const t = today();
  const tom = tomorrow();

  const orders = allOrders.filter((o) => {
    if (dayFilter === 'today') return isSameDay(o.pickupDate, t);
    if (dayFilter === 'tomorrow') return isSameDay(o.pickupDate, tom);
    return o.pickupDate >= t && o.pickupDate <= addDaysSimple(t, 6);
  });

  const now = new Date();
  const pageTitle = dayFilter === 'today' ? "Aujourd'hui" : dayFilter === 'tomorrow' ? 'Demain' : 'Cette semaine';
  const pageDate = (() => {
    if (dayFilter === 'today') return now.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    if (dayFilter === 'tomorrow') {
      const d = new Date(now);
      d.setDate(d.getDate() + 1);
      return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    }
    const endOfWeek = new Date(now);
    const dayOfWeek = now.getDay() === 0 ? 7 : now.getDay();
    endOfWeek.setDate(now.getDate() + (7 - dayOfWeek));
    return `${now.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })} — ${endOfWeek.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })}`;
  })();

  const activeCommandes = orders.filter((c) => c.status !== 'annulee');
  const statsAPrep = orders.filter((c) => c.status === 'en_attente').length;
  const statsEnCours = orders.filter((c) => c.status === 'en_cours').length;
  const statsPretes = orders.filter((c) => c.status === 'prete').length;
  const caJour = orders
    .filter((c) => c.status !== 'annulee')
    .reduce((sum, c) => sum + c.total, 0);

  const ouvrirPreparation = (commande: Order) => {
    setPrepCommande(commande);
    setLignesFaites(new Set());
    setShowAjoutProduit(false);
    setRechercheProduit('');
  };

  const toggleLigne = (itemIdx: string) => {
    setLignesFaites((prev) => {
      const next = new Set(prev);
      if (next.has(itemIdx)) next.delete(itemIdx);
      else next.add(itemIdx);
      return next;
    });
  };

  const toutMarquerFait = () => {
    if (!prepCommande) return;
    actions.setOrderStatus(prepCommande.id, 'prete');
    setPrepCommande(null);
  };

  const commencerPreparation = () => {
    if (!prepCommande) return;
    if (prepCommande.status === 'en_attente') {
      actions.setOrderStatus(prepCommande.id, 'en_cours');
      setPrepCommande({ ...prepCommande, status: 'en_cours' });
    }
  };

  const validerAjoutProduit = () => {
    if (!prepCommande || !ajoutProduitSelect) return;
    const qty = parseFloat(ajoutQte);
    if (!qty || qty <= 0) return;
    const newItem: OrderItem = {
      productId: ajoutProduitSelect.id,
      name: ajoutProduitSelect.name,
      price: ajoutProduitSelect.price,
      qty,
      freeQty: 0,
    };
    actions.addOrderItem(prepCommande.id, newItem);
    setPrepCommande({
      ...prepCommande,
      items: [...prepCommande.items, newItem],
      total: prepCommande.total + newItem.price * newItem.qty,
    });
    setAjoutProduitSelect(null);
    setShowAjoutProduit(false);
    setRechercheProduit('');
  };

  return (
    <div>
      {/* En-tête mobile */}
      <header className="pt-2 mb-4 text-center md:hidden">
        <p style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8E89A3' }}>{pageTitle}</p>
        <h1 className="text-xl font-bold capitalize">{pageDate}</h1>
      </header>

      {/* En-tête desktop */}
      <header className="hidden md:flex items-start justify-between mb-6">
        <div>
          <p style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8E89A3' }} className="mb-1">{pageDate.toUpperCase()}</p>
          <h1 className="text-2xl font-bold">
            {pageTitle} &middot; {activeCommandes.length} commande{activeCommandes.length !== 1 ? 's' : ''}
          </h1>
        </div>
      </header>

      {/* Stats desktop */}
      {orders.length > 0 && (
        <div className="hidden md:grid grid-cols-4 gap-4 mb-6">
          {[
            { label: 'À préparer', value: String(statsAPrep), bg: '#FFFBEB', color: '#F59E0B' },
            { label: 'En cours', value: String(statsEnCours), bg: '#F3EEFF', color: '#6C3AED' },
            { label: 'Prêtes', value: String(statsPretes), bg: '#ECFDF5', color: '#10B981' },
            { label: 'CA jour', value: `${caJour.toFixed(0)} \u20AC`, bg: '#F1F5F9', color: '#1E1B2E' },
          ].map((s) => (
            <div
              key={s.label}
              className="rounded-xl px-5 py-4"
              style={{ background: s.bg, border: '1px solid #DDD9EA' }}
            >
              <p className="text-xs font-semibold mb-1" style={{ color: s.color, opacity: 0.8 }}>{s.label}</p>
              <p className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>
      )}

      {/* Aucune commande */}
      {orders.length === 0 ? (
        <div className="text-center pt-4 pb-8">
          <div
            className="w-20 h-20 rounded-3xl mx-auto mb-5 flex items-center justify-center"
            style={{ background: 'rgba(108, 58, 237, 0.08)' }}
          >
            <svg width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="#6C3AED" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
              <line x1="10" y1="14" x2="14" y2="14" />
            </svg>
          </div>
          <h2 className="text-lg font-bold mb-2">Pas de commande {dayFilter === 'today' ? "aujourd'hui" : dayFilter === 'tomorrow' ? 'demain' : 'cette semaine'}</h2>
          <p className="text-sm mb-6" style={{ color: '#4A4560', maxWidth: '260px', margin: '0 auto 1.5rem' }}>
            Votre journée est libre ! Enregistrez une commande ou complétez votre catalogue.
          </p>
        </div>
      ) : (
        <>
          {/* Filtres par statut */}
          <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1 -mx-1 px-1">
            {[
              { key: 'all', label: 'Tout', count: activeCommandes.length, color: '' },
              { key: 'en_attente', label: 'À préparer', count: statsAPrep, color: '#F59E0B' },
              { key: 'en_cours', label: 'En préparation', count: statsEnCours, color: '#6C3AED' },
              { key: 'prete', label: 'Préparées', count: statsPretes, color: '#10B981' },
              { key: 'recuperee', label: 'Récupérées', count: orders.filter((c) => c.status === 'recuperee').length, color: '#94A3B8' },
            ].map((f) => (
              <button
                key={f.key}
                onClick={() => setFiltreStatut(f.key)}
                className="shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                style={
                  filtreStatut === f.key
                    ? { background: '#6C3AED', color: '#FFFFFF' }
                    : { background: '#FFFFFF', color: '#1E1B2E', border: '1.5px solid #C9C4D9' }
                }
              >
                {f.key !== 'all' && f.count > 0 && (
                  <span
                    className="w-5 h-5 rounded-full flex items-center justify-center"
                    style={
                      filtreStatut === f.key
                        ? { background: 'rgba(255,255,255,0.25)', color: '#FFFFFF', fontSize: '0.625rem', fontWeight: 700 }
                        : { background: f.color + '18', color: f.color, fontSize: '0.625rem', fontWeight: 700 }
                    }
                  >
                    {f.count}
                  </span>
                )}
                {f.label}
              </button>
            ))}
          </div>

          {/* Toggle vue */}
          <div className="flex gap-2 mb-4">
            {[
              { key: 'commandes' as const, label: 'Par commande' },
              { key: 'produits' as const, label: 'Par produit' },
            ].map((v) => (
              <button
                key={v.key}
                onClick={() => setVue(v.key)}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl text-sm font-bold transition-all"
                style={
                  vue === v.key
                    ? { background: '#6C3AED', color: '#FFFFFF', minHeight: '2.5rem' }
                    : { background: '#FFFFFF', color: '#1E1B2E', border: '2px solid #C9C4D9', minHeight: '2.5rem' }
                }
              >
                {v.label}
              </button>
            ))}
          </div>

          {/* Contenu */}
          {(() => {
            const q = searchQuery.toLowerCase().trim();
            const filtered = orders.filter((c) => {
              if (filtreStatut === 'all' && c.status === 'annulee') return false;
              if (filtreStatut !== 'all' && c.status !== filtreStatut) return false;
              if (q) {
                const matchNom = c.clientName.toLowerCase().includes(q);
                const matchProduit = c.items.some((l) => l.name.toLowerCase().includes(q));
                return matchNom || matchProduit;
              }
              return true;
            });

            if (filtered.length === 0)
              return (
                <div className="text-center py-8">
                  <p className="text-sm" style={{ color: '#8E89A3' }}>
                    Aucune commande dans cette catégorie
                  </p>
                </div>
              );

            if (vue === 'produits') {
              const produitsMap: Record<string, { nom: string; quantite: number }> = {};
              filtered.forEach((c) => {
                c.items.forEach((l) => {
                  if (produitsMap[l.name]) {
                    produitsMap[l.name].quantite += l.qty;
                  } else {
                    produitsMap[l.name] = { nom: l.name, quantite: l.qty };
                  }
                });
              });
              return (
                <div className="space-y-1.5 pb-36">
                  {Object.values(produitsMap)
                    .sort((a, b) => b.quantite - a.quantite)
                    .map((p) => (
                      <div
                        key={p.nom}
                        className="flex items-center justify-between px-4 py-3.5 rounded-xl"
                        style={{ background: '#FFFFFF' }}
                      >
                        <span className="font-semibold text-base">{p.nom}</span>
                        <span
                          className="text-lg font-bold px-3 py-1 rounded-lg"
                          style={{ background: 'rgba(108, 58, 237, 0.08)', color: '#6C3AED' }}
                        >
                          x{p.quantite}
                        </span>
                      </div>
                    ))}
                </div>
              );
            }

            // Grouper par heure
            const parHeure: Record<string, Order[]> = {};
            filtered.forEach((c) => {
              const key = c.pickupTime || 'Sans heure';
              if (!parHeure[key]) parHeure[key] = [];
              parHeure[key].push(c);
            });
            const groupes = Object.entries(parHeure).sort(([a], [b]) => {
              if (a === 'Sans heure') return 1;
              if (b === 'Sans heure') return -1;
              return a.localeCompare(b);
            });

            return (
              <div className="space-y-4 pb-36">
                {groupes.map(([heure, cmds]) => (
                  <div key={heure}>
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-xs font-bold uppercase tracking-wide" style={{ color: '#8E89A3' }}>
                        {heure === 'Sans heure' ? 'Sans heure' : formatTime(heure)}
                      </span>
                      <div className="flex-1 h-px" style={{ background: '#DDD9EA' }} />
                      <span className="text-xs font-semibold" style={{ color: '#8E89A3' }}>
                        {cmds.length}
                      </span>
                    </div>
                    <div className="space-y-1.5">
                      {cmds.map((commande) => {
                        const s = STATUS_META[commande.status];
                        return (
                          <div
                            key={commande.id}
                            className="rounded-xl transition-all overflow-hidden"
                            style={{
                              background: '#FFFFFF',
                              opacity: commande.status === 'recuperee' ? 0.5 : 1,
                            }}
                          >
                            <div
                              className="px-4 py-1.5 text-xs font-bold tracking-wide"
                              style={{ background: s.bg, color: s.color }}
                            >
                              {s.label}
                            </div>
                            <div
                              className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-all"
                              onClick={() => ouvrirPreparation(commande)}
                              style={{ WebkitTapHighlightColor: 'transparent' }}
                            >
                              <div className="flex-1 min-w-0">
                                <h3 className="font-semibold text-base truncate">{commande.clientName}</h3>
                                <div className="flex items-center gap-2 mt-0.5">
                                  <span className="text-sm" style={{ color: '#8E89A3' }}>
                                    {commande.items.length} article{commande.items.length > 1 ? 's' : ''}
                                  </span>
                                  <span className="text-sm font-bold" style={{ color: '#4A4560' }}>
                                    {formatEuro(commande.total)}
                                  </span>
                                </div>
                              </div>
                              {s.next && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    if (commande.status === 'prete') {
                                      actions.setOrderStatus(commande.id, 'recuperee');
                                    } else {
                                      ouvrirPreparation(commande);
                                    }
                                  }}
                                  className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-bold transition-all"
                                  style={{ background: s.bg, color: s.color }}
                                >
                                  {s.nextLabel}
                                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="9 18 15 12 9 6" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            );
          })()}

          {/* Bouton flottant mobile */}
          <div className="fixed bottom-28 left-0 right-0 z-40 flex justify-center px-4 md:hidden">
            <div
              className="flex items-center gap-2 rounded-2xl overflow-hidden transition-all duration-300"
              style={{
                background: 'rgba(255,255,255,0.9)',
                backdropFilter: 'blur(20px)',
                WebkitBackdropFilter: 'blur(20px)',
                boxShadow: '0 4px 24px rgba(0,0,0,0.12), 0 1px 4px rgba(0,0,0,0.08)',
                border: '1px solid rgba(255,255,255,0.6)',
                padding: '5px',
                maxWidth: searchOpen ? '100%' : 'fit-content',
                width: searchOpen ? '100%' : 'auto',
              }}
            >
              {searchOpen ? (
                <div className="flex-1 flex items-center gap-2 px-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E89A3" strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Rechercher..."
                    className="flex-1 text-sm bg-transparent border-none outline-none"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => { setSearchOpen(false); setSearchQuery(''); }}
                    className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                    style={{ background: '#fbfaf8' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8E89A3" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="18" y1="6" x2="6" y2="18" />
                      <line x1="6" y1="6" x2="18" y2="18" />
                    </svg>
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => setSearchOpen(true)}
                  className="shrink-0 w-9 h-9 rounded-xl flex items-center justify-center"
                  style={{ color: '#8E89A3' }}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                    <circle cx="11" cy="11" r="8" />
                    <line x1="21" y1="21" x2="16.65" y2="16.65" />
                  </svg>
                </button>
              )}
            </div>
          </div>
        </>
      )}

      {/* MODALE PRÉPARATION */}
      {prepCommande && (() => {
        const lignes = prepCommande.items;
        const totalLignes = lignes.length;
        const nbFaites = lignesFaites.size;
        const toutFait = totalLignes > 0 && nbFaites === totalLignes;
        const s = STATUS_META[prepCommande.status];
        const canCheck = prepCommande.status === 'en_attente' || prepCommande.status === 'en_cours';

        return (
          <div
            className="fixed inset-0 z-[100] flex items-end sm:items-center justify-center"
            onClick={() => setPrepCommande(null)}
          >
            <div
              className="absolute inset-0"
              style={{ background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(4px)' }}
            />
            <div
              className="relative w-full sm:max-w-md rounded-t-2xl sm:rounded-2xl overflow-hidden max-h-[85vh] flex flex-col"
              style={{ background: '#FFFFFF' }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div
                className="px-5 pt-5 pb-3 flex items-center justify-between"
                style={{ borderBottom: '1px solid #DDD9EA' }}
              >
                <div>
                  <h3 className="font-bold text-lg">{prepCommande.clientName}</h3>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span
                      className="inline-flex items-center px-2 py-0.5 rounded-full font-bold"
                      style={{ fontSize: '0.625rem', color: s.color, background: s.bg }}
                    >
                      {s.label}
                    </span>
                    {prepCommande.pickupTime && (
                      <span className="text-xs" style={{ color: '#8E89A3' }}>
                        Retrait à {formatTime(prepCommande.pickupTime)}
                      </span>
                    )}
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPrepCommande(null)}
                  className="w-8 h-8 rounded-full flex items-center justify-center"
                  style={{ background: '#fbfaf8' }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#4A4560" strokeWidth="2.5" strokeLinecap="round">
                    <line x1="18" y1="6" x2="6" y2="18" />
                    <line x1="6" y1="6" x2="18" y2="18" />
                  </svg>
                </button>
              </div>

              {/* Progression */}
              {canCheck && totalLignes > 0 && (
                <div className="px-5 py-3" style={{ borderBottom: '1px solid #DDD9EA' }}>
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-xs font-semibold" style={{ color: '#4A4560' }}>
                      Progression
                    </span>
                    <span
                      className="text-xs font-bold"
                      style={{ color: toutFait ? '#10B981' : '#6C3AED' }}
                    >
                      {nbFaites}/{totalLignes}
                    </span>
                  </div>
                  <div className="h-2 rounded-full overflow-hidden" style={{ background: '#fbfaf8' }}>
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${(nbFaites / totalLignes) * 100}%`,
                        background: toutFait ? '#10B981' : '#6C3AED',
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Liste des produits */}
              <div className="flex-1 overflow-y-auto px-5 py-3">
                {prepCommande.note && (
                  <p className="text-xs italic mb-3 px-1" style={{ color: '#8E89A3' }}>
                    {prepCommande.note}
                  </p>
                )}
                <div className="space-y-1.5">
                  {lignes.map((l, idx) => {
                    const key = `${l.productId}-${idx}`;
                    const fait = canCheck && lignesFaites.has(key);
                    return canCheck ? (
                      <button
                        key={key}
                        type="button"
                        onClick={() => toggleLigne(key)}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl transition-all"
                        style={{ background: fait ? '#ECFDF5' : '#fbfaf8' }}
                      >
                        <div
                          className="w-6 h-6 rounded-full border-2 flex items-center justify-center shrink-0 transition-colors"
                          style={{
                            borderColor: fait ? '#10B981' : '#C9C4D9',
                            background: fait ? '#10B981' : 'transparent',
                          }}
                        >
                          {fait && (
                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                              <polyline points="20 6 9 17 4 12" />
                            </svg>
                          )}
                        </div>
                        <div className="flex-1 text-left min-w-0">
                          <p
                            className={`text-sm font-semibold ${fait ? 'line-through' : ''}`}
                            style={{ color: fait ? '#8E89A3' : '#1E1B2E' }}
                          >
                            {l.name}
                          </p>
                          <p className="text-xs" style={{ color: '#8E89A3' }}>
                            {l.qty} {l.price > 0 ? `x ${l.price.toFixed(2)} \u20AC` : ''}
                          </p>
                        </div>
                        <span
                          className="font-bold text-sm shrink-0"
                          style={{ color: fait ? '#10B981' : '#6C3AED' }}
                        >
                          {l.qty}x
                        </span>
                      </button>
                    ) : (
                      <div
                        key={key}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-xl"
                        style={{ background: '#fbfaf8' }}
                      >
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold">{l.name}</p>
                          <p className="text-xs" style={{ color: '#8E89A3' }}>
                            {l.qty} {l.price > 0 ? `x ${l.price.toFixed(2)} \u20AC` : ''}
                          </p>
                        </div>
                        <span className="font-bold text-sm shrink-0" style={{ color: '#6C3AED' }}>
                          {l.qty}x
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* Bouton ajouter produit */}
                {prepCommande.status === 'en_attente' && !showAjoutProduit && (
                  <button
                    type="button"
                    onClick={() => setShowAjoutProduit(true)}
                    className="w-full flex items-center justify-center gap-2 mt-3 px-3 py-2.5 rounded-xl text-sm font-semibold transition-all"
                    style={{ background: '#fbfaf8', color: '#6C3AED', border: '1px dashed #6C3AED' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                    Ajouter un produit
                  </button>
                )}

                {/* Sélecteur de produits */}
                {prepCommande.status === 'en_attente' && showAjoutProduit && (
                  <div className="mt-3 rounded-xl overflow-hidden" style={{ border: '1px solid #DDD9EA' }}>
                    <div className="px-3 py-2 flex items-center gap-2" style={{ background: '#fbfaf8' }}>
                      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#8E89A3" strokeWidth="2" strokeLinecap="round">
                        <circle cx="11" cy="11" r="8" />
                        <line x1="21" y1="21" x2="16.65" y2="16.65" />
                      </svg>
                      <input
                        type="text"
                        value={rechercheProduit}
                        onChange={(e) => setRechercheProduit(e.target.value)}
                        placeholder="Rechercher un produit..."
                        className="flex-1 text-sm bg-transparent border-none outline-none"
                        autoFocus
                      />
                      <button
                        type="button"
                        onClick={() => { setShowAjoutProduit(false); setRechercheProduit(''); }}
                        className="text-xs font-semibold"
                        style={{ color: '#8E89A3' }}
                      >
                        Fermer
                      </button>
                    </div>
                    <div className="max-h-40 overflow-y-auto">
                      {products
                        .filter((p) => p.name.toLowerCase().includes(rechercheProduit.toLowerCase()))
                        .map((p) => (
                          <button
                            key={p.id}
                            type="button"
                            onClick={() => { setAjoutProduitSelect(p); setAjoutQte('1'); }}
                            className="w-full flex items-center justify-between px-3 py-2.5 text-sm transition-all hover:bg-gray-50"
                            style={{ borderTop: '1px solid #DDD9EA' }}
                          >
                            <span className="font-medium">{p.name}</span>
                            <span className="text-xs" style={{ color: '#8E89A3' }}>
                              {p.price > 0 ? `${p.price.toFixed(2)} \u20AC` : ''}
                            </span>
                          </button>
                        ))}
                    </div>

                    {/* Mini-modale quantité */}
                    {ajoutProduitSelect && (
                      <div className="px-3 py-3" style={{ borderTop: '2px solid #6C3AED', background: 'rgba(108, 58, 237, 0.08)' }}>
                        <p className="text-sm font-bold text-center mb-2" style={{ color: '#6C3AED' }}>
                          {ajoutProduitSelect.name}
                        </p>
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <button
                            type="button"
                            onClick={() => {
                              const v = Math.max(1, parseFloat(ajoutQte || '0') - 1);
                              setAjoutQte(String(v));
                            }}
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                            style={{ background: 'white', color: '#1E1B2E' }}
                          >
                            -
                          </button>
                          <input
                            type="number"
                            value={ajoutQte}
                            onChange={(e) => setAjoutQte(e.target.value)}
                            min="0"
                            className="text-center text-lg font-bold"
                            style={{ padding: '0.5rem', maxWidth: '5rem', background: 'white', borderRadius: '0.75rem', border: '1.5px solid #C9C4D9' }}
                            autoFocus
                          />
                          <button
                            type="button"
                            onClick={() => {
                              const v = parseFloat(ajoutQte || '0') + 1;
                              setAjoutQte(String(v));
                            }}
                            className="w-10 h-10 rounded-xl flex items-center justify-center text-lg font-bold"
                            style={{ background: 'white', color: '#1E1B2E' }}
                          >
                            +
                          </button>
                        </div>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setAjoutProduitSelect(null)}
                            className="flex-1 py-2.5 px-4 rounded-xl text-sm font-bold"
                            style={{ background: '#FFFFFF', color: '#1E1B2E', border: '1.5px solid #C9C4D9' }}
                          >
                            Annuler
                          </button>
                          <button
                            type="button"
                            onClick={validerAjoutProduit}
                            className="flex-1 py-2.5 px-4 rounded-xl text-sm font-bold"
                            style={{ background: '#6C3AED', color: '#FFFFFF' }}
                          >
                            Ajouter
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Changement de statut */}
              <div className="px-5 py-3" style={{ borderTop: '1px solid #DDD9EA' }}>
                <p style={{ fontSize: '0.6rem', fontWeight: 700, textTransform: 'uppercase', color: '#8E89A3', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>
                  Statut
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {STATUS_FLOW.map((key) => {
                    const cfg = STATUS_META[key];
                    return (
                      <button
                        key={key}
                        onClick={() => {
                          actions.setOrderStatus(prepCommande.id, key);
                          setPrepCommande({ ...prepCommande, status: key });
                        }}
                        className="px-3 py-1.5 rounded-lg text-xs font-bold transition-all"
                        style={{
                          background: prepCommande.status === key ? cfg.color : cfg.bg,
                          color: prepCommande.status === key ? '#FFFFFF' : cfg.color,
                        }}
                      >
                        {cfg.label}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Actions */}
              <div className="px-5 py-4 flex gap-3">
                {prepCommande.status === 'prete' ? (
                  <button
                    onClick={() => {
                      actions.setOrderStatus(prepCommande.id, 'recuperee');
                      setPrepCommande(null);
                    }}
                    className="flex-1 flex items-center justify-center rounded-xl text-sm font-bold"
                    style={{ minHeight: '3rem', background: '#94A3B8', color: 'white' }}
                  >
                    Récupérée par le client
                  </button>
                ) : canCheck ? (
                  <>
                    {prepCommande.status === 'en_attente' && (
                      <button
                        onClick={commencerPreparation}
                        className="flex-1 flex items-center justify-center rounded-xl text-sm font-bold"
                        style={{ minHeight: '3rem', background: '#FFFFFF', color: '#1E1B2E', border: '1.5px solid #C9C4D9' }}
                      >
                        Commencer
                      </button>
                    )}
                    <button
                      onClick={toutMarquerFait}
                      className="flex-1 flex items-center justify-center rounded-xl text-sm font-bold"
                      style={{
                        minHeight: '3rem',
                        background: toutFait ? '#10B981' : '#6C3AED',
                        color: 'white',
                      }}
                    >
                      {toutFait ? 'Commande prête' : 'Marquer comme prête'}
                    </button>
                  </>
                ) : null}
              </div>
            </div>
          </div>
        );
      })()}
    </div>
  );
}

function addDaysSimple(iso: string, n: number): string {
  const [y, m, d] = iso.split('-').map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + n);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`;
}
