import { NgtBoxGeometry, NgtTorusKnotGeometry } from '@angular-three/core/geometries';
import { NgtMeshStandardMaterial } from '@angular-three/core/materials';
import { NgtMesh } from '@angular-three/core/objects';
import { NgtSobaPerspectiveCamera } from '@angular-three/soba/cameras';
import { NgtSobaContactShadows, NgtSobaEnvironment, presetsObj } from '@angular-three/soba/staging';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { createRangeControl } from '../create-control';
import { setupCanvas, setupCanvasImports } from '../setup-canvas';

export default {
  title: 'Staging/Environment',
  decorators: [
    componentWrapperDecorator(
      setupCanvas({
        controls: false,
        camera: { position: [0, 0, 10] },
        log: true,
      })
    ),
    moduleMetadata({
      imports: [
        setupCanvasImports,
        NgtSobaEnvironment,
        NgtMesh,
        NgtTorusKnotGeometry,
        NgtBoxGeometry,
        NgtMeshStandardMaterial,
        NgtSobaPerspectiveCamera,
        NgtSobaContactShadows,
      ],
    }),
  ],
} as Meta;

export const Default: Story = (args) => ({
  props: args,
  template: `
<ngt-soba-environment [preset]="preset" [background]="background"></ngt-soba-environment>
<ngt-mesh>
  <ngt-torus-knot-geometry [args]="[1, 0.5, 128, 32]"></ngt-torus-knot-geometry>
  <ngt-mesh-standard-material metalness="1" roughness="0"></ngt-mesh-standard-material>
</ngt-mesh>
<ngt-soba-orbit-controls autoRotate></ngt-soba-orbit-controls>
`,
});

const presets = Object.keys(presetsObj);

Default.args = {
  background: true,
  preset: presets[0],
};

Default.argTypes = {
  preset: {
    options: presets,
    control: {
      type: 'select',
    },
  },
};

export const Files: Story = (args) => ({
  props: args,
  template: `
<ngt-soba-environment path="soba/cube/" [files]="['px.png', 'nx.png', 'py.png', 'ny.png', 'pz.png', 'nz.png']" [background]="background"></ngt-soba-environment>
<ngt-mesh>
  <ngt-torus-knot-geometry [args]="[1, 0.5, 128, 32]"></ngt-torus-knot-geometry>
  <ngt-mesh-standard-material metalness="1" roughness="0"></ngt-mesh-standard-material>
</ngt-mesh>
<ngt-soba-orbit-controls autoRotate></ngt-soba-orbit-controls>
    `,
});

Files.args = {
  background: true,
};

export const Ground: Story = (args) => ({
  props: args,
  template: `
<ngt-soba-environment [ground]="{ radius, height }" [preset]="preset"></ngt-soba-environment>
<ngt-mesh [position]="[0, 5, 0]">
  <ngt-box-geometry [args]="[10, 10, 10]"></ngt-box-geometry>
  <ngt-mesh-standard-material metalness="1" roughness="0"></ngt-mesh-standard-material>
</ngt-mesh>
<ngt-soba-contact-shadows resolution="1024" [position]="[0, 0, 0]" [scale]="100" blur="2" opacity="1" far="10"></ngt-soba-contact-shadows>
<ngt-soba-orbit-controls autoRotate></ngt-soba-orbit-controls>
<ngt-soba-perspective-camera [position]="[40, 40, 40]" makeDefault></ngt-soba-perspective-camera>
    `,
});

Ground.args = {
  height: 15,
  radius: 60,
  preset: 'park',
};

Ground.argTypes = {
  preset: {
    options: presets,
    control: {
      type: 'select',
    },
  },
  height: {
    control: createRangeControl(0, 50, 0.1),
  },
  radius: {
    control: createRangeControl(0, 200, 1),
  },
};
