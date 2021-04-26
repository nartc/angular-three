# Declarative THREE.js in Angular

🔥 Leverage your [Angular](https://angular.io) skill to build mind-blowing 3D applications with [THREE.js](https://threejs.org) 🔥

## Attention

This package is still in development

## Packages

**Angular Three** is a collection of packages that provide different **THREE.js** functionalities

| Package                                                                                    | Version                                                                     | Links                                                                                                                                                                                                 |
| ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@angular-three/core`](https://npmjs.com/package/@angular-three/core)                     | ![npm (scoped)](https://img.shields.io/npm/v/@angular-three/core)           | [![README](https://img.shields.io/badge/README--green.svg)](/packages/core/README.md) ![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@angular-three/core)                     |
| [`@angular-three/controls`](https://npmjs.com/package/@angular-three/controls)             | ![npm (scoped)](https://img.shields.io/npm/v/@angular-three/controls)       | [![README](https://img.shields.io/badge/README--green.svg)](/packages/controls/README.md) ![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@angular-three/controls)             |
| [`@angular-three/loaders`](https://npmjs.com/package/@angular-three/loaders)               | ![npm (scoped)](https://img.shields.io/npm/v/@angular-three/loaders)        | [![README](https://img.shields.io/badge/README--green.svg)](/packages/loaders/README.md) ![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@angular-three/loaders)               |
| [`@angular-three/postprocessing`](https://npmjs.com/package/@angular-three/postprocessing) | ![npm (scoped)](https://img.shields.io/npm/v/@angular-three/postprocessing) | [![README](https://img.shields.io/badge/README--green.svg)](/packages/postprocessing/README.md) ![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@angular-three/postprocessing) |

### Peer Dependencies

- `three@0.128`: This is a wrapper of **THREE.js** so `three` is a required `peerDependency`. Keep in mind, **THREE.js** is moving quite frequently and quickly. Hence, to ensure compatibility, this wrapper currently supports `0.128`
  - Make sure to also have `@types/three` installed as well

```bash
npm install -E three@0.128
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
      <ngt-mesh (animateReady)="onMeshAnimateReady($event)">
        <ngt-boxGeometry></ngt-boxGeometry>
        <ngt-meshBasicMaterial
          [parameters]="{ color: '#00ff00' }"
        ></ngt-meshBasicMaterial>
      </ngt-mesh>
    </ngt-canvas>
  `,
})
export class AppComponent {
  onMeshAnimateReady({ animateObject }: AnimationReady<THREE.Mesh>) {
    animateObject.rotation.x += 0.01;
    animateObject.rotation.y += 0.01;
  }
}
```

and voila...

![cube](/assets/gifs/cube.gif)

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

- `CanvasStore`: state of the `Renderer`, `Camera`, `Scene` etc...
- `AnimationStore`: state of the registered animations (to participate in the Animation Loop)
- `InstancesStore`: state of the instances of Materials, Geometries, and Objects at the moment. Materials and Geometries instances are mainly for reuse purposes.
- `EventsStore`: this store is somewhat _internal_ though we can use it to see all the current interactions through pointer events (mainly via the `Raycaster`)

These 4 stores are provided on `ngt-canvas` which will allow all children of `ngt-canvas` to have access to the same instances of these 4 stores that `ngt-canvas` initialized.

### Services

In addition to the Stores, `ngt-canvas` also provides a `LoopService`. `LoopService` is, again, somewhat _internal_ but for some reason you want to `stop()` the animation loop, call `loopService.stop()`.

For more information, please check out the [Documentations](#documentations)

### Structure

```
.
├── docs
├── packages/
│   ├── controls
│   ├── core
│   ├── demo
│   ├── loaders
│   ├── popmotion
│   └── postprocessing
└── tools/
    └── generators/
        └── life-saver
```

- `docs`: Powered by [Docusaurus v2](https://docusaurus.io/)
- `packages`
  - `controls`: Different type of Controls from `three/examples/jsm/controls/*`
    - [x] DeviceOrientationControls
    - [x] DragControls
    - [x] FirstPersonControls
    - [x] FlyControls
    - [x] OrbitControls
    - [x] PointerLockControls
    - [x] TrackballControls
    - [x] TransformControls
  - `core`: **THREE.js** core is in this package. There are too many to list (and also changing based on **THREE.js** version) so feel free to explore the directory and find out what's missing.
  - `demo`: An **Angular** application for quickly build demo/test locally.
  - `loaders`: External loaders from `three/examples/jsm/loaders/*`
    - [ ] 3DMLoader
    - [ ] BasisTextureLoader
    - [ ] DRACOLoader
    - [x] GLTFLoader
    - [ ] KTX2Loader
    - [ ] MMDLoader
    - [ ] MTLLoader
    - [ ] OBJLoader
    - [ ] PCDLoader
    - [ ] PDBLoader
    - [ ] PRWMLoader
    - [ ] SVGLoader
    - [ ] TGALoader
  - `popmotion`: An experimental directive that wraps [Popmotion](https://popmotion.io) to provide animations to **THREE.js** primitives
    - [x] Object3D
    - [x] Material
  - `postprocessing`: `EffectComposer` and Passes from `three/examples/jsm/postprocessin/*`
    - [x] EffectComposer
    - [ ] AdaptiveToneMappingPass
    - [ ] AfterImagePass
    - [ ] BloomPass
    - [ ] BokehPass
    - [ ] ClearPass
    - [ ] CubeTexturePass
    - [ ] DotScreenPass
    - [ ] FilmPass
    - [ ] GlitchPass
    - [ ] HalftonePass
    - [ ] LUTPass
    - [ ] MaskPass
    - [ ] OutlinePass
    - [x] RenderPass
    - [ ] SAOPass
    - [ ] SavePass
    - [x] ShaderPass
    - [ ] SMAAPass
    - [ ] SSAARenderPass
    - [x] SSAOPass
    - [ ] SSRPass
    - [ ] TAARenderPass
    - [ ] TexturePass
    - [x] UnrealBloomPass
  - `tools`
    - `generators`
      - `life-saver`: A `workspace-generator` that generates some wrappers for **THREE.js** classes instead of creating these manually. See CONTRIBUTING's [Generators](./CONTRIBUTING.md#generators)

## Documentations

Coming soon
