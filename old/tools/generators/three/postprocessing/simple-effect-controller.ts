import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  Tree,
} from '@nrwl/devkit';
import { join } from 'path';

export default async function simpleEffectControllerGenerator(
  tree: Tree,
  simpleEffectGenerators: string[]
) {
  const { libsDir } = getWorkspaceLayout(tree);
  const effectControllerDir = join(libsDir, 'postprocessing', 'src', 'lib');

  generateFiles(
    tree,
    join(__dirname, 'files', 'controller'),
    effectControllerDir,
    {
      tmpl: '',
      selectors: simpleEffectGenerators.map((selector, index) => ({
        selector,
        isLast: index === simpleEffectGenerators.length - 1,
      })),
    }
  );

  await formatFiles(tree);
}
