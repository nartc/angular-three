import { Tree } from '@nrwl/devkit';
import {
    ClassDeclaration,
    ClassElement,
    createSourceFile,
    InterfaceDeclaration,
    isArrayTypeNode,
    isConstructorDeclaration,
    isFunctionTypeNode,
    isIndexSignatureDeclaration,
    isLiteralTypeNode,
    isMethodDeclaration,
    isPropertyDeclaration,
    isPropertySignature,
    isTypeLiteralNode,
    isTypeReferenceNode,
    isUnionTypeNode,
    NodeArray,
    ParameterDeclaration,
    PropertySignature,
    ScriptKind,
    ScriptTarget,
    SourceFile,
    SyntaxKind,
    TypeLiteralNode,
    TypeNode,
    TypeReferenceNode,
    UnionTypeNode,
} from 'typescript/lib/tsserverlibrary';

type PropertyInfo = { propertyName: string; type: string; isOptional: boolean; object3D?: boolean };
type Property = PropertySignature | ParameterDeclaration | PropertyInfo;
type Base = { sourceFile: SourceFile; properties: Map<string, Property>; object3D: boolean };

const sourceFileCached = new Map();
const object3dDtsPath = 'node_modules/@types/three/src/core/Object3D.d.ts';

export function handleHeritage(
    tree: Tree,
    sourceFile: SourceFile,
    child: ClassDeclaration | InterfaceDeclaration | TypeReferenceNode,
    heritageDtsPathFinder: (baseName: string) => string | undefined,
    basesMap: Map<string, Base>,
    sourceFileRunner: (sF: SourceFile, props: Map<string, any>) => void
) {
    const heritageName = isTypeReferenceNode(child)
        ? child.typeName.getText(sourceFile)
        : child.heritageClauses[0].types[0].expression.getText(sourceFile);

    if (heritageName === 'EventDispatcher') return;

    const isObject3d = heritageName === 'Object3D';

    const heritageDtsPath = isObject3d ? object3dDtsPath : heritageDtsPathFinder(heritageName);
    if (heritageDtsPath) {
        const heritageSourceFile = pathToSourceFile(tree, heritageDtsPath);
        if (!basesMap.has(heritageName)) {
            basesMap.set(heritageName, { sourceFile: heritageSourceFile, properties: new Map(), object3D: isObject3d });
        }

        sourceFileRunner(heritageSourceFile, basesMap.get(heritageName).properties);
    }
}

export function handleClassMember(
    sourceFile: SourceFile,
    members: NodeArray<ClassElement>,
    properties: Map<string, any>,
    skipConstructor = false,
    exclude = []
) {
    for (const member of members) {
        if (isConstructorDeclaration(member)) {
            if (skipConstructor) continue;
            for (const constructorParameter of member.parameters) {
                const parameterName = constructorParameter.name.getText(sourceFile);
                if (exclude.includes(parameterName)) continue;
                properties.set(parameterName, constructorParameter);
            }
        }

        if (isPropertyDeclaration(member)) {
            // skip static members
            if (
                member.modifiers?.length &&
                member.modifiers.some((modifier) => modifier.kind === SyntaxKind.StaticKeyword)
            )
                continue;

            // skip @deprecated
            if (member['jsDoc']?.length) {
                let isDeprecated = false;
                for (const tag of member['jsDoc'][0].tags || []) {
                    if (tag.tagName.getText(sourceFile) === 'deprecated') {
                        isDeprecated = true;
                        break;
                    }
                }

                if (isDeprecated) {
                    continue;
                }
            }

            const propertyName = member.name.getText(sourceFile);
            // skip these properties
            if (exclude.includes(propertyName)) continue;
            properties.set(propertyName, member);
        }

        if (isMethodDeclaration(member)) {
            if (member.name.getText(sourceFile) === 'raycast') {
                properties.set(member.name.getText(sourceFile), member);
            }
        }
    }
}

export function handleClassMembers(
    sourceFile: SourceFile,
    node: ClassDeclaration,
    properties: Map<string, any>,
    skipConstructor = false,
    exclude = []
) {
    const className = node.name.getText(sourceFile);
    exclude.push(`is${className}`, 'type');

    if (className === 'Object3D') {
        handleClassMember(sourceFile, node.members, properties, true, [
            'id',
            'uuid',
            'type',
            'parent',
            'children',
            'up',
            'isObject3D',
        ]);
    } else {
        handleClassMember(sourceFile, node.members, properties, skipConstructor, exclude);
    }
}

export function pathToSourceFile(tree: Tree, dtsPath: string): SourceFile {
    if (!sourceFileCached.has(dtsPath)) {
        const dtsContent = tree.read(dtsPath, 'utf-8');

        sourceFileCached.set(
            dtsPath,
            createSourceFile('sourceFile.d.ts', dtsContent, ScriptTarget.Latest, true, ScriptKind.TS)
        );
    }

    return sourceFileCached.get(dtsPath);
}

export function astFromPath(
    tree: Tree,
    dtsPath: string,
    propertiesFactory: (sourceFile: SourceFile) => {
        properties: Map<string, Property>;
        bases?: Map<string, Base>;
    }
) {
    const sourceFile = pathToSourceFile(tree, dtsPath);
    const { properties, bases = new Map<string, Base>() } = propertiesFactory(sourceFile);

    const basesNames = [...bases.keys()];

    const hasObject3D = basesNames.includes('Object3D');

    while (basesNames.length) {
        const baseName = basesNames.shift();
        const {
            sourceFile: baseSourceFile,
            properties: baseProperties = new Map<string, Property>(),
            object3D,
        } = bases.get(baseName);
        baseProperties.forEach((property) => {
            const propertyTypeInfo = propertySignatureToType(baseSourceFile, property as PropertySignature);

            if (!properties.has(propertyTypeInfo.propertyName)) {
                properties.set(propertyTypeInfo.propertyName, { ...propertyTypeInfo, object3D });
            }
        });
    }

    const inputs = [];
    const staticInputs = [];
    properties.forEach((property, propertyName) => {
        if (property['propertyName']) {
            const input = { name: propertyName, ...property };
            if (!property['object3D']) {
                inputs.push(input);
            }
            staticInputs.push(input);
        } else {
            const typeInfo = propertySignatureToType(sourceFile, property as PropertySignature);
            const input = { name: propertyName, ...typeInfo };
            inputs.push(input);
            staticInputs.push(input);
        }
    });

    const ngtTypes = new Set();
    staticInputs.forEach(({ propertyName, type }) => {
        try {
            if (type.startsWith('Ngt')) {
                ngtTypes.add(type.endsWith('[]') ? type.slice(0, -2) : type);
            }
        } catch (e) {
            console.log('wtf is this', propertyName, dtsPath);
            throw e;
        }
    });

    return {
        inputs,
        staticInputs,
        ngtTypes: [...ngtTypes.values()],
        hasNgtType: ngtTypes.size > 0,
        hasInput: inputs.length > 0,
        hasObject3D,
    };
}

export function getType(sourceFile: SourceFile, type: TypeNode, isArray = false) {
    if (isArrayTypeNode(type)) {
        return getType(sourceFile, type.elementType, true);
    }

    if (isTypeReferenceNode(type) && type.typeName.getText(sourceFile) === 'Array') {
        return getType(sourceFile, type.typeArguments[0], true);
    }

    if (isFunctionTypeNode(type)) {
        const returnType = getType(sourceFile, type.type);
        return (
            type.parameters.length === 0
                ? '()'
                : `(${type.parameters
                      .map(
                          (parameter) => `${parameter.name.getText(sourceFile)}:${getType(sourceFile, parameter.type)}`
                      )
                      .join(', ')})`
        ).concat(` => ${returnType}`);
    }

    if (type.kind === SyntaxKind.VoidKeyword) {
        return 'void';
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
            return type.literal.getText(sourceFile);
        }
    }

    if (isTypeLiteralNode(type)) {
        return concatArraySymbol(isArray, getTypeLiteral(sourceFile, type));
    }

    if (type.kind === SyntaxKind.NullKeyword) {
        return 'null';
    }

    if (type.kind === SyntaxKind.AnyKeyword) {
        return concatArraySymbol(isArray, 'any');
    }

    if (isTypeReferenceNode(type)) {
        return concatArraySymbol(isArray, getThreeType(type.typeName.getText(sourceFile)));
    }
}

export function getThreeType(type: string): string {
    // custom Ngt types
    if (['Matrix4', 'Vector2', 'Vector3', 'Vector4', 'Layers', 'Quaternion', 'Euler'].includes(type)) {
        return `Ngt${type}`;
    }

    // generics
    if (['TGeometry'].includes(type)) {
        return `THREE.BufferGeometry`;
    }

    if (['TMaterial'].includes(type)) {
        return `THREE.Material | THREE.Material[]`;
    }

    return [
        'HTMLImageElement',
        'HTMLCanvasElement',
        'HTMLVideoElement',
        'TexImageSource',
        'ImageBitmap',
        'ImageData',
        'BufferSource',
        'KernelSize',
        'ToneMappingMode',
        'VignetteTechnique',
        'AudioNode',
        'AudioBufferSourceNode',
        'AudioBuffer',
        'Float32Array',
    ].includes(type)
        ? type
        : `THREE.${type}`;
}

export function concatArraySymbol(isArray: boolean, type: string) {
    return isArray ? `${type}[]` : type;
}

export function propertySignatureToType(sourceFile: SourceFile, propertySignature: PropertySignature): PropertyInfo {
    const propertyName = propertySignature.name.getText(sourceFile);
    const isOptional = !!propertySignature.questionToken;
    if (isUnionTypeNode(propertySignature.type)) {
        return {
            propertyName,
            type: (propertySignature.type as UnionTypeNode).types
                .filter((typeNode) => typeNode.kind !== SyntaxKind.UndefinedKeyword)
                .map((type) => getType(sourceFile, type))
                .filter(Boolean)
                .join(' | '),
            isOptional,
        };
    }

    if (propertyName === 'raycast') {
        // special handle for raycast for now
        return {
            propertyName,
            type: 'THREE.Object3D["raycast"]',
            isOptional: true,
        };
    }

    return {
        propertyName,
        type: getType(sourceFile, propertySignature.type),
        isOptional,
    };
}

export function getTypeLiteral(sourceFile: SourceFile, typeLiteral: TypeLiteralNode): string {
    const firstMember = typeLiteral.members[0];
    if (isIndexSignatureDeclaration(firstMember)) {
        const firstParameter = firstMember.parameters[0];
        return `{[${firstParameter.name.getText(sourceFile)}: ${getType(sourceFile, firstParameter.type)}]: ${getType(
            sourceFile,
            firstMember.type
        )}}`;
    }

    return typeLiteral.members
        .reduce((typeString, member) => {
            if (isPropertySignature(member)) {
                const { propertyName, type, isOptional } = propertySignatureToType(sourceFile, member);
                typeString = typeString.concat(propertyName, isOptional ? '?:' : ':', type, ';');
            }

            return typeString;
        }, '{')
        .concat('}');
}
