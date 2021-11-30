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

export const attributes = [
  THREE.BufferAttribute.name,
  THREE.InstancedBufferAttribute.name,
  THREE.InterleavedBufferAttribute.name,
  THREE.Float16BufferAttribute.name,
  THREE.Float32BufferAttribute.name,
  THREE.Float64BufferAttribute.name,
  THREE.Int8BufferAttribute.name,
  THREE.Int16BufferAttribute.name,
  THREE.Int32BufferAttribute.name,
  THREE.Uint8BufferAttribute.name,
  THREE.Uint16BufferAttribute.name,
  THREE.Uint32BufferAttribute.name,
  THREE.Uint8ClampedBufferAttribute.name,
];

export default async function attributesGenerator(tree: Tree) {
  const { libsDir } = getWorkspaceLayout(tree);
  const attributeDir = join(libsDir, 'core', 'attributes');

  logger.log('Generating attributes...');

  if (!tree.exists(attributeDir)) {
    await librarySecondaryEntryPointGenerator(tree, {
      name: 'attributes',
      library: 'core',
      skipModule: true,
    });
  }

  const generatedAttributes = [];
  for (const attribute of attributes) {
    const normalizedNames = names(attribute);

    generateFiles(
      tree,
      join(__dirname, 'files/lib'),
      join(attributeDir, 'src', 'lib', normalizedNames.fileName),
      {
        ...normalizedNames,
        tmpl: '',
      }
    );

    generatedAttributes.push(normalizedNames.fileName);
  }

  generateFiles(
    tree,
    join(__dirname, 'files/index'),
    join(attributeDir, 'src'),
    {
      items: generatedAttributes,
      tmpl: '',
    }
  );

  await formatFiles(tree);
}
