import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';
import { NgtSobaIcosahedronModule } from '@angular-three/soba/shapes';
import { setupCanvas, setupCanvasModules } from '@angular-three/storybook';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
} from '@storybook/angular';
import { OrbitControls } from 'three-stdlib';
import { NgtSobaDetailed, NgtSobaDetailedModule } from './detailed.component';

export default {
  title: 'Soba/Performances/Detailed',
  component: NgtSobaDetailed,
  decorators: [
    componentWrapperDecorator(
      setupCanvas({ controls: false, black: true, cameraPosition: [0, 0, 100] })
    ),
    moduleMetadata({
      imports: [
        ...setupCanvasModules,
        NgtSobaDetailedModule,
        NgtSobaIcosahedronModule,
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
    <ngt-soba-detailed [distances]='[0, 50, 150]'>

      <ngt-soba-icosahedron [args]='[10, 3]'>
        <ngt-mesh-basic-material [parameters]='{color: "hotpink", wireframe: true}'></ngt-mesh-basic-material>
      </ngt-soba-icosahedron>

      <ngt-soba-icosahedron [args]='[10, 2]'>
        <ngt-mesh-basic-material [parameters]='{color: "lightgreen", wireframe: true}'></ngt-mesh-basic-material>
      </ngt-soba-icosahedron>

      <ngt-soba-icosahedron [args]='[10, 1]'>
        <ngt-mesh-basic-material [parameters]='{color: "lightblue", wireframe: true}'></ngt-mesh-basic-material>
      </ngt-soba-icosahedron>

    </ngt-soba-detailed>

    <ngt-soba-orbit-controls
      #orbitControls='ngtSobaOrbitControls'
      (ready)='onOrbitControlsReady(orbitControls.controls)'
    ></ngt-soba-orbit-controls>
  `,
});
