import { Meta, moduleMetadata } from '@storybook/angular';
import { LevelOfDetailsModule } from './level-of-details.component';
// @ts-ignore
import levelOfDetailsDocs from './level-of-details.mdx';

export default {
  title: 'Examples/Level of Details',
  decorators: [
    moduleMetadata({
      imports: [LevelOfDetailsModule],
    }),
  ],
  parameters: {
    docs: { page: levelOfDetailsDocs },
    viewMode: 'story',
  },
} as Meta;

export const Default = () => ({
  template: `
    <ngt-level-of-details></ngt-level-of-details>
  `,
});
