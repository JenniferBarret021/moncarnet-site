import { StackIcon } from './StackIcon';
import { Wordmark } from './Wordmark';

export function Footer() {
  return (
    <footer className="border-t border-line bg-paper px-6 md:px-14 pt-14 pb-10">
      <div className="max-w-[1200px] mx-auto flex flex-col md:flex-row md:justify-between gap-10">
        <div>
          <div className="flex items-center gap-3 mb-3.5">
            <StackIcon size={36} />
            <Wordmark size={15} />
          </div>
          <p className="text-[13px] text-slate leading-[1.55] max-w-[320px]">
            La solution de prise et préparation de commandes pour les commerces de
            proximité.
          </p>
        </div>
        <div>
          <div className="text-xs font-bold text-ink uppercase tracking-wide mb-3.5">
            Contact
          </div>
          <ul className="list-none p-0 m-0 flex flex-col gap-2.5">
            <li>
              <a href="mailto:contact@mon-carnet-de-commande.fr" className="text-[13px] text-slate hover:text-ink transition-colors">
                contact@mon-carnet-de-commande.fr
              </a>
            </li>
            <li>
              <a href="tel:+33663776013" className="text-[13px] text-slate hover:text-ink transition-colors">
                06 63 77 60 13
              </a>
            </li>
          </ul>
        </div>
      </div>
      <div className="max-w-[1200px] mx-auto mt-10 pt-6 border-t border-line flex flex-col md:flex-row justify-between gap-4 text-xs text-slate">
        <span>© 2026 Mon carnet de commandes. Tous droits réservés.</span>
        <span className="flex flex-wrap gap-4 md:gap-5">
          <a href="#/mentions-legales" className="hover:text-ink transition-colors">
            Mentions légales
          </a>
          <a href="#/confidentialite" className="hover:text-ink transition-colors">
            Confidentialité
          </a>
        </span>
      </div>
    </footer>
  );
}
