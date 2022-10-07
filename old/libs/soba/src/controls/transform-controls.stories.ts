import { NgtBoxGeometryModule } from '@angular-three/core/geometries';
import { NgtMeshBasicMaterialModule } from '@angular-three/core/materials';
import { NgtMeshModule } from '@angular-three/core/meshes';
import { NgtSobaTransformControlsModule } from '@angular-three/soba/controls';
import { componentWrapperDecorator, Meta, moduleMetadata, Story } from '@storybook/angular';
import { setupCanvas, setupCanvasModules } from '../setup-canvas';

export default {
  title: 'Controls/Transform Controls',
} as Meta;

export const Default: Story = () => ({
  template: `
        <ngt-soba-transform-controls>
          <ngt-mesh>
            <ngt-box-geometry></ngt-box-geometry>
            <ngt-mesh-basic-material wireframe></ngt-mesh-basic-material>
          </ngt-mesh>
        </ngt-soba-transform-controls>
  `,
});
Default.decorators = [
  componentWrapperDecorator(setupCanvas()),
  moduleMetadata({
    imports: [
      ...setupCanvasModules,
      NgtSobaTransformControlsModule,
      NgtMeshModule,
      NgtBoxGeometryModule,
      NgtMeshBasicMaterialModule,
    ],
  }),
];

export const LockOrbitControls: Story = Default.bind({});
LockOrbitControls.decorators = [
  componentWrapperDecorator(setupCanvas({ makeControlsDefault: true })),
  moduleMetadata({
    imports: [
      ...setupCanvasModules,
      NgtSobaTransformControlsModule,
      NgtMeshModule,
      NgtBoxGeometryModule,
      NgtMeshBasicMaterialModule,
    ],
  }),
];
