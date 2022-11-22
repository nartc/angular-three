import { Tree } from '@nrwl/devkit';
import {
    createSourceFile,
    isArrayTypeNode,
    isIndexSignatureDeclaration,
    isLiteralTypeNode,
    isPropertySignature,
    isTypeLiteralNode,
    isTypeReferenceNode,
    isUnionTypeNode,
    ParameterDeclaration,
    PropertySignature,
    ScriptKind,
    ScriptTarget,
    SourceFile,
    SyntaxKind,
    TypeLiteralNode,
    TypeNode,
    UnionTypeNode,
} from 'typescript/lib/tsserverlibrary';

const sourceFileCached = new Map();

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

type PropertyInfo = { propertyName: string; type: string; isOptional: boolean };
type Property = PropertySignature | ParameterDeclaration | PropertyInfo;
type Base = { sourceFile: SourceFile; properties: Map<string, Property> };

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

    return {
        inputs,
        hasInput: inputs.length > 0,
    };
}

export function getType(sourceFile: SourceFile, type: TypeNode, isArray = false) {
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
