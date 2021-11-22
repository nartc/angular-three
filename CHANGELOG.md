## [2.0.0-beta.4](https://github.com/nartc/angular-three/compare/2.0.0-beta.3...2.0.0-beta.4) (2021-11-22)

## [2.0.0-beta.3](https://github.com/nartc/angular-three/compare/2.0.0-beta.2...2.0.0-beta.3) (2021-11-22)


### Features

* add cubic bezier line to object3d ([b44a5f4](https://github.com/nartc/angular-three/commit/b44a5f4af2edcfccefeabeb5c9e58241b28630fa))
* add ngt-soba-line to object-3d template ([e425911](https://github.com/nartc/angular-three/commit/e425911ac7d3b870ec790a5bdfb5c33f7072d7a4))
* add ngt-text and ngt-image to object-3d-controller template ([e4932b6](https://github.com/nartc/angular-three/commit/e4932b65be0e440bea86677674c8d4eaffd8df34))
* add QuadraticBezierLine to object3d controller ([49b6c7c](https://github.com/nartc/angular-three/commit/49b6c7c7cfa6ae3147f3dfa9465bac62e9c4cbe1))
* adjust object3dcontroller template ([c761430](https://github.com/nartc/angular-three/commit/c7614307bab29efb4c593aad726e1483e9860044))
* **core:** abstract Controller ([aa4d285](https://github.com/nartc/angular-three/commit/aa4d285bf63b815c1364dcea54e58995b1764b2d))
* **core:** add [controller] to Object3dController so that it can accept the whole controller for easy merging inputs ([6eae231](https://github.com/nartc/angular-three/commit/6eae23134ccf7d3932b5a45cf3e7e83721eb0f16))
* **core:** add ready output to geometry, material, and texture ([4a1cf22](https://github.com/nartc/angular-three/commit/4a1cf221e6680693c6a8a627203268773476655e))
* **core:** ensure the THREE entities also added to DI with their abstract token ([a4b1bb6](https://github.com/nartc/angular-three/commit/a4b1bb6aebb96bb490f1c46ccdd44803e793fa7d))
* **core:** expose buildGraph util ([7ab8588](https://github.com/nartc/angular-three/commit/7ab8588cf26b53680d2dbfc125930cf71cb78664))
* **soba:** add CubicBezierLine ([a11526d](https://github.com/nartc/angular-three/commit/a11526d4c8b2a6d3323d8182fe4bdad73d963bd3))
* **soba:** add NgtSobaLine ([1604279](https://github.com/nartc/angular-three/commit/160427959933b1d066f896689be0462d39c8c64e))
* **soba:** add QuadraticBezierLine ([68c108c](https://github.com/nartc/angular-three/commit/68c108c150207d01e414e3a05239390e52f6a49d))
* **soba:** add soba lib ([d113bca](https://github.com/nartc/angular-three/commit/d113bca73b77402e63cc478285e1d2a586fef80b))
* **soba:** add SobaLineController for abstraction ([2181e96](https://github.com/nartc/angular-three/commit/2181e9692d576b912689c3df84635b1a16113b69))
* **soba:** add Text component ([46b1dae](https://github.com/nartc/angular-three/commit/46b1dae5045a6a39a86aa4c756d768b97988c381))
* update core peerDep ([9b6c3d5](https://github.com/nartc/angular-three/commit/9b6c3d50443685bae3dcef0fb58483daf2de81c9))
* update peerDep on Angular ([dfc77e1](https://github.com/nartc/angular-three/commit/dfc77e1cb04def0f7e53b6236a7ace0e8806db14))


### Bug Fixes

* **core:** add NgtCurrentViewport type alias for reuse ([483380b](https://github.com/nartc/angular-three/commit/483380b69c655c40ed24bc717f0d9ad053270242))
* **core:** change how getImperativeState() get the state from ([0a3e678](https://github.com/nartc/angular-three/commit/0a3e678e6bf63248146c6ac045be20227882ee1b))
* **core:** make sure intensity on Light is set correctly if passed in ([b96aa5e](https://github.com/nartc/angular-three/commit/b96aa5eb9bd40aa8d145004837c5b6afd6200da9))
* **core:** make sure primitive provides the underlying object3d for NgtObject3d instead of itself ([19d59ed](https://github.com/nartc/angular-three/commit/19d59ed3e4943522a8ab7e4dd33d9b5326425322))
* **core:** move buildGraph to a util fn ([8c2f8d1](https://github.com/nartc/angular-three/commit/8c2f8d1583f50033a75785b05092c4e6399d7ef6))
* **core:** reset attribute to default value if it's there on destroy ([09da731](https://github.com/nartc/angular-three/commit/09da731db99d2e7c54c20b1923fff2c57fa96fb1))
* **soba:** make sure lineController forward all props from passed in lineController ([ed602c9](https://github.com/nartc/angular-three/commit/ed602c9e3f95a2d18204a0ef0f7f4465766fdb5e))
* **soba:** rename image.directive to image.component ([03425af](https://github.com/nartc/angular-three/commit/03425af2ec494c9094fbbd35613eca721f951450))
* **soba:** rename NgtImage to NgtSobaImage ([c00acdc](https://github.com/nartc/angular-three/commit/c00acdc9371a727dbfef77dc683211f9fd340082))
* **soba:** rename NgtText to NgtSobaText ([1d716c6](https://github.com/nartc/angular-three/commit/1d716c6bfa182629e262f6b482a157d2d8926251))
* **soba:** use aliases for THREE types ([064b585](https://github.com/nartc/angular-three/commit/064b58500ea6622e526c2de1c828060be2d46c09))
* **soba:** use line controller for quadratic line ([d8e5b41](https://github.com/nartc/angular-three/commit/d8e5b414f929bbef7793e8acafbc7c56950ff65f))
* update object-3d ([260c371](https://github.com/nartc/angular-three/commit/260c3713ac25d50d95af020b295b3821acb8b7a9))


### Documentations

* **demo:** add kinematic cube demo ([1ffccb3](https://github.com/nartc/angular-three/commit/1ffccb34c061777ab55464c6fdde35507191b334))
* **demo:** clean up ([9dd9048](https://github.com/nartc/angular-three/commit/9dd9048528acd54be55194f8bfd79b44c755a88e))
* **demo:** fix light ([ff09f02](https://github.com/nartc/angular-three/commit/ff09f023e38e8f4a32d81285303de9ad8914e573))
* **demo:** testing out Line ([d46aaa2](https://github.com/nartc/angular-three/commit/d46aaa217e0e26bc4513777d57108ee464dd51cd))
* **demo:** try vertexColors ([cb487c3](https://github.com/nartc/angular-three/commit/cb487c3fdbbb369ada32c375bd31b040c5aaf414))
* **demo:** working on banana ([701f456](https://github.com/nartc/angular-three/commit/701f4560d34e0e0a2fbb66e06314c0c2cfa22e3f))
* **docs:** wip home page ([644c7ee](https://github.com/nartc/angular-three/commit/644c7eeae46e1e7867c71a0bca89ade94b24ea49))
* try out Text ([54cc16a](https://github.com/nartc/angular-three/commit/54cc16a7a1e46393005cd1e48fa9a73a17fdc936))

## [2.0.0-beta.2](https://github.com/nartc/angular-three/compare/2.0.0-beta.1...2.0.0-beta.2) (2021-11-19)


### Features

* **cannon:** generate constraints ([a2631d0](https://github.com/nartc/angular-three/commit/a2631d0ebb7bf3192b0cccc319220f65f2ba969e))


### Bug Fixes

* adjust to angular 13 ([19a923a](https://github.com/nartc/angular-three/commit/19a923a851822f6cf085df55735b516914863b4e))
* remove packageJson generation from workspace generator ([2fee6bb](https://github.com/nartc/angular-three/commit/2fee6bb87816a42568b2654ea78dae352406e557))
* rerun generator ([3a3402a](https://github.com/nartc/angular-three/commit/3a3402a1309a29b8738d4bb900d70c10fbba8712))


### Documentations

* **demo:** add Demo app ([6ff6eb4](https://github.com/nartc/angular-three/commit/6ff6eb4a79fd18ea7eed8c06125200e04a5c2898))
* **docs:** add Docs app ([a239e84](https://github.com/nartc/angular-three/commit/a239e843527e88ce7f5a03d66bf95aa32e7fe09a))
* **docs:** move to less to use TaigaUI doc engine ([0b97086](https://github.com/nartc/angular-three/commit/0b970868e50ce31d401ec764c20e5a571d67b4f3))
* **docs:** setup docs with Taiga ([f3218b7](https://github.com/nartc/angular-three/commit/f3218b7e35c2e6570b5209159f61419686a7fd31))

## [2.0.0-beta.1](https://github.com/nartc/angular-three/compare/2.0.0-beta.0...2.0.0-beta.1) (2021-11-18)


### Features

* **cannon:** add constraints ([7532587](https://github.com/nartc/angular-three/commit/7532587bb78b81ff2f9352da957d7804aa19ed6c))
* **cannon:** generate constraints ([83d6cad](https://github.com/nartc/angular-three/commit/83d6cad1feea13c8427620b14871eae6dab72ccd))
* **core:** add VectorPipeModule ([d4ff85f](https://github.com/nartc/angular-three/commit/d4ff85fc154736f2f3005c8e4c938135ed6d4165))


### Bug Fixes

* **cannon:** regenerate constraints ([8c8af18](https://github.com/nartc/angular-three/commit/8c8af18ae3239967a62f5329d4d7dfcdbee5232d))
* **core:** add Shadow input to light ([2e44307](https://github.com/nartc/angular-three/commit/2e44307bc639b0bde7f41ee4156bdd0de021f12d))
* **core:** adjust type of shadow input for Light ([b0e2157](https://github.com/nartc/angular-three/commit/b0e2157b4804c8b87d78001037678e2d4c688c1c))
* **core:** change outputEncoding to LinearEncoding when linear is true ([c668098](https://github.com/nartc/angular-three/commit/c6680982820fa79475d3eaaa17229b7a6c005430))


### Documentations

* add [@barbados-clemens](https://github.com/barbados-clemens) as a contributor ([4b810d4](https://github.com/nartc/angular-three/commit/4b810d43ff8024aa720abc1617f80d7f162fcda3))
* play around with physics ([96602bf](https://github.com/nartc/angular-three/commit/96602bfe9c3c24e2a0577e68139846fe74ff5a76))

## [2.0.0-beta.0](https://github.com/nartc/angular-three/compare/1.0.0-beta.47...2.0.0-beta.0) (2021-11-17)


### Features

* **cannon:** add and generate bodies ([0f57684](https://github.com/nartc/angular-three/commit/0f576847e95738316648571c26e275628a720991))
* **cannon:** add box and plane ([12f3158](https://github.com/nartc/angular-three/commit/12f3158b5f14daad41f514eaf8f3931c15b3eed0))
* **cannon:** add NgtBody ([8120521](https://github.com/nartc/angular-three/commit/812052162dd610178062cef5dc838bb292e6a5b9))


### Bug Fixes

* **cannon:** expose makeTriplet ([6786dbd](https://github.com/nartc/angular-three/commit/6786dbd7a792e5a154f1c1a0883fc4d2c0fb2dac))
* **cannon:** remove unused params ([fa101a7](https://github.com/nartc/angular-three/commit/fa101a78afb875ee92935080685f418de0a84a10))
* **core:** expose Object3dProps and add alpha to canvas ([42c197c](https://github.com/nartc/angular-three/commit/42c197c14607371f9f2f9c00153ebdbdbb99fdeb))
* **core:** remove self import ([a8f0333](https://github.com/nartc/angular-three/commit/a8f0333a3a7eeef78c1a8338407835c25bc7ce38))


### Documentations

* add initial readme to all packages ([6faac0b](https://github.com/nartc/angular-three/commit/6faac0b43ab52f4d1ae3d23b7dcb75c3b3b0d810))
* **docs:** add physics demo ([8f83434](https://github.com/nartc/angular-three/commit/8f834347050359d09062913f21d54cda5747b9ab))

* ci: adjust build script (11d4a3f)

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
