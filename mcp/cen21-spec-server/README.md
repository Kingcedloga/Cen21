# Cen21 Spec MCP Server

Serveur MCP de référence pour le projet **Cen21 Hospitality**. Il expose le cahier des charges (charte, pages V1, filiales, périmètre V1/V2) à l’agent Cursor pendant le développement.

## Prérequis

- Node.js 18+
- npm

## Installation

```bash
cd mcp/cen21-spec-server
npm install
npm run build
```

Le build compile TypeScript et copie `src/spec/` et `src/content/` vers `dist/`.

## Configuration Cursor

Le fichier [`.cursor/mcp.json`](../../.cursor/mcp.json) à la racine du repo enregistre ce serveur :

```json
{
  "mcpServers": {
    "cen21-spec": {
      "command": "node",
      "args": ["mcp/cen21-spec-server/dist/index.js"]
    }
  }
}
```

Après `npm run build`, redémarrer Cursor ou recharger les serveurs MCP (Settings → MCP). Le serveur `cen21-spec` doit apparaître avec 6 outils et 7 ressources.

## Mode développement (sans build)

```bash
npm run dev
```

Pour tester en stdio localement, pointer temporairement `mcp.json` vers :

```json
"command": "npx",
"args": ["tsx", "mcp/cen21-spec-server/src/index.ts"]
```

(à exécuter depuis la racine du repo `Cen21-V1`)

## Outils MCP

| Outil | Description |
|-------|-------------|
| `get_design_tokens` | Palette, typographies, DA |
| `get_page_requirements` | Blocs par page (`home`, `about`, …) |
| `list_subsidiaries` | Filiales + note 8 vs 10 |
| `get_subsidiary_template` | Modèle page filiale (slug optionnel) |
| `get_feature_scope` | Périmètre `v1` ou `v2` |
| `search_spec` | Recherche dans le markdown du cahier |

## Ressources MCP

| URI | Contenu |
|-----|---------|
| `cen21://spec/full` | Cahier markdown complet |
| `cen21://spec/brand` | Charte graphique |
| `cen21://spec/pages` | Pages institutionnelles V1 |
| `cen21://spec/subsidiaries` | Multi-établissements |
| `cen21://spec/features-v1` | Fonctionnalités V1 |
| `cen21://spec/features-v2` | Réservations et V2 |
| `cen21://spec/tech` | Stack et contraintes |

## Mise à jour du cahier

1. Éditer `src/content/cahier-des-charges.md` pour le texte intégral.
2. Ajuster les JSON dans `src/spec/` pour les données structurées.
3. Relancer `npm run build`.

## Vérification rapide

```bash
npm run typecheck
npm run build
```

Dans Cursor, demander à l’agent d’appeler `get_design_tokens` — les couleurs `#0B2429` et `#C5A059` doivent être retournées.
