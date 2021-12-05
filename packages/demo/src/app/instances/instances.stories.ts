import { Meta, moduleMetadata, Story } from '@storybook/angular';
import { InstancesComponentModule } from './instances.component';
// @ts-ignore
import InstancesDocs from './instances.mdx';

export default {
  title: 'Examples/Instances',
  decorators: [
    moduleMetadata({
      imports: [InstancesComponentModule],
    }),
  ],
  parameters: {
    docs: {
      page: InstancesDocs,
    },
  },
} as Meta;

export const Default: Story = () => ({
  template: `
    <ngt-instances></ngt-instances>
  `,
});
