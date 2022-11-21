import { librarySecondaryEntryPointGenerator } from '@nrwl/angular/generators';
import { generateFiles, getWorkspaceLayout, logger, names, Tree } from '@nrwl/devkit';
import { join } from 'path';
import * as THREE from 'three';
import {
    Identifier,
    isClassDeclaration,
    isConstructorDeclaration,
    isInterfaceDeclaration,
    isPropertySignature,
    isTypeReferenceNode,
    PropertySignature,
    SourceFile,
} from 'typescript/lib/tsserverlibrary';
import { astFromPath, pathToSourceFile } from '../common/ast-utils';

const baseMaterialPath = 'node_modules/@types/three/src/materials/Material.d.ts';

const materials = [
    {
        name: THREE.LineBasicMaterial.name,
        defPath: 'node_modules/@types/three/src/materials/LineBasicMaterial.d.ts',
    },
    {
        name: THREE.LineDashedMaterial.name,
        defPath: 'node_modules/@types/three/src/materials/LineDashedMaterial.d.ts',
    },
    {
        name: THREE.MeshBasicMaterial.name,
        defPath: 'node_modules/@types/three/src/materials/MeshBasicMaterial.d.ts',
    },
    {
        name: THREE.MeshDepthMaterial.name,
        defPath: 'node_modules/@types/three/src/materials/MeshDepthMaterial.d.ts',
    },
    {
        name: THREE.MeshDistanceMaterial.name,
        defPath: 'node_modules/@types/three/src/materials/MeshDistanceMaterial.d.ts',
    },
    {
        name: THREE.MeshLambertMaterial.name,
        defPath: 'node_modules/@types/three/src/materials/MeshLambertMaterial.d.ts',
    },
    {
        name: THREE.MeshMatcapMaterial.name,
        defPath: 'node_modules/@types/three/src/materials/MeshMatcapMaterial.d.ts',
    },
    {
        name: THREE.MeshNormalMaterial.name,
        defPath: 'node_modules/@types/three/src/materials/MeshNormalMaterial.d.ts',
    },
    {
        name: THREE.MeshPhongMaterial.name,
        defPath: 'node_modules/@types/three/src/materials/MeshPhongMaterial.d.ts',
    },
    {
        name: THREE.MeshPhysicalMaterial.name,
        parameters: 'MeshPhysicalMaterialParameters',
        defPath: 'node_modules/@types/three/src/materials/MeshPhysicalMaterial.d.ts',
    },
    {
        name: THREE.MeshStandardMaterial.name,
        parameters: 'MeshStandardMaterialParameters',
        defPath: 'node_modules/@types/three/src/materials/MeshStandardMaterial.d.ts',
    },
    {
        name: THREE.MeshToonMaterial.name,
        defPath: 'node_modules/@types/three/src/materials/MeshToonMaterial.d.ts',
    },
    {
        name: THREE.PointsMaterial.name,
        defPath: 'node_modules/@types/three/src/materials/PointsMaterial.d.ts',
    },
    {
        name: THREE.RawShaderMaterial.name,
        defPath: 'node_modules/@types/three/src/materials/RawShaderMaterial.d.ts',
    },
    {
        name: THREE.ShaderMaterial.name,
        defPath: 'node_modules/@types/three/src/materials/ShaderMaterial.d.ts',
    },
    {
        name: THREE.ShadowMaterial.name,
        defPath: 'node_modules/@types/three/src/materials/ShadowMaterial.d.ts',
    },
    {
        name: THREE.SpriteMaterial.name,
        defPath: 'node_modules/@types/three/src/materials/SpriteMaterial.d.ts',
    },
];

export default async function materialsGenerator(tree: Tree, ngtVersion: string) {
    const { libsDir } = getWorkspaceLayout(tree);
    const materialDir = join(libsDir, 'angular-three', 'materials');

    logger.log('Generating materials...');

    if (!tree.exists(materialDir)) {
        await librarySecondaryEntryPointGenerator(tree, {
            name: 'materials',
            library: 'angular-three',
            skipModule: true,
        });
    }

    const generatedMaterials = [];
    for (const { name, defPath } of materials) {
        const normalizedNames = names(name);

        const inputRecord = astFromPath(tree, defPath, (sourceFile) => {
            const properties = new Map();
            const bases = new Map();

            let hasInterface = false;
            function runMaterialSourceFile(sF: SourceFile, props: Map<string, PropertySignature>) {
                sF.forEachChild((node) => {
                    if (isInterfaceDeclaration(node)) {
                        hasInterface = true;
                        if (node.heritageClauses?.length) {
                            const baseParameterName = (
                                node.heritageClauses[0].types[0].expression as Identifier
                            ).getText(sF);

                            const baseDtsPath =
                                baseParameterName === 'MaterialParameters'
                                    ? baseMaterialPath
                                    : materials.find((material) => baseParameterName.includes(material.name))?.defPath;

                            if (baseDtsPath) {
                                const baseSourceFile = pathToSourceFile(tree, baseDtsPath);
                                if (!bases.has(baseParameterName)) {
                                    bases.set(baseParameterName, {
                                        sourceFile: baseSourceFile,
                                        properties: new Map(),
                                    });
                                }

                                runMaterialSourceFile(baseSourceFile, bases.get(baseParameterName).properties);
                            }
                        }

                        node.forEachChild((childNode) => {
                            if (isPropertySignature(childNode)) {
                                props.set(childNode.name.getText(sF), childNode);
                            }
                        });
                    }

                    if (!hasInterface && isClassDeclaration(node)) {
                        const member = node.members[0];
                        if (member && isConstructorDeclaration(member)) {
                            const parameters = member.parameters;
                            if (parameters && parameters.length) {
                                const parameterType = parameters[0].type;
                                if (isTypeReferenceNode(parameterType)) {
                                    const baseParameterName = parameterType.typeName.getText(sF);
                                    const baseDtsPath =
                                        baseParameterName === 'MaterialParameters'
                                            ? baseMaterialPath
                                            : materials.find((material) => baseParameterName.includes(material.name))
                                                  ?.defPath;
                                    if (baseDtsPath) {
                                        const baseSourceFile = pathToSourceFile(tree, baseDtsPath);
                                        if (!bases.has(baseParameterName)) {
                                            bases.set(baseParameterName, {
                                                sourceFile: baseSourceFile,
                                                properties: new Map(),
                                            });
                                        }

                                        runMaterialSourceFile(baseSourceFile, bases.get(baseParameterName).properties);
                                    }
                                }
                            }
                        }
                    }
                });
            }

            runMaterialSourceFile(sourceFile, properties);

            return { properties, bases };
        });

        generateFiles(tree, join(__dirname, 'files/lib'), join(materialDir, 'src', 'lib', normalizedNames.fileName), {
            ...normalizedNames,
            material: name,
            tmpl: '',
            ...inputRecord,
            ngtVersion,
        });

        generatedMaterials.push(normalizedNames.fileName);
    }

    generateFiles(tree, join(__dirname, '../common/files/index'), join(materialDir, 'src'), {
        items: generatedMaterials,
        tmpl: '',
        ngtVersion,
    });
}
