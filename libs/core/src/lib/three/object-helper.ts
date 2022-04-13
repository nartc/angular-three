import { Directive, Inject, NgZone, Optional } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance, NgtInstanceState } from '../abstracts/instance';
import { tapEffect } from '../stores/component-store';
import { NgtStore } from '../stores/store';
import { NGT_OBJECT_FACTORY } from '../tokens';
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
        @Inject(NGT_OBJECT_FACTORY)
        parentInstanceFactory: AnyFunction
    ) {
        super({
            zone,
            store,
            parentInstanceFactory,
        });
    }

    override ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(this.store.ready$, () => {
                this.init(this.instanceArgs$);
            });
        });
        super.ngOnInit();
    }

    private readonly init = this.effect<unknown[]>(
        tapEffect((instanceArgs) => {
            const parentObject = this.parentInstanceFactory?.();
            if (!parentObject) {
                console.info('Parent is not an object3d');
                return;
            }

            const objectHelper = this.prepareInstance(
                new this.objectHelperType(parentObject, ...instanceArgs)
            );

            const scene = this.store.get((s) => s.scene);
            if (objectHelper && scene) {
                scene.add(objectHelper);
                const animationUuid = this.store.registerBeforeRender({
                    callback: () => {
                        if (objectHelper) {
                            (
                                objectHelper as unknown as TObjectHelper & {
                                    update: () => void;
                                }
                            ).update();
                        }
                    },
                    obj: objectHelper,
                });
                return () => {
                    if (objectHelper && scene) {
                        scene.remove(objectHelper);
                        this.store.unregisterBeforeRender(animationUuid);
                    }
                };
            }
            return;
        })
    );
}
