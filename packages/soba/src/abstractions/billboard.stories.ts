import { NgtArgs } from '@angular-three/core';
import { NgtBoxGeometry, NgtConeGeometry, NgtPlaneGeometry } from '@angular-three/core/geometries';
import { NgtMeshStandardMaterial } from '@angular-three/core/materials';
import { NgtGroup, NgtMesh } from '@angular-three/core/objects';
import { SobaBillboard, SobaText } from '@angular-three/soba/abstractions';
import { NgIf } from '@angular/common';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { setupCanvas, setupCanvasImports } from '../setup-canvas';

export default {
    title: 'Abstractions/Billboard',
    decorators: [
        componentWrapperDecorator(setupCanvas({ controls: false, camera: { position: [0, 0, 10] } })),
        moduleMetadata({
            imports: [
                setupCanvasImports,
                SobaBillboard,
                NgtMeshStandardMaterial,
                NgtMesh,
                NgtPlaneGeometry,
                NgtConeGeometry,
                NgtBoxGeometry,
                NgtGroup,
                NgIf,
                NgtArgs,
                SobaText,
            ],
        }),
    ],
} as Meta;

export const Planes: Story = (args) => ({
    props: args,
    template: `
<ngt-soba-orbit-controls [zoomSpeed]="0.5" [enablePan]='true'></ngt-soba-orbit-controls>

<ngt-soba-billboard [position]="[-4, -2, 0]" [follow]="follow" [lockX]="lockX" [lockY]="lockY" [lockZ]="lockZ">
    <ngt-mesh>
        <ngt-plane-geometry *args="[3, 2]"></ngt-plane-geometry>
        <ngt-mesh-standard-material color="red"></ngt-mesh-standard-material>
    </ngt-mesh>
</ngt-soba-billboard>

<ngt-soba-billboard [position]="[-4, 2, 0]" [follow]="follow" [lockX]="lockX" [lockY]="lockY" [lockZ]="lockZ">
    <ngt-mesh>
        <ngt-plane-geometry *args="[3, 2]"></ngt-plane-geometry>
        <ngt-mesh-standard-material color="orange"></ngt-mesh-standard-material>
    </ngt-mesh>
</ngt-soba-billboard>

<ngt-soba-billboard [position]="[0, 0, 0]" [follow]="follow" [lockX]="lockX" [lockY]="lockY" [lockZ]="lockZ">
    <ngt-mesh>
        <ngt-plane-geometry *args="[3, 2]"></ngt-plane-geometry>
        <ngt-mesh-standard-material color="green"></ngt-mesh-standard-material>
    </ngt-mesh>
</ngt-soba-billboard>

<ngt-soba-billboard [position]="[4, -2, 0]" [follow]="follow" [lockX]="lockX" [lockY]="lockY" [lockZ]="lockZ">
    <ngt-mesh>
        <ngt-plane-geometry *args="[3, 2]"></ngt-plane-geometry>
        <ngt-mesh-standard-material color="blue"></ngt-mesh-standard-material>
    </ngt-mesh>
</ngt-soba-billboard>

<ngt-soba-billboard [position]="[4, 2, 0]" [follow]="follow" [lockX]="lockX" [lockY]="lockY" [lockZ]="lockZ">
    <ngt-mesh>
        <ngt-plane-geometry *args="[3, 2]"></ngt-plane-geometry>
        <ngt-mesh-standard-material color="yellow"></ngt-mesh-standard-material>
    </ngt-mesh>
</ngt-soba-billboard>
    `,
});

Planes.args = {
    follow: true,
    lockX: false,
    lockY: false,
    lockZ: false,
};

export const Text: Story = (args) => ({
    props: args,
    template: `
<ngt-soba-orbit-controls [zoomSpeed]="0.5" [enablePan]="true"></ngt-soba-orbit-controls>

<ngt-soba-billboard [position]="[0.5, 2.05, 0.5]" [follow]="follow" [lockX]="lockX" [lockY]="lockY" [lockZ]="lockZ">
    <ngt-soba-text
        text="box"
        [outlineOpacity]="1"
        [fontSize]="1"
        outlineWidth="5%"
        outlineColor="#000000"
    ></ngt-soba-text>
</ngt-soba-billboard>

<ngt-mesh [position]="[0.5, 1, 0.5]">
    <ngt-box-geometry></ngt-box-geometry>
    <ngt-mesh-standard-material color="red"></ngt-mesh-standard-material>
</ngt-mesh>

<ngt-group [position]="[-2.5, -3, -1]">
    <ngt-soba-billboard [position]="[0, 1.05, 0]" [follow]="follow" [lockX]="lockX" [lockY]="lockY" [lockZ]="lockZ">
        <ngt-soba-text
            text="cone"
            [fontSize]="1"
            outlineWidth="5%"
            outlineColor="#000000"
            [outlineOpacity]="1"
        ></ngt-soba-text>
    </ngt-soba-billboard>

    <ngt-mesh>
        <ngt-cone-geometry></ngt-cone-geometry>
        <ngt-mesh-standard-material color="green"></ngt-mesh-standard-material>
    </ngt-mesh>
</ngt-group>

<ngt-soba-billboard [position]="[0, 0, -5]" [follow]="follow" [lockX]="lockX" [lockY]="lockY" [lockZ]="lockZ">
    <ngt-mesh>
        <ngt-plane-geometry *args="[2, 2]"></ngt-plane-geometry>
        <ngt-mesh-standard-material color="#000066"></ngt-mesh-standard-material>
    </ngt-mesh>
</ngt-soba-billboard>
    `,
});

Text.args = {
    follow: true,
    lockX: false,
    lockY: false,
    lockZ: false,
};
