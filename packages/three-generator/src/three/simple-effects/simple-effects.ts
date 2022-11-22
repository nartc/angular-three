import { librarySecondaryEntryPointGenerator } from '@nrwl/angular/generators';
import { generateFiles, getWorkspaceLayout, logger, names, Tree } from '@nrwl/devkit';
import { join } from 'path';
import {
  BloomEffect,
  BrightnessContrastEffect,
  ColorDepthEffect,
  DepthEffect,
  DotScreenEffect,
  HueSaturationEffect,
  NoiseEffect,
  ScanlineEffect,
  SepiaEffect,
  ShockWaveEffect,
  TiltShiftEffect,
  ToneMappingEffect,
  VignetteEffect,
} from 'postprocessing';
import {
  isClassDeclaration,
  isConstructorDeclaration,
  isTypeAliasDeclaration,
  isTypeLiteralNode,
  isTypeReferenceNode,
  ModuleBlock,
  ModuleDeclaration,
  TypeLiteralNode,
} from 'typescript/lib/tsserverlibrary';
import { astFromPath } from '../common/ast-utils';

const postprocessingTypeDefPath = 'node_modules/postprocessing/types/postprocessing.d.ts';

export const simpleEffects = [
  {
    name: BloomEffect.name,
    options: 'BloomEffectOptions',
    blendFunction: 'ADD',
    extraImports: ['KernelSize'],
  },
  {
    name: BrightnessContrastEffect.name,
  },
  {
    name: ColorDepthEffect.name,
  },
  {
    name: DepthEffect.name,
  },
  {
    name: DotScreenEffect.name,
  },
  {
    name: HueSaturationEffect.name,
  },
  {
    name: NoiseEffect.name,
    blendFunction: 'COLOR_DODGE',
  },
  {
    name: ScanlineEffect.name,
    blendFunction: 'OVERLAY',
  },
  {
    name: SepiaEffect.name,
  },
  {
    name: ShockWaveEffect.name,
    extraArgs: [
      {
        name: 'camera',
        fromComposer: true,
      },
      {
        name: 'position',
      },
    ],
  },
  {
    name: TiltShiftEffect.name,
    blendFunction: 'ADD',
    extraImports: ['KernelSize'],
  },
  {
    name: ToneMappingEffect.name,
    extraImports: ['ToneMappingMode'],
  },
  {
    name: VignetteEffect.name,
    extraImports: ['VignetteTechnique'],
  },
];

export default async function simpleEffectsGenerator(tree: Tree, ngtVersion: string) {
  const { libsDir } = getWorkspaceLayout(tree);
  const effectsDir = join(libsDir, 'postprocessing', 'effects');

  logger.log('Generating simple effects...');

  if (!tree.exists(effectsDir)) {
    await librarySecondaryEntryPointGenerator(tree, {
      name: 'effects',
      library: 'postprocessing',
      skipModule: true,
    });
  }

  const generatedSimpleEffects = [];
  const effects = ['depth-of-field-effect', 'lut-effect', 'ssao-effect'];

  for (const simpleEffect of simpleEffects) {
    const normalizedNames = names(simpleEffect.name);

    const inputRecord = astFromPath(tree, postprocessingTypeDefPath, (sourceFile) => {
      const mainProperties = [];

      ((sourceFile.statements[0] as ModuleDeclaration).body as ModuleBlock).statements.forEach((node) => {
        if (
          isTypeAliasDeclaration(node) &&
          simpleEffect.options &&
          node.name.getText(sourceFile) === simpleEffect.options
        ) {
          (node.type as TypeLiteralNode).members.forEach((member) => {
            if (member.name.getText(sourceFile) !== 'blendFunction') {
              mainProperties.push(member);
            }
          });
          return;
        }

        if (isClassDeclaration(node) && node.name.getText(sourceFile) === simpleEffect.name) {
          const constructorNode = node.members[0];
          if (isConstructorDeclaration(constructorNode) && constructorNode.parameters.length > 0) {
            for (const constructorParameter of constructorNode.parameters) {
              if (
                isTypeReferenceNode(constructorParameter.type) &&
                constructorParameter.type.typeName.getText(sourceFile) !== simpleEffect.options &&
                constructorParameter.name.getText(sourceFile) !== 'camera'
              ) {
                mainProperties.push(constructorParameter);
                continue;
              }

              if (isTypeLiteralNode(constructorParameter.type)) {
                constructorParameter.type.members.forEach((member) => {
                  if (member.name.getText(sourceFile) !== 'blendFunction') {
                    mainProperties.push(member);
                  }
                });
              }
            }
          }
        }
      });

      return { mainProperties };
    });

    generateFiles(tree, join(__dirname, 'files', 'lib'), join(effectsDir, 'src', 'lib', normalizedNames.fileName), {
      blendFunction: undefined,
      extraArgs: undefined,
      extraImports: [],
      ...simpleEffect,
      ...normalizedNames,
      tmpl: '',
      ...inputRecord,
      ngtVersion,
    });

    generatedSimpleEffects.push(normalizedNames.fileName);
  }

  generateFiles(tree, join(__dirname, '../common/files/index'), join(effectsDir, 'src'), {
    items: [...generatedSimpleEffects, ...effects],
    tmpl: '',
    ngtVersion,
  });
}
