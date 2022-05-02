import { NgtIcosahedronGeometryModule } from '@angular-three/core/geometries';
import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtSobaDetailedModule } from '@angular-three/soba/performances';
import { componentWrapperDecorator, Meta, moduleMetadata } from '@storybook/angular';
import { setupCanvas, setupCanvasModules } from '../setup-canvas';

export default {
  title: 'Performances/Detailed',
  decorators: [
    componentWrapperDecorator(setupCanvas({ controls: false, cameraPosition: [0, 0, 100] })),
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
  template: `
        <ngt-soba-detailed [distances]="[50, 100, 150, 200, 250]">
            <ng-template ngt-soba-detailed-content>
                <ngt-mesh [scale]="[5, 5, 5]">
                    <ngt-icosahedron-geometry [args]="[10, 10]"></ngt-icosahedron-geometry>
                    <ngt-mesh-basic-material color="turquoise" wireframe></ngt-mesh-basic-material>
                </ngt-mesh>

                <ngt-mesh [scale]="[5, 5, 5]">
                    <ngt-icosahedron-geometry [args]="[10, 5]"></ngt-icosahedron-geometry>
                    <ngt-mesh-basic-material color="lightgreen" wireframe></ngt-mesh-basic-material>
                </ngt-mesh>

                <ngt-mesh [scale]="[5, 5, 5]">
                    <ngt-icosahedron-geometry [args]="[10, 3]"></ngt-icosahedron-geometry>
                    <ngt-mesh-basic-material color="lightblue" wireframe></ngt-mesh-basic-material>
                </ngt-mesh>

                <ngt-mesh [scale]="[5, 5, 5]">
                    <ngt-icosahedron-geometry [args]="[10, 2]"></ngt-icosahedron-geometry>
                    <ngt-mesh-basic-material color="hotpink" wireframe></ngt-mesh-basic-material>
                </ngt-mesh>

                <ngt-mesh [scale]="[5, 5, 5]">
                    <ngt-icosahedron-geometry [args]="[10, 1]"></ngt-icosahedron-geometry>
                    <ngt-mesh-basic-material color="orange" wireframe></ngt-mesh-basic-material>
                </ngt-mesh>
            </ng-template>
        </ngt-soba-detailed>

        <ngt-soba-orbit-controls enablePan="false" enableRotate="false" zoomSpeed="0.5"></ngt-soba-orbit-controls>
    `,
});
