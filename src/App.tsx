import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { OnlineShop } from './components/OnlineShop';
import { Audience } from './components/Audience';
import { Pricing } from './components/Pricing';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { useHashRoute } from './lib/useHashRoute';
import { DemoApp } from './demo/DemoApp';
import { MentionsLegales, PolitiqueConfidentialite } from './components/LegalPage';

function Landing() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Nav />
      <main>
        <Hero />
        <Features />
        <OnlineShop />
        <Audience />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  const route = useHashRoute();
  if (route.startsWith('/demo')) return <DemoApp />;
  if (route === '/mentions-legales') return <MentionsLegales />;
  if (route === '/confidentialite') return <PolitiqueConfidentialite />;
  return <Landing />;
}
