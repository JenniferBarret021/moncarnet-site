export type ProductCategory =
  | 'Viennoiserie'
  | 'Pains'
  | 'Pâtisseries'
  | 'Boissons'
  | 'Autre';

export const CATEGORIES: ProductCategory[] = [
  'Viennoiserie',
  'Pains',
  'Pâtisseries',
  'Boissons',
  'Autre',
];

export const CATEGORY_LABEL: Record<ProductCategory, string> = {
  Viennoiserie: 'Viennoiserie',
  Pains: 'Pains',
  Pâtisseries: 'Pâtisseries',
  Boissons: 'Boissons',
  Autre: 'Autre',
};

export type Product = {
  id: string;
  name: string;
  price: number;
  category?: ProductCategory;
  unite?: string;
  active: boolean;
};

export type OrderItem = {
  productId: string;
  name: string;
  price: number;
  qty: number;
  freeQty: number;
};

export type OrderStatus =
  | 'en_attente'
  | 'en_cours'
  | 'prete'
  | 'recuperee'
  | 'annulee';

export const STATUS_LABEL: Record<OrderStatus, string> = {
  en_attente: 'À préparer',
  en_cours: 'En préparation',
  prete: 'Préparée',
  recuperee: 'Récupérée',
  annulee: 'Annulée',
};

export const STATUS_META: Record<
  OrderStatus,
  { label: string; color: string; bg: string; next: OrderStatus | null; nextLabel: string }
> = {
  en_attente: { label: 'À préparer', color: '#F59E0B', bg: '#FFFBEB', next: 'en_cours', nextLabel: 'En préparation' },
  en_cours: { label: 'En préparation', color: '#6C3AED', bg: '#F3EEFF', next: 'prete', nextLabel: 'Préparée' },
  prete: { label: 'Préparée', color: '#10B981', bg: '#ECFDF5', next: 'recuperee', nextLabel: 'Récupérée' },
  recuperee: { label: 'Récupérée', color: '#94A3B8', bg: '#F1F5F9', next: null, nextLabel: '' },
  annulee: { label: 'Annulée', color: '#EF4444', bg: '#FEF2F2', next: null, nextLabel: '' },
};

export const STATUS_FLOW: OrderStatus[] = [
  'en_attente',
  'en_cours',
  'prete',
  'recuperee',
];

export type Order = {
  id: string;
  number: number;
  clientName: string;
  phone?: string;
  email?: string;
  items: OrderItem[];
  pickupDate: string; // YYYY-MM-DD
  pickupTime: string | null; // HH:mm or null
  status: OrderStatus;
  paid: boolean;
  total: number;
  note?: string;
  createdAt: number;
};
