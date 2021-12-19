import { Meta, moduleMetadata } from '@storybook/angular';
import { KinematicCubeComponentModule } from './kinematic-cube.component';
// @ts-ignore
import kinematicCubeDocs from './kinematic-cube.mdx';

export default {
  title: 'Examples/Kinematic Cube',
  decorators: [
    moduleMetadata({
      imports: [KinematicCubeComponentModule],
    }),
  ],
  parameters: {
    docs: { page: kinematicCubeDocs },
    viewMode: 'story',
  },
} as Meta;

export const Default = () => ({
  template: `
    <ngt-kinematic-cube></ngt-kinematic-cube>
  `,
});
