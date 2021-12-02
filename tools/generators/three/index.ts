import { Tree } from '@nrwl/devkit';
import attributesGenerator from './attributes/attributes';
import audiosGenerator from './audios/audios';
import camerasGenerator from './cameras/cameras';
import controllersGenerator from './controllers/controllers';
import curvesGenerator from './curves/curves';
import geometriesGenerator from './geometries/geometries';
import helpersGenerator from './helpers/helpers';
import lightsGenerator from './lights/lights';
import linesGenerator from './lines/lines';
import materialsGenerator from './materials/materials';
import physicBodiesGenerator from './physic-bodies/physic-bodies';
import physicBodyControllerGenerator from './physic-body-controller/physic-body-controller';
import physicConstraintControllerGenerator from './physic-constraint-controller/physic-constraint-controller';
import physicConstraintsGenerator from './physic-constraints/physic-constraints';
import sobaShapesGenerator from './soba-shapes/soba-shapes';
import spritesGenerator from './sprites/sprites';
import texturesGenerator from './textures/textures';

export default async function (tree: Tree) {
  await Promise.all([
    materialsGenerator(tree),
    geometriesGenerator(tree),
    attributesGenerator(tree),
    curvesGenerator(tree),
    texturesGenerator(tree),
  ]);

  const [
    audioSelectors,
    lightSelectors,
    helperSelectors,
    lineSelectors,
    spriteSelectors,
    cameraSelectors,
    physicBodySelectors,
    physicConstraintSelectors,
    sobaShapeSelectors,
  ] = await Promise.all([
    audiosGenerator(tree),
    lightsGenerator(tree),
    helpersGenerator(tree),
    linesGenerator(tree),
    spritesGenerator(tree),
    camerasGenerator(tree),
    physicBodiesGenerator(tree),
    physicConstraintsGenerator(tree),
    sobaShapesGenerator(tree),
  ]);

  const additionalSobaSelectors = [];

  await Promise.all([
    controllersGenerator(
      tree,
      [
        ...lightSelectors,
        ...helperSelectors,
        ...spriteSelectors,
        ...cameraSelectors,
        ...additionalSobaSelectors,
      ],
      audioSelectors,
      lineSelectors,
      sobaShapeSelectors
    ),
    physicBodyControllerGenerator(
      tree,
      physicBodySelectors.map(({ name }) => name)
    ),
    physicConstraintControllerGenerator(
      tree,
      physicConstraintSelectors.map(({ name }) => name)
    ),
  ]);
}
