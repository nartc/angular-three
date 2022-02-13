import {
    Directive,
    EventEmitter,
    Inject,
    Input,
    OnInit,
    Output,
} from '@angular/core';
import * as THREE from 'three';
import {
    NGT_OBJECT_WATCHED_CONTROLLER,
    NgtObjectController,
} from '../controllers/object.controller';
import type { AnyConstructor, UnknownRecord } from '../types';
import { applyProps } from '../utils/apply-props';

@Directive()
export abstract class NgtLight<TLight extends THREE.Light = THREE.Light>
    implements OnInit
{
    @Output() ready = new EventEmitter<TLight>();

    abstract lightType: AnyConstructor<TLight>;

    @Input() intensity?: number;
    @Input() shadow?: Partial<THREE.LightShadow>;

    private initializing = false;

    constructor(
        @Inject(NGT_OBJECT_WATCHED_CONTROLLER)
        protected objectController: NgtObjectController
    ) {
        objectController.initFn = () => {
            this._light = new this.lightType(...this._lightArgs);

            if (this.intensity) {
                applyProps(this.light, { intensity: this.intensity });
            }

            if (this.shadow) {
                applyProps(this.light, this.shadow as unknown as UnknownRecord);
            }

            this.initializing = false;
            return this.light as THREE.Light;
        };

        objectController.readyFn = () => {
            this.ready.emit(this.light);
        };
    }

    private _lightArgs: unknown[] = [];
    protected set lightArgs(v: unknown | unknown[]) {
        this.initializing = true;
        this._lightArgs = Array.isArray(v) ? v : [v];
        this.objectController.init();
    }

    private _light!: TLight;

    ngOnInit() {
        if (!this._light && !this.initializing) {
            this.objectController.init();
        }
    }

    get light() {
        return this._light;
    }
}
