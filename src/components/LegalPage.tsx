import { Nav } from './Nav';
import { Footer } from './Footer';

export function MentionsLegales() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Nav />
      <main className="px-6 md:px-14 py-16 md:py-20 max-w-[800px] mx-auto">
        <h1 className="text-[32px] md:text-[40px] font-bold tracking-tighter leading-tight mb-10">
          Mentions légales
        </h1>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">1. Éditeur du site</h2>
          <p className="text-sm text-slate leading-relaxed mb-2">
            Le site <strong className="text-ink">mon-carnet-de-commandes.fr</strong> est édité par :
          </p>
          <ul className="text-sm text-slate leading-relaxed list-none space-y-1 pl-0">
            <li><strong className="text-ink">Nom :</strong> Jennifer BARRET</li>
            <li><strong className="text-ink">SIRET :</strong> 839 900 669 00046</li>
            <li><strong className="text-ink">Email :</strong> <a href="mailto:contact@mon-carnet-de-commande.fr" className="underline hover:text-ink">contact@mon-carnet-de-commande.fr</a></li>
            <li><strong className="text-ink">Téléphone :</strong> <a href="tel:+33663776013" className="underline hover:text-ink">06 63 77 60 13</a></li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">2. Directeur de la publication</h2>
          <p className="text-sm text-slate leading-relaxed">
            Jennifer BARRET.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">3. Hébergement</h2>
          <p className="text-sm text-slate leading-relaxed">
            Le site est hébergé par :
          </p>
          <ul className="text-sm text-slate leading-relaxed list-none space-y-1 pl-0 mt-2">
            <li><strong className="text-ink">LWS (Ligne Web Services)</strong></li>
            <li>10 rue de Penthièvre, 75008 Paris, France</li>
            <li>Site web : lws.fr</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">4. Propriété intellectuelle</h2>
          <p className="text-sm text-slate leading-relaxed">
            L'ensemble du contenu du site (textes, images, graphismes, logo, icônes, structure) est la propriété
            exclusive de Jennifer BARRET ou fait l'objet d'une autorisation d'utilisation. Toute reproduction,
            représentation, modification, publication ou adaptation de tout ou partie des éléments du site, quel
            que soit le moyen ou le procédé utilisé, est interdite sans autorisation écrite préalable.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">5. Limitation de responsabilité</h2>
          <p className="text-sm text-slate leading-relaxed">
            L'éditeur s'efforce de fournir des informations aussi précises que possible. Toutefois, il ne
            pourra être tenu responsable des omissions, des inexactitudes ou des carences dans la mise à jour,
            qu'elles soient de son fait ou du fait de tiers. L'éditeur ne saurait être tenu responsable des
            dommages directs ou indirects résultant de l'accès au site ou de l'utilisation de son contenu.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">6. Liens hypertextes</h2>
          <p className="text-sm text-slate leading-relaxed">
            Le site peut contenir des liens vers d'autres sites. L'éditeur n'exerce aucun contrôle sur ces
            sites et décline toute responsabilité quant à leur contenu.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">7. Droit applicable</h2>
          <p className="text-sm text-slate leading-relaxed">
            Les présentes mentions légales sont soumises au droit français. En cas de litige, les tribunaux
            de Lyon seront seuls compétents.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export function PolitiqueConfidentialite() {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <Nav />
      <main className="px-6 md:px-14 py-16 md:py-20 max-w-[800px] mx-auto">
        <h1 className="text-[32px] md:text-[40px] font-bold tracking-tighter leading-tight mb-10">
          Politique de confidentialité
        </h1>

        <p className="text-sm text-slate leading-relaxed mb-8">
          La présente politique de confidentialité décrit la manière dont Jennifer BARRET,
          éditrice du site <strong className="text-ink">mon-carnet-de-commandes.fr</strong> et de
          l'application <strong className="text-ink">Mon Carnet de Commandes</strong>, collecte, utilise et
          protège les données personnelles des utilisateurs, conformément au Règlement Général sur la
          Protection des Données (RGPD) et à la loi Informatique et Libertés.
        </p>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">1. Responsable du traitement</h2>
          <ul className="text-sm text-slate leading-relaxed list-none space-y-1 pl-0">
            <li><strong className="text-ink">Nom :</strong> Jennifer BARRET</li>
            <li><strong className="text-ink">Email :</strong> <a href="mailto:contact@mon-carnet-de-commande.fr" className="underline hover:text-ink">contact@mon-carnet-de-commande.fr</a></li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">2. Données collectées</h2>
          <p className="text-sm text-slate leading-relaxed mb-3">
            Nous pouvons être amenés à collecter les données suivantes :
          </p>

          <h3 className="text-base font-bold mb-2">a) Sur le site vitrine</h3>
          <ul className="text-sm text-slate leading-relaxed list-disc pl-5 space-y-1 mb-4">
            <li>Données de navigation anonymisées via Google Analytics (pages consultées, durée de visite, type d'appareil, localisation géographique approximative)</li>
            <li>Adresse IP (anonymisée par Google Analytics)</li>
          </ul>

          <h3 className="text-base font-bold mb-2">b) Sur l'application Mon Carnet de Commandes</h3>
          <ul className="text-sm text-slate leading-relaxed list-disc pl-5 space-y-1">
            <li>Nom, prénom, adresse email (lors de la création de compte)</li>
            <li>Nom de la boutique, adresse, numéro de téléphone</li>
            <li>Données relatives aux commandes (produits, clients, dates de retrait)</li>
            <li>Données de facturation le cas échéant</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">3. Finalités du traitement</h2>
          <ul className="text-sm text-slate leading-relaxed list-disc pl-5 space-y-1">
            <li>Fourniture et gestion du service Mon Carnet de Commandes</li>
            <li>Gestion des comptes utilisateurs</li>
            <li>Amélioration de l'expérience utilisateur et du service</li>
            <li>Mesure d'audience du site vitrine (Google Analytics)</li>
            <li>Communication commerciale (uniquement avec consentement)</li>
            <li>Respect des obligations légales et réglementaires</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">4. Base légale du traitement</h2>
          <ul className="text-sm text-slate leading-relaxed list-disc pl-5 space-y-1">
            <li><strong className="text-ink">Exécution du contrat :</strong> traitement des données nécessaires à la fourniture du service</li>
            <li><strong className="text-ink">Consentement :</strong> dépôt de cookies analytics, communications commerciales</li>
            <li><strong className="text-ink">Intérêt légitime :</strong> amélioration du service, sécurité</li>
            <li><strong className="text-ink">Obligation légale :</strong> conservation des données de facturation</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">5. Cookies</h2>
          <p className="text-sm text-slate leading-relaxed mb-3">
            Le site vitrine utilise Google Analytics pour mesurer l'audience. Ces cookies permettent
            de collecter des informations anonymisées sur la manière dont les visiteurs utilisent le site.
          </p>
          <p className="text-sm text-slate leading-relaxed mb-3">
            Types de cookies utilisés :
          </p>
          <ul className="text-sm text-slate leading-relaxed list-disc pl-5 space-y-1">
            <li><strong className="text-ink">Cookies de mesure d'audience :</strong> Google Analytics (_ga, _gid) -durée : 13 mois maximum</li>
            <li><strong className="text-ink">Cookies techniques :</strong> nécessaires au bon fonctionnement du site (aucune donnée personnelle)</li>
          </ul>
          <p className="text-sm text-slate leading-relaxed mt-3">
            Vous pouvez à tout moment désactiver les cookies via les paramètres de votre navigateur ou en
            utilisant l'outil de désactivation Google Analytics disponible à l'adresse :
            tools.google.com/dlpage/gaoptout.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">6. Durée de conservation</h2>
          <ul className="text-sm text-slate leading-relaxed list-disc pl-5 space-y-1">
            <li><strong className="text-ink">Données de compte :</strong> conservées pendant toute la durée d'utilisation du service, puis 3 ans après la dernière activité</li>
            <li><strong className="text-ink">Données de commandes :</strong> conservées pendant la durée d'utilisation du service</li>
            <li><strong className="text-ink">Données de facturation :</strong> conservées 10 ans (obligation légale comptable)</li>
            <li><strong className="text-ink">Cookies analytics :</strong> 13 mois maximum</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">7. Partage des données</h2>
          <p className="text-sm text-slate leading-relaxed mb-3">
            Vos données personnelles ne sont jamais vendues à des tiers. Elles peuvent être partagées avec :
          </p>
          <ul className="text-sm text-slate leading-relaxed list-disc pl-5 space-y-1">
            <li><strong className="text-ink">Supabase Inc.</strong> (hébergement base de données) -serveurs en Europe (Francfort, Allemagne)</li>
            <li><strong className="text-ink">LWS -Ligne Web Services</strong> (hébergement du site et de l'application) -France</li>
            <li><strong className="text-ink">Google LLC</strong> (analytics) -États-Unis, conforme aux CCT</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">8. Sécurité</h2>
          <p className="text-sm text-slate leading-relaxed">
            Nous mettons en œuvre les mesures techniques et organisationnelles appropriées pour protéger vos
            données personnelles contre tout accès non autorisé, perte, altération ou divulgation : chiffrement
            des données en transit (HTTPS/TLS), authentification sécurisée, accès restreint aux données.
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-xl font-bold mb-3">9. Vos droits</h2>
          <p className="text-sm text-slate leading-relaxed mb-3">
            Conformément au RGPD, vous disposez des droits suivants sur vos données personnelles :
          </p>
          <ul className="text-sm text-slate leading-relaxed list-disc pl-5 space-y-1">
            <li><strong className="text-ink">Droit d'accès :</strong> obtenir la confirmation que vos données sont traitées et en recevoir une copie</li>
            <li><strong className="text-ink">Droit de rectification :</strong> corriger des données inexactes ou incomplètes</li>
            <li><strong className="text-ink">Droit à l'effacement :</strong> demander la suppression de vos données</li>
            <li><strong className="text-ink">Droit à la portabilité :</strong> recevoir vos données dans un format structuré et lisible</li>
            <li><strong className="text-ink">Droit d'opposition :</strong> vous opposer au traitement de vos données</li>
            <li><strong className="text-ink">Droit à la limitation :</strong> demander la suspension du traitement</li>
          </ul>
          <p className="text-sm text-slate leading-relaxed mt-3">
            Pour exercer ces droits, contactez-nous à l'adresse : <a href="mailto:contact@mon-carnet-de-commande.fr" className="underline hover:text-ink">contact@mon-carnet-de-commande.fr</a>.
            Nous nous engageons à répondre dans un délai d'un mois.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-bold mb-3">10. Réclamation</h2>
          <p className="text-sm text-slate leading-relaxed">
            Si vous estimez que le traitement de vos données personnelles constitue une violation du RGPD,
            vous avez le droit d'introduire une réclamation auprès de la CNIL (Commission Nationale de
            l'Informatique et des Libertés) : <strong className="text-ink">cnil.fr</strong>.
          </p>
        </section>

        <p className="text-xs text-slate mt-10 pt-6 border-t border-line">
          Dernière mise à jour : mai 2026.
        </p>
      </main>
      <Footer />
    </div>
  );
}
