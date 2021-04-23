import {
  apply,
  applyTemplates,
  chain,
  MergeStrategy,
  mergeWith,
  move,
  Rule,
  url,
} from '@angular-devkit/schematics';
import { camelize, dasherize } from '@nrwl/workspace/src/utils/strings';
import * as path from 'path';
import * as THREE from 'three';

const geometries = [
  THREE.InstancedBufferGeometry,
  THREE.BoxBufferGeometry,
  THREE.CircleBufferGeometry,
  THREE.ConeBufferGeometry,
  THREE.CylinderBufferGeometry,
  THREE.DodecahedronBufferGeometry,
  THREE.ExtrudeBufferGeometry,
  THREE.IcosahedronBufferGeometry,
  THREE.LatheBufferGeometry,
  THREE.OctahedronBufferGeometry,
  THREE.ParametricBufferGeometry,
  THREE.PlaneBufferGeometry,
  THREE.PolyhedronBufferGeometry,
  THREE.RingBufferGeometry,
  THREE.ShapeBufferGeometry,
  THREE.SphereBufferGeometry,
  THREE.TetrahedronBufferGeometry,
  THREE.TextBufferGeometry,
  THREE.TorusBufferGeometry,
  THREE.TorusKnotBufferGeometry,
  THREE.TubeBufferGeometry,
  THREE.WireframeGeometry,
  THREE.EdgesGeometry,
].map((m) => m.name);

export default function (): Rule {
  return (_, context) => {
    context.logger.info('Generating THREE Geometries');

    const templates = geometries.map((geometry) => {
      return mergeWith(
        apply(url('./files/directive'), [
          applyTemplates({
            geometry,
            alternative: geometry.includes('BufferGeometry')
              ? geometry.replace('Buffer', '')
              : '',
            dasherize,
            camelize,
          }),
          move(
            path.normalize(
              `./packages/core/geometries/src/lib/${dasherize(geometry)}`
            )
          ),
        ]),
        MergeStrategy.Overwrite
      );
    });

    const indexTemplate = mergeWith(
      apply(url('./files/index'), [
        applyTemplates({ geometries, dasherize }),
        move(path.normalize(`./packages/core/geometries/src`)),
      ]),
      MergeStrategy.Overwrite
    );

    return chain([...templates, indexTemplate]);
  };
}
