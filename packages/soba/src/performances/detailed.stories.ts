import { NgtArgs } from '@angular-three/core';
import { NgtIcosahedronGeometry } from '@angular-three/core/geometries';
import { NgtMeshBasicMaterial } from '@angular-three/core/materials';
import { NgtMesh } from '@angular-three/core/objects';
import { SobaDetailed } from '@angular-three/soba/performances';
import { componentWrapperDecorator, Meta, moduleMetadata } from '@storybook/angular';
import { setupCanvas, setupCanvasImports } from '../setup-canvas';

export default {
    title: 'Performances/Detailed',
    decorators: [
        componentWrapperDecorator(setupCanvas({ controls: false, camera: { position: [0, 0, 100] } })),
        moduleMetadata({
            imports: [setupCanvasImports, SobaDetailed, NgtMesh, NgtIcosahedronGeometry, NgtMeshBasicMaterial, NgtArgs],
        }),
    ],
} as Meta;

export const Default = () => ({
    template: `
<ngt-soba-detailed [distances]="[50, 100, 150, 200, 250]">
    <ngt-mesh [scale]="[5, 5, 5]">
        <ngt-icosahedron-geometry *args="[10, 10]"></ngt-icosahedron-geometry>
        <ngt-mesh-basic-material color="turquoise" [wireframe]="true"></ngt-mesh-basic-material>
    </ngt-mesh>

    <ngt-mesh [scale]="[5, 5, 5]">
        <ngt-icosahedron-geometry *args="[10, 5]"></ngt-icosahedron-geometry>
        <ngt-mesh-basic-material color="lightgreen" [wireframe]="true"></ngt-mesh-basic-material>
    </ngt-mesh>

    <ngt-mesh [scale]="[5, 5, 5]">
        <ngt-icosahedron-geometry *args="[10, 3]"></ngt-icosahedron-geometry>
        <ngt-mesh-basic-material color="lightblue" [wireframe]="true"></ngt-mesh-basic-material>
    </ngt-mesh>

    <ngt-mesh [scale]="[5, 5, 5]">
        <ngt-icosahedron-geometry *args="[10, 2]"></ngt-icosahedron-geometry>
        <ngt-mesh-basic-material color="hotpink" [wireframe]="true"></ngt-mesh-basic-material>
    </ngt-mesh>

    <ngt-mesh [scale]="[5, 5, 5]">
        <ngt-icosahedron-geometry *args="[10, 1]"></ngt-icosahedron-geometry>
        <ngt-mesh-basic-material color="orange" [wireframe]="true"></ngt-mesh-basic-material>
    </ngt-mesh>
</ngt-soba-detailed>
<ngt-soba-orbit-controls [enablePan]="false" [enableRotate]="false" [zoomSpeed]="0.5"></ngt-soba-orbit-controls>
    `,
});
