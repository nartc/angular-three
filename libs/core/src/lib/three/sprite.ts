import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import { NgtObject, NgtObjectState } from '../abstracts/object';
import type { AnyConstructor } from '../types';

export interface NgtCommonSpriteState<
    TSprite extends THREE.Sprite = THREE.Sprite
> extends NgtObjectState<TSprite> {
    material?: THREE.SpriteMaterial;
}

@Directive()
export abstract class NgtCommonSprite<
    TSprite extends THREE.Sprite = THREE.Sprite
> extends NgtObject<TSprite, NgtCommonSpriteState<TSprite>> {
    @Input() set material(material: THREE.SpriteMaterial) {
        this.set({ material });
    }

    abstract get spriteType(): AnyConstructor<TSprite>;

    protected override objectInitFn(): TSprite {
        const { material } = this.get();
        return new this.spriteType(material);
    }

    override ngOnInit() {
        this.init();
        super.ngOnInit();
    }

    protected override get subInputs(): Record<string, boolean> {
        return { material: true };
    }
}
