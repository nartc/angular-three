import { Directive, NgZone, OnDestroy, OnInit } from '@angular/core';
import { Texture } from 'three';
import type { AnyConstructor } from '../typings';

@Directive()
export abstract class ThreeTexture<TTexture extends Texture = Texture>
  implements OnInit, OnDestroy
{
  abstract textureType: AnyConstructor<TTexture>;

  constructor(private readonly ngZone: NgZone) {}

  private _extraArgs: unknown[] = [];

  protected set extraArgs(v: unknown[]) {
    this._extraArgs = v;
    this.ngZone.runOutsideAngular(() => {
      this._texture = new this.textureType(...this._extraArgs);
    });
  }

  private _texture?: TTexture;

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      if (!this.texture) {
        this._texture = new this.textureType(...this._extraArgs);
      }
    });
  }

  get texture(): TTexture | undefined {
    return this._texture;
  }

  ngOnDestroy() {
    this.ngZone.runOutsideAngular(() => {
      if (this.texture) {
        this.texture.dispose();
      }
    });
  }
}
