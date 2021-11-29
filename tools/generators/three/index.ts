import { Tree } from '@nrwl/devkit';
import attributesGenerator from './attributes/attributes';
import audiosGenerator from './audios/audios';
import controllersGenerator from './controllers/controllers';
import geometriesGenerator from './geometries/geometries';
import materialsGenerator from './materials/materials';

export default async function (tree: Tree) {
  await Promise.all([
    materialsGenerator(tree),
    geometriesGenerator(tree),
    attributesGenerator(tree),
  ]);

  const audioSelectors = await audiosGenerator(tree);

  await controllersGenerator(tree, [...audioSelectors], audioSelectors, []);
}
