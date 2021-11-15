import { installPackagesTask, Tree } from '@nrwl/devkit';
import controlEntityGenerator from './generators/control-entity/control-entity.generator';
import coreEntityGenerator from './generators/core-entity/core-entity.generator';
import passEntityGenerator from './generators/pass-entity/pass-entity.generator';

export default async function (tree: Tree) {
  await Promise.all([
    controlEntityGenerator(tree),
    coreEntityGenerator(tree),
    passEntityGenerator(tree),
  ]);
  return () => {
    installPackagesTask(tree);
  };
}
