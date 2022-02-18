import { Meta, moduleMetadata } from '@storybook/angular';
import { SimplePhysicsComponentModule } from './simple-physics.component';
// @ts-ignore
import simplePhysicsDocs from './simple-physics.mdx';

export default {
    title: 'Cannon/Simple Physics',
    decorators: [
        moduleMetadata({
            imports: [SimplePhysicsComponentModule],
        }),
    ],
    parameters: {
        docs: { page: simplePhysicsDocs },
        viewMode: 'story',
    },
} as Meta;

export const Default = () => ({
    template: `
        <storybook-simple-physics></storybook-simple-physics>
    `,
});

export const SingleCube = () => ({
    template: `
        <storybook-single-simple-physics></storybook-single-simple-physics>
    `,
});
