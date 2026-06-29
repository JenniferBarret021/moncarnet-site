import { FadeIn } from './ui/FadeIn';

const coreFeatures = [
  'Commandes illimitées',
  'Catalogue produit personnalisé',
  'Gestion des retraits',
  'Historique des commandes récupérées illimité',
  'Personnalisation de l’app à votre image',
];

type Plan = {
  name: string;
  monthly: number;
  annual: number;
  desc: string;
  commitment: string;
  features: string[];
  cta: string;
  highlight?: boolean;
  badge?: string;
};

const plans: Plan[] = [
  {
    name: 'Essentielle',
    monthly: 29,
    annual: 290,
    desc: 'Tout pour gérer vos commandes, sans engagement.',
    commitment: 'Sans engagement',
    features: [
      ...coreFeatures,
    ],
    cta: 'Commencer',
  },
  {
    name: 'Professionnelle',
    monthly: 49,
    annual: 490,
    desc: 'L’offre complète avec la boutique en ligne.',
    commitment: 'Avec engagement',
    features: [
      ...coreFeatures,
      'Boutique en ligne click & collect',
    ],
    cta: 'Commencer',
    highlight: true,
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
    <section id="pricing" className="py-20 md:py-24 px-6 md:px-14">
      <FadeIn className="max-w-[760px] mx-auto mb-12 text-center">
        <span className="inline-block text-xs uppercase tracking-widest text-violet-600 font-bold mb-3 px-4 py-1.5 rounded-full" style={{ background: 'rgba(91, 63, 168, 0.15)' }}>
          Tarifs
        </span>
        <h2 className="text-[34px] md:text-[40px] font-bold tracking-tighter leading-[1.1] text-ink mb-4 text-balance">
          Un prix simple. Sans surprise.
        </h2>
        <p className="text-base text-slate">
          30 jours d&rsquo;essai gratuit, sans carte bancaire. Tous les prix sont HT.
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

              {/* Prix mensuel */}
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-[48px] font-bold tracking-tighter text-ink leading-none">
                  {p.monthly}&euro;
                </span>
                <span className="text-[13px] text-slate">HT /mois</span>
              </div>

              {/* Prix annuel */}
              <div className="flex items-center gap-2 mt-1">
                <span className="text-[15px] font-semibold text-ink">
                  ou {p.annual}&euro; HT /an
                </span>
                <span className="text-[11px] font-bold text-violet-600 bg-violet-50 px-2 py-0.5 rounded-full">
                  2 mois offerts
                </span>
              </div>

              <span className="inline-flex w-fit items-center text-[11px] font-bold text-slate bg-line/50 px-2.5 py-1 rounded-full mt-2">
                {p.commitment}
              </span>

              <p className="text-[13px] text-slate mb-3 mt-1">{p.desc}</p>
              {p.badge && (
                <span className="inline-flex items-center gap-1.5 text-[11px] font-bold text-violet-600 bg-violet-50 px-3 py-1.5 rounded-full mb-2">
                  {p.badge}
                </span>
              )}

              <a
                href="https://app.mon-carnet-de-commandes.fr"
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
