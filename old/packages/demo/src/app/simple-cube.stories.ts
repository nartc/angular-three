import { Meta, moduleMetadata } from '@storybook/angular';
import { SimpleCubeComponentModule } from './simple-cube.component';
// @ts-ignore
import simpleCubeDocs from './simple-cube.mdx';

export default {
  title: 'Examples/Simple Cube',
  decorators: [
    moduleMetadata({
      imports: [SimpleCubeComponentModule],
    }),
  ],
  parameters: {
    docs: { page: simpleCubeDocs },
    viewMode: 'story',
  },
} as Meta;

export const Default = () => ({
  template: `
    <ngt-simple-cube></ngt-simple-cube>
  `,
});
