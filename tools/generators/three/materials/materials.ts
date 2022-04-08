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
    createSourceFile,
    Identifier,
    isArrayTypeNode,
    isIndexSignatureDeclaration,
    isInterfaceDeclaration,
    isLiteralTypeNode,
    isPropertySignature,
    isTypeLiteralNode,
    isTypeReferenceNode,
    isUnionTypeNode,
    PropertySignature,
    ScriptKind,
    ScriptTarget,
    SourceFile,
    SyntaxKind,
    TypeLiteralNode,
    TypeNode,
    UnionTypeNode,
} from 'typescript/lib/tsserverlibrary';

const baseMaterialPath =
    'node_modules/@types/three/src/materials/Material.d.ts';

interface GeneratorMaterial {
    name: string;
    parameters: string;
    defPath: string;
    extend?: { path: string; material: string };
    typeDef?: string;
}

const materials = [
    {
        name: THREE.ShadowMaterial.name,
        parameters: 'ShadowMaterialParameters',
        defPath: 'node_modules/@types/three/src/materials/ShadowMaterial.d.ts',
    },
    {
        name: THREE.SpriteMaterial.name,
        parameters: 'SpriteMaterialParameters',
        defPath: 'node_modules/@types/three/src/materials/SpriteMaterial.d.ts',
    },
    {
        name: THREE.RawShaderMaterial.name,
        parameters: 'ShaderMaterialParameters',
        defPath:
            'node_modules/@types/three/src/materials/RawShaderMaterial.d.ts',
    },
    {
        name: THREE.ShaderMaterial.name,
        parameters: 'ShaderMaterialParameters',
        defPath: 'node_modules/@types/three/src/materials/ShaderMaterial.d.ts',
    },
    {
        name: THREE.PointsMaterial.name,
        parameters: 'PointsMaterialParameters',
        defPath: 'node_modules/@types/three/src/materials/PointsMaterial.d.ts',
    },
    {
        name: THREE.MeshPhysicalMaterial.name,
        parameters: 'MeshPhysicalMaterialParameters',
        extend: {
            material: 'NgtMeshStandardMaterial',
            path: '../mesh-standard-material/mesh-standard-material',
        },
        defPath:
            'node_modules/@types/three/src/materials/MeshPhysicalMaterial.d.ts',
    },
    {
        name: THREE.MeshStandardMaterial.name,
        parameters: 'MeshStandardMaterialParameters',
        typeDef:
            'TStandardMaterialParameters extends THREE.MeshStandardMaterialParameters = THREE.MeshStandardMaterialParameters, TStandardMaterial extends THREE.MeshStandardMaterial = THREE.MeshStandardMaterial',
        defPath:
            'node_modules/@types/three/src/materials/MeshStandardMaterial.d.ts',
    },
    {
        name: THREE.MeshPhongMaterial.name,
        parameters: 'MeshPhongMaterialParameters',
        defPath:
            'node_modules/@types/three/src/materials/MeshPhongMaterial.d.ts',
    },
    {
        name: THREE.MeshToonMaterial.name,
        parameters: 'MeshToonMaterialParameters',
        defPath:
            'node_modules/@types/three/src/materials/MeshToonMaterial.d.ts',
    },
    {
        name: THREE.MeshNormalMaterial.name,
        parameters: 'MeshNormalMaterialParameters',
        defPath:
            'node_modules/@types/three/src/materials/MeshNormalMaterial.d.ts',
    },
    {
        name: THREE.MeshLambertMaterial.name,
        parameters: 'MeshLambertMaterialParameters',
        defPath:
            'node_modules/@types/three/src/materials/MeshLambertMaterial.d.ts',
    },
    {
        name: THREE.MeshDepthMaterial.name,
        parameters: 'MeshDepthMaterialParameters',
        defPath:
            'node_modules/@types/three/src/materials/MeshDepthMaterial.d.ts',
    },
    {
        name: THREE.MeshDistanceMaterial.name,
        parameters: 'MeshDistanceMaterialParameters',
        defPath:
            'node_modules/@types/three/src/materials/MeshDistanceMaterial.d.ts',
    },
    {
        name: THREE.MeshBasicMaterial.name,
        parameters: 'MeshBasicMaterialParameters',
        defPath:
            'node_modules/@types/three/src/materials/MeshBasicMaterial.d.ts',
    },
    {
        name: THREE.MeshMatcapMaterial.name,
        parameters: 'MeshMatcapMaterialParameters',
        defPath:
            'node_modules/@types/three/src/materials/MeshMatcapMaterial.d.ts',
    },
    {
        name: THREE.LineDashedMaterial.name,
        parameters: 'LineDashedMaterialParameters',
        extend: {
            material: 'NgtLineBasicMaterial',
            path: '../line-basic-material/line-basic-material',
        },
        defPath:
            'node_modules/@types/three/src/materials/LineDashedMaterial.d.ts',
    },
    {
        name: THREE.LineBasicMaterial.name,
        parameters: 'LineBasicMaterialParameters',
        typeDef:
            'TLineBasicMaterialParameters extends THREE.LineBasicMaterialParameters = THREE.LineBasicMaterialParameters, TLineBasicMaterial extends THREE.LineBasicMaterial = THREE.LineBasicMaterial',
        defPath:
            'node_modules/@types/three/src/materials/LineBasicMaterial.d.ts',
    },
];

const parameterInheritanceMap = new Map();

export default async function materialsGenerator(tree: Tree) {
    const { libsDir } = getWorkspaceLayout(tree);
    const materialDir = join(libsDir, 'core', 'materials');

    logger.log('Generating materials...');

    if (!tree.exists(materialDir)) {
        // await librarySecondaryEntryPointGenerator(tree, {
        //     name: 'materials',
        //     library: 'core',
        //     skipModule: true,
        // });
    }

    const generatedMaterials = [];
    for (const { name, parameters, typeDef, extend, defPath } of materials) {
        const normalizedNames = names(name);

        // inputs stuffs
        const inputRecord = generateInputs(tree, defPath);

        const inputs = Object.entries(inputRecord).map(
            ([inputName, inputInfo]) => ({
                name: inputName,
                ...inputInfo,
            })
        );

        generateFiles(
            tree,
            join(__dirname, 'files/lib'),
            join(materialDir, 'src', 'lib', normalizedNames.fileName),
            {
                ...normalizedNames,
                material: name,
                parameters,
                tmpl: '',
                typeDef,
                extend,
                inputs,
                hasInput: inputs.length > 0,
            }
        );

        generatedMaterials.push(normalizedNames.fileName);
    }

    generateFiles(
        tree,
        join(__dirname, 'files/index'),
        join(materialDir, 'src'),
        {
            items: generatedMaterials,
            tmpl: '',
        }
    );

    await formatFiles(tree);
}

// @ts-ignore
function generateInputs(tree: Tree, typeDefPath: string): Record<string, any> {
    const typeDefContent = tree.read(typeDefPath, 'utf-8');
    const inputs = {};

    const sourceFile = createSourceFile(
        'material.d.ts',
        typeDefContent,
        ScriptTarget.Latest,
        true,
        ScriptKind.TS
    );

    let base = {};

    sourceFile.forEachChild((node) => {
        if (isInterfaceDeclaration(node)) {
            if (node.heritageClauses?.length) {
                const baseParameter = (
                    node.heritageClauses[0].types[0].expression as Identifier
                ).getText(sourceFile);

                if (!parameterInheritanceMap.has(baseParameter)) {
                    if (baseParameter === 'MaterialParameters') {
                        base = generateInputs(tree, baseMaterialPath);
                    } else {
                        const path = materials.find(
                            (material) => material.parameters === baseParameter
                        )?.defPath;
                        if (path) {
                            base = generateInputs(tree, path);
                        }
                    }

                    if (Object.keys(base).length) {
                        parameterInheritanceMap.set(baseParameter, base);
                    }
                } else {
                    base = parameterInheritanceMap.get(baseParameter);
                }
            }

            node.forEachChild((childNode) => {
                if (isPropertySignature(childNode)) {
                    const { propertyName, ...typeInfo } =
                        propertySignatureToType(sourceFile, childNode);
                    inputs[propertyName] = {
                        ...typeInfo,
                        shouldOverride: !!base[propertyName],
                    };
                }
            });

            parameterInheritanceMap.set(node.name.getText(sourceFile), inputs);
        }
    });

    return inputs;
}

function getType(sourceFile: SourceFile, type: TypeNode, isArray = false) {
    if (isArrayTypeNode(type)) {
        return getType(sourceFile, type.elementType, true);
    }

    if (type.kind === SyntaxKind.NumberKeyword) {
        return concatArraySymbol(isArray, 'number');
    }

    if (type.kind === SyntaxKind.StringKeyword) {
        return concatArraySymbol(isArray, 'string');
    }

    if (type.kind === SyntaxKind.BooleanKeyword) {
        return concatArraySymbol(isArray, 'boolean');
    }

    if (isLiteralTypeNode(type)) {
        if (type.literal.kind === SyntaxKind.NullKeyword) {
            return 'null';
        }

        if (type.literal.kind === SyntaxKind.StringKeyword) {
            return type.literal.getText();
        }
    }

    if (isTypeLiteralNode(type)) {
        return concatArraySymbol(isArray, getTypeLiteral(sourceFile, type));
    }

    if (type.kind === SyntaxKind.NullKeyword) {
        return 'null';
    }

    if (isTypeReferenceNode(type)) {
        return concatArraySymbol(isArray, `THREE.${type.typeName.getText()}`);
    }
}

function concatArraySymbol(isArray: boolean, type: string) {
    return isArray ? `${type}[]` : type;
}

function propertySignatureToType(
    sourceFile: SourceFile,
    propertySignature: PropertySignature
): { propertyName: string; type: string; isOptional: boolean } {
    const propertyName = propertySignature.name.getText(sourceFile);
    const isOptional = !!propertySignature.questionToken;
    if (isUnionTypeNode(propertySignature.type)) {
        return {
            propertyName,
            type: (propertySignature.type as UnionTypeNode).types
                .filter(
                    (typeNode) => typeNode.kind !== SyntaxKind.UndefinedKeyword
                )
                .map((type) => getType(sourceFile, type))
                .filter(Boolean)
                .join(' | '),
            isOptional,
        };
    }

    return {
        propertyName,
        type: getType(sourceFile, propertySignature.type),
        isOptional,
    };
}

function getTypeLiteral(
    sourceFile: SourceFile,
    typeLiteral: TypeLiteralNode
): string {
    const firstMember = typeLiteral.members[0];
    if (isIndexSignatureDeclaration(firstMember)) {
        const firstParameter = firstMember.parameters[0];
        return `{[${firstParameter.name.getText(sourceFile)}: ${getType(
            sourceFile,
            firstParameter.type
        )}]: ${getType(sourceFile, firstMember.type)}}`;
    }

    return typeLiteral.members
        .reduce((typeString, member) => {
            if (isPropertySignature(member)) {
                const { propertyName, type, isOptional } =
                    propertySignatureToType(sourceFile, member);
                typeString = typeString.concat(
                    propertyName,
                    isOptional ? '?:' : ':',
                    type,
                    ';'
                );
            }

            return typeString;
        }, '{')
        .concat('}');
}
