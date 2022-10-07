import { librarySecondaryEntryPointGenerator } from '@nrwl/angular/generators';
import { formatFiles, generateFiles, getWorkspaceLayout, logger, names, Tree } from '@nrwl/devkit';
import { join } from 'path';
import * as THREE from 'three';
import { isClassDeclaration, isConstructorDeclaration } from 'typescript/lib/tsserverlibrary';
import { astFromPath } from '../ast-utils';

export const sprites = [
  {
    name: THREE.Sprite.name,
    defPath: 'node_modules/@types/three/src/objects/Sprite.d.ts',
  },
];

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
    const normalizedNames = names(sprite.name);

    const inputRecord = astFromPath(tree, sprite.defPath, (sourceFile) => {
      const mainParameters = [];
      sourceFile.forEachChild((node) => {
        if (isClassDeclaration(node)) {
          node.members.forEach((member) => {
            if (isConstructorDeclaration(member)) {
              for (const parameter of member.parameters) {
                if (parameter.name.getText(sourceFile) === 'material') {
                  continue;
                }
                mainParameters.push(parameter);
              }
            }
          });
        }
      });

      return { mainProperties: mainParameters };
    });

    generateFiles(tree, join(__dirname, 'files/lib'), join(spriteDir, 'src', 'lib', normalizedNames.fileName), {
      ...normalizedNames,
      tmpl: '',
      ...inputRecord,
    });

    generatedSprites.push(normalizedNames.fileName);
  }

  generateFiles(tree, join(__dirname, 'files/index'), join(spriteDir, 'src'), {
    items: generatedSprites,
    tmpl: '',
  });

  await formatFiles(tree);

  return generatedSprites;
}
