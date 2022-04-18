// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/vsLight');
const darkCodeTheme = require('prism-react-renderer/themes/vsDark');

/** @type {import('@docusaurus/types').Config} */
const config = {
    title: 'Angular Three',
    tagline: 'Declarative THREE.js in Angular',
    url: 'https://angular-three.netlify.app',
    baseUrl: '/',
    onBrokenLinks: 'throw',
    onBrokenMarkdownLinks: 'warn',
    favicon: 'img/ngt-logo.png',
    organizationName: 'nartc', // Usually your GitHub org/user name.
    projectName: 'angular-three', // Usually your repo name.

    presets: [
        [
            'classic',
            /** @type {import('@docusaurus/preset-classic').Options} */
            ({
                docs: {
                    sidebarPath: require.resolve('./sidebars.js'),
                    // Please change this to your repo.
                    editUrl:
                        'https://github.com/nartc/angular-three/tree/main/libs/documentations/docs',
                },
                blog: {
                    showReadingTime: true,
                    // Please change this to your repo.
                    editUrl:
                        'https://github.com/nartc/angular-three/tree/main/libs/documentations/blog',
                },
                theme: {
                    customCss: require.resolve('./src/css/custom.css'),
                },
            }),
        ],
    ],

    themeConfig:
        /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
        ({
            navbar: {
                title: 'Angular Three',
                logo: {
                    alt: 'Angular Three logo with Angular Shield and THREE.js triangles logo',
                    src: 'img/ngt-logo.svg',
                },
                items: [
                    {
                        type: 'doc',
                        docId: 'getting-started/overview',
                        position: 'left',
                        label: 'Documentations',
                    },
                    { to: '/blog', label: 'Blog', position: 'left' },
                    {
                        href: 'https://github.com/nartc/angular-three',
                        label: 'GitHub',
                        position: 'right',
                    },
                ],
            },
            footer: {
                style: 'dark',
                links: [
                    {
                        title: 'Docs',
                        items: [
                            {
                                label: 'Documentations',
                                to: '/docs/getting-started/overview',
                            },
                        ],
                    },
                    {
                        title: 'Community',
                        items: [
                            {
                                label: 'Stack Overflow',
                                href: 'https://stackoverflow.com/questions/tagged/angular-three',
                            },
                            {
                                label: 'Twitter',
                                href: 'https://twitter.com/Nartc1410',
                            },
                        ],
                    },
                    {
                        title: 'More',
                        items: [
                            {
                                label: 'Blog',
                                to: '/blog',
                            },
                            {
                                label: 'GitHub',
                                href: 'https://github.com/nartc/angular-three',
                            },
                        ],
                    },
                ],
                copyright: `Copyright © ${new Date().getFullYear()} Angular Three, Inc. Built with Docusaurus.`,
            },
            prism: {
                theme: lightCodeTheme,
                darkTheme: darkCodeTheme,
            },
        }),
};

module.exports = config;
