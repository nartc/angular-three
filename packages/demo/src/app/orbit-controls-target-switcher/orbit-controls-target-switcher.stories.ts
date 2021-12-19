import { Meta, moduleMetadata } from '@storybook/angular';
import { OrbitControlsTargetSwitcherComponentModule } from './orbit-controls-target-switcher.component';
// @ts-ignore
import orbitControlsTargetSwitcherDocs from './orbit-controls-target-switcher.mdx';

export default {
  title: 'Examples/Orbit Controls Target Switcher',
  decorators: [
    moduleMetadata({
      imports: [OrbitControlsTargetSwitcherComponentModule],
    }),
  ],
  parameters: {
    docs: { page: orbitControlsTargetSwitcherDocs },
    viewMode: 'story',
  },
} as Meta;

export const Default = () => ({
  template: `
    <ngt-orbit-controls-target-switcher></ngt-orbit-controls-target-switcher>
  `,
});
