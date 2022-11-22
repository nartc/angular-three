import { librarySecondaryEntryPointGenerator } from '@nrwl/angular/generators';
import { generateFiles, getWorkspaceLayout, logger, names, Tree } from '@nrwl/devkit';
import { join } from 'path';
import * as THREE from 'three';
import { astFromPath, handleClassMembers, handleHeritage } from '../common/ast-utils';
import { isClassDeclaration, PropertyDeclaration, SourceFile } from 'typescript/lib/tsserverlibrary';

const baseLightDtsPath = 'node_modules/@types/three/src/lights/Light.d.ts';
export const lights = [
    {
        name: THREE.LightProbe.name,
        defPath: 'node_modules/@types/three/src/lights/LightProbe.d.ts',
    },
    {
        name: THREE.AmbientLight.name,
        defPath: 'node_modules/@types/three/src/lights/AmbientLight.d.ts',
    },
    {
        name: THREE.AmbientLightProbe.name,
        defPath: 'node_modules/@types/three/src/lights/AmbientLightProbe.d.ts',
    },
    {
        name: THREE.HemisphereLight.name,
        defPath: 'node_modules/@types/three/src/lights/HemisphereLight.d.ts',
    },
    {
        name: THREE.HemisphereLightProbe.name,
        defPath: 'node_modules/@types/three/src/lights/HemisphereLightProbe.d.ts',
    },
    {
        name: THREE.DirectionalLight.name,
        defPath: 'node_modules/@types/three/src/lights/DirectionalLight.d.ts',
    },
    {
        name: THREE.PointLight.name,
        defPath: 'node_modules/@types/three/src/lights/PointLight.d.ts',
    },
    {
        name: THREE.SpotLight.name,
        defPath: 'node_modules/@types/three/src/lights/SpotLight.d.ts',
    },
    {
        name: THREE.RectAreaLight.name,
        defPath: 'node_modules/@types/three/src/lights/RectAreaLight.d.ts',
    },
];

export default async function lightsGenerator(tree: Tree, ngtVersion: string) {
    const { libsDir } = getWorkspaceLayout(tree);
    const lightDir = join(libsDir, 'angular-three', 'lights');

    logger.log('Generating lights...');

    if (!tree.exists(lightDir)) {
        await librarySecondaryEntryPointGenerator(tree, {
            name: 'lights',
            library: 'angular-three',
            skipModule: true,
        });
    }

    const generatedLights = [];
    for (const light of lights) {
        const normalizedNames = names(light.name);

        const inputRecord = astFromPath(tree, light.defPath, (sourceFile) => {
            const properties = new Map();
            const bases = new Map();

            function runLightSourceFile(sF: SourceFile, props: Map<string, PropertyDeclaration>) {
                sF.forEachChild((node) => {
                    if (isClassDeclaration(node)) {
                        if (node.heritageClauses?.length) {
                            handleHeritage(
                                tree,
                                sF,
                                node,
                                (heritageName) =>
                                    heritageName === 'Light'
                                        ? baseLightDtsPath
                                        : lights.find((light) => light.name === heritageName)?.defPath,
                                bases,
                                runLightSourceFile
                            );
                        }

                        handleClassMembers(sF, node, props);
                    }
                });
            }

            runLightSourceFile(sourceFile, properties);

            return { properties, bases };
        });

        // const inputRecord = astFromPath(tree, light.defPath, (sourceFile) => {
        //     const mainParameters = [];
        //     const overrideOptional = {};
        //     sourceFile.forEachChild((node) => {
        //         if (isClassDeclaration(node)) {
        //             const nodeName = node.name.getText(sourceFile);
        //             for (const member of node.members) {
        //                 if (isConstructorDeclaration(member)) {
        //                     for (const parameter of member.parameters) {
        //                         const parameterName = parameter.name.getText(sourceFile);
        //                         if (['intensity', 'color', 'shadow'].includes(parameterName)) {
        //                             continue;
        //                         }
        //                         mainParameters.push(parameter);
        //                     }
        //                     continue;
        //                 }
        //
        //                 if (isPropertyDeclaration(member)) {
        //                     const memberName = member.name.getText(sourceFile);
        //                     if (
        //                         ['position', 'type', 'color', 'intensity', 'shadow', `is${nodeName}`].includes(
        //                             memberName
        //                         )
        //                     ) {
        //                         continue;
        //                     }
        //
        //                     if (
        //                         mainParameters.some(
        //                             (parameter: ParameterDeclaration) =>
        //                                 parameter.name.getText(sourceFile) === memberName
        //                         )
        //                     ) {
        //                         continue;
        //                     }
        //
        //                     mainParameters.push(member);
        //                     overrideOptional[memberName] = true;
        //                 }
        //             }
        //         }
        //     });
        //
        //     return { mainProperties: mainParameters, overrideOptional };
        // });

        generateFiles(tree, join(__dirname, 'files/lib'), join(lightDir, 'src', 'lib', normalizedNames.fileName), {
            ...normalizedNames,
            tmpl: '',
            ...inputRecord,
            ngtVersion,
        });

        generatedLights.push(normalizedNames.fileName);
    }

    generateFiles(tree, join(__dirname, '../common/files/index'), join(lightDir, 'src'), {
        items: generatedLights,
        tmpl: '',
        ngtVersion,
    });
}
