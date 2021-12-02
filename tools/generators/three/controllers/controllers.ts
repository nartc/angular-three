import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
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

  generateFiles(tree, join(__dirname, 'files'), controllersDir, {
    tmpl: '',
    audioSelectors,
    meshSelectors,
    lineSelectors,
    sobaShapeSelectors,
    selectors: Array.from(
      new Set([
        ...meshSelectors,
        ...audioSelectors,
        ...lineSelectors,
        ...object3dSelectors,
        ...sobaShapeSelectors,
      ])
    ).map((selector, index) => ({
      selector,
      isLast: index === object3dSelectors.length - 1,
    })),
  });

  await formatFiles(tree);
}
