// GENERATED
import {
    ContentChild,
    Directive,
    Input,
    NgModule,
    NgZone,
} from '@angular/core';
import * as THREE from 'three';
import { NgtMaterial } from '../three/material';
import { Controller, createControllerProviderFactory } from './controller';

@Directive({
    selector: `
    ngt-mesh,
    ngt-instanced-mesh,
    ngt-skinned-mesh,
    ngt-line,
    ngt-line-loop,
    ngt-line-segments,
    ngt-soba-text,,
    ngt-points
  `,
    exportAs: 'ngtWithMaterialController',
})
export class NgtWithMaterialController extends Controller {
    private _materialInput?: THREE.Material | THREE.Material[] | undefined;

    @Input() set material(v: THREE.Material | THREE.Material[] | undefined) {
        if (v) {
            if (!(Array.isArray(v) && !v.length)) {
                this._materialInput = v;
            }
            this.construct();
        }
    }

    get material() {
        return this._material;
    }

    private _material: THREE.Material | THREE.Material[] | undefined =
        undefined;

    @ContentChild(NgtMaterial, { static: true }) set contentMaterial(
        dir: NgtMaterial
    ) {
        if (dir) {
            this.zone.runOutsideAngular(() => {
                requestAnimationFrame(() => {
                    this.material = dir.material;
                });
            });
        }
    }

    constructor(private zone: NgZone) {
        super();
    }

    construct() {
        this._material = NgtWithMaterialController.getMaterial(
            this._materialInput
        );
    }

    private static getMaterial(
        input: THREE.Material | THREE.Material[] | undefined
    ): THREE.Material | THREE.Material[] | undefined {
        if (Array.isArray(input)) {
            if (!input.length) return undefined;

            if (input[0] instanceof THREE.Material) {
                return input as THREE.Material[];
            }
        }

        if (input instanceof THREE.Material) {
            return input;
        }

        return undefined;
    }
}

@NgModule({
    declarations: [NgtWithMaterialController],
    exports: [NgtWithMaterialController],
})
export class NgtWithMaterialControllerModule {}

export const [
    NGT_WITH_MATERIAL_WATCHED_CONTROLLER,
    NGT_WITH_MATERIAL_CONTROLLER_PROVIDER,
] = createControllerProviderFactory({
    controller: NgtWithMaterialController,
    watchedControllerTokenName: 'Watched WithMaterialController',
});
