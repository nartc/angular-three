import { AnyConstructor, ThreeObject3d } from '@angular-three/core';
import { ThreeMaterial } from '@angular-three/core/materials';
import {
  AfterContentInit,
  ContentChild,
  Directive,
  Input,
} from '@angular/core';
import { Sprite, SpriteMaterial } from 'three';

@Directive()
export abstract class ThreeSprite<TSprite extends Sprite = Sprite>
  extends ThreeObject3d<TSprite>
  implements AfterContentInit {
  @Input() material?: SpriteMaterial;

  @ContentChild(ThreeMaterial) materialDirective?: ThreeMaterial;

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
      if (this.materialDirective.material instanceof SpriteMaterial) {
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
