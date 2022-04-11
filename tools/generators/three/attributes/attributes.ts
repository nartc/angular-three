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
    ParameterDeclaration,
    PropertySignature,
    SourceFile,
} from 'typescript/lib/tsserverlibrary';
import { astFromPath, pathToSourceFile } from '../ast-utils';

export const attributes = [
    THREE.BufferAttribute.name,
    THREE.InstancedBufferAttribute.name,
    THREE.InterleavedBufferAttribute.name,
    THREE.Float16BufferAttribute.name,
    THREE.Float32BufferAttribute.name,
    THREE.Float64BufferAttribute.name,
    THREE.Int8BufferAttribute.name,
    THREE.Int16BufferAttribute.name,
    THREE.Int32BufferAttribute.name,
    THREE.Uint8BufferAttribute.name,
    THREE.Uint16BufferAttribute.name,
    THREE.Uint32BufferAttribute.name,
    THREE.Uint8ClampedBufferAttribute.name,
];

/**
 * threePrimitiveAttribute
 */
export const primitiveAttributes = [
    {
        name: THREE.Color.name,
        inputType: 'NgtColor',
        makeFunction: 'makeColor',
    },
    {
        name: THREE.Fog.name,
        inputType: 'NgtFog',
        makeFunction: 'make',
    },
    {
        name: THREE.FogExp2.name,
        inputType: 'NgtFogExp2',
        makeFunction: 'make',
    },
    {
        name: THREE.Vector2.name,
        inputType: 'NgtVector2',
        makeFunction: 'makeVector2',
    },
    {
        name: THREE.Vector3.name,
        inputType: 'NgtVector3',
        makeFunction: 'makeVector3',
    },
    {
        name: THREE.Vector4.name,
        inputType: 'NgtVector4',
        makeFunction: 'makeVector4',
    },
    {
        name: THREE.Matrix3.name,
        inputType: 'NgtMatrix3',
        makeFunction: 'make',
    },
    {
        name: THREE.Matrix4.name,
        inputType: 'NgtMatrix4',
        makeFunction: 'make',
    },
];

export const lightShadows = [
    {
        name: THREE.LightShadow.name,
        defPath: 'node_modules/@types/three/src/lights/LightShadow.d.ts',
    },
    {
        name: THREE.DirectionalLightShadow.name,
        defPath:
            'node_modules/@types/three/src/lights/DirectionalLightShadow.d.ts',
    },
    {
        name: THREE.PointLightShadow.name,
        defPath: 'node_modules/@types/three/src/lights/PointLightShadow.d.ts',
    },
    {
        name: THREE.SpotLightShadow.name,
        defPath: 'node_modules/@types/three/src/lights/SpotLightShadow.d.ts',
    },
];

export default async function attributesGenerator(tree: Tree) {
    const { libsDir } = getWorkspaceLayout(tree);
    const attributeDir = join(libsDir, 'core', 'attributes');

    logger.log('Generating attributes...');

    if (!tree.exists(attributeDir)) {
        await librarySecondaryEntryPointGenerator(tree, {
            name: 'attributes',
            library: 'core',
            skipModule: true,
        });
    }

    const generatedAttributes = [];
    for (const attribute of attributes) {
        const normalizedNames = names(attribute);

        generateFiles(
            tree,
            join(__dirname, 'files/lib'),
            join(attributeDir, 'src', 'lib', normalizedNames.fileName),
            {
                ...normalizedNames,
                tmpl: '',
            }
        );

        generatedAttributes.push(normalizedNames.fileName);
    }

    for (const primitiveAttribute of primitiveAttributes) {
        const normalizedNames = names(primitiveAttribute.name);

        generateFiles(
            tree,
            join(__dirname, 'files/primitive'),
            join(
                attributeDir,
                'src',
                'lib',
                `${normalizedNames.fileName}-attribute`
            ),
            {
                ...primitiveAttribute,
                ...normalizedNames,
                tmpl: '',
            }
        );

        generatedAttributes.push(`${normalizedNames.fileName}-attribute`);
    }

    for (const lightShadow of lightShadows) {
        const normalizedNames = names(lightShadow.name);

        const inputRecord = astFromPath(
            tree,
            lightShadow.defPath,
            (sourceFile) => {
                const mainParameters = [];
                const base: [
                    string,
                    SourceFile,
                    (PropertySignature | ParameterDeclaration)[]
                ] = ['', null, []];

                sourceFile.forEachChild((node) => {
                    if (isClassDeclaration(node)) {
                        if (node.heritageClauses?.length) {
                            const baseSourceFile = pathToSourceFile(
                                tree,
                                lightShadows[0].defPath
                            );
                            base[0] = 'LightShadow';
                            base[1] = baseSourceFile;

                            baseSourceFile.forEachChild((baseNode) => {
                                if (isClassDeclaration(baseNode)) {
                                    baseNode.members.forEach((member) => {
                                        if (isConstructorDeclaration(member)) {
                                            member.parameters.forEach(
                                                (parameter) => {
                                                    base[2].push(parameter);
                                                }
                                            );
                                        }
                                    });
                                }
                            });
                        }

                        node.members.forEach((member) => {
                            if (isConstructorDeclaration(member)) {
                                member.parameters.forEach((parameter) => {
                                    mainParameters.push(parameter);
                                });
                            }
                        });
                    }
                });

                return { mainProperties: mainParameters, base };
            }
        );

        const inputs = Object.entries(inputRecord).map(
            ([inputName, inputInfo]) => ({
                name: inputName,
                ...inputInfo,
            })
        );

        generateFiles(
            tree,
            join(__dirname, 'files/light-shadow'),
            join(attributeDir, 'src', 'lib', normalizedNames.fileName),
            {
                ...normalizedNames,
                tmpl: '',
                inputs,
                hasInput: inputs.length > 0,
            }
        );
    }

    generateFiles(
        tree,
        join(__dirname, 'files/index'),
        join(attributeDir, 'src'),
        {
            items: generatedAttributes,
            tmpl: '',
        }
    );

    await formatFiles(tree);
}
