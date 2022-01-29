import { Meta, moduleMetadata } from '@storybook/angular';
import { CompoundBodyComponentModule } from './compound-body.component';
// @ts-ignore
import compoundBodyDocs from './compound-body.mdx';

export default {
  title: 'Examples/Compound Body',
  decorators: [
    moduleMetadata({
      imports: [CompoundBodyComponentModule],
    }),
  ],
  parameters: {
    docs: { page: compoundBodyDocs },
    viewMode: 'story',
  },
} as Meta;

export const Default = () => ({
  template: `
    <ngt-compound-body></ngt-compound-body>
  `,
});
