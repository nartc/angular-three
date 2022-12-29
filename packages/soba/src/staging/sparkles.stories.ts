import { Meta, moduleMetadata } from '@storybook/angular';
import { StorybookSetup } from '../setup-canvas';

export default {
  title: 'Staging/Sparkles',
  decorators: [moduleMetadata({ imports: [StorybookSetup] })],
} as Meta;
