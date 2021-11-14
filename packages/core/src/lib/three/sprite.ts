import {
  AfterContentInit,
  ContentChild,
  Directive,
  Input,
} from '@angular/core';
import * as THREE from 'three';
import type { AnyConstructor } from '../models';
import { NgtMaterial } from './material';
import { NgtObject3d } from './object-3d';

@Directive()
export abstract class NgtSprite<TSprite extends THREE.Sprite = THREE.Sprite>
  extends NgtObject3d<TSprite>
  implements AfterContentInit
{
  @Input() material?: THREE.SpriteMaterial;

  @ContentChild(NgtMaterial) materialDirective?: NgtMaterial;

  abstract spriteType: AnyConstructor<TSprite>;

  private _sprite!: TSprite;

  ngAfterContentInit() {
    this.init();
  }

  protected initObject() {
    if (this.material) {
      this._sprite = new this.spriteType(this.material);
      return;
    }

    if (this.materialDirective) {
      if (this.materialDirective.material instanceof THREE.SpriteMaterial) {
        this._sprite = new this.spriteType(this.materialDirective.material);
        return;
      }

      console.warn(`Sprite can only be instantiated with SpriteMaterial`);
    }
  }

  get object3d(): TSprite {
    return this._sprite;
  }
}
