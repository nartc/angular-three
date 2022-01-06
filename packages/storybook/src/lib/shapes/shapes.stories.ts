import { NgtMeshPhongMaterialModule } from '@angular-three/core/materials';
import {
  NgtSobaBoxModule,
  NgtSobaCircleModule,
  NgtSobaConeModule,
  NgtSobaCylinderModule,
  NgtSobaDodecahedronModule,
  NgtSobaExtrudeModule,
  NgtSobaIcosahedronModule,
  NgtSobaLatheModule,
  NgtSobaOctahedronModule,
  NgtSobaPlaneModule,
  NgtSobaPolyhedronModule,
  NgtSobaRingModule,
  NgtSobaSphereModule,
  NgtSobaTetrahedronModule,
  NgtSobaTorusKnotModule,
  NgtSobaTorusModule,
  NgtSobaTubeModule,
} from '@angular-three/soba/shapes';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  Story,
} from '@storybook/angular';
import * as THREE from 'three';
import { setupCanvas, setupCanvasModules } from '../setup-canvas';

export default {
  title: 'Soba/Shapes',
  decorators: [
    componentWrapperDecorator(setupCanvas({ black: true })),
    moduleMetadata({
      imports: [
        ...setupCanvasModules,
        NgtMeshPhongMaterialModule,
        NgtSobaBoxModule,
        NgtSobaCircleModule,
        NgtSobaConeModule,
        NgtSobaCylinderModule,
        NgtSobaDodecahedronModule,
        NgtSobaExtrudeModule,
        NgtSobaIcosahedronModule,
        NgtSobaLatheModule,
        NgtSobaOctahedronModule,
        NgtSobaPlaneModule,
        NgtSobaPolyhedronModule,
        NgtSobaRingModule,
        NgtSobaSphereModule,
        NgtSobaTetrahedronModule,
        NgtSobaTorusModule,
        NgtSobaTorusKnotModule,
        NgtSobaTubeModule,
      ],
    }),
  ],
} as Meta;

function onAnimate(object: THREE.Object3D) {
  object.rotation.y += 0.01;
}

type ShapeSelector =
  | 'ngt-soba-box'
  | 'ngt-soba-circle'
  | 'ngt-soba-cone'
  | 'ngt-soba-cylinder'
  | 'ngt-soba-dodecahedron'
  | 'ngt-soba-extrude'
  | 'ngt-soba-icosahedron'
  | 'ngt-soba-lathe'
  | 'ngt-soba-octahedron'
  | 'ngt-soba-plane'
  | 'ngt-soba-polyhedron'
  | 'ngt-soba-ring'
  | 'ngt-soba-sphere'
  | 'ngt-soba-tetrahedron'
  | 'ngt-soba-torus'
  | 'ngt-soba-torus-knot'
  | 'ngt-soba-tube';

function shapeStory(shapeSelector: ShapeSelector, args?: unknown[]): Story {
  const templateVar = shapeSelector.replace(/-/g, '');
  return () => ({
    props: { onAnimate, args },
    template: `
      <${shapeSelector} #${templateVar} (animateReady)='onAnimate(${templateVar}.object)' [args]='args'>
        <ngt-mesh-phong-material [parameters]='{color: "#f3f3f3", wireframe: true}'></ngt-mesh-phong-material>
      </${shapeSelector}>
    `,
  });
}

export const Box = shapeStory('ngt-soba-box');
export const Circle = shapeStory('ngt-soba-circle');
export const Cone = shapeStory('ngt-soba-cone');
export const Cylinder = shapeStory('ngt-soba-cylinder');
export const Dodecahedron = shapeStory('ngt-soba-dodecahedron');
export const Extrude = shapeStory('ngt-soba-extrude');
export const Icosahedron = shapeStory('ngt-soba-icosahedron');
export const Lathe = shapeStory('ngt-soba-lathe');
export const Octahedron = shapeStory('ngt-soba-octahedron');
export const Plane = shapeStory('ngt-soba-plane');

export const Polyhedron = shapeStory('ngt-soba-polyhedron', [
  [
    -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, 1, 1, -1, 1, 1, 1, 1,
    -1, 1, 1,
  ],
  [
    2, 1, 0, 0, 3, 2, 0, 4, 7, 7, 3, 0, 0, 1, 5, 5, 4, 0, 1, 2, 6, 6, 5, 1, 2,
    3, 7, 7, 6, 2, 4, 5, 6, 6, 7, 4,
  ],
]);

export const Ring = shapeStory('ngt-soba-ring');
export const Sphere = shapeStory('ngt-soba-sphere');
export const Tetrahedron = shapeStory('ngt-soba-tetrahedron');
export const Torus = shapeStory('ngt-soba-torus');
export const TorusKnot = shapeStory('ngt-soba-torus-knot');
export const Tube = shapeStory('ngt-soba-tube');
