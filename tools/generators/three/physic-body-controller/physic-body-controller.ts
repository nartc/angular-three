import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  Tree,
} from '@nrwl/devkit';
import { join } from 'path';

export default async function physicBodyControllerGenerator(
  tree: Tree,
  physicBodySelectors: string[]
) {
  const { libsDir } = getWorkspaceLayout(tree);
  const bodyControllerDir = join(libsDir, 'cannon', 'src', 'lib', 'bodies');

  generateFiles(tree, join(__dirname, 'files'), bodyControllerDir, {
    tmpl: '',
    selectors: physicBodySelectors.map((selector, index) => ({
      selector,
      isLast: index === physicBodySelectors.length - 1,
    })),
  });

  await formatFiles(tree);
}
