import { Meta, moduleMetadata } from '@storybook/angular';
import { SimpleCubeComponentModule } from './simple-cube.component';

export default {
  title: 'Examples/Simple Cube',
  decorators: [
    moduleMetadata({
      imports: [SimpleCubeComponentModule],
    }),
  ],
  parameters: {
    viewMode: 'story',
  },
} as Meta;

export const Default = () => ({
  template: `
    <ngt-simple-cube></ngt-simple-cube>
  `,
});
