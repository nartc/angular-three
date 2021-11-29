import { Tree } from '@nrwl/devkit';
import materialsGenerator from './materials/materials';

export default async function (tree: Tree) {
  await Promise.all([materialsGenerator(tree)]);
}
