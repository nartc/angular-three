import { addDependenciesToPackageJson, formatFiles, Tree } from '@nrwl/devkit';
import {
  COMPONENT_STORE_VERSION,
  THREE_TYPES_VERSION,
  THREE_VERSION,
} from './versions';

export default async function (tree: Tree) {
  addDependenciesToPackageJson(
    tree,
    {
      three: THREE_VERSION,
      '@ngrx/component-store': COMPONENT_STORE_VERSION,
    },
    {
      '@types/three': THREE_TYPES_VERSION,
    }
  );

  await formatFiles(tree);
}
