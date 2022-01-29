import { Meta, moduleMetadata } from '@storybook/angular';
import { RobotExpressiveModule } from './robot-expressive.component';
// @ts-ignore
import robotExpressiveDocs from './robot-expressive.mdx';

export default {
  title: 'Examples/Robot Expressive',
  decorators: [
    moduleMetadata({
      imports: [RobotExpressiveModule],
    }),
  ],
  parameters: {
    docs: { page: robotExpressiveDocs },
    viewMode: 'story',
  },
} as Meta;

export const Default = () => ({
  template: `
    <ngt-robot-expressive></ngt-robot-expressive>
  `,
});
