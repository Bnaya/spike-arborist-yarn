// @ts-check

import {
  Configuration,
  Project,
  ThrowReport,
  LightReport,
  Cache,
  InstallMode,
} from "@yarnpkg/core";
import * as pluginNpm from "@yarnpkg/plugin-npm";
import { npath } from "@yarnpkg/fslib";
import { join } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = fileURLToPath(new URL('.', import.meta.url));

const yarn4ProjectRoot = join(__dirname, 'yarn-4-project');


const cwd = npath.toPortablePath(yarn4ProjectRoot);

const configuration = await Configuration.find(
  cwd,
  {
    modules: new Map([["@yarnpkg/plugin-npm", pluginNpm.default]]),
    plugins: new Set(["@yarnpkg/plugin-npm"]),
  },
  { strict: false }
);

if (!configuration.projectCwd) throw new Error();

const resolver = configuration.makeResolver();
const fetcher = configuration.makeFetcher();

const reporter = new LightReport({ configuration, stdout: process.stdout });

const cache = await Cache.find(configuration);

const { project: projectWithoutDevDeps, workspace } = await Project.find(
  configuration,
  configuration.projectCwd
);
if (!workspace) throw new Error();

workspace.manifest.devDependencies.clear();

for (const workspace of projectWithoutDevDeps.workspaces) {
  workspace.manifest.devDependencies.clear();
}

await projectWithoutDevDeps.resolveEverything({
  lockfileOnly: true,
  report: reporter,
});

workspace.manifest.devDependencies.clear();

for (const workspace of projectWithoutDevDeps.workspaces) {
  workspace.manifest.devDependencies.clear();
}

// webpack and it's deps will still be here
projectWithoutDevDeps.originalPackages

// this will fetch also webpack :( if you debug it you will see
await projectWithoutDevDeps.fetchEverything({
  cache,
  report: reporter,
  persistProject: false,
  mode: InstallMode.SkipBuild,
});

projectWithoutDevDeps.toString();
projectWithoutDevDeps.originalPackages;

// Webpack will still be here
projectWithoutDevDeps.storedPackages;
