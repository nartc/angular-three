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

export const cameras = [
  THREE.Camera.name,
  THREE.PerspectiveCamera.name,
  THREE.OrthographicCamera.name,
  THREE.ArrayCamera.name,
  THREE.StereoCamera.name,
];

export default async function camerasGenerator(tree: Tree): Promise<string[]> {
  const { libsDir } = getWorkspaceLayout(tree);
  const cameraDir = join(libsDir, 'core', 'cameras');

  logger.log('Generating cameras...');

  if (!tree.exists(cameraDir)) {
    await librarySecondaryEntryPointGenerator(tree, {
      name: 'cameras',
      library: 'core',
      skipModule: true,
    });
  }

  const generatedCameras = [];
  for (const camera of cameras) {
    const normalizedNames = names(camera);

    generateFiles(
      tree,
      join(__dirname, 'files/lib'),
      join(cameraDir, 'src', 'lib', normalizedNames.fileName),
      {
        ...normalizedNames,
        tmpl: '',
      }
    );

    generatedCameras.push(normalizedNames.fileName);
  }

  generateFiles(tree, join(__dirname, 'files/index'), join(cameraDir, 'src'), {
    items: [...generatedCameras, 'cube-camera'],
    tmpl: '',
  });

  await formatFiles(tree);

  return [...generatedCameras, 'cube-camera'];
}
