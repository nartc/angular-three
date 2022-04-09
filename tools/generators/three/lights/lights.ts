import { librarySecondaryEntryPointGenerator } from '@nrwl/angular/generators';
import {
    formatFiles,
    generateFiles,
    getWorkspaceLayout,
    logger,
    names,
    Tree,
} from '@nrwl/devkit';
import { join } from 'path';
import * as THREE from 'three';
import {
    isClassDeclaration,
    isConstructorDeclaration,
    isPropertyDeclaration,
    ParameterDeclaration,
} from 'typescript/lib/tsserverlibrary';
import { astFromPath } from '../ast-utils';

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
        defPath:
            'node_modules/@types/three/src/lights/HemisphereLightProbe.d.ts',
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

export default async function lightsGenerator(tree: Tree): Promise<string[]> {
    const { libsDir } = getWorkspaceLayout(tree);
    const lightDir = join(libsDir, 'core', 'lights');

    logger.log('Generating lights...');

    if (!tree.exists(lightDir)) {
        await librarySecondaryEntryPointGenerator(tree, {
            name: 'lights',
            library: 'core',
            skipModule: true,
        });
    }

    const generatedLights = [];
    for (const light of lights) {
        const normalizedNames = names(light.name);

        const inputRecord = astFromPath(tree, light.defPath, (sourceFile) => {
            const mainParameters = [];
            const overrideOptional = {};
            sourceFile.forEachChild((node) => {
                if (isClassDeclaration(node)) {
                    const nodeName = node.name.getText(sourceFile);
                    for (const member of node.members) {
                        if (isConstructorDeclaration(member)) {
                            for (const parameter of member.parameters) {
                                const parameterName =
                                    parameter.name.getText(sourceFile);
                                if (
                                    ['intensity', 'color'].includes(
                                        parameterName
                                    )
                                ) {
                                    continue;
                                }
                                mainParameters.push(parameter);
                            }
                            continue;
                        }

                        if (isPropertyDeclaration(member)) {
                            const memberName = member.name.getText(sourceFile);
                            if (
                                [
                                    'position',
                                    'type',
                                    'color',
                                    'intensity',
                                    `is${nodeName}`,
                                ].includes(memberName)
                            ) {
                                continue;
                            }

                            if (
                                mainParameters.some(
                                    (parameter: ParameterDeclaration) =>
                                        parameter.name.getText(sourceFile) ===
                                        memberName
                                )
                            ) {
                                continue;
                            }

                            mainParameters.push(member);
                            overrideOptional[memberName] = true;
                        }
                    }
                }
            });

            return { mainProperties: mainParameters, overrideOptional };
        });

        const inputs = Object.entries(inputRecord).map(
            ([inputName, inputInfo]) => ({
                name: inputName,
                ...inputInfo,
            })
        );

        generateFiles(
            tree,
            join(__dirname, 'files/lib'),
            join(lightDir, 'src', 'lib', normalizedNames.fileName),
            {
                ...normalizedNames,
                tmpl: '',
                inputs,
                hasInput: inputs.length > 0,
            }
        );

        generatedLights.push(normalizedNames.fileName);
    }

    generateFiles(tree, join(__dirname, 'files/index'), join(lightDir, 'src'), {
        items: generatedLights,
        tmpl: '',
    });

    await formatFiles(tree);

    return generatedLights;
}
