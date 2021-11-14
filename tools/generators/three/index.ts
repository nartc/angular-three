import { installPackagesTask, Tree } from '@nrwl/devkit';
import controlEntityGenerator from './generators/control-entity/control-entity.generator';

export default async function (tree: Tree) {
  await controlEntityGenerator(tree);
  return () => {
    installPackagesTask(tree);
  };
}
