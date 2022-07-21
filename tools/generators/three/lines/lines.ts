import { librarySecondaryEntryPointGenerator } from '@nrwl/angular/generators';
import { formatFiles, generateFiles, getWorkspaceLayout, logger, names, Tree } from '@nrwl/devkit';
import { join } from 'path';
import * as THREE from 'three/src/Three';

export const lines = [THREE.Line.name, THREE.LineLoop.name, THREE.LineSegments.name];

export default async function linesGenerator(tree: Tree): Promise<string[]> {
  const { libsDir } = getWorkspaceLayout(tree);
  const lineDir = join(libsDir, 'core', 'lines');

  logger.log('Generating lines...');

  if (!tree.exists(lineDir)) {
    await librarySecondaryEntryPointGenerator(tree, {
      name: 'lines',
      library: 'core',
      skipModule: true,
    });
  }

  const generatedLines = [];
  for (const line of lines) {
    const normalizedNames = names(line);

    generateFiles(tree, join(__dirname, 'files/lib'), join(lineDir, 'src', 'lib', normalizedNames.fileName), {
      ...normalizedNames,
      tmpl: '',
    });

    generatedLines.push(normalizedNames.fileName);
  }

  generateFiles(tree, join(__dirname, 'files/index'), join(lineDir, 'src'), {
    items: generatedLines,
    tmpl: '',
  });

  await formatFiles(tree);

  return generatedLines;
}
