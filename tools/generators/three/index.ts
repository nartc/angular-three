import type { Tree } from '@nrwl/devkit';
import attributesGenerator from './attributes/attributes';
import audiosGenerator from './audios/audios';
import geometriesGenerator from './geometries/geometries';

/**
 *
 * import camerasGenerator from './cameras/cameras';
 * import cannonBodyControllerGenerator from './cannon-body-controller/cannon-body-controller';
 * import cannonConstraintControllerGenerator from './cannon-constraint-controller/cannon-constraint-controller';
 * import controllersGenerator from './controllers/controllers';
 * import curvesGenerator from './curves/curves';
 * import helpersGenerator from './helpers/helpers';
 * import lightsGenerator from './lights/lights';
 * import linesGenerator from './lines/lines';
 * import materialsGenerator from './materials/materials';
 * import physicBodiesGenerator from './physic-bodies/physic-bodies';
 * import physicConstraintsGenerator from './physic-constraints/physic-constraints';
 * import simpleEffectControllerGenerator from './postprocessing/simple-effect-controller';
 * import simpleEffectsGenerator from './postprocessing/simple-effects';
 * import spritesGenerator from './sprites/sprites';
 * import texturesGenerator from './textures/textures';
 */

export default async function (tree: Tree) {
    await Promise.all([
        geometriesGenerator(tree),
        // materialsGenerator(tree),
        attributesGenerator(tree),
        // curvesGenerator(tree),
        // texturesGenerator(tree),
    ]);

    const [
        audioSelectors,
        // cameraSelectors,
        // helperSelectors,
        // lightSelectors,
        // lineSelectors,
        // spriteSelectors,
        // simpleEffectSelectors,
        // physicBodySelectors,
        // physicConstraintSelectors,
    ] = await Promise.all([
        audiosGenerator(tree),
        // camerasGenerator(tree),
        // helpersGenerator(tree),
        // lightsGenerator(tree),
        // linesGenerator(tree),
        // spritesGenerator(tree),
        // simpleEffectsGenerator(tree),
        // physicBodiesGenerator(tree),
        // physicConstraintsGenerator(tree),
    ]);

    // await Promise.all([
    //     controllersGenerator(
    //         tree,
    //         [
    //             ...lightSelectors,
    //             ...helperSelectors,
    //             ...spriteSelectors,
    //             ...cameraSelectors,
    //         ],
    //         audioSelectors,
    //         lineSelectors
    //     ),
    //     cannonBodyControllerGenerator(
    //         tree,
    //         physicBodySelectors.map(({ name }) => name)
    //     ),
    //     cannonConstraintControllerGenerator(
    //         tree,
    //         physicConstraintSelectors.map(({ name }) => name)
    //     ),
    //     simpleEffectControllerGenerator(tree, simpleEffectSelectors),
    // ]);
}
