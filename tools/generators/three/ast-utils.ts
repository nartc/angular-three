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

const cached = new Map();

export function pathToSourceFile(tree: Tree, dtsPath: string): SourceFile {
    const dtsContent = tree.read(dtsPath, 'utf-8');

    return createSourceFile(
        'sourceFile.d.ts',
        dtsContent,
        ScriptTarget.Latest,
        true,
        ScriptKind.TS
    );
}

export function astFromPath(
    tree: Tree,
    dtsPath: string,
    propertiesFactory: (sourceFile: SourceFile) => {
        mainProperties: PropertySignature[] | ParameterDeclaration[];
        overrideOptional?: Record<string, boolean>;
        base?: [string, SourceFile, PropertySignature[]];
    }
): Record<
    string,
    {
        propertyName: string;
        type: string;
        isOptional: boolean;
        shouldOverride: boolean;
    }
> {
    const record = {};
    const sourceFile = pathToSourceFile(tree, dtsPath);

    const {
        mainProperties,
        base,
        overrideOptional = {},
    } = propertiesFactory(sourceFile);

    let baseRecord = {};
    if (base) {
        const [baseName, baseSourceFile, baseProperties] = base;
        if (baseName !== '') {
            if (!cached.has(baseName)) {
                const test = baseProperties.reduce(
                    (baseRecord, baseProperty) => {
                        const typeInfo = propertySignatureToType(
                            baseSourceFile,
                            baseProperty
                        );
                        baseRecord[typeInfo.propertyName] = {
                            ...typeInfo,
                            shouldOverride: false,
                        };
                        return baseRecord;
                    },
                    {}
                );

                cached.set(baseName, test);
            }
        }
        baseRecord = cached.get(baseName) || {};
    }

    mainProperties.forEach((mainProperty) => {
        const typeInfo = propertySignatureToType(sourceFile, mainProperty);

        if (overrideOptional[typeInfo.propertyName] != undefined) {
            typeInfo.isOptional = overrideOptional[typeInfo.propertyName];
        }

        record[typeInfo.propertyName] = {
            ...typeInfo,
            shouldOverride: !!baseRecord[typeInfo.propertyName],
        };
    });

    return record;
}

export function getType(
    sourceFile: SourceFile,
    type: TypeNode,
    isArray = false
) {
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

export function concatArraySymbol(isArray: boolean, type: string) {
    return isArray ? `${type}[]` : type;
}

export function propertySignatureToType(
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

export function getTypeLiteral(
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
