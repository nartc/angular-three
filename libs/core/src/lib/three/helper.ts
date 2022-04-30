import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { NgtObject } from '../abstracts/object';
import type { AnyConstructor } from '../types';

@Directive()
export abstract class NgtCommonHelper<
    THelper extends THREE.Object3D = THREE.Object3D
> extends NgtObject<THelper> {
    abstract get helperType(): AnyConstructor<THelper>;

    @Input() set args(v: ConstructorParameters<AnyConstructor<THelper>>) {
        this.instanceArgs = v;
    }

    protected override objectInitFn(): THelper {
        const instanceArgs = this.get((s) => s.instanceArgs);
        return new this.helperType(...instanceArgs);
    }
}
