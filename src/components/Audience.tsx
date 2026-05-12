import { useEffect, useRef, useState } from 'react';
import { FadeIn } from './ui/FadeIn';

function StrikeOnScroll({ children }: { children: React.ReactNode }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onScroll = () => {
      const rect = el.getBoundingClientRect();
      const start = window.innerHeight * 0.45;
      const end = window.innerHeight * 0.15;
      const p = Math.max(0, Math.min(1, (start - rect.top) / (start - end)));
      setProgress(p);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <span ref={ref} className="relative inline">
      {/* Trait de barré qui se dessine au scroll */}
      <span
        className="absolute left-0 right-0 top-[55%] h-[3px] bg-violet-500 rounded-full origin-left pointer-events-none"
        style={{
          transform: `scaleX(${progress})`,
          transition: 'none',
        }}
      />
      <span
        className="relative text-violet-500"
        style={{
          opacity: 1 - progress * 0.4,
          transition: 'none',
        }}
      >
        {children}
      </span>
    </span>
  );
}

const items = [
  {
    icon: '\uD83E\uDD50',
    label: 'Boulangeries & p\u00e2tisseries',
    body: "Pr\u00e9commandes du week-end, pi\u00e8ces mont\u00e9es, g\u00e2teaux d\u2019anniversaire.",
  },
  {
    icon: '\uD83D\uDC90',
    label: 'Fleuristes',
    body: "Bouquets sur mesure, \u00e9v\u00e9nements, abonnements floraux.",
  },
  {
    icon: '\uD83C\uDF77',
    label: 'Cavistes & \u00e9piceries fines',
    body: "Coffrets, mises de c\u00f4t\u00e9, retrait click & collect.",
  },
  {
    icon: '\uD83E\uDD69',
    label: 'Boucheries & charcuteries',
    body: "Commandes du week-end, viandes pi\u00e8ces, plateaux ap\u00e9ritifs.",
  },
  {
    icon: '\uD83E\uDDC0',
    label: 'Fromageries',
    body: "Plateaux, affinages \u00e0 commander, ventes \u00e0 la coupe.",
  },
];

export function Audience() {
  return (
    <section id="audience" className="py-20 md:py-24 px-6 md:px-14 bg-paper-100">
      <FadeIn className="max-w-[760px] mx-auto mb-12 text-center">
        <div className="text-xs uppercase tracking-widest text-violet-600 font-bold mb-3">
          Pour qui
        </div>
        <h2 className="text-[34px] md:text-[40px] font-bold tracking-tighter leading-[1.1] text-ink">
          <span className="block">Pour les commerçants de proximité</span>
          <span className="block mt-1">qui veulent <span className="text-violet-500">abandonner le</span> <StrikeOnScroll>crayon papier.</StrikeOnScroll></span>
        </h2>
      </FadeIn>

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-[1200px] mx-auto">
        {items.map((it, i) => (
          <FadeIn key={it.label} delay={i * 60}>
            <article className="bg-white border border-line rounded-2xl p-6 h-full transition-all duration-300 ease-out-soft hover:-translate-y-1 hover:border-violet-500/30">
              <div className="text-[32px] mb-3.5" aria-hidden="true">
                {it.icon}
              </div>
              <h3 className="text-base font-bold text-ink mb-1.5 tracking-tight">
                {it.label}
              </h3>
              <p className="text-[13px] text-slate leading-[1.5]">{it.body}</p>
            </article>
          </FadeIn>
        ))}
      </div>

      <p className="text-center text-slate text-sm mt-8">Et bien d'autres…</p>
    </section>
  );
}
