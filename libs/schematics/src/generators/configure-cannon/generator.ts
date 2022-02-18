import {
    addDependenciesToPackageJson,
    formatFiles,
    installPackagesTask,
    logger,
    offsetFromRoot,
    readProjectConfiguration,
    Tree,
    updateProjectConfiguration,
} from '@nrwl/devkit';
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
    const offset = offsetFromRoot(projectConfiguration.root);

    if (isNx) {
        options.rootTsConfig =
            options.rootTsConfig || `${offset}tsconfig.base.json`;
    } else {
        options.rootTsConfig = options.rootTsConfig || `${offset}tsconfig.json`;
    }

    tree.write(
        webWorkerTsConfig,
        `/* To learn more about this file see: https://angular.io/config/tsconfig. */
{
  "extends": "${options.rootTsConfig}",
  "compilerOptions": {
    "outDir": "./out-tsc/worker",
    "lib": [
      "es2018",
      "webworker"
    ],
    "types": []
  },
  "include": [
    "${offset}node_modules/@angular-three/cannon/**/worker.ts"
  ]
}`
    );

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
