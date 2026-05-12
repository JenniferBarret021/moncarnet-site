import { Button } from './ui/Button';
import { FadeIn } from './ui/FadeIn';
import { StackIcon } from './StackIcon';

export function FinalCTA() {
  return (
    <section className="py-20 md:py-24 px-6 md:px-14 bg-paper-100">
      <FadeIn className="max-w-[1000px] mx-auto">
        <div className="relative overflow-hidden bg-white border border-line rounded-[28px] px-6 md:px-12 py-12 md:py-16 text-center">
          <div
            className="pointer-events-none absolute -top-20 left-1/2 -translate-x-1/2 w-[600px] max-w-full h-[600px] rounded-full bg-cta-glow z-0"
            style={{ filter: 'blur(40px)' }}
            aria-hidden="true"
          />
          <div className="relative z-[1]">
            <div className="flex justify-center mb-6">
              <StackIcon size={56} />
            </div>
            <h2 className="text-[32px] md:text-[42px] font-bold tracking-tighter leading-[1.1] text-ink mb-3.5 text-balance">
              Commencez aujourd&rsquo;hui.
            </h2>
            <p className="text-base text-slate max-w-[480px] mx-auto mb-7">
              30 jours d&rsquo;essai gratuit, sans carte bancaire. Installation guidée
              incluse.
            </p>
            <div className="flex flex-wrap justify-center gap-3.5">
              <Button href="#" size="lg">
                Essayer gratuitement
              </Button>
              <Button href="#" size="lg" variant="outline">
                Parler à un humain
              </Button>
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
