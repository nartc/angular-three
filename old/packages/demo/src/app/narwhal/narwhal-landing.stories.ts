import { Meta, moduleMetadata } from '@storybook/angular';
import { NarwhalLandingComponentModule } from './narwhal-landing.component';

export default {
  title: 'Examples/Narwhal Landing',
  decorators: [
    moduleMetadata({
      imports: [NarwhalLandingComponentModule],
    }),
  ],
  parameters: {
    viewMode: 'story',
  },
} as Meta;

export const Default = () => ({
  template: `
    <ngt-narwhal-landing></ngt-narwhal-landing>
  `,
});
