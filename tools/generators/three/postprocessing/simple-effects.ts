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
  ToneMappingEffect,
  VignetteEffect,
} from 'postprocessing';
import {
  isClassDeclaration,
  isConstructorDeclaration,
  isTypeAliasDeclaration,
  ModuleBlock,
  ModuleDeclaration,
  TypeLiteralNode,
} from 'typescript/lib/tsserverlibrary';
import { astFromPath } from '../ast-utils';

const postprocessingTypeDefPath =
  'node_modules/.pnpm/postprocessing@6.26.4_three@0.140.0/node_modules/postprocessing/types/postprocessing.d.ts';

export const simpleEffects = [
  {
    name: BloomEffect.name,
    options: 'BloomEffectOptions',
    blendFunction: 'SCREEN',
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
    name: ToneMappingEffect.name,
    extraImports: ['ToneMappingMode'],
  },
  {
    name: VignetteEffect.name,
    extraImports: ['VignetteTechnique'],
  },
];

export default async function simpleEffectsGenerator(tree: Tree): Promise<string[]> {
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
  const effects = ['depth-of-field-effect', 'ssao-effect', 'lut-effect'];

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
          if (
            isConstructorDeclaration(constructorNode) &&
            (constructorNode.parameters[0].type as TypeLiteralNode).members?.length
          ) {
            (constructorNode.parameters[0].type as TypeLiteralNode).members.forEach((member) => {
              if (member.name.getText(sourceFile) !== 'blendFunction') {
                mainProperties.push(member);
              }
            });
          }
        }
      });

      return { mainProperties };
    });

    generateFiles(tree, join(__dirname, 'files', 'lib'), join(effectsDir, 'src', 'lib', normalizedNames.fileName), {
      blendFunction: undefined,
      extraImports: [],
      ...simpleEffect,
      ...normalizedNames,
      tmpl: '',
      ...inputRecord,
    });

    generatedSimpleEffects.push(normalizedNames.fileName);
  }

  generateFiles(tree, join(__dirname, 'files', 'index'), join(effectsDir, 'src'), {
    items: [...generatedSimpleEffects, ...effects],
    tmpl: '',
  });

  return generatedSimpleEffects;
}
