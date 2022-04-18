/**
 * Creating a sidebar enables you to:
 - create an ordered group of docs
 - render a sidebar for each doc of that group
 - provide next/previous navigation

 The sidebars can be generated from the filesystem, or explicitly defined here.

 Create as many sidebars as you want.
 */

// @ts-check

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
            'core/canvas',
            'core/objects'
          ]
        }
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
