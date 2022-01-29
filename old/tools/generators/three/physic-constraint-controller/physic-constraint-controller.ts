import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  Tree,
} from '@nrwl/devkit';
import { join } from 'path';

export default async function physicConstraintControllerGenerator(
  tree: Tree,
  physicConstraintSelectors: string[]
) {
  const { libsDir } = getWorkspaceLayout(tree);
  const bodyControllerDir = join(libsDir, 'cannon', 'src', 'lib', 'constraint');

  generateFiles(tree, join(__dirname, 'files'), bodyControllerDir, {
    tmpl: '',
    selectors: physicConstraintSelectors.map((selector, index) => ({
      selector,
      isLast: index === physicConstraintSelectors.length - 1,
    })),
  });

  await formatFiles(tree);
}
