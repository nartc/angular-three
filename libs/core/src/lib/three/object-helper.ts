import { Directive, Inject, NgZone, OnInit } from '@angular/core';
import * as THREE from 'three';
import { NGT_PARENT_OBJECT } from '../di/parent-object';
import { NgtAnimationFrameStore } from '../stores/animation-frame';
import { NgtCanvasStore } from '../stores/canvas';
import { NgtStore, tapEffect } from '../stores/store';
import type { AnyConstructor, AnyFunction } from '../types';

@Directive()
export abstract class NgtObjectHelper<TObjectHelper extends THREE.Object3D>
    extends NgtStore<{ args: unknown[] }>
    implements OnInit
{
    abstract objectHelperType: AnyConstructor<TObjectHelper>;

    protected set objectHelperArgs(v: unknown | unknown[]) {
        this.set({ args: Array.isArray(v) ? v : [v] });
    }

    private _object?: THREE.Object3D;

    constructor(
        @Inject(NGT_PARENT_OBJECT)
        protected objectFn: AnyFunction,
        protected canvasStore: NgtCanvasStore,
        protected animationFrameStore: NgtAnimationFrameStore,
        protected zone: NgZone
    ) {
        super();
    }

    ngOnInit() {
        this.zone.runOutsideAngular(() => {
            this.effect<unknown[]>(
                tapEffect((args) => {
                    this._object = this.objectFn();

                    if (!this._object) {
                        console.info('Parent is not an object3d');
                        return;
                    }

                    this._objectHelper = new this.objectHelperType(
                        this._object,
                        ...args
                    );

                    const scene = this.canvasStore.get((s) => s.scene);
                    if (this.objectHelper && scene) {
                        scene.add(this.objectHelper);
                        const animationUuid = this.animationFrameStore.register(
                            {
                                callback: () => {
                                    if (this.objectHelper) {
                                        (
                                            this
                                                .objectHelper as TObjectHelper & {
                                                update: () => void;
                                            }
                                        ).update();
                                    }
                                },
                            }
                        );
                        return () => {
                            if (this.objectHelper && scene) {
                                scene.remove(this.objectHelper);
                                this.animationFrameStore.unregister(
                                    animationUuid
                                );
                            }
                        };
                    }

                    return;
                })
            )(
                this.select(
                    this.select((s) => s.args),
                    this.canvasStore.ready$,
                    (args) => args
                )
            );
        });
    }

    private _objectHelper?: TObjectHelper;
    get objectHelper() {
        return this._objectHelper;
    }
}
