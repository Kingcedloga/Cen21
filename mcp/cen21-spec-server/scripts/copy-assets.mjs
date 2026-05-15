import { cpSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");

mkdirSync(join(dist, "spec"), { recursive: true });
mkdirSync(join(dist, "content"), { recursive: true });

cpSync(join(root, "src", "spec"), join(dist, "spec"), { recursive: true });
cpSync(join(root, "src", "content"), join(dist, "content"), { recursive: true });
