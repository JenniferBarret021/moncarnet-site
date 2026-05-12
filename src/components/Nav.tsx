import { useEffect, useState } from 'react';
import { StackIcon } from './StackIcon';
import { Wordmark } from './Wordmark';
import { Button } from './ui/Button';

const links = [
  { href: '#features', label: 'Fonctionnalités' },
  { href: '#audience', label: 'Pour qui' },
  { href: '#how', label: 'Fonctionnement' },
  { href: '#pricing', label: 'Tarifs' },
];

export function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <nav
      className={[
        'sticky top-0 z-50 transition-shadow duration-300',
        'bg-paper/85 backdrop-blur-md',
        scrolled ? 'shadow-[0_1px_0_rgba(27,21,48,0.06)]' : 'border-b border-line/60',
      ].join(' ')}
    >
      <div className="flex items-center justify-between px-6 md:px-14 h-[72px] max-w-[1440px] mx-auto">
        <a href="#top" className="flex items-center gap-3 shrink-0" aria-label="Mon carnet de commandes">
          <StackIcon size={36} title="Mon carnet de commandes" />
          <Wordmark size={16} />
        </a>

        <div className="hidden lg:flex items-center gap-8 font-sans text-sm text-ink">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="hover:text-violet-500 transition-colors"
            >
              {l.label}
            </a>
          ))}
          <a href="#" className="text-slate hover:text-ink transition-colors">
            Se connecter
          </a>
          <Button href="#" size="sm">
            Essayer gratuitement
          </Button>
        </div>

        <button
          type="button"
          aria-label={open ? 'Fermer le menu' : 'Ouvrir le menu'}
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
          className="lg:hidden inline-flex items-center justify-center w-10 h-10 rounded-full text-ink hover:bg-paper-100"
        >
          {open ? (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="6" y1="6" x2="18" y2="18" />
              <line x1="18" y1="6" x2="6" y2="18" />
            </svg>
          ) : (
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
              <line x1="4" y1="7" x2="20" y2="7" />
              <line x1="4" y1="13" x2="20" y2="13" />
              <line x1="4" y1="19" x2="20" y2="19" />
            </svg>
          )}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-line bg-paper">
          <div className="px-6 py-6 flex flex-col gap-4">
            {links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="text-ink text-base font-medium py-2"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#"
              onClick={() => setOpen(false)}
              className="text-slate text-base py-2"
            >
              Se connecter
            </a>
            <Button href="#" size="lg" className="mt-2 w-full">
              Essayer gratuitement
            </Button>
          </div>
        </div>
      )}
    </nav>
  );
}
