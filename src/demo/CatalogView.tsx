import { useState } from 'react';
import { actions, useDemoStore } from './store';
import { CATEGORIES } from './types';
import type { ProductCategory } from './types';
import { formatEuro } from './utils';

export function CatalogView() {
  const products = useDemoStore((s) => s.products);
  const customCategories = useDemoStore((s) => s.customCategories);
  const [filter, setFilter] = useState<'Tout' | string>('Tout');
  const [search, setSearch] = useState('');

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState<string>('Viennoiserie');
  const [error, setError] = useState<string | null>(null);

  // Nouvelle catégorie
  const [showNewCat, setShowNewCat] = useState(false);
  const [newCatName, setNewCatName] = useState('');



  const allCategories: string[] = [...CATEGORIES, ...customCategories];

  function submit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const trimmed = name.trim();
    const num = Number(price.replace(',', '.'));
    if (!trimmed) {
      setError('Donnez un nom au produit.');
      return;
    }
    if (!Number.isFinite(num) || num < 0) {
      setError('Le prix doit être un nombre positif.');
      return;
    }
    actions.addProduct(trimmed, num, category as ProductCategory);
    setName('');
    setPrice('');
  }

  function handleNewCategory() {
    const trimmed = newCatName.trim();
    if (!trimmed) return;
    actions.addCustomCategory(trimmed);
    setCategory(trimmed);
    setNewCatName('');
    setShowNewCat(false);
  }

  const filtered = products
    .filter((p) => (filter === 'Tout' ? true : p.category === filter))
    .filter((p) =>
      search.trim()
        ? p.name.toLowerCase().includes(search.trim().toLowerCase())
        : true,
    );

  return (
    <div>
      {/* Header */}
      <div className="flex items-start justify-between flex-wrap gap-3 mb-4">
        <div>
          <p style={{ fontSize: '0.6875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em', color: '#8E89A3' }} className="mb-1">GESTION</p>
          <h1 className="text-2xl font-bold">Catalogue</h1>
          <p className="text-sm mt-0.5" style={{ color: '#8E89A3' }}>{products.length} produits dans votre carnet.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_340px] gap-6">
        <section>
          {/* Recherche */}
          <div className="mb-4">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher un produit..."
              className="w-full sm:w-72"
              style={{
                height: '2.75rem',
                padding: '0 1rem',
                borderRadius: '1rem',
                border: '1.5px solid #C9C4D9',
                background: '#FFFFFF',
                fontSize: '0.875rem',
                color: '#1E1B2E',
                outline: 'none',
              }}
            />
          </div>

          {/* Filtres catégorie */}
          <div className="flex gap-1.5 mb-4 overflow-x-auto pb-1">
            {(['Tout', ...allCategories] as const).map((c) => {
              const active = filter === c;
              return (
                <button
                  key={c}
                  type="button"
                  onClick={() => setFilter(c)}
                  className="shrink-0 px-3 py-2 rounded-xl text-xs font-bold transition-all"
                  style={
                    active
                      ? { background: '#5B3FA8', color: '#FFFFFF' }
                      : { background: '#FFFFFF', color: '#1E1B2E', border: '1.5px solid #C9C4D9' }
                  }
                >
                  {c}
                </button>
              );
            })}
          </div>

          {/* Liste produits */}
          {filtered.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-sm" style={{ color: '#8E89A3' }}>Aucun produit ne correspond.</p>
            </div>
          ) : (
            <div className="space-y-1.5">
              {filtered.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between px-4 py-3.5 rounded-xl"
                  style={{ background: '#FFFFFF' }}
                >
                  <div className="min-w-0">
                    <div className="text-sm font-semibold truncate" style={{ color: '#1E1B2E' }}>
                      {p.name}
                    </div>
                    <div className="text-xs mt-0.5" style={{ color: '#8E89A3' }}>
                      {p.category || 'Autre'}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="text-sm font-bold" style={{ color: '#5B3FA8' }}>
                      {formatEuro(p.price)}
                    </span>
                    <button
                      type="button"
                      onClick={() => {
                        if (window.confirm(`Supprimer \u00AB ${p.name} \u00BB du catalogue ?`)) {
                          actions.deleteProduct(p.id);
                        }
                      }}
                      aria-label={`Supprimer ${p.name}`}
                      className="w-8 h-8 inline-flex items-center justify-center rounded-full transition-colors"
                      style={{ color: '#8E89A3' }}
                    >
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <polyline points="3 6 5 6 21 6" />
                        <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" />
                        <path d="M10 11v6" />
                        <path d="M14 11v6" />
                      </svg>
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {/* Formulaire ajout */}
        <aside
          className="rounded-2xl p-5 h-fit lg:sticky lg:top-[80px]"
          style={{ background: '#FFFFFF', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.06), 0 1px 3px rgba(0, 0, 0, 0.04)', border: '1px solid rgba(255, 255, 255, 0.7)' }}
        >
          <h2 className="text-lg font-bold mb-1" style={{ color: '#1E1B2E' }}>
            Ajouter un produit
          </h2>
          <p className="text-xs mb-4" style={{ color: '#8E89A3' }}>
            Préchargez votre carnet — c'est ce qui s'affiche dans la prise de commande.
          </p>

          <form onSubmit={submit} className="flex flex-col gap-3">
            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold" style={{ color: '#1E1B2E' }}>Nom</span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="ex. Brioche aux pralines"
                required
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '1rem',
                  border: '1.5px solid #C9C4D9',
                  fontSize: '0.875rem',
                  background: '#fbfaf8',
                  color: '#1E1B2E',
                }}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold" style={{ color: '#1E1B2E' }}>Prix (€)</span>
              <input
                type="text"
                inputMode="decimal"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="ex. 4,50"
                required
                style={{
                  padding: '0.75rem 1rem',
                  borderRadius: '1rem',
                  border: '1.5px solid #C9C4D9',
                  fontSize: '0.875rem',
                  background: '#fbfaf8',
                  color: '#1E1B2E',
                }}
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="text-xs font-semibold" style={{ color: '#1E1B2E' }}>Catégorie</span>
              {showNewCat ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={newCatName}
                    onChange={(e) => setNewCatName(e.target.value)}
                    placeholder="Nom de la catégorie"
                    autoFocus
                    onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleNewCategory(); } }}
                    style={{
                      flex: 1,
                      padding: '0.75rem 1rem',
                      borderRadius: '1rem',
                      border: '1.5px solid #5B3FA8',
                      fontSize: '0.875rem',
                      background: '#fbfaf8',
                      color: '#1E1B2E',
                    }}
                  />
                  <button
                    type="button"
                    onClick={handleNewCategory}
                    className="px-3 rounded-xl text-xs font-bold"
                    style={{ background: '#5B3FA8', color: '#FFFFFF' }}
                  >
                    OK
                  </button>
                  <button
                    type="button"
                    onClick={() => { setShowNewCat(false); setNewCatName(''); }}
                    className="px-3 rounded-xl text-xs font-bold"
                    style={{ background: '#fbfaf8', color: '#8E89A3', border: '1.5px solid #C9C4D9' }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    style={{
                      flex: 1,
                      padding: '0.75rem 1rem',
                      borderRadius: '1rem',
                      border: '1.5px solid #C9C4D9',
                      fontSize: '0.875rem',
                      background: '#fbfaf8',
                      color: '#1E1B2E',
                      appearance: 'none',
                      paddingRight: '2.5rem',
                      backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%239CA3AF' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E\")",
                      backgroundRepeat: 'no-repeat',
                      backgroundPosition: 'right 1rem center',
                    }}
                  >
                    {allCategories.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <button
                    type="button"
                    onClick={() => setShowNewCat(true)}
                    title="Créer une catégorie"
                    className="w-11 h-11 shrink-0 rounded-xl flex items-center justify-center"
                    style={{ background: '#fbfaf8', color: '#5B3FA8', border: '1.5px solid #C9C4D9' }}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                      <line x1="12" y1="5" x2="12" y2="19" />
                      <line x1="5" y1="12" x2="19" y2="12" />
                    </svg>
                  </button>
                </div>
              )}
            </label>

            {error && (
              <div className="text-xs rounded-xl px-3 py-2" style={{ color: '#EF4444', background: '#FEF2F2' }}>
                {error}
              </div>
            )}

            <button
              type="submit"
              className="mt-2 flex items-center justify-center gap-2 rounded-xl py-3 px-4 font-bold text-sm transition-all"
              style={{ background: '#5B3FA8', color: '#FFFFFF', minHeight: '3rem' }}
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Ajouter au catalogue
            </button>
          </form>
        </aside>
      </div>

    </div>
  );
}
