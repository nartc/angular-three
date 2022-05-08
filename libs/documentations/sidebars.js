// @ts-check
/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  docs: [
    {
      type: 'category',
      label: 'Getting Started',
      items: ['getting-started/overview', 'getting-started/installation', 'getting-started/migrate-to-v5'],
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
      label: 'Advanced',
      items: ['advanced/performance'],
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
      href: 'https://angular-three.netlify.app/soba',
    },
    {
      type: 'link',
      label: 'Examples',
      href: 'https://angular-three.netlify.app/examples',
    },
  ],
};

module.exports = sidebars;
