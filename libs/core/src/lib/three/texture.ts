import {
  Directive,
  EventEmitter,
  NgZone,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Subscription, tap } from 'rxjs';
import * as THREE from 'three';
import { NgtCanvasStore } from '../stores/canvas';
import { NgtStore } from '../stores/store';
import type { AnyConstructor } from '../types';

@Directive()
export abstract class NgtTexture<TTexture extends THREE.Texture = THREE.Texture>
  extends NgtStore<{ texture: TTexture }>
  implements OnInit, OnDestroy
{
  @Output() ready = new EventEmitter<TTexture>();

  abstract textureType: AnyConstructor<TTexture>;

  private _textureArgs: unknown[] = [];

  private initSubscription?: Subscription;

  protected set textureArgs(v: unknown | unknown[]) {
    this._textureArgs = Array.isArray(v) ? v : [v];
    this.zone.runOutsideAngular(() => {
      if (this.initSubscription) {
        this.initSubscription.unsubscribe();
      }

      this.initSubscription = this.effect<boolean>(
        tap(() => {
          this._texture = new this.textureType(...this._textureArgs);
          this.set({ texture: this.texture });
        })
      )(this.canvasStore.ready$);
    });
  }

  private _texture?: TTexture;

  constructor(protected zone: NgZone, protected canvasStore: NgtCanvasStore) {
    super();
  }

  ngOnInit() {
    this.zone.runOutsideAngular(() => {
      this.effect<TTexture>(
        tap((texture) => {
          this.ready.emit(texture);
        })
      )(this.select((s) => s.texture));
    });
  }

  get texture(): TTexture | undefined {
    return this._texture;
  }

  override ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.texture) {
        this.texture.dispose();
      }
    });
    super.ngOnDestroy();
  }
}
