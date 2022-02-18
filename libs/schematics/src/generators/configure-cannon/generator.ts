import { webWorkerGenerator } from '@nrwl/angular/generators';
import {
    addDependenciesToPackageJson,
    formatFiles,
    installPackagesTask,
    logger,
    offsetFromRoot,
    readProjectConfiguration,
    Tree,
    updateJson,
    updateProjectConfiguration,
} from '@nrwl/devkit';
import { exec } from 'node:child_process';
import { join } from 'node:path';
import { ANGULAR_THREE_VERSION } from '../versions';
import { ConfigureCannonGeneratorSchema } from './schema';

export default async function (
    tree: Tree,
    options: ConfigureCannonGeneratorSchema
) {
    const projectConfiguration = readProjectConfiguration(
        tree,
        options.project
    );

    if (projectConfiguration.projectType !== 'application') {
        const error = `@angular-three/schematics:configure-cannon only works with Application-type projects`;
        logger.error(error);
        throw new Error(error);
    }

    logger.info(
        `Configuring @angular-three/cannon for "${options.project}"...`
    );

    addDependenciesToPackageJson(
        tree,
        {
            '@angular-three/cannon': ANGULAR_THREE_VERSION,
        },
        {}
    );

    const webWorkerTsConfig = join(
        projectConfiguration.root,
        'tsconfig.worker.json'
    );

    const isWorkerTsConfigExist = tree.exists(webWorkerTsConfig);

    if (isWorkerTsConfigExist) {
        logger.info(`
"tsconfig.worker.json" is found under ${options.project}.
Please make sure "include" property has a record for "@angular-three/cannon/**/worker.ts"
        `);
        return;
    }

    const isNx = tree.exists('nx.json');

    if (isNx) {
        await webWorkerGenerator(tree, {
            project: options.project,
            name: 'tmp',
            skipFormat: true,
            snippet: false,
        });
    } else {
        await exec(`npx ng g web-worker tmp --project=${options.project}`);
    }

    updateJson(tree, webWorkerTsConfig, (tsConfig) => {
        tsConfig['include'] = [
            `${offsetFromRoot(
                projectConfiguration.root
            )}node_modules/@angular-three/cannon/**/worker.ts`,
        ];

        return tsConfig;
    });

    tree.delete(join(projectConfiguration.sourceRoot, 'app/tmp.worker.ts'));

    updateProjectConfiguration(tree, options.project, {
        ...projectConfiguration,
        targets: {
            ...projectConfiguration.targets,
            build: {
                ...projectConfiguration.targets['build'],
                options: {
                    ...projectConfiguration.targets['build'].options,
                    webWorkerTsConfig,
                },
            },
        },
    });

    await formatFiles(tree);

    return () => {
        installPackagesTask(tree);
    };
}
