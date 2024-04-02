// @ts-check

import { default as Arborist } from "@npmcli/arborist";
import { setTimeout } from "node:timers/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = fileURLToPath(new URL('.', import.meta.url));

globalThis.arb = new Arborist({
  path: join(__dirname, 'npm-10-project'),
  '@foo:registry': 'https://registry.foo.com/',
});


globalThis.tree = await arb.loadVirtual();
console.info({ tree })


await setTimeout(600_000)
