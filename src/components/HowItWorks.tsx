import { FadeIn } from './ui/FadeIn';

const steps = [
  {
    n: '01',
    t: 'Préparez votre carnet',
    body:
      'Importez ou créez votre catalogue produit en quelques minutes. Vos prix, vos références, vos catégories.',
  },
  {
    n: '02',
    t: 'Prenez vos commandes',
    body:
      'Au comptoir, par téléphone, en ligne. Tout converge dans un seul carnet, à jour pour toute l’équipe.',
  },
  {
    n: '03',
    t: 'Préparez sereinement',
    body:
      'La vue prépa vous indique exactement quoi faire, en quelle quantité, et pour quand. Rien ne passe à la trappe.',
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="py-20 md:py-24 px-6 md:px-14">
      <FadeIn className="max-w-[760px] mx-auto mb-12 md:mb-14 text-center">
        <div className="text-xs uppercase tracking-widest text-violet-500 font-bold mb-3">
          Fonctionnement
        </div>
        <h2 className="text-[34px] md:text-[40px] font-bold tracking-tighter leading-[1.1] text-ink text-balance">
          Prêt en 5 minutes, utile dès aujourd&rsquo;hui.
        </h2>
      </FadeIn>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 max-w-[1200px] mx-auto">
        {steps.map((s, i) => (
          <FadeIn key={s.n} delay={i * 100}>
            <div>
              <div className="text-[13px] font-bold text-violet-500 tracking-wider mb-3.5">
                {s.n}
              </div>
              <div className="relative h-px bg-line mb-4">
                <div className="absolute left-0 -top-0.5 w-10 h-1 bg-violet-500 rounded-full" />
              </div>
              <h3 className="text-[22px] font-bold text-ink tracking-tight mb-2.5 leading-tight">
                {s.t}
              </h3>
              <p className="text-sm text-slate leading-[1.6]">{s.body}</p>
            </div>
          </FadeIn>
        ))}
      </div>
    </section>
  );
}
