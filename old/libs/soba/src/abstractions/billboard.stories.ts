import { NgtBoxGeometryModule, NgtConeGeometryModule, NgtPlaneGeometryModule } from '@angular-three/core/geometries';
import { NgtGroupModule } from '@angular-three/core/group';
import { NgtMeshStandardMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtSobaBillboardModule, NgtSobaTextModule } from '@angular-three/soba/abstractions';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { setupCanvas, setupCanvasModules } from '../setup-canvas';

export default {
  title: 'Abstractions/Billboard',
  decorators: [
    componentWrapperDecorator(setupCanvas({ controls: false, cameraPosition: [0, 0, 10] })),
    moduleMetadata({
      imports: [
        ...setupCanvasModules,
        NgtSobaBillboardModule,
        NgtMeshStandardMaterialModule,
        NgtMeshModule,
        NgtPlaneGeometryModule,
        NgtGroupModule,
        NgtSobaTextModule,
        NgtConeGeometryModule,
        NgtBoxGeometryModule,
      ],
    }),
  ],
} as Meta;

export const Planes: Story = (args) => ({
  props: args,
  template: `
        <ngt-soba-orbit-controls zoomSpeed="0.5" enablePan></ngt-soba-orbit-controls>

        <ngt-plane-geometry #planeGeometry noAttach [args]="[3, 2]"></ngt-plane-geometry>

        <ngt-soba-billboard [position]="[-4, -2, 0]" [follow]="follow" [lockX]="lockX" [lockY]="lockY" [lockZ]="lockZ">
            <ng-template ngt-soba-billboard-content>
                <ngt-mesh [geometry]="planeGeometry.instance">
                    <ngt-mesh-standard-material color="red"></ngt-mesh-standard-material>
                </ngt-mesh>
            </ng-template>
        </ngt-soba-billboard>

        <ngt-soba-billboard [position]="[-4, 2, 0]" [follow]="follow" [lockX]="lockX" [lockY]="lockY" [lockZ]="lockZ">
            <ng-template ngt-soba-billboard-content>
                <ngt-mesh [geometry]="planeGeometry.instance">
                    <ngt-mesh-standard-material color="orange"></ngt-mesh-standard-material>
                </ngt-mesh>
            </ng-template>
        </ngt-soba-billboard>

        <ngt-soba-billboard [position]="[0, 0, 0]" [follow]="follow" [lockX]="lockX" [lockY]="lockY" [lockZ]="lockZ">
            <ng-template ngt-soba-billboard-content>
                <ngt-mesh [geometry]="planeGeometry.instance">
                    <ngt-mesh-standard-material color="green"></ngt-mesh-standard-material>
                </ngt-mesh>
            </ng-template>
        </ngt-soba-billboard>

        <ngt-soba-billboard [position]="[4, -2, 0]" [follow]="follow" [lockX]="lockX" [lockY]="lockY" [lockZ]="lockZ">
            <ng-template ngt-soba-billboard-content>
                <ngt-mesh [geometry]="planeGeometry.instance">
                    <ngt-mesh-standard-material color="blue"></ngt-mesh-standard-material>
                </ngt-mesh>
            </ng-template>
        </ngt-soba-billboard>

        <ngt-soba-billboard [position]="[4, 2, 0]" [follow]="follow" [lockX]="lockX" [lockY]="lockY" [lockZ]="lockZ">
            <ng-template ngt-soba-billboard-content>
                <ngt-mesh [geometry]="planeGeometry.instance">
                    <ngt-mesh-standard-material color="yellow"></ngt-mesh-standard-material>
                </ngt-mesh>
            </ng-template>
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
        <ngt-soba-orbit-controls zoomSpeed="0.5" enablePan></ngt-soba-orbit-controls>

        <ngt-soba-billboard [position]="[0.5, 2.05, 0.5]" [follow]="follow" [lockX]="lockX" [lockY]="lockY" [lockZ]="lockZ">
            <ng-template ngt-soba-billboard-content>
                <ngt-soba-text
                    text="box"
                    fontSize="1"
                    outlineWidth="5%"
                    outlineColor="#000000"
                    outlineOpacity="1"
                ></ngt-soba-text>
            </ng-template>
        </ngt-soba-billboard>

        <ngt-mesh [position]="[0.5, 1, 0.5]">
            <ngt-box-geometry></ngt-box-geometry>
            <ngt-mesh-standard-material color="red"></ngt-mesh-standard-material>
        </ngt-mesh>

        <ngt-group [position]="[-2.5, -3, -1]">
            <ngt-soba-billboard [position]="[0, 1.05, 0]" [follow]="follow" [lockX]="lockX" [lockY]="lockY" [lockZ]="lockZ">
                <ng-template ngt-soba-billboard-content>
                    <ngt-soba-text
                        text="cone"
                        fontSize="1"
                        outlineWidth="5%"
                        outlineColor="#000000"
                        outlineOpacity="1"
                    ></ngt-soba-text>
                </ng-template>
            </ngt-soba-billboard>

            <ngt-mesh>
                <ngt-cone-geometry></ngt-cone-geometry>
                <ngt-mesh-standard-material color="green"></ngt-mesh-standard-material>
            </ngt-mesh>
        </ngt-group>

        <ngt-soba-billboard [position]="[0, 0, -5]" [follow]="follow" [lockX]="lockX" [lockY]="lockY" [lockZ]="lockZ">
            <ng-template ngt-soba-billboard-content>
                <ngt-mesh>
                    <ngt-plane-geometry [args]="[2, 2]"></ngt-plane-geometry>
                    <ngt-mesh-standard-material color="#000066"></ngt-mesh-standard-material>
                </ngt-mesh>
            </ng-template>
        </ngt-soba-billboard>
    `,
});

Text.args = {
    follow: true,
    lockX: false,
    lockY: false,
    lockZ: false,
};

