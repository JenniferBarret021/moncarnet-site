import { StackIcon } from './StackIcon';
import { Wordmark } from './Wordmark';

const columns: { t: string; l: string[] }[] = [
  { t: 'Produit', l: ['Fonctionnalités', 'Tarifs', 'Démo', 'Sécurité'] },
  { t: 'Société', l: ['À propos', 'Blog', 'Contact'] },
  { t: 'Ressources', l: ['Aide', 'Statut', 'API'] },
];

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper px-6 md:px-14 pt-14 pb-10">
      <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-4 gap-10">
        <div className="col-span-2 md:col-span-1 md:mr-6">
          <div className="flex items-center gap-3 mb-3.5">
            <StackIcon size={36} />
            <Wordmark size={15} />
          </div>
          <p className="text-[13px] text-slate leading-[1.55] max-w-[320px]">
            La solution de prise et préparation de commandes pour les commerces de
            proximité.
          </p>
        </div>
        {columns.map((c) => (
          <div key={c.t}>
            <div className="text-xs font-bold text-ink uppercase tracking-wide mb-3.5">
              {c.t}
            </div>
            <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
              {c.l.map((it) => (
                <li key={it}>
                  <a
                    href="#"
                    className="text-[13px] text-slate hover:text-ink transition-colors"
                  >
                    {it}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="max-w-[1200px] mx-auto mt-10 pt-6 border-t border-line flex flex-col md:flex-row justify-between gap-4 text-xs text-slate">
        <span>© 2026 Mon carnet de commandes. Tous droits réservés.</span>
        <span className="flex flex-wrap gap-4 md:gap-5">
          <a href="#" className="hover:text-ink transition-colors">
            Mentions légales
          </a>
          <a href="#" className="hover:text-ink transition-colors">
            Confidentialité
          </a>
          <a href="#" className="hover:text-ink transition-colors">
            CGU
          </a>
        </span>
      </div>
    </footer>
  );
}
