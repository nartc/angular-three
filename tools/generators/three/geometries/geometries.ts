import { librarySecondaryEntryPointGenerator } from '@nrwl/angular/generators';
import { formatFiles, generateFiles, getWorkspaceLayout, logger, names, Tree } from '@nrwl/devkit';
import { join } from 'path';
import * as THREE from 'three/src/Three';

export const geometries = [
  THREE.BufferGeometry.name,
  THREE.InstancedBufferGeometry.name,
  THREE.BoxBufferGeometry.name,
  THREE.CircleBufferGeometry.name,
  THREE.ConeBufferGeometry.name,
  THREE.CylinderBufferGeometry.name,
  THREE.DodecahedronBufferGeometry.name,
  THREE.ExtrudeBufferGeometry.name,
  THREE.IcosahedronBufferGeometry.name,
  THREE.LatheBufferGeometry.name,
  THREE.OctahedronBufferGeometry.name,
  THREE.PlaneBufferGeometry.name,
  THREE.PolyhedronBufferGeometry.name,
  THREE.RingBufferGeometry.name,
  THREE.ShapeBufferGeometry.name,
  THREE.SphereBufferGeometry.name,
  THREE.TetrahedronBufferGeometry.name,
  THREE.TorusBufferGeometry.name,
  THREE.TorusKnotBufferGeometry.name,
  THREE.TubeBufferGeometry.name,
  THREE.WireframeGeometry.name,
  THREE.EdgesGeometry.name,
  THREE.CapsuleBufferGeometry.name,
];

export default async function geometriesGenerator(tree: Tree) {
  const { libsDir } = getWorkspaceLayout(tree);
  const geometryDir = join(libsDir, 'core', 'geometries');

  logger.log('Generating geometries...');

  if (!tree.exists(geometryDir)) {
    await librarySecondaryEntryPointGenerator(tree, {
      name: 'geometries',
      library: 'core',
      skipModule: true,
    });
  }

  const generatedGeometries = [];
  for (const geometry of geometries) {
    const normalizedNames = names(geometry);

    generateFiles(tree, join(__dirname, 'files/lib'), join(geometryDir, 'src', 'lib', normalizedNames.fileName), {
      ...normalizedNames,
      tmpl: '',
    });

    generatedGeometries.push(normalizedNames.fileName);
  }

  generateFiles(tree, join(__dirname, 'files/index'), join(geometryDir, 'src'), {
    items: generatedGeometries,
    tmpl: '',
  });

  await formatFiles(tree);
}
