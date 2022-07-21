import { librarySecondaryEntryPointGenerator } from '@nrwl/angular/generators';
import { formatFiles, generateFiles, getWorkspaceLayout, logger, names, Tree } from '@nrwl/devkit';
import { join } from 'path';
import * as THREE from 'three/src/Three';
import { isClassDeclaration, isConstructorDeclaration } from 'typescript/lib/tsserverlibrary';
import { astFromPath } from '../ast-utils';

export const cameras = [
  {
    name: THREE.PerspectiveCamera.name,
    defPath: 'node_modules/@types/three/src/cameras/PerspectiveCamera.d.ts',
  },
  {
    name: THREE.OrthographicCamera.name,
    defPath: 'node_modules/@types/three/src/cameras/OrthographicCamera.d.ts',
  },
  {
    name: THREE.ArrayCamera.name,
    defPath: 'node_modules/@types/three/src/cameras/ArrayCamera.d.ts',
  },
  {
    name: THREE.StereoCamera.name,
    defPath: 'node_modules/@types/three/src/cameras/StereoCamera.d.ts',
  },
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
    const normalizedNames = names(camera.name);

    const inputRecord = astFromPath(tree, camera.defPath, (sourceFile) => {
      const mainParameters = [];
      sourceFile.forEachChild((node) => {
        if (isClassDeclaration(node)) {
          node.members.forEach((member) => {
            if (isConstructorDeclaration(member)) {
              member.parameters.forEach((parameter) => {
                mainParameters.push(parameter);
              });
            }
          });
        }
      });

      return { mainProperties: mainParameters };
    });

    generateFiles(tree, join(__dirname, 'files/lib'), join(cameraDir, 'src', 'lib', normalizedNames.fileName), {
      ...normalizedNames,
      tmpl: '',
      ...inputRecord,
    });

    generatedCameras.push(normalizedNames.fileName);
  }

  generateFiles(tree, join(__dirname, 'files/index'), join(cameraDir, 'src'), {
    items: [...generatedCameras, 'cube-camera'],
    tmpl: '',
  });

  await formatFiles(tree);

  return [...generatedCameras, 'cube-camera'];
}
