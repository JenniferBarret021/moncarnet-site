import { Nav } from './components/Nav';
import { Hero } from './components/Hero';
import { Features } from './components/Features';
import { Audience } from './components/Audience';
import { HowItWorks } from './components/HowItWorks';
import { Pricing } from './components/Pricing';
import { FinalCTA } from './components/FinalCTA';
import { Footer } from './components/Footer';
import { useHashRoute } from './lib/useHashRoute';
import { DemoApp } from './demo/DemoApp';

function Landing() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Nav />
      <main>
        <Hero />
        <Features />
        <Audience />
        <HowItWorks />
        <Pricing />
        <FinalCTA />
      </main>
      <Footer />
    </div>
  );
}

export default function App() {
  const route = useHashRoute();
  if (route.startsWith('/demo')) {
    return <DemoApp />;
  }
  return <Landing />;
}
