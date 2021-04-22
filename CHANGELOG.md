## [1.0.0-beta.10](https://github.com/nartc/angular-three/compare/1.0.0-beta.9...1.0.0-beta.10) (2021-04-22)


### Features

* **controls:** add zonelessReady to flyControls ([046bc2a](https://github.com/nartc/angular-three/commit/046bc2a331518a3a1792762dbe800fba72f37ff1))
* **controls:** add zonelessReady to orbitControls ([c651fe9](https://github.com/nartc/angular-three/commit/c651fe958f058d57e845f5966cc1d49ee019535e))
* **core:** add zonelessReady to AudioListener ([7605f79](https://github.com/nartc/angular-three/commit/7605f798c6aae4fbb8051026d3a4c3bacd2d680a))
* **core:** add zonelessReady to Skeleton ([a00cd50](https://github.com/nartc/angular-three/commit/a00cd501e3f0b00942a5c0f74c263ebf4f29bdd4))
* **postprocessing:** add zonelessReady ([7cb674c](https://github.com/nartc/angular-three/commit/7cb674cfb5f24174e9bffaeda246038de58e9d9b))


### Bug Fixes

* **core:** null check for bufferGeometry and material in Mesh ([91f5497](https://github.com/nartc/angular-three/commit/91f5497ece953164c3090ec5146f0efc9e354afc))
* **core:** rework LOD ([a30e2d3](https://github.com/nartc/angular-three/commit/a30e2d3bb6a30b04636db94a1a251c036528de42))


### Documentations

* **demo:** adjust demo ([1905f69](https://github.com/nartc/angular-three/commit/1905f69d1104ffe2bd1d558813fe17f3bc8b9dfb))

## [1.0.0-beta.9](https://github.com/nartc/angular-three/compare/1.0.0-beta.8...1.0.0-beta.9) (2021-04-22)


### Bug Fixes

* **core:** remove recursivePartial and add background to common instead ([12c9bf2](https://github.com/nartc/angular-three/commit/12c9bf2477271a8bfdc80ace660df28c66c89908))

## [1.0.0-beta.8](https://github.com/nartc/angular-three/compare/1.0.0-beta.7...1.0.0-beta.8) (2021-04-22)


### Bug Fixes

* **core:** add RecursivePartial type ([66bcd14](https://github.com/nartc/angular-three/commit/66bcd14632ec6d7f64525c106a6b950d9c9db9fb))

## [1.0.0-beta.7](https://github.com/nartc/angular-three/compare/1.0.0-beta.6...1.0.0-beta.7) (2021-04-21)


### Features

* **core:** add AnimationLoopParticipant class for animateReady output ([4c189a0](https://github.com/nartc/angular-three/commit/4c189a0d69b79c0383f592f5a975e5b5e7bb3ea9))


### Bug Fixes

* **controls:** have OrbitControls and FlyControls extend AnimationLoopParticipant ([2c43a8a](https://github.com/nartc/angular-three/commit/2c43a8afa8d4dfdd2cb6503f67af62b1553b38ea))
* **core:** adjust windowResizeEffect ([a99ba0e](https://github.com/nartc/angular-three/commit/a99ba0ec77d2e7796f6e9764d0ae7f776e777660))
* **core:** have Object3d extends AnimationLoopParticipant ([420bb88](https://github.com/nartc/angular-three/commit/420bb88adbc48d6780cc8ae53a275d8dc58c80aa))


### Documentations

* **demo:** clean up demo ([a466c8a](https://github.com/nartc/angular-three/commit/a466c8af6191c69f6e99838f18a0d75e583eeca9))

## [1.0.0-beta.6](https://github.com/nartc/angular-three/compare/1.0.0-beta.5...1.0.0-beta.6) (2021-04-21)


### Features

* **core:** add MeshBasicMaterial ([704a29c](https://github.com/nartc/angular-three/commit/704a29c3aa2736c5d2178a3ffac673a1e62aac6f))


### Bug Fixes

* **core:** initialize material in OnInit ([d073270](https://github.com/nartc/angular-three/commit/d073270c51b61cd925c81b242370abe35e416f92))


### Documentations

* **demo:** adjust demo ([4937f42](https://github.com/nartc/angular-three/commit/4937f42960fb594712b7291358cb8b1238cff475))

## [1.0.0-beta.5](https://github.com/nartc/angular-three/compare/1.0.0-beta.4...1.0.0-beta.5) (2021-04-21)


### Features

* **core:** add circlebuffergeometry ([d89e2f2](https://github.com/nartc/angular-three/commit/d89e2f2e3357429b289e01faa37a2a46abfa6e35))

## [1.0.0-beta.4](https://github.com/nartc/angular-three/compare/1.0.0-beta.3...1.0.0-beta.4) (2021-04-21)


### Features

* **controls:** prefix Three to FlyControls ([9074cc6](https://github.com/nartc/angular-three/commit/9074cc686152096390aa3cd9f6c3b3d5ab5173df))
* **core:** prefix Three to new modules ([40be427](https://github.com/nartc/angular-three/commit/40be42746ae4c232c2e41815ebd713354dc5839e))
* **core:** remove LodLevelDirective ([390d781](https://github.com/nartc/angular-three/commit/390d781b2105263a513b84e9a8819acadebdca6b))


### Bug Fixes

* **core:** fix circular dep ([b04273d](https://github.com/nartc/angular-three/commit/b04273db2e2a065a8b311cf57dd07714f41e1b95))


### Documentations

* **demo:** adjust demo with new imports ([332461f](https://github.com/nartc/angular-three/commit/332461f276d71b99ee13f82e89f6b0eb560672a5))
* **demo:** adjust docs ([ebfaa95](https://github.com/nartc/angular-three/commit/ebfaa95a7f2c760a2af42c5164afa62806b91bec))

## [1.0.0-beta.3](https://github.com/nartc/angular-three/compare/1.0.0-beta.2...1.0.0-beta.3) (2021-04-21)


### Features

* **audio:** add PositionalAudio ([7e49db6](https://github.com/nartc/angular-three/commit/7e49db63cc0d9ad5a8b57823d866495cf381819c))
* **controls:** add FlyControls ([5b18c29](https://github.com/nartc/angular-three/commit/5b18c291b1de1acc80c162dfb5c91b0655de6d68))
* **core:** add `(ready)` to audios ([c03c5ab](https://github.com/nartc/angular-three/commit/c03c5ab8104882360ee3e6f8a19e5618c62c2ab1))
* **core:** add a base class for object that has a geometry and a material ([45ef17e](https://github.com/nartc/angular-three/commit/45ef17ec373dae55084e7a260cc9fb47290f2735))
* **core:** add AudioListener ([b5e8eff](https://github.com/nartc/angular-three/commit/b5e8eff13e8cf6b4d0faaef0dc9e628d7ecea452))
* **core:** add HemisphereLight ([ca9d72c](https://github.com/nartc/angular-three/commit/ca9d72ccfce00149104bad720cf47a251c3b7e5e))
* **core:** add IcosahedronGeometry ([5f2e981](https://github.com/nartc/angular-three/commit/5f2e98173795fcda6a9678ccdfa33655692b4336))
* **core:** add Line, LineLoop, LineSegments ([e2c4af5](https://github.com/nartc/angular-three/commit/e2c4af524250fb8308cd18a7108fe94f55964da9))
* **core:** add LOD ([a295c77](https://github.com/nartc/angular-three/commit/a295c772ac05d717049f86ff33f67c037f475f63))
* **core:** add Points ([bd76850](https://github.com/nartc/angular-three/commit/bd76850d40700924edb16c52eef1abd98d9d92b5))
* **core:** add PointsMaterial ([9e9bc0d](https://github.com/nartc/angular-three/commit/9e9bc0d16b764c4bcaaae7caed4f2b6718af9fd3))
* **core:** add RectAreaLight ([504b08f](https://github.com/nartc/angular-three/commit/504b08ffc11985b357068b9b3051637763e08e79))
* **core:** add SkinnedMesh, Skeleton, and Bone ([62f1e6c](https://github.com/nartc/angular-three/commit/62f1e6cba875686ac55f41bb89a304236b61a82c))
* **core:** add Sprite ([24179f6](https://github.com/nartc/angular-three/commit/24179f65ab5ebd256337d0cf091c6df0f8f6c956))
* **core:** add SpriteMaterial ([9210721](https://github.com/nartc/angular-three/commit/9210721efe9d3832e3450a3497d5dc5f91641186))


### Bug Fixes

* **core:** add intensity input to Light objects ([b832295](https://github.com/nartc/angular-three/commit/b832295421049529b3e5289426613ba3afcded19))
* **core:** adjust MeshAbstract to use new base object ([68a29d5](https://github.com/nartc/angular-three/commit/68a29d522628b067d7ab0c0fce7f7afe32046886))
* **core:** ensure to initialize geometry in ngOnInit ([af0132e](https://github.com/nartc/angular-three/commit/af0132ec665996ebf4155d39f7e439369c68fced))
* **core:** ensure to initialize LOD in init ([28a88a7](https://github.com/nartc/angular-three/commit/28a88a73efdfd102a300d1101e0d0c7d09e380a6))
* **core:** import type for Object3d in audios ([023f2cd](https://github.com/nartc/angular-three/commit/023f2cdaf4dea3569756ac01701b3e6143f533f3))
* **core:** make AudioListener not extends ThreeObject3d ([12cc61c](https://github.com/nartc/angular-three/commit/12cc61ca73c94636849cf6e37ca5b088a97e3cb1))
* **core:** make ThreeObject3d a multi provider ([89683c9](https://github.com/nartc/angular-three/commit/89683c9b27ce05a2592f98c2c4eafc9ba5f9a5fd))
* **core:** precalc animationCallbacks and hasPriority in store ([fc4d7ff](https://github.com/nartc/angular-three/commit/fc4d7ff2ee8fb2b4b033e3743695d19fc0b00465))
* **core:** remove multi providers ([180d184](https://github.com/nartc/angular-three/commit/180d18497a90db172769584c0dd19aef07009569))


### Refactor

* **core:** use runOutsideAngular operator on imperative subscription ([108a055](https://github.com/nartc/angular-three/commit/108a0551ac8fe6503a2bd8c472115d1bcf4fa97f))


### Documentations

* **demo:** add LOD demo ([5020adb](https://github.com/nartc/angular-three/commit/5020adb8303f3385748e8a6a395c9358a0e539dc))
* **demo:** init docusaurus ([f5ebd63](https://github.com/nartc/angular-three/commit/f5ebd638380f0363f23578aff1db818047e60cd9))

## [1.0.0-beta.2](https://github.com/nartc/angular-three/compare/1.0.0-beta.1...1.0.0-beta.2) (2021-04-19)


### Features

* **core:** add remove effects to InstancesStore (wip) ([a042820](https://github.com/nartc/angular-three/commit/a042820b525091c134fb49e0168217054ee44f70))
* **core:** return a cleanup function from registerAnimation ([e3020eb](https://github.com/nartc/angular-three/commit/e3020eb23f5abf69df535b8fbbe81f006f59e987))
* **postprocessing:** add ready output to EffectComposer ([c66c4dd](https://github.com/nartc/angular-three/commit/c66c4dd15267b5862d29373a109dbbd647cab197))


### Bug Fixes

* **controls:** initialize OrbitControls outsideOfAngular ([f87c17c](https://github.com/nartc/angular-three/commit/f87c17c9d08c4c95357ee46c62510fa7e0e3febb))
* **core:** clean up and make Attributes consistent with the rest ([9d6e434](https://github.com/nartc/angular-three/commit/9d6e4344902ea1716d46ebcc99c3aaa64af63ddc))
* **core:** clean up and make Geometries consistent with the rest ([5b9a749](https://github.com/nartc/angular-three/commit/5b9a749cddd59c15f4bf8027e1ba23ed961f8d2c))
* **core:** clean up and make Lights consistent with the rests ([b7c24c3](https://github.com/nartc/angular-three/commit/b7c24c3eeafb25abc6e2c2d6d1b8e42284dc953e))
* **core:** clean up and make Materials consistent with the rest ([650977a](https://github.com/nartc/angular-three/commit/650977a2c8ba65ad163831d7298b72c056b3a9a7))
* **core:** ensure to clean up properly on object3d destroy ([a37d0cc](https://github.com/nartc/angular-three/commit/a37d0cc06fe2f52466df9cd2dcee9303cffc8788))
* **core:** rename UnknownConstructor to AnyConstructor with any[] instead of unknown[] ([494f18d](https://github.com/nartc/angular-three/commit/494f18d5bbd29447a44feac2b560c6b5be697774))
* **core:** use AnyConstructor for Mesh abstract ([6857a71](https://github.com/nartc/angular-three/commit/6857a7126a54c1ad8b2c1fd2cfa3a48ff22f62ca))


### Documentations

* **demo:** adjust demo to use (ready) instead of ViewChild. Seems more consistent ([b4578ba](https://github.com/nartc/angular-three/commit/b4578ba3b0d7d78c9363cf01b901df9408cc585b))

## [1.0.0-beta.1](https://github.com/nartc/angular-three/compare/1.0.0-beta.0...1.0.0-beta.1) (2021-04-18)


### Bug Fixes

* move typings from 2nd entry to core ([63a0c7d](https://github.com/nartc/angular-three/commit/63a0c7d4cb04191abed58be4d3c762ed15b19f1b))

## 1.0.0-beta.0 (2021-04-18)


### Features

* **attributes:** add Attribute ([d23a35e](https://github.com/nartc/angular-three/commit/d23a35eca9b7eafb0e988347163104e762f7e961))
* **core:** add core lib with essential building blocks ([72a1284](https://github.com/nartc/angular-three/commit/72a128490de30b38f18ad4271b3a8cddd5c09717))
* **core:** add delta to RenderState ([445e7e2](https://github.com/nartc/angular-three/commit/445e7e21dd76ef8bab0b7f4737d1a980d17f149e))
* **core:** add FontLoader ([07872bc](https://github.com/nartc/angular-three/commit/07872bc00c1fba0217e444564fa5fe9849735afc))
* **core:** add FontLoader ([1357f2d](https://github.com/nartc/angular-three/commit/1357f2dd554664576de45a323a38ab1e0b5d2636))
* **core:** add Group ([a12c799](https://github.com/nartc/angular-three/commit/a12c7999cd2d8a85b4bea41259b080b29f213c2b))
* **core:** add morphTarget inputs to ThreeMesh ([8b0b3ee](https://github.com/nartc/angular-three/commit/8b0b3ee28d4c8f49bf5a7cc9f572d62f750943d8))
* **core:** add priority to animationCallback ([9fd44d6](https://github.com/nartc/angular-three/commit/9fd44d6af961888ebbf3a9bb4824f85ac4424756))
* **core:** add Scene ([891808e](https://github.com/nartc/angular-three/commit/891808e43fb380d7ec1ab1470104961bb319da32))
* **core:** add Scene ([cde2708](https://github.com/nartc/angular-three/commit/cde270880f179984333dc3d1577ef2ab76dd5fa6))
* **core:** expose applyProps ([510d1d0](https://github.com/nartc/angular-three/commit/510d1d0acf269f19f31d93ab10daa0a151d213e9))
* **core:** remove stats from core ([0c09ff3](https://github.com/nartc/angular-three/commit/0c09ff3901d254ff2a3cb3b857782d5c0433988a))
* **geometries:** add geometries ([4b6174d](https://github.com/nartc/angular-three/commit/4b6174de7c1443b1df1386de227e2bf5bbfa8be0))
* **geometries:** add TextBufferGeometry ([476a452](https://github.com/nartc/angular-three/commit/476a452f26344d6d3713fe46e0c88f9242bca6a2))
* **geometries:** use ThreeAttribute ([f70c94f](https://github.com/nartc/angular-three/commit/f70c94fab23b6dad5d995fde4188c886aaa5715b))
* **lights:** add lights ([eafae5c](https://github.com/nartc/angular-three/commit/eafae5c0b99d1eb957ea825601f99706f1be6bad))
* **lights:** add SpotLight ([683ff28](https://github.com/nartc/angular-three/commit/683ff289e1385c492d83d37a13ac22cae89a39c4))
* **loaders:** add external loaders lib ([3a6e1f3](https://github.com/nartc/angular-three/commit/3a6e1f3143ac03307c24f7ef919b5c4cda489b64))
* **loaders:** add external loaders lib ([8fec053](https://github.com/nartc/angular-three/commit/8fec05321f562ff4b4c1fcc0c7c1c75c1115fc84))
* **loaders:** add gltfLoader ([b4d25f0](https://github.com/nartc/angular-three/commit/b4d25f0acc0dd18760bc7ff32d420ca0818eda20))
* **loaders:** add gltfLoader ([49fea21](https://github.com/nartc/angular-three/commit/49fea21f6a06ae3f54d4c446982cda31b9fa6add))
* **loaders:** add loaders ([bd9f42c](https://github.com/nartc/angular-three/commit/bd9f42c5ef461e00a527671349abec9ba98fb4f5))
* **materials:** add materials lib ([69dbdda](https://github.com/nartc/angular-three/commit/69dbdda7edd3e0992890685199c49559a78f8b2e))
* **meshes:** add meshes ([b31e68b](https://github.com/nartc/angular-three/commit/b31e68b319d05afabd5e2b66e02e1edf8584ae90))
* **orbit-controls:** add OrbitControls ([5404837](https://github.com/nartc/angular-three/commit/5404837d22c4ba3cbdb682f7856ba8a5fdd0c7cb))
* **pass:** add base inputs ([862129e](https://github.com/nartc/angular-three/commit/862129eadbde5c98780c3ce3a29127a91473af29))
* **postprocessing:** expose ready output for Pass ([2518999](https://github.com/nartc/angular-three/commit/2518999f8f4ae104e1dfc022da282230bdec90a9))
* **postprocessing:** have Pass abstract accept a list of arbitrary path/value pair ([588631e](https://github.com/nartc/angular-three/commit/588631eebb3fd955c2419c24290d808d952293eb))
* **postprocessing:** intiialize effectComposer outside of Angular ([8ced0c6](https://github.com/nartc/angular-three/commit/8ced0c68092905bce70477ba49fc8274e9bcecda))
* **postprocessing:** listen for change internally with a flag ([c1bd801](https://github.com/nartc/angular-three/commit/c1bd80156ebeb1e42c3ffbb27c5b3cd0704ce8bc))
* **render-pass:** add PostProcessing with RenderPass ([d865161](https://github.com/nartc/angular-three/commit/d865161c08473f35ecad6bfe7c66fff24d408968))
* **render-pass:** internalize scene and camera ([dcfb256](https://github.com/nartc/angular-three/commit/dcfb25624dd8ea53e7ec26953b6cc2e1905a7303))
* **shader-pass/unreal-bloom-pass:** add ShaderPass and UnrealBloomPass ([1a226c5](https://github.com/nartc/angular-three/commit/1a226c5d65f45ee6f9b9db947edc44c251b789ac))
* **ssao-pass:** add SSAOPass ([fe020f8](https://github.com/nartc/angular-three/commit/fe020f8cedc3fabd040b2464996ec91ad6b0aecc))
* **ssao-pass:** internalize scene and camera ([d6475b5](https://github.com/nartc/angular-three/commit/d6475b592503b8beeebc2d59cd104fc9fe9b8b58))
* **stats:** rename CoreStats to ThreeCoreStats ([48ccc90](https://github.com/nartc/angular-three/commit/48ccc90ba70388f88734c9cb0e4b7e6f945ec517))
* **stats:** separate stats into a lib ([a371d24](https://github.com/nartc/angular-three/commit/a371d24adfe700b9bbd630e6d9e300a1fe05f7ff))
* **typings:** add UniqueMeshArgs type ([158049a](https://github.com/nartc/angular-three/commit/158049a487017e886892c8c5b8c26a28bf5c65bb))
* **typings:** add UnknownConstructor ([d9b311b](https://github.com/nartc/angular-three/commit/d9b311bd526c512b7a53e6855105b0b44da893a1))
* **typings:** add UnknownRecord alias ([21d2e8c](https://github.com/nartc/angular-three/commit/21d2e8cf669ebeb7cd1359cc8e0020ea37d2034a))
* **utils:** add applyDottedPathProps ([065cd82](https://github.com/nartc/angular-three/commit/065cd821348f74a05e2b9a6a8a5573915815d75d))
* adjust packages around ([c40d7e2](https://github.com/nartc/angular-three/commit/c40d7e29e298b5ac8f6764a13dfd7e632d28ab64))


### Bug Fixes

* **attributes:** adjust ngpackage ([a1a4e67](https://github.com/nartc/angular-three/commit/a1a4e67a3e1985add8cdfaaafa0db7359ed19e83))
* **attributes:** attribute attach/remove itself on the parent ([1485a8e](https://github.com/nartc/angular-three/commit/1485a8ef9d84ed5b68ae0d8f4783665342620d27))
* **attributes:** initialize attribute outside of angular ([8153577](https://github.com/nartc/angular-three/commit/8153577ca0fd9f07e60cbdb7acc6bdbe9e7b5128))
* **core:** add name input to object3d ([67a8ba4](https://github.com/nartc/angular-three/commit/67a8ba41bd495694047274d063454b8e3a3649d5))
* **core:** add name input to object3d ([3675e31](https://github.com/nartc/angular-three/commit/3675e31281a2e36d9a34e1f133fb51517fe71da8))
* **core:** add umdModuleIds to group and scene ([315a271](https://github.com/nartc/angular-three/commit/315a271cdc314b2b278d0f5472aabd21aeff4b32))
* **core:** add umdModuleIds to group and scene ([da61460](https://github.com/nartc/angular-three/commit/da614606a37fbcd8199637506b2505cc8e5601b0))
* **core:** adjust imported types ([13258ae](https://github.com/nartc/angular-three/commit/13258aefdc5878e96dbd9e7eae338f042fcd7770))
* **core:** adjust ngOnChanges ([ce71f26](https://github.com/nartc/angular-three/commit/ce71f267119bc38412edd8b44b65fbcc2a484abb))
* **core:** adjust registerAnimation typings ([55a4eb6](https://github.com/nartc/angular-three/commit/55a4eb6172a660afafac224a57eb37151d59cc4a))
* **core:** bring renderer.render to top so effectComposer.render can override ([0ea75e8](https://github.com/nartc/angular-three/commit/0ea75e8c34fc9553c792cd1f26fd173f7a6f02be))
* **core:** change Injectable to Directive for ThreeObject3d ([fe21def](https://github.com/nartc/angular-three/commit/fe21defc447e6bb1767552af1ca32684179b5f8c))
* **core:** reexport groupDirective ([51ccdc0](https://github.com/nartc/angular-three/commit/51ccdc02f393ab10e3d0b5b3df828ffbaa0818f5))
* **core:** reexport groupDirective ([d8db526](https://github.com/nartc/angular-three/commit/d8db526ff40ca1cc7c9a6cfe6c9e2fedcb829a32))
* **core:** rename ThreeCoreCanvas to ThreeCanvas ([85f8595](https://github.com/nartc/angular-three/commit/85f85956656709a26b95113c7faa32d2d63ec992))
* **core:** skip 6 common inputs in ngOnChanges ([9af3232](https://github.com/nartc/angular-three/commit/9af32325fde2db27817c0c88d374f644b2372f1e))
* **core:** use TextBufferGeometry ([be45869](https://github.com/nartc/angular-three/commit/be45869fa4ee46c9e5ca0ed17b742f8e1858a3cb))
* **geometries:** adjust extraArgs in base ([9115ed5](https://github.com/nartc/angular-three/commit/9115ed5692158e64759c1973f423d45fc17d7b2d))
* **geometries:** attribute attach/remove itself ([816748b](https://github.com/nartc/angular-three/commit/816748bcf2758a1c54313e70cb9f3d114b0579b9))
* **geometries:** fix import path ([368de67](https://github.com/nartc/angular-three/commit/368de6785c382ed16a2c97c6d7c0cd83f4a2c0a7))
* **lights:** adjust extraArgs in base ([30ef5dd](https://github.com/nartc/angular-three/commit/30ef5ddb6d7132da8b6a7961415013845212faed))
* **materials:** adjust how sub materials classes instantiate new material ([80d32d0](https://github.com/nartc/angular-three/commit/80d32d0275c8bd69200222e98b4de335e76735be))
* **materials:** adjust type ([9f9cd75](https://github.com/nartc/angular-three/commit/9f9cd756bb1b02dca325fc080823a44f74c94d4c))
* **materials:** initialize material outside of angular ([e19393d](https://github.com/nartc/angular-three/commit/e19393d4e21dbd78da09293092458be6a569e01b))
* **meshes:** adjust extraArgs in base ([6bdc3e4](https://github.com/nartc/angular-three/commit/6bdc3e45819420ab627f5c2eeb28dd878ae28742))
* **postprocessing:** add umdModuleId to shaderPass ([f73ddc7](https://github.com/nartc/angular-three/commit/f73ddc717c28948803f16491f33c5a278d638e62))
* **ssao-pass:** rename module ([70ee2be](https://github.com/nartc/angular-three/commit/70ee2be9c1d07eb6fe3335755e546f932f1e708a))
* **stats:** adjust ngpackage ([e5bd7f0](https://github.com/nartc/angular-three/commit/e5bd7f0cb56b666ac44f22d1e6428dd881b6c179))
* **typings:** remove unused types ([c40a91d](https://github.com/nartc/angular-three/commit/c40a91de08196d6d03e0fc76c6cd4ea8d53a33b9))
* **utils:** if a prop has needsUpdate, assign to true ([b9c1f5b](https://github.com/nartc/angular-three/commit/b9c1f5b3cd2b26e9162988117bce53a1388cbc91))


### Documentations

* **demo:** add birds demo ([c91a529](https://github.com/nartc/angular-three/commit/c91a529231efdd863ed539e6aed0270389274513))
* **demo:** add boxes example ([5185391](https://github.com/nartc/angular-three/commit/51853913f2ec447a9252eb77918d5b598c81ec41))
* **demo:** add demo ([7ba53e6](https://github.com/nartc/angular-three/commit/7ba53e6342484a47a4f0cecec1607beae07ee1f0))
* **demo:** add effects demo ([02d772a](https://github.com/nartc/angular-three/commit/02d772ac361264cd53394471d9ae5353f9c50137))
* **demo:** add orbitContorls ([8b5da79](https://github.com/nartc/angular-three/commit/8b5da79acf81cace3a5fd41ec9161376463b94fe))
* **demo:** adjust effects demo ([040e2d0](https://github.com/nartc/angular-three/commit/040e2d0e88e32bf7fa620d5d23b3bdc09da0bef8))
* **demo:** fix effects demo ([876ab40](https://github.com/nartc/angular-three/commit/876ab400b4152b6a0bae84e420813cc3c02ad71f))
* **demo:** update demo to use stats ([c2e5c73](https://github.com/nartc/angular-three/commit/c2e5c737644cc48da8a2b7929f6fbbcca0fc582e))
* **demo:** update import ([68879f6](https://github.com/nartc/angular-three/commit/68879f6f902a07437ed1fdacdd9fddc26df67006))

