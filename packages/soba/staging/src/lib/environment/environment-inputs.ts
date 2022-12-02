import { NgtComponentStore, NgtObservableInput, NgtRef, NgtStore } from '@angular-three/core';
import { Directive, inject, Input, NgZone } from '@angular/core';
import { map } from 'rxjs';
import * as THREE from 'three';
import type { PresetsType } from './presets';

@Directive()
export abstract class SobaEnvironmentInputs extends NgtComponentStore {
    @Input() set frames(frames: NgtObservableInput<number>) {
        this.write({ frames });
    }

    @Input() set near(near: NgtObservableInput<number>) {
        this.write({ near });
    }

    @Input() set far(far: NgtObservableInput<number>) {
        this.write({ far });
    }

    @Input() set resolution(resolution: NgtObservableInput<number>) {
        this.write({ resolution });
    }

    @Input() set background(background: NgtObservableInput<boolean | 'only'>) {
        this.write({ background });
    }

    @Input() set map(map: NgtObservableInput<THREE.Texture>) {
        this.write({ map });
    }

    @Input() set files(files: NgtObservableInput<string | string[]>) {
        this.write({ files });
    }

    @Input() set path(path: NgtObservableInput<string>) {
        this.write({ path });
    }

    @Input() set preset(preset: NgtObservableInput<PresetsType>) {
        this.write({ preset });
    }

    @Input() set scene(scene: THREE.Scene | NgtRef<THREE.Scene>) {
        this.write({ scene });
    }

    @Input() set extensions(extensions: (loader: THREE.Loader) => void) {
        this.write({ extensions, extensionsExplicit: true });
    }

    @Input() set ground(
        ground: NgtObservableInput<
            | boolean
            | {
                  radius?: number;
                  height?: number;
                  scale?: number;
              }
        >
    ) {
        this.write({ ground });
    }

    @Input() set blur(blur: NgtObservableInput<number>) {
        this.write({ blur, blurExplicit: true });
    }

    @Input() set encoding(encoding: NgtObservableInput<THREE.TextureEncoding>) {
        this.write({ encoding });
    }

    protected readonly zone = inject(NgZone);
    protected readonly store = inject(NgtStore);

    override initialize() {
        super.initialize();
        this.write({ background: false });
    }

    getEnvironmentResolverParams$(defaultParams: SobaEnvironmentResolverParams) {
        return this.select({
            files: this.select((s) => s['files']).pipe(map((files) => files || defaultParams.files)),
            path: this.select((s) => s['path']).pipe(map((path) => path || defaultParams.path)),
            preset: this.select((s) => s['preset']),
            encoding: this.select((s) => s['encoding']),
            extensions: this.select((s) => s['extensions']),
        });
    }
}

export type SobaEnvironmentResolverParams = Partial<
    Pick<SobaEnvironmentInputs, 'files' | 'path' | 'preset' | 'extensions' | 'encoding'>
>;
