import { useEffect, useState } from 'react';

function getRoute(): string {
  if (typeof window === 'undefined') return '/';
  const h = window.location.hash || '';
  return h.startsWith('#') ? h.slice(1) || '/' : '/';
}

export function useHashRoute(): string {
  const [route, setRoute] = useState<string>(() => getRoute());

  useEffect(() => {
    const onChange = () => setRoute(getRoute());
    window.addEventListener('hashchange', onChange);
    return () => window.removeEventListener('hashchange', onChange);
  }, []);

  return route;
}

export function navigate(path: string) {
  if (typeof window === 'undefined') return;
  window.location.hash = path;
}
