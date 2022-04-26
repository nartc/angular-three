import {
    AnyFunction,
    BooleanInput,
    coerceBooleanProperty,
    coerceNumberProperty,
    is,
    NGT_INSTANCE_HOST_REF,
    NGT_INSTANCE_REF,
    NgtComponentStore,
    NgtInstance,
    NgtInstanceState,
    NgtLoader,
    NgtStore,
    NumberInput,
    Ref,
    startWithUndefined,
    tapEffect,
} from '@angular-three/core';
import {
    ChangeDetectionStrategy,
    Component,
    Directive,
    Inject,
    Injectable,
    Input,
    NgModule,
    NgZone,
    Optional,
    Self,
    SkipSelf,
} from '@angular/core';
import { isObservable, Observable, of, Subscription } from 'rxjs';
import * as THREE from 'three';
import { RGBELoader } from 'three-stdlib';
import { presetsObj, PresetsType } from './presets';

const CUBEMAP_ROOT =
    'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/hdris/';

function resolveScene(scene: THREE.Scene | Ref<THREE.Scene>): THREE.Scene {
    return is.ref(scene) ? scene.value : scene;
}

/**
 * frames?: number
 *   near?: number
 *   far?: number
 *   resolution?: number
 *   background?: boolean | 'only'
 *   map?: THREE.Texture
 *   files?: string | string[]
 *   path?: string
 *   preset?: PresetsType
 *   scene?: Scene | React.MutableRefObject<THREE.Scene>
 *   extensions?: (loader: Loader) => void
 *   ground?:
 *     | boolean
 *     | {
 *         radius?: number
 *         height?: number
 *         scale?: number
 *       }
 */

export interface NgtSobaEnvironmentGenericState<T extends object = {}>
    extends NgtInstanceState<T> {
    frames?: number;
    near?: number;
    far?: number;
    resolution?: number;
    background?: boolean | 'only';
    map?: THREE.Texture;
    files?: string | string[];
    path?: string;
    preset?: PresetsType;
    scene?: THREE.Scene | Ref<THREE.Scene>;
    extensions?: (loader: THREE.Loader) => void;
    ground?:
        | boolean
        | {
              radius?: number;
              height?: number;
              scale?: number;
          };
}

@Directive()
export abstract class NgtSobaEnvironmentGeneric<
    T extends object = {}
> extends NgtInstance<T, NgtSobaEnvironmentGenericState<T>> {
    get frames() {
        return this.get((s) => s.frames);
    }
    @Input() set frames(frames: NumberInput) {
        this.set({ frames: coerceNumberProperty(frames) });
    }

    get near() {
        return this.get((s) => s.near);
    }
    @Input() set near(near: NumberInput) {
        this.set({ near: coerceNumberProperty(near) });
    }

    get far() {
        return this.get((s) => s.far);
    }
    @Input() set far(far: NumberInput) {
        this.set({ far: coerceNumberProperty(far) });
    }

    get resolution() {
        return this.get((s) => s.resolution);
    }
    @Input() set resolution(resolution: NumberInput) {
        this.set({ resolution: coerceNumberProperty(resolution) });
    }

    get background() {
        return this.get((s) => s.background);
    }
    @Input() set background(background: BooleanInput | 'only') {
        this.set({
            background:
                background === 'only'
                    ? background
                    : coerceBooleanProperty(background),
        });
    }

    get map() {
        return this.get((s) => s.map) as THREE.Texture;
    }
    @Input() set map(map: THREE.Texture) {
        this.set({ map });
    }

    get files() {
        return this.get((s) => s.files) as string | string[];
    }
    @Input() set files(files: string | string[]) {
        this.set({ files });
    }

    get path() {
        return this.get((s) => s.path) as string;
    }
    @Input() set path(path: string) {
        this.set({ path });
    }

    get preset() {
        return this.get((s) => s.preset) as PresetsType;
    }
    @Input() set preset(preset: PresetsType) {
        this.set({ preset });
    }

    get scene() {
        return this.get((s) => s.scene) as THREE.Scene | Ref<THREE.Scene>;
    }
    @Input() set scene(scene: THREE.Scene | Ref<THREE.Scene>) {
        this.set({ scene });
    }

    get extensions() {
        return this.get((s) => s.extensions) as (loader: THREE.Loader) => void;
    }
    @Input() set extensions(extensions: (loader: THREE.Loader) => void) {
        this.set({ extensions });
    }

    get ground() {
        return this.get((s) => s.ground);
    }
    @Input() set ground(
        ground:
            | BooleanInput
            | {
                  radius?: number;
                  height?: number;
                  scale?: number;
              }
    ) {
        this.set({
            ground: is.obj(ground) ? ground : coerceBooleanProperty(ground),
        });
    }
}

@Directive({
    selector: '[ngtSobaEnvironmentPassThrough]',
})
export class NgtSobaEnvironmentPassThrough {
    @Input() set ngtSobaEnvironmentPassThrough(wrapper: unknown) {
        this.assertWrapper(wrapper);

        this.host.frames = wrapper.frames;
        this.host.near = wrapper.near;
        this.host.far = wrapper.far;
        this.host.resolution = wrapper.resolution;
        this.host.background = wrapper.background;
        this.host.map = wrapper.map;
        this.host.files = wrapper.files;
        this.host.path = wrapper.path;
        this.host.preset = wrapper.preset;
        this.host.scene = wrapper.scene;
        this.host.extensions = wrapper.extensions;
        this.host.ground = wrapper.ground;
    }

    constructor(@Self() @Optional() private host: NgtSobaEnvironmentGeneric) {
        if (!host) return;
    }

    private assertWrapper(
        wrapper: unknown
    ): asserts wrapper is NgtSobaEnvironmentGeneric {
        if (!(wrapper instanceof NgtSobaEnvironmentGeneric)) {
            throw new Error(
                `[ngtSobaEnvironmentPassThrough] wrapper is not an NgtSobaEnvironmentGeneric`
            );
        }
    }
}

export type NgtSobaEnvironmentResolverParams = Partial<
    Pick<
        NgtSobaEnvironmentGenericState,
        'files' | 'path' | 'preset' | 'extensions'
    >
>;

export interface NgtSobaEnvironmentResolverState
    extends Pick<
        NgtSobaEnvironmentGenericState,
        'files' | 'path' | 'preset' | 'extensions'
    > {
    textureRef: Ref<THREE.Texture | THREE.CubeTexture>;
}

@Injectable()
export class NgtSobaEnvironmentResolver extends NgtComponentStore<NgtSobaEnvironmentResolverState> {
    constructor(private loader: NgtLoader, private store: NgtStore) {
        super();
        this.set({ textureRef: new Ref() });
    }

    private useSubscription?: Subscription;

    use(
        paramsFactory: (
            defaultParams: NgtSobaEnvironmentResolverParams
        ) =>
            | NgtSobaEnvironmentResolverParams
            | Observable<NgtSobaEnvironmentResolverParams>
    ): Ref<THREE.Texture | THREE.CubeTexture> {
        if (this.useSubscription) {
            this.useSubscription.unsubscribe();
        }

        const params = paramsFactory({
            files: [
                '/px.png',
                '/nx.png',
                '/py.png',
                '/ny.png',
                '/pz.png',
                '/nz.png',
            ],
            path: '',
        });

        const params$ = isObservable(params) ? params : of(params);

        this.set(params$);

        this.useSubscription = this.onCanvasReady(
            this.store.ready$,
            () => {
                this.setTexture(
                    this.select(
                        this.select((s) => s.path),
                        this.select((s) => s.files),
                        this.select((s) => s.preset).pipe(startWithUndefined()),
                        this.select((s) => s.extensions).pipe(
                            startWithUndefined()
                        )
                    )
                );

                return () => {
                    if (this.useSubscription) {
                        this.useSubscription.unsubscribe();
                    }
                };
            },
            true
        );

        return this.get((s) => s.textureRef);
    }

    private readonly setTexture = this.effect<{}>(
        tapEffect(() => {
            const { textureRef, extensions, preset } = this.get();
            let { files, path } = this.get();

            if (preset) {
                if (!(preset in presetsObj))
                    throw new Error(
                        'Preset must be one of: ' +
                            Object.keys(presetsObj).join(', ')
                    );
                files = presetsObj[preset];
                path = CUBEMAP_ROOT;
            }

            const isCubeMap = Array.isArray(files);
            const loader = isCubeMap ? THREE.CubeTextureLoader : RGBELoader;

            const sub = this.loader
                .use(
                    // @ts-expect-error
                    loader,
                    isCubeMap ? [files] : files,
                    (loader) => {
                        loader.setPath(path!);
                        if (extensions) extensions(loader);
                    }
                ) // @ts-ignore
                .subscribe((data) => {
                    const texture: THREE.Texture | THREE.CubeTexture = isCubeMap
                        ? // @ts-ignore
                          data[0]
                        : data;

                    texture.mapping = isCubeMap
                        ? THREE.CubeReflectionMapping
                        : THREE.EquirectangularReflectionMapping;

                    textureRef.set(texture);
                });

            return () => {
                sub.unsubscribe();
            };
        })
    );
}

@Component({
    selector: 'ngt-soba-environment-map[map]',
    template: `<ng-content></ng-content>`,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NgtSobaEnvironmentGeneric,
            useExisting: NgtSobaEnvironmentMap,
        },
    ],
})
export class NgtSobaEnvironmentMap extends NgtSobaEnvironmentGeneric {
    protected override preInit() {
        super.preInit();
        this.set((state) => ({
            background: state.background ?? false,
        }));
    }

    override ngOnInit() {
        super.ngOnInit();
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(this.store.ready$, () => {
                this.setEnvironment(
                    this.select(
                        this.store.select((s) => s.scene),
                        this.select((s) => s.background),
                        this.select((s) => s.map),
                        this.select((s) => s.scene).pipe(startWithUndefined())
                    )
                );
            });
        });
    }

    private readonly setEnvironment = this.effect<{}>(
        tapEffect(() => {
            const { map, background, scene } = this.get();
            const defaultScene = this.store.get((s) => s.scene);

            if (map) {
                const target = resolveScene(scene || defaultScene);
                const oldBg = target.background;
                const oldEnv = target.environment;

                if (background !== 'only') {
                    target.environment = map;
                }

                if (background) {
                    target.background = map;
                }

                return () => {
                    if (background !== 'only') {
                        target.environment = oldEnv;
                    }

                    if (background) {
                        target.background = oldBg;
                    }
                };
            }
            return;
        })
    );
}

@Component({
    selector: 'ngt-soba-environment-cube',
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NgtSobaEnvironmentGeneric,
            useExisting: NgtSobaEnvironmentCube,
        },
        NgtSobaEnvironmentResolver,
    ],
})
export class NgtSobaEnvironmentCube extends NgtSobaEnvironmentGeneric {
    constructor(
        zone: NgZone,
        store: NgtStore,
        @Optional()
        @SkipSelf()
        @Inject(NGT_INSTANCE_REF)
        parentRef: AnyFunction<Ref>,
        @Optional()
        @SkipSelf()
        @Inject(NGT_INSTANCE_HOST_REF)
        parentHostRef: AnyFunction<Ref>,
        private environmentResolver: NgtSobaEnvironmentResolver
    ) {
        super(zone, store, parentRef, parentHostRef);
    }

    protected override preInit() {
        super.preInit();
        this.set((state) => ({
            background: state.background ?? false,
        }));
    }

    override ngOnInit() {
        super.ngOnInit();
        // this.zone.runOutsideAngular(() => {});
    }
}

@Component({
    selector: 'ngt-soba-environment',
    template: ``,
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NgtSobaEnvironment {
    constructor() {
        console.warn(`<ngt-soba-environment> is being reworked`);
    }
}

@NgModule({
    declarations: [
        NgtSobaEnvironment,
        NgtSobaEnvironmentPassThrough,
        NgtSobaEnvironmentMap,
        NgtSobaEnvironmentCube,
    ],
    exports: [NgtSobaEnvironment],
})
export class NgtSobaEnvironmentModule {}

// import {
//     NgtCanvasStore,
//     NgtLoader,
//     NgtStore,
//     startWithUndefined,
//     tapEffect,
// } from '@angular-three/core';
// import { Directive, Input, NgModule, NgZone, OnInit } from '@angular/core';
// import { Observable, pipe, switchMap, tap } from 'rxjs';
// import * as THREE from 'three';
// import { RGBELoader } from 'three-stdlib';
// import { presetsObj, PresetsType } from './presets';
//
// const CUBEMAP_ROOT =
//     'https://rawcdn.githack.com/pmndrs/drei-assets/aa3600359ba664d546d05821bcbca42013587df2';
//
// interface NgtSobaEnvironmentState {
//     background?: boolean;
//     texture: THREE.Texture;
//     files?: string | string[];
//     path?: string;
//     scene?: THREE.Scene;
//     extensions?: (loader: THREE.Loader) => void;
// }
//
// @Directive({
//     selector: 'ngt-soba-environment',
//     exportAs: 'ngtSobaEnvironment',
// })
// export class NgtSobaEnvironment
//     extends NgtStore<NgtSobaEnvironmentState>
//     implements OnInit
// {
//     @Input() set background(v: boolean) {
//         this.set({ background: v });
//     }
//
//     @Input() set files(v: string | string[]) {
//         this.set({ files: v });
//     }
//
//     @Input() set path(v: string) {
//         this.set({ path: v });
//     }
//
//     @Input() set preset(v: PresetsType) {
//         if (!(v in presetsObj)) {
//             throw new Error(
//                 'Preset must be one of: ' + Object.keys(presetsObj).join(', ')
//             );
//         }
//         this.set({ files: presetsObj[v], path: CUBEMAP_ROOT + '/hdri/' });
//     }
//
//     @Input() set scene(v: THREE.Scene) {
//         this.set({ scene: v });
//     }
//
//     @Input() set extensions(v: (loader: THREE.Loader) => void) {
//         this.set({ extensions: v });
//     }
//
//     private textureParams$ = this.select(
//         this.select((s) => s.files),
//         this.select((s) => s.path),
//         this.select((s) => s.extensions).pipe(startWithUndefined()),
//         (files, path, extensions) => {
//             const loader = this.isCubeMap
//                 ? THREE.CubeTextureLoader
//                 : RGBELoader;
//             const urls = (this.isCubeMap ? [files] : files) as
//                 | string[]
//                 | undefined;
//             return { loader, urls, path, extensions };
//         }
//     );
//
//     private environmentParams$ = this.select(
//         this.select((s) => s.texture),
//         this.select((s) => s.background),
//         this.select((s) => s.scene).pipe(startWithUndefined()),
//         (texture, background, scene) => ({ texture, background, scene })
//     );
//
//     constructor(
//         private zone: NgZone,
//         private loader: NgtLoader,
//         private canvasStore: NgtCanvasStore
//     ) {
//         super();
//         this.set({
//             background: false,
//             files: [
//                 '/px.png',
//                 '/nx.png',
//                 '/py.png',
//                 '/ny.png',
//                 '/pz.png',
//                 '/nz.png',
//             ],
//             path: '',
//             scene: undefined,
//             extensions: undefined,
//         });
//     }
//
//     ngOnInit() {
//         this.zone.runOutsideAngular(() => {
//             this.onCanvasReady(this.canvasStore.ready$, () => {
//                 this.setTexture(this.textureParams$);
//                 this.configureEnvironment(this.environmentParams$);
//             });
//         });
//     }
//
//     private readonly setTexture = this.effect<{
//         loader: typeof THREE.CubeTextureLoader | typeof RGBELoader;
//         urls: string[] | undefined;
//         path: string | undefined;
//         extensions: ((loader: THREE.Loader) => void) | undefined;
//     }>(
//         pipe(
//             switchMap(
//                 (
//                     { path, extensions, loader, urls } // @ts-ignore
//                 ) =>
//                     // @ts-ignore
//                     this.loader.use(loader, urls, (innerLoader) => {
//                         innerLoader.setPath(path!);
//                         // @ts-ignore
//                         innerLoader.setDataType?.(THREE.FloatType);
//                         if (extensions) {
//                             extensions(innerLoader);
//                         }
//                     }) as Observable<THREE.Texture>
//             ),
//             tap((textureResult) => {
//                 const texture = textureResult;
//                 texture.mapping = THREE.EquirectangularReflectionMapping;
//
//                 this.set({ texture });
//             })
//         )
//     );
//
//     private readonly configureEnvironment = this.effect<
//         Pick<NgtSobaEnvironmentState, 'texture' | 'background' | 'scene'>
//     >(
//         tapEffect(({ scene, background, texture }) => {
//             const defaultScene = this.canvasStore.get((s) => s.scene);
//             const oldBg = scene ? scene.background : defaultScene!.background;
//             const oldEnv = scene
//                 ? scene.environment
//                 : defaultScene!.environment;
//
//             if (scene) {
//                 scene.environment = texture!;
//                 if (background) scene.background = texture!;
//             } else {
//                 defaultScene!.environment = texture!;
//                 if (background) defaultScene!.background = texture!;
//             }
//
//             return () => {
//                 if (scene) {
//                     scene.environment = oldEnv;
//                     scene.background = oldBg;
//                 } else {
//                     defaultScene!.environment = oldEnv;
//                     defaultScene!.background = oldBg;
//                 }
//                 texture.dispose();
//             };
//         })
//     );
//
//     private get isCubeMap() {
//         return Array.isArray(this.get((s) => s.files));
//     }
// }
//
// @NgModule({
//     declarations: [NgtSobaEnvironment],
//     exports: [NgtSobaEnvironment],
// })
// export class NgtSobaEnvironmentModule {}
