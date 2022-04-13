import {
    Directive,
    EventEmitter,
    Inject,
    NgZone,
    Optional,
    Output,
    SkipSelf,
} from '@angular/core';
import * as THREE from 'three';
import { NgtStore } from '../stores/store';
import { NGT_OBJECT_FACTORY } from '../tokens';
import { AnyFunction, NgtRenderState } from '../types';
import { NgtObjectInputs } from './object';

@Directive()
export abstract class NgtWrapper<
    TObject extends THREE.Object3D = THREE.Object3D
> extends NgtObjectInputs<TObject> {
    @Output() beforeRender = new EventEmitter<{
        state: NgtRenderState;
        object: TObject;
    }>();

    private _wrapped!: TObject;

    set wrapped(object: TObject) {
        this._wrapped = object;
        this.ready.emit(this.wrapped);
    }

    get wrapped() {
        return this._wrapped;
    }

    get wrappedFactory() {
        return () => this.wrapped;
    }

    constructor(
        zone: NgZone,
        store: NgtStore,
        @Optional()
        @SkipSelf()
        @Inject(NGT_OBJECT_FACTORY)
        parentInstanceFactory: AnyFunction
    ) {
        super({ zone, store, parentInstanceFactory });
    }
}
