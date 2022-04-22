/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check
const isProduction = process.env.CONTEXT === 'production';
const isBranchDeploy = process.env.CONTEXT === 'branch-deploy';

const netlifyUrl = `${process.env.URL}/soba`;
const netlifyPrimeUrl = `${process.env.DEPLOY_PRIME_URL}/soba`;

const sobaUrl = isProduction
    ? netlifyUrl
    : isBranchDeploy
    ? netlifyPrimeUrl
    : 'http://localhost:4400';

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
    // By default, Docusaurus generates a sidebar from the docs folder structure
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
    ],

    // But you can create a sidebar manually
    /*
  tutorialSidebar: [
    {
      type: 'category',
      label: 'Tutorial',
      items: ['hello'],
    },
  ],
   */
};

module.exports = sidebars;
