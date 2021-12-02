import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  logger,
  Tree,
} from '@nrwl/devkit';
import { join } from 'path';

export default async function controllersGenerator(
  tree: Tree,
  object3dSelectors: string[],
  audioSelectors: string[],
  lineSelectors: string[],
  sobaShapeSelectors: string[]
) {
  const meshSelectors = ['mesh', 'instanced-mesh', 'skinned-mesh'];
  const { libsDir } = getWorkspaceLayout(tree);
  const controllersDir = join(libsDir, 'core', 'src', 'lib', 'controllers');

  logger.log('Generating controllers...');

  const prefixedSobaSelectors = sobaShapeSelectors.map(
    (selector) => `soba-${selector}`
  );

  generateFiles(tree, join(__dirname, 'files'), controllersDir, {
    tmpl: '',
    audioSelectors,
    meshSelectors,
    lineSelectors,
    sobaShapeSelectors: prefixedSobaSelectors,
    selectors: Array.from(
      new Set([
        ...meshSelectors,
        ...audioSelectors,
        ...lineSelectors,
        ...object3dSelectors,
        ...prefixedSobaSelectors,
      ])
    ).map((selector, index) => ({
      selector,
      isLast: index === object3dSelectors.length - 1,
    })),
  });

  await formatFiles(tree);
}
