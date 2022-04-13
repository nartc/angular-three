import { Directive, Inject, NgZone, Optional, SkipSelf } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance, NgtInstanceState } from '../abstracts/instance';
import { tapEffect } from '../stores/component-store';
import { NgtStore } from '../stores/store';
import { NGT_INSTANCE_FACTORY } from '../tokens';
import type { AnyConstructor, AnyFunction } from '../types';

@Directive()
export abstract class NgtCommonAttribute<
    TAttribute extends
        | THREE.BufferAttribute
        | THREE.InterleavedBufferAttribute = THREE.BufferAttribute
> extends NgtInstance<TAttribute, NgtInstanceState<TAttribute>> {
    abstract get attributeType(): AnyConstructor<TAttribute>;

    constructor(
        zone: NgZone,
        store: NgtStore,
        @Optional()
        @SkipSelf()
        @Inject(NGT_INSTANCE_FACTORY)
        parentInstanceFactory: AnyFunction
    ) {
        super({ zone, store, parentInstanceFactory });
    }

    override ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(
                this.store.ready$,
                () => {
                    const initSub = this.init(this.instanceArgs$);
                    return () => {
                        if (initSub && initSub.unsubscribe) {
                            initSub.unsubscribe();
                        }
                    };
                },
                true
            );
        });
        super.ngOnInit();
    }

    private readonly init = this.effect<unknown[]>(
        tapEffect((instanceArgs) => {
            this.prepareInstance(new this.attributeType(...instanceArgs));
        })
    );
}
