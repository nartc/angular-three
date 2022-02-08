import { librarySecondaryEntryPointGenerator } from '@nrwl/angular/generators';
import {
  formatFiles,
  generateFiles,
  getWorkspaceLayout,
  logger,
  names,
  Tree,
} from '@nrwl/devkit';
import { join } from 'path';
import * as THREE from 'three';

export const curves = [
  THREE.CatmullRomCurve3.name,
  THREE.CubicBezierCurve.name,
  THREE.CubicBezierCurve3.name,
  THREE.EllipseCurve.name,
  THREE.LineCurve.name,
  THREE.LineCurve3.name,
  THREE.QuadraticBezierCurve.name,
  THREE.QuadraticBezierCurve3.name,
  THREE.SplineCurve.name,
];

export default async function curvesGenerator(tree: Tree) {
  const { libsDir } = getWorkspaceLayout(tree);
  const curveDir = join(libsDir, 'core', 'curves');

  logger.log('Generating curves...');

  if (!tree.exists(curveDir)) {
    await librarySecondaryEntryPointGenerator(tree, {
      name: 'curves',
      library: 'core',
      skipModule: true,
    });
  }

  const generatedCurves = [];
  for (const curve of curves) {
    const normalizedNames = names(curve);

    generateFiles(
      tree,
      join(__dirname, 'files/lib'),
      join(curveDir, 'src', 'lib', normalizedNames.fileName),
      {
        ...normalizedNames,
        tmpl: '',
      }
    );

    generatedCurves.push(normalizedNames.fileName);
  }

  generateFiles(tree, join(__dirname, 'files/index'), join(curveDir, 'src'), {
    items: generatedCurves,
    tmpl: '',
  });

  await formatFiles(tree);
}
