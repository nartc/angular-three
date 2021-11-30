import { Tree } from '@nrwl/devkit';
import attributesGenerator from './attributes/attributes';
import audiosGenerator from './audios/audios';
import controllersGenerator from './controllers/controllers';
import curvesGenerator from './curves/curves';
import geometriesGenerator from './geometries/geometries';
import helpersGenerator from './helpers/helpers';
import lightsGenerator from './lights/lights';
import materialsGenerator from './materials/materials';
import texturesGenerator from './textures/textures';

export default async function (tree: Tree) {
  await Promise.all([
    materialsGenerator(tree),
    geometriesGenerator(tree),
    attributesGenerator(tree),
    curvesGenerator(tree),
    texturesGenerator(tree),
  ]);

  const [audioSelectors, lightSelectors, helperSelectors] = await Promise.all([
    audiosGenerator(tree),
    lightsGenerator(tree),
    helpersGenerator(tree),
  ]);

  await controllersGenerator(
    tree,
    [...lightSelectors, ...helperSelectors],
    audioSelectors,
    []
  );
}
