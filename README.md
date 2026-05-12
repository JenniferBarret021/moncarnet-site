# Mon carnet de commandes — Site vitrine

Site marketing pour **Mon carnet de commandes**, l'application de prise et préparation de
commandes pour les commerces de proximité (boulangers, fleuristes, cavistes, boucheries,
fromageries…).

## Stack

- React 18 + Vite + TypeScript
- Tailwind CSS 3
- Police Inter (Google Fonts)
- Animations : IntersectionObserver + CSS (composant `FadeIn`)

## Démarrer

```bash
npm install
npm run dev
```

Le site est servi sur http://localhost:5173.

## Scripts

| Commande | Action |
|---|---|
| `npm run dev` | Serveur de développement |
| `npm run build` | Build de production dans `dist/` |
| `npm run preview` | Prévisualisation du build |
| `npm run lint` | Vérification TypeScript |

## Structure

```
src/
  components/
    ui/           Button, FadeIn
    Nav.tsx       Sticky nav + menu mobile
    Hero.tsx      Hero + AppPreview
    TabletMockup.tsx
    PhoneMockup.tsx
    TrustStrip.tsx
    Features.tsx
    Audience.tsx
    HowItWorks.tsx
    Testimonial.tsx
    Pricing.tsx
    FinalCTA.tsx
    Footer.tsx
    StackIcon.tsx Logo SVG signature
    Wordmark.tsx  "Mon carnet de commandes"
  App.tsx
  main.tsx
  index.css       Tailwind + reset
public/
  favicon.svg
  robots.txt
tailwind.config.ts Design tokens (couleurs, ombres, polices)
```

## Design tokens

Tout est dans [`tailwind.config.ts`](tailwind.config.ts) — couleurs (violet primaire, ink, paper, slate), ombres (`shadow-cta`, `shadow-device`), gradients (`bg-violet-gradient`, `bg-hero-glow`).
