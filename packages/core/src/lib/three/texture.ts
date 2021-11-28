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
  @Output() ready = new EventEmitter();

  abstract textureType: AnyConstructor<TTexture>;

  constructor(protected ngZone: NgZone) {}

  #textureArgs: unknown[] = [];

  protected set textureArgs(v: unknown | unknown[]) {
    this.#textureArgs = Array.isArray(v) ? v : [v];
    this.ngZone.runOutsideAngular(() => {
      this.#texture = new this.textureType(...this.#textureArgs);
    });
  }

  #texture?: TTexture;

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      if (!this.texture) {
        this.#texture = new this.textureType(...this.#textureArgs);
        this.ready.emit();
      }
    });
  }

  get texture(): TTexture | undefined {
    return this.#texture;
  }

  ngOnDestroy() {
    this.ngZone.runOutsideAngular(() => {
      if (this.texture) {
        this.texture.dispose();
      }
    });
  }
}
