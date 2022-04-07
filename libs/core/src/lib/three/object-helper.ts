import { Directive, Inject, NgZone, Optional } from '@angular/core';
import * as THREE from 'three';
import { NgtInstance, NgtInstanceState } from '../abstracts/instance';
import { NGT_OBJECT_FACTORY } from '../di/object';
import { tapEffect } from '../stores/component-store';
import { NgtStore } from '../stores/store';
import { AnyConstructor, AnyFunction } from '../types';
import { prepare } from '../utils/instance';

export interface NgtCommonObjectHelperState<
    TObjectHelper extends THREE.Object3D
> extends NgtInstanceState<TObjectHelper> {
    objectHelper: TObjectHelper;
    objectHelperArgs: unknown[];
}

@Directive()
export abstract class NgtCommonObjectHelper<
    TObjectHelper extends THREE.Object3D
> extends NgtInstance<
    TObjectHelper,
    NgtCommonObjectHelperState<TObjectHelper>
> {
    abstract get objectHelperType(): AnyConstructor<TObjectHelper>;

    protected set objectHelperArgs(v: unknown | unknown[]) {
        this.set({ objectHelperArgs: Array.isArray(v) ? v : [v] });
    }

    constructor(
        zone: NgZone,
        @Optional()
        @Inject(NGT_OBJECT_FACTORY)
        protected parentObjectFactory: AnyFunction,
        protected store: NgtStore
    ) {
        super({
            zone,
            shouldAttach: false,
            parentInstanceFactory: parentObjectFactory,
        });
        this.set({ objectHelperArgs: [] });
    }

    get objectHelper(): TObjectHelper {
        return this.get((s) => s.objectHelper);
    }

    override ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.onCanvasReady(this.store.ready$, () => {
                this.init(this.select((s) => s.objectHelperArgs));
            });
        });
        super.ngOnInit();
    }

    protected override destroy() {
        if (this.objectHelper) {
            this.objectHelper.clear();
        }
        super.destroy();
    }

    private readonly init = this.effect<
        NgtCommonObjectHelperState<TObjectHelper>['objectHelperArgs']
    >(
        tapEffect((objectHelperArgs) => {
            const parentObject = this.parentObjectFactory?.();
            if (!parentObject) {
                console.info('Parent is not an object3d');
                return;
            }

            const objectHelper = prepare(
                new this.objectHelperType(parentObject, ...objectHelperArgs),
                () => this.store.get(),
                parentObject
            );
            this.set({ objectHelper, instance: objectHelper });
            this.emitReady();

            const scene = this.store.get((s) => s.scene);
            if (objectHelper && scene) {
                scene.add(objectHelper);
                const animationUuid = this.store.register({
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
                        this.store.unregister(animationUuid);
                    }
                };
            }
            return;
        })
    );
}
