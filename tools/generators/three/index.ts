import { installPackagesTask, Tree } from '@nrwl/devkit';
import controlEntityGenerator from './generators/control-entity/control-entity.generator';
import coreEntityGenerator from './generators/core-entity/core-entity.generator';

export default async function (tree: Tree) {
  await Promise.all([controlEntityGenerator(tree), coreEntityGenerator(tree)]);
  return () => {
    installPackagesTask(tree);
  };
}
