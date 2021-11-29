import { Tree } from '@nrwl/devkit';
import attributesGenerator from './attributes/attributes';
import geometriesGenerator from './geometries/geometries';
import materialsGenerator from './materials/materials';

export default async function (tree: Tree) {
  await Promise.all([
    materialsGenerator(tree),
    geometriesGenerator(tree),
    attributesGenerator(tree),
  ]);
}
