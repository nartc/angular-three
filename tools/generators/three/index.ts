import { installPackagesTask, Tree } from '@nrwl/devkit';
import sobaShapeEntityGenerator from './generators/soba-shape-entity/soba-shape-entity.generator';

export default async function (tree: Tree) {
  await Promise.all([
    sobaShapeEntityGenerator(tree),
    // controlEntityGenerator(tree),
    // coreEntityGenerator(tree),
    // passEntityGenerator(tree),
    // physicBodyEntityGenerator(tree),
    // physicConstraintEntityGenerator(tree),
  ]);
  return () => {
    installPackagesTask(tree);
  };
}
