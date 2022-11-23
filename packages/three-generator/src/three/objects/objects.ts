import * as THREE from 'three';
import { generateFiles, getWorkspaceLayout, logger, names, Tree } from '@nrwl/devkit';
import { join } from 'path';
import { librarySecondaryEntryPointGenerator } from '@nrwl/angular/generators';
import { astFromPath, handleClassMembers, handleHeritage } from '../common/ast-utils';
import { isClassDeclaration, PropertyDeclaration, SourceFile } from 'typescript/lib/tsserverlibrary';

const objects = [
    {
        name: THREE.Bone.name,
        defPath: 'node_modules/@types/three/src/objects/Bone.d.ts',
    },
    {
        name: THREE.Group.name,
        defPath: 'node_modules/@types/three/src/objects/Group.d.ts',
    },
    {
        name: THREE.InstancedMesh.name,
        defPath: 'node_modules/@types/three/src/objects/InstancedMesh.d.ts',
        proxyOptions: {
            created: '(instance) => instance.instanceMatrix.setUsage(THREE.DynamicDrawUsage)',
        },
        args: {
            optionalArgs: '[undefined, undefined, 0]',
        },
    },
    {
        name: THREE.Line.name,
        defPath: 'node_modules/@types/three/src/objects/Line.d.ts',
    },
    {
        name: THREE.LineLoop.name,
        defPath: 'node_modules/@types/three/src/objects/LineLoop.d.ts',
    },
    {
        name: THREE.LineSegments.name,
        defPath: 'node_modules/@types/three/src/objects/LineSegments.d.ts',
    },
    {
        name: THREE.LOD.name,
        defPath: 'node_modules/@types/three/src/objects/LOD.d.ts',
    },
    {
        name: THREE.Mesh.name,
        defPath: 'node_modules/@types/three/src/objects/Mesh.d.ts',
    },
    {
        name: THREE.Points.name,
        defPath: 'node_modules/@types/three/src/objects/Points.d.ts',
    },
    {
        name: THREE.Skeleton.name,
        defPath: 'node_modules/@types/three/src/objects/Skeleton.d.ts',
        args: {},
        proxyOptions: {
            attach: `
(parent, child) => {
    if (!(parent.value instanceof THREE.SkinnedMesh)) {
        console.error('<ngt-skeleton> can only be used as a child of <ngt-skinned-mesh>');
        return;
    }

    parent.value.bind(child.value);

    return () => {
        child.value.dispose();
    };
}`,
        },
    },
    {
        name: THREE.SkinnedMesh.name,
        defPath: 'node_modules/@types/three/src/objects/SkinnedMesh.d.ts',
    },
    {
        name: THREE.Sprite.name,
        defPath: 'node_modules/@types/three/src/objects/Sprite.d.ts',
    },
];

export default async function objectsGenerator(tree: Tree, ngtVersion: string) {
    const { libsDir } = getWorkspaceLayout(tree);
    const objectDir = join(libsDir, 'angular-three', 'objects');

    logger.log('Generating objects...');

    if (!tree.exists(objectDir)) {
        await librarySecondaryEntryPointGenerator(tree, {
            name: 'objects',
            library: 'angular-three',
            skipModule: true,
        });
    }

    let hasObject3D = false;
    const generatedObjects = [];
    for (const { name, defPath, proxyOptions = undefined, args = undefined } of objects) {
        const normalizedNames = names(name);

        const inputRecord = astFromPath(tree, defPath, (sourceFile) => {
            const properties = new Map();
            const bases = new Map();

            function runObjectSourceFile(sF: SourceFile, props: Map<string, PropertyDeclaration>) {
                sF.forEachChild((node) => {
                    if (isClassDeclaration(node)) {
                        if (node.heritageClauses?.length) {
                            handleHeritage(
                                tree,
                                sF,
                                node,
                                (heritageName) => objects.find((object) => object.name === heritageName)?.defPath,
                                bases,
                                runObjectSourceFile
                            );
                        }

                        handleClassMembers(sF, node, props, true);
                    }
                });
            }

            runObjectSourceFile(sourceFile, properties);

            return { properties, bases };
        });

        if (!hasObject3D) {
            hasObject3D = inputRecord.hasObject3D;
        }

        generateFiles(tree, join(__dirname, 'files/lib'), join(objectDir, 'src', 'lib', normalizedNames.fileName), {
            ...normalizedNames,
            tmpl: '',
            ...inputRecord,
            proxyOptions,
            args,
            ngtVersion,
        });

        generatedObjects.push(normalizedNames.fileName);
    }

    generateFiles(tree, join(__dirname, '../common/files/index'), join(objectDir, 'src'), {
        items: generatedObjects,
        tmpl: '',
        ngtVersion,
    });

    generateFiles(tree, join(__dirname, '../common/files/inputs-outputs'), join(objectDir, 'src/lib'), {
        tmpl: '',
        ngtVersion,
        hasObject3D,
    });
}
