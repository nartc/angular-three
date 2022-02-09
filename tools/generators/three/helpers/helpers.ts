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

export const helpers = [
  THREE.ArrowHelper.name,
  THREE.AxesHelper.name,
  THREE.Box3Helper.name,
  THREE.GridHelper.name,
  THREE.PlaneHelper.name,
  THREE.PolarGridHelper.name,
];

export const objectHelpers = [
  THREE.BoxHelper.name,
  THREE.CameraHelper.name,
  THREE.DirectionalLightHelper.name,
  THREE.HemisphereLightHelper.name,
  THREE.PointLightHelper.name,
  THREE.SkeletonHelper.name,
  THREE.SpotLightHelper.name,
];

export default async function helpersGenerator(tree: Tree): Promise<string[]> {
  const { libsDir } = getWorkspaceLayout(tree);
  const helperDir = join(libsDir, 'core', 'helpers');

  logger.log('Generating helpers...');

  if (!tree.exists(helperDir)) {
    await librarySecondaryEntryPointGenerator(tree, {
      name: 'helpers',
      library: 'core',
      skipModule: true,
    });
  }

  const generatedHelpers = [];
  for (const helper of helpers) {
    const normalizedNames = names(helper);

    generateFiles(
      tree,
      join(__dirname, 'files/lib'),
      join(helperDir, 'src', 'lib', normalizedNames.fileName),
      {
        ...normalizedNames,
        objectHelper: false,
        tmpl: '',
      }
    );

    generatedHelpers.push(normalizedNames.fileName);
  }

  const generatedObjectHelpers = [];
  for (const objectHelper of objectHelpers) {
    const normalizedNames = names(objectHelper);

    generateFiles(
      tree,
      join(__dirname, 'files/lib'),
      join(helperDir, 'src', 'lib', normalizedNames.fileName),
      {
        ...normalizedNames,
        objectHelper: true,
        tmpl: '',
      }
    );

    generatedObjectHelpers.push(normalizedNames.fileName);
  }

  generateFiles(tree, join(__dirname, 'files/index'), join(helperDir, 'src'), {
    items: [...generatedHelpers, ...generatedObjectHelpers],
    tmpl: '',
  });

  await formatFiles(tree);

  return generatedHelpers;
}
