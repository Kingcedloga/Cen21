#!/usr/bin/env node
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";

import { createCen21SpecServer } from "./server.js";

async function main(): Promise<void> {
  const server = createCen21SpecServer();
  const transport = new StdioServerTransport();
  await server.connect(transport);
}

main().catch((error) => {
  console.error("cen21-spec-server failed:", error);
  process.exit(1);
});
