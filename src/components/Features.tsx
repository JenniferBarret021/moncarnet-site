import { type ReactNode, useEffect, useRef, useState } from 'react';


/**
 * Hook that triggers a looping animation cycle.
 * Returns a `step` counter that resets to 0 every `duration` ms,
 * incrementing by 1 every `tick` ms.
 */
function useLoop(duration: number, tick: number, frozen = false) {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(-1);
  const maxStep = Math.floor(duration / tick) - 1;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => setVisible(e.isIntersecting),
      { threshold: 0.3 },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (frozen) {
      setStep(maxStep);
      return;
    }
    if (!visible) return;
    setStep(0);
    let s = 0;
    const id = setInterval(() => {
      s++;
      if (s * tick >= duration) {
        s = 0;
      }
      setStep(s);
    }, tick);
    return () => clearInterval(id);
  }, [visible, frozen, duration, tick, maxStep]);

  return { ref, step };
}

/* ===== Illustration 1 : Ajout de produits ===== */
function CatalogIllu({ frozen = false }: { frozen?: boolean }) {
  const { ref, step } = useLoop(5000, 500, frozen);

  const products = [
    { name: 'Croissant', price: '1,30', cat: 'Viennoiserie' },
    { name: 'Baguette', price: '1,10', cat: 'Pain' },
    { name: 'Tarte citron', price: '2,50', cat: 'Pâtisserie' },
  ];

  // step 0: empty state, step 1: row 1 slides in, step 3: row 2, step 5: row 3
  // step 7: badge "3 produits", step 8-9: pause
  const visibleRows = step >= 5 ? 3 : step >= 3 ? 2 : step >= 1 ? 1 : 0;
  const showBadge = step >= 7;

  return (
    <div ref={ref} className="w-full max-w-[260px] font-sans select-none">
      <div className="bg-white rounded-xl p-3.5 border border-line">
        <div className="flex justify-between items-center mb-3">
          <div className="text-[11px] font-bold text-ink tracking-tight">Mon catalogue</div>
          <div
            className="text-[9px] font-semibold py-0.5 px-2 rounded-full transition-all duration-300"
            style={{
              background: showBadge ? '#F3EEFF' : '#F8F7F4',
              color: showBadge ? '#5B3FA8' : '#C9C4D9',
              transform: showBadge ? 'scale(1.05)' : 'scale(1)',
            }}
          >
            {visibleRows} produit{visibleRows > 1 ? 's' : ''}
          </div>
        </div>

        <div className="space-y-1.5">
          {products.map((p, i) => {
            const visible = i < visibleRows;
            return (
              <div
                key={p.name}
                className="flex items-center gap-2 py-2 px-2 rounded-lg border border-line transition-all duration-400"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateX(0)' : 'translateX(-12px)',
                }}
              >
                <div className="w-7 h-7 rounded-lg bg-violet-50 flex items-center justify-center text-[11px]">
                  {i === 0 ? '\uD83E\uDD50' : i === 1 ? '\uD83E\uDD56' : '\uD83C\uDF4B'}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-ink truncate">{p.name}</div>
                  <div className="text-[8px] text-slate">{p.cat}</div>
                </div>
                <div className="text-[11px] font-bold text-violet-500">{p.price} {'€'}</div>
              </div>
            );
          })}
        </div>

        <div
          className="mt-3 flex items-center justify-center gap-1.5 border border-dashed border-violet-300 text-violet-500 text-[9px] font-bold py-2 rounded-lg transition-all duration-300"
          style={{
            opacity: visibleRows >= 3 ? 0.5 : 1,
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            <line x1="12" y1="5" x2="12" y2="19" />
            <line x1="5" y1="12" x2="19" y2="12" />
          </svg>
          Ajouter un produit
        </div>
      </div>
    </div>
  );
}

/* ===== Illustration 2 : Prise de commande ===== */
function OrderIllu({ frozen = false }: { frozen?: boolean }) {
  // cycle de 4s, tick toutes les 400ms => steps 0..9
  const { ref, step } = useLoop(4000, 400, frozen);

  const products = [
    { name: 'Croissant', price: '1,30 €' },
    { name: 'Pain au chocolat', price: '1,40 €' },
    { name: 'Tarte citron', price: '2,50 €' },
    { name: 'Brioche', price: '4,50 €' },
  ];

  // step 0-1: grille apparait, step 2: select produit 1, step 3: select produit 2
  // step 4-5: panier, step 6: total pop, step 7: bouton, step 8-9: pause
  const sel1 = step >= 2;
  const sel2 = step >= 3;
  const showCart = step >= 4;
  const showTotal = step >= 6;
  const showBtn = step >= 7;

  return (
    <div ref={ref} className="w-full max-w-[260px] font-sans select-none">
      <div className="grid grid-cols-2 gap-1.5 mb-2.5">
        {products.map((p, i) => {
          const selected = (i === 1 && sel1) || (i === 2 && sel2);
          return (
            <div
              key={p.name}
              className={[
                'relative rounded-lg py-2 px-2 flex flex-col items-center border-[1.5px] transition-all duration-300',
                selected ? 'bg-violet-50 border-violet-500 scale-[1.03]' : 'bg-white border-line',
              ].join(' ')}
            >
              <div className="text-[10px] font-bold text-ink text-center">{p.name}</div>
              <div className="text-[8.5px] text-slate">{p.price}</div>
              {selected && (
                <div className="absolute -top-1.5 -right-1.5 bg-violet-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-[8px] font-bold transition-transform duration-300 scale-100">
                  1
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div
        className="bg-white rounded-xl p-3 border border-line transition-all duration-400"
        style={{ opacity: showCart ? 1 : 0, transform: showCart ? 'translateY(0)' : 'translateY(8px)' }}
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-[10px] font-bold text-ink">Panier</span>
          <span className="text-[9px] text-slate">2 articles</span>
        </div>
        {[
          { name: 'Pain au chocolat', qty: 1, total: '1,40 €' },
          { name: 'Tarte citron', qty: 1, total: '2,50 €' },
        ].map((it, i) => (
          <div
            key={it.name}
            className={['flex justify-between items-center py-1 text-[10px]', i ? 'border-t border-dashed border-line' : ''].join(' ')}
          >
            <span className="text-ink">{it.name} <span className="text-slate">{'×'}{it.qty}</span></span>
            <span className="font-bold text-ink">{it.total}</span>
          </div>
        ))}
        <div className="flex justify-between items-center mt-2 pt-2 border-t border-line">
          <span className="text-[10px] text-slate">Total</span>
          <span
            className="text-[13px] font-bold text-violet-500 transition-all duration-300"
            style={{ opacity: showTotal ? 1 : 0, transform: showTotal ? 'scale(1)' : 'scale(0.7)' }}
          >
            3,90 {'€'}
          </span>
        </div>
        <div
          className="mt-2 bg-violet-500 text-white text-[9px] font-bold py-1.5 rounded-lg text-center transition-all duration-300"
          style={{ opacity: showBtn ? 1 : 0, transform: showBtn ? 'translateY(0)' : 'translateY(6px)' }}
        >
          Enregistrer la commande
        </div>
      </div>
    </div>
  );
}

/* ===== Illustration 3 : Préparation ===== */
function PrepIllu({ frozen = false }: { frozen?: boolean }) {
  // cycle de 5s, tick toutes les 500ms => steps 0..9
  const { ref, step } = useLoop(5000, 500, frozen);

  const items = [
    { item: 'Baguette tradition', n: 2 },
    { item: 'Croissant', n: 4 },
    { item: 'Pain au chocolat', n: 1 },
  ];

  // step 0: card, step 1: bar starts, step 2: check 1, step 4: check 2, step 6: check 3, step 7-9: pause
  const checks = [step >= 2, step >= 4, step >= 6];
  const doneCount = checks.filter(Boolean).length;
  const barPct = (doneCount / items.length) * 100;

  return (
    <div ref={ref} className="w-full max-w-[260px] font-sans select-none">
      <div className="bg-white rounded-xl p-3.5 border border-line">
        <div className="flex justify-between items-center mb-1">
          <div className="text-[11px] font-bold text-ink tracking-tight">Commande #312</div>
          <div
            className="text-[9px] font-semibold py-0.5 px-2 rounded-full"
            style={{ background: '#F3EEFF', color: '#5B3FA8' }}
          >
            {doneCount === 3 ? 'Prête' : 'En préparation'}
          </div>
        </div>
        <div className="text-[9px] text-slate mb-2">{'Chloé Lambert · Retrait à 12h00'}</div>

        <div className="h-1.5 rounded-full bg-paper-100 mb-3 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500 ease-out"
            style={{ width: `${barPct}%`, background: doneCount === 3 ? '#10B981' : '#5B3FA8' }}
          />
        </div>

        {items.map((p, i) => {
          const done = checks[i];
          return (
            <div key={i} className="flex items-center gap-2 py-1.5">
              <div
                className="w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0 transition-all duration-300"
                style={done
                  ? { background: '#10B981', color: 'white', transform: 'scale(1)' }
                  : { border: '1.5px solid #E8E2D8', transform: 'scale(1)' }
                }
              >
                {done ? '✓' : ''}
              </div>
              <div
                className={[
                  'flex-1 text-[11px] transition-all duration-300',
                  done ? 'text-slate line-through' : 'text-ink',
                ].join(' ')}
              >
                {p.item}
              </div>
              <div className={['text-[11px] font-bold transition-colors duration-300', done ? 'text-slate' : 'text-violet-500'].join(' ')}>
                {'×'}{p.n}
              </div>
            </div>
          );
        })}

        <div
          className="mt-2 flex items-center gap-1.5 text-[9px] font-semibold transition-all duration-300"
          style={{
            color: doneCount === 3 ? '#10B981' : '#5B3FA8',
            opacity: step >= 2 ? 1 : 0,
            transform: step >= 2 ? 'translateX(0)' : 'translateX(-8px)',
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
            {doneCount === 3
              ? <polyline points="20 6 9 17 4 12" />
              : <polyline points="9 18 15 12 9 6" />
            }
          </svg>
          {doneCount === 3 ? 'Commande prête !' : `${doneCount}/3 articles cochés`}
        </div>
      </div>
    </div>
  );
}

/* ===== Illustration 4 : Récupération ===== */
function PickupIllu({ frozen = false }: { frozen?: boolean }) {
  // cycle de 5s, tick toutes les 500ms => steps 0..9
  const { ref, step } = useLoop(5000, 500, frozen);

  const rows = [
    { h: '14:00', name: 'Chloé L.' },
    { h: '15:30', name: 'Marc D.' },
    { h: '16:30', name: 'Jennifer B.' },
    { h: '17:00', name: 'Léa M.' },
  ];

  // step 0-1: rows appear, step 2: row 0 done, step 3: row 1 done
  // step 4-5: row 2 = next + pulse, step 6: row 2 done, step 7-9: pause
  const doneUpTo = step >= 6 ? 2 : step >= 3 ? 1 : step >= 2 ? 0 : -1;
  const nextIdx = doneUpTo + 1;

  return (
    <div ref={ref} className="w-full max-w-[260px] font-sans select-none">
      <div className="bg-white rounded-xl p-3.5 border border-line">
        <div className="flex justify-between items-center mb-3">
          <div className="text-[11px] font-bold text-ink tracking-tight">Retraits du jour</div>
          <div className="text-[9px] text-slate font-medium">{Math.min(doneUpTo + 1, 4)}/4 récupérées</div>
        </div>

        {rows.map((r, i) => {
          const done = i <= doneUpTo;
          const isNext = i === nextIdx && i < 4;
          return (
            <div
              key={i}
              className={[
                'flex items-center gap-2.5 py-2 transition-all duration-300',
                i ? 'border-t border-dashed border-line' : '',
              ].join(' ')}
              style={{ opacity: step >= 0 ? 1 : 0 }}
            >
              <div
                className="w-5 h-5 rounded-full flex items-center justify-center text-[8px] font-bold shrink-0 transition-all duration-300"
                style={
                  done
                    ? { background: '#ECFDF5', color: '#10B981' }
                    : isNext
                      ? { background: '#F3EEFF', color: '#5B3FA8' }
                      : { background: '#F8F7F4', color: '#C9C4D9' }
                }
              >
                {done ? '✓' : isNext ? '●' : '―'}
              </div>

              <div
                className={[
                  'text-[10px] font-bold w-8 transition-colors duration-300',
                  isNext ? 'text-violet-500' : done ? 'text-slate' : 'text-ink',
                ].join(' ')}
              >
                {r.h}
              </div>

              <div
                className={[
                  'flex-1 text-[11px] transition-all duration-300',
                  done ? 'text-slate line-through' : 'text-ink',
                ].join(' ')}
              >
                {r.name}
              </div>

              {isNext && (
                <div className="text-[8px] font-bold py-0.5 px-2 rounded-full bg-violet-50 text-violet-500 feat-anim-pulse">
                  SUIVANT
                </div>
              )}
              {done && (
                <div className="text-[9px] font-bold text-emerald-500">
                  Récupérée
                </div>
              )}
            </div>
          );
        })}

        <div
          className="mt-2.5 flex items-center justify-center gap-1.5 bg-violet-50 text-violet-500 text-[9px] font-bold py-2 rounded-lg transition-all duration-300"
          style={{
            opacity: nextIdx < 4 ? 1 : 0,
          }}
        >
          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="20 6 9 17 4 12" />
          </svg>
          {nextIdx < 4 ? `Valider le retrait de ${rows[nextIdx].name}` : 'Terminé !'}
        </div>
      </div>
    </div>
  );
}

type FeatureItem = {
  step: string;
  tag: string;
  title: ReactNode;
  body: string;
  illu: (frozen: boolean) => ReactNode;
};

const featureItems: FeatureItem[] = [
  {
    step: '01',
    tag: 'Ajoutez vos produits',
    title: "Votre catalogue, en quelques minutes.",
    body: "Créez vos produits avec nom, prix et catégorie. Votre catalogue est prêt, accessible depuis n'importe quel appareil.",
    illu: (frozen) => <CatalogIllu frozen={frozen} />,
  },
  {
    step: '02',
    tag: 'Prenez vos commandes',
    title: "En quelques clics, c'est enregistré.",
    body: "Sélectionnez les articles, ajoutez le client et la date de retrait. Au comptoir, par téléphone, sur tablette ou smartphone.",
    illu: (frozen) => <OrderIllu frozen={frozen} />,
  },
  {
    step: '03',
    tag: 'Préparez-les sereinement',
    title: (
      <span>
        Une vue <span className="text-violet-500">simplifiée</span> pour ne rien oublier.
      </span>
    ),
    body: "Toutes les commandes du jour, regroupées par heure de retrait, par produit ou par client. Cochez au fur et à mesure.",
    illu: (frozen) => <PrepIllu frozen={frozen} />,
  },
  {
    step: '04',
    tag: 'Gérez les retraits',
    title: "Le retrait, fluide et organisé.",
    body: "Vos clients arrivent, vous savez exactement quoi leur remettre. Filtrage par heure, validation en un geste.",
    illu: (frozen) => <PickupIllu frozen={frozen} />,
  },
];

function useScrollProgress(ref: React.RefObject<HTMLElement | null>) {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const total = el.offsetHeight - window.innerHeight;
      if (total <= 0) { setProgress(1); return; }
      const scrolled = -rect.top;
      setProgress(Math.max(0, Math.min(1, scrolled / total)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, [ref]);
  return progress;
}

export function Features() {
  const sectionRef = useRef<HTMLElement>(null);
  const progress = useScrollProgress(sectionRef);

  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener('resize', check);
    return () => window.removeEventListener('resize', check);
  }, []);

  const cardCount = featureItems.length;

  // Mobile: one card at a time, each card gets an equal slice of progress
  const mobileActiveIndex = isMobile
    ? Math.min(Math.floor(progress * cardCount), cardCount - 1)
    : 0;

  return (
    <section
      ref={sectionRef}
      id="features"
      className="relative px-6 md:px-14"
      style={{ height: `${(cardCount + 1) * 100}vh` }}
    >
      <div className="sticky top-0 min-h-screen flex flex-col justify-center py-12 md:py-16">
        <div className="max-w-[760px] mx-auto mb-8 md:mb-12 text-center">
          <span className="inline-block text-xs uppercase tracking-widest text-violet-500 font-bold mb-3 px-4 py-1.5 rounded-full" style={{ background: 'rgba(91, 63, 168, 0.15)' }}>
            Comment ça marche
          </span>
          <h2 className="text-[34px] md:text-[44px] font-bold tracking-tighter leading-[1.05] text-ink text-balance">
            Prêt en 5 minutes, utile dès aujourd'hui.
          </h2>
        </div>

        {/* Desktop: grid 4 cols */}
        <div className="hidden md:grid md:grid-cols-2 lg:grid-cols-4 gap-5 max-w-[1400px] mx-auto">
          {featureItems.map((f, i) => {
            let cardProgress: number;
            if (i === 0) {
              cardProgress = 1;
            } else {
              const cardStart = 0.02 + ((i - 1) / (cardCount - 1)) * 0.45;
              const cardEnd = cardStart + 0.12;
              cardProgress = Math.max(0, Math.min(1, (progress - cardStart) / (cardEnd - cardStart)));
            }

            const isNextCardVisible = i < cardCount - 1 && (() => {
              const nextStart = 0.02 + (i / (cardCount - 1)) * 0.45;
              return progress >= nextStart + 0.06;
            })();
            const frozen = isNextCardVisible;

            return (
              <article
                key={i}
                className="bg-white border border-line rounded-2xl p-7 flex flex-col gap-5 h-full hover:shadow-[0_12px_32px_rgba(27,21,48,0.08)]"
                style={i === 0 ? {} : {
                  opacity: cardProgress,
                  transform: `translateY(${(1 - cardProgress) * 16}px)`,
                  transition: 'none',
                }}
              >
                <div className="h-[280px] rounded-xl bg-paper-100 flex items-center justify-center p-4 border border-line overflow-hidden">
                  {f.illu(frozen)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[13px] font-bold text-violet-500 tracking-wider">{f.step}</span>
                    <div className="h-px flex-1 bg-line relative">
                      <div
                        className="absolute left-0 -top-0.5 h-1 bg-violet-500 rounded-full"
                        style={i === 0 ? { width: 32 } : {
                          width: `${cardProgress * 100}%`,
                          maxWidth: 32,
                          transition: 'none',
                        }}
                      />
                    </div>
                  </div>
                  <div className="text-[11px] font-bold text-violet-500 tracking-wide uppercase mb-2">
                    {f.tag}
                  </div>
                  <h3 className="text-[22px] font-bold tracking-tight text-ink mb-2.5 leading-tight">
                    {f.title}
                  </h3>
                  <p className="text-sm text-slate leading-[1.55]">{f.body}</p>
                </div>
              </article>
            );
          })}
        </div>

        {/* Mobile: one card at a time */}
        <div className="md:hidden max-w-[400px] mx-auto w-full relative" style={{ minHeight: 420 }}>
          {featureItems.map((f, i) => {
            const isActive = mobileActiveIndex === i;
            const isPast = i < mobileActiveIndex;
            const isFuture = i > mobileActiveIndex;
            const frozen = isPast;

            return (
              <article
                key={i}
                className="bg-white border border-line rounded-2xl p-6 flex flex-col gap-4 absolute inset-0"
                style={{
                  opacity: isActive ? 1 : 0,
                  transform: isFuture ? 'translateY(20px)' : isPast ? 'translateY(-20px)' : 'translateY(0)',
                  transition: 'opacity 0.3s ease, transform 0.3s ease',
                  pointerEvents: isActive ? 'auto' : 'none',
                }}
              >
                <div className="h-[220px] rounded-xl bg-paper-100 flex items-center justify-center p-4 border border-line overflow-hidden">
                  {f.illu(frozen)}
                </div>
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[13px] font-bold text-violet-500 tracking-wider">{f.step}</span>
                    <div className="h-px flex-1 bg-line relative">
                      <div className="absolute left-0 -top-0.5 h-1 bg-violet-500 rounded-full" style={{ width: 32 }} />
                    </div>
                  </div>
                  <div className="text-[11px] font-bold text-violet-500 tracking-wide uppercase mb-2">
                    {f.tag}
                  </div>
                  <h3 className="text-[20px] font-bold tracking-tight text-ink mb-2 leading-tight">
                    {f.title}
                  </h3>
                  <p className="text-sm text-slate leading-[1.55]">{f.body}</p>
                </div>
              </article>
            );
          })}
        </div>

        {/* Scroll progress dots */}
        <div className="flex justify-center gap-2 mt-8">
          {featureItems.map((_, i) => {
            const active = isMobile
              ? i <= mobileActiveIndex
              : i === 0 || progress >= 0.02 + ((i - 1) / (cardCount - 1)) * 0.45;
            return (
              <div
                key={i}
                className="w-2 h-2 rounded-full transition-all duration-300"
                style={{ background: active ? '#5B3FA8' : '#E8E2D8', transform: active ? 'scale(1.2)' : 'scale(1)' }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
