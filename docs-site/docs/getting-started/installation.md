---
id: installation
title: Installation
sidebar_label: Installation
---

## Basic

**NGT** is a collection of packages that provide different area of **THREE.js**. To get started, you only need `@angular-three/core` and its `peerDependencies`

```bash
npm install @angular-three/core three @ngrx/component-store
npm install -D @types/three
```

```bash
yarn add @angular-three/core three @ngrx/component-store
yarn add -D @types/three
```

:::note Why Component Store as a peer dependency?

`@ngrx/component-store` is extremely lightweight. It is also well-tested. I decided to keep it as a `peerDependency` because the consumers can actually **make use** of `@ngrx/component-store` if they find a need for it. After all, it's just a **Subject-as-a-Service**, but supercharged. The consumers will definitely gain more than what they have to pay for `@ngrx/component-store`.

:::

## Prerequisite

In order to be efficient with **NGT**, you need to:

- Have intermediate understanding of how **Angular** works
  - **Hierarchy Dependency Injection** and **Content Querying**.
    :::info
    Refer to Introduction's [How](../introduction#how) it works
    :::
  - Some basic understanding of what [**NgZone**](https://angular.io/guide/zone) is.
- Be well-versed with **THREE.js**

## Ecosystem

- `@angular-three/core`: **THREE.js** Core objects like Meshes, Materials, Geometries, etc...
- `@angular-three/controls`: **THREE.js** external Controls like `OrbitControls`, `FlyControls`, etc...
- `@angular-three/postprocessing`: **THREE.js** external Post-processing like `EffectComposer`, and the Passes like `ShaderPass`, `RenderPass`, etc...
- `@angular-three/popmotion` (experimental): Wrapper around [Popmotion](https://popmotion.io) to provide animations to **THREE.js** objects like `Object3D` and `Material`
- `@angular-three/helpers`: Some helpers/utilities components (like `@react-three/drei`)
