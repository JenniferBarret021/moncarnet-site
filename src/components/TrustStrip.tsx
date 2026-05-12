const names = [
  'Boulangerie Lefèvre',
  'Atelier Fleurs & Co',
  'Café du Marché',
  'Cave des Hauts',
  'Maison Pastel',
];

export function TrustStrip() {
  return (
    <section className="border-y border-line bg-paper-100 px-6 md:px-14 py-8">
      <div className="text-center text-xs text-slate uppercase tracking-wider font-semibold mb-4">
        Adopté par +1 200 commerces en France
      </div>
      <div className="flex justify-center gap-x-10 md:gap-x-14 gap-y-3 flex-wrap font-serif italic text-base md:text-lg text-ink opacity-50">
        {names.map((n) => (
          <span key={n} className="whitespace-nowrap">
            {n}
          </span>
        ))}
      </div>
    </section>
  );
}
