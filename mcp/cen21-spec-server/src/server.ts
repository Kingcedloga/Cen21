import { McpServer } from "@modelcontextprotocol/sdk/server/mcp.js";
import type { CallToolResult } from "@modelcontextprotocol/sdk/types.js";
import { z } from "zod";

import {
  readCahierMarkdown,
  readSpecJson,
  searchInMarkdown,
} from "./load-spec.js";

const PAGE_IDS = [
  "home",
  "about",
  "subsidiaries",
  "events",
  "gallery",
  "contact",
] as const;

const pageSchema = z.enum(PAGE_IDS);
const versionSchema = z.enum(["v1", "v2"]);

const SERVER_INSTRUCTIONS = `Serveur de référence Cen21 Hospitality (cahier des charges).
Avant toute implémentation UI, appeler get_design_tokens.
Pour une page, utiliser get_page_requirements.
Ne pas implémenter la réservation (V2) sans demande explicite.
Respecter la palette (#0B2429, #C5A059, etc.) et les polices Cormorant Garamond / Inter.
Noter l'écart 8 filiales vs 10 établissements via list_subsidiaries.`;

function jsonText(data: unknown): CallToolResult {
  return {
    content: [{ type: "text", text: JSON.stringify(data, null, 2) }],
  };
}

export function createCen21SpecServer(): McpServer {
  const server = new McpServer(
    { name: "cen21-spec", version: "1.0.0" },
    { instructions: SERVER_INSTRUCTIONS },
  );

  server.registerResource(
    "spec-full",
    "cen21://spec/full",
    {
      title: "Cahier des charges complet",
      description: "Markdown intégral du cahier des charges Cen21 Hospitality",
      mimeType: "text/markdown",
    },
    async (uri) => ({
      contents: [{ uri: uri.href, text: readCahierMarkdown() }],
    }),
  );

  server.registerResource(
    "spec-brand",
    "cen21://spec/brand",
    {
      title: "Charte graphique et DA",
      mimeType: "application/json",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(readSpecJson("brand.json"), null, 2),
          mimeType: "application/json",
        },
      ],
    }),
  );

  server.registerResource(
    "spec-pages",
    "cen21://spec/pages",
    {
      title: "Pages V1",
      mimeType: "application/json",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(readSpecJson("pages.json"), null, 2),
          mimeType: "application/json",
        },
      ],
    }),
  );

  server.registerResource(
    "spec-subsidiaries",
    "cen21://spec/subsidiaries",
    {
      title: "Filiales et modèle multi-établissements",
      mimeType: "application/json",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(readSpecJson("subsidiaries.json"), null, 2),
          mimeType: "application/json",
        },
      ],
    }),
  );

  server.registerResource(
    "spec-features-v1",
    "cen21://spec/features-v1",
    {
      title: "Périmètre fonctionnel V1",
      mimeType: "application/json",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(readSpecJson("features-v1.json"), null, 2),
          mimeType: "application/json",
        },
      ],
    }),
  );

  server.registerResource(
    "spec-features-v2",
    "cen21://spec/features-v2",
    {
      title: "Périmètre fonctionnel V2",
      mimeType: "application/json",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(readSpecJson("features-v2.json"), null, 2),
          mimeType: "application/json",
        },
      ],
    }),
  );

  server.registerResource(
    "spec-tech",
    "cen21://spec/tech",
    {
      title: "Contraintes techniques",
      mimeType: "application/json",
    },
    async (uri) => ({
      contents: [
        {
          uri: uri.href,
          text: JSON.stringify(readSpecJson("tech.json"), null, 2),
          mimeType: "application/json",
        },
      ],
    }),
  );

  server.registerTool(
    "get_design_tokens",
    {
      title: "Tokens design Cen21",
      description:
        "Retourne la palette couleurs, typographies et principes de direction artistique du cahier des charges.",
      annotations: { readOnlyHint: true },
    },
    async (): Promise<CallToolResult> => jsonText(readSpecJson("brand.json")),
  );

  server.registerTool(
    "get_page_requirements",
    {
      title: "Exigences par page V1",
      description:
        "Objectifs et blocs attendus pour une page institutionnelle (home, about, subsidiaries, events, gallery, contact).",
      inputSchema: z.object({
        page: pageSchema.describe("Identifiant de la page"),
      }),
      annotations: { readOnlyHint: true },
    },
    async ({ page }): Promise<CallToolResult> => {
      const pages = readSpecJson<{ pages: Array<{ id: string }> }>("pages.json");
      const found = pages.pages.find((p) => p.id === page);
      if (!found) {
        return {
          content: [{ type: "text", text: `Page inconnue: ${page}` }],
          isError: true,
        };
      }
      return jsonText(found);
    },
  );

  server.registerTool(
    "list_subsidiaries",
    {
      title: "Liste des filiales",
      description:
        "Liste les filiales configurées et la note sur l'écart 8 vs 10 établissements.",
      annotations: { readOnlyHint: true },
    },
    async (): Promise<CallToolResult> => jsonText(readSpecJson("subsidiaries.json")),
  );

  server.registerTool(
    "get_subsidiary_template",
    {
      title: "Modèle page filiale",
      description:
        "Structure attendue pour une page filiale ; optionnellement filtrée par slug.",
      inputSchema: z.object({
        slug: z.string().optional().describe("Slug de la filiale (ex. filiale-01)"),
      }),
      annotations: { readOnlyHint: true },
    },
    async ({ slug }): Promise<CallToolResult> => {
      const data = readSpecJson<{
        subsidiaryPageTemplate: unknown;
        subsidiaries: Array<{ slug: string; name: string; sector: string }>;
      }>("subsidiaries.json");

      if (slug) {
        const sub = data.subsidiaries.find((s) => s.slug === slug);
        if (!sub) {
          return {
            content: [{ type: "text", text: `Filiale introuvable: ${slug}` }],
            isError: true,
          };
        }
        return jsonText({ template: data.subsidiaryPageTemplate, subsidiary: sub });
      }

      return jsonText({
        template: data.subsidiaryPageTemplate,
        subsidiaries: data.subsidiaries,
      });
    },
  );

  server.registerTool(
    "get_feature_scope",
    {
      title: "Périmètre V1 ou V2",
      description: "Fonctionnalités incluses, hors périmètre et notes pour v1 ou v2.",
      inputSchema: z.object({
        version: versionSchema.describe("Version du périmètre (v1 ou v2)"),
      }),
      annotations: { readOnlyHint: true },
    },
    async ({ version }): Promise<CallToolResult> => {
      const file = version === "v1" ? "features-v1.json" : "features-v2.json";
      const scope = readSpecJson(file);
      const meta = readSpecJson("meta.json");
      return jsonText({ version, scope, meta });
    },
  );

  server.registerTool(
    "search_spec",
    {
      title: "Recherche dans le cahier",
      description: "Recherche textuelle dans le markdown du cahier des charges.",
      inputSchema: z.object({
        query: z.string().min(1).describe("Terme à rechercher"),
      }),
      annotations: { readOnlyHint: true },
    },
    async ({ query }): Promise<CallToolResult> => {
      const matches = searchInMarkdown(query);
      return jsonText({ query, matchCount: matches.length, matches });
    },
  );

  return server;
}
