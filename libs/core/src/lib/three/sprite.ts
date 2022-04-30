import { Directive, Input } from '@angular/core';
import * as THREE from 'three';
import type { NgtObjectInputsState } from '../abstracts/object';
import { NgtObject } from '../abstracts/object';
import type { AnyConstructor } from '../types';

export interface NgtCommonSpriteState<
    TSprite extends THREE.Sprite = THREE.Sprite
> extends NgtObjectInputsState<TSprite> {
    material?: THREE.SpriteMaterial;
}

@Directive()
export abstract class NgtCommonSprite<
    TSprite extends THREE.Sprite = THREE.Sprite
> extends NgtObject<TSprite, NgtCommonSpriteState<TSprite>> {
    @Input() set args(v: ConstructorParameters<AnyConstructor<TSprite>>) {
        this.instanceArgs = v;
    }

    @Input() set material(material: THREE.SpriteMaterial) {
        this.set({ material });
    }

    abstract get spriteType(): AnyConstructor<TSprite>;

    protected override objectInitFn(): TSprite {
        const { material } = this.get();
        return new this.spriteType(material);
    }

    protected override get optionFields(): Record<string, boolean> {
        return { ...super.optionFields, material: true };
    }
}
