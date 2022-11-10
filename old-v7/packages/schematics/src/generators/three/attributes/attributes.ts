import { librarySecondaryEntryPointGenerator } from '@nrwl/angular/generators';
import { generateFiles, getWorkspaceLayout, logger, names, Tree } from '@nrwl/devkit';
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

export const primitiveAttributes = [
  {
    name: THREE.Color.name,
    inputType: 'NgtColor',
  },
  {
    name: THREE.Fog.name,
    inputType: 'NgtFog',
  },
  {
    name: THREE.FogExp2.name,
    inputType: 'NgtFogExp2',
  },
  {
    name: THREE.Vector2.name,
    inputType: 'NgtVector2',
  },
  {
    name: THREE.Vector3.name,
    inputType: 'NgtVector3',
  },
  {
    name: THREE.Vector4.name,
    inputType: 'NgtVector4',
  },
  {
    name: THREE.Matrix3.name,
    inputType: 'NgtMatrix3',
    makeFunction: 'make',
  },
  {
    name: THREE.Matrix4.name,
    inputType: 'NgtMatrix4',
  },
];

export default async function attributesGenerator(tree: Tree, ngtVersion: string) {
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

    generateFiles(tree, join(__dirname, 'files/lib'), join(attributeDir, 'src', 'lib', normalizedNames.fileName), {
      ...normalizedNames,
      tmpl: '',
      ngtVersion,
    });

    generatedAttributes.push(normalizedNames.fileName);
  }

  for (const primitiveAttribute of primitiveAttributes) {
    const normalizedNames = names(primitiveAttribute.name);

    generateFiles(
      tree,
      join(__dirname, 'files/primitive'),
      join(attributeDir, 'src', 'lib', `${normalizedNames.fileName}-attribute`),
      {
        ...primitiveAttribute,
        ...normalizedNames,
        tmpl: '',
        ngtVersion,
      }
    );

    generatedAttributes.push(`${normalizedNames.fileName}-attribute`);
  }

  generateFiles(tree, join(__dirname, '../common/files/index'), join(attributeDir, 'src'), {
    items: [...generatedAttributes, 'value-attribute'],
    tmpl: '',
    ngtVersion,
  });
}
