import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { NgtObject, NgtObjectState } from '../abstracts/object';
import type { AnyConstructor } from '../types';

export interface NgtCommonLightState<TLight extends THREE.Light = THREE.Light>
    extends NgtObjectState<TLight> {
    lightArgs: unknown[];
    intensity: number;
}

@Directive()
export abstract class NgtCommonLight<
    TLight extends THREE.Light = THREE.Light
> extends NgtObject<TLight, NgtCommonLightState<TLight>> {
    abstract get lightType(): AnyConstructor<TLight>;

    @Input() set intensity(intensity: number) {
        this.set({ intensity });
    }

    protected set lightArgs(v: unknown | unknown[]) {
        this.set({ lightArgs: Array.isArray(v) ? v : [v] });
    }

    protected override objectInitFn(): TLight {
        const { intensity, lightArgs } = this.get();

        const light = new this.lightType(...lightArgs);

        if (intensity != undefined) {
            light.intensity = intensity;
        }

        return light;
    }

    override ngOnInit() {
        this.set({ intensity: 1, lightArgs: [] });
        this.init();
        super.ngOnInit();
    }

    protected override get subInputs(): Record<string, boolean> {
        return { intensity: false };
    }
}
