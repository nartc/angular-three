import { Directive } from '@angular/core';
import * as THREE from 'three';
import { NgtObject } from '../abstracts/object';
import type { AnyConstructor } from '../types';

@Directive()
export abstract class NgtCommonCamera<
    TCamera extends THREE.Camera = THREE.Camera
> extends NgtObject<TCamera> {
    abstract get cameraType(): AnyConstructor<TCamera>;

    protected override objectInitFn(): TCamera {
        return new this.cameraType();
    }

    override ngOnInit() {
        this.init();
        super.ngOnInit();
    }
}
