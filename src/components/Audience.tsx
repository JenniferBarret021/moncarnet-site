import { FadeIn } from './ui/FadeIn';

const items = [
  {
    icon: '🥐',
    label: 'Boulangeries & pâtisseries',
    body: 'Précommandes du week-end, pièces montées, gâteaux d’anniversaire.',
  },
  {
    icon: '💐',
    label: 'Fleuristes',
    body: 'Bouquets sur mesure, événements, abonnements floraux.',
  },
  {
    icon: '🍷',
    label: 'Cavistes & épiceries fines',
    body: 'Coffrets, mises de côté, retrait click & collect.',
  },
  {
    icon: '🥩',
    label: 'Boucheries & charcuteries',
    body: 'Commandes du week-end, viandes pièces, plateaux apéritifs.',
  },
  {
    icon: '🧀',
    label: 'Fromageries',
    body: 'Plateaux, affinages à commander, ventes à la coupe.',
  },
];

export function Audience() {
  return (
    <section id="audience" className="py-20 md:py-24 px-6 md:px-14 bg-paper-100">
      <FadeIn className="max-w-[760px] mx-auto mb-12 text-center">
        <div className="text-xs uppercase tracking-widest text-violet-600 font-bold mb-3">
          Pour qui
        </div>
        <h2 className="text-[34px] md:text-[40px] font-bold tracking-tighter leading-[1.1] text-ink text-balance">
          Pour les commerçants de proximité<br className="md:hidden" />{' '}qui souhaitent abandonner le crayon papier.
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
