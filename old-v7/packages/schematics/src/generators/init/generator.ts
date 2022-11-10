import { addDependenciesToPackageJson, installPackagesTask, logger, readJson, Tree, updateJson } from '@nrwl/devkit';

export const ANGULAR_THREE_VERSION = '^7.0.0';
export const THREE_VERSION = '~0.145.0';
export const THREE_TYPES_VERSION = '~0.144.0';

export default async function (tree: Tree) {
  logger.info('Initializing Angular Three...');

  const packageJson = readJson(tree, 'package.json');

  const version =
    packageJson['dependencies']?.['@angular-three/schematics'] ||
    packageJson['devDependencies']?.['@angular-three/schematics'] ||
    ANGULAR_THREE_VERSION;

  addDependenciesToPackageJson(
    tree,
    {
      '@angular-three/core': version,
      three: THREE_VERSION,
    },
    {
      '@types/three': THREE_TYPES_VERSION,
    }
  );

  logger.info('Turning on skipLibCheck for other THREE dependencies...');
  const tsConfigPath = tree.exists('tsconfig.base.json') ? 'tsconfig.base.json' : 'tsconfig.json';

  // Turn on skipLibCheck for three-stdlib etc...
  updateJson(tree, tsConfigPath, (json) => {
    if (!('skipLibCheck' in json.compilerOptions) || json.compilerOptions?.skipLibCheck === false) {
      json.compilerOptions.skipLibCheck = true;
    }
    return json;
  });

  return () => {
    installPackagesTask(tree);
    logger.info(`
If @angular-three/schematics is added to your dependencies array, you can safely
move it to devDependencies or remove it completely.
`);
  };
}
