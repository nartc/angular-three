# Declarative THREE.js in Angular

🔥 Leverage your [Angular](https://angular.io) skill to build mind-blowing 3D applications with [THREE.js](https://threejs.org) 🔥

## Attention

This package is still in development

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

**Angular Three** provides **Directives** to build your 3D scene declaratively, and in a performant way. There is nothing attached to the DOM except for `ngt-canvas` component.

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

## Documentations

Coming soon
