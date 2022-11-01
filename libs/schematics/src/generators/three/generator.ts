import { logger, readJson, Tree } from '@nrwl/devkit';
import attributesGenerator from './attributes/attributes';
import geometriesGenerator from './geometries/geometries';
import materialsGenerator from './materials/materials';

export default async function (tree: Tree) {
  const packageJson = readJson(tree, 'package.json');
  const nxJson = readJson(tree, 'nx.json');

  const packageName = packageJson ? packageJson['name'] : '';
  const npmScope = nxJson ? nxJson['npmScope'] : '';

  const isAngularThreeWorkspace =
    packageName === 'angular-three' || npmScope === 'angular-three';

  if (!isAngularThreeWorkspace) {
    logger.error(
      'This generator can only be used in an angular-three workspace'
    );
    return;
  }

  await Promise.all([
    geometriesGenerator(tree),
    materialsGenerator(tree),
    attributesGenerator(tree),
  ]);
}