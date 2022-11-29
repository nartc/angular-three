import { formatFiles, logger, readJson, Tree } from '@nrwl/devkit';
import attributesGenerator from './attributes/attributes';
import audiosGenerator from './audios/audios';
import camerasGenerator from './cameras/cameras';
import geometriesGenerator from './geometries/geometries';
import helpersGenerator from './helpers/helpers';
import lightsGenerator from './lights/lights';
import materialsGenerator from './materials/materials';
import objectsGenerator from './objects/objects';
import commonInputsOutputsGenerator from './soba/common-inputs-outputs';
import texturesGenerator from './textures/textures';

export default async function (tree: Tree) {
    const packageJson = readJson(tree, 'package.json');
    const nxJson = readJson(tree, 'nx.json');

    const packageName = packageJson ? packageJson['name'] : '';
    const npmScope = nxJson ? nxJson['npmScope'] : '';

    const isAngularThreeWorkspace = packageName === 'angular-three' || npmScope === 'angular-three';

    if (!isAngularThreeWorkspace) {
        logger.error('This generator can only be used in an angular-three workspace');
        return;
    }

    const ngtVersion: string = readJson(tree, 'version.json')?.version || 'latest';

    await Promise.all([
        geometriesGenerator(tree, ngtVersion),
        materialsGenerator(tree, ngtVersion),
        attributesGenerator(tree, ngtVersion),
        audiosGenerator(tree, ngtVersion),
        camerasGenerator(tree, ngtVersion),
        helpersGenerator(tree, ngtVersion),
        lightsGenerator(tree, ngtVersion),
        texturesGenerator(tree, ngtVersion),
        objectsGenerator(tree, ngtVersion),
        commonInputsOutputsGenerator(tree, ngtVersion),
        // simpleEffectsGenerator(tree, ngtVersion),
    ]);

    await formatFiles(tree);
}
