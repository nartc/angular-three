import type { Tree } from '@nrwl/devkit';
import attributesGenerator from './attributes/attributes';
import audiosGenerator from './audios/audios';
import camerasGenerator from './cameras/cameras';
import curvesGenerator from './curves/curves';
import geometriesGenerator from './geometries/geometries';
import helpersGenerator from './helpers/helpers';
import lightsGenerator from './lights/lights';
import linesGenerator from './lines/lines';
import materialsGenerator from './materials/materials';
import physicBodiesGenerator from './physic-bodies/physic-bodies';
import physicConstraintsGenerator from './physic-constraints/physic-constraints';
import spritesGenerator from './sprites/sprites';
import texturesGenerator from './textures/textures';

/**
 *
 * import simpleEffectControllerGenerator from './postprocessing/simple-effect-controller';
 * import simpleEffectsGenerator from './postprocessing/simple-effects';
 */

export default async function (tree: Tree) {
    await Promise.all([
        geometriesGenerator(tree),
        materialsGenerator(tree),
        attributesGenerator(tree),
        audiosGenerator(tree),
        camerasGenerator(tree),
        curvesGenerator(tree),
        helpersGenerator(tree),
        lightsGenerator(tree),
        spritesGenerator(tree),
        texturesGenerator(tree),
        linesGenerator(tree),
        physicBodiesGenerator(tree),
        physicConstraintsGenerator(tree),
    ]);
    //
    // const [
    //     // simpleEffectSelectors,
    //     // physicBodySelectors,
    //     // physicConstraintSelectors,
    // ] = await Promise.all([
    //     // simpleEffectsGenerator(tree),
    //     // physicBodiesGenerator(tree),
    //     // physicConstraintsGenerator(tree),
    // ]);
    //
    // // await Promise.all([
    // //     cannonBodyControllerGenerator(
    // //         tree,
    // //         physicBodySelectors.map(({ name }) => name)
    // //     ),
    // //     cannonConstraintControllerGenerator(
    // //         tree,
    // //         physicConstraintSelectors.map(({ name }) => name)
    // //     ),
    // //     simpleEffectControllerGenerator(tree, simpleEffectSelectors),
    // // ]);
}
