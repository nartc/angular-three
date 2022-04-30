import { readJsonFile } from "nx/src/utils/fileutils.js";
import { readCachedProjectGraph } from "nx/src/project-graph/project-graph.js";
import { updateJsonFile } from "@nrwl/workspace";
import { existsSync } from "fs";
import { logger } from "@nrwl/devkit";

const versionJson = readJsonFile('version.json');
const version = versionJson.version;

const workspaceJson = readJsonFile('workspace.json');
const projects = Object.keys(workspaceJson.projects).filter(projectKey => !projectKey.includes('e2e'))

const projectGraph = readCachedProjectGraph();

for (const projectName of projects) {
    const projectConfiguration = projectGraph.nodes[projectName];

    if (!projectConfiguration) continue;

    const canPublish = !!projectConfiguration.data.targets['publish'];

    if (!canPublish) continue;

    const outputPath = projectConfiguration.data.targets['build']?.options?.outputPath || projectConfiguration.data.targets['build']?.outputs?.[0];

    if (!outputPath) continue;

    const packageJsonPath = `${outputPath}/package.json`;

    if (!existsSync(packageJsonPath)) continue;

    updateJsonFile(packageJsonPath, json => {
        json.version = version;
        return json;
    });

    logger.info(`✅ Updated ${projectName} version to ${version}`);
}
