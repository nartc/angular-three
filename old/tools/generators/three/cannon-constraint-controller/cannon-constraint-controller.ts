import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  Tree,
} from '@nrwl/devkit';
import { join } from 'path';

export default async function cannonConstraintControllerGenerator(
  tree: Tree,
  physicConstraintSelectors: string[]
) {
  const { libsDir } = getWorkspaceLayout(tree);
  const bodyControllerDir = join(
    libsDir,
    'cannon',
    'constraints',
    'src',
    'lib'
  );

  generateFiles(tree, join(__dirname, 'files'), bodyControllerDir, {
    tmpl: '',
    selectors: physicConstraintSelectors.map((selector, index) => ({
      selector,
      isLast: index === physicConstraintSelectors.length - 1,
    })),
  });

  await formatFiles(tree);
}
