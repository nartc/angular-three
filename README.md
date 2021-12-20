# Declarative THREE.js in Angular

🔥 Leverage your [Angular](https://angular.io) skill to build mind-blowing 3D applications with [THREE.js](https://threejs.org) 🔥

## Attention

This package, while stable, is still in active development.

## Packages

**Angular Three** is a collection of packages that provide different **THREE.js** functionalities

| Package                                                                                    | Version                                                                     | Links                                                                                                                                                                                                 |
| ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@angular-three/core`](https://npmjs.com/package/@angular-three/core)                     | ![npm (scoped)](https://img.shields.io/npm/v/@angular-three/core)           | [![README](https://img.shields.io/badge/README--green.svg)](/packages/core/README.md) ![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@angular-three/core)                     |
| [`@angular-three/postprocessing`](https://npmjs.com/package/@angular-three/postprocessing) | ![npm (scoped)](https://img.shields.io/npm/v/@angular-three/postprocessing) | [![README](https://img.shields.io/badge/README--green.svg)](/packages/postprocessing/README.md) ![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@angular-three/postprocessing) |
| [`@angular-three/cannon`](https://npmjs.com/package/@angular-three/cannon)                 | ![npm (scoped)](https://img.shields.io/npm/v/@angular-three/cannon)         | [![README](https://img.shields.io/badge/README--green.svg)](/packages/cannon/README.md) ![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@angular-three/cannon)                 |
| [`@angular-three/soba`](https://npmjs.com/package/@angular-three/soba)                     | ![npm (scoped)](https://img.shields.io/npm/v/@angular-three/soba)           | [![README](https://img.shields.io/badge/README--green.svg)](/packages/soba/README.md) ![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@angular-three/soba)                     |

### Peer Dependencies

- `three@0.135`: This is a wrapper of **THREE.js** so `three` is a required `peerDependency`. Keep in mind, **THREE.js** is moving quite frequently and quickly. Hence, to ensure compatibility, this wrapper currently supports `0.135`
  - Make sure to also have `@types/three` installed as well

```bash
npm install -E three@0.135
npm install -DE @types/three
```

## Documentations

[Angular Three](https://angular-three.netlify.app)

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://github.com/barbados-clemens"><img src="https://avatars.githubusercontent.com/u/23272162?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Caleb Ukle</b></sub></a><br /><a href="https://github.com/nartc/angular-three/commits?author=barbados-clemens" title="Code">💻</a></td>
    <td align="center"><a href="https://www.joshmorony.com/"><img src="https://avatars.githubusercontent.com/u/2578009?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Joshua Morony</b></sub></a><br /><a href="https://github.com/nartc/angular-three/commits?author=joshuamorony" title="Documentation">📖</a></td>
    <td align="center"><a href="https://github.com/BenLune"><img src="https://avatars.githubusercontent.com/u/5662714?v=4?s=100" width="100px;" alt=""/><br /><sub><b>BenLune</b></sub></a><br /><a href="https://github.com/nartc/angular-three/commits?author=BenLune" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
