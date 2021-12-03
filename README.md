# Declarative THREE.js in Angular

🔥 Leverage your [Angular](https://angular.io) skill to build mind-blowing 3D applications with [THREE.js](https://threejs.org) 🔥

## Attention

This package is still in development

## Packages

**Angular Three** is a collection of packages that provide different **THREE.js** functionalities

| Package                                                                                    | Version                                                                     | Links                                                                                                                                                                                                               |
| ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@angular-three/core`](https://npmjs.com/package/@angular-three/core)                     | ![npm (scoped)](https://img.shields.io/npm/v/@angular-three/core)           | [![README](https://img.shields.io/badge/README--green.svg)](/legacy/packagesackages/core/README.md) ![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@angular-three/core)                     |
| [`@angular-three/postprocessing`](https://npmjs.com/package/@angular-three/postprocessing) | ![npm (scoped)](https://img.shields.io/npm/v/@angular-three/postprocessing) | [![README](https://img.shields.io/badge/README--green.svg)](/legacy/packagesackages/postprocessing/README.md) ![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@angular-three/postprocessing) |
| [`@angular-three/cannon`](https://npmjs.com/package/@angular-three/cannon)                 | ![npm (scoped)](https://img.shields.io/npm/v/@angular-three/cannon)         | [![README](https://img.shields.io/badge/README--green.svg)](/legacy/packagesackages/cannon/README.md) ![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@angular-three/cannon)                 |
| [`@angular-three/soba`](https://npmjs.com/package/@angular-three/soba)                     | ![npm (scoped)](https://img.shields.io/npm/v/@angular-three/soba)           | [![README](https://img.shields.io/badge/README--green.svg)](/legacy/packagesackages/soba/README.md) ![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@angular-three/soba)                     |

### Peer Dependencies

- `three@0.134`: This is a wrapper of **THREE.js** so `three` is a required `peerDependency`. Keep in mind, **THREE.js** is moving quite frequently and quickly. Hence, to ensure compatibility, this wrapper currently supports `0.134`
  - Make sure to also have `@types/three` installed as well

```bash
npm install -E three@0.134
npm install -DE @types/three
```

- `@ngrx/component-store`: **Angular Three** uses `ComponentStore` to manage internal states. `ComponentStore` is a stand-alone (separate from `@ngrx/store`), small, and feature-packed local state management solution (~300LOC).

```bash
npm install @ngrx/component-store
```

> **Q: Why don't you roll your own `ComponentStore` to prevent consumers from having to install another external package?**
>
> A: `@ngrx/component-store` is extremely lightweight. It is also well-tested. I decided to keep it as a `peerDependency` because the consumers can actually **make use** of `@ngrx/component-store` if they find a need for it. After all, it's just a **Subject-as-a-Service**, but supercharged. The consumers will definitely gain more than what they have to pay for `@ngrx/component-store`.

## Overview

Q: Is there a better way to do this in Angular?

```ts
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

const animate = function () {
  requestAnimationFrame(animate);

  cube.rotation.x += 0.01;
  cube.rotation.y += 0.01;

  renderer.render(scene, camera);
};

animate();
```

A: YES!

```ts
@Component({
  selector: 'app-root',
  template: `
    <ngt-canvas>
      <ngt-mesh (animateReady)="onMeshAnimateReady($event.animateObject)">
        <ngt-box-geometry></ngt-box-geometry>
        <ngt-mesh-basic-material
          [parameters]="{ color: '#00ff00' }"
        ></ngt-mesh-basic-material>
      </ngt-mesh>
    </ngt-canvas>
  `,
})
export class AppComponent {
  onMeshAnimateReady(cube: THREE.Mesh) {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;
  }
}
```

and voila...

> NOTE: There are **modules** that are needed to add to the Module that declares this `AppComponent`

**Angular Three** provides **Directives** to build our 3D scene declaratively, and in a performant way. There is nothing attached to the DOM except for `ngt-canvas` component.

### Canvas

`ngt-canvas` is the main building block of **Angular Three**. Normally when working with **THREE.js**, we need to set up a `Renderer`, `Scene`, and `Camera`. `ngt-canvas` sets these up with some defaults:

- `WebGLRenderer` with the following
  - antialias: true
  - powerPreference: 'high-performance'
  - alpha: true
  - `setClearAlpha(0)`
  - If `shadows` is provided, `shadowMap` will be enabled, and a _default_ `PCFSoftShadowMap` will be assigned.
  - If `linear` is `false` (which is the default), the colorspace on the Renderer will be set to `sRGB` and all colors/textures will be converted automatically.
- A _default_ `PerspectiveCamera` with: `fov: 75, near: 0.1, far: 1000, z: 5`
  - If `isOrthographic` is set to true, a _default_ `OrthographicCamera` will be initialized instead, and with: `near: 0.1, far: 1000, z: 5`
  - By default, `Camera` will look at `[0, 0, 0]` (center)
- A _default_ `Scene` and `Raycaster`
- A `window:resize` event listener to recalculate the `Renderer#size` and `Camera#aspect` on resize.

### Component Stores

As mentioned, **Angular Three** utilizes `ngrx/component-store` to manage internal state even though most state usages in the library are _imperative_.

There are 4 stores in **Angular Three**

- `NgtStore`: state of the `Renderer`, `Camera`, `Scene` etc...
- `NgtCanvasInputsStore`: this store only holds and handles changes of the inputs to the `ngt-canvas`
- `NgtAnimationFrameStore`: state of the registered animations (to subscribe to the Animation Loop)
- `NgtInstancesStore`: state of the instances of Materials, Geometries, and Objects at the moment. Materials and Geometries instances are mainly for reuse purposes.
- `NgtEventsStore`: this store is somewhat _internal_ though we can use it to see all the current interactions through pointer events (mainly via the `Raycaster`)
- `NgtPerformanceStore`

These 6 stores are provided on `ngt-canvas` which will allow all children of `ngt-canvas` to have access to the same instances of these 6 stores that `ngt-canvas` initialized.

### Services

- `NgtLoopService`: `NgtLoopService` is internal. This service takes care of actually starting and stopping the Animation Loop.
- `NgtLoaderService`: An Observable-based to load external data.

```ts
this.loaderService.use(GLTFLoader, '/assets/bird.gltf'); // Observable<GLTF>
```

For more information, please check out the [Documentations](#documentations)

### Structure

```
.
├── packages/
│   ├── soba
│   ├── core
│   ├── cannon
│   └── postprocessing
└── tools/
    └── generators/
        └── three
```

- `packages`
  - `cannon`: Cannon.js physics engine (ported from `use-cannon`)
  - `soba`: A collection of useful utilities for THREE.js (ported from `react-three/drei`)
  - `core`: **THREE.js** core is in this package. There are too many to list (and also changing based on **THREE.js** version) so feel free to explore the directory and find out what's missing.
  - `postprocessing`: `EffectComposer` and Passes from `postprocessing`
  - `tools`
    - `generators`
      - `three`: A `workspace-generator` that generates some wrappers for **THREE.js** classes instead of creating these manually. See CONTRIBUTING's [Generators](./CONTRIBUTING.md#generators)

## Documentations

TBD

## Contributors ✨

Thanks goes to these wonderful people ([emoji key](https://allcontributors.org/docs/en/emoji-key)):

<!-- ALL-CONTRIBUTORS-LIST:START - Do not remove or modify this section -->
<!-- prettier-ignore-start -->
<!-- markdownlint-disable -->
<table>
  <tr>
    <td align="center"><a href="https://nartc.me/"><img src="https://avatars.githubusercontent.com/u/25516557?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Chau Tran</b></sub></a><br /><a href="https://github.com/nartc/angular-three/commits?author=nartc" title="Code">💻</a></td>
    <td align="center"><a href="https://github.com/barbados-clemens"><img src="https://avatars.githubusercontent.com/u/23272162?v=4?s=100" width="100px;" alt=""/><br /><sub><b>Caleb Ukle</b></sub></a><br /><a href="https://github.com/nartc/angular-three/commits?author=barbados-clemens" title="Code">💻</a></td>
  </tr>
</table>

<!-- markdownlint-restore -->
<!-- prettier-ignore-end -->

<!-- ALL-CONTRIBUTORS-LIST:END -->

This project follows the [all-contributors](https://github.com/all-contributors/all-contributors) specification. Contributions of any kind welcome!
