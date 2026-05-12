import { FadeIn } from './ui/FadeIn';

export function Testimonial() {
  return (
    <section className="py-20 md:py-24 px-6 md:px-14 bg-violet-gradient text-white">
      <FadeIn className="max-w-[880px] mx-auto text-center">
        <div className="text-[13px] uppercase tracking-widest text-violet-200 font-bold mb-6">
          Ils nous font confiance
        </div>
        <blockquote className="font-serif text-[26px] md:text-[34px] leading-[1.25] tracking-[-0.015em] text-white mb-8 text-balance">
          « Avant, on griffonnait les commandes du week-end sur un cahier. Aujourd&rsquo;hui
          tout est dans l&rsquo;app • plus jamais d&rsquo;oubli, plus jamais un client déçu. »
        </blockquote>
        <div className="flex items-center justify-center gap-3.5">
          <div className="w-12 h-12 rounded-full bg-avatar-violet" aria-hidden="true" />
          <div className="text-left">
            <div className="font-sans font-bold text-[15px]">Jennifer Barret</div>
            <div className="font-sans text-[13px] opacity-70">
              Boulangerie Démo, Lyon
            </div>
          </div>
        </div>
      </FadeIn>
    </section>
  );
}
