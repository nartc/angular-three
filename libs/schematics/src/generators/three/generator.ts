import { Tree } from '@nrwl/devkit';
import geometriesGenerator from './geometries/geometries';

export default async function (tree: Tree) {
  await Promise.all([geometriesGenerator(tree)]);
}
