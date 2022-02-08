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

export const textures = [
  THREE.CanvasTexture.name,
  THREE.CompressedTexture.name,
  THREE.CubeTexture.name,
  THREE.DataTexture.name,
  THREE.DataTexture2DArray.name,
  THREE.DataTexture3D.name,
  THREE.DepthTexture.name,
  THREE.VideoTexture.name,
];

export default async function texturesGenerator(tree: Tree) {
  const { libsDir } = getWorkspaceLayout(tree);
  const textureDir = join(libsDir, 'core', 'textures');

  logger.log('Generating textures...');

  if (!tree.exists(textureDir)) {
    await librarySecondaryEntryPointGenerator(tree, {
      name: 'textures',
      library: 'core',
      skipModule: true,
    });
  }

  const generatedTextures = [];
  for (const texture of textures) {
    const normalizedNames = names(texture);

    generateFiles(
      tree,
      join(__dirname, 'files/lib'),
      join(textureDir, 'src', 'lib', normalizedNames.fileName),
      {
        ...normalizedNames,
        tmpl: '',
      }
    );

    generatedTextures.push(normalizedNames.fileName);
  }

  generateFiles(tree, join(__dirname, 'files/index'), join(textureDir, 'src'), {
    items: generatedTextures,
    tmpl: '',
  });

  await formatFiles(tree);
}
