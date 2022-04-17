import { Directive } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance, NgtInstanceState } from '../abstracts/instance';
import { tapEffect } from '../stores/component-store';
import type { AnyConstructor } from '../types';

@Directive()
export abstract class NgtCommonAttribute<
    TAttribute extends
        | THREE.BufferAttribute
        | THREE.InterleavedBufferAttribute = THREE.BufferAttribute
> extends NgtInstance<TAttribute, NgtInstanceState<TAttribute>> {
    abstract get attributeType(): AnyConstructor<TAttribute>;

    override ngOnInit() {
        super.ngOnInit();
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(
                this.store.ready$,
                () => {
                    const initSub = this.init(this.instanceArgs$);
                    this.postInit();
                    return () => {
                        if (initSub && initSub.unsubscribe) {
                            initSub.unsubscribe();
                        }
                    };
                },
                true
            );
        });
    }

    private readonly init = this.effect<unknown[]>(
        tapEffect((instanceArgs) => {
            this.prepareInstance(new this.attributeType(...instanceArgs));
        })
    );
}
