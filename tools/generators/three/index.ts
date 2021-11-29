import { Tree } from '@nrwl/devkit';
import attributesGenerator from './attributes/attributes';
import audiosGenerator from './audios/audios';
import controllersGenerator from './controllers/controllers';
import geometriesGenerator from './geometries/geometries';
import lightsGenerator from './lights/lights';
import materialsGenerator from './materials/materials';

export default async function (tree: Tree) {
  await Promise.all([
    materialsGenerator(tree),
    geometriesGenerator(tree),
    attributesGenerator(tree),
  ]);

  const [audioSelectors, lightSelectors] = await Promise.all([
    audiosGenerator(tree),
    lightsGenerator(tree),
  ]);

  await controllersGenerator(tree, [...lightSelectors], audioSelectors, []);
}
