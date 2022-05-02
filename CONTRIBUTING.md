# CONTRIBUTING

- Fork this repo and clone the forked on your local environment
- Run `yarn` to install the dependencies
- Start working on changes

## Structure

```
.
├── packages/
│   ├── core
│   ├── schematics
│   ├── cannon
│   ├── soba
│   ├── postprocessing
│   ├── demo
│   └── storybook
└── tools/
    └── generators/
        └── three
```

- `packages/` contains the core libraries and their dependencies
  - `core`: contains the core library. This library holds almost all core entities from THREE.js (anything you can
    import from `THREE` with `import * as THREE from 'three'`)
    - `core-plugin-e2e`: contains the e2e test for Generators
  - `cannon`: contains the Cannon.js physics engine wrapper. This library exposes directives to work convert 3D
    objects to Cannon.js shapes and be aware of the physics environment. Uses `cannon-es` and `cannon-es-debugger`
  - `soba`: contains additional helpers and utilities directives/components. This library is mainly ported
    from [React Three Drei](https://github.com/pmndrs/react-three-drei)
  - `postprocessing`: contains `EffectComposer` and other effects
    from `[postprocessing](https://github.com/vanruesc/postprocessing)`
  - `demo`: an Angular application to quickly test out things. This application also serves as Examples section for
    our Storybook documentations
  - `storybook`: Angular Three documentations
- `tools/` contains all generators to generate what can be generated from core `THREE` at the moment. They are very
  similar to each other, browse around, and ask questions if you need help.

If a file has `// GENERATED` at the top, then do not touch it. Instead, fix the generator instead.

The generators are using [Nx Devkit](https://nx.dev/l/r/core-concepts/nx-devkit).

## Commit Guidelines

Angular Three follows Conventional Commit guidelines with the help of `commitizen` tools.

- Make changes
- Stage the changes
- Commit the changes with `yarn commit`
  - Commitizen flow will make sure you have the right commit message format. This helps with the CHANGELOG
- Push the changes and PR
