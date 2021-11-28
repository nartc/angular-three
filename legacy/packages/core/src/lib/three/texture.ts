import {
  Directive,
  EventEmitter,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import * as THREE from 'three';
import type { AnyConstructor } from '../models';

@Directive()
export abstract class NgtTexture<TTexture extends THREE.Texture = THREE.Texture>
  implements OnInit, OnDestroy
{
  @Output() ready = new EventEmitter<TTexture>();

  abstract textureType: AnyConstructor<TTexture>;

  constructor(protected ngZone: NgZone) {}

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
        this.ready.emit(this._texture);
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
