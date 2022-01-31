import { librarySecondaryEntryPointGenerator } from '@nrwl/angular/generators';
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

export const sprites = [THREE.Sprite.name];

export default async function spritesGenerator(tree: Tree): Promise<string[]> {
  const { libsDir } = getWorkspaceLayout(tree);
  const spriteDir = join(libsDir, 'core', 'sprites');

  logger.log('Generating sprites...');

  if (!tree.exists(spriteDir)) {
    await librarySecondaryEntryPointGenerator(tree, {
      name: 'sprites',
      library: 'core',
      skipModule: true,
    });
  }

  const generatedSprites = [];
  for (const sprite of sprites) {
    const normalizedNames = names(sprite);

    generateFiles(
      tree,
      join(__dirname, 'files/lib'),
      join(spriteDir, 'src', 'lib', normalizedNames.fileName),
      {
        ...normalizedNames,
        tmpl: '',
      }
    );

    generatedSprites.push(normalizedNames.fileName);
  }

  generateFiles(tree, join(__dirname, 'files/index'), join(spriteDir, 'src'), {
    items: generatedSprites,
    tmpl: '',
  });

  await formatFiles(tree);

  return generatedSprites;
}
