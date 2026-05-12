import { Button } from './ui/Button';
import { FadeIn } from './ui/FadeIn';
import { TabletMockup } from './TabletMockup';
import { PhoneMockup } from './PhoneMockup';

const checks = [
  'Sans carte bancaire',
  'Installation en 5 min',
  "30 jours d'essai",
  'Support en français',
];

export function Hero() {
  return (
    <section id="top" className="pt-16 md:pt-20 pb-20 px-6 md:px-14">
      <FadeIn className="max-w-[1060px] mx-auto mb-12 md:mb-14 text-center">
        <div className="inline-flex flex-col items-center gap-1.5 mb-6">
          <div className="inline-flex items-center gap-2 bg-violet-50 text-violet-500 px-3.5 py-1.5 rounded-full text-xs font-semibold border border-violet-100">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-600" />
            Spécialement conçu pour les commerces de proximité
          </div>
        </div>

        <h1 className="font-sans font-bold text-ink leading-[1.02] tracking-tightest text-[36px] sm:text-5xl md:text-6xl lg:text-[64px] mb-6">
          <span className="block md:whitespace-nowrap">
            Prenez et préparez vos commandes,
          </span>
          <span className="block text-violet-500">sans rien oublier.</span>
        </h1>

        <p className="text-[17px] md:text-[19px] leading-[1.55] text-slate mx-auto max-w-[820px] mb-8">
          Fini le carnet papier, les Post-it perdus et les commandes oubliées. Centralisez
          tout au même endroit, retrouvez n'importe quelle commande en un instant et ne laissez plus rien passer entre les mailles.
        </p>

        <div className="flex flex-wrap gap-3.5 items-center justify-center mb-6">
          <Button href="#" size="lg">
            Essayer gratuitement
          </Button>
          <a
            href="#/demo"
            target="_blank"
            rel="noopener"
            className="font-medium text-[15px] text-ink hover:text-violet-500 transition-colors"
          >
            Voir une démo →
          </a>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-2 text-[13px] text-slate justify-center">
          {checks.map((c) => (
            <span key={c} className="inline-flex items-center gap-1.5">
              <svg
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-violet-500"
                aria-hidden="true"
              >
                <polyline points="20 6 9 17 4 12" />
              </svg>
              {c}
            </span>
          ))}
        </div>
      </FadeIn>

      <FadeIn delay={120}>
        <div className="relative max-w-[1200px] mx-auto px-3">
          <div
            className="pointer-events-none absolute -top-10 left-1/2 -translate-x-1/2 w-[900px] max-w-full h-[500px] rounded-[50%] z-0 bg-hero-glow"
            style={{ filter: 'blur(60px)' }}
            aria-hidden="true"
          />

          <div className="relative z-[1] flex flex-wrap justify-center items-end gap-y-14">
            <div className="relative z-[1] max-w-full">
              <TabletMockup />
            </div>
            <div className="relative z-[2] max-w-full -ml-10 -mb-6">
              <PhoneMockup />
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
