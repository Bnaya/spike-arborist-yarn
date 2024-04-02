// @ts-check

import {
  Configuration,
  Project,
  ThrowReport,
  LightReport,
  Cache,
  InstallMode,
  WorkspaceResolver,
  LockfileResolver,
} from "@yarnpkg/core";
import * as pluginNpm from "@yarnpkg/plugin-npm";
import * as nodeModules from "@yarnpkg/plugin-nm";

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
    modules: new Map(
        [
            ["@yarnpkg/plugin-npm", pluginNpm.default],
            ["@yarnpkg/plugin-nm", nodeModules.default],
        ]
        ),
    plugins: new Set(["@yarnpkg/plugin-npm", "@yarnpkg/plugin-nm"]),
  },
  { strict: false }
);

// const nodeLinker = configuration.get('nodeLinker');
// console.info({ nodeLinker })


if (!configuration.projectCwd) throw new Error();

// const resolver = configuration.makeResolver();
// const fetcher = configuration.makeFetcher();

const reporter = new LightReport({ configuration, stdout: process.stdout });

const cache = await Cache.find(configuration);

const { project: projectWithoutDevDeps, workspace } = await Project.find(
  configuration,
  configuration.projectCwd
);

const projectWithAllDeps = await Project.find(
  configuration,
  configuration.projectCwd
);


if (!workspace) throw new Error();
if (!projectWithAllDeps.workspace) throw new Error();

for (const workspace of projectWithoutDevDeps.workspaces) {
  workspace.manifest.devDependencies.clear();
}

await projectWithoutDevDeps.resolveEverything({
  lockfileOnly: false,
  report: reporter,
  cache
});

await projectWithAllDeps.project.resolveEverything({
  lockfileOnly: true,
  report: reporter,
});

projectWithoutDevDeps.originalPackages
projectWithoutDevDeps.storedPackages;

projectWithAllDeps.project.originalPackages
projectWithAllDeps.project.storedPackages;

console.info('Done');
