import { useEffect, useState } from ‘react’;

const steps = [
  {
    n: ‘01’,
    t: ‘Ajoutez vos produits’,
    body:
      ‘Importez ou créez votre catalogue produit en quelques minutes. Vos prix, vos références, vos catégories.’,
  },
  {
    n: ‘02’,
    t: ‘Prenez vos commandes’,
    body:
      ‘Au comptoir, par téléphone, en ligne. Tout converge dans un seul carnet, à jour pour toute l’équipe.’,
  },
  {
    n: ‘03’,
    t: ‘Préparez-les sereinement’,
    body:
      ‘La vue prépa vous indique exactement quoi faire, en quelle quantité, et pour quand. Rien ne passe à la trappe.’,
  },
  {
    n: ‘04’,
    t: ‘Gérez les retraits’,
    body:
      ‘Suivez qui a récupéré sa commande, quand et comment. Un clic suffit pour valider le retrait.’,
  },
];

function DesktopSteps() {
  const [active, setActive] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActive((prev) => (prev + 1) % steps.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="hidden md:grid grid-cols-4 gap-8 max-w-[1200px] mx-auto">
      {steps.map((s, i) => {
        const isActive = active === i;
        return (
          <div
            key={s.n}
            style={{
              opacity: isActive ? 1 : 0.45,
              transform: isActive ? ‘translateY(-4px)’ : ‘translateY(0)’,
              transition: ‘opacity 500ms ease, transform 500ms ease’,
            }}
          >
            <div
              className="text-[13px] font-bold tracking-wider mb-3.5"
              style={{
                color: isActive ? ‘#7C3AED’ : ‘#A78BFA’,
                transition: ‘color 500ms ease’,
              }}
            >
              {s.n}
            </div>
            <div className="relative h-px bg-line mb-4">
              <div
                className="absolute left-0 -top-0.5 h-1 bg-violet-500 rounded-full"
                style={{
                  width: isActive ? ‘2.5rem’ : ‘1.5rem’,
                  opacity: isActive ? 1 : 0.4,
                  transition: ‘width 500ms ease, opacity 500ms ease’,
                }}
              />
            </div>
            <h3 className="text-[22px] font-bold text-ink tracking-tight mb-2.5 leading-tight">
              {s.t}
            </h3>
            <p className="text-sm text-slate leading-[1.6]">{s.body}</p>
          </div>
        );
      })}
    </div>
  );
}

export function HowItWorks() {
  return (
    <section id="how" className="py-20 md:py-24 px-6 md:px-14">
      <div className="max-w-[760px] mx-auto mb-12 md:mb-14 text-center">
        <div className="text-xs uppercase tracking-widest text-violet-500 font-bold mb-3">
          Fonctionnement
        </div>
        <h2 className="text-[34px] md:text-[40px] font-bold tracking-tighter leading-[1.1] text-ink text-balance">
          Prêt en 5 minutes, utile dès aujourd&rsquo;hui.
        </h2>
      </div>

      {/* Desktop : animation en boucle */}
      <DesktopSteps />

      {/* Mobile */}
      <div className="grid grid-cols-1 gap-8 md:hidden">
        {steps.map((s) => (
          <div key={s.n}>
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
        ))}
      </div>
    </section>
  );
}
