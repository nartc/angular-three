import {
    ContentChild,
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
import { NgtMaterial } from './material';

@Directive()
export abstract class NgtCommonSprite<
    TSprite extends THREE.Sprite = THREE.Sprite
> implements OnInit
{
    @Input() material?: THREE.SpriteMaterial;
    @Output() ready = new EventEmitter<TSprite>();

    @ContentChild(NgtMaterial) ngtMaterial?: NgtMaterial;

    abstract spriteType: AnyConstructor<TSprite>;

    private _sprite!: TSprite;

    constructor(
        @Inject(NGT_OBJECT_WATCHED_CONTROLLER)
        protected objectController: NgtObjectController
    ) {
        objectController.initFn = () => {
            if (this.material) {
                this._sprite = new this.spriteType(this.material);
            } else if (this.ngtMaterial) {
                if (this.ngtMaterial.material instanceof THREE.SpriteMaterial) {
                    this._sprite = new this.spriteType(
                        this.ngtMaterial.material
                    );
                }
            }

            return this._sprite;
        };

        objectController.readyFn = () => {
            this.ready.emit(this.sprite);
        };
    }

    ngOnInit() {
        this.objectController.init();
    }

    get sprite() {
        return this._sprite;
    }
}
