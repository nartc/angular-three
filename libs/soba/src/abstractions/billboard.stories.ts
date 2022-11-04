import { NgtPlaneGeometry } from '@angular-three/core/geometries';
import { NgtMeshStandardMaterial } from '@angular-three/core/materials';
import { NgtMesh } from '@angular-three/core/objects';
import { NgtSobaBillboard } from '@angular-three/soba/abstractions';
import {
  componentWrapperDecorator,
  Meta,
  moduleMetadata,
  Story,
} from '@storybook/angular';
import { onCanvasCreated, setupCanvas } from '../setup-canvas';

const { decorator, imports } = setupCanvas({
  controls: false,
  camera: {
    position: [0, 0, 10],
  },
});

export default {
  title: 'Abstractions/Billboard',
  decorators: [
    componentWrapperDecorator(decorator),
    moduleMetadata({
      imports: [
        imports,
        NgtSobaBillboard,
        NgtMeshStandardMaterial,
        NgtMesh,
        NgtPlaneGeometry,
      ],
    }),
  ],
} as Meta;

export const Planes: Story = (args) => ({
  props: { ...args, onCanvasCreated },
  template: `
<ngt-soba-orbit-controls zoomSpeed="0.5" enablePan></ngt-soba-orbit-controls>

<ngt-plane-geometry #planeGeometry noAttach [args]="[3, 2]"></ngt-plane-geometry>

<ngt-soba-billboard [position]="[-4, -2, 0]" [follow]="follow" [lockX]="lockX" [lockY]="lockY" [lockZ]="lockZ">
  <ngt-mesh [geometry]="planeGeometry.instance">
      <ngt-mesh-standard-material color="red"></ngt-mesh-standard-material>
    </ngt-mesh>
</ngt-soba-billboard>

<ngt-soba-billboard [position]="[-4, 2, 0]" [follow]="follow" [lockX]="lockX" [lockY]="lockY" [lockZ]="lockZ">
  <ngt-mesh [geometry]="planeGeometry.instance">
      <ngt-mesh-standard-material color="orange"></ngt-mesh-standard-material>
    </ngt-mesh>
</ngt-soba-billboard>

<ngt-soba-billboard [position]="[0, 0, 0]" [follow]="follow" [lockX]="lockX" [lockY]="lockY" [lockZ]="lockZ">
  <ngt-mesh [geometry]="planeGeometry.instance">
      <ngt-mesh-standard-material color="green"></ngt-mesh-standard-material>
    </ngt-mesh>
</ngt-soba-billboard>

<ngt-soba-billboard [position]="[4, -2, 0]" [follow]="follow" [lockX]="lockX" [lockY]="lockY" [lockZ]="lockZ">
  <ngt-mesh [geometry]="planeGeometry.instance">
      <ngt-mesh-standard-material color="blue"></ngt-mesh-standard-material>
    </ngt-mesh>
</ngt-soba-billboard>

<ngt-soba-billboard [position]="[4, 2, 0]" [follow]="follow" [lockX]="lockX" [lockY]="lockY" [lockZ]="lockZ">
  <ngt-mesh [geometry]="planeGeometry.instance">
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
