export function formatEuro(n: number): string {
  return new Intl.NumberFormat('fr-FR', {
    style: 'currency',
    currency: 'EUR',
  }).format(n);
}

const DAYS = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.'];
const DAYS_LONG = [
  'dimanche',
  'lundi',
  'mardi',
  'mercredi',
  'jeudi',
  'vendredi',
  'samedi',
];
const MONTHS = [
  'janv.',
  'févr.',
  'mars',
  'avr.',
  'mai',
  'juin',
  'juil.',
  'août',
  'sept.',
  'oct.',
  'nov.',
  'déc.',
];
const MONTHS_LONG = [
  'janvier',
  'février',
  'mars',
  'avril',
  'mai',
  'juin',
  'juillet',
  'août',
  'septembre',
  'octobre',
  'novembre',
  'décembre',
];

export function parseDate(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(y, m - 1, d);
}

export function toISO(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(
    d.getDate(),
  ).padStart(2, '0')}`;
}

export function today(): string {
  return toISO(new Date());
}

export function tomorrow(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  return toISO(d);
}

export function addDays(iso: string, n: number): string {
  const d = parseDate(iso);
  d.setDate(d.getDate() + n);
  return toISO(d);
}

export function startOfWeek(iso: string): string {
  const d = parseDate(iso);
  const day = d.getDay() === 0 ? 7 : d.getDay(); // Monday = 1
  d.setDate(d.getDate() - (day - 1));
  return toISO(d);
}

export function endOfWeek(iso: string): string {
  return addDays(startOfWeek(iso), 6);
}

export function isSameDay(a: string, b: string): boolean {
  return a === b;
}

export function isBetween(iso: string, from: string, to: string): boolean {
  return iso >= from && iso <= to;
}

export function formatShortDay(iso: string): string {
  const d = parseDate(iso);
  return `${DAYS[d.getDay()]} ${d.getDate()}`;
}

export function formatLongDate(iso: string): string {
  const d = parseDate(iso);
  return `${DAYS_LONG[d.getDay()]} ${d.getDate()} ${MONTHS_LONG[d.getMonth()]}`;
}

export function formatLongDayMonth(iso: string): string {
  const d = parseDate(iso);
  return `${DAYS_LONG[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function formatMonthYear(d: Date): string {
  return `${MONTHS_LONG[d.getMonth()].replace(/^./, (c) => c.toUpperCase())} ${d.getFullYear()}`;
}

export function formatTime(t: string | null): string {
  if (!t) return '—';
  const [h, m] = t.split(':');
  return `${h}h${m}`;
}

export function relativeDayLabel(iso: string): string {
  const t = today();
  if (iso === t) return 'Aujourd’hui';
  if (iso === tomorrow()) return 'Demain';
  return formatShortDay(iso);
}

export function relativeDayLong(iso: string): string {
  const t = today();
  if (iso === t) return 'Aujourd’hui';
  if (iso === tomorrow()) return 'Demain';
  const d = parseDate(iso);
  return `${DAYS[d.getDay()]} ${d.getDate()} ${MONTHS[d.getMonth()]}`;
}

export function monthLabel(iso: string): string {
  const d = parseDate(iso);
  return `${MONTHS_LONG[d.getMonth()].replace(/^./, (c) => c.toUpperCase())} ${d.getFullYear()}`;
}
