import { defaultProjector, NgtComponentStore, NgtLoader, NgtRef, tapEffect } from '@angular-three/core';
import { inject, Injectable } from '@angular/core';
import { animationFrameScheduler, Observable, observeOn } from 'rxjs';
import * as THREE from 'three';
import { RGBELoader } from 'three-stdlib';
import { SobaEnvironmentResolverParams } from './environment-inputs';
import { presetsObj, PresetsType } from './presets';

const CUBEMAP_ROOT = 'https://market-assets.fra1.cdn.digitaloceanspaces.com/market-assets/hdris/';

@Injectable()
export class SobaEnvironmentResolver extends NgtComponentStore {
    private readonly textureRef = new NgtRef<THREE.CubeTexture | THREE.Texture>();
    private readonly loader = inject(NgtLoader);

    private readonly setTexture = this.effect(
        tapEffect(() => {
            const { preset, extensions, encoding } = this.read();
            let { files, path } = this.read();

            if (preset) {
                if (!(preset in presetsObj)) {
                    throw new Error('Preset must be one of: ' + Object.keys(presetsObj).join(', '));
                }
                files = presetsObj[preset as PresetsType];
                path = CUBEMAP_ROOT;
            }

            const isCubeMap = Array.isArray(files);
            const loader = isCubeMap ? THREE.CubeTextureLoader : RGBELoader;

            const texture$ = this.loader.use(
                // @ts-expect-error
                loader,
                isCubeMap ? [files] : files,
                (_loader) => {
                    _loader.setPath(path);
                    if (extensions) extensions(_loader);
                }
            );

            const textureSub = (texture$ as Observable<THREE.Texture | THREE.Texture[]>).subscribe((data) => {
                const texture: THREE.Texture | THREE.CubeTexture = isCubeMap
                    ? // @ts-ignore
                      data[0]
                    : data;

                if (texture) {
                    texture.encoding = encoding ?? isCubeMap ? THREE.sRGBEncoding : THREE.LinearEncoding;
                    texture.mapping = isCubeMap ? THREE.CubeReflectionMapping : THREE.EquirectangularReflectionMapping;

                    this.textureRef.set(texture);
                }
            });

            return () => {
                textureSub.unsubscribe();
            };
        })
    );

    use(
        paramsFactory: (
            defaultParams: SobaEnvironmentResolverParams
        ) => SobaEnvironmentResolverParams | Observable<SobaEnvironmentResolverParams>
    ): NgtRef<THREE.Texture | THREE.CubeTexture> {
        this.write(
            paramsFactory({
                files: ['/px.png', '/nx.png', '/py.png', '/ny.png', '/pz.png', '/nz.png'],
                path: '',
                preset: undefined,
                encoding: undefined,
            })
        );

        this.setTexture(
            this.select(
                this.select((s) => s['path']),
                this.select((s) => s['files']),
                this.select((s) => s['preset']),
                this.select((s) => s['encoding']),
                this.select((s) => s['extensions']),
                defaultProjector,
                { debounce: true }
            ).pipe(observeOn(animationFrameScheduler))
        );

        return this.textureRef;
    }
}
