import { librarySecondaryEntryPointGenerator } from '@nrwl/angular/generators';
import { generateFiles, getWorkspaceLayout, logger, names, Tree } from '@nrwl/devkit';
import { join } from 'path';
import * as THREE from 'three';

export const geometries = [
  THREE.BoxGeometry.name,
  THREE.CapsuleGeometry.name,
  THREE.CircleGeometry.name,
  THREE.ConeGeometry.name,
  THREE.CylinderGeometry.name,
  THREE.DodecahedronGeometry.name,
  THREE.EdgesGeometry.name,
  THREE.ExtrudeGeometry.name,
  THREE.IcosahedronGeometry.name,
  THREE.LatheGeometry.name,
  THREE.OctahedronGeometry.name,
  THREE.PlaneGeometry.name,
  THREE.PolyhedronGeometry.name,
  THREE.RingGeometry.name,
  THREE.ShapeGeometry.name,
  THREE.SphereGeometry.name,
  THREE.TetrahedronGeometry.name,
  THREE.TorusGeometry.name,
  THREE.TorusKnotGeometry.name,
  THREE.TubeGeometry.name,
  THREE.WireframeGeometry.name,
  THREE.BufferGeometry.name,
  THREE.InstancedBufferGeometry.name,
];

export default async function geometriesGenerator(tree: Tree, ngtVersion: string) {
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
      ngtVersion,
    });

    generatedGeometries.push(normalizedNames.fileName);
  }

  generateFiles(tree, join(__dirname, '../common/files/index'), join(geometryDir, 'src'), {
    items: generatedGeometries,
    tmpl: '',
    ngtVersion,
  });
}
