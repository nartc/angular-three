import { Directive, Inject, NgZone, Optional, SkipSelf } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance, NgtInstanceState } from '../abstracts/instance';
import { NGT_INSTANCE_FACTORY } from '../di/instance';
import { tapEffect } from '../stores/component-store';
import { NgtStore } from '../stores/store';
import { AnyConstructor, AnyFunction, NgtUnknownInstance } from '../types';
import { prepare } from '../utils/instance';

export interface NgtCommonAttributeState<
    TAttribute extends
        | THREE.BufferAttribute
        | THREE.InterleavedBufferAttribute = THREE.BufferAttribute
> extends NgtInstanceState<TAttribute> {
    attribute: TAttribute;
    attributeArgs: unknown[];
}

@Directive()
export abstract class NgtCommonAttribute<
    TAttribute extends
        | THREE.BufferAttribute
        | THREE.InterleavedBufferAttribute = THREE.BufferAttribute
> extends NgtInstance<TAttribute, NgtCommonAttributeState<TAttribute>> {
    abstract get attributeType(): AnyConstructor<TAttribute>;

    protected set attributeArgs(v: unknown | unknown[]) {
        this.set({ attributeArgs: Array.isArray(v) ? v : [v] });
    }

    constructor(
        zone: NgZone,
        @Optional()
        @SkipSelf()
        @Inject(NGT_INSTANCE_FACTORY)
        parentInstanceFactory: AnyFunction,
        protected store: NgtStore
    ) {
        super({ zone, shouldAttach: true, parentInstanceFactory });
        this.set({ attributeArgs: [] });
    }

    get attribute(): TAttribute {
        return this.get((s) => s.attribute);
    }

    override ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(this.store.ready$, () => {
                this.init(this.select((s) => s.attributeArgs));
            });
        });
        super.ngOnInit();
    }

    private readonly init = this.effect<
        NgtCommonAttributeState<TAttribute>['attributeArgs']
    >(
        tapEffect((attributeArgs) => {
            const attribute = prepare(
                new this.attributeType(...attributeArgs),
                () => this.store.get(),
                this.parentInstanceFactory?.() as NgtUnknownInstance
            );
            this.set({ attribute, instance: attribute });
            this.emitReady();
        })
    );
}
