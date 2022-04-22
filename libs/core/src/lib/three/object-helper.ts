import { Directive, Inject, NgZone, Optional } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance, NgtInstanceState } from '../abstracts/instance';
import { Ref } from '../ref';
import { tapEffect } from '../stores/component-store';
import { NgtStore } from '../stores/store';
import { NGT_OBJECT_HOST_REF, NGT_OBJECT_REF } from '../tokens';
import { AnyConstructor, AnyFunction } from '../types';

@Directive()
export abstract class NgtCommonObjectHelper<
    TObjectHelper extends THREE.Object3D
> extends NgtInstance<TObjectHelper, NgtInstanceState<TObjectHelper>> {
    abstract get objectHelperType(): AnyConstructor<TObjectHelper>;

    constructor(
        zone: NgZone,
        store: NgtStore,
        @Optional()
        @Inject(NGT_OBJECT_REF)
        parentRef: AnyFunction<Ref<THREE.Object3D>>,
        @Optional()
        @Inject(NGT_OBJECT_HOST_REF)
        parentHostRef: AnyFunction<Ref<THREE.Object3D>>
    ) {
        super(zone, store, parentRef, parentHostRef);
    }

    override ngOnInit() {
        super.ngOnInit();
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(this.store.ready$, () => {
                this.init(this.instanceArgs$);
                this.postInit();
            });
        });
    }

    private readonly init = this.effect<unknown[]>(
        tapEffect((instanceArgs) => {
            if (!this.parent || !this.parent.value) {
                console.info('Parent is not an object3d');
                return;
            }

            const objectHelper = this.prepareInstance(
                new this.objectHelperType(this.parent.value, ...instanceArgs)
            );

            const scene = this.store.get((s) => s.scene);
            if (objectHelper && scene) {
                scene.add(objectHelper);
                const unregister = this.store.registerBeforeRender({
                    callback: () => {
                        if (objectHelper) {
                            (
                                objectHelper as unknown as TObjectHelper & {
                                    update: () => void;
                                }
                            ).update();
                        }
                    },
                    obj: this.instance,
                });
                return () => {
                    if (objectHelper && scene) {
                        scene.remove(objectHelper);
                        unregister();
                    }
                };
            }
            return;
        })
    );
}
