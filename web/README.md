# Cen21 Hospitality — Site web V1

Application Next.js (App Router, TypeScript, Tailwind CSS v4) pour la plateforme institutionnelle Cen21 Hospitality.

## Démarrage

```bash
cd web
npm install
npm run dev
```

Ouvrir [http://localhost:3000](http://localhost:3000).

## Build production

```bash
npm run build
npm start
```

## Contenu

Les contenus V1 sont dans `content/*.json`. Modifier ces fichiers puis reconstruire. La couche `lib/content.ts` est conçue pour être remplacée par un CMS (Payload, Sanity) ultérieurement.

## Contact (production)

Par défaut, en développement les messages sont loggés en console. En production, définir :

```bash
CONTACT_WEBHOOK_URL=https://your-webhook-endpoint
```

Le formulaire inclut un champ honeypot anti-spam et un rate limit (5 req/min/IP).

## URL du site (SEO)

Définir `NEXT_PUBLIC_SITE_URL` dans `.env.local` (voir `.env.example`) pour que `metadataBase`, le `sitemap.xml` et `robots.txt` utilisent votre domaine réel. Les pages **Mentions légales**, **Confidentialité** et **Cookies** sont des modèles à compléter avec votre conseil / infos hébergeur.

## Charte

Voir [`../design-system/MASTER.md`](../design-system/MASTER.md) et le MCP `cen21-spec` du repo.

## Périmètre V1

- 6 pages institutionnelles + 10 pages filiales
- Galerie (filtres, lightbox) et événements (filtres, archives)
- Pas de réservation (V2)
