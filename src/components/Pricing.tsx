import { FadeIn } from './ui/FadeIn';

type Plan = {
  name: string;
  price: string;
  desc: string;
  features: string[];
  cta: string;
  highlight?: boolean;
};

const features = [
  'Commandes illimit\u00e9es',
  'Catalogue produit complet',
  'Vue pr\u00e9paration',
  'Gestion des retraits',
  'Support en fran\u00e7ais',
];

const plans: Plan[] = [
  {
    name: 'Boutique',
    price: '49',
    desc: '1 magasin, toutes les fonctionnalit\u00e9s.',
    features: [
      '1 point de vente',
      ...features,
    ],
    cta: 'Commencer',
    highlight: true,
  },
  {
    name: 'Multi-boutiques',
    price: '99',
    desc: 'Pour les commerces avec plusieurs points de vente.',
    features: [
      'Points de vente illimit\u00e9s',
      '1 compte par boutique',
      ...features,
    ],
    cta: 'Commencer',
  },
];

function CheckIcon({ highlight }: { highlight?: boolean }) {
  return (
    <span
      className={[
        'w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0',
        highlight ? 'bg-violet-200 text-violet-900' : 'bg-violet-50 text-violet-500',
      ].join(' ')}
      aria-hidden="true"
    >
      ✓
    </span>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="py-20 md:py-24 px-6 md:px-14 bg-paper-100">
      <FadeIn className="max-w-[760px] mx-auto mb-12 text-center">
        <div className="text-xs uppercase tracking-widest text-violet-600 font-bold mb-3">
          Tarifs
        </div>
        <h2 className="text-[34px] md:text-[40px] font-bold tracking-tighter leading-[1.1] text-ink mb-4 text-balance">
          Un prix simple. Sans surprise.
        </h2>
        <p className="text-base text-slate">
          Tous les tarifs sont en &euro; HT par mois. 30 jours d&rsquo;essai gratuit, sans
          engagement.
        </p>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[780px] mx-auto">
        {plans.map((p, i) => (
          <FadeIn key={p.name} delay={i * 80}>
            <article
              className={[
                'relative rounded-2xl p-8 flex flex-col gap-2 h-full transition-all duration-300 ease-out-soft',
                p.highlight
                  ? 'bg-white border-2 border-violet-500 shadow-cta-strong md:scale-[1.03] md:-translate-y-1'
                  : 'bg-white border border-line hover:border-violet-500/30',
              ].join(' ')}
            >
              {p.highlight && (
                <div className="absolute -top-3 left-8 bg-violet-500 text-white text-[11px] font-bold py-1 px-3 rounded-full tracking-wide">
                  POPULAIRE
                </div>
              )}

              <div
                className={[
                  'text-base font-bold',
                  p.highlight ? 'text-violet-500' : 'text-slate',
                ].join(' ')}
              >
                {p.name}
              </div>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-[48px] font-bold tracking-tighter text-ink leading-none">
                  {p.price}&euro;
                </span>
                <span className="text-[13px] text-slate">/mois</span>
              </div>
              <p className="text-[13px] text-slate mb-3">{p.desc}</p>

              <a
                href="#"
                className={[
                  'w-full text-center py-3 rounded-full text-sm font-semibold transition-all duration-200 ease-out-soft mb-2',
                  p.highlight
                    ? 'bg-violet-500 text-white shadow-cta hover:-translate-y-0.5 hover:shadow-cta-strong'
                    : 'bg-white text-ink border border-ink/15 hover:border-violet-500 hover:text-violet-500',
                ].join(' ')}
              >
                {p.cta}
              </a>

              <ul className="list-none p-0 mt-3 flex flex-col gap-2.5">
                {p.features.map((f) => (
                  <li
                    key={f}
                    className="flex items-center gap-2.5 text-[13px] text-ink"
                  >
                    <CheckIcon highlight={p.highlight} />
                    {f}
                  </li>
                ))}
              </ul>
            </article>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
