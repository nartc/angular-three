import {
    NgtCanvasStore,
    NgtLoader,
    NgtStore,
    startWithUndefined,
    tapEffect,
} from '@angular-three/core';
import { Directive, Input, NgModule, NgZone, OnInit } from '@angular/core';
import { Observable, pipe, switchMap, tap } from 'rxjs';
import * as THREE from 'three';
import { RGBELoader } from 'three-stdlib';
import { presetsObj, PresetsType } from './presets';

const CUBEMAP_ROOT =
    'https://rawcdn.githack.com/pmndrs/drei-assets/aa3600359ba664d546d05821bcbca42013587df2';

interface NgtSobaEnvironmentState {
    background?: boolean;
    texture: THREE.Texture;
    files?: string | string[];
    path?: string;
    scene?: THREE.Scene;
    extensions?: (loader: THREE.Loader) => void;
}

@Directive({
    selector: 'ngt-soba-environment',
    exportAs: 'ngtSobaEnvironment',
})
export class NgtSobaEnvironment
    extends NgtStore<NgtSobaEnvironmentState>
    implements OnInit
{
    @Input() set background(v: boolean) {
        this.set({ background: v });
    }

    @Input() set files(v: string | string[]) {
        this.set({ files: v });
    }

    @Input() set path(v: string) {
        this.set({ path: v });
    }

    @Input() set preset(v: PresetsType) {
        if (!(v in presetsObj)) {
            throw new Error(
                'Preset must be one of: ' + Object.keys(presetsObj).join(', ')
            );
        }
        this.set({ files: presetsObj[v], path: CUBEMAP_ROOT + '/hdri/' });
    }

    @Input() set scene(v: THREE.Scene) {
        this.set({ scene: v });
    }

    @Input() set extensions(v: (loader: THREE.Loader) => void) {
        this.set({ extensions: v });
    }

    private textureParams$ = this.select(
        this.select((s) => s.files),
        this.select((s) => s.path),
        this.select((s) => s.extensions).pipe(startWithUndefined()),
        (files, path, extensions) => {
            const loader = this.isCubeMap
                ? THREE.CubeTextureLoader
                : RGBELoader;
            const urls = (this.isCubeMap ? [files] : files) as
                | string[]
                | undefined;
            return { loader, urls, path, extensions };
        }
    );

    private environmentParams$ = this.select(
        this.select((s) => s.texture),
        this.select((s) => s.background),
        this.select((s) => s.scene).pipe(startWithUndefined()),
        (texture, background, scene) => ({ texture, background, scene })
    );

    constructor(
        private zone: NgZone,
        private loader: NgtLoader,
        private canvasStore: NgtCanvasStore
    ) {
        super();
        this.set({
            background: false,
            files: [
                '/px.png',
                '/nx.png',
                '/py.png',
                '/ny.png',
                '/pz.png',
                '/nz.png',
            ],
            path: '',
            scene: undefined,
            extensions: undefined,
        });
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(this.canvasStore.ready$, () => {
                this.setTexture(this.textureParams$);
                this.configureEnvironment(this.environmentParams$);
            });
        });
    }

    private readonly setTexture = this.effect<{
        loader: typeof THREE.CubeTextureLoader | typeof RGBELoader;
        urls: string[] | undefined;
        path: string | undefined;
        extensions: ((loader: THREE.Loader) => void) | undefined;
    }>(
        pipe(
            switchMap(
                (
                    { path, extensions, loader, urls } // @ts-ignore
                ) =>
                    // @ts-ignore
                    this.loader.use(loader, urls, (innerLoader) => {
                        innerLoader.setPath(path!);
                        // @ts-ignore
                        innerLoader.setDataType?.(THREE.FloatType);
                        if (extensions) {
                            extensions(innerLoader);
                        }
                    }) as Observable<THREE.Texture>
            ),
            tap((textureResult) => {
                const texture = textureResult;
                texture.mapping = THREE.EquirectangularReflectionMapping;

                this.set({ texture });
            })
        )
    );

    private readonly configureEnvironment = this.effect<
        Pick<NgtSobaEnvironmentState, 'texture' | 'background' | 'scene'>
    >(
        tapEffect(({ scene, background, texture }) => {
            const defaultScene = this.canvasStore.get((s) => s.scene);
            const oldBg = scene ? scene.background : defaultScene!.background;
            const oldEnv = scene
                ? scene.environment
                : defaultScene!.environment;

            if (scene) {
                scene.environment = texture!;
                if (background) scene.background = texture!;
            } else {
                defaultScene!.environment = texture!;
                if (background) defaultScene!.background = texture!;
            }

            return () => {
                if (scene) {
                    scene.environment = oldEnv;
                    scene.background = oldBg;
                } else {
                    defaultScene!.environment = oldEnv;
                    defaultScene!.background = oldBg;
                }
                texture.dispose();
            };
        })
    );

    private get isCubeMap() {
        return Array.isArray(this.get((s) => s.files));
    }
}

@NgModule({
    declarations: [NgtSobaEnvironment],
    exports: [NgtSobaEnvironment],
})
export class NgtSobaEnvironmentModule {}
