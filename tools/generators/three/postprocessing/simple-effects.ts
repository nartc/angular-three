import { librarySecondaryEntryPointGenerator } from '@nrwl/angular/generators';
import {
  generateFiles,
  getWorkspaceLayout,
  logger,
  names,
  Tree,
} from '@nrwl/devkit';
import { join } from 'path';

export const simpleEffects = [
  {
    name: 'Bloom',
    blendFunction: 'SCREEN',
  },
  {
    name: 'BrightnessContrast',
  },
  {
    name: 'ColorDepth',
  },
  {
    name: 'Depth',
  },
  {
    name: 'DotScreen',
  },
  {
    name: 'HueSaturation',
  },
  {
    name: 'Noise',
    blendFunction: 'COLOR_DODGE',
  },
  {
    name: 'Scanline',
    blendFunction: 'OVERLAY',
  },
  {
    name: 'Sepia',
  },
  {
    name: 'ShockWave',
  },
  {
    name: 'ToneMapping',
  },
  {
    name: 'Vignette',
  },
];

export default async function simpleEffectsGenerator(
  tree: Tree
): Promise<string[]> {
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
  const effects = ['depth-of-field'];

  for (const simpleEffect of simpleEffects) {
    const normalizedNames = names(simpleEffect.name);

    generateFiles(
      tree,
      join(__dirname, 'files', 'lib'),
      join(effectsDir, 'src', 'lib', normalizedNames.fileName),
      {
        blendFunction: undefined,
        ...simpleEffect,
        ...normalizedNames,
        tmpl: '',
      }
    );

    generatedSimpleEffects.push(normalizedNames.fileName);
  }

  generateFiles(
    tree,
    join(__dirname, 'files', 'index'),
    join(effectsDir, 'src'),
    {
      items: [...generatedSimpleEffects, ...effects],
      tmpl: '',
    }
  );

  return generatedSimpleEffects;
}
