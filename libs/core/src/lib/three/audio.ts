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
import type { AnyConstructor } from '../types';

@Directive()
export abstract class NgtCommonAudio<
    TAudioNode extends AudioNode = GainNode,
    TAudio extends THREE.Audio<TAudioNode> = THREE.Audio<TAudioNode>
> implements OnInit
{
    @Input() listener!: THREE.AudioListener;
    @Output() ready = new EventEmitter<TAudio>();

    private _audioArgs: unknown[] = [];
    protected set audioArgs(v: unknown | unknown[]) {
        this._audioArgs = Array.isArray(v) ? v : [v];
        this.objectController.init();
    }

    constructor(
        @Inject(NGT_OBJECT_WATCHED_CONTROLLER)
        protected objectController: NgtObjectController
    ) {
        objectController.initFn = () => {
            if (!this.listener) {
                throw new Error(
                    'Cannot initialize Audio without an AudioListener'
                );
            }

            return (this._audio = new this.audioType(
                this.listener,
                ...this._audioArgs
            ));
        };
        objectController.readyFn = () => {
            this.ready.emit(this.audio);
        };
    }

    abstract audioType: AnyConstructor<TAudio>;

    _audio!: TAudio;

    ngOnInit() {
        if (!this._audio) {
            this.objectController.init();
        }
    }

    get audio() {
        return this._audio;
    }
}
