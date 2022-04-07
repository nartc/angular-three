import { Directive } from '@angular/core';
import * as THREE from 'three';
import { NgtObject } from '../abstracts/object';
import type { AnyConstructor } from '../types';

@Directive()
export abstract class NgtCommonHelper<
    THelper extends THREE.Object3D = THREE.Object3D
> extends NgtObject<THelper> {
    abstract get helperType(): AnyConstructor<THelper>;

    protected override objectInitFn(): THelper {
        return new this.helperType();
    }

    override ngOnInit() {
        this.init();
        super.ngOnInit();
    }
}
