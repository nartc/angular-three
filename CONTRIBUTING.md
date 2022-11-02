# CONTRIBUTING

- Fork this repo and clone the forked on your local environment (node 14 is preferred)
- Run `pnpm install` to install the dependencies
  - If you are contributing to `documentations`, change dir into `libs/documentations` and run `pnpm install` there as well
- Start working on changes

## Structure

```
.
├── apps/
│   ├── sandbox
├── libs/
│   ├── core
│   ├── documentations
│   ├── schematics
│   ├── cannon
│   ├── soba
│   ├── postprocessing
```

- `libs/` contains the core libraries and their dependencies
  - `core`: contains the core library. This library holds almost all core entities from THREE.js (anything you can
    import from `THREE` with `import * as THREE from 'three'`)
    - `core-plugin-e2e`: contains the e2e test for Generators
  - `cannon`: contains the Cannon.js physics engine wrapper. This library exposes directives to work convert 3D
    objects to Cannon.js shapes and be aware of the physics environment. Uses `cannon-es` and `cannon-es-debugger`
  - `soba`: contains additional helpers and utilities directives/components. This library is mainly ported
    from [React Three Drei](https://github.com/pmndrs/react-three-drei)
  - `postprocessing`: contains `EffectComposer` and other effects
    from `[postprocessing](https://github.com/vanruesc/postprocessing)`
  - `documentations`: A Docusaurus app
- `tools/` contains all generators to generate what can be generated from core `THREE` at the moment. They are very
  similar to each other, browse around, and ask questions if you need help.

If a file has `// GENERATED` at the top, then do not touch it. Instead, fix the generator instead.

The generators are using [Nx Devkit](https://nx.dev/l/r/core-concepts/nx-devkit).

## Documentations

Angular Three documentations have three parts:

- Main documentation (Docusaurus) in `libs/documentations`
- Soba storybook (Storybook) in `libs/soba/src`
- Examples site (Angular SPA) in `apps/sandbox`

### Main Documentation

- Look at `sidebars.js` and `docusaurus.config.js` to see what's already there
- Look at Docusaurus website for official documentation
- Write Markdown 😄

### Soba Storybook

- This is to showcase the components that Soba exposes.
- The structure matches with `@angular-three/soba` secondary entry points. Stories file name should match with the component's with `.stories.ts`

### Examples site

- To add a new Example, generate a new SCAM (look at existing module, you can copy and paste too).
- Setup routing for the new example and `routes.ts`
- Add `data` for the new example in `routes.ts`
  - I record a GIF of the example in 1080p then use `ffmpeg` to convert the GIF to `webm` and `mp4`. Put everything under `sandbox/src/assets/examples/`

## Commit Guidelines

Angular Three follows Conventional Commit guidelines with the help of `commitizen` tools.

- Make changes
- Stage the changes
- Commit the changes with `npm run commit`
  - Commitizen flow will make sure you have the right commit message format. This helps with the CHANGELOG
- Push the changes and PR
