import { Meta, moduleMetadata } from '@storybook/angular';
import { KinematicCubeComponentModule } from './kinematic-cube.component';
// @ts-ignore
import kinematicCubeDocs from './kinematic-cube.mdx';

export default {
    title: 'Cannon/Kinematic Cube',
    decorators: [
        moduleMetadata({
            imports: [KinematicCubeComponentModule],
        }),
    ],
    parameters: {
        docs: { page: kinematicCubeDocs },
        viewMode: 'story',
    },
} as Meta;

export const Default = () => ({
    template: `
        <storybook-kinematic-cube></storybook-kinematic-cube>
    `,
});
