

### [6.0.1](https://github.com/nartc/angular-three/compare/6.0.0...6.0.1) (2022-07-31)


### Bug Fixes

* **core:** add check for material and geometry but parent is not a mesh ([6c3943d](https://github.com/nartc/angular-three/commit/6c3943d4a8897fafef170df5a17892dec65a4791))
* **core:** adjust three peer deps ([c14400f](https://github.com/nartc/angular-three/commit/c14400f5803361300234794754297af50c84edb9))

## [6.0.0](https://github.com/nartc/angular-three/compare/6.0.0-beta.0...6.0.0) (2022-07-26)

### ⚠ BREAKING CHANGES

- All components/directives/pipes are now standalone. Module-based APIs will be removed in future major
- `makeVector*`, `makeColor` are removed. Use `make()` instead
- `NgtComponentStore` is now an abstract `Directive` instead of an `Injectable`
- `NgtComponentStore#onCanvasReady` is replaced with `NgtStore#onReady`
- `NgtCoreModule` is removed. Use `NgtCanvasModule` instead
- `NgtColorPipe` is removed. Use `NgtColorAttribute` instead
- `NgtFogPipe` is removed. Use `NgtFogAttribute` instead
- `NgtFogExp2Pipe` is removed. Use `NgtFogExp2Attribute` instead
- `NgtVector2Pipe` is removed. Use `NgtVector2Attribute` instead
- `NgtVector3Pipe` is removed. Use `NgtVector3Attribute` instead
- `NgtVector4Pipe` is removed. Use `NgtVector4Attribute` instead
- `NgtObjectInputs` -> `NgtObjectProps`
- `NgtObjectInputsState` -> `NgtObjectPropsState`
- Abstract classes are rewritten to use `inject()`. Hence, derived classes do not need to pass DIs into `super()` calls anymore
- `[parameters]` on Materials are removed. Please use individual Inputs
- `schematics:configure-cannon` is removed

### Features

- bump peer deps ([223c604](https://github.com/nartc/angular-three/commit/223c604cf25884cef8385638c3087cc87a064244))
- **cannon:** standalone api ([6c26dcd](https://github.com/nartc/angular-three/commit/6c26dcdf151d91fd1b900eb247ea5eafc82ba655))
- **core:** clean up ngtObjectPassThrough ([35a77f6](https://github.com/nartc/angular-three/commit/35a77f6e9eff9b675e859db2cbc7443cb1c0e270))
- **core:** consolidate make fns ([a2486fe](https://github.com/nartc/angular-three/commit/a2486fe7d4d564c6c81133ecf69d3ddc1fde1515))
- **core:** remove material parameters inputs ([0029fa7](https://github.com/nartc/angular-three/commit/0029fa77311efd3302d9722730d53b0edb70c83d))
- **core:** replace onCanvasReady with onReady ([2083c50](https://github.com/nartc/angular-three/commit/2083c506502f4f06fad1115a2cde5f66f5ba8872))
- **core:** standalone api ([e1071d6](https://github.com/nartc/angular-three/commit/e1071d6127d9638c3868447eb09f26a73b526ca4))
- **core:** use inject ([336b453](https://github.com/nartc/angular-three/commit/336b4534670e6ff7e5b8a77fc40e80308e3d08aa))
- **core:** use inject ([2b627b6](https://github.com/nartc/angular-three/commit/2b627b68d25a004633c9ababb40ef86fd94b2a53))
- **postprocessing:** standalone api ([ef72f25](https://github.com/nartc/angular-three/commit/ef72f258cd88843775e467da8fab24c7ad7ed7a7))
- **schematics:** remove configure cannon generator/schematic ([3391638](https://github.com/nartc/angular-three/commit/3391638e962a7db94c24d6f78800bbd0a969201b))
- **soba:** standalone api ([5707f85](https://github.com/nartc/angular-three/commit/5707f857ea3bb801edc43167843c97d6bbf36696))

### Bug Fixes

- **core:** adjust loop logici ([f174630](https://github.com/nartc/angular-three/commit/f174630460b34a52ae7560800513bc0eb550ecc7))
- **core:** change component store to be an abstract directive instead ([a077d83](https://github.com/nartc/angular-three/commit/a077d83e98f648c50b66e81b1a2cfa4f87d9acaa))
- **core:** clean up instance ([104523f](https://github.com/nartc/angular-three/commit/104523f7f71ed8b9b6513dd59a419855def8823d))
- **core:** objects now added to scene after Enter VR on Oculus Quest ([#135](https://github.com/nartc/angular-three/issues/135)) ([f203fd5](https://github.com/nartc/angular-three/commit/f203fd5103a4dd2d82f86cc57c5d3b10589243b7))
- revert to three import ([7384f93](https://github.com/nartc/angular-three/commit/7384f93f7b929574af85fa0c7476e96319f68b1a))
- update three import to three/src/Three ([8942c28](https://github.com/nartc/angular-three/commit/8942c28063625d4d3a5f52b28d2919251a71b56f))
- **postprocessing:** standalone-ize effect composer ([a682deb](https://github.com/nartc/angular-three/commit/a682deb94e89a1980a8c400ab8b13c757214a882))

### Documentations

- **core:** fixed typo in ngt-primitive component ([#128](https://github.com/nartc/angular-three/issues/128)) ([6254323](https://github.com/nartc/angular-three/commit/625432381599043de15b8e0d2b76b93288f6b4de))
- add docusaurus workflow for branch deploy ([c0c3b37](https://github.com/nartc/angular-three/commit/c0c3b375f8295aae4907d95c5bfe78bc5e623e3c))
- converting to standalone ([d1f5622](https://github.com/nartc/angular-three/commit/d1f562209e46e63109fc8610f15058064cdf8d83))
- migration to v6 ([31415f8](https://github.com/nartc/angular-three/commit/31415f86a320fc823f8dd1071833c3654577f3d3))
- update docs to use standalone apis ([b1a5cc0](https://github.com/nartc/angular-three/commit/b1a5cc04a34ab777ccc083918365d109ff0c6743))

## [6.0.0-beta.0](https://github.com/nartc/angular-three/compare/5.5.0...6.0.0-beta.0) (2022-07-24)

### Features

- bump peer deps ([223c604](https://github.com/nartc/angular-three/commit/223c604cf25884cef8385638c3087cc87a064244))
- **cannon:** standalone api ([6c26dcd](https://github.com/nartc/angular-three/commit/6c26dcdf151d91fd1b900eb247ea5eafc82ba655))
- **core:** clean up ngtObjectPassThrough ([35a77f6](https://github.com/nartc/angular-three/commit/35a77f6e9eff9b675e859db2cbc7443cb1c0e270))
- **core:** consolidate make fns ([a2486fe](https://github.com/nartc/angular-three/commit/a2486fe7d4d564c6c81133ecf69d3ddc1fde1515))
- **core:** remove material parameters inputs ([0029fa7](https://github.com/nartc/angular-three/commit/0029fa77311efd3302d9722730d53b0edb70c83d))
- **core:** replace onCanvasReady with onReady ([2083c50](https://github.com/nartc/angular-three/commit/2083c506502f4f06fad1115a2cde5f66f5ba8872))
- **core:** standalone api ([e1071d6](https://github.com/nartc/angular-three/commit/e1071d6127d9638c3868447eb09f26a73b526ca4))
- **core:** use inject ([336b453](https://github.com/nartc/angular-three/commit/336b4534670e6ff7e5b8a77fc40e80308e3d08aa))
- **core:** use inject ([2b627b6](https://github.com/nartc/angular-three/commit/2b627b68d25a004633c9ababb40ef86fd94b2a53))
- **postprocessing:** standalone api ([ef72f25](https://github.com/nartc/angular-three/commit/ef72f258cd88843775e467da8fab24c7ad7ed7a7))
- **schematics:** remove configure cannon generator/schematic ([3391638](https://github.com/nartc/angular-three/commit/3391638e962a7db94c24d6f78800bbd0a969201b))
- **soba:** standalone api ([5707f85](https://github.com/nartc/angular-three/commit/5707f857ea3bb801edc43167843c97d6bbf36696))

### Bug Fixes

- **core:** adjust loop logici ([f174630](https://github.com/nartc/angular-three/commit/f174630460b34a52ae7560800513bc0eb550ecc7))
- **core:** change component store to be an abstract directive instead ([a077d83](https://github.com/nartc/angular-three/commit/a077d83e98f648c50b66e81b1a2cfa4f87d9acaa))
- **core:** clean up instance ([104523f](https://github.com/nartc/angular-three/commit/104523f7f71ed8b9b6513dd59a419855def8823d))
- **core:** objects now added to scene after Enter VR on Oculus Quest ([#135](https://github.com/nartc/angular-three/issues/135)) ([f203fd5](https://github.com/nartc/angular-three/commit/f203fd5103a4dd2d82f86cc57c5d3b10589243b7))
- revert to three import ([7384f93](https://github.com/nartc/angular-three/commit/7384f93f7b929574af85fa0c7476e96319f68b1a))
- update three import to three/src/Three ([8942c28](https://github.com/nartc/angular-three/commit/8942c28063625d4d3a5f52b28d2919251a71b56f))

### Documentations

- **core:** fixed typo in ngt-primitive component ([#128](https://github.com/nartc/angular-three/issues/128)) ([6254323](https://github.com/nartc/angular-three/commit/625432381599043de15b8e0d2b76b93288f6b4de))

## [5.5.0](https://github.com/nartc/angular-three/compare/5.4.0...5.5.0) (2022-06-08)

### Features

- **cannon:** add remove to physic body ([7b09397](https://github.com/nartc/angular-three/commit/7b093972b89dfb2bf3c1d3df661aca16a6508c95))

### Bug Fixes

- **core:** XR typings ([1eba758](https://github.com/nartc/angular-three/commit/1eba758fc5dfd317f62e3673ae872426dd89b6ec))
- **postprocessing:** LUTEffet typing ([881b92b](https://github.com/nartc/angular-three/commit/881b92b531812d21ad0a97aa4023b82497f73722))

## [5.4.0](https://github.com/nartc/angular-three/compare/5.3.0...5.4.0) (2022-05-27)

### Features

- **core:** update range for three dependency in core ([c9067e5](https://github.com/nartc/angular-three/commit/c9067e5ab2f9ef2070dda55da0ae2afd56a764fe))

## [5.3.0](https://github.com/nartc/angular-three/compare/5.2.4...5.3.0) (2022-05-27)

### Features

- **core:** adjust three dep ([ced5e47](https://github.com/nartc/angular-three/commit/ced5e47ab8551f6c2e2b0530901f899a3493a3eb))
- **schematics:** update three version ([931cc88](https://github.com/nartc/angular-three/commit/931cc88df82770293497ad860e50e024bcd669c9))

### Documentations

- add hide-able sandbox route ([2b9bba5](https://github.com/nartc/angular-three/commit/2b9bba5cdf200ec9cad778f9ce1eba6b784f5adc))
- update tailwind class for d-none ([4541fd6](https://github.com/nartc/angular-three/commit/4541fd6a163b9f121420315206fbbb3ef3ae1d8f))

### [5.2.4](https://github.com/nartc/angular-three/compare/5.2.3...5.2.4) (2022-05-16)

### Bug Fixes

- **soba:** fake timer to delay gizmo-helper render as a workaround ([53d26b1](https://github.com/nartc/angular-three/commit/53d26b104091202bd3d610d06e9a35ea344985c4))

### [5.2.3](https://github.com/nartc/angular-three/compare/5.2.2...5.2.3) (2022-05-13)

### Bug Fixes

- **cannon:** make sure wheels and chassis are available before calling raycastVehicle ([ec60ca4](https://github.com/nartc/angular-three/commit/ec60ca488b5b5f245b69c59f1988fd065fedd91f))
- **cannon:** still add body to debug on disabled ([4b8e663](https://github.com/nartc/angular-three/commit/4b8e66317680f1eed474b2d479e587f378909fa6))
- **cannon:** strong type object type for physics APIs ([7e0d788](https://github.com/nartc/angular-three/commit/7e0d788c1f20673db978f546dcdfcfc1f73b076d))
- **core:** bump three peerDeps ([6bf9d89](https://github.com/nartc/angular-three/commit/6bf9d890a75e98d57e89ee48923a4e2a66fae4b0))
- **core:** reinit material if ctorParams$ changes ([2a57fca](https://github.com/nartc/angular-three/commit/2a57fcaf3fbdb34b680731c378bfb4bd21f2dedf))

### Documentations

- add raycast vehicle ([991d642](https://github.com/nartc/angular-three/commit/991d6423d5689fcdb09994cffbf5a165c54cf205))
- add reflector story ([f059d99](https://github.com/nartc/angular-three/commit/f059d99e914301efbb6e9257c78bfd1e85e87198))
- adjust all physics examples to use strongly typed version ([45d933d](https://github.com/nartc/angular-three/commit/45d933d81245acf1d4d5ccf2c66d64dd3afee6d1))

### [5.2.2](https://github.com/nartc/angular-three/compare/5.2.1...5.2.2) (2022-05-09)

### Bug Fixes

- **core:** destroy loader cache on Canvas unmount ([0353fdf](https://github.com/nartc/angular-three/commit/0353fdf9df79c562bf9dd1b043325a18e8eb0b8d))
- **core:** rework loader so cache works properly; cache bursted on canvas destroyed ([8fbe4c0](https://github.com/nartc/angular-three/commit/8fbe4c09cc44d86df8bbf22cd3b5b0330978fe60))
- **core:** use lookAt as an Input instead of passing in for camera ([2a0ac46](https://github.com/nartc/angular-three/commit/2a0ac4666b2796dbe316d9b42926be701229d4db))
- **soba:** remove asyncScheduler from Detailed ([1561878](https://github.com/nartc/angular-three/commit/156187849be42c133f2fdea919ddb661672dfa2d))

### Documentations

- adjust lod example ([bc704d0](https://github.com/nartc/angular-three/commit/bc704d036cf7ff00c3729e2477ead9eea17f1d5e))
- update docs and add some docs about performance/best practices ([480f396](https://github.com/nartc/angular-three/commit/480f3965c2f198c2c6c8cd30b3e7a4d3dfd66261))
- use Scene component ([1c3ab8f](https://github.com/nartc/angular-three/commit/1c3ab8f6a9a1960db4ad395eb40cd1f41d03b399))

### [5.2.1](https://github.com/nartc/angular-three/compare/5.2.0...5.2.1) (2022-05-08)

### Bug Fixes

- **postprocessing:** clean up effect composer ([7a19642](https://github.com/nartc/angular-three/commit/7a19642f958f875d1fa61bd8c8bf31e20e98d6c7))
- **postprocessing:** fix LUTEffect to construct correctly ([6389da5](https://github.com/nartc/angular-three/commit/6389da5c9df14408a1200700d0d3daee5a4a5b1b))
- **postprocessing:** use this.instance$ instead for DepthofField ([142d5ce](https://github.com/nartc/angular-three/commit/142d5ce40fd11ecb7db9d930dc050ab347cb0365))

### Documentations

- add link to andivr cannon examples; add performance page ([519704b](https://github.com/nartc/angular-three/commit/519704b97c617e4e7e6c39365e11544fae042c4d))
- add missing code changes to render 2 cubes ([#115](https://github.com/nartc/angular-three/issues/115)) ([c094683](https://github.com/nartc/angular-three/commit/c094683dcd656853c29f26478256f1df4c818e21))
- add more performance related examples ([dad2b35](https://github.com/nartc/angular-three/commit/dad2b3548005493f02388965d01b3a6498a91c67))

## [5.2.0](https://github.com/nartc/angular-three/compare/5.1.1...5.2.0) (2022-05-07)

### Features

- **core:** add update event emitter to instance which emits after setOptions ([f865c73](https://github.com/nartc/angular-three/commit/f865c7363c64311dd3b6ca31fe310fc01d29b283))
- **postprocessing:** rename simple effects; use individual inputs ([0c871ad](https://github.com/nartc/angular-three/commit/0c871adccb92d53c762938a78d6ca856c07f7870))
- **soba:** add AdaptiveDpr and AdaptiveEvents to react to performance regression on camera movements ([1dbbd62](https://github.com/nartc/angular-three/commit/1dbbd622c75a59f1ca07b7a8320afedfa3e711f2))
- **soba:** add soba text3d ([8c68720](https://github.com/nartc/angular-three/commit/8c68720d2dfad76e1d3b92b03c5ba7cb801f921a))

### Bug Fixes

- **core:** re-int object on instanceArg$ changes ([9128e17](https://github.com/nartc/angular-three/commit/9128e170e05488b31d53251c6ee9b1ac871dfdec))
- **core:** wrong merge logic for performance options ([e55f93e](https://github.com/nartc/angular-three/commit/e55f93e6fb13838b5ad4da8b59d76de83104edfc))
- **postprocessing:** ssao effect ([2c871df](https://github.com/nartc/angular-three/commit/2c871dfa540a8e01ad37e9e0da7d5caf5392c143))
- **soba:** avoid error when colors length less than stops length in gradient texture ([6cd6abf](https://github.com/nartc/angular-three/commit/6cd6abf50d16137d8682c57a6eb24e2e4ec55214))
- **soba:** fix ContentChildren for Float ([f839b97](https://github.com/nartc/angular-three/commit/f839b97da4de5bcddf228e98e249bb45d9fdb583))
- **soba:** fix ContentChildren for Stage ([250059c](https://github.com/nartc/angular-three/commit/250059cbbc15608383f51d2b33436d628b540223))
- **soba:** fix ContentChildren; use ref for Center ([ea7cd19](https://github.com/nartc/angular-three/commit/ea7cd19266da4f499cf7dec80677e54a30108c6c))
- **soba:** fix ContentChildren; use ref for Detailed ([fc150e3](https://github.com/nartc/angular-three/commit/fc150e34a7e93f19c9ee57180e666765446369c0))
- **soba:** override update for gizmo helper since instance now has update event emitter ([b8111df](https://github.com/nartc/angular-three/commit/b8111df3d50c9959f24bf3d257c066ea0adf481a))
- **soba:** use ref for Backdrop ([8d606fc](https://github.com/nartc/angular-three/commit/8d606fca8d570b54a70cc9c0680097b8a1a3386e))
- **soba:** use ref for ContactShadows ([c428794](https://github.com/nartc/angular-three/commit/c428794bf5a72a5b97c21a4ab15ca2738d403834))
- **soba:** use ref for Environment ([e479d2f](https://github.com/nartc/angular-three/commit/e479d2f1fc232cfc6af741fc873301b5a41ac3de))
- **soba:** use ref for Gizmo ([5b35a25](https://github.com/nartc/angular-three/commit/5b35a25a33f6eabe7df00b27323cda5fb09b6dc1))
- **soba:** use ref for Spotlight ([8cdfdb3](https://github.com/nartc/angular-three/commit/8cdfdb3efea88b662a0e6cea4d10f7a50e5454ed))

### Documentations

- add adaptive stories ([1117add](https://github.com/nartc/angular-three/commit/1117add387627be36f8c3720c026054e2c5900f9))
- add args/props for gradient texture story ([0f33e0c](https://github.com/nartc/angular-three/commit/0f33e0ce9ecd38c5e83b701092b1cc5c3b83bfad))
- add CDK to use platform for poster ([e56ea64](https://github.com/nartc/angular-three/commit/e56ea649f17fca1bac806b19af60b526bc94038a))
- adjust workflow ([bf96d88](https://github.com/nartc/angular-three/commit/bf96d882675737b725a86b23d6e213ac231d7304))
- match Drei's props on some stories ([f41eaf9](https://github.com/nartc/angular-three/commit/f41eaf9274787c57a681f795211c1bfdb6ad5835))
- use createRangeControl ([2305d07](https://github.com/nartc/angular-three/commit/2305d0782c98950b036ea8fcf1101a2d89a1e8bc))
- use white background for stage stories to see shadow better ([c6569ce](https://github.com/nartc/angular-three/commit/c6569ce954e744c32e44a9d4c3f46a7edb45eecb))

### [5.1.1](https://github.com/nartc/angular-three/compare/5.1.0...5.1.1) (2022-05-04)

### Bug Fixes

- **repo:** simplify registerBeforeRender call ([8506248](https://github.com/nartc/angular-three/commit/850624848bd711715e5675292e2eaf59f82dffc1))

### Documentations

- typo ([0b13160](https://github.com/nartc/angular-three/commit/0b131607389bdf1d56ab149a28858f474988d31a))
- update three version ([2de4468](https://github.com/nartc/angular-three/commit/2de44686d72ef61a106fbe2dfa374b7c113a8104))

## [5.1.0](https://github.com/nartc/angular-three/compare/5.0.3...5.1.0) (2022-05-04)

### Features

- **core:** update three 0.140 ([25d6a51](https://github.com/nartc/angular-three/commit/25d6a51c4d0a2405f2b2924a03928c7741123a54))
- **schematics:** bump three version ([7d037cc](https://github.com/nartc/angular-three/commit/7d037cc5c9aed299e3530779c02f21db9a8b4390))

### Documentations

- add height field example ([124a003](https://github.com/nartc/angular-three/commit/124a003dc4e542ba3e2bf5fa18414a97eb372cf3))
- add outputs to build step ([3031d62](https://github.com/nartc/angular-three/commit/3031d622d9316e564ddbb4cb75b00f8fed4abb05))
- add redirects ([9f9b8f8](https://github.com/nartc/angular-three/commit/9f9b8f8271cf53373ef032377370235d712ab025))
- adjust height-field example ([aebcf41](https://github.com/nartc/angular-three/commit/aebcf41c727e7dc459907682fd64cac91c456aa7))
- hardcode href ([5c269be](https://github.com/nartc/angular-three/commit/5c269bea43d8250aa322d6b4483558bf8cc6898a))

### [5.0.3](https://github.com/nartc/angular-three/compare/5.0.2...5.0.3) (2022-05-02)

### Bug Fixes

- **postprocessing:** use a group for child effectx ([6a52a39](https://github.com/nartc/angular-three/commit/6a52a39d91d6496a384f79b9f6ce655dccdad5db))

### Documentations

- adjust keen bloom to use ngt-effect-composer-content ([a1a2cd2](https://github.com/nartc/angular-three/commit/a1a2cd214754238e7a69195906337e53b30ecf92))
- adjust object clump to use ngt-effect-composer-content ([1c472dc](https://github.com/nartc/angular-three/commit/1c472dc3b60d0cb0078aef18889403dd0f9efa08))

### [5.0.2](https://github.com/nartc/angular-three/compare/5.0.1...5.0.2) (2022-05-02)

### Bug Fixes

- **core:** expose checkNeedsUpdate and call checkNeedsUpdate where needsUpdate = true was ([0514798](https://github.com/nartc/angular-three/commit/0514798b2fdf397e0a591c10bf38f49a9f174d85))
- **soba:** ensure to update material and material uniforms for Sky ([5e683da](https://github.com/nartc/angular-three/commit/5e683dad28d7b2355cb4c732beeece3460650f9c))

### Documentations

- adjust netlify for main branch now ([263430a](https://github.com/nartc/angular-three/commit/263430abe7a613b366d623efd6916773e3e272f1))
- adjust predocs command to run install workspace root ([a7542b0](https://github.com/nartc/angular-three/commit/a7542b0e6256f45ff23cb07daccbfbf13271edba))
- adjust storybook ([c01ed8b](https://github.com/nartc/angular-three/commit/c01ed8b07d161b9e48be861fe9315ac300b8c60e))
- force install devDependencies ([7013bad](https://github.com/nartc/angular-three/commit/7013bad96f6fe4407958b7c247c8bbe72eff84ab))
- revert change to predocs ([09b1d89](https://github.com/nartc/angular-three/commit/09b1d89d746e8ca252374bf4159fa2a04d2475bf))

### [5.0.1](https://github.com/nartc/angular-three/compare/5.0.0...5.0.1) (2022-05-01)

### Bug Fixes

- **core:** object host ref should return the parentRef as it is already a factorye ([33a3df9](https://github.com/nartc/angular-three/commit/33a3df9466bb4583fa9154d64b620b034298ee3f))

## [5.0.0](https://github.com/nartc/angular-three/compare/5.0.0-beta.32...5.0.0) (2022-05-01)

### Bug Fixes

- **postprocessing:** adjust effect param changes; handle effect dispos ([af76d7e](https://github.com/nartc/angular-three/commit/af76d7e6353a46968014184cc367748c50ed30db))
- **postprocessing:** ssao blendFunction options should get from the input ([32aba1c](https://github.com/nartc/angular-three/commit/32aba1c37981b114e81d2fab2e8897dc73949a0d))
- **repo:** adjust provideObjectHostRef to be less boilerplate ([5f77dcb](https://github.com/nartc/angular-three/commit/5f77dcbdae244caa7c1b44aeb48bc324ecb479a1))

### Documentations

- add postprocessing-ssao example ([a7cd4b2](https://github.com/nartc/angular-three/commit/a7cd4b2a36a73ead3f8f3df66646392dc8d51156))
- add vertex colors with instancing ([ed1a46e](https://github.com/nartc/angular-three/commit/ed1a46e928860bad70a40fdcbd2045fae57616e4))

## [5.0.0-beta.32](https://github.com/nartc/angular-three/compare/5.0.0-beta.31...5.0.0-beta.32) (2022-05-01)

### Features

- **core:** add capsule geometry ([ae67458](https://github.com/nartc/angular-three/commit/ae6745844644c78a7e71ee133dce42c2ab37c731))

### Documentations

- add gif as fallback for browsers that do not support video ([c561010](https://github.com/nartc/angular-three/commit/c561010fc442b380582ad47f8cc7390294d10d0e))

## [5.0.0-beta.31](https://github.com/nartc/angular-three/compare/5.0.0-beta.30...5.0.0-beta.31) (2022-04-30)

### Features

- **core:** add lookAt to cameraOptions ([ee59039](https://github.com/nartc/angular-three/commit/ee59039c59016f2d08f5128538712db2f306a95c))

### Documentations

- add docs page for Sky ([0ec14c2](https://github.com/nartc/angular-three/commit/0ec14c2332fb36b4b80cd943beed2d5d2760ddd9))
- add more info about effects ([d4f1d81](https://github.com/nartc/angular-three/commit/d4f1d8106b1e162de4528889d1d7ca13e25eb9dc))
- adjust redirect ([c2eebe0](https://github.com/nartc/angular-three/commit/c2eebe04b72e11b9e9eaece04c3d593516a5febb))
- adjust redirect again ([f48eb21](https://github.com/nartc/angular-three/commit/f48eb21b7b231c34e2f87705be948d06a6b157bf))
- adjust redirect again and again ([6d4334b](https://github.com/nartc/angular-three/commit/6d4334b47ddfc82215baa2e671c67d19e357751e))
- clean up docs and remove plugin client redirects ([3398a05](https://github.com/nartc/angular-three/commit/3398a053baeddeccb095d78db374659df4ee6753))
- test plugin client redirects ([0b76eed](https://github.com/nartc/angular-three/commit/0b76eed7a353e53ed5680f4d5425978338135814))

## [5.0.0-beta.30](https://github.com/nartc/angular-three/compare/5.0.0-beta.29...5.0.0-beta.30) (2022-04-30)

### Bug Fixes

- **core:** intensity should accept data from input instead of hard code 1 ([8bcdf20](https://github.com/nartc/angular-three/commit/8bcdf207d35569b5f7d04e012d98a1316623ae43))
- **core:** move args input to abstract classes ([ad7947d](https://github.com/nartc/angular-three/commit/ad7947d1895af1c59a7e8f4a67e8bf154f520808))
- **postprocessing:** debounce effectPasses so that multiple effect triggers should be debounced ([c54f9e7](https://github.com/nartc/angular-three/commit/c54f9e77d621d9638cc426a546e820373725f2bd))
- **soba:** remove args input on line geometry ([8a0fbe8](https://github.com/nartc/angular-three/commit/8a0fbe8c73656301ca8145d902bc550706307f27))

### Documentations

- add clump ([ffc73a7](https://github.com/nartc/angular-three/commit/ffc73a76360ad90364deabf5dbb2390ac8a5de89))
- adjust home ([70df11b](https://github.com/nartc/angular-three/commit/70df11b4051ff6e992feba4fd9d3bbd5e4b68a54))
- handle redirect ([10d3e03](https://github.com/nartc/angular-three/commit/10d3e03992cc0a257e1b92455a6e9f72cf410c5f))
- video play on hover ([d7fc972](https://github.com/nartc/angular-three/commit/d7fc972d7f48cd64cd9358f2739291a57df7f83c))

## [5.0.0-beta.29](https://github.com/nartc/angular-three/compare/5.0.0-beta.28...5.0.0-beta.29) (2022-04-29)

### Bug Fixes

- **schematics:** include nrwl/devkit as dependencies for schematicsn ([0f973a1](https://github.com/nartc/angular-three/commit/0f973a1504134b16f8f1fe27e87833c279d334f5))

## [5.0.0-beta.28](https://github.com/nartc/angular-three/compare/5.0.0-beta.27...5.0.0-beta.28) (2022-04-29)

### Bug Fixes

- **schematics:** adjust how version is determined ([f7f5e5f](https://github.com/nartc/angular-three/commit/f7f5e5f9325caa3cf4247ae02307e5586b5e90c2))

## [5.0.0-beta.27](https://github.com/nartc/angular-three/compare/5.0.0-beta.26...5.0.0-beta.27) (2022-04-29)

### Bug Fixes

- **schematics:** update schematics to support v5 ([6638339](https://github.com/nartc/angular-three/commit/6638339fe4e9d1c9543b5417a6425a77f563994a))

### Documentations

- add examples to docs ([eb5485d](https://github.com/nartc/angular-three/commit/eb5485d7a6c5cb61de45a2cad7300047564d2f40))
- adjust how to compute netlify urls ([681b762](https://github.com/nartc/angular-three/commit/681b762b5c7b961d6ea559629e5bee050e3af793))
- remove uneccessary const ([0a93137](https://github.com/nartc/angular-three/commit/0a93137b2aaca122c6710a141aafb228cef56b03))

## [5.0.0-beta.26](https://github.com/nartc/angular-three/compare/5.0.0-beta.25...5.0.0-beta.26) (2022-04-29)

### Features

- **core:** allow to pass in Ref for primitive as well ([a855e1f](https://github.com/nartc/angular-three/commit/a855e1f7b383538bd3380d17e7407d4150019ab8))
- **soba:** support material for text ([7f4eb1a](https://github.com/nartc/angular-three/commit/7f4eb1ad44976ef9a9ca2bbcc7fa86f57fae7ea0))

### Bug Fixes

- **core:** check for null before accessing objects ([16ed4d1](https://github.com/nartc/angular-three/commit/16ed4d150736730cf5ab3210d4bf02ad41175e75))
- **core:** check on Reflect before assign empty object in mutate ([22a057d](https://github.com/nartc/angular-three/commit/22a057d2d68d844a2adaccfca244414b29853f65))
- **soba:** adjust textMesh instance ([853be0e](https://github.com/nartc/angular-three/commit/853be0e23cdb7f240480f39e90dec1f373b2987a))

### Documentations

- clean up text story ([5d6b784](https://github.com/nartc/angular-three/commit/5d6b784a1d096c27d4511917f89d8b7b700ec703))

## [5.0.0-beta.25](https://github.com/nartc/angular-three/compare/5.0.0-beta.24...5.0.0-beta.25) (2022-04-29)

### Features

- **core:** add value attribute to add arbitrary value to parent instance ([a135b19](https://github.com/nartc/angular-three/commit/a135b1929e97166c31ad4a461e6e14b81a86f1f7))
- **soba:** add Bounds ([cc7db0c](https://github.com/nartc/angular-three/commit/cc7db0c95f3df515121f1ff0599678ee5e6e2ce1))
- **soba:** add CameraShake ([10bb6dd](https://github.com/nartc/angular-three/commit/10bb6dd7d60b7b50d162ad4fea9a483f53fdbbf6))
- **soba:** add Center ([c3288eb](https://github.com/nartc/angular-three/commit/c3288eb731865db123e491d4b5998ffc2c3b5cf4))
- **soba:** add Float ([b604ed5](https://github.com/nartc/angular-three/commit/b604ed5b5afeca7f0ef2e81327f35f296881562c))
- **soba:** add Sky ([1a07a52](https://github.com/nartc/angular-three/commit/1a07a52b09296ddd9e714fbdd1233ddaf9ad628a))
- **soba:** add Stage ([7ed8257](https://github.com/nartc/angular-three/commit/7ed82578ef09846ec68c8ff1490dcc6ce2335c87))

### Bug Fixes

- **core:** adjust how raw value is attached to the parent ([838a53c](https://github.com/nartc/angular-three/commit/838a53c0fbc9571917ad378684ffa67c2d216c5b))
- **core:** rename value attribute selector ([dd0aafc](https://github.com/nartc/angular-three/commit/dd0aafc7d455b52cc16efa15ca6dd6d16cb72d99))
- **core:** typo on objectHostRef ([29c8f20](https://github.com/nartc/angular-three/commit/29c8f20ea1b30884138f98eb94fc2879900b9793))
- **repo:** adjust value attribute selector ([2673039](https://github.com/nartc/angular-three/commit/2673039ade643124692a33e35eade16425c75ab1))
- **soba:** ensure instance is ready before effect for Bounds ([e65593c](https://github.com/nartc/angular-three/commit/e65593c358af287b8a6fd8fe0711aedd5cbb8054))

## [5.0.0-beta.24](https://github.com/nartc/angular-three/compare/5.0.0-beta.23...5.0.0-beta.24) (2022-04-28)

### Features

- **soba:** add Backdrop; add Spotlight ([be9937c](https://github.com/nartc/angular-three/commit/be9937c415173e75b58084ceed153278961116e8))

## [5.0.0-beta.23](https://github.com/nartc/angular-three/compare/5.0.0-beta.22...5.0.0-beta.23) (2022-04-27)

### Features

- **soba:** add Contact Shadows ([e6f795a](https://github.com/nartc/angular-three/commit/e6f795a2e8a6c72c96746d7ed4b10ea379bea0a3))

## [5.0.0-beta.22](https://github.com/nartc/angular-three/compare/5.0.0-beta.21...5.0.0-beta.22) (2022-04-27)

### Bug Fixes

- **soba:** use different syntax for rawloader ([36e86a4](https://github.com/nartc/angular-three/commit/36e86a40c443c9981ce1df6f345d5a95ee41c8c2))
- **soba:** use inline glsl for now ([ca2d6ec](https://github.com/nartc/angular-three/commit/ca2d6ec6294beee5b3608f913bd29177c5b679d2))

### Documentations

- adjust storybook config to include raw-loader ([b244b4d](https://github.com/nartc/angular-three/commit/b244b4d2b51be2043b19617a986fef70b04047bf))

## [5.0.0-beta.21](https://github.com/nartc/angular-three/compare/5.0.0-beta.20...5.0.0-beta.21) (2022-04-27)

### Features

- **soba:** add Environment ([87b771c](https://github.com/nartc/angular-three/commit/87b771cd65a9117d145e4718b3b73e23fc52a968))

### Bug Fixes

- **core:** add explicit states to have knowledge if an input is explicitly set on the host element ([b2aa965](https://github.com/nartc/angular-three/commit/b2aa965ac779e16c2b58d5dd0cd16e34cd553a8e))
- **core:** add type guard to is.obj ([c93ae5c](https://github.com/nartc/angular-three/commit/c93ae5cd0a2edbad45f30e0f5de8b82024da1231))
- **core:** adjust object passthrough to respect host Inputs if they're set explicitly ([38f2eea](https://github.com/nartc/angular-three/commit/38f2eeaf74f46fded584cc48a49bbd7ee2e5132d))
- **core:** make sure object pass through react to changes ([65fad4b](https://github.com/nartc/angular-three/commit/65fad4bd7582854c7119ee66c5d260f0b0597c1c))
- **environment:** fix environment background not changing ([0a59c68](https://github.com/nartc/angular-three/commit/0a59c68192cde518b3f64cf0d69ed66f1ae75bed))
- **soba:** adjust OrbitControls ([11f6059](https://github.com/nartc/angular-three/commit/11f6059af0fbd24a2032ba4940049bfd12705c57))
- **soba:** adjust the "use" API to be more reactive ([7afb377](https://github.com/nartc/angular-three/commit/7afb3778f170a7841fed1c98f9c02ade068fc3b3))
- **soba:** adjust typings in environment ([4724b32](https://github.com/nartc/angular-three/commit/4724b32bb7c9f98407e2a4e87d3a141534fa9c97))
- **soba:** make sure gizmo passthroughs react to changes ([aa59906](https://github.com/nartc/angular-three/commit/aa59906c6ebf6ca42898e08526efb2f6bbf873d5))

## [5.0.0-beta.20](https://github.com/nartc/angular-three/compare/5.0.0-beta.19...5.0.0-beta.20) (2022-04-26)

### Features

- **soba:** add Detailed ([43c5d13](https://github.com/nartc/angular-three/commit/43c5d13fde1158d58914a4f2a3d97b49f0d3f58d))
- **soba:** add Stars ([f961145](https://github.com/nartc/angular-three/commit/f961145455d60dc934d83e80c4c060a916121a0e))

### Bug Fixes

- **core:** material geometry object should ref instead of factory token ([3b8ff7d](https://github.com/nartc/angular-three/commit/3b8ff7d7a4b553d88a6622611b51f93fdb66f0d1))

## [5.0.0-beta.19](https://github.com/nartc/angular-three/compare/5.0.0-beta.18...5.0.0-beta.19) (2022-04-25)

### Features

- **soba:** add HTML ([0a54966](https://github.com/nartc/angular-three/commit/0a54966e82a5d386c18e367f4e63ca484b3b9ca6))
- **soba:** add Perspective Camera ([23bed47](https://github.com/nartc/angular-three/commit/23bed474e54f8e7ac80addea39b2d957480cf37d))

### Bug Fixes

- **core:** adjust attributes import list ([f011544](https://github.com/nartc/angular-three/commit/f0115449ee8b1447fe8927d6f8391f20a47f4ad5))
- **core:** setOptionsTriggers should be an Observable of {} ([a6d8368](https://github.com/nartc/angular-three/commit/a6d83686ab85868b0ffb9d1ecbedb866d34a7812))
- **soba:** orthographic camera clean up ([9099d6b](https://github.com/nartc/angular-three/commit/9099d6b86b6b61ff66cec0e0c058708fe9a1d0fb))
- **soba:** rework FBO and DepthBuffer to use Ref instead of returning Observable ([5b41119](https://github.com/nartc/angular-three/commit/5b411192d9795e65f05ec553a1d9d2c91c30a7a3))

### Documentations

- add first person controls story ([1bee9a2](https://github.com/nartc/angular-three/commit/1bee9a247aea9d9001755e4deda348635ae3d74c))
- add HTML stories ([68bed08](https://github.com/nartc/angular-three/commit/68bed0859edec028917726e6a9ddad214efdb52f))
- add orbit controls stories ([acc4c99](https://github.com/nartc/angular-three/commit/acc4c99a567012fe1625bcbb0587f85c2954a68b))

## [5.0.0-beta.18](https://github.com/nartc/angular-three/compare/5.0.0-beta.17...5.0.0-beta.18) (2022-04-25)

### Bug Fixes

- **core:** rename visible in object helper to helperVisible so it does not conflict with object ([2501f82](https://github.com/nartc/angular-three/commit/2501f8207f5404d03bb4c05617292d1f91cb4c58))

## [5.0.0-beta.17](https://github.com/nartc/angular-three/compare/5.0.0-beta.16...5.0.0-beta.17) (2022-04-25)

### Features

- **soba:** add first person controls ([bab2431](https://github.com/nartc/angular-three/commit/bab2431263e8119c0cce37351d03157ce615439b))
- **soba:** add fly controls ([7157617](https://github.com/nartc/angular-three/commit/71576178776dfa440f76a9b7495b0ea1b3cc4dce))
- **soba:** add transform controls ([407f1e7](https://github.com/nartc/angular-three/commit/407f1e7762262e3843cd01ba1b5241a967b9071c))

### Bug Fixes

- **core:** add visible input to object helper abstract ([4d594d1](https://github.com/nartc/angular-three/commit/4d594d1f98d68edd3e76b9ed628b7a8badd03e98))
- **soba:** adjust orbit controls ([efde280](https://github.com/nartc/angular-three/commit/efde28047443456d2a69ac7adeaa3d3bfec3206d))
- **soba:** adjust provider for orthographic camera ([69a7499](https://github.com/nartc/angular-three/commit/69a7499632422ff3f2dbc0650ecec18d599510d1))

### Documentations

- move assets to soba ([0e6b842](https://github.com/nartc/angular-three/commit/0e6b842146edfb8e2bbb5b5a6efdbece528afc96))

## [5.0.0-beta.16](https://github.com/nartc/angular-three/compare/5.0.0-beta.15...5.0.0-beta.16) (2022-04-25)

### Features

- **cannon:** add remove to API ([b9db190](https://github.com/nartc/angular-three/commit/b9db19040ac81626dc56921585c1ff5dbc180df8))
- **core:** initial work on portal ([8378bca](https://github.com/nartc/angular-three/commit/8378bca36e3e60e5087ae5fcfbe825e62ba8319d))
- **soba:** add gizmo viewport; finish gizmo helper story ([2b1b62f](https://github.com/nartc/angular-three/commit/2b1b62fd697e75fe9d80fe834cd99fc356310748))
- **soba:** initial work on portal and gizmo ([5ba8115](https://github.com/nartc/angular-three/commit/5ba8115a1045095792e48902d291c08928091afb))

### Bug Fixes

- **core:** add camera utils ([5ba363f](https://github.com/nartc/angular-three/commit/5ba363f1ad3e19c0a80b85642be0685577155806))
- **core:** adjust portal ([1a9dd10](https://github.com/nartc/angular-three/commit/1a9dd10908dc7daf096efaa08974f82f62987d0d))
- **core:** handle material array ([8f504c8](https://github.com/nartc/angular-three/commit/8f504c88e97b825ae1770efe7d76efc2d4eb2f7f))
- **soba:** adjust orthographic camera ([2af6704](https://github.com/nartc/angular-three/commit/2af6704153d42be458539acc0b9c73b9ea1dd184))
- **soba:** adjust orthographic camera to pass in args instead ([532f14c](https://github.com/nartc/angular-three/commit/532f14c98906eccf7ccfc8b60e5b817b88f3bfdd))

### Documentations

- add assets ([4f466e4](https://github.com/nartc/angular-three/commit/4f466e4b8962ea9f86b492e9fb41aa90ac725397))
- add gizmo helper stories ([9a90a89](https://github.com/nartc/angular-three/commit/9a90a897a251995856c287524963e96716109feb))
- experiment with multiple materials ([b434925](https://github.com/nartc/angular-three/commit/b43492543a340ce697561ead8fd2c97d677d9b8d))

## [5.0.0-beta.15](https://github.com/nartc/angular-three/compare/5.0.0-beta.14...5.0.0-beta.15) (2022-04-22)

### Features

- **cannon:** update ref for cannon ([3c52b78](https://github.com/nartc/angular-three/commit/3c52b78ffe898c694d437a1edc96eef47ec02ff2))
- **core:** change Ref to extends BehaviorSubject ([29b14ef](https://github.com/nartc/angular-three/commit/29b14ef280d6bdd627f02eeecb54bc2086c6cb94))
- **postprocessing:** update ref for postprocessing ([c1b1346](https://github.com/nartc/angular-three/commit/c1b1346c39df98e7fdad89b55e560fc525b1202a))
- **soba:** update ref for soba ([0cb05ac](https://github.com/nartc/angular-three/commit/0cb05acff05dbcf8a3e30bff01e34c9e6767f4c8))

### Bug Fixes

- **core:** make sure instance is set before trying to select it ([b01b037](https://github.com/nartc/angular-three/commit/b01b037e5922db6db6beced03a8d08e53f78c2a0))
- **postprocessing:** use instance.ref$ instead of instanc.value selector ([c57e885](https://github.com/nartc/angular-three/commit/c57e8851654898da4dc5ea2874d517a8cfe60e5d))

### Documentations

- add redirect for soba ([1ad13e8](https://github.com/nartc/angular-three/commit/1ad13e85decd13f9ada1b1b7651203096ef659b2))
- adjust build command ([6dfd715](https://github.com/nartc/angular-three/commit/6dfd715706b49d6bbc86b905b8e0aab9bb48d8f7))
- bring build command to packageJson script ([7d51931](https://github.com/nartc/angular-three/commit/7d51931083a71d68c47015c3496b5f4b58433d53))
- fix build command ([21ffd68](https://github.com/nartc/angular-three/commit/21ffd68b6b0d03c383007e1003df7bd4c87c3996))
- ignore broken links ([255874a](https://github.com/nartc/angular-three/commit/255874aca7177108099df4b324522b0023255e53))
- move soba from navbar to sidebars ([26bfa94](https://github.com/nartc/angular-three/commit/26bfa94bfef7852b175e14634e0cfcfee2141b50))
- move soba from sidebar to nav ([c2b51b2](https://github.com/nartc/angular-three/commit/c2b51b29c755342af524e8a458811829e07bf9a6))
- no frozen lockfile ([78ab7fd](https://github.com/nartc/angular-three/commit/78ab7fdf965788abd5e325f300136bb3db8cd1b3))
- put back real build docs command ([714a7be](https://github.com/nartc/angular-three/commit/714a7be647e989c496102af1aaa3ee43e50ebca5))
- remove useless redirect ([1d2210e](https://github.com/nartc/angular-three/commit/1d2210e18999df458f25e05103348523fd475f50))
- run pre script manually ([f4a379e](https://github.com/nartc/angular-three/commit/f4a379eb8c33f038e114e48c254bf1f66c016484))
- try different way to test CI flag ([e641958](https://github.com/nartc/angular-three/commit/e641958f349d7012eb1a2b266eadbd1e211d3413))
- try nx report ([4b3f067](https://github.com/nartc/angular-three/commit/4b3f0672884e674067e70d97203f3fa5db19a303))
- try pnpm ([7b66ccc](https://github.com/nartc/angular-three/commit/7b66ccc0585e095fada3690f196a1dc561186e9b))
- try using nx command instead ([719aa53](https://github.com/nartc/angular-three/commit/719aa531868473f998144c57744cf6712fb1f737))
- use html for external link ([0704069](https://github.com/nartc/angular-three/commit/07040699236d61e46b5f0738913481748a848949))
- use monday morning ([4f5f641](https://github.com/nartc/angular-three/commit/4f5f64103131a124032d972cdd631ac10efc3e2d))

## [5.0.0-beta.14](https://github.com/nartc/angular-three/compare/5.0.0-beta.13...5.0.0-beta.14) (2022-04-22)

### Features

- **core:** add object pass through directive ([edce727](https://github.com/nartc/angular-three/commit/edce7275bcea1de87063b5ed2fead1537695ce13))
- **soba:** implement all Lines ([38a22b4](https://github.com/nartc/angular-three/commit/38a22b48e3787fca85bb8c11e232d8c5c95739bd))

### Bug Fixes

- **billboard:** ensure billboard is a wrapper to Angular Three ([4a39e1b](https://github.com/nartc/angular-three/commit/4a39e1b6cbecb818c612e252352d68e0c6c1e5f4))
- **core:** add shouldPassThroughRef state to object inputs ([f096280](https://github.com/nartc/angular-three/commit/f096280f4952509f14d604334949b80b237f0be5))
- **core:** also provide ngtObject when provide object host ref ([66dda10](https://github.com/nartc/angular-three/commit/66dda102406df8a1511b7a0a5257119e1fc5668d))
- **core:** check for instance.value before destroy. if it's null, no need to destroy anything ([9686e5a](https://github.com/nartc/angular-three/commit/9686e5a284a5d8767acc9214361ccdf91b2ad0f8))
- **core:** clean up rootStateMap ([0e08255](https://github.com/nartc/angular-three/commit/0e0825517e8786ffd15c0b55874b86ae6417da28))
- **core:** move createLoop outside of Canvas component so that it only creates once ([cbd98ea](https://github.com/nartc/angular-three/commit/cbd98ea2179c7290be6601775659e3e047d22b53))
- **core:** only pass ref if shouldPassThroughRef is true (which is the default) ([7d50750](https://github.com/nartc/angular-three/commit/7d5075030f471ad5824367abfd4eafc0b1f33ae7))
- **soba:** adjust image ([a119f8d](https://github.com/nartc/angular-three/commit/a119f8d0884183aad047ca4b8ea577bc7712e2f6))
- **soba:** fix text ([de1d47d](https://github.com/nartc/angular-three/commit/de1d47dcc934801f9aaab2abfceeee5cfac0e124))
- **soba:** fix type of line geometry ([0e9f836](https://github.com/nartc/angular-three/commit/0e9f8368c5627990958e6221738cf02bb9540e99))
- **soba:** use object pass through ([ad86ebc](https://github.com/nartc/angular-three/commit/ad86ebc3b285da04bb65659c91d51903fd8e7912))

### Documentations

- add text story (remove custom material example) ([b822d54](https://github.com/nartc/angular-three/commit/b822d54d44cffd46ddb3bf47d71a88aadd3a6532))
- setup build storybook ([c90930f](https://github.com/nartc/angular-three/commit/c90930f70df53a7255de261b70e73f87f061e2b1))
- update line stories ([a07d7fe](https://github.com/nartc/angular-three/commit/a07d7fe81c13e31b57306f9ad16a519b9ac718e5))

## [5.0.0-beta.13](https://github.com/nartc/angular-three/compare/5.0.0-beta.12...5.0.0-beta.13) (2022-04-20)

### Bug Fixes

- **core:** adjust **ngt**.objects to be a Ref of array for observability ([8c68283](https://github.com/nartc/angular-three/commit/8c6828375293c1a41eda6364f5ee9bbd252f24bc))
- **core:** initialize stats once in constructor ([2358035](https://github.com/nartc/angular-three/commit/2358035a8fb620b963c0de71198806267ee8316f))
- **postprocessing:** update effectPassParams$ ([ac2cdff](https://github.com/nartc/angular-three/commit/ac2cdff43120f901cec1aafc2a3189274c8c09c2))

### Documentations

- add keenbloom ([ba01877](https://github.com/nartc/angular-three/commit/ba01877420cc6d7ed3ef9eab8527169f924cff0e))

## [5.0.0-beta.12](https://github.com/nartc/angular-three/compare/5.0.0-beta.11...5.0.0-beta.12) (2022-04-20)

### Bug Fixes

- **core:** adjust camera initialization; clean up logic ([18353a1](https://github.com/nartc/angular-three/commit/18353a1107220fd24900236344cf700b34d6ee7f))
- **core:** clean up rootStateMap on destroy ([19056b6](https://github.com/nartc/angular-three/commit/19056b60a1d3bf31add88b21c5c7dbd114a0ea5c))
- **core:** ensure to only add the instance to parent objects if it's attachable ([4fd6099](https://github.com/nartc/angular-three/commit/4fd6099f450974939b772d23bdc43dc28e651f19))
- **core:** ensure to use ref.value if a prop is a ref in applProps ([7e83c4c](https://github.com/nartc/angular-three/commit/7e83c4c7e07ed357c9aef706bdc11639b643d30b))
- **core:** handle parent and parent host automatically ([2e8f0a1](https://github.com/nartc/angular-three/commit/2e8f0a145bc5756478d540580bb9730d3e44d558))
- **soba:** adjust billboard ([4525441](https://github.com/nartc/angular-three/commit/452544144a17562de863e758cb75aca5d2fd56a4))
- **soba:** fix text; add storybook ([261c48d](https://github.com/nartc/angular-three/commit/261c48dead41e3e463404028b1e7f665928efad7))
- **soba:** make sure to set the camera one last time before creating orbit controls ([cca6a72](https://github.com/nartc/angular-three/commit/cca6a72443a9554977457a046988aaaa82e403d7))
- **soba:** use outputEncoding for texture ([0a2c54b](https://github.com/nartc/angular-three/commit/0a2c54bb4e44e5331323318a26d40de3f1f82ad8))

### Documentations

- add clearer example of useOntemplate ([888e623](https://github.com/nartc/angular-three/commit/888e6239c859aeca42555dfd1412f271c1bf5742))
- more documentations on core and cannon ([61215ab](https://github.com/nartc/angular-three/commit/61215ab7817c5b5cadc04d5167a648ec1c00281b))
- use tomato for physic cube color to match docs ([d172b41](https://github.com/nartc/angular-three/commit/d172b41234ce060d501935e1eba8cc7242ee6015))

## [5.0.0-beta.11](https://github.com/nartc/angular-three/compare/5.0.0-beta.10...5.0.0-beta.11) (2022-04-19)

### Features

- **cannon:** consolidate api into cannon entry point; add raycast, spring, and raycastvehicle ([974a243](https://github.com/nartc/angular-three/commit/974a243b3dc544d8a23ca1cc8fb1edad3143b77a))

## [5.0.0-beta.10](https://github.com/nartc/angular-three/compare/5.0.0-beta.9...5.0.0-beta.10) (2022-04-19)

### Bug Fixes

- **postprocessing:** remove uneccessary empty projector fn ([224d765](https://github.com/nartc/angular-three/commit/224d765ab5ba34df23b116d0e1ce500da164fa82))

### Documentations

- fix broken link ([b47d4fd](https://github.com/nartc/angular-three/commit/b47d4fd23d698d0c183c089fffa20ddc789cbd2f))
- more docs on ComponentStore and Store usages ([d80d152](https://github.com/nartc/angular-three/commit/d80d152bcf69df3a2a3b0c26d9d9e71d1a0957d9))

## [5.0.0-beta.9](https://github.com/nartc/angular-three/compare/5.0.0-beta.8...5.0.0-beta.9) (2022-04-19)

### Features

- **core:** add global callbacks ([307b2e3](https://github.com/nartc/angular-three/commit/307b2e3f29cad53d5a58859079be8c32a8723c9a))

### Bug Fixes

- **cannon:** body makes the blank object an instance ([7d3dfa8](https://github.com/nartc/angular-three/commit/7d3dfa83c6636f44d1931bee8c187ee2f2b06325))
- **core:** consolidate check update logic for both instance and parentInstance ([6d081a1](https://github.com/nartc/angular-three/commit/6d081a170ebc7b0d9f96cec2824b408c73aae79c))
- **core:** have material and geometry set their own default attach instead of checking in instance ([7e27691](https://github.com/nartc/angular-three/commit/7e27691f2cccbf7cb50b86708d2c05ef0c06a09f))
- **core:** make appendTo accept THREE.Object3D as well ([1949685](https://github.com/nartc/angular-three/commit/1949685e5029fbf3505fd850d50061a96219e88e))
- **core:** make obj in BeforeRenderRecord accept a ref instead of a factory ([a18bec1](https://github.com/nartc/angular-three/commit/a18bec1481af53fda2c9c07f23b8e68635c0ee05))
- **core:** make stats independent of canvas ([8128e60](https://github.com/nartc/angular-three/commit/8128e601f582f47d511979edb9260279901de488))
- **core:** primitive should have isPrimitive set to true ([6393536](https://github.com/nartc/angular-three/commit/6393536231b785ff9829705af2d467fbe72d680c))
- **core:** remove parent-object di ([efafe7e](https://github.com/nartc/angular-three/commit/efafe7e432b145cd5b8265d3268bafde091dc025))
- **core:** use skipParent getter instead ([956f225](https://github.com/nartc/angular-three/commit/956f225ce2859758beb33ba9d6082005810f026f))
- **repo:** set default attach properly ([0a88928](https://github.com/nartc/angular-three/commit/0a88928843ea6c764ca87685dc3a53f437685ddf))
- **repo:** use preInit correctly to set default state ([23e695e](https://github.com/nartc/angular-three/commit/23e695eaae3172aaa1c0c5428adc426bc88aceae))

### Documentations

- clean up example ([992d86f](https://github.com/nartc/angular-three/commit/992d86f8bf8095b08ad6f4081a6deb21abf99160))
- clean up example ([a90933f](https://github.com/nartc/angular-three/commit/a90933fceaf1d20da4c0781ccc365a1862d9836a))
- finish core API docs ([56c4665](https://github.com/nartc/angular-three/commit/56c4665b7d6872976844348004b433f134859430))
- more docs ([9e7f177](https://github.com/nartc/angular-three/commit/9e7f1771518f9bfa9ad315964ce25119b976e6a6))

## [5.0.0-beta.8](https://github.com/nartc/angular-three/compare/5.0.0-beta.7...5.0.0-beta.8) (2022-04-18)

### Bug Fixes

- **core:** check for parentInstance before checking if it's object3d ([34cfd65](https://github.com/nartc/angular-three/commit/34cfd65de67944d9b2c395f454a8b4ca8bc7db32))

## [5.0.0-beta.7](https://github.com/nartc/angular-three/compare/5.0.0-beta.6...5.0.0-beta.7) (2022-04-18)

### Bug Fixes

- **core:** all Scene objects will have dispose nullified ([ce88b08](https://github.com/nartc/angular-three/commit/ce88b08b6b5932c595c761ac8e2f47c46aa7cbdc))

## [5.0.0-beta.6](https://github.com/nartc/angular-three/compare/5.0.0-beta.5...5.0.0-beta.6) (2022-04-18)

### Features

- **core:** remove size and clock inputs on canvas ([2f81334](https://github.com/nartc/angular-three/commit/2f81334e27e2991890097ebc45a86c1971f7e384))

### Bug Fixes

- **core:** ensure dispose is called with the instance ([49ff57c](https://github.com/nartc/angular-three/commit/49ff57c678c703cbf8b4d154e99b6e5043f60283))
- **core:** nullify THREE.Scene dispose function as it's removed ([34facd0](https://github.com/nartc/angular-three/commit/34facd099f5eb877cb7a17be112541e6268d49c7))

### Documentations

- more docs ([eb960f8](https://github.com/nartc/angular-three/commit/eb960f804371f89c30942b3375432aa6c78f8677))

## [5.0.0-beta.5](https://github.com/nartc/angular-three/compare/5.0.0-beta.4...5.0.0-beta.5) (2022-04-18)

### Bug Fixes

- **core:** adjust cameras to use NumberInput ([f0ef280](https://github.com/nartc/angular-three/commit/f0ef280f3a00597435c73f20d0f7c5fb6f172e9d))
- **core:** adjust cube camera to use NumberInput ([d864c4d](https://github.com/nartc/angular-three/commit/d864c4d223f1eda72268a657feaedb23a7514dbd))
- **core:** adjust helpers to use NumberInput ([109a8d0](https://github.com/nartc/angular-three/commit/109a8d07cb999cee65bbd4ef51f6068e78919e20))
- **core:** adjust lights to use NumberInput ([bb1c80f](https://github.com/nartc/angular-three/commit/bb1c80f0ecbebc7cb68dd7d20ecbb854ef285d55))
- **core:** adjust textures to use NumberInput ([cd82c60](https://github.com/nartc/angular-three/commit/cd82c60a149261d924ec6c5cae58b7a58aa5be79))
- **core:** adjust three abstracts to use NumberInput ([1122e23](https://github.com/nartc/angular-three/commit/1122e2335d0fb76b86927c6059fb932a663688d3))
- **postprocessing:** use NumberInput ([c443bc9](https://github.com/nartc/angular-three/commit/c443bc9b93a581ae9b626bacebcfeb6c74e1121e))
- **soba:** adjust orbit controls to use NumberInput ([e48a504](https://github.com/nartc/angular-three/commit/e48a504123c55430b7bd517e3ecbf8eaf8efb39e))
- **soba:** use NumberInput ([156a849](https://github.com/nartc/angular-three/commit/156a849a12ff7a3bba7127ac28531ed4fdc741ff))

### Documentations

- adjust sandbox to use NumberInput ([2d0f43c](https://github.com/nartc/angular-three/commit/2d0f43c4bfce24728d0b092938b52d5c48a56409))

## [5.0.0-beta.4](https://github.com/nartc/angular-three/compare/5.0.0-beta.3...5.0.0-beta.4) (2022-04-18)

### Features

- **repo:** registerBeforeRender now returns a function used to clean up instead of the uuid ([1fef6b9](https://github.com/nartc/angular-three/commit/1fef6b9f9348d016ff4bfa12f395824bc5841e75))

### Bug Fixes

- **cannon:** make sure preInit runs correctly ([acf6c5c](https://github.com/nartc/angular-three/commit/acf6c5c8ec7d5338c3ef72c457c56b95d64ba363))

### Documentations

- more docs work ([8edb425](https://github.com/nartc/angular-three/commit/8edb425817f6547b9739e9057f1ae38f2fd87eac))

## [5.0.0-beta.3](https://github.com/nartc/angular-three/compare/5.0.0-beta.2...5.0.0-beta.3) (2022-04-18)

### Bug Fixes

- **repo:** use is.arr instead of Array.isArray ([e03837f](https://github.com/nartc/angular-three/commit/e03837f88e919dbaf102f80c219114ee9ea58349))
- **repo:** use NumberInput for number inputs ([16895e6](https://github.com/nartc/angular-three/commit/16895e66e81a4ebeae2ed22c865588991b8ed282))

### Documentations

- adjust kinematic cube example to use beforeRender instead ([4560b39](https://github.com/nartc/angular-three/commit/4560b396073ad7cf538fbf21ba287916fba7f43c))

## [5.0.0-beta.2](https://github.com/nartc/angular-three/compare/5.0.0-beta.1...5.0.0-beta.2) (2022-04-18)

### Bug Fixes

- **core:** add missing argsKeys for instanced mesh. count wasn't taken into account ([7085cc0](https://github.com/nartc/angular-three/commit/7085cc01b7aa368c7b238385b26c3fac630146cc))

### Documentations

- add kinematic cube example ([8166c0f](https://github.com/nartc/angular-three/commit/8166c0fe60ebe409332f6ecd507d76b7a6473886))

## [5.0.0-beta.1](https://github.com/nartc/angular-three/compare/5.0.0-beta.0...5.0.0-beta.1) (2022-04-18)

### Features

- **core:** mark color, fog, math, and vector pipes as deprecaations ([e893376](https://github.com/nartc/angular-three/commit/e8933761c77858a501bec069f9e6b53c8a92b426))
- **core:** remove NgtDestroyed ([294e181](https://github.com/nartc/angular-three/commit/294e1817fdcbf2db490fd0054d2696acc126462b))

### Bug Fixes

- **core:** use object.destroy$ for cursor ([a18836e](https://github.com/nartc/angular-three/commit/a18836e5c5917ca7acefa25800d6369ea65151e2))

### Documentations

- add docusaurus ([de5c557](https://github.com/nartc/angular-three/commit/de5c55784bb4356e41715abd8eba7ecf76e4ed36))
- start on docusaurus ([c319ed8](https://github.com/nartc/angular-three/commit/c319ed8a79232c08625752187561989619bd947c))

## [5.0.0-beta.0](https://github.com/nartc/angular-three/compare/4.5.0...5.0.0-beta.0) (2022-04-17)

### ⚠ BREAKING CHANGES

- **core:** - Core instances are rewritten

### Features

- **cannon:** adjust bodies and constraints ([7b7bf5b](https://github.com/nartc/angular-three/commit/7b7bf5be3adb4754fb7dcdab80ac7e7ec3f44fce))
- **cannon:** adjust Debug ([4cdd666](https://github.com/nartc/angular-three/commit/4cdd666d777021889965922ce6c2efed0fe82596))
- **cannon:** adjust Physic Bodies ([03c9fce](https://github.com/nartc/angular-three/commit/03c9fcea8a547789fd6989214949264f1154e69d))
- **cannon:** adjust physics constraint abstract ([d209d40](https://github.com/nartc/angular-three/commit/d209d4010304a5950360aecedfc39702d544245f))
- **cannon:** integrate bodies with constraints ([b73f71a](https://github.com/nartc/angular-three/commit/b73f71a94cba3a475e3844ec7bcf8e34bf69f025))
- **cannon:** switch to use service based API for Body ([58c327c](https://github.com/nartc/angular-three/commit/58c327cfaa4e71e65c45c0f7157e02c78cfd7886))
- **cannon:** switch to use service based API for Constraint ([289938a](https://github.com/nartc/angular-three/commit/289938ad3b182756d965789f5e3f90e467a32708))
- **cannon:** use pmndrs cannon worker api ([b5a83fa](https://github.com/nartc/angular-three/commit/b5a83fa00333dda3cf5ede6536fefd4040a2e239))
- **core:** add coerce number ([aa342ff](https://github.com/nartc/angular-three/commit/aa342ffd0f7745fb755b53a80bf3a898f91caeda))
- **core:** add is() utility ([0875052](https://github.com/nartc/angular-three/commit/08750521ef12041493937b46d052d27d639b6bcc))
- **core:** add light shadow abstract ([93eda29](https://github.com/nartc/angular-three/commit/93eda2978c5d134d2ab432dddb312d7b99903c82))
- **core:** add noAttach input to instance so geometry and material can opt out of auto attaching ([ba9263b](https://github.com/nartc/angular-three/commit/ba9263be6e99fada7ed11f4fd9881448484afd1c))
- **core:** add optional factory to all DI provide utility ([021c88d](https://github.com/nartc/angular-three/commit/021c88db5ccb1668d5e219c53199cacd6f2ddf71))
- **core:** add preInit and postInit hooks to instance ([1802443](https://github.com/nartc/angular-three/commit/18024433c15bb12deed56e2ec35a9a588c98c4bc))
- **core:** add vector3 check to is util ([7f50d0f](https://github.com/nartc/angular-three/commit/7f50d0f7cc83c3bd0f66bca748b29963e331994c))
- **core:** adjust attributes ([5189eee](https://github.com/nartc/angular-three/commit/5189eeef1029a86311b863b73b0def4270edf899))
- **core:** adjust attributes ([767a83c](https://github.com/nartc/angular-three/commit/767a83c8bd5e5db2900312b426b76a3b1a9ded80))
- **core:** adjust AudioListener ([f572b84](https://github.com/nartc/angular-three/commit/f572b84c0391530a942e03115219e9563ddb0ac7))
- **core:** adjust audios ([bd786c9](https://github.com/nartc/angular-three/commit/bd786c96569914afffd10e5718e0e6b594af03e3))
- **core:** adjust cameras ([56d437b](https://github.com/nartc/angular-three/commit/56d437b4059b5f4d7908af28076ccf20ce14b9b4))
- **core:** adjust Cameras ([2de2333](https://github.com/nartc/angular-three/commit/2de2333141d45791270f83a1fbd08054c75dbc8a))
- **core:** adjust CubeCamera ([1038d68](https://github.com/nartc/angular-three/commit/1038d68dc4ccbe1305246e5bee89435e5e21960a))
- **core:** adjust curves ([97d6a1c](https://github.com/nartc/angular-three/commit/97d6a1cf05b7e52dd31f6faedc3ec8ebee93a543))
- **core:** adjust Curves ([9d1d9d1](https://github.com/nartc/angular-three/commit/9d1d9d13ad9c78b7db7b5b8c8975a47cc541ed55))
- **core:** adjust geometries ([64c4c32](https://github.com/nartc/angular-three/commit/64c4c326a9af10e0fd7b151c343bd20269b6b46d))
- **core:** adjust geometries ([ebb93a1](https://github.com/nartc/angular-three/commit/ebb93a185adcb861013f9cf51ac8320a168c57db))
- **core:** adjust group ([68f5037](https://github.com/nartc/angular-three/commit/68f5037b788078fbc227add1a5ca8308044e81f3))
- **core:** adjust Group ([c972115](https://github.com/nartc/angular-three/commit/c972115b95ee0c07787eb1bb3f873200368fadce))
- **core:** adjust helpers ([f13bd61](https://github.com/nartc/angular-three/commit/f13bd618cc8c7efbab54d327450c5eb39645f07d))
- **core:** adjust Helpers ([1f630f6](https://github.com/nartc/angular-three/commit/1f630f6c4c033013ec319691a02f4aeef7dc9856))
- **core:** adjust instance to be more responsible; less overhead downstream for other object types ([9763a8b](https://github.com/nartc/angular-three/commit/9763a8b3f12c11f2c829b6afda2795e34724bf34))
- **core:** adjust instance to start out as a BehaviorSubject instead ([9b366c6](https://github.com/nartc/angular-three/commit/9b366c624760d597789ec92bd440f0966114098f))
- **core:** adjust lights ([57e16cc](https://github.com/nartc/angular-three/commit/57e16cc67a2f1561d2bc175b408f204d20a2470e))
- **core:** adjust Lights ([4198eda](https://github.com/nartc/angular-three/commit/4198edaa2995216a0037da622d3bcd9c26ab8a14))
- **core:** adjust Lines ([1ea848f](https://github.com/nartc/angular-three/commit/1ea848f5043eb4d4c54c53226616f3948e6e76b7))
- **core:** adjust LOD ([f03f51f](https://github.com/nartc/angular-three/commit/f03f51f73b9bc4c5855b4367a212c1abe19a1223))
- **core:** adjust LOD ([f420839](https://github.com/nartc/angular-three/commit/f420839a32093d652db600556be96a8f07d95d2e))
- **core:** adjust materials ([a1f7eda](https://github.com/nartc/angular-three/commit/a1f7edadf0c362b4f90a682b0fcba5735f68cf44))
- **core:** adjust materials ([9167fa6](https://github.com/nartc/angular-three/commit/9167fa692412b17ae5de00f867ef8ccb565667b2))
- **core:** adjust Materials ([1d78ed8](https://github.com/nartc/angular-three/commit/1d78ed8ea29246cd6e07f718061f023ed2935e12))
- **core:** adjust mesh and instanced mesh ([47f7f1b](https://github.com/nartc/angular-three/commit/47f7f1bd6055e8467428e183b79f6c634c67368b))
- **core:** adjust Meshes ([559981e](https://github.com/nartc/angular-three/commit/559981e892daac6880d75fa188b766e5e06e85fd))
- **core:** adjust points ([4497a9e](https://github.com/nartc/angular-three/commit/4497a9ef7b30b1e7e96c707f1325c7608423eca4))
- **core:** adjust primitive ([2ab54da](https://github.com/nartc/angular-three/commit/2ab54dab599e7c6c27715c2ce28dae90cd843a7d))
- **core:** adjust Primitive ([499f000](https://github.com/nartc/angular-three/commit/499f000d38e4f26afcfafa3676e274dd62ea5099))
- **core:** adjust skinned mesh ([7a6372e](https://github.com/nartc/angular-three/commit/7a6372e4c8d01c406715591337a56a022995b345))
- **core:** adjust Sprites ([4b4ace4](https://github.com/nartc/angular-three/commit/4b4ace490880023ba1358a123a21c48b2796b5ec))
- **core:** adjust stats ([b387b98](https://github.com/nartc/angular-three/commit/b387b9838b857be74b9b87c8c4777383af8b30b9))
- **core:** adjust Textures ([818c73f](https://github.com/nartc/angular-three/commit/818c73f2a1d01b8db263733af722f84418e5708b))
- **core:** expose getters for inputs ([d1fdb43](https://github.com/nartc/angular-three/commit/d1fdb435ac7fe76b744df9ae47df82de2465bdd9))
- **core:** finish core ([bac3147](https://github.com/nartc/angular-three/commit/bac314796dbde06cc50884b2dc2373e23c0c6823))
- **core:** introduce Ref concept to pass Object around easier ([f757dac](https://github.com/nartc/angular-three/commit/f757dac4655a35e3f98a0fc52f1b8c21d97e716e))
- **core:** make component-store projector optional ([8967002](https://github.com/nartc/angular-three/commit/8967002ae32f4e0c5ff10a66632eb6b4115a32fe))
- **core:** make materialGeometryState accepts refs of material and geometry instead ([5ce0ff0](https://github.com/nartc/angular-three/commit/5ce0ff07113411b8a8236f3712303eb551e1c3ea))
- **core:** remove controllers ([60eccae](https://github.com/nartc/angular-three/commit/60eccae28b59885695dd3f39df25930650819408))
- **core:** rewrite core instances ([b967939](https://github.com/nartc/angular-three/commit/b96793963dc5e6e801bb71cebf40fdccba7ab91f))
- **core:** use beforeRender instead of animateReady; deprecate animateReady ([50ebf41](https://github.com/nartc/angular-three/commit/50ebf41145939d8acb70131447110f1edeedda80))
- **core:** use both factory for ref ([04bcae5](https://github.com/nartc/angular-three/commit/04bcae5a21f50285b8a9c55c9d097d62e7b89a85))
- **core:** use Ref instead of Factory ([8b28164](https://github.com/nartc/angular-three/commit/8b281648c6d3dd79047e48217a4dac83257a8f14))
- **postprocessing:** adjust DepthOfField ([aceb2cf](https://github.com/nartc/angular-three/commit/aceb2cf5ec1ec8333f60365e495def614bf3d45e))
- **postprocessing:** adjust EffectComposer and abstract Effect ([2c8aeb6](https://github.com/nartc/angular-three/commit/2c8aeb67440f35d9a1a77441d981248060c4ffce))
- **postprocessing:** adjust effects ([fed3ab9](https://github.com/nartc/angular-three/commit/fed3ab929432071ca86b01c1f0396c4aee39ca85))
- **postprocessing:** adjust SSAO ([4cd50e6](https://github.com/nartc/angular-three/commit/4cd50e66b150bd3fddd3bfccab117a61fb74238f))
- **postprocessing:** move adjustCtorParams and ctorParams$ to instanceo ([ab20ddf](https://github.com/nartc/angular-three/commit/ab20ddfedb3e40896f8b6108fe8280b21fbf7c27))
- **postprocessing:** update postprocessing to use ref ([6fba539](https://github.com/nartc/angular-three/commit/6fba539d14fee40a84627f4d8126d0761c0391b1))
- **soba:** adjust Billboard ([190c8c4](https://github.com/nartc/angular-three/commit/190c8c47c139f7f8b88b14a0e0cf0a7bb45e5ba4))
- **soba:** adjust GradientTexture ([39a999f](https://github.com/nartc/angular-three/commit/39a999fb51c1624e42b789211528144c504e6afa))
- **soba:** adjust Image ([c5659de](https://github.com/nartc/angular-three/commit/c5659deab0220cced248464887ff6b10e6e72286))
- **soba:** adjust loaders ([02dbfb7](https://github.com/nartc/angular-three/commit/02dbfb7868787cd1eefea7f8842b16c9009f3b35))
- **soba:** adjust OrthographicCamera ([8ff5a30](https://github.com/nartc/angular-three/commit/8ff5a30d5b15f8f1b15ac13267c3288488792b38))
- **soba:** adjust Text ([8916320](https://github.com/nartc/angular-three/commit/8916320bfd7a0e11634ecabcfb1dad27081c1415))
- **soba:** make soba buildable for now ([b42f235](https://github.com/nartc/angular-three/commit/b42f2354f9150a8d5b8f03174f2bdfa3a6fbe570))

### Bug Fixes

- **cannon:** a ref doesn't have to be a instance ([fa74fc2](https://github.com/nartc/angular-three/commit/fa74fc2d04dc127078e07ec795130ba11303ef85))
- **cannon:** add additional flag (useOnTemplate) to body to help with initializing empty object3d ([b6b14a5](https://github.com/nartc/angular-three/commit/b6b14a5d3b0103bdbd2d7b5509edcc4e19131abe))
- **cannon:** add provider for physics body ([0d0a6f2](https://github.com/nartc/angular-three/commit/0d0a6f210fb0513eb83169c03c3d656b76f15a3d))
- **cannon:** adjust cannon to use ref ([5439050](https://github.com/nartc/angular-three/commit/5439050ae7ae9aa32e15499d4c299696ae9fa1cd))
- **cannon:** adjust timing for constraint and body initialization ([c77abd8](https://github.com/nartc/angular-three/commit/c77abd8dadc9cb9585047c5b9863638d6f29ee30))
- **cannon:** adjust uuid to use makeId() in Constraint ([385d9b9](https://github.com/nartc/angular-three/commit/385d9b9b2d7b4179fa844495e8dec62780f968c4))
- **cannon:** apply Ref concept for Debug ([8ef8e46](https://github.com/nartc/angular-three/commit/8ef8e467d8574b17277727515cd8cb8c0d140281))
- **cannon:** export PhysicBodyReturn interface ([0b32a40](https://github.com/nartc/angular-three/commit/0b32a4019fba48338047bc515a164ba39d20f893))
- **cannon:** make sure to set the worker in the store ([84fc1a2](https://github.com/nartc/angular-three/commit/84fc1a29665bc9cced6ab5cb9d2385c72aeea79f))
- **cannon:** remove skip(1) but it's a little bit messy ([cb367ea](https://github.com/nartc/angular-three/commit/cb367eaaa8b1c726fca0228f37b0116409b5fa3b))
- **core:** add reconstruct flag so the consumers and other sub classes can determine whether to reconstruct an object ([3aeebb1](https://github.com/nartc/angular-three/commit/3aeebb1c8ae53e7524c7c5322e5da7192ada9c06))
- **core:** add record type to ngtObjectState ([513d694](https://github.com/nartc/angular-three/commit/513d694d480c3e696e17d9a2dd4de3996ec12e84))
- **core:** adjust audio abstract ([6e22816](https://github.com/nartc/angular-three/commit/6e22816e9621f31ffbf694eaababc6f73400be7e))
- **core:** adjust AudioListener ([7a39a0f](https://github.com/nartc/angular-three/commit/7a39a0f5dbbe16a89675c4577dca25dd7796a580))
- **core:** adjust audiolistener using ref ([60dd9fc](https://github.com/nartc/angular-three/commit/60dd9fc5fe497c0905cdcfaa1d22fb3ed4c0197f))
- **core:** adjust camera abstract ([5e010c0](https://github.com/nartc/angular-three/commit/5e010c04bd42dc649b8af4ad85bb85748b9a9920))
- **core:** adjust cube camera to add inputs ([a7a9a10](https://github.com/nartc/angular-three/commit/a7a9a105a4c261940a95320e90693a3207fcea98))
- **core:** adjust CubeCamera ([619155c](https://github.com/nartc/angular-three/commit/619155c309beb34b9d0ffee38c62f192578ad58b))
- **core:** adjust cursor directive ([7dba594](https://github.com/nartc/angular-three/commit/7dba5947718257184098090a7ef6ed2d3ebc55be))
- **core:** adjust helper di and abstract ([67ecd8d](https://github.com/nartc/angular-three/commit/67ecd8d2fdcd5fd2db0f553f87eaa7c7e91e4ee2))
- **core:** adjust instance host and object host to return correctly for hostFactory ([2919f59](https://github.com/nartc/angular-three/commit/2919f5945cadd24cb84c374d2b59d7ce2b80bc1f))
- **core:** adjust instance set options ([80340ba](https://github.com/nartc/angular-three/commit/80340bad2ba17576cfe4b8ca43a09533ba8e0298))
- **core:** adjust light abstract and di ([3750ef3](https://github.com/nartc/angular-three/commit/3750ef39eac3890897b60f71e0b148238f6cd36f))
- **core:** adjust lights ([a722d0a](https://github.com/nartc/angular-three/commit/a722d0aca346e2395f033e806781a29d2a4dbc59))
- **core:** adjust line abstract ([6556d24](https://github.com/nartc/angular-three/commit/6556d249b7687cf6115cda086b4966ce8c35b0c6))
- **core:** adjust make function ([503bfb7](https://github.com/nartc/angular-three/commit/503bfb7e4d98a2bb1595a9851480832f9bc680ef))
- **core:** adjust material geometry abstract ([7a5fe2a](https://github.com/nartc/angular-three/commit/7a5fe2ad5a42b3ca908cf875156d67bb7b47b725))
- **core:** adjust primitive attributes ([6b0be6d](https://github.com/nartc/angular-three/commit/6b0be6d98c3d85e1499a1644777ff9007b7efe39))
- **core:** adjust propertyToAttach on ngtInstance ([143aa5c](https://github.com/nartc/angular-three/commit/143aa5c7e2685f2d6399e07ccc6aab27b27f98b0))
- **core:** adjust Sprite DI ([991125e](https://github.com/nartc/angular-three/commit/991125e38a851ce8be3a92d0295dca4dd38275d9))
- **core:** adjust texture abstract ([005f384](https://github.com/nartc/angular-three/commit/005f38498b63622a75a01ed9db2b10eb1ac64afe))
- **core:** adjust type for instance internal ([97a1e8b](https://github.com/nartc/angular-three/commit/97a1e8b8a801dde971da417bf14fbf72dd67d4fc))
- **core:** all materials use BooleanInput ([b34f8f9](https://github.com/nartc/angular-three/commit/b34f8f9a1c2238b1a08fcc4437a3585a50b8e0a6))
- **core:** any ([57a34ed](https://github.com/nartc/angular-three/commit/57a34ed96b95399ef9b8b2d4f875b24db9961732))
- **core:** call instance.ngOnInit first ([4cca5bc](https://github.com/nartc/angular-three/commit/4cca5bcfc2604a9735a9aa4764c9923800c23509))
- **core:** fix circular deps in mutate ([34ded90](https://github.com/nartc/angular-three/commit/34ded90c76c198188255b6fba87c4ce6fc1f5b43))
- **core:** fix material set values to ignore undefined ([22a4ae0](https://github.com/nartc/angular-three/commit/22a4ae0074363d4ee6705c3657c8bff6c59b5026))
- **core:** if instance is not Object3D, push it to parentInstance objects array ([9dbbf5c](https://github.com/nartc/angular-three/commit/9dbbf5c418d5895da83a655ffeaad391cd1d337c))
- **core:** make material accepts multiple inputs instead of parameters object ([cdc0c4b](https://github.com/nartc/angular-three/commit/cdc0c4bfc291073e2abe3305cca477deaa9ac312))
- **core:** merge previous instance when preparing instance ([00ea3e5](https://github.com/nartc/angular-three/commit/00ea3e599507686edecf7b9d59272f86fe4f215c))
- **core:** object should inject OBJECT FACTORY as parent ([ab908c3](https://github.com/nartc/angular-three/commit/ab908c331ece0cb833ec4332f7722ef631e50791))
- **core:** put back materialParameters but deprecate it ([d8e4cd6](https://github.com/nartc/angular-three/commit/d8e4cd6451c78b1b1ae0864c3315abff648aed7c))
- **core:** remove light shadow as it's not supposed to be called directly ([9849736](https://github.com/nartc/angular-three/commit/9849736472cad2b30d6a9096a1d8613ad02654e0))
- **core:** remove unused ref() getter ([99ed816](https://github.com/nartc/angular-three/commit/99ed8162e3afb3dbb59ba28e91a821054e00daa8))
- **core:** remove wrapper ([d5a4e43](https://github.com/nartc/angular-three/commit/d5a4e4311ccb7448c5a3f7c93372a80732a79c77))
- **core:** rename object getter to object3d ([016e864](https://github.com/nartc/angular-three/commit/016e8641eca359492b206007fb111f2611a35daa))
- **core:** update camera projection matrix if apply props ([ac8ba81](https://github.com/nartc/angular-three/commit/ac8ba81f331546866c3e0ca2884f25b623849048))
- **core:** use BooleanInput and coercion for boolean inputs ([2f2f9f3](https://github.com/nartc/angular-three/commit/2f2f9f3550e59f3c2725e763597d52d8ac56e459))
- **soba:** adjust abstractions ([6eaa3e4](https://github.com/nartc/angular-three/commit/6eaa3e408f2b4d799c096b8bf0d77e573eca2c52))

### Documentations

- add sandbox ([eb12ac5](https://github.com/nartc/angular-three/commit/eb12ac5450a642111875cd155592ab4274a75c80))
- add sandbox ([7f9c875](https://github.com/nartc/angular-three/commit/7f9c875621ac3fdb5997d034937605d8ebe96ddb))
- display physics cube ([850b2e8](https://github.com/nartc/angular-three/commit/850b2e898e9b579b4efc0c27bbfa760f33e9ac9f))
- finish monday morning example ([f250d12](https://github.com/nartc/angular-three/commit/f250d12fdc58db11d94ef43db883ef09f3e3384f))
- **repo:** add simple physics example ([17f1637](https://github.com/nartc/angular-three/commit/17f1637edd036039bf4be669bb42d1f4fe1f8771))
- use cubes ([9030092](https://github.com/nartc/angular-three/commit/903009286621a542ba5ce21ea1737b71117b8414))
- use orbit controls ([8cad2a5](https://github.com/nartc/angular-three/commit/8cad2a556368eb4a117a82a44a2038ae7ca3c90b))
- wip monday-morning ([e69b23f](https://github.com/nartc/angular-three/commit/e69b23f7cd5cdd3989f2c74bb90ef2e3ea7c6052))## [4.5.0](https://github.com/nartc/angular-three/compare/4.4.1...4.5.0) (2022-02-23)

### Features

- **postprocessing/effects:** add SSAO ([f9678ab](https://github.com/nartc/angular-three/commit/f9678abf42ce43ec64809eabdd19a73bfb3c9aef))
- **soba/staging:** add Sky ([175e91e](https://github.com/nartc/angular-three/commit/175e91eebbc85a483a056e5e2481c2da63ce64f5))

### Bug Fixes

- **cannon/bodies:** make body controller works without parent object3d ([2769797](https://github.com/nartc/angular-three/commit/27697977a2caca0c759cff3f40a40041b7222f1f))
- **core:** fix viewport calculation ([5de20b0](https://github.com/nartc/angular-three/commit/5de20b05cd116a13f09cc4452bb2c4f3afa377e0))
- **schematics:** bump version ([5a0938d](https://github.com/nartc/angular-three/commit/5a0938d824a3b3e469a672cd192c2ee00b5d5386))

### Documentations

- **storybook:** add object clump fork ([5af9f0a](https://github.com/nartc/angular-three/commit/5af9f0a9142af54121b58f5fdd95b6bc2c7becb6))
- **storybook:** add sky ([f8ef042](https://github.com/nartc/angular-three/commit/f8ef042ea9376a4f5951085fb191be3c6098b29c))

### [4.4.1](https://github.com/nartc/angular-three/compare/4.4.0...4.4.1) (2022-02-22)

### Bug Fixes

- **schematics:** of course I forgot to bump the schematics version ([77c2a5c](https://github.com/nartc/angular-three/commit/77c2a5c4e62b5cc8f58d3195669e4a4388fcbdf7))

## [4.4.0](https://github.com/nartc/angular-three/compare/4.3.1...4.4.0) (2022-02-22)

### Features

- **cannon/debug:** add ability to disable Debug ([c4823f9](https://github.com/nartc/angular-three/commit/c4823f98a6ec9c1bf3cc9d517d6bbc03db4f4d02)), closes [#62](https://github.com/nartc/angular-three/issues/62)

### Documentations

- **storybook:** add demo for wakeUp/sleep api ([4fc2f56](https://github.com/nartc/angular-three/commit/4fc2f563b86b2d5f5310b7cb8575233c2e4bc353)), closes [#60](https://github.com/nartc/angular-three/issues/60)

### [4.3.1](https://github.com/nartc/angular-three/compare/4.3.0...4.3.1) (2022-02-20)

### Bug Fixes

- **schematics:** up ANGULAR_THREE_VERSION ([088ddfe](https://github.com/nartc/angular-three/commit/088ddfea53a5aa03850381a56a39c5fc62e606c7))

### Documentations

- **storybook:** add scale to simple physics ([4e1c7b1](https://github.com/nartc/angular-three/commit/4e1c7b137b0d2b709c0bd060a28e953c41267d1a))

## [4.3.0](https://github.com/nartc/angular-three/compare/4.2.5...4.3.0) (2022-02-18)

### Features

- **core:** deprecate NGT_CANVAS_OPTIONS ([c5d877f](https://github.com/nartc/angular-three/commit/c5d877fd0d2e2ee04654beafe135fbfd280c39bc))

### Bug Fixes

- **core:** adjust DI ([4d39320](https://github.com/nartc/angular-three/commit/4d393209473f00441941cd9fb5cfaf8617b56874))

### Documentations

- **repo:** add Igor to contributors ([d08ea5d](https://github.com/nartc/angular-three/commit/d08ea5d7b4a39908853a3baba02bd9555223fdaf))

### [4.2.5](https://github.com/nartc/angular-three/compare/4.2.4...4.2.5) (2022-02-18)

### Bug Fixes

- **soba/staging:** adjust stage ([56036a9](https://github.com/nartc/angular-three/commit/56036a94b4ce23337ddf427bdd607cab672da3e8))

### Documentations

- **storybook:** add basic docs for Cannon ([dbf24be](https://github.com/nartc/angular-three/commit/dbf24bec464771c723f1e1990391965347be5f64))

### [4.2.4](https://github.com/nartc/angular-three/compare/4.2.3...4.2.4) (2022-02-18)

### Bug Fixes

- **cannon:** add cannon-es-debugger to dependencies list instead ([187c06f](https://github.com/nartc/angular-three/commit/187c06feca780ad0e0bdd983413b956af987489d))

### [4.2.3](https://github.com/nartc/angular-three/compare/4.2.2...4.2.3) (2022-02-18)

### Bug Fixes

- **schematics:** add props-to-body to tsConfig include as well ([2a362cc](https://github.com/nartc/angular-three/commit/2a362cc31dd0f4557c5eb261f7efeb49625f3191))

### [4.2.2](https://github.com/nartc/angular-three/compare/4.2.1...4.2.2) (2022-02-18)

### Bug Fixes

- **schematics:** make sure offset is calculated correctly ([cc857c1](https://github.com/nartc/angular-three/commit/cc857c163b625d3d30fba30a400ccd526be5aeac))

### [4.2.1](https://github.com/nartc/angular-three/compare/4.2.0...4.2.1) (2022-02-18)

### Bug Fixes

- **schematics:** fix configure-cannon schematics ([60601af](https://github.com/nartc/angular-three/commit/60601af1ba8e60ba933e3f30dd1503620a8e2ebf))

## [4.2.0](https://github.com/nartc/angular-three/compare/4.0.2...4.2.0) (2022-02-18)

### Features

- **core:** add production canvas options to load worker from CDN ([6642586](https://github.com/nartc/angular-three/commit/6642586b4408d956e90b713343abec3ddfdcfdb9))
- **schematics:** add configure cannon generator ([8abb5d8](https://github.com/nartc/angular-three/commit/8abb5d8142685eedce0c60a0a7b6a3b856eb41c7))
- **soba/misc:** add Html (buggy, help needed) ([7f2e7b1](https://github.com/nartc/angular-three/commit/7f2e7b13828d6c774667672cf8de292dd1dfa3e8))
- **soba/staging:** add ContactShadows ([73a77cf](https://github.com/nartc/angular-three/commit/73a77cf6ac3679079fb792b658e32e8e7b6eefc6))

### [4.0.2](https://github.com/nartc/angular-three/compare/4.0.1...4.0.2) (2022-02-14)

### Bug Fixes

- **repo:** expose isLinear on CanvasStore for reuse ([7e40553](https://github.com/nartc/angular-three/commit/7e40553eda8529045121050de8184afaf093976e))
- **soba/abstractions:** ensure to convert color to THREE.Color for Text ([758b298](https://github.com/nartc/angular-three/commit/758b298b78e27c483943c659b5dfe559c5272c1f))

### Documentations

- **storybook:** update docs ([c8d1c49](https://github.com/nartc/angular-three/commit/c8d1c49de58a356893e7f9da8ce235c7a0751465))

### [4.0.1](https://github.com/nartc/angular-three/compare/4.0.0...4.0.1) (2022-02-13)

### Bug Fixes

- **schematics:** add nrwl/devkit to dependencies ([5f8c579](https://github.com/nartc/angular-three/commit/5f8c579951347017fd85d0dd65a6ffd657223d18))

## [4.0.0](https://github.com/nartc/angular-three/compare/3.2.0...4.0.0) (2022-02-13)

This is an overhaul over the library in terms of stabilizing how the Scene Graph gets constructed.

### Breaking Changes

#### Core

- All Components/Directives/Services names are updated to remove all type suffix. Eg: `NgtTextureLoaderSerivce` -> `NgtTextureLoader`, `NgtLoopService` -> `NgtLoop` etc...
- `NgtStore` has been renamed to `NgtCanvasStore`. `NgtStore` is now a base `Store` if you'd like to implement custom Store
- `NgtPerformanceStore` has been removed. `regres()` is now on `NgtPerformance` (as a Service)
- State Management has been reworked with in-house solution (combination between `ngrx/component-store` and `rx-angular/state`). If you're using any of the `Ngt***Store`, `select()` and `get()` methods have been changed to use `Selector` instead of `string`

```ts
// before
this.canvasStore.get('size');
this.canvasStore.get('viewport', 'dpr');
this.canvasStore.select('size');
this.canvasStore.select('viewport', 'dpr');

// after
this.canvasStore.get((s) => s.size);
this.canvasStore.get((s) => s.viewport.dpr);
this.canvasStore.select((s) => s.size);
this.canvasStore.select((s) => s.viewport.dpr);
```

- `NgtMathConstPipe` has been deprecated. If you're using `mathConst:"PI"`, please migrate to `radian` pipe
- `NgtSobaExtender` has been renamed to `NgtExtender`
- `NgtRepeat` has been changed to extend `NgFor` instead of a complete custom directive

```html
<!-- before -->
<ngt-mesh *repeat="let i of 6"></ngt-mesh>

<!-- after -->
<ngt-mesh *ngFor="let i repeat 6"></ngt-mesh>
```

- `(animateRead)`signature has been changed

```html
<!-- before -->
<ngt-mesh> (animateReady)="onAnimateReady($event)"</ngt-mesh>
<!-- $event is NgtRender -->

<!-- after -->
<ngt-mesh (animateReady)="onAnimateReady($event.state)"></ngt-mesh>
<!-- $event.state is NgtRender. $event.object is the Object3D -->
<!-- on some Soba components/directives, `$event.entity` is available instead of `$event.object` -->
```

#### Soba

- All Soba Shapes are removed. I personally think these shapes are redundant. If you're using one of these shapes, please migrate to just `ngt-mesh` and respective geometries

```html
<!-- before -->
<ngt-soba-box></ngt-soba-box>

<!-- after -->
<ngt-mesh>
  <ngt-box-geometry></ngt-box-geometry>
</ngt-mesh>
```

- `ngt-soba-positional-audio` has been removed

### Features

#### Core

- THREE.js 0.137
- `(ready)` now exposes `$event` as the `Object3d` instead of nothing.

```html
<!-- before -->
<ngt-mesh #ngtMesh="ngtMesh" (ready)="onReady(ngtMesh.mesh)"></ngt-mesh>

<!-- after -->
<ngt-mesh (ready)="onReady($event)"></ngt-mesh>
```

- `(animateReady)` now exposes `$event.object` as the `Object3d` instead of just `NgtRender`

```html
<!-- before -->
<ngt-mesh #ngtMesh="ngtMesh" (animateReady)="onAnimateReady(ngtMesh.mesh, $event)"></ngt-mesh>

<!-- after -->
<ngt-mesh (animateReady)="onAnimateReady($event.object, $event.state)"></ngt-mesh>
```

> On some Soba components/directives, the underlying `Object3d` is exposed as `$event.entity` instead of `$event.object`

- `NgtStore` is a simplified version of `ComponentStore` and `RxState` created specifically for `AngularThree` usage.

> `@angular-three/core` no longer depends on `@rx-angular/state` and `@rx-angular/cdk`, if you do not use these libraries, you can safely remove them.

### Documentations

- **repo:** add README ([f8d3a79](https://github.com/nartc/angular-three/commit/f8d3a79b270fe21808f93c445f321020a67c764a))

## [3.2.0](https://github.com/nartc/angular-three/compare/3.1.0...3.2.0) (2022-01-09)

### Features

- **soba:** add Backdrop ([e37cd9a](https://github.com/nartc/angular-three/commit/e37cd9af898a79d6898dc059a37a40c0bbef66fb))
- **soba:** add CameraShake ([028cbb4](https://github.com/nartc/angular-three/commit/028cbb4909b22a3625338963eca6dcebfefa0316))
- **soba:** add Float ([7324066](https://github.com/nartc/angular-three/commit/7324066e735b3e70616ae12ee9b18c46e4fd459e))
- **soba:** add Stage ([e1520ca](https://github.com/nartc/angular-three/commit/e1520cabbb79afb56e33b774f6ae17cd69851d34))

### Bug Fixes

- **core:** modify type of animateReady on SobaExtender ([992f35f](https://github.com/nartc/angular-three/commit/992f35f316a14cbe8bcf9988347f751fbfaf20b2))
- **soba:** adjust Staging import in Stage ([131a32e](https://github.com/nartc/angular-three/commit/131a32e841e1abee226e4724cf353cc65420ceb7))
- **soba:** clean up ([bf62e09](https://github.com/nartc/angular-three/commit/bf62e0910af5081ca6f0a6376abfbad28d0793f4))
- **soba:** delegate all animateReady for sobaExtender ([042ba31](https://github.com/nartc/angular-three/commit/042ba31a967f15398b1ab3d6ae2026402cd1e341))

## [3.1.0](https://github.com/nartc/angular-three/compare/3.0.0...3.1.0) (2022-01-07)

### Features

- **postprocessing:** add DepthOfField effect ([d9b5069](https://github.com/nartc/angular-three/commit/d9b50698962691dbb36c11293d9dfae42c0f344e))
- **soba:** add Bounds ([ccddd0d](https://github.com/nartc/angular-three/commit/ccddd0d030d0d3b2016f2f331922421b9fe95403))

### Bug Fixes

- **postprocessing:** clean up postprocessing simple effects ([56a00a4](https://github.com/nartc/angular-three/commit/56a00a406f9fe7256659ec41f5864ce48efb0303))

### Documentations

- **demo/storybook:** add Narwhal Landing demo ([d82964b](https://github.com/nartc/angular-three/commit/d82964b055c2380914cbd2810137713053b4a246))

## [3.0.0](https://github.com/nartc/angular-three/compare/2.17.0...3.0.0) (2022-01-06)

### ⚠ BREAKING CHANGES

- **core:** Update to THREE 0.136. Please consult THREE.js changelog for breaking changes from 0.135 to 0.136

### Features

- **core:** update THREE 0.136 ([09933af](https://github.com/nartc/angular-three/commit/09933afdf66d092756eb40c89d1b8d173b22a921))
- **soba:** add Center ([f0e6a5b](https://github.com/nartc/angular-three/commit/f0e6a5be2a60c778c6c0513168bdfc2ecfa08b67))
- **soba:** update troika-three-text and make it a dependencies to soba instead of peerDep ([51c8df1](https://github.com/nartc/angular-three/commit/51c8df1730a627fe2215211225f53101b4142002))
- **soba:** upgrade cannon-es-debugger and Debug component ([5723306](https://github.com/nartc/angular-three/commit/5723306cb736963831d0f72c282a9f751729d6f9))

### Bug Fixes

- **core:** null assert for group export ([9e6aa8e](https://github.com/nartc/angular-three/commit/9e6aa8ecae14e75d80ceb521314c23edc307788b))
- **soba:** export controllers from proper components ([3fe174c](https://github.com/nartc/angular-three/commit/3fe174cd59b086aeb35c9a93c4ffd7a2acb9c3a7))

### Documentations

- **demo:** play around with simple cube ([100c011](https://github.com/nartc/angular-three/commit/100c011c1c36c4feca10271e1a30aec6c9604fbc))
- **demo:** update lil-gui ([12bdc3f](https://github.com/nartc/angular-three/commit/12bdc3f6ed164c787e228a3ff3828a6b2a315079))
- **storybook:** add Shape stories ([78678b9](https://github.com/nartc/angular-three/commit/78678b9057c1f2606fdbaa488455f37672158b9f))
- **storybook:** fix absoluate import ([c686bbd](https://github.com/nartc/angular-three/commit/c686bbd9123763ac599e025abc6d477c9c79d59a))

## [2.17.0](https://github.com/nartc/angular-three/compare/2.16.2...2.17.0) (2022-01-04)

### Features

- **core:** allow to pass Object3d getter to appendTo ([d4b0bf7](https://github.com/nartc/angular-three/commit/d4b0bf7a4858bd68e322bae4530acfd2ae428e3c))
- **soba:** add GradientTexture ([34004e2](https://github.com/nartc/angular-three/commit/34004e2e34c67663eef9416bdc328e0eac86ee73)), closes [#28](https://github.com/nartc/angular-three/issues/28)
- **soba:** add TransformControls ([0e33191](https://github.com/nartc/angular-three/commit/0e33191be0b3fdc4a9c7e067ee42eba467583903))

### Bug Fixes

- **cannon:** clean up debug ([5c8f4d1](https://github.com/nartc/angular-three/commit/5c8f4d142adb4b94b508d950a3ca49d4975404ce))
- **core:** adjust Tail type ([0f75e34](https://github.com/nartc/angular-three/commit/0f75e3414aeb7a1a4b539202688913469d2d35bf))
- **core:** requestAnimationFrame for appending object can be a good solution for now ([53b5429](https://github.com/nartc/angular-three/commit/53b542901e829e63adf8e630c916d3ca2a86aa00))
- **soba:** clean up detailed component ([80988f6](https://github.com/nartc/angular-three/commit/80988f64c932184496c1ffc348ea1df042eeca2e))
- **soba:** clean up orthographic camera ([e999966](https://github.com/nartc/angular-three/commit/e999966b37af74918bf128449694bf3f9c994608))
- **soba:** clean up positional audio ([9044253](https://github.com/nartc/angular-three/commit/9044253b39d42fea285d0dd71b40747f5319f29e))
- **soba:** clean up stars component ([32732d7](https://github.com/nartc/angular-three/commit/32732d794137bfab6efe55aa3d33ffc17d8f5613))

### Documentations

- **demo:** add mdx for simple cube ([557fe22](https://github.com/nartc/angular-three/commit/557fe22038bfc12ccd62786b9284059030755925))
- **demo:** add testing component to quickly test new stuffs ([7d2485f](https://github.com/nartc/angular-three/commit/7d2485f46178200386b0d22ce2ee7448072e9005))
- **demo:** playaround more with simplecube component ([f963403](https://github.com/nartc/angular-three/commit/f9634034007bcc03114da5f563e41835b9eb81e4))
- **demo:** wip cube transform from threejs ([835cec9](https://github.com/nartc/angular-three/commit/835cec9d8f4e66825d987abd2d596c58018b263c))
- **storybook:** add flag to make orbit controls default ([82d4890](https://github.com/nartc/angular-three/commit/82d489066843afc240af3e6bdf20c9ac959adcf8))

### [2.16.2](https://github.com/nartc/angular-three/compare/2.16.1...2.16.2) (2021-12-30)

### Bug Fixes

- **soba:** make sure gizmo wait for Canvas to be ready before initialize itself ([1fd4bdc](https://github.com/nartc/angular-three/commit/1fd4bdc793e735718f7084e435b170b6cea5cee1)), closes [#41](https://github.com/nartc/angular-three/issues/41)

### [2.16.1](https://github.com/nartc/angular-three/compare/2.16.0...2.16.1) (2021-12-29)

### Bug Fixes

- **core:** merge changes on both controllers' inputs and the nested controllers\ ([d4d8c78](https://github.com/nartc/angular-three/commit/d4d8c78c01d1603bf0404a597239c85b1b47770a))

### Documentations

- **demo:** use simple cube ([d2832d4](https://github.com/nartc/angular-three/commit/d2832d463831dc43f803aa6146cb7583683ec09d))
- **storybook:** add custom font to text demo ([77b4d5e](https://github.com/nartc/angular-three/commit/77b4d5e0ce25c5947a2fd2661109e3d269e0dfe7))
- **storybook:** adjust gizmo story ([09976bf](https://github.com/nartc/angular-three/commit/09976bf2549da08b36e08ae2f77b71c6f4c998ce))

## [2.16.0](https://github.com/nartc/angular-three/compare/2.15.1...2.16.0) (2021-12-29)

### Features

- **soba:** add GizmoViewport ([5394487](https://github.com/nartc/angular-three/commit/5394487b1da217dc1ddbe7bbb71f4f1690520bcc))

### [2.15.1](https://github.com/nartc/angular-three/compare/2.15.0...2.15.1) (2021-12-29)

### Bug Fixes

- **core:** ensure prop on the controller overrides the controller itself ([e7a8997](https://github.com/nartc/angular-three/commit/e7a8997f6dce234c153a07885d59843f21ba62fb))
- **soba:** bind to position on gizmoHelper ([859864e](https://github.com/nartc/angular-three/commit/859864eb4244bf4665eb3d333435e15d36c6ccb1))

## [2.15.0](https://github.com/nartc/angular-three/compare/2.14.0...2.15.0) (2021-12-28)

### Features

- **soba:** add GizmoHelper ([0a96282](https://github.com/nartc/angular-three/commit/0a96282f74e4c41516638085314be27cb4d169e5))

### Bug Fixes

- **core:** adjust type of raycast to include `null` ([2879822](https://github.com/nartc/angular-three/commit/287982289580f215ee010852d5fd17f0534afd6c))
- **core:** make EnhancedRxState provid-able ([9e8d092](https://github.com/nartc/angular-three/commit/9e8d09245e464c91925a97e99cdb3c655bb9f426))
- **soba:** export all classes ([c4174d0](https://github.com/nartc/angular-three/commit/c4174d0ddec513d935be4ea6c7260c7f36be8399))

### Documentations

- **storybook:** adjust how "black" is used ([ae78b24](https://github.com/nartc/angular-three/commit/ae78b24772c3e30f1f2db774386054b55ba6ddee))

## [2.14.0](https://github.com/nartc/angular-three/compare/2.13.0...2.14.0) (2021-12-28)

### Features

- **core:** add Side pipe ([30e84e9](https://github.com/nartc/angular-three/commit/30e84e95ac3e0f4e3a91c127cc6cda4f3b1ea68b))

### Documentations

- **demo:** adjust minecraft demo ([2b92882](https://github.com/nartc/angular-three/commit/2b9288251233f294822ede83223599784591f306))

## [2.13.0](https://github.com/nartc/angular-three/compare/2.12.0...2.13.0) (2021-12-28)

### Features

- **core:** move (ready) out of controllers so we have type-safe on ready ([e8f3f3d](https://github.com/nartc/angular-three/commit/e8f3f3d97c982b9660ce75f43575410a7289beba))
- **core:** type safe for Primitive ([653aa9f](https://github.com/nartc/angular-three/commit/653aa9f9c7bcd1edd47f89fd8d0bad75c874b832))
- **core:** type safe ready for Audio ([07a8777](https://github.com/nartc/angular-three/commit/07a8777e6cd7b62a96094360217756df76f3f8aa))
- **core:** type safe ready for AudioListener ([0e8e8e5](https://github.com/nartc/angular-three/commit/0e8e8e55acbc0a3cbc13bc39e46571e305f2a39d))
- **core:** type safe ready for Camera ([2ea5f60](https://github.com/nartc/angular-three/commit/2ea5f601ef18f48332d7e8c163bd172f71e5e438))
- **core:** type safe ready for CubeCamera ([c84aa88](https://github.com/nartc/angular-three/commit/c84aa88d60a5d070a75eae3ab09345dae65cc65a))
- **core:** type safe ready for Group ([42c3239](https://github.com/nartc/angular-three/commit/42c32395f93477f3356d69fa64b7ae590c4cde46))
- **core:** type safe ready for Helper ([4585c76](https://github.com/nartc/angular-three/commit/4585c7642f229bf009513255c321cea120f36d4c))
- **core:** type safe ready for Light ([ea19242](https://github.com/nartc/angular-three/commit/ea1924269bfe6b62b21f90eaa88786d9656a94d8))
- **core:** type safe ready for Line ([9d894a7](https://github.com/nartc/angular-three/commit/9d894a7251a8d3c9fc5f84f6300c0d67868a637f))
- **core:** type safe ready for LOD ([c526a98](https://github.com/nartc/angular-three/commit/c526a98c4e9944a483d53623781ae4117ae19475))
- **core:** type safe ready for Material ([50e2649](https://github.com/nartc/angular-three/commit/50e26494898496d99ed6c7d92afcd88f858edb73))
- **core:** type safe ready for Mesh ([26f1a41](https://github.com/nartc/angular-three/commit/26f1a41d249ece76fe75ad43fbd0f207d03692cb))
- **core:** type safe ready for Points ([ec84c88](https://github.com/nartc/angular-three/commit/ec84c883b712f14405ea6c8a4eeb11a527ec3df9))
- **core:** type safe ready for Skeleton and Bone ([2d2a7a9](https://github.com/nartc/angular-three/commit/2d2a7a9447db92bcd56aaaa89af07744fbb87fc9))
- **core:** type safe ready for Sprite ([7889a7e](https://github.com/nartc/angular-three/commit/7889a7ebfbeadd9dd486a23c60dbf8a36da1ed27))
- **core:** type safe ready for Texture ([cd3343e](https://github.com/nartc/angular-three/commit/cd3343ee40d611956e4b790dfd4725d618c7f553))
- **soba:** adjust soba components to use type-safe ready for their core counterparts ([973fe6e](https://github.com/nartc/angular-three/commit/973fe6e7ba300ccfa340f719df5ea5f9ebe02ba7))

### Bug Fixes

- **core:** add ready<type>() to geometry and also move ready emit to after the geometry is constructed instead of after it's added to the parent ([197f28c](https://github.com/nartc/angular-three/commit/197f28c67077d3cfcfcf83ee46e0af3a79ce6d18))
- **postprocessing:** static querying for NgtGroup in EffectComposer ([c706ce7](https://github.com/nartc/angular-three/commit/c706ce714f3a5d0177b0cf91029e5c7bfc22b7ef))

### Documentations

- **demo:** add Minecraft demo ([0dfd1a2](https://github.com/nartc/angular-three/commit/0dfd1a2bc337e574764243024a6f10dde175ba7a))
- **demo:** adjust demo to use type-safe ready ([b572036](https://github.com/nartc/angular-three/commit/b57203612351e81b9ee06663af9a9ba59fe3a3b2))
- **storybook:** adjust storybook ([725934a](https://github.com/nartc/angular-three/commit/725934a30a9440da7d1b0f03dc3f81d9dc649fd1))

## [2.12.0](https://github.com/nartc/angular-three/compare/2.11.0...2.12.0) (2021-12-28)

### Features

- **soba:** add FirstPersonControls ([b6febf4](https://github.com/nartc/angular-three/commit/b6febf46b64d294ab971526ccba7b633b27baf85))

### Documentations

- **demo:** change simple cube ([3bc5d6d](https://github.com/nartc/angular-three/commit/3bc5d6d173fcc75d363a8ba9fcdeeb0fad08b697))

## [2.11.0](https://github.com/nartc/angular-three/compare/2.10.0...2.11.0) (2021-12-22)

### Features

- **core:** add CursorDirective ([74a13dc](https://github.com/nartc/angular-three/commit/74a13dccaec06960f901aa8169bbf42fd1f4b393))
- **core:** add NGT_CANVAS_OPTIONS to customize the CanvasComponent ([395914b](https://github.com/nartc/angular-three/commit/395914b055eaf87ad83da39dbc54147d2771b6b0))
- **core:** clean up core module ([6ba5df4](https://github.com/nartc/angular-three/commit/6ba5df44ba82c81867dd2a5bb8d9b223ecab47c5))
- **soba:** add OrthographicCAmera ([3a4dca6](https://github.com/nartc/angular-three/commit/3a4dca6c33c95151a9664ccc5a0e4164312f4655))

### Bug Fixes

- **core:** ensure to use #object3dInputsController ([f015881](https://github.com/nartc/angular-three/commit/f015881c7f8e92036f8ba972cbef8764c8215040)), closes [#object3](https://github.com/nartc/angular-three/issues/object3)
- **core:** ng add now modifies skipLibCheck as well ([a9fdfaf](https://github.com/nartc/angular-three/commit/a9fdfaf47e81fd838cf5fceac429db74e0a7e112))
- **soba:** use objectInputsController on soba orthographic camera ([8a69082](https://github.com/nartc/angular-three/commit/8a690828f1f183e9d6ef25e724f158bd5a087c23))

### Documentations

- add LittlestTokyo asset ([ce6f582](https://github.com/nartc/angular-three/commit/ce6f582288472d77e343c25b428b6c85c6350ff6))
- **storybook:** add documentations on NGT_CANVAS_OPTIONS ([55c170a](https://github.com/nartc/angular-three/commit/55c170a74732a2165f47a502a7a3c8d88431cb25))
- **storybook:** add positional audio ([17e059b](https://github.com/nartc/angular-three/commit/17e059b88817be0fbcd6393ee5f355d26dca08f2))
- **storybook:** adjust documentations with latest changes ([670b057](https://github.com/nartc/angular-three/commit/670b05796e5f3395d98f316815c53480e66c493e))
- WIP routing ([af056db](https://github.com/nartc/angular-three/commit/af056db7952858360af32039f441b530e6302f25))

## [2.10.0](https://github.com/nartc/angular-three/compare/2.9.0...2.10.0) (2021-12-20)

### Features

- **soba:** add PositionalAudio ([5593440](https://github.com/nartc/angular-three/commit/5593440a53f4ca366495d45fce6a7cce3039659e))
- **soba:** being able to update NgtOrbitControls target ([#38](https://github.com/nartc/angular-three/issues/38)) ([22d507f](https://github.com/nartc/angular-three/commit/22d507f4d7814a8b36864fb77d568324c11eda10))

### Bug Fixes

- **cannon:** adjust typing ([239d57d](https://github.com/nartc/angular-three/commit/239d57d696a1790bc75655a4a7d38092cad3acd3))
- **core:** adjust changes from r3f events ([dfbb2df](https://github.com/nartc/angular-three/commit/dfbb2dfb407ac89db151d19a2c42f12c898554d4))
- **core:** adjust RxState with new actions from core ([2ee026e](https://github.com/nartc/angular-three/commit/2ee026e1e227ce069c0589cff0079285613db443))
- **soba:** clean up orbit controls updating target ([70bafc6](https://github.com/nartc/angular-three/commit/70bafc6e645a49c536e4602e9a24b83c6b613cdf))
- **soba:** delay assigning text for text component by an animation frame to allow for binding ([cb29085](https://github.com/nartc/angular-three/commit/cb2908511d83d3fe1348c10af21ce4a217c11cf7))

### Documentations

- add @BenLune as a contributor ([d6dd109](https://github.com/nartc/angular-three/commit/d6dd109c068f85545f9c7d92af617d463676da52))
- **demo/storybook:** add ngx-lil-gui ([b970fa6](https://github.com/nartc/angular-three/commit/b970fa669940b756c072e4a13c87db0d21f78897))
- **demo/storybook:** clean up orbit controls swtich target demo ([9708add](https://github.com/nartc/angular-three/commit/9708addf50c9faa9eadfb78f9911f429e64de243))
- **demo/storybook:** cleanup compound body ([1fac969](https://github.com/nartc/angular-three/commit/1fac969b3460dccce2554afb1a181151faebdf77))
- **demo/storybook:** fix compound body demo ([4a22eec](https://github.com/nartc/angular-three/commit/4a22eecd3a29a6b920efc1e27775d678d77ca337))

## [2.9.0](https://github.com/nartc/angular-three/compare/2.8.0...2.9.0) (2021-12-14)

### Features

- **core:** add FogPipe ([bd58523](https://github.com/nartc/angular-three/commit/bd58523bee62c784a88b7045665865a8d1722fdc))

### Documentations

- **demo/storybook:** add RobotExpressive demo ([c99c504](https://github.com/nartc/angular-three/commit/c99c5042d1938024fd0f7b9b4c6b319bad99fd7d))

## [2.8.0](https://github.com/nartc/angular-three/compare/2.7.3...2.8.0) (2021-12-13)

### Features

- **core:** separate helpers and object helpers ([6c18608](https://github.com/nartc/angular-three/commit/6c186081a360fc1efc502f459614f1c646323528))
- **soba:** add Stars ([b23d960](https://github.com/nartc/angular-three/commit/b23d960b70c1430e4c80d6299d7edb890db86ff3))

### Bug Fixes

- **core:** add ngt-points to required controllers ([1da9cee](https://github.com/nartc/angular-three/commit/1da9cee00a643dc123da2951a8cc237bc7eeaf36))
- **core:** adjust imports in object helper ([42de8b4](https://github.com/nartc/angular-three/commit/42de8b4c0ad35a9d059946f1af0aebce186a087b))
- **core:** adjust object helpers ([089d7cb](https://github.com/nartc/angular-three/commit/089d7cb082094997e314c264157478738713d9da))
- **core:** allow Attribute#attach to accept arbitrary string ([bd8e916](https://github.com/nartc/angular-three/commit/bd8e916a562ad8fc21200dc66d3b119e73d293ab))
- **core:** remove SkipSelf from object3d provider ([10390be](https://github.com/nartc/angular-three/commit/10390be02e6de75e1109cc2ad93b283749b382f9))
- **core:** useValue for THREE.Points instead of useExisting ([59ec622](https://github.com/nartc/angular-three/commit/59ec622f74f707817d4afd0f5e9e7534cbf8aa35))
- **core:** wrap setting parameters for material in requestAnimationFrame ([51f5269](https://github.com/nartc/angular-three/commit/51f5269e7252c43b8444cd0b74430eeb2ee9e813))
- **soba:** provide NgtSobaExtender for billboard and image ([6031836](https://github.com/nartc/angular-three/commit/60318366e5318a534c16ac42e6af1a6d2ffa4d57))
- **soba:** template error in stars component ([3827350](https://github.com/nartc/angular-three/commit/38273500117e898a743e7fc20eb1bb844cb09016))

### Cleanup

- **core:** consolidate core ([9e64eb4](https://github.com/nartc/angular-three/commit/9e64eb4b2ae3afb72851978d85f4e4ed1701a77a))
- **core:** move all models to a single file types.ts ([8d33940](https://github.com/nartc/angular-three/commit/8d33940b46fc0b699782f34a5736ad01f242db5e))
- **core:** remove CanvasInputsState ([dce5a4c](https://github.com/nartc/angular-three/commit/dce5a4c4b74273b0a6644e749bba5f274c56b9cb))

### [2.7.3](https://github.com/nartc/angular-three/compare/2.7.2...2.7.3) (2021-12-13)

### Cleanup

- **repo:** revert npm scripts ([0195a8d](https://github.com/nartc/angular-three/commit/0195a8d808ea038906bd819444173710e33676c4))

### [2.7.2](https://github.com/nartc/angular-three/compare/2.7.1...2.7.2) (2021-12-13)

### Bug Fixes

- **core:** adjust enhanced rx state actions ([6804d2f](https://github.com/nartc/angular-three/commit/6804d2ff898efa7bee5b35814e90aa13c604c910))

### [2.7.1](https://github.com/nartc/angular-three/compare/2.7.0...2.7.1) (2021-12-13)

### Bug Fixes

- adjust generators ([aecf58a](https://github.com/nartc/angular-three/commit/aecf58ac72556059d5d2d45a38d46c5af0a7e950))
- **cannon:** fix how constraint gets a hold of the bodies inside ([b95755e](https://github.com/nartc/angular-three/commit/b95755e2dd7417cabd56d545c15f1d91333e4b3e))
- **postprocessing:** the effect now adds itself to the EffectComposer#effects ([f6e75b4](https://github.com/nartc/angular-three/commit/f6e75b43928704cc129a227bce20107a644aff04))

## [2.7.0](https://github.com/nartc/angular-three/compare/2.6.0...2.7.0) (2021-12-13)

### Features

- **core:** refactor how Geometry/Material works ([979f83a](https://github.com/nartc/angular-three/commit/979f83a51b19f9444bad0c83ce76b0d89f6e33c8))
- **core:** use DI for Bone/Skeleton instead of Contentquery ([e8ffe34](https://github.com/nartc/angular-three/commit/e8ffe34516676da0ec5a7bc7354e4e35bd247e6a))
- **core:** use NGT_OBJECT_3D_PROVIDER for all geometries and materials ([28b0225](https://github.com/nartc/angular-three/commit/28b022511cd389d20db0424e53ea6fdd2228571e))
- **soba:** add Image ([0e46d7c](https://github.com/nartc/angular-three/commit/0e46d7ce2364987631d8f18e1466922a9c480b38)), closes [#28](https://github.com/nartc/angular-three/issues/28)
- **soba:** add Line, QuadraticBezierLine, CubicBezierLine ([2ca6a13](https://github.com/nartc/angular-three/commit/2ca6a137f4e803fe7dddc59257b8cae15825bda1)), closes [#28](https://github.com/nartc/angular-three/issues/28)
- **soba:** add shader material fn ([f31dd01](https://github.com/nartc/angular-three/commit/f31dd017268d0b306d30439cf923c38180ad1fc9))
- **soba:** move SobaExtender to core so it can be used by core ([02c9e87](https://github.com/nartc/angular-three/commit/02c9e872a11437e7d7f702aad90ec307c3bf1c0a))
- **soba:** use SobaExtender from core instead ([8c3910f](https://github.com/nartc/angular-three/commit/8c3910fd562ee934ef77403ba4d8b8b70e03a456))

### Bug Fixes

- **cannon:** use OnInit for PhysicBodyController instead of afterContentInit ([667a6bb](https://github.com/nartc/angular-three/commit/667a6bbbd8159425aabb02252bd58d3268ab0aa7))
- **cannon:** use OnInit for PhysicConstraintController isntead of afterContentInit ([f9a913f](https://github.com/nartc/angular-three/commit/f9a913f516d38c1b8e722b171256a55bccd157c4))
- **core:** null check for controller before running assign ([7a33b49](https://github.com/nartc/angular-three/commit/7a33b49c64c8a61041ff7bd15037222ebbc89034))
- **core:** use timer rxjs for loader ([8285fbd](https://github.com/nartc/angular-three/commit/8285fbde819a68fe259be2feb78e513106660779))

### Documentations

- **demo:** try abstracting material ([0c31312](https://github.com/nartc/angular-three/commit/0c31312f08569240d980ed4f643c3c9e4abad969))

## [2.6.0](https://github.com/nartc/angular-three/compare/2.5.0...2.6.0) (2021-12-10)

### Features

- **core:** add raycast to object3d ([aec28bd](https://github.com/nartc/angular-three/commit/aec28bd7406ae06db7caeffa4a2b72f980a62a52))
- **soba:** add Loader component ([58ff9b8](https://github.com/nartc/angular-three/commit/58ff9b80a04eed9930b2de2c2708902fdf3f408b))
- **soba:** add progress service ([ed0dedb](https://github.com/nartc/angular-three/commit/ed0dedbec93a6dfb288d85e897c8456e8aff824c))

### Bug Fixes

- **core:** ensure CustomRenderer works with other stuffs like Scene as well ([293ce31](https://github.com/nartc/angular-three/commit/293ce318624a1afc7ca471aecbede391d78e330d))
- **core:** ensure uuid is present before adding to animations ([52ffae8](https://github.com/nartc/angular-three/commit/52ffae8226b13451fa5aa4904f761c3d29761398))
- **core:** remove comment and return the clean up fn in AudioListener ([7f33803](https://github.com/nartc/angular-three/commit/7f33803734980b735acf1fcbfa75441120d96fdd))
- **core:** rename animationSubscriber#subscribe to prepare for better distinction with RxJs ([b1160e6](https://github.com/nartc/angular-three/commit/b1160e663c524bebd8df2ab3c9c96104b092e2bf))
- **core:** use getActions from rx-state ([0a8b081](https://github.com/nartc/angular-three/commit/0a8b0811a20f68c89e0be392acb1b2e7aa8314a8))
- **soba:** rename loaders to be prefixed with Ngt ([b844f41](https://github.com/nartc/angular-three/commit/b844f4189a3b36688b309eeca20889fb0c6ff770))

### Documentations

- **demo:** adjust demo ([670526a](https://github.com/nartc/angular-three/commit/670526accf4ed400a0388c3adc1a5fb0fbf12ac5))
- **storybook:** add Loader story ([5f57604](https://github.com/nartc/angular-three/commit/5f576040f2825393568f800a1f3b8c556c7fa6c9))

## [2.5.0](https://github.com/nartc/angular-three/compare/2.4.2...2.5.0) (2021-12-10)

### Features

- **core:** migrate to RxAngular ([#37](https://github.com/nartc/angular-three/issues/37)) ([eb944ac](https://github.com/nartc/angular-three/commit/eb944ac6d3071a2248afb71b3d93fc6e85558e93)), closes [#31](https://github.com/nartc/angular-three/issues/31) [#35](https://github.com/nartc/angular-three/issues/35) [#35](https://github.com/nartc/angular-three/issues/35) [#35](https://github.com/nartc/angular-three/issues/35) [#35](https://github.com/nartc/angular-three/issues/35) [#35](https://github.com/nartc/angular-three/issues/35) [#35](https://github.com/nartc/angular-three/issues/35) [#35](https://github.com/nartc/angular-three/issues/35)
- **core:** update THREE 0.135 ([e545086](https://github.com/nartc/angular-three/commit/e545086798bdde76d8882e00e4f653844322127e))

### Bug Fixes

- **core:** when disabled is true, only disable the events and append handler on object3d ([1b1fa9d](https://github.com/nartc/angular-three/commit/1b1fa9da95e5e06896b0d42706b385840696d19b))

### Documentations

- **demo:** adjust level of details demo ([bce4199](https://github.com/nartc/angular-three/commit/bce4199cefa470672059211ea91b4bca8049834a))
- **storybook:** fix typo in import ([#36](https://github.com/nartc/angular-three/issues/36)) ([bf263dc](https://github.com/nartc/angular-three/commit/bf263dc47db6563eb573d389a37b2d0a711e08ad))
- **storybook:** use disabled true on the icosahedron in detailed stories ([03baa05](https://github.com/nartc/angular-three/commit/03baa05b02c3368acf25d29c0e1a3d6491034162))

### Cleanup

- **core:** remove comments ([846c34c](https://github.com/nartc/angular-three/commit/846c34c6f350684ceefca01c5c6b6554dae642e9))

### [2.4.2](https://github.com/nartc/angular-three/compare/2.4.1...2.4.2) (2021-12-08)

### Bug Fixes

- **core:** try disabling object3d controller ([1d78075](https://github.com/nartc/angular-three/commit/1d780753a87eb8115558b01afef200efc9f2be0d))

### Documentations

- add [@joshuamorony](https://github.com/joshuamorony) as a contributor ([a956e87](https://github.com/nartc/angular-three/commit/a956e87b73135122fc3ffb47806d69d1946eaf90))
- **storybook:** create clear distinction between ng add and manual installation ([#30](https://github.com/nartc/angular-three/issues/30)) ([cd65b25](https://github.com/nartc/angular-three/commit/cd65b253a4e10be107fe373a593631d35996b1b6))

### [2.4.1](https://github.com/nartc/angular-three/compare/2.4.0...2.4.1) (2021-12-08)

### Bug Fixes

- **core:** rerun generator ([d5495fd](https://github.com/nartc/angular-three/commit/d5495fdba60ed09c7b3d38318fec33b42d4d86d3))

## [2.4.0](https://github.com/nartc/angular-three/compare/2.3.0...2.4.0) (2021-12-08)

### Features

- **core:** add NgtRepeat ([9d35700](https://github.com/nartc/angular-three/commit/9d35700047f516a812b6c248fd5c39c445303a18))

### Bug Fixes

- **core:** fix materials generator exportAs ([ab75e06](https://github.com/nartc/angular-three/commit/ab75e0664e50bc5fd767fe25344f49489c9ddb56))

## [2.3.0](https://github.com/nartc/angular-three/compare/2.2.0...2.3.0) (2021-12-08)

### Features

- **soba:** add FlyControls ([20320f4](https://github.com/nartc/angular-three/commit/20320f403d9538d0f3ff6b5cc8bed8d1689b2fdc))

## [2.2.0](https://github.com/nartc/angular-three/compare/2.1.0...2.2.0) (2021-12-08)

### Features

- **core:** add LOD ([680986d](https://github.com/nartc/angular-three/commit/680986d38d8ca0f47e9c229b75fc40b3d272deec))
- **soba:** add Detailed ([326d616](https://github.com/nartc/angular-three/commit/326d616b7e146de7a629fba11f6b5a12ceebcf2f)), closes [#26](https://github.com/nartc/angular-three/issues/26)
- **soba:** provide NgtSobaExtender on soba shapes ([990dea2](https://github.com/nartc/angular-three/commit/990dea2ac41b37305e15fd57c0dddd9ee4ab7143))

### Bug Fixes

- **cannon:** add descendants true to PhysicBodyController content children query ([6397a3e](https://github.com/nartc/angular-three/commit/6397a3e903504a6961ad60f8df6ff160b3190ffe))
- **core:** add descendants to NgtBone content children query ([eb057cc](https://github.com/nartc/angular-three/commit/eb057cc8fde23aa301e879e7f2f1ff7553a12ea0))
- **postprocessing:** add descendants to NgtEffectController Content Children query ([8ac560e](https://github.com/nartc/angular-three/commit/8ac560e3862cce3013013958a2847409ad44de9b))

## [2.1.0](https://github.com/nartc/angular-three/compare/2.0.6...2.1.0) (2021-12-07)

### Features

- **soba:** add Billboard ([95024a3](https://github.com/nartc/angular-three/commit/95024a3d5b25c59388771eba7ada9b64f225147e)), closes [#28](https://github.com/nartc/angular-three/issues/28)
- **soba:** add billboard and text to controller generator ([a2ae80a](https://github.com/nartc/angular-three/commit/a2ae80a0158778e1ed0ad9a5dc03cc5b7b06c284))
- **soba:** add Environment ([aec9f0a](https://github.com/nartc/angular-three/commit/aec9f0a07c05c65a0320f8385c06b2710a023476)), closes [#29](https://github.com/nartc/angular-three/issues/29)
- **soba:** add Performances#preload ref [#26](https://github.com/nartc/angular-three/issues/26) ([22960aa](https://github.com/nartc/angular-three/commit/22960aa918851ef0ec088da74fb65e794ec4b41d))
- **soba:** add Text ([10d2e65](https://github.com/nartc/angular-three/commit/10d2e658c20e4992b073a07bade01fa805da023f)), closes [#28](https://github.com/nartc/angular-three/issues/28)

### Bug Fixes

- **core:** return the correct value for generator ([ea1acad](https://github.com/nartc/angular-three/commit/ea1acad81a8a8f7472d9426396b9c06d5e5818d8))
- **core:** run installPackagesTask for ng add generator ([d3637b2](https://github.com/nartc/angular-three/commit/d3637b28675fec3e6257a02c90a0c7dfefb3ead0))
- **core:** url should be string | string[] for loader ([7a0af0e](https://github.com/nartc/angular-three/commit/7a0af0ee335d48fbe65c615b08c92ec0e536cd95))
- **soba:** null assertion on ngtGroup.group for Billboard ([0cafd46](https://github.com/nartc/angular-three/commit/0cafd4692f3ec911ff6a73bd51d0cadf1071ff99))

### Documentations

- **core:** add ng-add to docs ([e175dbf](https://github.com/nartc/angular-three/commit/e175dbfd988288896d09a65c4609411242012f16))
- **storybook:** adjust installation docs about generator ([0403ace](https://github.com/nartc/angular-three/commit/0403ace9eecb62f3320d39594e7d357ddbd454b3))
- **storybook:** change API to Core API ([b6bf1ac](https://github.com/nartc/angular-three/commit/b6bf1acefb23d1f1fc012b7b8f8805449d9f6ab3))
- **storybook:** use soba-orbit-controls ([67e6fa9](https://github.com/nartc/angular-three/commit/67e6fa9c1753627e44ad602a287c9586923f898e))

### [2.0.6](https://github.com/nartc/angular-three/compare/2.0.5...2.0.6) (2021-12-06)

### Bug Fixes

- **core:** log to let consumers know to install the packages instead ([31fb1d9](https://github.com/nartc/angular-three/commit/31fb1d9413abcf3410fac7c60bdfc12e4f046f38))

### [2.0.5](https://github.com/nartc/angular-three/compare/2.0.4...2.0.5) (2021-12-06)

### Bug Fixes

- **core:** move nrwl/devkit to dependencies instead ([deb22fa](https://github.com/nartc/angular-three/commit/deb22fa5a10ee67effed24689dad15a1322ed432))

### [2.0.4](https://github.com/nartc/angular-three/compare/2.0.3...2.0.4) (2021-12-06)

### Bug Fixes

- **core:** add nrwl/devkit as devDependencies ([ed9273c](https://github.com/nartc/angular-three/commit/ed9273cc87c23a9a2bff158b5d27b18f947f9059))

### [2.0.3](https://github.com/nartc/angular-three/compare/2.0.2...2.0.3) (2021-12-06)

### Bug Fixes

- **core:** expose generators via schematics in packageJson ([ab65903](https://github.com/nartc/angular-three/commit/ab6590346adda106fcac662a8d5f03e4ccc72584))

### [2.0.2](https://github.com/nartc/angular-three/compare/2.0.1...2.0.2) (2021-12-06)

### Bug Fixes

- **core:** add ng add ([9f871d3](https://github.com/nartc/angular-three/commit/9f871d3563b3f0e92048a816297f4fbb3a3d9c89))
- **core:** adjust DI for stats ([655cb78](https://github.com/nartc/angular-three/commit/655cb7845c423111843df70222d6cf9971abc510))
- **core:** expose NgtResize ([9116b13](https://github.com/nartc/angular-three/commit/9116b13127f97c880b935a8a4fd0748ef06b46bf))

### Documentations

- **repo:** clean up readme ([4f22591](https://github.com/nartc/angular-three/commit/4f225912f5f36d3b2fb3030bfcb6484427947973))

### [2.0.1](https://github.com/nartc/angular-three/compare/2.0.0...2.0.1) (2021-12-06)

### Bug Fixes

- **cannon:** call the correct function ([84a8377](https://github.com/nartc/angular-three/commit/84a83776ff16bff0bb8c51bdae9894bef0336331))
- **cannon:** initialize object with a new Object3D because it still can be constrained ([63d5d03](https://github.com/nartc/angular-three/commit/63d5d0382e05cb6bc3cf910c3241c27604172cb6))
- **cannon:** initialize Physics world as soon as possible instead of AfterContentInit ([afe1847](https://github.com/nartc/angular-three/commit/afe1847b2f0d9fa90ec8b97bcf53dc143cee32e8))
- **core:** make ContentGeometry static. Geometry needs to be statically available for the mesh ([f7197d1](https://github.com/nartc/angular-three/commit/f7197d13c681a726cc9152f56f73d3b96dca11e3))
- **core:** move OBJECT_TYPE token back into its controller. fix Line import ([40878d2](https://github.com/nartc/angular-three/commit/40878d256eb376a0f6d84c15304671254b7605cf))
- **core:** remove faulty DI token in InstancedMesh ([fc9b096](https://github.com/nartc/angular-three/commit/fc9b096d7b9644fd51885acb51ae1976ff501f3b))
- **core:** remove faulty DI token in Mesh ([09e8834](https://github.com/nartc/angular-three/commit/09e8834f7f7dab13036553751fa460c17437208f))
- **core:** rename Canvas's pointermissed to pointerMissed ([999dfad](https://github.com/nartc/angular-three/commit/999dfad07f829fe10f33bc6060f8ae13fc1d8ebc))
- **core:** revert static on ContentChild NgtGeometry ([db09f8b](https://github.com/nartc/angular-three/commit/db09f8bd3792f77387ac178288610110ed0c0a15))
- **core:** use AfterContentInit for NgtSkeleton instead of OnInit for consistency ([523573b](https://github.com/nartc/angular-three/commit/523573bfcfd33978ba40b11970c353d9f9d141aa))
- **postprocessing:** initialize EffectComposer in ngOnInit instead of AfterContentInit ([3816207](https://github.com/nartc/angular-three/commit/381620781a7f7c7a1322ec8145ff9cd5973f564b))
- **postprocessing:** move NGT_EFFECT_TYPE token to beginning of file ([83fb115](https://github.com/nartc/angular-three/commit/83fb11553e77bed74a040d4703c1eb0109e041e2))

### Cleanup

- **cannon:** clean up body store ([8ba22fd](https://github.com/nartc/angular-three/commit/8ba22fda06e081a74fbb3ffafc3e6bd35ab02ae2))
- **repo:** rename all Effects to omit the Effect name ([9dbc813](https://github.com/nartc/angular-three/commit/9dbc813fcf3a6c0e3136dc67e0f46dba5e515718))

### Documentations

- **demo:** use random color instead of 17 ([8de3cfa](https://github.com/nartc/angular-three/commit/8de3cfa88fda97d2ff3af98f477f31576bb4ee97))
- **repo:** add CONTRIBUTING guide ([d44dd00](https://github.com/nartc/angular-three/commit/d44dd00b07c4fc79cbfc3b4ae9b9f2fa92a16759))
- **storybook:** add more steps to first scene ([86fa9ff](https://github.com/nartc/angular-three/commit/86fa9ff689be2a25d9f0840528668aab8bdd1380))

## [2.0.0](https://github.com/nartc/angular-three/compare/2.0.0-beta.11...2.0.0) (2021-12-05)

### Features

- **repo:** add missing GENERATED comment to some generators ([c90bea9](https://github.com/nartc/angular-three/commit/c90bea9930b69c229fd9daa70bcf88a104e934c4))

### Bug Fixes

- **cannon:** fix DI token ([4154797](https://github.com/nartc/angular-three/commit/41547975372a24cdb40e67da5b41464809248082))
- **core:** adjust DI token (remove null) ([ed5277c](https://github.com/nartc/angular-three/commit/ed5277c3c3b9bf8afdcfc0654bdb1a040aa41785))
- **core:** ensure clear method is available before invoking ([e9694e7](https://github.com/nartc/angular-three/commit/e9694e7c6e9ee1768a91ba9b76c50c13d22445cc))
- **core:** handle vr by setAnimationLoop on the renderer if it's true ([694255f](https://github.com/nartc/angular-three/commit/694255fad0005f0a1ad6a04ac3e193b0de5bad4e))
- **core:** misplace return statement, and frames start out at 1 ([6682f52](https://github.com/nartc/angular-three/commit/6682f52c3d3368989332ccbcfb0d43c30ce77cad))
- **core:** remove InjectionToken from material-geometry-controller template ([c8930af](https://github.com/nartc/angular-three/commit/c8930af424c10794673beed2899acf8b59dd2dcf))
- **postprocessing:** move InjectionToken to beginnig of file ([3e2742f](https://github.com/nartc/angular-three/commit/3e2742fb920c532b2f838334427a6df9f22640a2))
- **soba:** return the correct controls for Orbitcontrols ([4e5f4fb](https://github.com/nartc/angular-three/commit/4e5f4fb76eed0bbbb0a8ca42e71d8c9e50de1918))

### Documentations

- **demo:** clean up ([73ed59c](https://github.com/nartc/angular-three/commit/73ed59c132ee8afcef5ca1bb4fdb1526f65aaf79))
- **repo:** add peerDeps to soba and postprocessing README ([aa7a8ab](https://github.com/nartc/angular-three/commit/aa7a8aba5c5eb38f02cd0bcb2ed407c6c728db96))
- **storybook:** add meta tags to manager-head ([bc1effa](https://github.com/nartc/angular-three/commit/bc1effa533c85cefc4203cbb4573676a04330ba0))
- **storybook:** adjust the examples to show story mode on activated ([7a715af](https://github.com/nartc/angular-three/commit/7a715af909bf7a86b6aaebb7ca9feebc499c4cde))
- **storybook:** make simple cube more interesting with lights ([d578651](https://github.com/nartc/angular-three/commit/d5786516313e8fa024e9835e2f776580ecdc4cf3))
- **storybook:** reorganize and add examples from demo to storybook as Examples ([6a50c80](https://github.com/nartc/angular-three/commit/6a50c80639fee5a80cd75d792586302ae230a23e))

## [2.0.0-beta.11](https://github.com/nartc/angular-three/compare/2.0.0-beta.10...2.0.0-beta.11) (2021-12-04)

### Bug Fixes

- **cannon:** expose missing api models ([edb276c](https://github.com/nartc/angular-three/commit/edb276c9e6585f917b181f2bd236ec775a7bdfdb))

## [2.0.0-beta.10](https://github.com/nartc/angular-three/compare/2.0.0-beta.9...2.0.0-beta.10) (2021-12-04)

### Features

- add and adjust generators ([5e1a34c](https://github.com/nartc/angular-three/commit/5e1a34cb4ac6226056c39ff136563a7bc30527f9))
- **cannon:** add Constraint controller ([d47f189](https://github.com/nartc/angular-three/commit/d47f18945b083a9b72f5d04a68f0b99f547e7e12))
- **cannon:** add constraints ([a5403da](https://github.com/nartc/angular-three/commit/a5403dadff16d8959b2e5834ddcdfdf4790e3d1d))
- **cannon:** add constraints generator ([9444d98](https://github.com/nartc/angular-three/commit/9444d980cb8a51d374389717eecbc3f9655e62d9))
- **cannon:** add Debug ([ebffbc1](https://github.com/nartc/angular-three/commit/ebffbc18540d3a6df3259a9232ad53cc9814fcef))
- **cannon:** add generator for bodies ([de9dafe](https://github.com/nartc/angular-three/commit/de9dafeb74e566ef1ef9fdd99ab6b859237d199d))
- **cannon:** add physic bodies ([7d947fc](https://github.com/nartc/angular-three/commit/7d947fccabf0a50b6aa84ef013635b7e23116df1))
- **cannon:** add physicbody ([1770faa](https://github.com/nartc/angular-three/commit/1770faafbc142597a199d4f72ee943f0ad895a5d))
- **cannon:** add physics store ([b85bf6b](https://github.com/nartc/angular-three/commit/b85bf6b2b2d176c83b6c4d98f29d32e7d8d1aa97))
- **cannon:** clean up debug 2ndentry point ([fad35da](https://github.com/nartc/angular-three/commit/fad35dadaacbd493c0b08f63b36b81afde1a86e5))
- **cannon:** init cannon lib ([a8e48e2](https://github.com/nartc/angular-three/commit/a8e48e2763712a6586bb9be87218cdd815ea12f4))
- **cannon:** move bodies to body ([b4fb48f](https://github.com/nartc/angular-three/commit/b4fb48fffe81e865ce5466f3afa76f12c8130946))
- **cannon:** move debug in cannon lib ([f25156b](https://github.com/nartc/angular-three/commit/f25156b20e0309cb20080064376627c0e32c0204))
- **cannon:** port web worker and models ([c60cf1c](https://github.com/nartc/angular-three/commit/c60cf1c7c22abbbda21ccc10c4f5b9831072049d))
- **cannon:** remove Debug as a 2nd entry point ([976d590](https://github.com/nartc/angular-three/commit/976d5907eac155e5025ee0708381dc6265df28aa))
- **cannon:** working ([acd4611](https://github.com/nartc/angular-three/commit/acd461157bb330483b4f5ac7496537f06e4ff3fa))
- **core:** add attributes ([7b8b82e](https://github.com/nartc/angular-three/commit/7b8b82e4d50fb488156dc7d21c42ca6a9a9e6225))
- **core:** add attributes generator ([cf41a01](https://github.com/nartc/angular-three/commit/cf41a0142018c8b9ba3b4c572fbec182239bc033))
- **core:** add audio and controllers generators ([6f483db](https://github.com/nartc/angular-three/commit/6f483dbe113e50ef7cf8fa7cf02c20a5639afd13))
- **core:** add audios and update controllers ([a8df7ca](https://github.com/nartc/angular-three/commit/a8df7cabdc967120702933682e6f2485ce52a4d8))
- **core:** add cameras ([56fcaaf](https://github.com/nartc/angular-three/commit/56fcaaf479eb68f7489beb3b03a32219126ec1a8))
- **core:** add cameras generator ([1cc074a](https://github.com/nartc/angular-three/commit/1cc074aaa66039d34b56cbc0a848b39bd1a94504))
- **core:** add ColorPIpe ([cd9f8b7](https://github.com/nartc/angular-three/commit/cd9f8b78c67834a89064a46e635e656c1c6086b8))
- **core:** add controls to store ([8444d57](https://github.com/nartc/angular-three/commit/8444d5725b9c699dba3b6abc4898f4c7ab69b970))
- **core:** add core ([beab7a1](https://github.com/nartc/angular-three/commit/beab7a1ed4d1e1349be3936c8570a09908622355))
- **core:** add curves ([e256044](https://github.com/nartc/angular-three/commit/e256044713e409e0a51d172583ebdf8314d0446e))
- **core:** add curves generator ([1e83dd1](https://github.com/nartc/angular-three/commit/1e83dd1fda44469475961cf84307868b9556327d))
- **core:** add geometries ([2962b8c](https://github.com/nartc/angular-three/commit/2962b8c18cd9634294ef2f7591445d45abbc00f1))
- **core:** add geometries generator ([2f5a100](https://github.com/nartc/angular-three/commit/2f5a100cbed52cd89fb86e1f9530a52d96be45df))
- **core:** add helpers ([c7e745d](https://github.com/nartc/angular-three/commit/c7e745d15e2b8ff00cfe11432debb4fdbf95293e))
- **core:** add helpers generator ([99aada2](https://github.com/nartc/angular-three/commit/99aada24d8b15bb3ac5d293b6d43df17cbc5769e))
- **core:** add lights and update controllers ([8269383](https://github.com/nartc/angular-three/commit/82693833fd82a31d281a5172a763ac5cc80f8007))
- **core:** add lights generator ([2389acb](https://github.com/nartc/angular-three/commit/2389acbd141f520e948fed2c1ff7e14dc9efb806))
- **core:** add lines ([d5e83c4](https://github.com/nartc/angular-three/commit/d5e83c4df44695229d7bde58e652db02ff56eb07))
- **core:** add lines generator ([27fe761](https://github.com/nartc/angular-three/commit/27fe7617cdf6a1695c78616e3b8dc0777d7c2d8a))
- **core:** add materials ([29e9627](https://github.com/nartc/angular-three/commit/29e9627bd25cb44926c2d32db25f66743002eb91))
- **core:** add materials generator ([34e229a](https://github.com/nartc/angular-three/commit/34e229ada5babd05c69fbea8c7e8cb45cb80a3ef))
- **core:** add MathPipe ([d095dee](https://github.com/nartc/angular-three/commit/d095dee397ae38cd66964c01965015128a501a60))
- **core:** add NGT_IS_WEBGL_AVAILABLE token ([1d6e4bc](https://github.com/nartc/angular-three/commit/1d6e4bca9c8728effdb1012618f9bb33f75a3677))
- **core:** add primitive ([8aa055c](https://github.com/nartc/angular-three/commit/8aa055cf9fa5e9f89b077f8b84c5c71965c64fc9))
- **core:** add sprites ([4e7121d](https://github.com/nartc/angular-three/commit/4e7121d80a6e4c07b0d7ccea2b36cba8c9139084))
- **core:** add sprites generator ([bcbc94a](https://github.com/nartc/angular-three/commit/bcbc94ae05e1c686d45d45465fe0b6850a5466e1))
- **core:** add textures ([e2adf00](https://github.com/nartc/angular-three/commit/e2adf007d66275ae0ac5ad92cb3fa7371208a2db))
- **core:** add textures generator ([5409e7a](https://github.com/nartc/angular-three/commit/5409e7a5417c23a175ad048026bbab156d3b74c7))
- **core:** add vector pipes ([3f9172f](https://github.com/nartc/angular-three/commit/3f9172fdc8ec993efd87e82cb5374c7b26386dd3))
- **core:** adjust controllers ([47f708d](https://github.com/nartc/angular-three/commit/47f708d61de95c6ab43a5de76a8888f1dda506e0))
- **core:** init three generator ([bf1c6b2](https://github.com/nartc/angular-three/commit/bf1c6b232ec5da55eda41ee920858529a03bd1bc))
- **core:** ready to start core generators ([7adf33d](https://github.com/nartc/angular-three/commit/7adf33d3c5f9d1f61d068c7e61371716fe638e02))
- **core:** rework core stores/services ([eaef129](https://github.com/nartc/angular-three/commit/eaef129bc69188950da3dc4ae0ff760ae1fc0125))
- **core:** separate material and geometry into controller ([5bac610](https://github.com/nartc/angular-three/commit/5bac61096d95cc3692a1be2ce4ed4184467935b3))
- **postprocessing:** add postprocessing ([4635d17](https://github.com/nartc/angular-three/commit/4635d17a69268aad175dcfe73a465a8d33b6c248))
- **postprocessing:** add postprocessing ([ebc5742](https://github.com/nartc/angular-three/commit/ebc5742c4f0c02e81ae300aed1e6043ddaa3e316))
- **postprocessing:** add simple effects ([48812fb](https://github.com/nartc/angular-three/commit/48812fb4086ef2c37e91c2fe3aa4f0db6a7793ad))
- **postprocessing:** handle blendFunction correctly in simple effect generator ([16a128a](https://github.com/nartc/angular-three/commit/16a128a31e8f5b6e29b729a88583c5fee61768c7))
- rerun object3d generator ([7203ff7](https://github.com/nartc/angular-three/commit/7203ff7eadd14c0be75ebde4ce25106f67a2aa52))
- **soba:** add all soba shapes shortcut for THREE core (examples are missing) ([31afcbf](https://github.com/nartc/angular-three/commit/31afcbfcf6b55b14154af04d4123bd849248034d))
- **soba:** add GizmoHelper ([857e598](https://github.com/nartc/angular-three/commit/857e5987475ec5dd2a7fab6d323af75853207b32))
- **soba:** add GizmoViewcube ([8672493](https://github.com/nartc/angular-three/commit/8672493ad6df4a940dce39eb943828cc7e5a28ed))
- **soba:** add GLTF and Texture loaders ([8733e17](https://github.com/nartc/angular-three/commit/8733e17baee45eca856a560deefff724102f00c2))
- **soba:** add OrbitControls ([8940891](https://github.com/nartc/angular-three/commit/894089140020c80fec66171288bf529292585215))
- **soba:** add shapes and extender ([c50e79f](https://github.com/nartc/angular-three/commit/c50e79f7230f1d83019e40918f1001aa31caddf8))
- **soba:** init soba ([33a7e24](https://github.com/nartc/angular-three/commit/33a7e247f14723caf0985aaaf98866691e33f669))
- **soba:** soba shapes generator ([4d75383](https://github.com/nartc/angular-three/commit/4d753838c81c2bd746232797cddfe384b8fe7c83))
- **storybook:** add Storybook ([f00775b](https://github.com/nartc/angular-three/commit/f00775b16122465282ee9233552eff8819b4974e))

### Bug Fixes

- add gizmo-helper and orthographic from soba to object-3d template ([5e7baad](https://github.com/nartc/angular-three/commit/5e7baad8d9c1302324a8b846f800bfc2b60e9842))
- **cannon:** ensure objectInputs changes start the pipeline ([5723649](https://github.com/nartc/angular-three/commit/57236495b4706e7b0b95409429f4fdfc9d41a177))
- **cannon:** import propsToBody with allowJs ([2446d59](https://github.com/nartc/angular-three/commit/2446d59072426140b733ce73311d2b632da819f6))
- **cannon:** init in contentInit ([7aed7e0](https://github.com/nartc/angular-three/commit/7aed7e0096895e827c6c6b10f037f9098f8bede3))
- **core:** add controls to canvasStore ([dd335db](https://github.com/nartc/angular-three/commit/dd335dbb7da6c13102f11079138fcf8a77850f8e))
- **core:** add input to instanced mesh to pass in the count ([9437e5f](https://github.com/nartc/angular-three/commit/9437e5feb17d120bfdc9a488b760a85311a4845c))
- **core:** adjust controllers generator ([a4d8e4e](https://github.com/nartc/angular-three/commit/a4d8e4ee6d97f2e91b9f2bf248f337147a850efc))
- **core:** change wheel events to passive:false to prevent errors from OrbitControls ([c6c44df](https://github.com/nartc/angular-three/commit/c6c44df3a55a343aa5714ad99588245821a2cc89))
- **core:** check for null value in applyProps ([b8b03a4](https://github.com/nartc/angular-three/commit/b8b03a492a57c3a879d5399f4c87c667e87f91e1))
- **core:** check null for updateMatrix before calling ([29a88c7](https://github.com/nartc/angular-three/commit/29a88c7021af3093984b54d7dd2bc3bbd0ee4a54))
- **core:** include pipes in CoreModule ([61762a4](https://github.com/nartc/angular-three/commit/61762a44d57fb66889c4e0d698da9e3fa0923eb9))
- **core:** loosen dispose type on object3dinputs ([83da907](https://github.com/nartc/angular-three/commit/83da9073e410fff27d016b892546b4b1dbb3aa80))
- **core:** make private functions in stores truly private ([01cb201](https://github.com/nartc/angular-three/commit/01cb20130e1bfe2968f94c886978c03303b23dff))
- **core:** make sure intensity is default to 1 ([fc2499e](https://github.com/nartc/angular-three/commit/fc2499edd9f57e8e2ee4adc71ce55813ef391874))
- **core:** move frames to loopService instead of Store ([c0b34f9](https://github.com/nartc/angular-three/commit/c0b34f9dbd4b663bde0bad8a69c9230fbe96956d))
- **core:** move NGT_OBJECT_TYPE tokens to a file ([7272c5c](https://github.com/nartc/angular-three/commit/7272c5c155694f4dbf0dddc50c0e2d0977f7db62))
- **core:** relaxing dispose type on object3dprops ([085ef3a](https://github.com/nartc/angular-three/commit/085ef3a0d861924025ec672adbd2dc006e1bb8cd))
- **core:** remove null union from DI ([53d0187](https://github.com/nartc/angular-three/commit/53d0187f43202cb77302432e4b452b628ab9adb8))
- **core:** run object3d init in afterContentInit after content has resolved ([5dd4194](https://github.com/nartc/angular-three/commit/5dd41943f7d1b992d6a0f72a4e1b4b6df2610b83))
- **core:** test soba-box ([91f8680](https://github.com/nartc/angular-three/commit/91f8680b39f63d2241f75e98e8827460b6afb2af))
- **core:** update controllers generator to reflect manual changes ([0b855ee](https://github.com/nartc/angular-three/commit/0b855eee17b3d65907241f3cadf2687ec83e6ce2))
- **soba:** adjust strict template ([9da9d53](https://github.com/nartc/angular-three/commit/9da9d53e68dd3c86c9d4ff8be89267920398bbab))
- **soba:** assign enableDamping to OrbitControls ([4944b06](https://github.com/nartc/angular-three/commit/4944b06519b31f3a41aa46bcb77307a7b28dad60))
- **soba:** extends OrthographicCamera with SobaExtender and propagate ready/animateReady ([ee56d8b](https://github.com/nartc/angular-three/commit/ee56d8b1e90098468a5254127edba91e244ed2d5))
- **soba:** remove animateReady from inline mesh in shape ([9d686db](https://github.com/nartc/angular-three/commit/9d686dbb7cb00c9a0299e4b50eeed296dda025d0))
- **soba:** run ready outside of Zone ([04faf45](https://github.com/nartc/angular-three/commit/04faf45bd84832f916a9203535f3b4401fdbfd6d))

### Documentations

- add [@barbados-clemens](https://github.com/barbados-clemens) as a contributor ([8f234ff](https://github.com/nartc/angular-three/commit/8f234fffeb211130a5ddad064cd8f0feacb68096))
- **demo:** add CompoundBody ([fedf608](https://github.com/nartc/angular-three/commit/fedf608d8b0761e8d0658a5f4aa1b137d60a1fd7))
- **demo:** add kinematic cube demo ([721d485](https://github.com/nartc/angular-three/commit/721d48580f52d953db1e81b972e4a7166c067f9e))
- **demo:** add some effects demo ([d493627](https://github.com/nartc/angular-three/commit/d4936275a3581a6fd83b2be0fec9709221678c05))
- **demo:** add stats to compound ([17cc984](https://github.com/nartc/angular-three/commit/17cc9846e01f9dc8b3b9fa2f1b3e90f1edde7253))
- **demo:** play around with core ([a38179f](https://github.com/nartc/angular-three/commit/a38179fa448737e921617a4e28937abf6069ec35))
- **demo:** play with orbit controls ([b3aac21](https://github.com/nartc/angular-three/commit/b3aac2167f23f6b42704b3f6d4d5821267945d24))
- **demo:** remove active click on kinematic ([64bf3b0](https://github.com/nartc/angular-three/commit/64bf3b03397ff208ed4860b0cdd1cd239f6bf7ff))
- **demo:** use keen-bloom ([fc593d0](https://github.com/nartc/angular-three/commit/fc593d082ff88dafebcf941bf9185171a4706ca0))
- **repo:** add README ([34a06aa](https://github.com/nartc/angular-three/commit/34a06aa014e3c613664c3ee60d98b7ec78b75008))
- **storybook:** add API docs layout ([d8c98aa](https://github.com/nartc/angular-three/commit/d8c98aab018440b40d3f57d2c8f28be3ff44c426))
- **storybook:** add setup canvas decorator wrapper ([31354e1](https://github.com/nartc/angular-three/commit/31354e1bff32ea57169482dfd292fbfdfc5a09ea))
- **storybook:** initial docs ([915c82a](https://github.com/nartc/angular-three/commit/915c82ae6850269dcdd597dff2aa79f87eac0109))
- **storybook:** layout a path forward to add docs ([7bc4c1e](https://github.com/nartc/angular-three/commit/7bc4c1e8ad7ac7e23ea520cb93518ad87ed65763))

## [2.0.0-beta.9](https://github.com/nartc/angular-three/compare/2.0.0-beta.8...2.0.0-beta.9) (2021-11-25)

### Features

- **soba:** add Environment ([8114e37](https://github.com/nartc/angular-three/commit/8114e37c95b0c1b1f06707c7915d21bbebe29786))
- **soba:** init cameras secondary ([0addf06](https://github.com/nartc/angular-three/commit/0addf060a2a49cf051e6f589d9cd77d877d0d42f))
- **storybook:** add storyboo ([793d415](https://github.com/nartc/angular-three/commit/793d415cb97c216ca943ae021ce4333c063c7397))

### Bug Fixes

- **core:** ensure to only listen for specific prop on canvas internal ([db52245](https://github.com/nartc/angular-three/commit/db5224554f83ecf357c1a13be686d566ccdd0a8e))

### Documentations

- **storybook:** add compodoc for controls ([82c568f](https://github.com/nartc/angular-three/commit/82c568f4c38566418c9c693a503380761c66395f))

## [2.0.0-beta.8](https://github.com/nartc/angular-three/compare/2.0.0-beta.7...2.0.0-beta.8) (2021-11-24)

### Bug Fixes

- **soba:** readd shapes ngPackage ([7326c94](https://github.com/nartc/angular-three/commit/7326c94010fbb27083fdc272570a7f9cbe85bd38))

## [2.0.0-beta.7](https://github.com/nartc/angular-three/compare/2.0.0-beta.6...2.0.0-beta.7) (2021-11-24)

### Features

- add soba shapes generator ([9eaaa8d](https://github.com/nartc/angular-three/commit/9eaaa8dbf5159994fd1cd58672b332df75ab7969))
- **soba:** add all Shapes ([1499d09](https://github.com/nartc/angular-three/commit/1499d0983fe3c23f62b7ad8140b6328929cfe6c2))
- **soba:** add Billboard ([320d4ed](https://github.com/nartc/angular-three/commit/320d4ed44f3f830c014e999d0c13f842c7087024))
- **soba:** init shapes ([ff6b141](https://github.com/nartc/angular-three/commit/ff6b14166f4d32daba09a4146e143d8347d78c84))

### Bug Fixes

- adjust generators ([7aff31f](https://github.com/nartc/angular-three/commit/7aff31f7b99c9799c988540503d8ba59a671c206))
- adjust soba shapes selectors generator ([125b491](https://github.com/nartc/angular-three/commit/125b49189d93406ffca4cb6895709b3ddf9e4f0f))
- adjust soba template with ngIf ([7c0ba91](https://github.com/nartc/angular-three/commit/7c0ba918b34ab75b6c78c4599b10adb03399088e))
- **core:** make sure material query look at descendants as well ([f0be3f1](https://github.com/nartc/angular-three/commit/f0be3f1aec21ed4f99815f9b303102e2328f095d))
- **core:** use the correct object3dController in Object3d class; ([4b39ecf](https://github.com/nartc/angular-three/commit/4b39ecfcc270baa130e29891850b4c7d5cd840c7))
- make sure to import CommonModule for ngIF ([2f3d4c2](https://github.com/nartc/angular-three/commit/2f3d4c2fd40050112d11b9376f9334fb43f6076c))
- **soba:** expose Group in Billboard for appending ([15ccc22](https://github.com/nartc/angular-three/commit/15ccc22f0f36adefff0b4b341ac3e95f7af614a3))
- **soba:** remove ng-content and use [material] on mesh instead ([2dae492](https://github.com/nartc/angular-three/commit/2dae4924ea320b20f5123ac7b567a05ed90840fa))
- **soba:** rerun soba shape generator with commonModule ([5ed26dd](https://github.com/nartc/angular-three/commit/5ed26dd47bee4fca1f50e8033be6c76d0d057371))
- **soba:** rerun soba shape generators with ngIf ([0c42ea0](https://github.com/nartc/angular-three/commit/0c42ea046adaf81f4b6a499be6aae54c38c4e831))
- **soba:** update shapes with generator ([e8a26b1](https://github.com/nartc/angular-three/commit/e8a26b12bf6ffbb9672722e3cf3f8d2fd2694aca))

### Documentations

- **demo:** testing billboards ([043d393](https://github.com/nartc/angular-three/commit/043d39355d8eed5c8ea5a0cb7bfa413d47bdb3fa))

## [2.0.0-beta.6](https://github.com/nartc/angular-three/compare/2.0.0-beta.5...2.0.0-beta.6) (2021-11-23)

### Features

- **core:** add AudioController ([b01b8fb](https://github.com/nartc/angular-three/commit/b01b8fb85e6f7e4147afb642e7e7ae2874aea12a))
- **core:** expose AudioController ([b387f2e](https://github.com/nartc/angular-three/commit/b387f2e5a1674d2968acbd7b68b2f1ee93e22791))
- **soba:** add PositionalAudio component ([1fb916c](https://github.com/nartc/angular-three/commit/1fb916cb902c0d9ca77ea800a2f66138f6e56d58))

### Bug Fixes

- add additionalSobaSelectors to object-3d generator ([1e20bc9](https://github.com/nartc/angular-three/commit/1e20bc966ce6302198a469078b07d5ca54b0b411))
- adjust core-entity generator for AudioController ([490e705](https://github.com/nartc/angular-three/commit/490e7050f280f58002111cb13a33e3eec39a8c3e))
- **core:** add updaters to enhanced store and have canvas store use those ([5925b25](https://github.com/nartc/angular-three/commit/5925b25218a3ff639b6a2b038038659f72ed6ce8))
- **core:** make sure to reconstruct geometry on args changed ([d3e1ae4](https://github.com/nartc/angular-three/commit/d3e1ae4ab5f044cbd621106a73a0653cb6942f04))
- **core:** move props assign to abstract Controller; have the sub controllers provide a list of props to assign instead ([47184bd](https://github.com/nartc/angular-three/commit/47184bd1f6ba9fe79162259350a22a2622a31b39))
- **core:** rename controller to object3dController for clearer intent ([f58f682](https://github.com/nartc/angular-three/commit/f58f682fcda676427b6fb99580b1433eb6a90799))
- **core:** use the updaters from enhanced store for updaters ([2ef1a2e](https://github.com/nartc/angular-three/commit/2ef1a2e1e44796720dd1e67e8583239f52c7148a))
- **soba:** adapt LineController to the new Controller ([139098f](https://github.com/nartc/angular-three/commit/139098f513dacbc2f9efb94f7fb2f1293d4caaa7))

## [2.0.0-beta.5](https://github.com/nartc/angular-three/compare/2.0.0-beta.4...2.0.0-beta.5) (2021-11-23)

### Features

- **core:** clean up core generators ([b1a9829](https://github.com/nartc/angular-three/commit/b1a98293bad9e1012f800ae7aa5027568f22081a))

### Bug Fixes

- **soba:** fix image shader material due to change to NgtMaterial ([4a63397](https://github.com/nartc/angular-three/commit/4a63397d3274654a1eb4ff19333a8f278d7abcb9))

## [2.0.0-beta.4](https://github.com/nartc/angular-three/compare/2.0.0-beta.3...2.0.0-beta.4) (2021-11-22)

## [2.0.0-beta.3](https://github.com/nartc/angular-three/compare/2.0.0-beta.2...2.0.0-beta.3) (2021-11-22)

### Features

- add cubic bezier line to object3d ([b44a5f4](https://github.com/nartc/angular-three/commit/b44a5f4af2edcfccefeabeb5c9e58241b28630fa))
- add ngt-soba-line to object-3d template ([e425911](https://github.com/nartc/angular-three/commit/e425911ac7d3b870ec790a5bdfb5c33f7072d7a4))
- add ngt-text and ngt-image to object-3d-controller template ([e4932b6](https://github.com/nartc/angular-three/commit/e4932b65be0e440bea86677674c8d4eaffd8df34))
- add QuadraticBezierLine to object3d controller ([49b6c7c](https://github.com/nartc/angular-three/commit/49b6c7c7cfa6ae3147f3dfa9465bac62e9c4cbe1))
- adjust object3dcontroller template ([c761430](https://github.com/nartc/angular-three/commit/c7614307bab29efb4c593aad726e1483e9860044))
- **core:** abstract Controller ([aa4d285](https://github.com/nartc/angular-three/commit/aa4d285bf63b815c1364dcea54e58995b1764b2d))
- **core:** add [controller] to Object3dController so that it can accept the whole controller for easy merging inputs ([6eae231](https://github.com/nartc/angular-three/commit/6eae23134ccf7d3932b5a45cf3e7e83721eb0f16))
- **core:** add ready output to geometry, material, and texture ([4a1cf22](https://github.com/nartc/angular-three/commit/4a1cf221e6680693c6a8a627203268773476655e))
- **core:** ensure the THREE entities also added to DI with their abstract token ([a4b1bb6](https://github.com/nartc/angular-three/commit/a4b1bb6aebb96bb490f1c46ccdd44803e793fa7d))
- **core:** expose buildGraph util ([7ab8588](https://github.com/nartc/angular-three/commit/7ab8588cf26b53680d2dbfc125930cf71cb78664))
- **soba:** add CubicBezierLine ([a11526d](https://github.com/nartc/angular-three/commit/a11526d4c8b2a6d3323d8182fe4bdad73d963bd3))
- **soba:** add NgtSobaLine ([1604279](https://github.com/nartc/angular-three/commit/160427959933b1d066f896689be0462d39c8c64e))
- **soba:** add QuadraticBezierLine ([68c108c](https://github.com/nartc/angular-three/commit/68c108c150207d01e414e3a05239390e52f6a49d))
- **soba:** add soba lib ([d113bca](https://github.com/nartc/angular-three/commit/d113bca73b77402e63cc478285e1d2a586fef80b))
- **soba:** add SobaLineController for abstraction ([2181e96](https://github.com/nartc/angular-three/commit/2181e9692d576b912689c3df84635b1a16113b69))
- **soba:** add Text component ([46b1dae](https://github.com/nartc/angular-three/commit/46b1dae5045a6a39a86aa4c756d768b97988c381))
- update core peerDep ([9b6c3d5](https://github.com/nartc/angular-three/commit/9b6c3d50443685bae3dcef0fb58483daf2de81c9))
- update peerDep on Angular ([dfc77e1](https://github.com/nartc/angular-three/commit/dfc77e1cb04def0f7e53b6236a7ace0e8806db14))

### Bug Fixes

- **core:** add NgtCurrentViewport type alias for reuse ([483380b](https://github.com/nartc/angular-three/commit/483380b69c655c40ed24bc717f0d9ad053270242))
- **core:** change how getImperativeState() get the state from ([0a3e678](https://github.com/nartc/angular-three/commit/0a3e678e6bf63248146c6ac045be20227882ee1b))
- **core:** make sure intensity on Light is set correctly if passed in ([b96aa5e](https://github.com/nartc/angular-three/commit/b96aa5eb9bd40aa8d145004837c5b6afd6200da9))
- **core:** make sure primitive provides the underlying object3d for NgtObject3d instead of itself ([19d59ed](https://github.com/nartc/angular-three/commit/19d59ed3e4943522a8ab7e4dd33d9b5326425322))
- **core:** move buildGraph to a util fn ([8c2f8d1](https://github.com/nartc/angular-three/commit/8c2f8d1583f50033a75785b05092c4e6399d7ef6))
- **core:** reset attribute to default value if it's there on destroy ([09da731](https://github.com/nartc/angular-three/commit/09da731db99d2e7c54c20b1923fff2c57fa96fb1))
- **soba:** make sure lineController forward all props from passed in lineController ([ed602c9](https://github.com/nartc/angular-three/commit/ed602c9e3f95a2d18204a0ef0f7f4465766fdb5e))
- **soba:** rename image.directive to image.component ([03425af](https://github.com/nartc/angular-three/commit/03425af2ec494c9094fbbd35613eca721f951450))
- **soba:** rename NgtImage to NgtSobaImage ([c00acdc](https://github.com/nartc/angular-three/commit/c00acdc9371a727dbfef77dc683211f9fd340082))
- **soba:** rename NgtText to NgtSobaText ([1d716c6](https://github.com/nartc/angular-three/commit/1d716c6bfa182629e262f6b482a157d2d8926251))
- **soba:** use aliases for THREE types ([064b585](https://github.com/nartc/angular-three/commit/064b58500ea6622e526c2de1c828060be2d46c09))
- **soba:** use line controller for quadratic line ([d8e5b41](https://github.com/nartc/angular-three/commit/d8e5b414f929bbef7793e8acafbc7c56950ff65f))
- update object-3d ([260c371](https://github.com/nartc/angular-three/commit/260c3713ac25d50d95af020b295b3821acb8b7a9))

### Documentations

- **demo:** add kinematic cube demo ([1ffccb3](https://github.com/nartc/angular-three/commit/1ffccb34c061777ab55464c6fdde35507191b334))
- **demo:** clean up ([9dd9048](https://github.com/nartc/angular-three/commit/9dd9048528acd54be55194f8bfd79b44c755a88e))
- **demo:** fix light ([ff09f02](https://github.com/nartc/angular-three/commit/ff09f023e38e8f4a32d81285303de9ad8914e573))
- **demo:** testing out Line ([d46aaa2](https://github.com/nartc/angular-three/commit/d46aaa217e0e26bc4513777d57108ee464dd51cd))
- **demo:** try vertexColors ([cb487c3](https://github.com/nartc/angular-three/commit/cb487c3fdbbb369ada32c375bd31b040c5aaf414))
- **demo:** working on banana ([701f456](https://github.com/nartc/angular-three/commit/701f4560d34e0e0a2fbb66e06314c0c2cfa22e3f))
- **docs:** wip home page ([644c7ee](https://github.com/nartc/angular-three/commit/644c7eeae46e1e7867c71a0bca89ade94b24ea49))
- try out Text ([54cc16a](https://github.com/nartc/angular-three/commit/54cc16a7a1e46393005cd1e48fa9a73a17fdc936))

## [2.0.0-beta.2](https://github.com/nartc/angular-three/compare/2.0.0-beta.1...2.0.0-beta.2) (2021-11-19)

### Features

- **cannon:** generate constraints ([a2631d0](https://github.com/nartc/angular-three/commit/a2631d0ebb7bf3192b0cccc319220f65f2ba969e))

### Bug Fixes

- adjust to angular 13 ([19a923a](https://github.com/nartc/angular-three/commit/19a923a851822f6cf085df55735b516914863b4e))
- remove packageJson generation from workspace generator ([2fee6bb](https://github.com/nartc/angular-three/commit/2fee6bb87816a42568b2654ea78dae352406e557))
- rerun generator ([3a3402a](https://github.com/nartc/angular-three/commit/3a3402a1309a29b8738d4bb900d70c10fbba8712))

### Documentations

- **demo:** add Demo app ([6ff6eb4](https://github.com/nartc/angular-three/commit/6ff6eb4a79fd18ea7eed8c06125200e04a5c2898))
- **docs:** add Docs app ([a239e84](https://github.com/nartc/angular-three/commit/a239e843527e88ce7f5a03d66bf95aa32e7fe09a))
- **docs:** move to less to use TaigaUI doc engine ([0b97086](https://github.com/nartc/angular-three/commit/0b970868e50ce31d401ec764c20e5a571d67b4f3))
- **docs:** setup docs with Taiga ([f3218b7](https://github.com/nartc/angular-three/commit/f3218b7e35c2e6570b5209159f61419686a7fd31))

## [2.0.0-beta.1](https://github.com/nartc/angular-three/compare/2.0.0-beta.0...2.0.0-beta.1) (2021-11-18)

### Features

- **cannon:** add constraints ([7532587](https://github.com/nartc/angular-three/commit/7532587bb78b81ff2f9352da957d7804aa19ed6c))
- **cannon:** generate constraints ([83d6cad](https://github.com/nartc/angular-three/commit/83d6cad1feea13c8427620b14871eae6dab72ccd))
- **core:** add VectorPipeModule ([d4ff85f](https://github.com/nartc/angular-three/commit/d4ff85fc154736f2f3005c8e4c938135ed6d4165))

### Bug Fixes

- **cannon:** regenerate constraints ([8c8af18](https://github.com/nartc/angular-three/commit/8c8af18ae3239967a62f5329d4d7dfcdbee5232d))
- **core:** add Shadow input to light ([2e44307](https://github.com/nartc/angular-three/commit/2e44307bc639b0bde7f41ee4156bdd0de021f12d))
- **core:** adjust type of shadow input for Light ([b0e2157](https://github.com/nartc/angular-three/commit/b0e2157b4804c8b87d78001037678e2d4c688c1c))
- **core:** change outputEncoding to LinearEncoding when linear is true ([c668098](https://github.com/nartc/angular-three/commit/c6680982820fa79475d3eaaa17229b7a6c005430))

### Documentations

- add [@barbados-clemens](https://github.com/barbados-clemens) as a contributor ([4b810d4](https://github.com/nartc/angular-three/commit/4b810d43ff8024aa720abc1617f80d7f162fcda3))
- play around with physics ([96602bf](https://github.com/nartc/angular-three/commit/96602bfe9c3c24e2a0577e68139846fe74ff5a76))

## [2.0.0-beta.0](https://github.com/nartc/angular-three/compare/1.0.0-beta.47...2.0.0-beta.0) (2021-11-17)

### Features

- **cannon:** add and generate bodies ([0f57684](https://github.com/nartc/angular-three/commit/0f576847e95738316648571c26e275628a720991))
- **cannon:** add box and plane ([12f3158](https://github.com/nartc/angular-three/commit/12f3158b5f14daad41f514eaf8f3931c15b3eed0))
- **cannon:** add NgtBody ([8120521](https://github.com/nartc/angular-three/commit/812052162dd610178062cef5dc838bb292e6a5b9))

### Bug Fixes

- **cannon:** expose makeTriplet ([6786dbd](https://github.com/nartc/angular-three/commit/6786dbd7a792e5a154f1c1a0883fc4d2c0fb2dac))
- **cannon:** remove unused params ([fa101a7](https://github.com/nartc/angular-three/commit/fa101a78afb875ee92935080685f418de0a84a10))
- **core:** expose Object3dProps and add alpha to canvas ([42c197c](https://github.com/nartc/angular-three/commit/42c197c14607371f9f2f9c00153ebdbdbb99fdeb))
- **core:** remove self import ([a8f0333](https://github.com/nartc/angular-three/commit/a8f0333a3a7eeef78c1a8338407835c25bc7ce38))

### Documentations

- add initial readme to all packages ([6faac0b](https://github.com/nartc/angular-three/commit/6faac0b43ab52f4d1ae3d23b7dcb75c3b3b0d810))
- **docs:** add physics demo ([8f83434](https://github.com/nartc/angular-three/commit/8f834347050359d09062913f21d54cda5747b9ab))

- ci: adjust build script (11d4a3f)

## 1.0.0-beta.46 (2021-11-16)

### Features

- add object 3d controller generator ([83c195e](https://github.com/nartc/angular-three/commit/83c195e0230fb8b1771c9b18e27c73141f8f3f78))
- add pass generator ([d87b9bb](https://github.com/nartc/angular-three/commit/d87b9bbdccf6ec3d15c9e35f646e99527ae2fe63))
- add three generator ([36ad852](https://github.com/nartc/angular-three/commit/36ad8522c8bbb150bb6eafb856dbb24c0716c243))
- **cannon:** add physics directive (wip) ([d6ff318](https://github.com/nartc/angular-three/commit/d6ff3182c95d1837850e6a3f3c3768d064b07bc9))
- **cannon:** init cannon lib ([aa3ebab](https://github.com/nartc/angular-three/commit/aa3ebaba473c0daaa0b55b2b24fa0f5715c7b36d))
- **controls:** add controls and testing out generator ([d02c7ce](https://github.com/nartc/angular-three/commit/d02c7ce3863254e6e6a03229307e4028b747141a))
- **controls:** generate all controls ([db7637f](https://github.com/nartc/angular-three/commit/db7637feb6297b3b4d77bac53459697167f9904e))
- **core:** add abstracts ([abca9b5](https://github.com/nartc/angular-three/commit/abca9b57b7eda1df1b7d979ee82ece460a710c09))
- **core:** add Audio ([7f4eda7](https://github.com/nartc/angular-three/commit/7f4eda724a4b9e46bc77def36c68d3b42ff6e710))
- **core:** add CanvasComponent ([c423223](https://github.com/nartc/angular-three/commit/c4232239ae889000a350f52572d4cc85996c68d8))
- **core:** add CanvasComponent and setup abstract componentStore ([cbf80f8](https://github.com/nartc/angular-three/commit/cbf80f82abf45670e55e262d3959ae2eddb93dda))
- **core:** add component stores ([3afb6a1](https://github.com/nartc/angular-three/commit/3afb6a18c16e04ab77385432c9eaa7417dac3707))
- **core:** add core ([d34e496](https://github.com/nartc/angular-three/commit/d34e496ab8eaa3ce64b77b158e3bcfc39bb9e7cd))
- **core:** add Cube Camera ([8c2c461](https://github.com/nartc/angular-three/commit/8c2c461973de86eff67b620f000e2b15708d3c2e))
- **core:** add Group ([5dc8f38](https://github.com/nartc/angular-three/commit/5dc8f385d75fdaea35de66e0d1db7889e573b4cb))
- **core:** add LOD ([06b928f](https://github.com/nartc/angular-three/commit/06b928f62841c3d3c3b0d77638e44cdef8500a46))
- **core:** add Mesh ([91ae4cf](https://github.com/nartc/angular-three/commit/91ae4cf936fecee4205b9b17f22b11d099dc015b))
- **core:** add models ([1792a28](https://github.com/nartc/angular-three/commit/1792a28aa9f6b8e4057a6d86ea189f01c5cbfe24))
- **core:** add more examples meshes ([5cffc38](https://github.com/nartc/angular-three/commit/5cffc3838b47f738547aa1d82ba0f41c5584abf3))
- **core:** add Points ([5074703](https://github.com/nartc/angular-three/commit/50747039f9a3665161462b824b73868b8c801b2b))
- **core:** add primitive ([f4ca383](https://github.com/nartc/angular-three/commit/f4ca383f186f6ced5cffd63168dca1fb4e6ccffe))
- **core:** add Scene ([f44117a](https://github.com/nartc/angular-three/commit/f44117aebaf76b5ad73c951e581db30a5b609ec6))
- **core:** add services ([1ba1092](https://github.com/nartc/angular-three/commit/1ba1092f38816fcd23c37d88bf4bffa79663acb4))
- **core:** add Stats ([3754f87](https://github.com/nartc/angular-three/commit/3754f87c1fd701236226204c255626029c8ea990))
- **core:** add util directives and pipes ([9b29d39](https://github.com/nartc/angular-three/commit/9b29d39d89f90df977edf52f037cc3042b7e1864))
- **core:** generate all core entities ([fdaf072](https://github.com/nartc/angular-three/commit/fdaf072b47cc326cbc057fab3e085df175561c8d))
- **core:** generate object 3d controller ([ff9c1e0](https://github.com/nartc/angular-three/commit/ff9c1e074bc2366540353f5e9f7b9bd26e48748f))
- **core:** port r3f events ([5f61884](https://github.com/nartc/angular-three/commit/5f618846cab669505c5c6b420a026f17ce9116ce))
- **postprocessing:** add abstract pass ([54adeae](https://github.com/nartc/angular-three/commit/54adeaefea7eb0510520666123856d6db9a6f661))
- **postprocessing:** add abstract Pass and EffectComposer ([6bd9259](https://github.com/nartc/angular-three/commit/6bd92595dfcd62e98e6e4cf0ed6351d9ce7824dc))
- **postprocessing:** generate passes ([de01a06](https://github.com/nartc/angular-three/commit/de01a062d1a406eeb64ab1e9efab09d4eaaf88ea))
- **postprocessing:** init postprocessing ([7d5a0f8](https://github.com/nartc/angular-three/commit/7d5a0f86fc5f2ba321514a996a266d63e8319ddf))

### Bug Fixes

- adjust core template ([2d286b2](https://github.com/nartc/angular-three/commit/2d286b28c84c71d7f680c07f5a3cbe882725c390))
- **core:** add camera abstract ([20bb11c](https://github.com/nartc/angular-three/commit/20bb11c20de6ccdad714418acb185dcf3458a683))
- **core:** add InterleavedBufferAttribute to NgtAttribute ([20d3dbf](https://github.com/nartc/angular-three/commit/20d3dbf10c9de4e2e88b38391622b6474e7a5334))
- **core:** adjust events util (from r3f) to work with Angular ([0bcb9cb](https://github.com/nartc/angular-three/commit/0bcb9cbc95664529c7b592f8c0352f9edfc4caa1))
- **core:** adjust public api of Audio ([162d11e](https://github.com/nartc/angular-three/commit/162d11ea1be1a697d7befd6a8fe7652d9c10cab9))
- **core:** change NgtLine to NgtCommonLine ([0b3ddd7](https://github.com/nartc/angular-three/commit/0b3ddd7770ded04955e28fb2972a4aa39d4cb7c5))
- **core:** initialize the store state with default values ([b19b612](https://github.com/nartc/angular-three/commit/b19b61248ffb1a364e5970fe63958afc5b0e5443))
- **core:** make sure to set interaction correctly based on observed events ([5bdb306](https://github.com/nartc/angular-three/commit/5bdb306251bbc8c274b38412436bf03bb03ad823))
- **core:** rename AudioModule to NgtAudioModule ([d9ff581](https://github.com/nartc/angular-three/commit/d9ff5811150c0555e45a3bdec33c1b523ea3789e))
- **core:** rename camera to cameras ([de472cc](https://github.com/nartc/angular-three/commit/de472cc39c9f79209c62a2bdc0bcd8b5eb310804))
- **core:** rename mesh to meshes ([39d3706](https://github.com/nartc/angular-three/commit/39d3706f7775eb4b0ee1df84b1ca09bfc258548f))
- **core:** rename sprite to common sprite ([d023df8](https://github.com/nartc/angular-three/commit/d023df83ae09cb3bf66c17120082553bb8022437))
- **core:** run animatiosn changed effect to update the animations callbacks ([dc32dcd](https://github.com/nartc/angular-three/commit/dc32dcd9af3c8c431d08e50fec8feac07cdd33f1))
- handle comma in packageJson ([f4f1557](https://github.com/nartc/angular-three/commit/f4f155718e10c3c6c4f7a2b2876b1b9c199fe528))
- handle packageJson for umd ids ([bec9108](https://github.com/nartc/angular-three/commit/bec9108249f7dc41c7fc85bb86c3ef3c554685cb))
- regenerate ([22c31e9](https://github.com/nartc/angular-three/commit/22c31e9ba623d7d86f9624bfa6f65a2b70908978))
- remove line examples ([0e3c5ba](https://github.com/nartc/angular-three/commit/0e3c5bad661e6a2b48a6694c279306b2d4794a2f))

### Documentations

- add [@nartc](https://github.com/nartc) as a contributor ([f7cd072](https://github.com/nartc/angular-three/commit/f7cd072aa77aa7e04983f84ab05029e5ac2d8bb9))
- **docs:** add documentations app ([b879cd3](https://github.com/nartc/angular-three/commit/b879cd349cfaa6b30bce3808f55c1d00e45a02ff))
- **docs:** continue working on docs ([27a5dd3](https://github.com/nartc/angular-three/commit/27a5dd3c0173c59f534f1c82087109b5fa0f01f2))

## [1.0.0-beta.45](https://github.com/nartc/angular-three/compare/1.0.0-beta.44...1.0.0-beta.45) (2021-10-20)

### Features

- **core:** update THREE .133.1 ([e364c0a](https://github.com/nartc/angular-three/commit/e364c0a59a0909737db5d2bd90a015642f9e7c0c))

### Documentations

- fix FontLoader import ([fcce561](https://github.com/nartc/angular-three/commit/fcce561986b3c6557bb3d5fb36548ca1ff06aee4))

### Refactor

- update packages peerDeps ([405b779](https://github.com/nartc/angular-three/commit/405b779f48625816bde1862b12646fc9fa40d239))

## [1.0.0-beta.44](https://github.com/nartc/angular-three/compare/1.0.0-beta.43...1.0.0-beta.44) (2021-09-12)

### Bug Fixes

- **core:** shareReplay with LoaderService ([834ad4a](https://github.com/nartc/angular-three/commit/834ad4a6a218bf905d4c14c5e08aaaf6eddda3d9))

### Documentations

- add gltf model demo ([72a0665](https://github.com/nartc/angular-three/commit/72a0665894eb879d3fb35691266b4ed12956844a))
- adjust demo for ghpages ([a113a04](https://github.com/nartc/angular-three/commit/a113a04777af1eee6964d436c8c641e0f0eedfe4))

## [1.0.0-beta.43](https://github.com/nartc/angular-three/compare/1.0.0-beta.42...1.0.0-beta.43) (2021-08-12)

### Bug Fixes

- **core:** ensure primitive is participated in animation loop ([3786939](https://github.com/nartc/angular-three/commit/3786939c0fa2f90b4eb62701c85d3bd3bb294c05))
- **core:** remove limit 60fps from loop service for now ([84bb7ad](https://github.com/nartc/angular-three/commit/84bb7adfd56ed4a08a48b7bb027044e35a572b47))

## [1.0.0-beta.42](https://github.com/nartc/angular-three/compare/1.0.0-beta.41...1.0.0-beta.42) (2021-08-03)

### Bug Fixes

- **helpers:** quick html fix ([1e972e9](https://github.com/nartc/angular-three/commit/1e972e964dd47787f2658224d22182432c41aaa5))

## [1.0.0-beta.41](https://github.com/nartc/angular-three/compare/1.0.0-beta.40...1.0.0-beta.41) (2021-07-06)

### Bug Fixes

- **helpers:** change to HtmlStore ([7a527e6](https://github.com/nartc/angular-three/commit/7a527e68665c59e790f99ef56b803a0733d6f653))

### Documentations

- add Html demo ([113c0ee](https://github.com/nartc/angular-three/commit/113c0ee857ba3c0f2f5f6aebe89021968777547a))

## [1.0.0-beta.40](https://github.com/nartc/angular-three/compare/1.0.0-beta.39...1.0.0-beta.40) (2021-07-06)

### Features

- **helpers:** add Html ([614c909](https://github.com/nartc/angular-three/commit/614c9097a8aef48baa99eb0d2c57d7e44aa478b2))

### Bug Fixes

- **core:** remove ng-content from Canvas ([11aca2b](https://github.com/nartc/angular-three/commit/11aca2bf5aa89534b0c737d2c244d41f4e1df123))
- **helpers:** poc Html ([1add871](https://github.com/nartc/angular-three/commit/1add871e0072a6e5c9828a3288bec7d6ab3549e4))

### Refactor

- **core:** use fromEvent instead of renderer2 to listen for resize event ([ac77ba7](https://github.com/nartc/angular-three/commit/ac77ba746cbc2b6c4b6627de142c09736abb97ec))
- per-project configuration ([6c7be66](https://github.com/nartc/angular-three/commit/6c7be665ff5f2c599e5cc22b0d72fa74f486dabb))
- revert project.json ([60493c5](https://github.com/nartc/angular-three/commit/60493c5e96a71bfb765571d8d7b6751f24e2d0a8))

## [1.0.0-beta.39](https://github.com/nartc/angular-three/compare/1.0.0-beta.38...1.0.0-beta.39) (2021-06-23)

### Bug Fixes

- **core:** initialize Size in ngOnInit instead ([384556a](https://github.com/nartc/angular-three/commit/384556a3a3689221c277a59ce42af00f74039c29))

### Documentations

- fix demo ([8bf0c9a](https://github.com/nartc/angular-three/commit/8bf0c9ab12fc51accaa576e684bbbd6b56a6725c))

## [1.0.0-beta.38](https://github.com/nartc/angular-three/compare/1.0.0-beta.37...1.0.0-beta.38) (2021-06-22)

### Bug Fixes

- **core:** update camera projection matrix on initialize ([14eb776](https://github.com/nartc/angular-three/commit/14eb776e70ec34a7f7ffbf234f652103a7d03d9f))

## [1.0.0-beta.37](https://github.com/nartc/angular-three/compare/1.0.0-beta.36...1.0.0-beta.37) (2021-06-15)

### Bug Fixes

- **core:** fix applyProps ([7a7a105](https://github.com/nartc/angular-three/commit/7a7a105fbf785eba9a9e03de5f411ee7a933c9b6))

### Documentations

- use spinning cubes ([406b32c](https://github.com/nartc/angular-three/commit/406b32ce00e966e205d6ded3da08b8ee7264f74f))

## [1.0.0-beta.36](https://github.com/nartc/angular-three/compare/1.0.0-beta.34...1.0.0-beta.36) (2021-06-13)

### Bug Fixes

- **core:** adjust comparison delta ([d2eb0a4](https://github.com/nartc/angular-three/commit/d2eb0a441fa0f5485cea67961cf91dc36d5b3809))
- **core:** ensure to setDpr before initialize canvas ([f27edcc](https://github.com/nartc/angular-three/commit/f27edcc106cd8c4d180e0b765c03de29b939e59d))

### Documentations

- adjust docs ([43c158a](https://github.com/nartc/angular-three/commit/43c158a858a0d71aef9cc06bfdc4033938253571))
- changelog ([1722ac1](https://github.com/nartc/angular-three/commit/1722ac1ef60dc930183dddf516a19e36ed3c70c6))

### Refactor

- **core:** clean up applyProps ([c5fc4d0](https://github.com/nartc/angular-three/commit/c5fc4d04d52259790a3dbb68559fac386414d8f1))

## [1.0.0-beta.34](https://github.com/nartc/angular-three/compare/1.0.0-beta.33...1.0.0-beta.34) (2021-06-13)

### Bug Fixes

- **postprocessing:** regenerate SSRPass ([6fa3e23](https://github.com/nartc/angular-three/commit/6fa3e23c92557b230ff9363a21d74c2c78381718))
- **tools:** fix passes generators ([c9c6227](https://github.com/nartc/angular-three/commit/c9c62278348690d32c7ed0f3ab0bbb4862ba0e10))

### Documentations

- change log ([d38160d](https://github.com/nartc/angular-three/commit/d38160dbbed9d94acc3f21761e405230cfae7423))

## [1.0.0-beta.33](https://github.com/nartc/angular-three/compare/1.0.0-beta.32...1.0.0-beta.33) (2021-06-13)

### Bug Fixes

- **core:** add passive to events in EventsStore ([691e398](https://github.com/nartc/angular-three/commit/691e398c456c2f74159d2c0ef21e91a5154b40fd))
- **core:** adjust transform params of ColorPipe due to TS limitation on ConstructorParameters ([f930295](https://github.com/nartc/angular-three/commit/f9302950fbacce003d1be54b25710b6cb01e0f5f))
- **core:** limit to 60fps ([dfd0eb3](https://github.com/nartc/angular-three/commit/dfd0eb32502a86c430cd02c01c5b04099be604d9))
- **core:** update event utils to sync with r3f ([0792204](https://github.com/nartc/angular-three/commit/0792204ce29db9cf08dca5bc5bde766a09f1ff10))
- **core:** use asapScheduler to schedule loop ([288628a](https://github.com/nartc/angular-three/commit/288628a4db32997cd448ec09591c4864dc288e60))
- **helpers:** ensure orthographicCamera is a object3D ([8c6fe2b](https://github.com/nartc/angular-three/commit/8c6fe2bc152a3b93f97ef3e4c70e6823e2ebcf5b))
- **helpers:** use MathConst pipe in ContactShadows ([ba5c160](https://github.com/nartc/angular-three/commit/ba5c16098a90d8563e276bb9950994891f9455ea))

### Documentations

- adjust demo ([cd0f804](https://github.com/nartc/angular-three/commit/cd0f8044cc792139016dc2b02405331fa4bbaa94))
- clean up demos ([bc8eabc](https://github.com/nartc/angular-three/commit/bc8eabc52c9ae62f1c11ff9039990cd1afc6101e))
- use spinning-cubes for active demo ([c645c85](https://github.com/nartc/angular-three/commit/c645c859e989c2996befe679c45a01ab68f2a8b5))

## [1.0.0-beta.32](https://github.com/nartc/angular-three/compare/1.0.0-beta.31...1.0.0-beta.32) (2021-06-01)

### Features

- **core:** add ColorPipe ([ba7b2b0](https://github.com/nartc/angular-three/commit/ba7b2b0746c7bb3f0eb163befd020f33732ddd24))

This pipe is mainly used for `parameters` that accepts a `THREE.Color` only instead of a `string | number | THREE.Color`.

```html
<!-- most materials accept all types of argument that THREE.Color accepts -->
<ngt-mesh-basic-material [parameters]='{color: 'black'}'></ngt-mesh-basic-material>

<!-- However, in the case of ngt-canvas, the background property only accepts THREE.Color -->
<ngt-canvas [scene]='{ background: ["black"] | color }'></ngt-canvas>
```

- **core:** add FogPipe ([54c5f37](https://github.com/nartc/angular-three/commit/54c5f37dbfa20971bdbcebb56c7c5ab589293f8a))

```html
<!-- same idea as ColorPipe -->
<ngt-canvas [scene]='{ fog: ['000000', 1, 15000] | fog}'></ngt-canvas>
```

### Bug Fixes

- **core:** move MathConstantPipe to SCAM ([e9dc69c](https://github.com/nartc/angular-three/commit/e9dc69c6fa7a92cb6c9320f696d0214aa9a4318b))
- **core:** move MathPipe to SCAM ([1495645](https://github.com/nartc/angular-three/commit/1495645fa0261d9a54cc15ee1e2d18b2f0eb1639))
- **core:** move RepeatDirective to SCAM ([95d2e78](https://github.com/nartc/angular-three/commit/95d2e781bdc8c50dcbde9096b47f2832252504b2))

### Refactor

- **core:** remove MathConstantPipe and MathPipe from CoreModule ([a970375](https://github.com/nartc/angular-three/commit/a970375f24b4d1db595cd99e816d0e4b65b03ef0))

### Documentations

- **demo:** update docs ([e02eb97](https://github.com/nartc/angular-three/commit/e02eb97e158c6d4684a843f060639f40a6cf9afc))

## [1.0.0-beta.31](https://github.com/nartc/angular-three/compare/1.0.0-beta.30...1.0.0-beta.31) (2021-06-01)

### Features

- **core:** add MathPipe and MathConstantPipe ([500b5b8](https://github.com/nartc/angular-three/commit/500b5b884648b95e73a01c5b9af059abd8eedf03))

`MathPipe` and `MathConstantPipe` can be utilized to quickly calculate Math expression or use Math constants on the template

```html
<span>{{ 1 | mathConst:'PI' }}</span>
<!-- equals to Math.PI -->
<span>{{ 0.5 | mathConst:'PI' }}</span>
<!-- equals to Math.PI / 2 -->

<span>{{ 1 | math:'sin' }}</span>
<!-- equals to Math.sin(1) -->
```

- **core:** add RepeatDirective ([25b2ea9](https://github.com/nartc/angular-three/commit/25b2ea978922d62c5719fdc66d7dd924480fec3e))

`RepeatDirective` is similar to `ngFor` but is meant to iterate over an amount of something rather than a list. For example, to loop over 30 days to build a calendar.

```html
<ngt-mesh *repeat="let _ of 10000"></ngt-mesh>
```

### Bug Fixes

- fix imports ([3d4faf0](https://github.com/nartc/angular-three/commit/3d4faf0772388705a6015f70365a4c4da462d455))

## [1.0.0-beta.30](https://github.com/nartc/angular-three/compare/1.0.0-beta.29...1.0.0-beta.30) (2021-05-31)

### ⚠ BREAKING CHANGES

- **core:** Add `[o3d]` to all 3dObject modules you're using, for example: `<ngt-mesh>` ->
  `<ngt-mesh o3d>`

### Features

- **core:** add BufferGeometry ([cd25169](https://github.com/nartc/angular-three/commit/cd2516901a5f8132910a8a799b8c29047b84e08d))

### Bug Fixes

- **core:** add o3d to Object3DController to separate Controller with other modules ([8e06cae](https://github.com/nartc/angular-three/commit/8e06cae01c728f82f6f1f814b3bf7b60ddc48ca8))
- **core:** make LoaderService providedIn root ([86a0840](https://github.com/nartc/angular-three/commit/86a0840810df715c93236b064a79c93238ccfbec))
- **core:** use Subject#observed instead of Subject#observers ([514f0e2](https://github.com/nartc/angular-three/commit/514f0e26ba4d93ec5996efa878ea0c02cfe6f7f9))

### Documentations

- demo ([07d22d4](https://github.com/nartc/angular-three/commit/07d22d4f51925ccfeb70d33bb4924dd05b514b09))
- format ([06fca82](https://github.com/nartc/angular-three/commit/06fca82882b811bd8dacb217b9fcfbdedb8c190b))
- update docs to use o3d ([af52a1f](https://github.com/nartc/angular-three/commit/af52a1f0ccac4e56b9ef4e9e82f3c3b004349b88))

## [1.0.0-beta.29](https://github.com/nartc/angular-three/compare/1.0.0-beta.28...1.0.0-beta.29) (2021-05-13)

## [1.0.0-beta.28](https://github.com/nartc/angular-three/compare/1.0.0-beta.27...1.0.0-beta.28) (2021-05-03)

### Documentations

- **docs-site:** add TLDR to first scene docs ([22a7f09](https://github.com/nartc/angular-three/commit/22a7f09ed546f6873ed49a063d562a1c7bee2c2a))

## [1.0.0-beta.27](https://github.com/nartc/angular-three/compare/1.0.0-beta.26...1.0.0-beta.27) (2021-05-03)

### Features

- **core:** add viewport to internal canvas state ([265e46c](https://github.com/nartc/angular-three/commit/265e46c2a6436af1cee1c06860430fbbbaba5aa8))

### Bug Fixes

- **core:** change all objects that have args to re-init when args change ([ef92d3e](https://github.com/nartc/angular-three/commit/ef92d3e3b25ce61d91b7fd5af9dc739e237829ac))

### Documentations

- add first scene ([71d1882](https://github.com/nartc/angular-three/commit/71d1882de812a0324e2fecba0278f186730c7a06))
- **demo:** adjust boxes docs ([f8b806b](https://github.com/nartc/angular-three/commit/f8b806bdb1cd73d78e7471083201e16fca008220))
- add helpers ([ea5a71a](https://github.com/nartc/angular-three/commit/ea5a71aa42690fb33e61978a8938963ebaaf3a69))
- update docs site ([6113311](https://github.com/nartc/angular-three/commit/611331169cc7ea09cee55d67671db3700bf76d81))

## [1.0.0-beta.26](https://github.com/nartc/angular-three/compare/1.0.0-beta.25...1.0.0-beta.26) (2021-05-02)

### Features

- **core:** refactor to use LoaderService. deprecating all current loaders ([6c8a5f2](https://github.com/nartc/angular-three/commit/6c8a5f27c5658b63c166b8fccca4b8e1935d249e))
- **generators:** setup passes generator ([75f6c92](https://github.com/nartc/angular-three/commit/75f6c920abd831c8ee0efd22d3658bf476fb2c1f))
- **postprocessing:** add all passes ([b49b1d6](https://github.com/nartc/angular-three/commit/b49b1d63da0b289bd6550c966a88a236a343d52b))

## [1.0.0-beta.25](https://github.com/nartc/angular-three/compare/1.0.0-beta.24...1.0.0-beta.25) (2021-04-30)

### Bug Fixes

- **core:** make sure to listen to controller change subject ([75a9355](https://github.com/nartc/angular-three/commit/75a9355df6b770acf4927667e24475a9df46cf87))

### Documentations

- **demo:** adjust docs ([939a3fb](https://github.com/nartc/angular-three/commit/939a3fb772506d4e455ea307252c9474e24f2334))

## [1.0.0-beta.24](https://github.com/nartc/angular-three/compare/1.0.0-beta.23...1.0.0-beta.24) (2021-04-30)

### Bug Fixes

- **core:** expose primitive ([4a97b03](https://github.com/nartc/angular-three/commit/4a97b03ffb3ad2733016efb87dc6103b8a47296a))

## [1.0.0-beta.23](https://github.com/nartc/angular-three/compare/1.0.0-beta.22...1.0.0-beta.23) (2021-04-30)

### Documentations

- add docs url ([8b529f7](https://github.com/nartc/angular-three/commit/8b529f7c7fdf608753ad804057c8e2c325ff728f))
- quickly adjust docs ([3ba4ba7](https://github.com/nartc/angular-three/commit/3ba4ba7d9a110f307525a0bfd714add15f80f2e4))

### Refactor

- **core:** bad habit for not committing frequently. this commit is massive ([cde55ae](https://github.com/nartc/angular-three/commit/cde55ae1367f61a6335f7e578bb98f555260f100))
- **core:** use Object3dControllerDirective for Object3d inputs ([161f007](https://github.com/nartc/angular-three/commit/161f00794a5dfeb8d6a3a95359ed007b9d2c7548))

## [1.0.0-beta.22](https://github.com/nartc/angular-three/compare/1.0.0-beta.21...1.0.0-beta.22) (2021-04-27)

### Bug Fixes

- **popmotion:** remove redundant type from animation config ([5913189](https://github.com/nartc/angular-three/commit/591318991d2e9857e7fffd4f445c603d6f6a2157))

### Refactor

- **core:** change camelCase selectors to kebab-case ([6572365](https://github.com/nartc/angular-three/commit/657236597f35ccf47835e126ac0042a565b33e1f))
- **postprocessing:** rename selector of renderpass ([5488b1a](https://github.com/nartc/angular-three/commit/5488b1a8820a49839f5575309fe9e0d22558a0bf))

### Documentations

- add more docs ([e894f65](https://github.com/nartc/angular-three/commit/e894f651daa86d7753608d0142e91e4752362e0b))
- add popmotion to readme ([db81182](https://github.com/nartc/angular-three/commit/db81182acb643a1ac0a0d4f7dba4e57d1af345c4))
- format ([7e61fdb](https://github.com/nartc/angular-three/commit/7e61fdbcbbe075c508b56c50bf38dbceb43cce40))
- **demo:** use kebab-case selectors ([1b56fc9](https://github.com/nartc/angular-three/commit/1b56fc9dacfec1e86779d204fd4b5cb2d0ef6478))

## [1.0.0-beta.21](https://github.com/nartc/angular-three/compare/1.0.0-beta.20...1.0.0-beta.21) (2021-04-26)

### Bug Fixes

- **core:** add mouse to renderstate ([3332fb3](https://github.com/nartc/angular-three/commit/3332fb3533211162838e8c55b9368d4d10831d29))
- **postprocessing:** adjust import in UnrealBloomPass ([f167363](https://github.com/nartc/angular-three/commit/f16736392725d407d2ed4026885f4312e83fda2c))

### Refactor

- **core:** move most abstracts (except audio) to core ([cd630aa](https://github.com/nartc/angular-three/commit/cd630aab2c1d412c4c58b3c0db77eef73e4a94b4))

### Documentations

- add CONTRIBUTING and adjust README ([cf9bf2e](https://github.com/nartc/angular-three/commit/cf9bf2e9a5b425779e1b81e1b57c1d4f18c9b8bc))
- wip ([367ec7d](https://github.com/nartc/angular-three/commit/367ec7d8b335950e680ce537722d1c004a3e2002))

## [1.0.0-beta.20](https://github.com/nartc/angular-three/compare/1.0.0-beta.19...1.0.0-beta.20) (2021-04-25)

### Bug Fixes

- **core:** fix geometry import ([ef81ada](https://github.com/nartc/angular-three/commit/ef81adad70020e7b6b01c6a17dfa429b5472bbaa))

## [1.0.0-beta.19](https://github.com/nartc/angular-three/compare/1.0.0-beta.18...1.0.0-beta.19) (2021-04-25)

### Features

- **core:** move all abstracts to core ([b7a4a36](https://github.com/nartc/angular-three/commit/b7a4a36348e9bfa3d50c09ddf648b793b63aa21d))

### Bug Fixes

- **popmotion:** extract `popmotionFactory` for Ivy ([d6d0df5](https://github.com/nartc/angular-three/commit/d6d0df5c3223addf66b519c7d4a7a79d5cc81bd8))

## [1.0.0-beta.18](https://github.com/nartc/angular-three/compare/1.0.0-beta.17...1.0.0-beta.18) (2021-04-25)

### Features

- **popmotion:** add rough implementation for popmotion ([a1674fb](https://github.com/nartc/angular-three/commit/a1674fb06c72693b05c8fc29f7777794b9e7bf59))

### Documentations

- **demo:** adjust demo to use popmotion ([15f6d1c](https://github.com/nartc/angular-three/commit/15f6d1c1e7f0860bf82fb750334b1430f930bf9a))

## [1.0.0-beta.17](https://github.com/nartc/angular-three/compare/1.0.0-beta.16...1.0.0-beta.17) (2021-04-24)

### Bug Fixes

- **controls:** call dispose() on destroy ([1f6a774](https://github.com/nartc/angular-three/commit/1f6a7743e709bd0a7d770e136c1cbcbb68ce328d))
- **core:** call dispose() on destroy ([5c0fc46](https://github.com/nartc/angular-three/commit/5c0fc466d9b0cc597fdf04c30e73553397366e5a))
- **postprocessing:** check for dispose and call it on destroy ([d0fbbb0](https://github.com/nartc/angular-three/commit/d0fbbb08f06a8c542e057864a698aa95fa4313c6))

## [1.0.0-beta.16](https://github.com/nartc/angular-three/compare/1.0.0-beta.15...1.0.0-beta.16) (2021-04-24)

### Bug Fixes

- **core:** make `LoopService#tick` private ([054e73e](https://github.com/nartc/angular-three/commit/054e73e5105f07036b39c1a3d7b554ee4c020b9f))

### Documentations

- add basic info to README ([4d8664d](https://github.com/nartc/angular-three/commit/4d8664dfea3a3897ee747a8ed6ca5fb0c09cd525))

## [1.0.0-beta.15](https://github.com/nartc/angular-three/compare/1.0.0-beta.14...1.0.0-beta.15) (2021-04-24)

### Bug Fixes

- **core:** make sure to convertColor before creating material ([5d6e3b4](https://github.com/nartc/angular-three/commit/5d6e3b40a6c96cde92458c3a475482dbb2d8302d))

## [1.0.0-beta.14](https://github.com/nartc/angular-three/compare/1.0.0-beta.13...1.0.0-beta.14) (2021-04-24)

### Features

- **core:** add receiveShadow and castShadow on object3d ([2690cbc](https://github.com/nartc/angular-three/commit/2690cbc9455b8f3bfe405520494f809fbda7ce29))

### Documentations

- adjust Readme ([d3c6ea0](https://github.com/nartc/angular-three/commit/d3c6ea0522fdf8d74ca8d7e62be29849953789a7))
- adjust README ([0bb5009](https://github.com/nartc/angular-three/commit/0bb5009a4e22dc2dea0d68ab5e2d12b3f55b20e9))
- fix (yet another) typo and adjust info about component store ([3047713](https://github.com/nartc/angular-three/commit/30477130aaa311ac2deac8f058c6c0db6c56b1c7))
- fix typo ([49ae6c8](https://github.com/nartc/angular-three/commit/49ae6c819cf0818d9e0156e80e509dffa419ebbb))

## [1.0.0-beta.13](https://github.com/nartc/angular-three/compare/1.0.0-beta.12...1.0.0-beta.13) (2021-04-24)

### Bug Fixes

- **core:** remove runOutsideAngular utils and remove zonelessReady ([50a0459](https://github.com/nartc/angular-three/commit/50a04591b7a52ae8b458664f7da8f1fc94a0e471))

### Documentations

- **demo:** adjust demo with zonelessReady removal ([069aed6](https://github.com/nartc/angular-three/commit/069aed671b3a6a3881b0642700907deccd224f71))
- add basic info to README ([89eaf41](https://github.com/nartc/angular-three/commit/89eaf41a909c22c229d9301dfcfabbad4399f4d9))
- add cube gif ([d8815e4](https://github.com/nartc/angular-three/commit/d8815e40c0f99896c465aaddf34d29f136044688))
- fix typo ([b478ea2](https://github.com/nartc/angular-three/commit/b478ea2a88a299fb8b9357c4ac4d62aed880260e))

## [1.0.0-beta.12](https://github.com/nartc/angular-three/compare/1.0.0-beta.11...1.0.0-beta.12) (2021-04-23)

### Features

- **core:** add genereators ([e16820c](https://github.com/nartc/angular-three/commit/e16820c81f10b7a59fba5f4b545bf76ccb3f5da8))

### Bug Fixes

- **core:** adjust material ContentChild ([5ad05f0](https://github.com/nartc/angular-three/commit/5ad05f034d2bc8aabfca5377d6b5e22bba8f61a1))

## [1.0.0-beta.11](https://github.com/nartc/angular-three/compare/1.0.0-beta.10...1.0.0-beta.11) (2021-04-23)

### Features

- **core:** add ConeBufferGeometry ([05d5363](https://github.com/nartc/angular-three/commit/05d5363e1e98859fd471a4ed9d2a1967a4930443))
- **core:** add DodecahedronBufferGeometry ([e5a2196](https://github.com/nartc/angular-three/commit/e5a2196ed127999e9e2aa93d82b613c588aabdd7))
- **core:** add ExtrudeBufferGeometry ([480a4b7](https://github.com/nartc/angular-three/commit/480a4b76f1074b9bd4bf4ddc409da34e41eab4ea))
- **core:** add LatheBufferGeometry ([a11fadb](https://github.com/nartc/angular-three/commit/a11fadbf81ec98c8855ab17ada75fa47b4d0ad93))
- **core:** add ParametricBufferGeometry ([a456cea](https://github.com/nartc/angular-three/commit/a456cead930096deb2f687df61b75e4a5baf7177))
- **core:** add PlaneBufferGeometry ([2a07b88](https://github.com/nartc/angular-three/commit/2a07b885f4a1bd684e616b24857990315f456692))
- **core:** add PolyhedronBufferGeometry ([f161545](https://github.com/nartc/angular-three/commit/f161545bd76ceb03ac017c10da26edebf1b6ff93))
- **core:** add RingBufferGeometry ([2866754](https://github.com/nartc/angular-three/commit/286675417144cd44a08bb74fe03b8ac8ae8046fe))
- **core:** add ShapeBufferGeometry ([b2354a9](https://github.com/nartc/angular-three/commit/b2354a927f3f47aec239e7fa93a4fbef52285d9b))
- **core:** add SphereBufferGeometry and fix lints ([b1fe554](https://github.com/nartc/angular-three/commit/b1fe554a7512aff4d9eade7930371b7368e618e3))
- **core:** add TetrahedronBufferGeometry ([23627a5](https://github.com/nartc/angular-three/commit/23627a56faa6027e459098ebdccce042e5829172))
- **core:** OctahedronBufferGeometry ([6e4ee50](https://github.com/nartc/angular-three/commit/6e4ee50cacbb6cd668d6e6b85cf60eee58d286b3))

### Bug Fixes

- **core:** fix lints ([429cdfb](https://github.com/nartc/angular-three/commit/429cdfb77fe93b55b68b967fab03896e8a1d833e))

## [1.0.0-beta.10](https://github.com/nartc/angular-three/compare/1.0.0-beta.9...1.0.0-beta.10) (2021-04-22)

### Features

- **controls:** add zonelessReady to flyControls ([046bc2a](https://github.com/nartc/angular-three/commit/046bc2a331518a3a1792762dbe800fba72f37ff1))
- **controls:** add zonelessReady to orbitControls ([c651fe9](https://github.com/nartc/angular-three/commit/c651fe958f058d57e845f5966cc1d49ee019535e))
- **core:** add zonelessReady to AudioListener ([7605f79](https://github.com/nartc/angular-three/commit/7605f798c6aae4fbb8051026d3a4c3bacd2d680a))
- **core:** add zonelessReady to Skeleton ([a00cd50](https://github.com/nartc/angular-three/commit/a00cd501e3f0b00942a5c0f74c263ebf4f29bdd4))
- **postprocessing:** add zonelessReady ([7cb674c](https://github.com/nartc/angular-three/commit/7cb674cfb5f24174e9bffaeda246038de58e9d9b))

### Bug Fixes

- **core:** null check for bufferGeometry and material in Mesh ([91f5497](https://github.com/nartc/angular-three/commit/91f5497ece953164c3090ec5146f0efc9e354afc))
- **core:** rework LOD ([a30e2d3](https://github.com/nartc/angular-three/commit/a30e2d3bb6a30b04636db94a1a251c036528de42))

### Documentations

- **demo:** adjust demo ([1905f69](https://github.com/nartc/angular-three/commit/1905f69d1104ffe2bd1d558813fe17f3bc8b9dfb))

## [1.0.0-beta.9](https://github.com/nartc/angular-three/compare/1.0.0-beta.8...1.0.0-beta.9) (2021-04-22)

### Bug Fixes

- **core:** remove recursivePartial and add background to common instead ([12c9bf2](https://github.com/nartc/angular-three/commit/12c9bf2477271a8bfdc80ace660df28c66c89908))

## [1.0.0-beta.8](https://github.com/nartc/angular-three/compare/1.0.0-beta.7...1.0.0-beta.8) (2021-04-22)

### Bug Fixes

- **core:** add RecursivePartial type ([66bcd14](https://github.com/nartc/angular-three/commit/66bcd14632ec6d7f64525c106a6b950d9c9db9fb))

## [1.0.0-beta.7](https://github.com/nartc/angular-three/compare/1.0.0-beta.6...1.0.0-beta.7) (2021-04-21)

### Features

- **core:** add AnimationLoopParticipant class for animateReady output ([4c189a0](https://github.com/nartc/angular-three/commit/4c189a0d69b79c0383f592f5a975e5b5e7bb3ea9))

### Bug Fixes

- **controls:** have OrbitControls and FlyControls extend AnimationLoopParticipant ([2c43a8a](https://github.com/nartc/angular-three/commit/2c43a8afa8d4dfdd2cb6503f67af62b1553b38ea))
- **core:** adjust windowResizeEffect ([a99ba0e](https://github.com/nartc/angular-three/commit/a99ba0ec77d2e7796f6e9764d0ae7f776e777660))
- **core:** have Object3d extends AnimationLoopParticipant ([420bb88](https://github.com/nartc/angular-three/commit/420bb88adbc48d6780cc8ae53a275d8dc58c80aa))

### Documentations

- **demo:** clean up demo ([a466c8a](https://github.com/nartc/angular-three/commit/a466c8af6191c69f6e99838f18a0d75e583eeca9))

## [1.0.0-beta.6](https://github.com/nartc/angular-three/compare/1.0.0-beta.5...1.0.0-beta.6) (2021-04-21)

### Features

- **core:** add MeshBasicMaterial ([704a29c](https://github.com/nartc/angular-three/commit/704a29c3aa2736c5d2178a3ffac673a1e62aac6f))

### Bug Fixes

- **core:** initialize material in OnInit ([d073270](https://github.com/nartc/angular-three/commit/d073270c51b61cd925c81b242370abe35e416f92))

### Documentations

- **demo:** adjust demo ([4937f42](https://github.com/nartc/angular-three/commit/4937f42960fb594712b7291358cb8b1238cff475))

## [1.0.0-beta.5](https://github.com/nartc/angular-three/compare/1.0.0-beta.4...1.0.0-beta.5) (2021-04-21)

### Features

- **core:** add circlebuffergeometry ([d89e2f2](https://github.com/nartc/angular-three/commit/d89e2f2e3357429b289e01faa37a2a46abfa6e35))

## [1.0.0-beta.4](https://github.com/nartc/angular-three/compare/1.0.0-beta.3...1.0.0-beta.4) (2021-04-21)

### Features

- **controls:** prefix Three to FlyControls ([9074cc6](https://github.com/nartc/angular-three/commit/9074cc686152096390aa3cd9f6c3b3d5ab5173df))
- **core:** prefix Three to new modules ([40be427](https://github.com/nartc/angular-three/commit/40be42746ae4c232c2e41815ebd713354dc5839e))
- **core:** remove LodLevelDirective ([390d781](https://github.com/nartc/angular-three/commit/390d781b2105263a513b84e9a8819acadebdca6b))

### Bug Fixes

- **core:** fix circular dep ([b04273d](https://github.com/nartc/angular-three/commit/b04273db2e2a065a8b311cf57dd07714f41e1b95))

### Documentations

- **demo:** adjust demo with new imports ([332461f](https://github.com/nartc/angular-three/commit/332461f276d71b99ee13f82e89f6b0eb560672a5))
- **demo:** adjust docs ([ebfaa95](https://github.com/nartc/angular-three/commit/ebfaa95a7f2c760a2af42c5164afa62806b91bec))

## [1.0.0-beta.3](https://github.com/nartc/angular-three/compare/1.0.0-beta.2...1.0.0-beta.3) (2021-04-21)

### Features

- **audio:** add PositionalAudio ([7e49db6](https://github.com/nartc/angular-three/commit/7e49db63cc0d9ad5a8b57823d866495cf381819c))
- **controls:** add FlyControls ([5b18c29](https://github.com/nartc/angular-three/commit/5b18c291b1de1acc80c162dfb5c91b0655de6d68))
- **core:** add `(ready)` to audios ([c03c5ab](https://github.com/nartc/angular-three/commit/c03c5ab8104882360ee3e6f8a19e5618c62c2ab1))
- **core:** add a base class for object that has a geometry and a material ([45ef17e](https://github.com/nartc/angular-three/commit/45ef17ec373dae55084e7a260cc9fb47290f2735))
- **core:** add AudioListener ([b5e8eff](https://github.com/nartc/angular-three/commit/b5e8eff13e8cf6b4d0faaef0dc9e628d7ecea452))
- **core:** add HemisphereLight ([ca9d72c](https://github.com/nartc/angular-three/commit/ca9d72ccfce00149104bad720cf47a251c3b7e5e))
- **core:** add IcosahedronGeometry ([5f2e981](https://github.com/nartc/angular-three/commit/5f2e98173795fcda6a9678ccdfa33655692b4336))
- **core:** add Line, LineLoop, LineSegments ([e2c4af5](https://github.com/nartc/angular-three/commit/e2c4af524250fb8308cd18a7108fe94f55964da9))
- **core:** add LOD ([a295c77](https://github.com/nartc/angular-three/commit/a295c772ac05d717049f86ff33f67c037f475f63))
- **core:** add Points ([bd76850](https://github.com/nartc/angular-three/commit/bd76850d40700924edb16c52eef1abd98d9d92b5))
- **core:** add PointsMaterial ([9e9bc0d](https://github.com/nartc/angular-three/commit/9e9bc0d16b764c4bcaaae7caed4f2b6718af9fd3))
- **core:** add RectAreaLight ([504b08f](https://github.com/nartc/angular-three/commit/504b08ffc11985b357068b9b3051637763e08e79))
- **core:** add SkinnedMesh, Skeleton, and Bone ([62f1e6c](https://github.com/nartc/angular-three/commit/62f1e6cba875686ac55f41bb89a304236b61a82c))
- **core:** add Sprite ([24179f6](https://github.com/nartc/angular-three/commit/24179f65ab5ebd256337d0cf091c6df0f8f6c956))
- **core:** add SpriteMaterial ([9210721](https://github.com/nartc/angular-three/commit/9210721efe9d3832e3450a3497d5dc5f91641186))

### Bug Fixes

- **core:** add intensity input to Light objects ([b832295](https://github.com/nartc/angular-three/commit/b832295421049529b3e5289426613ba3afcded19))
- **core:** adjust MeshAbstract to use new base object ([68a29d5](https://github.com/nartc/angular-three/commit/68a29d522628b067d7ab0c0fce7f7afe32046886))
- **core:** ensure to initialize geometry in ngOnInit ([af0132e](https://github.com/nartc/angular-three/commit/af0132ec665996ebf4155d39f7e439369c68fced))
- **core:** ensure to initialize LOD in init ([28a88a7](https://github.com/nartc/angular-three/commit/28a88a73efdfd102a300d1101e0d0c7d09e380a6))
- **core:** import type for Object3d in audios ([023f2cd](https://github.com/nartc/angular-three/commit/023f2cdaf4dea3569756ac01701b3e6143f533f3))
- **core:** make AudioListener not extends ThreeObject3d ([12cc61c](https://github.com/nartc/angular-three/commit/12cc61ca73c94636849cf6e37ca5b088a97e3cb1))
- **core:** make ThreeObject3d a multi provider ([89683c9](https://github.com/nartc/angular-three/commit/89683c9b27ce05a2592f98c2c4eafc9ba5f9a5fd))
- **core:** precalc animationCallbacks and hasPriority in store ([fc4d7ff](https://github.com/nartc/angular-three/commit/fc4d7ff2ee8fb2b4b033e3743695d19fc0b00465))
- **core:** remove multi providers ([180d184](https://github.com/nartc/angular-three/commit/180d18497a90db172769584c0dd19aef07009569))

### Refactor

- **core:** use runOutsideAngular operator on imperative subscription ([108a055](https://github.com/nartc/angular-three/commit/108a0551ac8fe6503a2bd8c472115d1bcf4fa97f))

### Documentations

- **demo:** add LOD demo ([5020adb](https://github.com/nartc/angular-three/commit/5020adb8303f3385748e8a6a395c9358a0e539dc))
- **demo:** init docusaurus ([f5ebd63](https://github.com/nartc/angular-three/commit/f5ebd638380f0363f23578aff1db818047e60cd9))

## [1.0.0-beta.2](https://github.com/nartc/angular-three/compare/1.0.0-beta.1...1.0.0-beta.2) (2021-04-19)

### Features

- **core:** add remove effects to InstancesStore (wip) ([a042820](https://github.com/nartc/angular-three/commit/a042820b525091c134fb49e0168217054ee44f70))
- **core:** return a cleanup function from registerAnimation ([e3020eb](https://github.com/nartc/angular-three/commit/e3020eb23f5abf69df535b8fbbe81f006f59e987))
- **postprocessing:** add ready output to EffectComposer ([c66c4dd](https://github.com/nartc/angular-three/commit/c66c4dd15267b5862d29373a109dbbd647cab197))

### Bug Fixes

- **controls:** initialize OrbitControls outsideOfAngular ([f87c17c](https://github.com/nartc/angular-three/commit/f87c17c9d08c4c95357ee46c62510fa7e0e3febb))
- **core:** clean up and make Attributes consistent with the rest ([9d6e434](https://github.com/nartc/angular-three/commit/9d6e4344902ea1716d46ebcc99c3aaa64af63ddc))
- **core:** clean up and make Geometries consistent with the rest ([5b9a749](https://github.com/nartc/angular-three/commit/5b9a749cddd59c15f4bf8027e1ba23ed961f8d2c))
- **core:** clean up and make Lights consistent with the rests ([b7c24c3](https://github.com/nartc/angular-three/commit/b7c24c3eeafb25abc6e2c2d6d1b8e42284dc953e))
- **core:** clean up and make Materials consistent with the rest ([650977a](https://github.com/nartc/angular-three/commit/650977a2c8ba65ad163831d7298b72c056b3a9a7))
- **core:** ensure to clean up properly on object3d destroy ([a37d0cc](https://github.com/nartc/angular-three/commit/a37d0cc06fe2f52466df9cd2dcee9303cffc8788))
- **core:** rename UnknownConstructor to AnyConstructor with any[] instead of unknown[] ([494f18d](https://github.com/nartc/angular-three/commit/494f18d5bbd29447a44feac2b560c6b5be697774))
- **core:** use AnyConstructor for Mesh abstract ([6857a71](https://github.com/nartc/angular-three/commit/6857a7126a54c1ad8b2c1fd2cfa3a48ff22f62ca))

### Documentations

- **demo:** adjust demo to use (ready) instead of ViewChild. Seems more consistent ([b4578ba](https://github.com/nartc/angular-three/commit/b4578ba3b0d7d78c9363cf01b901df9408cc585b))

## [1.0.0-beta.1](https://github.com/nartc/angular-three/compare/1.0.0-beta.0...1.0.0-beta.1) (2021-04-18)

### Bug Fixes

- move typings from 2nd entry to core ([63a0c7d](https://github.com/nartc/angular-three/commit/63a0c7d4cb04191abed58be4d3c762ed15b19f1b))

## 1.0.0-beta.0 (2021-04-18)

### Features

- **attributes:** add Attribute ([d23a35e](https://github.com/nartc/angular-three/commit/d23a35eca9b7eafb0e988347163104e762f7e961))
- **core:** add core lib with essential building blocks ([72a1284](https://github.com/nartc/angular-three/commit/72a128490de30b38f18ad4271b3a8cddd5c09717))
- **core:** add delta to RenderState ([445e7e2](https://github.com/nartc/angular-three/commit/445e7e21dd76ef8bab0b7f4737d1a980d17f149e))
- **core:** add FontLoader ([07872bc](https://github.com/nartc/angular-three/commit/07872bc00c1fba0217e444564fa5fe9849735afc))
- **core:** add FontLoader ([1357f2d](https://github.com/nartc/angular-three/commit/1357f2dd554664576de45a323a38ab1e0b5d2636))
- **core:** add Group ([a12c799](https://github.com/nartc/angular-three/commit/a12c7999cd2d8a85b4bea41259b080b29f213c2b))
- **core:** add morphTarget inputs to ThreeMesh ([8b0b3ee](https://github.com/nartc/angular-three/commit/8b0b3ee28d4c8f49bf5a7cc9f572d62f750943d8))
- **core:** add priority to animationCallback ([9fd44d6](https://github.com/nartc/angular-three/commit/9fd44d6af961888ebbf3a9bb4824f85ac4424756))
- **core:** add Scene ([891808e](https://github.com/nartc/angular-three/commit/891808e43fb380d7ec1ab1470104961bb319da32))
- **core:** add Scene ([cde2708](https://github.com/nartc/angular-three/commit/cde270880f179984333dc3d1577ef2ab76dd5fa6))
- **core:** expose applyProps ([510d1d0](https://github.com/nartc/angular-three/commit/510d1d0acf269f19f31d93ab10daa0a151d213e9))
- **core:** remove stats from core ([0c09ff3](https://github.com/nartc/angular-three/commit/0c09ff3901d254ff2a3cb3b857782d5c0433988a))
- **geometries:** add geometries ([4b6174d](https://github.com/nartc/angular-three/commit/4b6174de7c1443b1df1386de227e2bf5bbfa8be0))
- **geometries:** add TextBufferGeometry ([476a452](https://github.com/nartc/angular-three/commit/476a452f26344d6d3713fe46e0c88f9242bca6a2))
- **geometries:** use ThreeAttribute ([f70c94f](https://github.com/nartc/angular-three/commit/f70c94fab23b6dad5d995fde4188c886aaa5715b))
- **lights:** add lights ([eafae5c](https://github.com/nartc/angular-three/commit/eafae5c0b99d1eb957ea825601f99706f1be6bad))
- **lights:** add SpotLight ([683ff28](https://github.com/nartc/angular-three/commit/683ff289e1385c492d83d37a13ac22cae89a39c4))
- **loaders:** add external loaders lib ([3a6e1f3](https://github.com/nartc/angular-three/commit/3a6e1f3143ac03307c24f7ef919b5c4cda489b64))
- **loaders:** add external loaders lib ([8fec053](https://github.com/nartc/angular-three/commit/8fec05321f562ff4b4c1fcc0c7c1c75c1115fc84))
- **loaders:** add gltfLoader ([b4d25f0](https://github.com/nartc/angular-three/commit/b4d25f0acc0dd18760bc7ff32d420ca0818eda20))
- **loaders:** add gltfLoader ([49fea21](https://github.com/nartc/angular-three/commit/49fea21f6a06ae3f54d4c446982cda31b9fa6add))
- **loaders:** add loaders ([bd9f42c](https://github.com/nartc/angular-three/commit/bd9f42c5ef461e00a527671349abec9ba98fb4f5))
- **materials:** add materials lib ([69dbdda](https://github.com/nartc/angular-three/commit/69dbdda7edd3e0992890685199c49559a78f8b2e))
- **meshes:** add meshes ([b31e68b](https://github.com/nartc/angular-three/commit/b31e68b319d05afabd5e2b66e02e1edf8584ae90))
- **orbit-controls:** add OrbitControls ([5404837](https://github.com/nartc/angular-three/commit/5404837d22c4ba3cbdb682f7856ba8a5fdd0c7cb))
- **pass:** add base inputs ([862129e](https://github.com/nartc/angular-three/commit/862129eadbde5c98780c3ce3a29127a91473af29))
- **postprocessing:** expose ready output for Pass ([2518999](https://github.com/nartc/angular-three/commit/2518999f8f4ae104e1dfc022da282230bdec90a9))
- **postprocessing:** have Pass abstract accept a list of arbitrary path/value pair ([588631e](https://github.com/nartc/angular-three/commit/588631eebb3fd955c2419c24290d808d952293eb))
- **postprocessing:** intiialize effectComposer outside of Angular ([8ced0c6](https://github.com/nartc/angular-three/commit/8ced0c68092905bce70477ba49fc8274e9bcecda))
- **postprocessing:** listen for change internally with a flag ([c1bd801](https://github.com/nartc/angular-three/commit/c1bd80156ebeb1e42c3ffbb27c5b3cd0704ce8bc))
- **render-pass:** add PostProcessing with RenderPass ([d865161](https://github.com/nartc/angular-three/commit/d865161c08473f35ecad6bfe7c66fff24d408968))
- **render-pass:** internalize scene and camera ([dcfb256](https://github.com/nartc/angular-three/commit/dcfb25624dd8ea53e7ec26953b6cc2e1905a7303))
- **shader-pass/unreal-bloom-pass:** add ShaderPass and UnrealBloomPass ([1a226c5](https://github.com/nartc/angular-three/commit/1a226c5d65f45ee6f9b9db947edc44c251b789ac))
- **ssao-pass:** add SSAOPass ([fe020f8](https://github.com/nartc/angular-three/commit/fe020f8cedc3fabd040b2464996ec91ad6b0aecc))
- **ssao-pass:** internalize scene and camera ([d6475b5](https://github.com/nartc/angular-three/commit/d6475b592503b8beeebc2d59cd104fc9fe9b8b58))
- **stats:** rename CoreStats to ThreeCoreStats ([48ccc90](https://github.com/nartc/angular-three/commit/48ccc90ba70388f88734c9cb0e4b7e6f945ec517))
- **stats:** separate stats into a lib ([a371d24](https://github.com/nartc/angular-three/commit/a371d24adfe700b9bbd630e6d9e300a1fe05f7ff))
- **typings:** add UniqueMeshArgs type ([158049a](https://github.com/nartc/angular-three/commit/158049a487017e886892c8c5b8c26a28bf5c65bb))
- **typings:** add UnknownConstructor ([d9b311b](https://github.com/nartc/angular-three/commit/d9b311bd526c512b7a53e6855105b0b44da893a1))
- **typings:** add UnknownRecord alias ([21d2e8c](https://github.com/nartc/angular-three/commit/21d2e8cf669ebeb7cd1359cc8e0020ea37d2034a))
- **utils:** add applyDottedPathProps ([065cd82](https://github.com/nartc/angular-three/commit/065cd821348f74a05e2b9a6a8a5573915815d75d))
- adjust packages around ([c40d7e2](https://github.com/nartc/angular-three/commit/c40d7e29e298b5ac8f6764a13dfd7e632d28ab64))

### Bug Fixes

- **attributes:** adjust ngpackage ([a1a4e67](https://github.com/nartc/angular-three/commit/a1a4e67a3e1985add8cdfaaafa0db7359ed19e83))
- **attributes:** attribute attach/remove itself on the parent ([1485a8e](https://github.com/nartc/angular-three/commit/1485a8ef9d84ed5b68ae0d8f4783665342620d27))
- **attributes:** initialize attribute outside of angular ([8153577](https://github.com/nartc/angular-three/commit/8153577ca0fd9f07e60cbdb7acc6bdbe9e7b5128))
- **core:** add name input to object3d ([67a8ba4](https://github.com/nartc/angular-three/commit/67a8ba41bd495694047274d063454b8e3a3649d5))
- **core:** add name input to object3d ([3675e31](https://github.com/nartc/angular-three/commit/3675e31281a2e36d9a34e1f133fb51517fe71da8))
- **core:** add umdModuleIds to group and scene ([315a271](https://github.com/nartc/angular-three/commit/315a271cdc314b2b278d0f5472aabd21aeff4b32))
- **core:** add umdModuleIds to group and scene ([da61460](https://github.com/nartc/angular-three/commit/da614606a37fbcd8199637506b2505cc8e5601b0))
- **core:** adjust imported types ([13258ae](https://github.com/nartc/angular-three/commit/13258aefdc5878e96dbd9e7eae338f042fcd7770))
- **core:** adjust ngOnChanges ([ce71f26](https://github.com/nartc/angular-three/commit/ce71f267119bc38412edd8b44b65fbcc2a484abb))
- **core:** adjust registerAnimation typings ([55a4eb6](https://github.com/nartc/angular-three/commit/55a4eb6172a660afafac224a57eb37151d59cc4a))
- **core:** bring renderer.render to top so effectComposer.render can override ([0ea75e8](https://github.com/nartc/angular-three/commit/0ea75e8c34fc9553c792cd1f26fd173f7a6f02be))
- **core:** change Injectable to Directive for ThreeObject3d ([fe21def](https://github.com/nartc/angular-three/commit/fe21defc447e6bb1767552af1ca32684179b5f8c))
- **core:** reexport groupDirective ([51ccdc0](https://github.com/nartc/angular-three/commit/51ccdc02f393ab10e3d0b5b3df828ffbaa0818f5))
- **core:** reexport groupDirective ([d8db526](https://github.com/nartc/angular-three/commit/d8db526ff40ca1cc7c9a6cfe6c9e2fedcb829a32))
- **core:** rename ThreeCoreCanvas to ThreeCanvas ([85f8595](https://github.com/nartc/angular-three/commit/85f85956656709a26b95113c7faa32d2d63ec992))
- **core:** skip 6 common inputs in ngOnChanges ([9af3232](https://github.com/nartc/angular-three/commit/9af32325fde2db27817c0c88d374f644b2372f1e))
- **core:** use TextBufferGeometry ([be45869](https://github.com/nartc/angular-three/commit/be45869fa4ee46c9e5ca0ed17b742f8e1858a3cb))
- **geometries:** adjust extraArgs in base ([9115ed5](https://github.com/nartc/angular-three/commit/9115ed5692158e64759c1973f423d45fc17d7b2d))
- **geometries:** attribute attach/remove itself ([816748b](https://github.com/nartc/angular-three/commit/816748bcf2758a1c54313e70cb9f3d114b0579b9))
- **geometries:** fix import path ([368de67](https://github.com/nartc/angular-three/commit/368de6785c382ed16a2c97c6d7c0cd83f4a2c0a7))
- **lights:** adjust extraArgs in base ([30ef5dd](https://github.com/nartc/angular-three/commit/30ef5ddb6d7132da8b6a7961415013845212faed))
- **materials:** adjust how sub materials classes instantiate new material ([80d32d0](https://github.com/nartc/angular-three/commit/80d32d0275c8bd69200222e98b4de335e76735be))
- **materials:** adjust type ([9f9cd75](https://github.com/nartc/angular-three/commit/9f9cd756bb1b02dca325fc080823a44f74c94d4c))
- **materials:** initialize material outside of angular ([e19393d](https://github.com/nartc/angular-three/commit/e19393d4e21dbd78da09293092458be6a569e01b))
- **meshes:** adjust extraArgs in base ([6bdc3e4](https://github.com/nartc/angular-three/commit/6bdc3e45819420ab627f5c2eeb28dd878ae28742))
- **postprocessing:** add umdModuleId to shaderPass ([f73ddc7](https://github.com/nartc/angular-three/commit/f73ddc717c28948803f16491f33c5a278d638e62))
- **ssao-pass:** rename module ([70ee2be](https://github.com/nartc/angular-three/commit/70ee2be9c1d07eb6fe3335755e546f932f1e708a))
- **stats:** adjust ngpackage ([e5bd7f0](https://github.com/nartc/angular-three/commit/e5bd7f0cb56b666ac44f22d1e6428dd881b6c179))
- **typings:** remove unused types ([c40a91d](https://github.com/nartc/angular-three/commit/c40a91de08196d6d03e0fc76c6cd4ea8d53a33b9))
- **utils:** if a prop has needsUpdate, assign to true ([b9c1f5b](https://github.com/nartc/angular-three/commit/b9c1f5b3cd2b26e9162988117bce53a1388cbc91))

### Documentations

- **demo:** add birds demo ([c91a529](https://github.com/nartc/angular-three/commit/c91a529231efdd863ed539e6aed0270389274513))
- **demo:** add boxes example ([5185391](https://github.com/nartc/angular-three/commit/51853913f2ec447a9252eb77918d5b598c81ec41))
- **demo:** add demo ([7ba53e6](https://github.com/nartc/angular-three/commit/7ba53e6342484a47a4f0cecec1607beae07ee1f0))
- **demo:** add effects demo ([02d772a](https://github.com/nartc/angular-three/commit/02d772ac361264cd53394471d9ae5353f9c50137))
- **demo:** add orbitContorls ([8b5da79](https://github.com/nartc/angular-three/commit/8b5da79acf81cace3a5fd41ec9161376463b94fe))
- **demo:** adjust effects demo ([040e2d0](https://github.com/nartc/angular-three/commit/040e2d0e88e32bf7fa620d5d23b3bdc09da0bef8))
- **demo:** fix effects demo ([876ab40](https://github.com/nartc/angular-three/commit/876ab400b4152b6a0bae84e420813cc3c02ad71f))
- **demo:** update demo to use stats ([c2e5c73](https://github.com/nartc/angular-three/commit/c2e5c737644cc48da8a2b7929f6fbbcca0fc582e))
- **demo:** update import ([68879f6](https://github.com/nartc/angular-three/commit/68879f6f902a07437ed1fdacdd9fddc26df67006))