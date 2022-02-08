import {
  Directive,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import * as THREE from 'three';
import type { AnyConstructor } from '../types';
import { zonelessRequestAnimationFrame } from '../utils/zoneless-timer';

@Directive()
export abstract class NgtTexture<TTexture extends THREE.Texture = THREE.Texture>
  implements OnInit, OnDestroy
{
  @Output() ready = new EventEmitter<TTexture>();

  abstract textureType: AnyConstructor<TTexture>;

  private _textureArgs: unknown[] = [];

  protected set textureArgs(v: unknown | unknown[]) {
    this._textureArgs = Array.isArray(v) ? v : [v];
    zonelessRequestAnimationFrame(() => {
      this._texture = new this.textureType(...this._textureArgs);
    });
  }

  private _texture?: TTexture;

  ngOnInit() {
    zonelessRequestAnimationFrame(() => {
      if (!this.texture) {
        this.ready.emit(
          (this._texture = new this.textureType(...this._textureArgs))
        );
      }
    });
  }

  get texture(): TTexture | undefined {
    return this._texture;
  }

  ngOnDestroy() {
    zonelessRequestAnimationFrame(() => {
      if (this.texture) {
        this.texture.dispose();
      }
    });
  }
}
