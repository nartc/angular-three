# `@angular-three/cannon`

This package provides the `ngt-physics` directive that you can then apply physics to any `NgtObject3d` inside of it.

```html
<ngt-canvas>
  <ngt-mesh> <!-- no physics --> </ngt-mesh>

  <ngt-physics>
    <ngt-mesh ngtPhysicBox> <!-- with physics --> </ngt-mesh>
  </ngt-physics>
</ngt-canvas>
```

## Installation

```shell
npm install @angular-three/cannon cannon-es cannon-es-debugger
```
