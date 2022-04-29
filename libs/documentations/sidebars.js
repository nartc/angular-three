// @ts-check
const isProduction = process.env.CONTEXT === 'production';
const isBranchDeploy = process.env.CONTEXT === 'branch-deploy';

const netlifyUrl = `${process.env.URL}`;
const netlifyPrimeUrl = `${process.env.DEPLOY_PRIME_URL}`;

function buildUrl(path) {
    return isBranchDeploy
        ? `${netlifyPrimeUrl}/${path}`
        : `${netlifyUrl}/${path}`;
}

const sobaUrl = isProduction ? buildUrl('soba') : 'http://localhost:4400';

const examplesUrl = isProduction
    ? buildUrl('examples')
    : 'http://localhost:4200';

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
    docs: [
        {
            type: 'category',
            label: 'Getting Started',
            items: [
                'getting-started/overview',
                'getting-started/installation',
                'getting-started/migrate-to-v5',
            ],
        },
        {
            type: 'doc',
            label: 'Our first scene',
            id: 'first-scene',
        },
        {
            type: 'category',
            label: 'Core API',
            items: [
                'core/inputs',
                'core/canvas',
                'core/ref',
                'core/component-store',
                'core/instance',
                'core/objects',
                'core/store',
                'core/services',
                'core/directives',
                'core/pipes',
                'core/additional-exports',
            ],
        },
        {
            type: 'category',
            label: 'Cannon API',
            items: [
                'cannon/overview',
                'cannon/first-physics-scene',
                'cannon/physics',
                'cannon/body',
                'cannon/constraint',
                'cannon/spring',
                'cannon/ray',
                'cannon/raycast-vehicle',
            ],
        },
        {
            type: 'link',
            label: 'Soba API',
            href: sobaUrl,
        },
        {
            type: 'link',
            label: 'Examples',
            href: examplesUrl,
        },
    ],
};

module.exports = sidebars;
