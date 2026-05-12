import { useEffect, useSyncExternalStore } from 'react';
import type {
  Order,
  OrderItem,
  OrderStatus,
  Product,
  ProductCategory,
} from './types';
import { addDays, today } from './utils';

const STORAGE_KEY = 'moncarnet:demo:v5';

type State = {
  products: Product[];
  orders: Order[];
  orderCounter: number;
  shopName: string;
  ownerName: string;
  customCategories: string[];
};

function uid() {
  return Math.random().toString(36).slice(2, 9);
}

function seed(): State {
  const t = today();
  const tomorrow = addDays(t, 1);

  const products: Product[] = [
    { id: 'p1', name: 'Croissant', price: 1.3, category: 'Viennoiserie', unite: 'pièce', active: true },
    { id: 'p2', name: 'Pain au chocolat', price: 1.4, category: 'Viennoiserie', unite: 'pièce', active: true },
    { id: 'p3', name: 'Pain aux raisins', price: 1.6, category: 'Viennoiserie', unite: 'pièce', active: true },
    { id: 'p4', name: 'Brioche', price: 4.5, category: 'Viennoiserie', unite: 'pièce', active: true },
    { id: 'p5', name: 'Chausson aux pommes', price: 1.8, category: 'Viennoiserie', unite: 'pièce', active: true },
    { id: 'p6', name: 'Suisse blanc', price: 1.5, category: 'Viennoiserie', unite: 'pièce', active: true },
    { id: 'p7', name: 'Baguette tradition', price: 1.2, category: 'Pains', unite: 'pièce', active: true },
    { id: 'p8', name: 'Pain complet', price: 2.4, category: 'Pains', unite: 'pièce', active: true },
    { id: 'p9', name: 'Pain au levain', price: 3.8, category: 'Pains', unite: 'pièce', active: true },
    { id: 'p10', name: 'Éclair au chocolat', price: 2.2, category: 'Pâtisseries', unite: 'pièce', active: true },
    { id: 'p11', name: 'Éclair à la vanille', price: 2.0, category: 'Pâtisseries', unite: 'pièce', active: true },
    { id: 'p12', name: 'Tarte au citron', price: 2.5, category: 'Pâtisseries', unite: 'pièce', active: true },
    { id: 'p13', name: 'Tarte aux fraises', price: 3.2, category: 'Pâtisseries', unite: 'pièce', active: true },
    { id: 'p14', name: 'Mille-feuille', price: 3.6, category: 'Pâtisseries', unite: 'pièce', active: true },
    { id: 'p15', name: 'Café à emporter', price: 1.5, category: 'Boissons', unite: 'pièce', active: true },
  ];

  const findPrice = (n: string) => products.find((p) => p.name === n)!.price;
  const item = (
    name: string,
    qty: number,
    freeQty = 0,
  ): OrderItem => ({
    productId: products.find((p) => p.name === name)!.id,
    name,
    price: findPrice(name),
    qty,
    freeQty,
  });

  const orders: Order[] = [
    {
      id: uid(),
      number: 312,
      clientName: 'Chloé Lambert',
      phone: '06 12 34 56 78',
      items: [item('Baguette tradition', 2), item('Croissant', 4)],
      pickupDate: t,
      pickupTime: '12:00',
      status: 'en_attente',
      paid: false,
      total: 2 * findPrice('Baguette tradition') + 4 * findPrice('Croissant'),
      createdAt: Date.now() - 1000 * 60 * 30,
    },
    {
      id: uid(),
      number: 313,
      clientName: 'Jenn',
      items: [
        item('Mille-feuille', 3),
        item('Éclair au chocolat', 2),
        item('Café à emporter', 1),
      ],
      pickupDate: t,
      pickupTime: '16:00',
      status: 'prete',
      paid: true,
      total:
        3 * findPrice('Mille-feuille') +
        2 * findPrice('Éclair au chocolat') +
        findPrice('Café à emporter'),
      createdAt: Date.now() - 1000 * 60 * 120,
    },
    {
      id: uid(),
      number: 310,
      clientName: 'Marie Fontaine',
      items: [item('Croissant', 6), item('Pain au chocolat', 4)],
      pickupDate: t,
      pickupTime: '09:30',
      status: 'en_cours',
      paid: false,
      total: 6 * findPrice('Croissant') + 4 * findPrice('Pain au chocolat'),
      createdAt: Date.now() - 1000 * 60 * 180,
    },
    {
      id: uid(),
      number: 311,
      clientName: 'Pierre Martin',
      items: [item('Baguette tradition', 3), item('Pain complet', 1)],
      pickupDate: t,
      pickupTime: '12:00',
      status: 'en_attente',
      paid: true,
      total: 3 * findPrice('Baguette tradition') + findPrice('Pain complet'),
      createdAt: Date.now() - 1000 * 60 * 90,
    },
    {
      id: uid(),
      number: 309,
      clientName: 'Sophie Durand',
      items: [item('Tarte aux fraises', 2), item('Éclair à la vanille', 3)],
      pickupDate: t,
      pickupTime: null,
      status: 'recuperee',
      paid: true,
      total: 2 * findPrice('Tarte aux fraises') + 3 * findPrice('Éclair à la vanille'),
      createdAt: Date.now() - 1000 * 60 * 240,
    },
    {
      id: uid(),
      number: 314,
      clientName: 'Atelier Hortus',
      phone: '06 99 88 77 66',
      items: [item('Pain au chocolat', 12)],
      pickupDate: tomorrow,
      pickupTime: '09:30',
      status: 'en_attente',
      paid: false,
      total: 12 * findPrice('Pain au chocolat'),
      note: 'Bien dorés, pour un événement entreprise',
      createdAt: Date.now() - 1000 * 60 * 60 * 5,
    },
    {
      id: uid(),
      number: 315,
      clientName: 'Marc Dupuy',
      items: [item('Tarte au citron', 1), item('Tarte aux fraises', 1)],
      pickupDate: addDays(t, 4),
      pickupTime: '15:00',
      status: 'en_attente',
      paid: false,
      total: findPrice('Tarte au citron') + findPrice('Tarte aux fraises'),
      createdAt: Date.now() - 1000 * 60 * 60 * 8,
    },
  ];

  return {
    products,
    orders,
    orderCounter: 316,
    shopName: 'Boulangerie Démo',
    ownerName: 'Jennifer Barret',
    customCategories: [],
  };
}

function load(): State {
  if (typeof window === 'undefined') return seed();
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return seed();
    const parsed = JSON.parse(raw) as Partial<State>;
    if (!parsed.products || !parsed.orders) return seed();
    return { ...seed(), ...parsed } as State;
  } catch {
    return seed();
  }
}

let state: State = load();
const listeners = new Set<() => void>();

function setState(updater: (s: State) => State) {
  state = updater(state);
  if (typeof window !== 'undefined') {
    try {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      /* quota / privacy mode */
    }
  }
  listeners.forEach((l) => l());
}

function subscribe(l: () => void) {
  listeners.add(l);
  return () => {
    listeners.delete(l);
  };
}

function getSnapshot() {
  return state;
}

export function useDemoStore<T>(selector: (s: State) => T): T {
  return useSyncExternalStore(
    subscribe,
    () => selector(getSnapshot()),
    () => selector(getSnapshot()),
  );
}

export function useCrossTabSync() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    const onStorage = (e: StorageEvent) => {
      if (e.key !== STORAGE_KEY || !e.newValue) return;
      try {
        const next = JSON.parse(e.newValue) as State;
        state = next;
        listeners.forEach((l) => l());
      } catch {
        /* ignore */
      }
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, []);
}

function recompute(items: OrderItem[]) {
  return items.reduce((acc, it) => acc + it.price * it.qty, 0);
}

export const actions = {
  addProduct(name: string, price: number, category: ProductCategory | string | undefined) {
    const product: Product = {
      id: uid(),
      name: name.trim(),
      price,
      category: category as ProductCategory,
      unite: 'pièce',
      active: true,
    };
    setState((s) => ({ ...s, products: [...s.products, product] }));
    return product;
  },
  addProducts(items: { name: string; price: number; category: ProductCategory | string }[]) {
    const newProducts: Product[] = items.map((item) => ({
      id: uid(),
      name: item.name.trim(),
      price: item.price,
      category: item.category as ProductCategory,
      unite: 'pièce',
      active: true,
    }));
    setState((s) => ({ ...s, products: [...s.products, ...newProducts] }));
    return newProducts;
  },
  addCustomCategory(name: string) {
    const trimmed = name.trim();
    if (!trimmed) return;
    setState((s) => ({
      ...s,
      customCategories: s.customCategories.includes(trimmed)
        ? s.customCategories
        : [...s.customCategories, trimmed],
    }));
  },
  updateProduct(id: string, patch: Partial<Omit<Product, 'id'>>) {
    setState((s) => ({
      ...s,
      products: s.products.map((p) => (p.id === id ? { ...p, ...patch } : p)),
    }));
  },
  deleteProduct(id: string) {
    setState((s) => ({ ...s, products: s.products.filter((p) => p.id !== id) }));
  },
  createOrder(input: {
    clientName: string;
    phone?: string;
    email?: string;
    items: OrderItem[];
    pickupDate: string;
    pickupTime: string | null;
    note?: string;
    paid: boolean;
  }) {
    const total = recompute(input.items);
    const order: Order = {
      id: uid(),
      number: state.orderCounter,
      clientName: input.clientName.trim() || 'Client comptoir',
      phone: input.phone?.trim() || undefined,
      email: input.email?.trim() || undefined,
      items: input.items,
      pickupDate: input.pickupDate,
      pickupTime: input.pickupTime,
      status: 'en_attente',
      paid: input.paid,
      total,
      note: input.note?.trim() || undefined,
      createdAt: Date.now(),
    };
    setState((s) => ({
      ...s,
      orders: [order, ...s.orders],
      orderCounter: s.orderCounter + 1,
    }));
    return order;
  },
  addOrderItem(orderId: string, item: OrderItem) {
    setState((s) => ({
      ...s,
      orders: s.orders.map((o) => {
        if (o.id !== orderId) return o;
        const newItems = [...o.items, item];
        return { ...o, items: newItems, total: recompute(newItems) };
      }),
    }));
  },
  setOrderStatus(id: string, status: OrderStatus) {
    setState((s) => ({
      ...s,
      orders: s.orders.map((o) => (o.id === id ? { ...o, status } : o)),
    }));
  },
  togglePaid(id: string) {
    setState((s) => ({
      ...s,
      orders: s.orders.map((o) =>
        o.id === id ? { ...o, paid: !o.paid } : o,
      ),
    }));
  },
  deleteOrder(id: string) {
    setState((s) => ({ ...s, orders: s.orders.filter((o) => o.id !== id) }));
  },
  reset() {
    setState(() => seed());
  },
};
