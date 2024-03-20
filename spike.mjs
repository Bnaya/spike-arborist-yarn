// @ts-check

// import { LockfileResolver, Project } from "@yarnpkg/core";
// import { PortablePath, VirtualFS } from "@yarnpkg/fslib";
import { default as Arborist } from "@npmcli/arborist";
import { setTimeout } from "node:timers/promises";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = fileURLToPath(new URL('.', import.meta.url));

// PortablePath

// toPortablePath()

// const proj = new Project(resolve('.'));

// const res = new Resolver();

globalThis.arb = new Arborist({
  // path: '/Users/bnaya/dev/__DIR__/platform',
  path: join(__dirname, 'yarn-4-project'),
  '@foo:registry': 'https://registry.foo.com/',
});


globalThis.tree = await arb.loadVirtual();
console.info({ tree })


await setTimeout(600_000)
