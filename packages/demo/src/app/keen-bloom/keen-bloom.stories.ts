import { Meta, moduleMetadata } from '@storybook/angular';
import { KeenComponentModule } from './keen-bloom.component';
// @ts-ignore
import keenBloomDocs from './keen-bloom.mdx';

export default {
  title: 'Examples/Keen Bloom',
  decorators: [
    moduleMetadata({
      imports: [KeenComponentModule],
    }),
  ],
  parameters: {
    docs: { page: keenBloomDocs },
    viewMode: 'story',
  },
} as Meta;

export const Default = () => ({
  template: `
    <ngt-keen-bloom></ngt-keen-bloom>
  `,
});
