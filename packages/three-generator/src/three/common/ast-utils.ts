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

type PropertyInfo = { propertyName: string; type: string; isOptional: boolean };
type Property = PropertySignature | ParameterDeclaration | PropertyInfo;
type Base = { sourceFile: SourceFile; properties: Map<string, Property> };

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

    const heritageDtsPath = heritageName === 'Object3D' ? object3dDtsPath : heritageDtsPathFinder(heritageName);
    if (heritageDtsPath) {
        const heritageSourceFile = pathToSourceFile(tree, heritageDtsPath);
        if (!basesMap.has(heritageName)) {
            basesMap.set(heritageName, { sourceFile: heritageSourceFile, properties: new Map() });
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

            const propertyName = member.name.getText(sourceFile);
            // skip these properties
            if (exclude.includes(propertyName)) continue;
            properties.set(propertyName, member);
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

    while (basesNames.length) {
        const baseName = basesNames.shift();
        const { sourceFile: baseSourceFile, properties: baseProperties = new Map<string, Property>() } =
            bases.get(baseName);
        baseProperties.forEach((property) => {
            const propertyTypeInfo = propertySignatureToType(baseSourceFile, property as PropertySignature);

            if (!properties.has(propertyTypeInfo.propertyName)) {
                properties.set(propertyTypeInfo.propertyName, propertyTypeInfo);
            }
        });
    }

    const inputs = [];
    properties.forEach((property, propertyName) => {
        if (property['propertyName']) {
            inputs.push({ name: propertyName, ...property });
        } else {
            const typeInfo = propertySignatureToType(sourceFile, property as PropertySignature);
            inputs.push({ name: propertyName, ...typeInfo });
        }
    });

    const ngtTypes = new Set();
    inputs.forEach(({ propertyName, type }) => {
        try {
            if (type.startsWith('Ngt')) {
                ngtTypes.add(type);
            }
        } catch (e) {
            console.log('wtf is this', propertyName, dtsPath);
            throw e;
        }
    });

    return {
        inputs,
        ngtTypes: [...ngtTypes.values()],
        hasNgtType: ngtTypes.size > 0,
        hasInput: inputs.length > 0,
    };
}

export function getType(sourceFile: SourceFile, type: TypeNode, isArray = false) {
    if (isArrayTypeNode(type)) {
        return getType(sourceFile, type.elementType, true);
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
