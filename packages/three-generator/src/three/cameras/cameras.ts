import { librarySecondaryEntryPointGenerator } from '@nrwl/angular/generators';
import { generateFiles, getWorkspaceLayout, logger, names, Tree } from '@nrwl/devkit';
import { join } from 'path';
import * as THREE from 'three';
import { astFromPath, handleClassMembers, handleHeritage } from '../common/ast-utils';
import { isClassDeclaration, PropertyDeclaration, SourceFile } from 'typescript/lib/tsserverlibrary';

const baseCameraDtsPath = 'node_modules/@types/three/src/cameras/Camera.d.ts';
export const cameras = [
    {
        name: THREE.PerspectiveCamera.name,
        defPath: 'node_modules/@types/three/src/cameras/PerspectiveCamera.d.ts',
    },
    {
        name: THREE.OrthographicCamera.name,
        defPath: 'node_modules/@types/three/src/cameras/OrthographicCamera.d.ts',
    },
    {
        name: THREE.ArrayCamera.name,
        defPath: 'node_modules/@types/three/src/cameras/ArrayCamera.d.ts',
    },
    {
        name: THREE.StereoCamera.name,
        defPath: 'node_modules/@types/three/src/cameras/StereoCamera.d.ts',
    },
    {
        name: THREE.CubeCamera.name,
        defPath: 'node_modules/@types/three/src/cameras/CubeCamera.d.ts',
        isArgsRequired: true,
    },
];

export default async function camerasGenerator(tree: Tree, ngtVersion: string) {
    const { libsDir } = getWorkspaceLayout(tree);
    const cameraDir = join(libsDir, 'angular-three', 'cameras');

    logger.log('Generating cameras...');

    if (!tree.exists(cameraDir)) {
        await librarySecondaryEntryPointGenerator(tree, {
            name: 'cameras',
            library: 'angular-three',
            skipModule: true,
        });
    }

    let hasObject3D = false;
    const generatedCameras = [];
    for (const { name, defPath, isArgsRequired } of cameras) {
        const normalizedNames = names(name);

        const inputRecord = astFromPath(tree, defPath, (sourceFile) => {
            const properties = new Map();
            const bases = new Map();

            function runCameraSourceFile(sF: SourceFile, props: Map<string, PropertyDeclaration>) {
                sF.forEachChild((node) => {
                    if (isClassDeclaration(node)) {
                        if (node.heritageClauses?.length) {
                            handleHeritage(
                                tree,
                                sF,
                                node,
                                (heritageName) =>
                                    heritageName === 'Camera'
                                        ? baseCameraDtsPath
                                        : cameras.find((camera) => camera.name === heritageName)?.defPath,
                                bases,
                                runCameraSourceFile
                            );
                        }

                        handleClassMembers(sF, node, props, true);
                    }
                });
            }

            runCameraSourceFile(sourceFile, properties);

            return { properties, bases };
        });

        if (!hasObject3D) {
            hasObject3D = inputRecord.hasObject3D;
        }

        generateFiles(tree, join(__dirname, 'files/lib'), join(cameraDir, 'src', 'lib', normalizedNames.fileName), {
            ...normalizedNames,
            tmpl: '',
            ...inputRecord,
            isArgsRequired,
            ngtVersion,
        });

        generatedCameras.push(normalizedNames.fileName);
    }

    generateFiles(tree, join(__dirname, '../common/files/index'), join(cameraDir, 'src'), {
        items: generatedCameras,
        tmpl: '',
        ngtVersion,
    });

    generateFiles(tree, join(__dirname, '../common/files/inputs-outputs'), join(cameraDir, 'src/lib'), {
        tmpl: '',
        ngtVersion,
        hasObject3D,
    });
}
