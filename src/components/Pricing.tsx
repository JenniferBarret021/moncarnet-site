import { useState } from 'react';
import { FadeIn } from './ui/FadeIn';

// Liste complète des fonctionnalités, affichée dans chaque offre.
// Celles absentes d'une offre apparaissent barrées pour rendre l'écart visible.
const allFeatures = [
  'Commandes illimitées',
  'Catalogue produit personnalisé',
  'Import de produits via fichier (Excel, CSV)',
  'Création de menus et formules',
  'Gestion des retraits',
  'Historique des commandes illimité',
  "Personnalisation de l'app à votre image",
  'Boutique en ligne click & collect',
  'Horaires, fermetures et créneaux exceptionnels',
  'Email de confirmation automatique au client',
];

type Plan = {
  name: string;
  monthly: number;
  annual: number;
  desc: string;
  // Fonctionnalités incluses dans l'offre (sous-ensemble de allFeatures).
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
    features: allFeatures.filter(
      (f) =>
        f !== 'Boutique en ligne click & collect' &&
        f !== 'Horaires, fermetures et créneaux exceptionnels' &&
        f !== 'Email de confirmation automatique au client',
    ),
    cta: 'Commencer',
  },
  {
    name: 'Professionnelle',
    monthly: 49,
    annual: 490,
    desc: "L'offre complète avec la boutique en ligne.",
    features: allFeatures,
    cta: 'Commencer',
    highlight: true,
  },
];

type Billing = 'monthly' | 'annual';

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

function CrossIcon() {
  return (
    <span
      className="w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0 bg-slate-100 text-slate-400"
      aria-hidden="true"
    >
      ✕
    </span>
  );
}

function BillingToggle({
  billing,
  onChange,
}: {
  billing: Billing;
  onChange: (b: Billing) => void;
}) {
  const options: { value: Billing; label: string }[] = [
    { value: 'monthly', label: 'Mensuel' },
    { value: 'annual', label: 'Annuel' },
  ];
  return (
    <div
      role="tablist"
      aria-label="Choix de la facturation"
      className="inline-flex items-center gap-1 p-1 rounded-full bg-line/50 border border-line"
    >
      {options.map((o) => {
        const active = billing === o.value;
        return (
          <button
            key={o.value}
            type="button"
            role="tab"
            aria-selected={active}
            onClick={() => onChange(o.value)}
            className={[
              'flex items-center gap-2 px-5 py-2 rounded-full text-[13px] font-semibold transition-all duration-200 ease-out-soft',
              active
                ? 'bg-violet-500 text-white shadow-cta'
                : 'text-slate hover:text-ink',
            ].join(' ')}
          >
            {o.label}
            {o.value === 'annual' && (
              <span
                className={[
                  'text-[11px] font-bold px-2 py-0.5 rounded-full',
                  active ? 'bg-white/20 text-white' : 'bg-violet-50 text-violet-600',
                ].join(' ')}
              >
                2 mois offerts
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

export function Pricing() {
  const [billing, setBilling] = useState<Billing>('monthly');

  return (
    <section id="pricing" className="py-20 md:py-24 px-6 md:px-14">
      <FadeIn className="max-w-[760px] mx-auto mb-8 text-center">
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

      <FadeIn className="flex justify-center mb-10">
        <BillingToggle billing={billing} onChange={setBilling} />
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 max-w-[780px] mx-auto">
        {plans.map((p, i) => {
          const price = billing === 'monthly' ? p.monthly : p.annual;
          const period = billing === 'monthly' ? 'HT /mois' : 'HT /an';
          const commitment =
            billing === 'monthly'
              ? 'Sans engagement'
              : 'Sans engagement · payable en 1 fois';

          return (
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

                {/* Prix selon la facturation choisie */}
                <div className="flex items-baseline gap-1.5 mt-1">
                  <span className="text-[48px] font-bold tracking-tighter text-ink leading-none">
                    {price}&euro;
                  </span>
                  <span className="text-[13px] text-slate">{period}</span>
                </div>

                {/* Mention d'engagement / modalité de paiement */}
                <span className="inline-flex w-fit items-center text-[11px] font-bold text-slate bg-line/50 px-2.5 py-1 rounded-full mt-2">
                  {commitment}
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
                  {allFeatures.map((f) => {
                    const included = p.features.includes(f);
                    return (
                      <li
                        key={f}
                        className={[
                          'flex items-center gap-2.5 text-[13px]',
                          included ? 'text-ink' : 'text-slate-400 line-through decoration-slate-300',
                        ].join(' ')}
                      >
                        {included ? <CheckIcon highlight={p.highlight} /> : <CrossIcon />}
                        {f}
                      </li>
                    );
                  })}
                </ul>
              </article>
            </FadeIn>
          );
        })}
      </div>
    </section>
  );
}
