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
const sourceFileCached = new Map();

export function pathToSourceFile(tree: Tree, dtsPath: string): SourceFile {
  if (!sourceFileCached.has(dtsPath)) {
    const dtsContent = tree.read(dtsPath, 'utf-8');

    sourceFileCached.set(
      dtsPath,
      createSourceFile(
        'sourceFile.d.ts',
        dtsContent,
        ScriptTarget.Latest,
        true,
        ScriptKind.TS
      )
    );
  }

  return sourceFileCached.get(dtsPath);
}

export function astFromPath(
  tree: Tree,
  dtsPath: string,
  propertiesFactory: (sourceFile: SourceFile) => {
    mainProperties: PropertySignature[] | ParameterDeclaration[];
    overrideOptional?: Record<string, boolean>;
    base?: [string, SourceFile, (PropertySignature | ParameterDeclaration)[]];
  }
): {
  inputs: {
    name: string;
    isNumberInput: boolean;
    isBooleanInput: boolean;
    propertyName: string;
    type: string;
    isOptional: boolean;
    shouldOverride: boolean;
  }[];
  hasInput: boolean;
  hasBooleanInput: boolean;
  hasNumberInput: boolean;
} {
  const record: Record<
    string,
    {
      propertyName: string;
      type: string;
      isOptional: boolean;
      shouldOverride: boolean;
    }
  > = {};
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
        cached.set(
          baseName,
          baseProperties.reduce((baseRecord, baseProperty) => {
            const typeInfo = propertySignatureToType(
              baseSourceFile,
              baseProperty as PropertySignature
            );
            baseRecord[typeInfo.propertyName] = {
              ...typeInfo,
              shouldOverride: false,
            };
            return baseRecord;
          }, {})
        );
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

  const inputs = Object.entries(record).map(([inputName, inputInfo]) => ({
    name: inputName,
    ...inputInfo,
    isNumberInput: inputInfo.type.includes('number'),
    isBooleanInput: inputInfo.type.includes('boolean'),
  }));

  return {
    inputs,
    hasInput: inputs.length > 0,
    hasBooleanInput: inputs.some((input) => input.isBooleanInput),
    hasNumberInput: inputs.some((input) => input.isNumberInput),
  };
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
    return concatArraySymbol(
      isArray,
      getThreeType(type.typeName.getText(sourceFile))
    );
  }
}

export function getThreeType(type: string): string {
  return [
    'HTMLImageElement',
    'HTMLCanvasElement',
    'HTMLVideoElement',
    'ImageBitmap',
    'ImageData',
    'BufferSource',
    'KernelSize',
    'ToneMappingMode',
    'VignetteTechnique',
  ].includes(type)
    ? type
    : `THREE.${type}`;
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
        const { propertyName, type, isOptional } = propertySignatureToType(
          sourceFile,
          member
        );
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
