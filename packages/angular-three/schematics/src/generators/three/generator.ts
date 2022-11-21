import { logger, readJson, Tree } from '@nrwl/devkit';
import attributesGenerator from './attributes/attributes';
import geometriesGenerator from './geometries/geometries';

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
        // materialsGenerator(tree, ngtVersion),
        attributesGenerator(tree, ngtVersion),
        // audiosGenerator(tree, ngtVersion),
        // camerasGenerator(tree, ngtVersion),
        // curvesGenerator(tree, ngtVersion),
        // helpersGenerator(tree, ngtVersion),
        // lightsGenerator(tree, ngtVersion),
        // texturesGenerator(tree, ngtVersion),
        // simpleEffectsGenerator(tree, ngtVersion),
    ]);
}
