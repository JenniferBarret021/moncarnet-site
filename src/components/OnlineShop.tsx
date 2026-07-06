import { useEffect, useState } from 'react';
import { FadeIn } from './ui/FadeIn';
import { Button } from './ui/Button';
import { StackIcon } from './StackIcon';

const VIOLET = '#5B3FA8';

const produits = [
  { id: '1', nom: 'Baguette tradition', prix: '1,10', cat: 'Pains', img: 'https://images.unsplash.com/photo-1568471173242-461f0a730452?w=200&h=200&fit=crop' },
  { id: '2', nom: 'Croissant', prix: '1,30', cat: 'Viennoiseries', img: 'https://images.unsplash.com/photo-1623334044303-241021148842?w=200&h=200&fit=crop' },
  { id: '3', nom: 'Pain au chocolat', prix: '1,40', cat: 'Viennoiseries', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ7KDT0kDnPblJ6hS0VCI0fmrBoDg396xgvsZ5MVKpiTw&s=10' },
  { id: '4', nom: 'Tarte citron', prix: '3,50', cat: 'Pâtisseries', img: 'https://images.unsplash.com/photo-1519915028121-7d3463d20b13?w=200&h=200&fit=crop' },
  { id: '5', nom: 'Flan parisien', prix: '2,80', cat: 'Pâtisseries', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQYNLZDA4kyiOVFZxlingxwfG3HGYFc94fcI1KSBiCHjA&s=10' },
  { id: '6', nom: 'Éclair chocolat', prix: '3,00', cat: 'Pâtisseries', img: 'https://www.cookomix.com/wp-content/uploads/2021/03/eclairs-au-chocolat-thermomix.jpg' },
  { id: '7', nom: 'Brioche', prix: '4,50', cat: 'Pains', img: 'https://images.immediate.co.uk/production/volatile/sites/57/2025/08/290820251756473521.jpeg?quality=90&resize=708,643' },
  { id: '8', nom: 'Chausson pomme', prix: '1,80', cat: 'Viennoiseries', img: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQtNzPoeiUAsB_vyql1hA6j3AT-7XZtY4UYmQvYiNRWMSA9yj4IR2CfHGd6&s=10' },
];

const jours = [
  { label: 'Lun', num: 23, creneaux: ['7:00 - 13:00', '15:00 - 19:00'], today: true },
  { label: 'Mar', num: 24, creneaux: ['7:00 - 13:00', '15:00 - 19:00'] },
  { label: 'Mer', num: 25, creneaux: ['7:00 - 13:00', '15:00 - 19:00'] },
  { label: 'Jeu', num: 26, creneaux: null },
  { label: 'Ven', num: 27, creneaux: ['7:00 - 13:00', '15:00 - 19:00'] },
  { label: 'Sam', num: 28, creneaux: ['7:00 - 19:00'] },
  { label: 'Dim', num: 29, creneaux: null },
];

/*
 * Animation séquentielle :
 * 0-1 : vide
 * 2   : clic baguette → modale quantité (qty=2)
 * 3   : validation → baguette x2 apparaît dans le panier
 * 4   : clic croissant → modale quantité (qty=3)
 * 5   : validation → croissant x3 apparaît dans le panier
 * 6   : clic tarte → modale quantité (qty=1)
 * 7   : validation → tarte x1 apparaît dans le panier
 * 8-9 : formulaire client
 * 10  : bouton "Valider le panier"
 * 11  : "Commande envoyée !"
 * 12  : notification commerçant
 * 13-14 : pause puis reset
 */
function useShopAnimation() {
  const [step, setStep] = useState(0);
  const maxStep = 14;
  useEffect(() => {
    const id = setInterval(() => setStep((s) => (s >= maxStep ? 0 : s + 1)), 800);
    return () => clearInterval(id);
  }, []);

  // Produit en cours de sélection dans la modale
  const modalProduct = step === 2 ? produits[0] : step === 4 ? produits[1] : step === 6 ? produits[3] : null;
  const modalQty = step === 2 ? 2 : step === 4 ? 3 : step === 6 ? 1 : 0;

  // Lignes dans le panier (ajoutées progressivement)
  const cartLines: { nom: string; qty: number; total: string }[] = [];
  if (step >= 3) cartLines.push({ nom: 'Baguette tradition', qty: 2, total: '2,20' });
  if (step >= 5) cartLines.push({ nom: 'Croissant', qty: 3, total: '3,90' });
  if (step >= 7) cartLines.push({ nom: 'Tarte citron', qty: 1, total: '3,50' });

  // Badges quantité sur les produits
  const getQty = (id: string) => {
    if (id === '1' && step >= 3) return 2;
    if (id === '2' && step >= 5) return 3;
    if (id === '4' && step >= 7) return 1;
    return 0;
  };

  const nbArticles = cartLines.reduce((s, l) => s + l.qty, 0);
  const showForm = step >= 8;
  const showConfirm = step >= 11;
  const showNotif = step >= 12;

  return { step, modalProduct, modalQty, cartLines, getQty, nbArticles, showForm, showConfirm, showNotif };
}

/* ===== Browser mockup (desktop) ===== */
function BrowserMockup() {
  const { step, modalProduct, modalQty, cartLines, getQty, nbArticles, showForm, showConfirm, showNotif } = useShopAnimation();

  return (
    <div className="relative w-full">
      <div className="rounded-xl border border-ink/10 bg-white overflow-hidden shadow-[0_20px_60px_rgba(27,21,48,0.12)]">
        {/* Header boutique */}
        <div className="text-center py-5 px-4 relative" style={{ background: 'linear-gradient(135deg, #3D1F6E 0%, #1F0F3D 50%, #0B0518 100%)' }}>
          <div className="mx-auto mb-1.5 flex items-center justify-center">
            <StackIcon size={36} />
          </div>
          <p className="text-[5px] uppercase tracking-[0.2em] font-semibold text-white/50 mb-0.5">Click and Collect</p>
          <h3 className="text-[11px] font-bold text-white leading-none mb-1">Boulangerie démo</h3>
          <p className="text-[7px] text-white/60 flex items-center justify-center gap-1">
            <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
            24 rue Mercière, 69002 Lyon
          </p>
          <div className="flex items-center justify-center gap-1.5 mt-1.5">
            <div className="flex items-center gap-1 px-2 py-1 rounded-lg text-[6px] font-semibold text-white" style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.25)' }}>
              <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72" /></svg>
              06 63 77 60 13
            </div>
          </div>
        </div>

        {/* Barre d'horaires */}
        <div className="mx-2 -mt-2 relative z-10 rounded-lg bg-white p-2 mb-2" style={{ boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          <div className="grid grid-cols-7 gap-0">
            {jours.map((j) => (
              <div key={j.label} className="flex flex-col items-center py-1 rounded-lg" style={{ background: j.today ? 'rgba(91,63,168,0.06)' : 'transparent' }}>
                <span className="text-[5px] font-bold uppercase tracking-wide" style={{ color: j.today ? VIOLET : '#9CA3AF' }}>{j.label}</span>
                <span className="text-[9px] font-bold leading-tight" style={{ color: j.today ? VIOLET : j.creneaux ? '#1F2937' : '#D1D5DB' }}>{j.num}</span>
                {j.creneaux ? j.creneaux.map((c, i) => (
                  <span key={i} className="text-[4px] font-medium" style={{ color: '#6B7280' }}>{c}</span>
                )) : (
                  <span className="text-[4.5px] font-semibold" style={{ color: '#EF4444' }}>Fermé</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Contenu : catalogue + panier */}
        <div className="flex min-h-0 relative">
          {/* Catalogue */}
          <div className="flex-1 px-2 pb-2">
            {/* Délai */}
            <div className="flex gap-1 mb-1.5">
              <div className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-lg text-[5.5px] font-medium" style={{ background: 'rgba(91,63,168,0.06)', color: VIOLET }}>
                <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" /></svg>
                Commandez au moins 48h à l'avance
              </div>
            </div>

            {/* Barre de recherche */}
            <div className="relative mb-1.5">
              <svg className="absolute left-1.5 top-1/2 -translate-y-1/2" width="7" height="7" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" /></svg>
              <div className="w-full pl-5 pr-2 py-1 rounded-lg text-[6px] text-gray-400" style={{ background: '#FFFFFF', boxShadow: '0 1px 3px rgba(0,0,0,0.06)' }}>
                Rechercher un produit...
              </div>
            </div>

            {/* Onglets catégories */}
            <div className="flex gap-1 mb-2">
              {['Tout', 'Pains', 'Viennoiseries', 'Pâtisseries'].map((c, i) => (
                <div key={c} className="px-2 py-0.5 rounded-full text-[6px] font-semibold"
                  style={i === 0 ? { background: VIOLET, color: '#fff' } : { background: '#fff', color: '#6B7280', boxShadow: '0 1px 2px rgba(0,0,0,0.05)' }}
                >{c}</div>
              ))}
            </div>

            {/* Grille produits */}
            <div className="grid grid-cols-4 gap-1.5">
              {produits.map((p) => {
                const qty = getQty(p.id);
                const isSel = qty > 0;
                return (
                  <div key={p.id} className="relative rounded-xl overflow-hidden transition-all duration-300 flex flex-col"
                    style={{
                      border: isSel ? `2px solid ${VIOLET}` : '1.5px solid #E5E7EB',
                      background: isSel ? 'rgba(91,63,168,0.03)' : '#fff',
                      transform: isSel ? 'scale(1.03)' : 'scale(1)',
                      boxShadow: isSel ? '0 2px 10px rgba(91,63,168,0.15)' : '0 1px 3px rgba(0,0,0,0.04)',
                    }}
                  >
                    {isSel && (
                      <span className="absolute -top-0.5 -right-0.5 z-10 min-w-4 h-4 rounded-full text-[6px] font-bold flex items-center justify-center text-white px-0.5"
                        style={{ background: VIOLET, boxShadow: '0 1px 4px rgba(91,63,168,0.4)' }}
                      >{qty}</span>
                    )}
                    <div className="w-full aspect-square overflow-hidden" style={{ background: '#F9FAFB' }}>
                      <img src={p.img} alt={p.nom} className="w-full h-full object-cover" loading="lazy" />
                    </div>
                    <div className="px-1.5 py-1">
                      <div className="text-[7px] font-semibold text-ink leading-tight truncate">{p.nom}</div>
                      <div className="text-[7px] font-bold" style={{ color: VIOLET }}>{p.prix}{'\u20ac'}<span className="text-[5px] font-normal text-gray-400 ml-0.5">/pièce</span></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Panier sidebar */}
          <div className="w-[34%] border-l border-gray-100 bg-white flex flex-col">
            <div className="px-2.5 py-2 border-b border-gray-50">
              <div className="text-[9px] font-bold text-ink">Panier</div>
              <div className="text-[7px] text-gray-400">{cartLines.length} article{cartLines.length > 1 ? 's' : ''}</div>
            </div>
            <div className="flex-1 px-2.5 py-2">
              {cartLines.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-6 text-center">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="1.5" strokeLinecap="round" className="mb-1.5"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" /></svg>
                  <span className="text-[7px] text-gray-300 font-medium">Votre panier est vide</span>
                  <span className="text-[5px] text-gray-200 mt-0.5">Cliquez sur un produit pour l'ajouter</span>
                </div>
              ) : (
                <div className="space-y-0.5">
                  {cartLines.map((item) => (
                    <div key={item.nom} className="flex items-center gap-1.5 py-1 animate-fade-up">
                      <span className="min-w-4 h-3.5 rounded-md text-[5.5px] font-bold flex items-center justify-center px-1" style={{ background: 'rgba(91,63,168,0.1)', color: VIOLET }}>{item.qty}</span>
                      <span className="text-[6.5px] font-semibold text-ink flex-1 min-w-0 truncate">{item.nom}</span>
                      <span className="text-[7px] font-bold text-ink">{item.total}{'\u20ac'}</span>
                      <div className="flex gap-0.5">
                        <div className="w-3 h-3 rounded text-[6px] font-bold flex items-center justify-center" style={{ background: '#F3F4F6', color: '#6B7280' }}>-</div>
                        <div className="w-3 h-3 rounded text-[6px] font-bold flex items-center justify-center text-white" style={{ background: VIOLET }}>+</div>
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2 mt-1" style={{ borderTop: '1px solid #F3F4F6' }}>
                    <span className="text-[8px] font-bold text-ink">Total</span>
                    <span className="text-[10px] font-bold" style={{ color: VIOLET }}>9,60{'\u20ac'}</span>
                  </div>
                </div>
              )}

              {/* Formulaire */}
              <div className="mt-2 space-y-1 transition-all duration-400" style={{ opacity: showForm ? 1 : 0, maxHeight: showForm ? '100px' : '0', overflow: 'hidden' }}>
                <div className="flex gap-1">
                  <div className="flex-1 rounded-lg px-1.5 py-1 text-[5.5px] text-ink bg-gray-50 border border-gray-200 truncate">Marie Dupont</div>
                  <div className="flex-1 rounded-lg px-1.5 py-1 text-[5.5px] text-ink bg-gray-50 border border-gray-200">06 12 34 56 78</div>
                </div>
                <div className="rounded-lg px-1.5 py-1 text-[5.5px] text-ink bg-gray-50 border border-gray-200 flex items-center gap-1">
                  <svg width="6" height="6" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round"><rect x="3" y="4" width="18" height="18" rx="2" /><line x1="16" y1="2" x2="16" y2="6" /><line x1="8" y1="2" x2="8" y2="6" /></svg>
                  Demain, 10h00
                </div>
              </div>

              {/* Bouton validation */}
              <div className="mt-2 transition-all duration-300" style={{ opacity: cartLines.length > 0 ? 1 : 0 }}>
                <div className="w-full py-1.5 rounded-xl text-white text-[7px] font-bold text-center transition-all duration-300"
                  style={{ background: showConfirm ? '#10B981' : VIOLET, transform: showConfirm ? 'scale(1.03)' : 'scale(1)' }}
                >{showConfirm ? 'Commande envoyée !' : 'Valider le panier'}</div>
                {cartLines.length > 0 && !showConfirm && <p className="text-[4.5px] text-center text-gray-400 mt-0.5">Paiement en boutique au moment du retrait</p>}
              </div>
            </div>
          </div>

          {/* Modale de sélection de quantité */}
          {modalProduct && (
            <div className="absolute inset-0 z-30 flex items-center justify-center" style={{ background: 'rgba(15,23,42,0.4)', backdropFilter: 'blur(2px)' }}>
              <div className="bg-white rounded-xl p-3 w-[140px] shadow-[0_12px_40px_rgba(0,0,0,0.2)] transition-all duration-300" style={{ transform: 'scale(1)', opacity: 1 }}>
                <div className="w-full aspect-[4/3] rounded-lg overflow-hidden mb-2">
                  <img src={modalProduct.img} alt={modalProduct.nom} className="w-full h-full object-cover" />
                </div>
                <h4 className="text-[8px] font-bold text-ink text-center mb-0.5">{modalProduct.nom}</h4>
                <p className="text-[7px] text-center mb-2" style={{ color: '#6B7280' }}>{modalProduct.prix}{'\u20ac'} / pièce</p>
                <p className="text-[6px] font-bold text-center mb-1.5" style={{ color: '#374151' }}>Quantité</p>
                <div className="flex items-center justify-center gap-2 mb-2">
                  <div className="w-5 h-5 rounded-lg flex items-center justify-center text-[8px] font-bold" style={{ background: '#F3F4F6', color: '#374151' }}>-</div>
                  <span className="text-[12px] font-bold w-4 text-center" style={{ color: '#1F2937' }}>{modalQty}</span>
                  <div className="w-5 h-5 rounded-lg flex items-center justify-center text-[8px] font-bold text-white" style={{ background: VIOLET }}>+</div>
                </div>
                <div className="flex gap-1.5">
                  <div className="flex-1 py-1 rounded-lg text-[6px] font-semibold text-center" style={{ background: '#F3F4F6', color: '#374151' }}>Annuler</div>
                  <div className="flex-1 py-1 rounded-lg text-[6px] font-bold text-white text-center" style={{ background: VIOLET }}>Ajouter</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Notification */}
      <div className="absolute -right-6 -top-2 z-20 transition-all duration-500"
        style={{ opacity: showNotif ? 1 : 0, transform: showNotif ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.9)' }}
      >
        <div className="bg-white rounded-xl p-2.5 shadow-[0_8px_30px_rgba(27,21,48,0.18)] border border-line w-[170px]">
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <div>
              <div className="text-[8px] font-bold text-ink leading-tight">Nouvelle commande !</div>
              <div className="text-[6px] text-slate">Click & collect</div>
            </div>
          </div>
          <div className="bg-paper-100 rounded-md p-1.5">
            <div className="text-[7px] font-bold text-ink">Marie Dupont</div>
            <div className="text-[6px] text-slate">2x Baguette, 3x Croissant, 1x Tarte</div>
            <div className="flex justify-between items-center mt-0.5">
              <span className="text-[6px] text-slate">Demain 10h00</span>
              <span className="text-[7px] font-bold" style={{ color: VIOLET }}>9,60{'\u20ac'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Phone mockup (mobile) ===== */
function PhoneShopMockup() {
  const { step, modalProduct, modalQty, cartLines, getQty, nbArticles, showForm, showConfirm, showNotif } = useShopAnimation();

  return (
    <div className="relative mx-auto w-[220px]">
      <div className="rounded-[28px] border-[3px] border-ink/10 bg-white overflow-hidden shadow-[0_16px_48px_rgba(27,21,48,0.15)]">
        {/* Barre de statut */}
        <div className="flex items-center justify-between px-4 pt-2 pb-0.5 bg-white">
          <span className="text-[8px] font-semibold text-ink/60">9:41</span>
          <div className="w-14 h-3 bg-ink rounded-full" />
          <span className="text-[8px] text-ink/40">...</span>
        </div>

        {/* Header boutique */}
        <div className="text-center py-3 px-3" style={{ background: 'linear-gradient(135deg, #3D1F6E 0%, #1F0F3D 50%, #0B0518 100%)' }}>
          <div className="mx-auto mb-1 flex items-center justify-center">
            <StackIcon size={32} />
          </div>
          <p className="text-[5px] uppercase tracking-[0.2em] font-semibold text-white/50 mb-0.5">Click and Collect</p>
          <h3 className="text-[10px] font-bold text-white">Boulangerie démo</h3>
          <p className="text-[6px] text-white/60 flex items-center justify-center gap-0.5 mt-0.5">
            <svg width="5" height="5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z" /><circle cx="12" cy="10" r="3" /></svg>
            24 rue Mercière, 69002 Lyon
          </p>
        </div>

        {/* Barre d'horaires */}
        <div className="mx-1.5 -mt-1.5 relative z-10 rounded-lg bg-white p-1.5 mb-1.5" style={{ boxShadow: '0 1px 6px rgba(0,0,0,0.06)' }}>
          <div className="flex gap-0 overflow-x-hidden">
            {jours.slice(0, 5).map((j) => (
              <div key={j.label} className="flex flex-col items-center flex-1 py-0.5 rounded" style={{ background: j.today ? 'rgba(91,63,168,0.06)' : 'transparent' }}>
                <span className="text-[4.5px] font-bold uppercase" style={{ color: j.today ? VIOLET : '#9CA3AF' }}>{j.label}</span>
                <span className="text-[7px] font-bold" style={{ color: j.today ? VIOLET : j.creneaux ? '#1F2937' : '#D1D5DB' }}>{j.num}</span>
                {j.creneaux ? (
                  <span className="text-[3.5px] font-medium text-gray-400">{j.creneaux[0]}</span>
                ) : (
                  <span className="text-[3.5px] font-semibold" style={{ color: '#EF4444' }}>Fermé</span>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Onglets catégories */}
        <div className="flex gap-1 px-2 pb-1">
          {['Tout', 'Pains', 'Viennois.', 'Pâtiss.'].map((c, i) => (
            <div key={c} className="px-1.5 py-0.5 rounded-full text-[5.5px] font-semibold"
              style={i === 0 ? { background: VIOLET, color: '#fff' } : { background: '#fff', color: '#6B7280', border: '1px solid #E5E7EB' }}
            >{c}</div>
          ))}
        </div>

        {/* Grille produits */}
        <div className="px-2 pb-2 relative">
          <div className="grid grid-cols-3 gap-1.5">
            {produits.slice(0, 6).map((p) => {
              const qty = getQty(p.id);
              const isSel = qty > 0;
              return (
                <div key={p.id} className="relative rounded-xl overflow-hidden transition-all duration-300 flex flex-col"
                  style={{
                    border: isSel ? `1.5px solid ${VIOLET}` : '1.5px solid #E5E7EB',
                    background: isSel ? 'rgba(91,63,168,0.03)' : '#fff',
                    transform: isSel ? 'scale(1.04)' : 'scale(1)',
                  }}
                >
                  {isSel && <span className="absolute -top-0.5 -right-0.5 z-10 min-w-3 h-3 rounded-full text-[5px] font-bold flex items-center justify-center text-white" style={{ background: VIOLET }}>{qty}</span>}
                  <div className="w-full aspect-[4/3] overflow-hidden" style={{ background: '#F9FAFB' }}>
                    <img src={p.img} alt={p.nom} className="w-full h-full object-cover" loading="lazy" />
                  </div>
                  <div className="px-1 py-0.5">
                    <div className="text-[6px] font-semibold text-ink leading-tight truncate">{p.nom}</div>
                    <div className="text-[6px] font-bold" style={{ color: VIOLET }}>{p.prix}{'\u20ac'}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Modale quantité (mobile) */}
          {modalProduct && (
            <div className="absolute inset-0 z-30 flex items-center justify-center rounded-lg" style={{ background: 'rgba(15,23,42,0.4)' }}>
              <div className="bg-white rounded-xl p-2.5 w-[120px] shadow-[0_8px_30px_rgba(0,0,0,0.2)]">
                <h4 className="text-[7px] font-bold text-ink text-center mb-0.5">{modalProduct.nom}</h4>
                <p className="text-[6px] text-center mb-1.5" style={{ color: '#6B7280' }}>{modalProduct.prix}{'\u20ac'} / pièce</p>
                <div className="flex items-center justify-center gap-2 mb-1.5">
                  <div className="w-4 h-4 rounded flex items-center justify-center text-[7px] font-bold" style={{ background: '#F3F4F6' }}>-</div>
                  <span className="text-[10px] font-bold" style={{ color: '#1F2937' }}>{modalQty}</span>
                  <div className="w-4 h-4 rounded flex items-center justify-center text-[7px] font-bold text-white" style={{ background: VIOLET }}>+</div>
                </div>
                <div className="w-full py-1 rounded-lg text-[5.5px] font-bold text-white text-center" style={{ background: VIOLET }}>Ajouter</div>
              </div>
            </div>
          )}
        </div>

        {/* Barre panier flottante */}
        <div className="px-2 pb-3">
          <div className="rounded-xl transition-all duration-300 overflow-hidden"
            style={{ background: showConfirm ? '#10B981' : VIOLET, opacity: cartLines.length > 0 ? 1 : 0.3, transform: showConfirm ? 'scale(1.02)' : 'scale(1)' }}
          >
            <div className="flex items-center justify-between px-3 py-2">
              <div className="flex items-center gap-1.5">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2" strokeLinecap="round"><circle cx="9" cy="21" r="1" /><circle cx="20" cy="21" r="1" /><path d="M1 1h4l2.68 13.39a2 2 0 002 1.61h9.72a2 2 0 002-1.61L23 6H6" /></svg>
                <span className="text-[8px] font-bold text-white">
                  {showConfirm ? 'Commande envoyée !' : cartLines.length > 0 ? `${nbArticles} articles` : 'Panier vide'}
                </span>
              </div>
              {cartLines.length > 0 && !showConfirm && <span className="text-[9px] font-bold text-white">9,60{'\u20ac'}</span>}
            </div>
            {showForm && !showConfirm && (
              <div className="px-3 pb-2 flex gap-1">
                <div className="flex-1 rounded px-1.5 py-0.5 text-[6px] text-white/80 bg-white/15">Marie Dupont</div>
                <div className="flex-1 rounded px-1.5 py-0.5 text-[6px] text-white/80 bg-white/15">Demain 10h</div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Notification */}
      <div className="absolute -right-3 top-6 z-20 transition-all duration-500"
        style={{ opacity: showNotif ? 1 : 0, transform: showNotif ? 'translateY(0) scale(1)' : 'translateY(12px) scale(0.9)' }}
      >
        <div className="bg-white rounded-xl p-2 shadow-[0_8px_24px_rgba(27,21,48,0.18)] border border-line w-[150px]">
          <div className="flex items-center gap-1.5 mb-1">
            <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
              <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
            </div>
            <div>
              <div className="text-[7px] font-bold text-ink leading-tight">Nouvelle commande !</div>
              <div className="text-[5px] text-slate">Click & collect</div>
            </div>
          </div>
          <div className="bg-paper-100 rounded p-1.5">
            <div className="text-[6px] font-bold text-ink">Marie Dupont</div>
            <div className="text-[5px] text-slate">Demain 10h · 9,60{'\u20ac'}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ===== Avantages ===== */
const avantages = [
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 2L3 14h9l-1 8 10-12h-9l1-8z" />
      </svg>
    ),
    title: 'Prête en 2 clics',
    body: 'Activez la commande en ligne et vos produits sont automatiquement affichés.',
    accent: '#7C3AED',
    bg: '#F3EEFF',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
        <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
      </svg>
    ),
    title: 'Un lien unique',
    body: 'Partagez par SMS, WhatsApp, Instagram ou QR code en vitrine.',
    accent: '#2563EB',
    bg: '#EFF6FF',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
      </svg>
    ),
    title: 'Dans votre app',
    body: 'Chaque commande en ligne arrive avec celles du comptoir.',
    accent: '#10B981',
    bg: '#ECFDF5',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
      </svg>
    ),
    title: 'Délai configurable',
    body: 'Définissez un délai minimum pour garder le contrôle.',
    accent: '#F59E0B',
    bg: '#FFFBEB',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <rect x="3" y="3" width="18" height="18" rx="2" /><path d="M3 9h18" /><path d="M9 21V9" />
      </svg>
    ),
    title: 'Horaires et fermetures',
    body: 'Ouverture, fermetures exceptionnelles et créneaux respectés.',
    accent: '#EC4899',
    bg: '#FDF2F8',
  },
  {
    icon: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
    title: 'À votre image',
    body: "Logo, couleurs, message d'accueil : tout est personnalisable.",
    accent: '#7C3AED',
    bg: '#F3EEFF',
  },
];

export function OnlineShop() {
  return (
    <section className="relative lg:min-h-screen flex flex-col justify-center px-6 md:px-14 py-16 lg:py-10 overflow-hidden">
      {/* Fond */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{ background: 'linear-gradient(160deg, rgba(91,63,168,0.02) 0%, rgba(124,58,237,0.06) 40%, rgba(236,72,153,0.03) 100%)' }}
        aria-hidden="true"
      />

      <div className="relative z-[1] max-w-[1400px] mx-auto w-full">
        {/* En-tête */}
        <FadeIn className="text-center mb-8 lg:mb-10">
          <span className="inline-block text-xs uppercase tracking-widest text-violet-600 font-bold mb-5 px-4 py-1.5 rounded-full" style={{ background: 'rgba(91, 63, 168, 0.15)' }}>
            Click and Collect
          </span>
          <h2 className="text-[28px] md:text-[42px] font-bold tracking-tighter leading-[1.05] text-ink mb-3 text-balance">
            Votre boutique en ligne,{' '}
            <span className="text-violet-500">en deux clics.</span>
          </h2>
          <p className="text-sm md:text-base text-slate max-w-[540px] mx-auto">
            Vos clients passent commande en click & collect depuis leur téléphone, vous recevez tout directement dans votre application.
          </p>
        </FadeIn>

        {/* Desktop : animation centrée */}
        <FadeIn className="hidden lg:flex justify-center mb-10" delay={60}>
          <div className="max-w-[900px] w-full">
            <BrowserMockup />
          </div>
        </FadeIn>

        {/* Mobile : mockup téléphone */}
        <FadeIn className="lg:hidden mb-8 flex justify-center" delay={60}>
          <PhoneShopMockup />
        </FadeIn>

        {/* Avantages en dessous */}
        <FadeIn delay={150}>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-5 mb-10 max-w-[900px] mx-auto">
            {avantages.map((a, i) => (
              <div key={i} className="flex items-start gap-3">
                <div
                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                  style={{ background: `${a.accent}15`, color: a.accent }}
                >
                  {a.icon}
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-bold text-ink tracking-tight leading-tight">{a.title}</h3>
                  <p className="text-xs text-slate leading-[1.45] mt-0.5">{a.body}</p>
                </div>
              </div>
            ))}
          </div>
        </FadeIn>

        {/* CTA */}
        <FadeIn delay={200}>
          <div className="flex justify-center">
            <Button href="https://app.mon-carnet-de-commandes.fr" size="lg">
              Essayer gratuitement
            </Button>
          </div>
        </FadeIn>
      </div>
    </section>
  );
}
