import {
  addDependenciesToPackageJson,
  installPackagesTask,
  logger,
  Tree,
  updateJson,
} from '@nrwl/devkit';
import { THREE_TYPES_VERSION, THREE_VERSION } from './versions';

export default async function (tree: Tree) {
  logger.info('Initializing @angular-three/core...');

  addDependenciesToPackageJson(
    tree,
    {
      three: THREE_VERSION,
    },
    {
      '@types/three': THREE_TYPES_VERSION,
    }
  );

  const tsConfigPath = tree.exists('tsconfig.base.json')
    ? 'tsconfig.base.json'
    : 'tsconfig.json';

  // Turn on skipLibCheck for three-stdlib etc...
  updateJson(tree, tsConfigPath, (json) => {
    if (
      !('skipLibCheck' in json.compilerOptions) ||
      json.compilerOptions?.skipLibCheck === false
    ) {
      json.compilerOptions.skipLibCheck = true;
    }
    return json;
  });

  return () => {
    installPackagesTask(tree);
  };
}
