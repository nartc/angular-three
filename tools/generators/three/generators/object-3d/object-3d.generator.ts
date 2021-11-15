import { generateFiles, getWorkspaceLayout, Tree } from '@nrwl/devkit';
import { join } from 'path';

async function object3dGenerator(tree: Tree, derivedObject3Ds: string[]) {
  const { libsDir } = getWorkspaceLayout(tree);
  generateFiles(
    tree,
    join(__dirname, 'files'),
    join(libsDir, 'core', 'src', 'lib', 'three'),
    {
      selectors: derivedObject3Ds.map((selector, index) => ({
        selector,
        isLast: index === derivedObject3Ds.length - 1,
      })),
      tmpl: '',
    }
  );
}

export default object3dGenerator;
