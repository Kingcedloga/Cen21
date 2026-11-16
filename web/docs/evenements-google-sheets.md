# Agenda des maisons — Google Sheets

Les événements du site (accueil, page Événements, page de chaque maison) se
gèrent dans une feuille Google Sheets : **une ligne = un événement**. Le site
relit la feuille toutes les 10 minutes, sans redéploiement.

---

## 1. Mise en place (une seule fois)

1. **Créer la feuille** : Google Sheets → Fichier → Importer →
   `docs/evenements-import.csv` (« Remplacer la feuille de calcul »). Les 39
   événements actuels du site y sont déjà.
2. **Publier en CSV** : Fichier → Partager → **Publier sur le Web** → choisir
   l'onglet des événements et le format **Valeurs séparées par des virgules
   (.csv)** → Publier. Copier le lien obtenu
   (`https://docs.google.com/spreadsheets/d/e/…/pub?gid=…&single=true&output=csv`).
3. **Vercel** → le projet → Settings → **Environment Variables**, ajouter
   (environnement **Production**, et Preview si besoin) :
   - `EVENTS_SHEET_CSV_URL` = le lien CSV de l'étape 2 ;
   - `EVENTS_PUBLISH_KEY` = un mot de passe long et aléatoire (sert au lien
     « Publier maintenant »).
4. Redéployer une dernière fois (Deployments → dernier déploiement → ⋯ →
   **Redeploy**) : Vercel ne prend les nouvelles variables qu'au déploiement
   suivant. Ensuite, plus besoin de toucher au code.
5. **Partager la feuille** (bouton Partager, en « Éditeur ») avec les
   personnes de chaque maison qui gèrent l'agenda.

> Sans `EVENTS_SHEET_CSV_URL`, le site continue d'utiliser
> `content/fr|en/events.json` comme avant.

---

## 2. Remplir la feuille (équipes des maisons)

| Colonne | Obligatoire | Exemple | Remarques |
|---|---|---|---|
| `publie` | non | `oui` | `non` ou `brouillon` : la ligne est ignorée (préparer un événement à l'avance). Vide = publié. |
| `maison` | **oui** | `Millionaire Club` | Le nom de la maison tel qu'il apparaît sur le site. |
| `date` | **oui** | `15/12/2026` | Format jour/mois/année ou `2026-12-15`. |
| `heure` | non | `23:00` ou `23h` | Vide = 20:00. |
| `titre_fr` | **oui** | `Soirée Gold` | |
| `titre_en` | non | `Gold Night` | Vide = le titre français est repris. |
| `titre_court` | non | `Urban Wednesday` | Libellé court des affiches (Millionaire Club). |
| `resume_fr` | non | `DJ set et cocktails…` | Une ou deux phrases. |
| `resume_en` | non | `DJ set and cocktails…` | Vide = le résumé français est repris. |
| `lieu` | non | `Wabi Sabi, Gombe — Kinshasa` | Vide = nom et adresse de la maison. |
| `image` | non | lien Google Drive | Voir ci-dessous. Vide = photo de la maison. |
| `statut` | non | `complet` | `complet`, `vip` ou `à venir`. |
| `id` | non | `evt-mc-1` | Ne pas modifier les id existants. Vide = généré automatiquement. |

- **Événement passé** : rien à faire. Le site le range automatiquement dans
  « Éditions passées » une fois la date dépassée. On peut supprimer la ligne
  plus tard pour alléger la liste.
- **Annuler un événement** : mettre `non` dans `publie` (ou supprimer la ligne).
- **Ne pas renommer ni déplacer la première ligne** (les en-têtes).

### Les images

- **Google Drive** : déposer l'affiche dans un dossier Drive, clic droit →
  Partager → « Tous les utilisateurs disposant du lien » → Copier le lien, et
  le coller dans la colonne `image`.
- **Image déjà sur le site** : chemin commençant par `/`, par exemple
  `/events/eventMoka1.jpeg`.
- Format conseillé : JPG, 1600 px de large, moins de 1 Mo.
- Un lien d'un autre site (Instagram, Facebook…) n'est pas accepté : la photo
  de la maison s'affiche à la place.

---

## 3. Quand le site se met-il à jour ?

- **Automatiquement** : en 10 à 15 minutes (Google republie la feuille en
  quelques minutes, puis le site la relit toutes les 10 minutes).
- **Tout de suite** : ouvrir le lien
  `https://<site>/api/evenements/publier?cle=<EVENTS_PUBLISH_KEY>`.
  La page indique combien d'événements ont été lus et **liste les lignes à
  corriger** (maison inconnue, date illisible, image refusée). Utile à
  garder en favori.

Si la feuille est inaccessible (dépublication, erreur Google), le site garde
le dernier agenda valide : il n'affiche jamais de page d'erreur.

### Option : un menu « Publier sur le site » dans la feuille

Extensions → Apps Script, coller le code ci-dessous (remplacer l'adresse et
la clé), enregistrer, puis recharger la feuille : un menu **Site** apparaît.

```js
const PUBLISH_URL = "https://<site>/api/evenements/publier?cle=<EVENTS_PUBLISH_KEY>";

function onOpen() {
  SpreadsheetApp.getUi().createMenu("Site").addItem("Publier l'agenda maintenant", "publish").addToUi();
}

function publish() {
  SpreadsheetApp.flush();
  Utilities.sleep(2000);
  const response = UrlFetchApp.fetch(PUBLISH_URL, { muteHttpExceptions: true });
  SpreadsheetApp.getUi().alert(response.getContentText());
}
```

---

## Pour les développeurs

- Lecture et validation : `lib/events-sheet.ts` (colonnes, formats acceptés,
  liens Drive, hôtes d'images autorisés repris par `next.config.ts`).
- Récupération et cache : `getEvents` / `getPastEvents` dans `lib/content.ts`
  (`fetch` avec `revalidate: 600` et le tag `events`).
- Publication immédiate : `app/api/evenements/publier/route.ts`
  (`revalidateTag("events", { expire: 0 })`).
