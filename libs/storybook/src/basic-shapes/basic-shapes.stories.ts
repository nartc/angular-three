import {
    NgtBoxGeometryModule,
    NgtCircleGeometryModule,
    NgtConeGeometryModule,
    NgtCylinderGeometryModule,
    NgtDodecahedronGeometryModule,
    NgtExtrudeGeometryModule,
    NgtIcosahedronGeometryModule,
    NgtLatheGeometryModule,
    NgtOctahedronGeometryModule,
    NgtPlaneGeometryModule,
    NgtPolyhedronGeometryModule,
    NgtRingGeometryModule,
    NgtSphereGeometryModule,
    NgtTetrahedronGeometryModule,
    NgtTorusGeometryModule,
    NgtTorusKnotGeometryModule,
    NgtTubeGeometryModule,
} from '@angular-three/core/geometries';
import { NgtMeshPhongMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import {
    componentWrapperDecorator,
    Meta,
    moduleMetadata,
    Story,
} from '@storybook/angular';
import { setupCanvas, setupCanvasModules, turnAnimate } from '../setup-canvas';

export default {
    title: 'Core API/Basic Shapes',
    decorators: [
        componentWrapperDecorator(setupCanvas()),
        moduleMetadata({
            imports: [
                ...setupCanvasModules,
                NgtMeshModule,
                NgtMeshPhongMaterialModule,
                NgtBoxGeometryModule,
                NgtCircleGeometryModule,
                NgtConeGeometryModule,
                NgtCylinderGeometryModule,
                NgtDodecahedronGeometryModule,
                NgtExtrudeGeometryModule,
                NgtIcosahedronGeometryModule,
                NgtLatheGeometryModule,
                NgtOctahedronGeometryModule,
                NgtPlaneGeometryModule,
                NgtPolyhedronGeometryModule,
                NgtRingGeometryModule,
                NgtSphereGeometryModule,
                NgtTetrahedronGeometryModule,
                NgtTorusGeometryModule,
                NgtTorusKnotGeometryModule,
                NgtTubeGeometryModule,
            ],
        }),
    ],
} as Meta;

type ShapeSelector =
    | 'ngt-box-geometry'
    | 'ngt-circle-geometry'
    | 'ngt-cone-geometry'
    | 'ngt-cylinder-geometry'
    | 'ngt-dodecahedron-geometry'
    | 'ngt-extrude-geometry'
    | 'ngt-icosahedron-geometry'
    | 'ngt-lathe-geometry'
    | 'ngt-octahedron-geometry'
    | 'ngt-plane-geometry'
    | 'ngt-polyhedron-geometry'
    | 'ngt-ring-geometry'
    | 'ngt-sphere-geometry'
    | 'ngt-tetrahedron-geometry'
    | 'ngt-torus-geometry'
    | 'ngt-torus-knot-geometry'
    | 'ngt-tube-geometry';

function shapeStory(shapeSelector: ShapeSelector, args?: unknown[]): Story {
    return () => ({
        props: { onAnimate: turnAnimate, args },
        template: `
            <ngt-mesh (animateReady)="onAnimate($event.object)" >
                <${shapeSelector} [args]="args"></${shapeSelector}>
                <ngt-mesh-phong-material [parameters]='{color: "#f3f3f3", wireframe: true}'></ngt-mesh-phong-material>
            </ngt-mesh>
        `,
    });
}

export const Box = shapeStory('ngt-box-geometry');
export const Circle = shapeStory('ngt-circle-geometry');
export const Cone = shapeStory('ngt-cone-geometry');
export const Cylinder = shapeStory('ngt-cylinder-geometry');
export const Dodecahedron = shapeStory('ngt-dodecahedron-geometry');
export const Extrude = shapeStory('ngt-extrude-geometry');
export const Icosahedron = shapeStory('ngt-icosahedron-geometry');
export const Lathe = shapeStory('ngt-lathe-geometry');
export const Octahedron = shapeStory('ngt-octahedron-geometry');
export const Plane = shapeStory('ngt-plane-geometry');

export const Polyhedron = shapeStory('ngt-polyhedron-geometry', [
    [
        -1, -1, -1, 1, -1, -1, 1, 1, -1, -1, 1, -1, -1, -1, 1, 1, -1, 1, 1, 1,
        1, -1, 1, 1,
    ],
    [
        2, 1, 0, 0, 3, 2, 0, 4, 7, 7, 3, 0, 0, 1, 5, 5, 4, 0, 1, 2, 6, 6, 5, 1,
        2, 3, 7, 7, 6, 2, 4, 5, 6, 6, 7, 4,
    ],
]);

export const Ring = shapeStory('ngt-ring-geometry');
export const Sphere = shapeStory('ngt-sphere-geometry');
export const Tetrahedron = shapeStory('ngt-tetrahedron-geometry');
export const Torus = shapeStory('ngt-torus-geometry');
export const TorusKnot = shapeStory('ngt-torus-knot-geometry');
export const Tube = shapeStory('ngt-tube-geometry');
