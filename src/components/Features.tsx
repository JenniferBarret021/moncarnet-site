import type { ReactNode } from 'react';
import { FadeIn } from './ui/FadeIn';

function PreviewCard() {
  return (
    <div className="bg-white rounded-xl p-4 border border-line w-full max-w-[240px] font-sans">
      <div className="flex justify-between items-center mb-2.5">
        <div className="text-xs font-bold text-ink">Commande #312</div>
        <div className="text-[9px] font-semibold text-violet-600 bg-violet-100 py-0.5 px-2 rounded-full">
          Enregistrée
        </div>
      </div>
      {['Baguette tradition × 2', 'Croissant × 4'].map((l, i) => (
        <div
          key={l}
          className={[
            'text-[11px] text-ink py-1.5',
            i ? 'border-t border-dashed border-line' : '',
          ].join(' ')}
        >
          {l}
        </div>
      ))}
      <div className="flex justify-between mt-2.5 pt-2.5 border-t border-line">
        <div className="text-[11px] text-slate">Total</div>
        <div className="text-[13px] font-bold text-violet-500">9,80 €</div>
      </div>
    </div>
  );
}

function PrepView() {
  const items = [
    { item: 'Baguette tradition', n: 2, done: true },
    { item: 'Croissant', n: 4, done: true },
    { item: 'Pain au chocolat', n: 1, done: false },
  ];
  const total = items.length;
  const doneCount = items.filter((p) => p.done).length;
  return (
    <div className="bg-white rounded-xl p-3.5 border border-line w-full max-w-[240px] font-sans">
      <div className="flex justify-between items-center mb-1">
        <div className="text-[11px] font-bold text-ink tracking-tight">
          Commande #312
        </div>
        <div className="text-[9px] font-semibold py-0.5 px-2 rounded-full" style={{ background: '#F3EEFF', color: '#6C3AED' }}>
          En préparation
        </div>
      </div>
      <div className="text-[9px] text-slate mb-2">Chloé Lambert · Retrait à 12h00</div>
      {/* Barre de progression */}
      <div className="h-1.5 rounded-full bg-paper-100 mb-2.5 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${(doneCount / total) * 100}%`, background: '#6C3AED' }} />
      </div>
      {items.map((p, i) => (
        <div key={i} className="flex items-center gap-2 py-1.5">
          <div
            className={[
              'w-4 h-4 rounded-full flex items-center justify-center text-white text-[8px] font-bold',
              p.done ? 'bg-emerald-500' : 'border-[1.5px] border-line',
            ].join(' ')}
            style={p.done ? { background: '#10B981' } : {}}
            aria-hidden="true"
          >
            {p.done ? '✓' : ''}
          </div>
          <div
            className={[
              'flex-1 text-[11px]',
              p.done ? 'text-slate line-through' : 'text-ink',
            ].join(' ')}
          >
            {p.item}
          </div>
          <div className={['text-[11px] font-bold', p.done ? 'text-slate' : 'text-violet-500'].join(' ')}>
            ×{p.n}
          </div>
        </div>
      ))}
    </div>
  );
}

function PickupCard() {
  const rows: { h: string; n: string; done?: boolean; next?: boolean }[] = [
    { h: '14:00', n: 'Chloé L.', done: true },
    { h: '15:30', n: 'Marc D.', done: true },
    { h: '16:30', n: 'Jennifer B.', next: true },
    { h: '17:00', n: 'Léa M.' },
  ];
  return (
    <div className="bg-white rounded-xl p-3.5 border border-line w-full max-w-[240px] font-sans">
      <div className="text-[11px] font-bold text-ink mb-2.5 tracking-tight">
        Retraits du jour
      </div>
      {rows.map((p, i) => (
        <div
          key={i}
          className={[
            'flex items-center gap-2.5 py-1.5',
            i ? 'border-t border-dashed border-line' : '',
          ].join(' ')}
        >
          <div
            className={[
              'text-[10px] font-bold w-8',
              p.next ? 'text-violet-500' : p.done ? 'text-slate' : 'text-ink',
            ].join(' ')}
          >
            {p.h}
          </div>
          <div
            className={[
              'flex-1 text-[11px]',
              p.done ? 'text-slate line-through' : 'text-ink',
            ].join(' ')}
          >
            {p.n}
          </div>
          {p.next && (
            <div className="text-[8px] font-bold py-0.5 px-2 rounded-full bg-violet-50 text-violet-500">
              SUIVANT
            </div>
          )}
          {p.done && <div className="text-[9px] text-slate">✓</div>}
        </div>
      ))}
    </div>
  );
}

type Item = {
  tag: string;
  title: ReactNode;
  body: string;
  illu: ReactNode;
};

const items: Item[] = [
  {
    tag: 'Prise de commande',
    title: 'En quelques clics, c’est enregistré.',
    body:
      'Vos produits sont préchargés. Sélectionnez les articles, ajoutez le client, la date de retrait • terminé. Sur tablette ou smartphone.',
    illu: <PreviewCard />,
  },
  {
    tag: 'Préparation',
    title: (
      <span>
        Une vue <span className="text-violet-500">simplifiée</span> pour ne rien oublier.
      </span>
    ),
    body:
      'Toutes les commandes du jour, regroupées par heure de retrait, par produit ou par client. Cochez au fur et à mesure que ça avance.',
    illu: <PrepView />,
  },
  {
    tag: 'Récupération de commande',
    title: 'Le retrait, fluide et organisé.',
    body:
      "Vos clients arrivent, vous savez exactement quoi leur remettre. Filtrage par heure de retrait, validation en un geste, notifications envoyées à l'avance.",
    illu: <PickupCard />,
  },
];

export function Features() {
  return (
    <section id="features" className="py-20 md:py-24 px-6 md:px-14">
      <FadeIn className="max-w-[760px] mx-auto mb-12 md:mb-14 text-center">
        <div className="text-xs uppercase tracking-widest text-violet-500 font-bold mb-3">
          Fonctionnalités
        </div>
        <h2 className="text-[34px] md:text-[44px] font-bold tracking-tighter leading-[1.05] text-ink text-balance">
          Tout votre carnet, organisé pour vous.
        </h2>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1280px] mx-auto">
        {items.map((f, i) => (
          <FadeIn key={i} delay={i * 80}>
            <article className="bg-white border border-line rounded-2xl p-7 flex flex-col gap-5 h-full transition-all duration-300 ease-out-soft hover:-translate-y-1 hover:shadow-[0_12px_32px_rgba(27,21,48,0.08)]">
              <div className="h-[220px] rounded-xl bg-paper-100 flex items-center justify-center p-4 border border-line">
                {f.illu}
              </div>
              <div>
                <div className="text-[11px] font-bold text-violet-500 tracking-wide uppercase mb-2">
                  {f.tag}
                </div>
                <h3 className="text-[22px] font-bold tracking-tight text-ink mb-2.5 leading-tight">
                  {f.title}
                </h3>
                <p className="text-sm text-slate leading-[1.55]">{f.body}</p>
              </div>
            </article>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
