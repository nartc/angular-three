# Declarative THREE.js in Angular

🔥 Leverage your [Angular](https://angular.io) skill to build mind-blowing 3D applications with [THREE.js](https://threejs.org) 🔥

Q: Is there a better way to do this in Angular?

```ts
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth, window.innerHeight );
document.body.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry();
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;

const animate = function () {
    requestAnimationFrame( animate );

    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    renderer.render( scene, camera );
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
                <ngt-meshBasicMaterial [parameters]="{color: '#00ff00'}"></ngt-meshBasicMaterial>
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

**Angular Three** provides **Directives** to build your 3D scene declaratively, and in a performant way. There is nothing attached to the DOM except for `ngt-canvas`. 

## Attention

This package is still in development

## Packages

**Angular Three** is a collection of packages that provide different **THREE.js** functionalities

| **core**         | [`@automapper/core`](https://npmjs.com/package/@automapper/core)           | ![npm (scoped)](https://img.shields.io/npm/v/@automapper/core)      | [![README](https://img.shields.io/badge/README--green.svg)](/packages/core/README.md) ![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@automapper/core) ![NPM](https://img.shields.io/npm/l/@automapper/core)                |

| Package                                                                                    | Version                                                                     | Links                                                                                                                                                                                                 |
| ------------------------------------------------------------------------------------------ | --------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@angular-three/core`](https://npmjs.com/package/@angular-three/core)                     | ![npm (scoped)](https://img.shields.io/npm/v/@angular-three/core)           | [![README](https://img.shields.io/badge/README--green.svg)](/packages/core/README.md) ![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@angular-three/core)                     |
| [`@angular-three/controls`](https://npmjs.com/package/@angular-three/controls)             | ![npm (scoped)](https://img.shields.io/npm/v/@angular-three/controls)       | [![README](https://img.shields.io/badge/README--green.svg)](/packages/controls/README.md) ![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@angular-three/controls)             |
| [`@angular-three/loaders`](https://npmjs.com/package/@angular-three/loaders)               | ![npm (scoped)](https://img.shields.io/npm/v/@angular-three/loaders)        | [![README](https://img.shields.io/badge/README--green.svg)](/packages/loaders/README.md) ![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@angular-three/loaders)               |
| [`@angular-three/postprocessing`](https://npmjs.com/package/@angular-three/postprocessing) | ![npm (scoped)](https://img.shields.io/npm/v/@angular-three/postprocessing) | [![README](https://img.shields.io/badge/README--green.svg)](/packages/postprocessing/README.md) ![npm bundle size (scoped)](https://img.shields.io/bundlephobia/minzip/@angular-three/postprocessing) |

### Peer Dependencies

- `three@0.128`: This is a wrapper of **THREE.js** so `three` is a required `peerDependency`. Although, **THREE.js** is moving quite frequently, and this wrapper currently supports `0.128`
  - Make sure to also have `@types/three` installed as well
- `@ngrx/component-store`: **Angular Three** uses `ComponentStore` to manage internal states. `ComponentStore` is a separated, small, and feature-packed local state management solution. You'll definitely get more than what you have to pay for `ComponentStore` (~300LOC)

## Documentations

Coming soon
