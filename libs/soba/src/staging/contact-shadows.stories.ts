import { NgtRadianPipeModule, NgtRenderState } from '@angular-three/core';
import {
    NgtIcosahedronGeometryModule,
    NgtPlaneGeometryModule,
} from '@angular-three/core/geometries';
import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtSobaContactShadowsModule } from '@angular-three/soba/staging';
import {
    componentWrapperDecorator,
    Meta,
    moduleMetadata,
    Story,
} from '@storybook/angular';
import * as THREE from 'three';
import { setupCanvas, setupCanvasModules } from '../setup-canvas';

export default {
    title: 'Staging/Contact Shadows',
    decorators: [
        componentWrapperDecorator(setupCanvas()),
        moduleMetadata({
            imports: [
                ...setupCanvasModules,
                NgtMeshModule,
                NgtIcosahedronGeometryModule,
                NgtPlaneGeometryModule,
                NgtMeshBasicMaterialModule,
                NgtSobaContactShadowsModule,
                NgtRadianPipeModule,
            ],
        }),
    ],
} as Meta;

function animate({
    object,
    state: { clock },
}: {
    state: NgtRenderState;
    object: THREE.Object3D;
}) {
    object.position.y = Math.sin(clock.getElapsedTime()) + 2.5;
}

export const Default: Story = () => ({
    props: { animate },
    template: `
        <ngt-mesh [position]="[0, 2, 0]" (beforeRender)="animate($event)">
            <ngt-icosahedron-geometry [args]="[1, 2]"></ngt-icosahedron-geometry>
            <ngt-mesh-basic-material color="lightblue"></ngt-mesh-basic-material>
        </ngt-mesh>
        <ngt-soba-contact-shadows
            [position]="[0, 0, 0]"
            width="10"
            height="10"
            far="20"
            [rotation]="[90 | radian, 0, 0]"
        ></ngt-soba-contact-shadows>
        <ngt-mesh [position]="[0, -0.01, 0]" [rotation]="[-90 | radian, 0, 0]">
            <ngt-plane-geometry [args]="[10, 10]"></ngt-plane-geometry>
            <ngt-mesh-basic-material color="white"></ngt-mesh-basic-material>
        </ngt-mesh>
    `,
});
