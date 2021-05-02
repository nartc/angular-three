## CONTRIBUTING

- Fork this repo and clone the forked on your local environment
- Run `npm install` to install all dependencies
  - Run `npx simple-git-hooks` to enable commit hooks
- Start working on changes

### Structure

See README's [Structure](./README.md#structure)

#### Generators

Some **Directives** in **Angular Three** are generated using `workspace-generator` provided by [Nx](https://nx.dev). It is recommended to find a way to generate the **Directives** that wrap **THREE.js** classes instead of building the wrappers manually, this is to improve the maintainability of this library. List of the current generated **Directives** is as follows:

```
|-- core
|   |-- attributes
|   |-- geometries
|   |-- materials
|   |-- curves
|   |-- lights
|   |-- helpers
|   |-- lines
|   |-- sprites
|   |-- cameras
|   `-- textures
`-- examples
    `-- controls
    `-- postprocessing
``` 

### Commit

After you finish with the changes

- Run `git add .` to stage all changes
- Run `npm run commit` to start Conventional Commit flow
  - Pick one of the type of changes from the options: feat, fix, chore, docs etc...
  - Use the `packages/<dir>` as `scope` for your changes

### Semantic Versioning

`@angular-three/*` follows SemVer (`major.minor.patch` versioning) and utilizes `release-it` to semi-automate the release process. The next version will be based on the type of changes from the commits

- `feat` will issue a `minor` version bump. Eg: `1.0.0` -> `1.1.0`
- `fix`, `perf`, and `refactor` will issue a `patch` version bump. Eg: `1.0.0` -> `1.0.1`
- When asked about BREAKING CHANGES during the Conventional Commit flow, the `major` version will be bumped if you answer **YES**. Eg: `1.0.0` -> `2.0.0`

### CHANGELOG

`CHANGELOG` will be generated automatically by `release-it` based on the commits' messages. If you want to be thorough, please include some description of your changes in the PR so that I can manually add that to the `CHANGELOG` when we cut a new release.
