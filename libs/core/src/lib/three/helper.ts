import { Directive } from '@angular/core';
import * as THREE from 'three';
import { NgtObject, NgtObjectState } from '../abstracts/object';
import type { AnyConstructor } from '../types';

export interface NgtCommonHelperState<
    THelper extends THREE.Object3D = THREE.Object3D
> extends NgtObjectState<THelper> {
    helperArgs: unknown[];
}

@Directive()
export abstract class NgtCommonHelper<
    THelper extends THREE.Object3D = THREE.Object3D
> extends NgtObject<THelper, NgtCommonHelperState<THelper>> {
    abstract get helperType(): AnyConstructor<THelper>;

    protected set helperArgs(v: unknown | unknown[]) {
        this.set({ helperArgs: Array.isArray(v) ? v : [v] });
    }

    protected override objectInitFn(): THelper {
        const helperArgs = this.get((s) => s.helperArgs);
        return new this.helperType(...helperArgs);
    }

    override ngOnInit() {
        this.set({ helperArgs: [] });
        this.init();
        super.ngOnInit();
    }
}
