import { librarySecondaryEntryPointGenerator } from '@nrwl/angular/generators';
import { generateFiles, getWorkspaceLayout, logger, names, Tree } from '@nrwl/devkit';
import { join } from 'path';
import * as THREE from 'three';

export const helpers = [
    {
        name: THREE.ArrowHelper.name,
    },
    {
        name: THREE.AxesHelper.name,
    },
    {
        name: THREE.GridHelper.name,
    },
    {
        name: THREE.PolarGridHelper.name,
    },
];

export const objectHelpers = [
    {
        name: THREE.BoxHelper.name,
    },
    {
        name: THREE.Box3Helper.name,
        updateFn: 'updateMatrixWorld',
    },
    {
        name: THREE.CameraHelper.name,
    },
    {
        name: THREE.DirectionalLightHelper.name,
    },
    {
        name: THREE.HemisphereLightHelper.name,
    },
    {
        name: THREE.PlaneHelper.name,
        updateFn: 'updateMatrixWorld',
    },
    {
        name: THREE.PointLightHelper.name,
    },
    {
        name: THREE.SkeletonHelper.name,
    },
    {
        name: THREE.SpotLightHelper.name,
    },
];

export default async function helpersGenerator(tree: Tree, ngtVersion: string) {
    const { libsDir } = getWorkspaceLayout(tree);
    const helperDir = join(libsDir, 'angular-three', 'helpers');

    logger.log('Generating helpers...');

    if (!tree.exists(helperDir)) {
        await librarySecondaryEntryPointGenerator(tree, {
            name: 'helpers',
            library: 'angular-three',
            skipModule: true,
        });
    }

    const generatedHelpers = [];
    for (const helper of helpers) {
        const normalizedNames = names(helper.name);

        generateFiles(tree, join(__dirname, 'files/helpers'), join(helperDir, 'src', 'lib', normalizedNames.fileName), {
            ...normalizedNames,
            tmpl: '',
            ngtVersion,
        });

        generatedHelpers.push(normalizedNames.fileName);
    }

    const generatedObjectHelpers = [];
    for (const objectHelper of objectHelpers) {
        const normalizedNames = names(objectHelper.name);

        generateFiles(
            tree,
            join(__dirname, 'files/object-helpers'),
            join(helperDir, 'src', 'lib', normalizedNames.fileName),
            {
                updateFn: undefined,
                ...objectHelper,
                ...normalizedNames,
                tmpl: '',
                ngtVersion,
            }
        );

        generatedObjectHelpers.push(normalizedNames.fileName);
    }

    generateFiles(tree, join(__dirname, '../common/files/index'), join(helperDir, 'src'), {
        items: [...generatedHelpers, ...generatedObjectHelpers],
        tmpl: '',
        ngtVersion,
    });
}
