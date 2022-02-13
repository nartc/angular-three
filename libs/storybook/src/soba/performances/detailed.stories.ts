import { NgtIcosahedronGeometryModule } from '@angular-three/core/geometries';
import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtSobaDetailedModule } from '@angular-three/soba/performances';
import {
    componentWrapperDecorator,
    Meta,
    moduleMetadata,
} from '@storybook/angular';
import { OrbitControls } from 'three-stdlib';
import { setupCanvas, setupCanvasModules } from '../../setup-canvas';

export default {
    title: 'Soba/Performances/Detailed',
    decorators: [
        componentWrapperDecorator(
            setupCanvas({ controls: false, cameraPosition: [0, 0, 100] })
        ),
        moduleMetadata({
            imports: [
                ...setupCanvasModules,
                NgtSobaDetailedModule,
                NgtMeshModule,
                NgtIcosahedronGeometryModule,
                NgtMeshBasicMaterialModule,
            ],
        }),
    ],
} as Meta;

export const Default = () => ({
    props: {
        onOrbitControlsReady: (controls: OrbitControls) => {
            controls.enablePan = false;
            controls.enableRotate = false;
            controls.zoomSpeed = 0.5;
        },
    },
    template: `
        <ngt-soba-detailed [distances]="[50, 100, 150, 200, 250]">
            <ngt-mesh [scale]="[5, 5, 5]">
                <ngt-icosahedron-geometry [args]="[10, 10]"></ngt-icosahedron-geometry>
                <ngt-mesh-basic-material [parameters]='{color: "turquoise", wireframe: true}'></ngt-mesh-basic-material>
            </ngt-mesh>

            <ngt-mesh [scale]="[5, 5, 5]">
                <ngt-icosahedron-geometry [args]="[10, 5]"></ngt-icosahedron-geometry>
                <ngt-mesh-basic-material [parameters]='{color: "lightgreen", wireframe: true}'></ngt-mesh-basic-material>
            </ngt-mesh>

            <ngt-mesh [scale]="[5, 5, 5]">
                <ngt-icosahedron-geometry [args]="[10, 3]"></ngt-icosahedron-geometry>
                <ngt-mesh-basic-material [parameters]='{color: "lightblue", wireframe: true}'></ngt-mesh-basic-material>
            </ngt-mesh>

            <ngt-mesh [scale]="[5, 5, 5]">
                <ngt-icosahedron-geometry [args]="[10, 2]"></ngt-icosahedron-geometry>
                <ngt-mesh-basic-material [parameters]='{color: "hotpink", wireframe: true}'></ngt-mesh-basic-material>
            </ngt-mesh>

            <ngt-mesh [scale]="[5, 5, 5]">
                <ngt-icosahedron-geometry [args]="[10, 1]"></ngt-icosahedron-geometry>
                <ngt-mesh-basic-material [parameters]='{color: "orange", wireframe: true}'></ngt-mesh-basic-material>
            </ngt-mesh>
        </ngt-soba-detailed>

        <ngt-soba-orbit-controls (ready)="onOrbitControlsReady($event)"></ngt-soba-orbit-controls>
    `,
});
