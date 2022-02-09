import {
  Directive,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
} from '@angular/core';
import { Subscription, tap } from 'rxjs';
import * as THREE from 'three';
import { NgtCanvasStore } from '../stores/canvas';
import { NgtStore } from '../stores/store';
import type { AnyConstructor } from '../types';
import { NgtGeometry } from './geometry';

@Directive()
export abstract class NgtAttribute<
    TAttribute extends
      | THREE.BufferAttribute
      | THREE.InterleavedBufferAttribute = THREE.BufferAttribute
  >
  extends NgtStore
  implements OnInit, OnChanges, OnDestroy
{
  @Input() attach?: THREE.BuiltinShaderAttributeName | string;

  abstract attributeType: AnyConstructor<TAttribute>;

  constructor(
    protected zone: NgZone,
    @Optional() protected geometryDirective: NgtGeometry,
    protected canvasStore: NgtCanvasStore
  ) {
    super();
  }

  private _attributeArgs: unknown[] = [];

  protected set attributeArgs(v: unknown | unknown[]) {
    this._attributeArgs = Array.isArray(v) ? v : [v];
    this.init();
  }

  private _attribute?: TAttribute;
  private _defaultValue?: TAttribute;

  private initSubscription?: Subscription;

  ngOnChanges() {
    this.zone.runOutsideAngular(() => {
      if (this.attribute) {
        this.attribute.needsUpdate = true;
      }
    });
  }

  ngOnInit() {
    if (!this.attribute) {
      this.init();
    }
  }

  private init() {
    this.zone.runOutsideAngular(() => {
      if (this.initSubscription) {
        this.initSubscription.unsubscribe();
      }

      this.initSubscription = this.effect<boolean>(
        tap(() => {
          if (this.geometryDirective && this.attach) {
            this._attribute = new this.attributeType(...this._attributeArgs);
            if (this.attribute) {
              this._defaultValue = this.geometryDirective.geometry.attributes[
                this.attach
              ] as TAttribute;
              this.geometryDirective.geometry.setAttribute(
                this.attach,
                this.attribute
              );
            }
          }
        })
      )(this.canvasStore.ready$);
    });
  }

  override ngOnDestroy() {
    this.zone.runOutsideAngular(() => {
      if (this.initSubscription) {
        this.initSubscription.unsubscribe();
      }

      if (this.geometryDirective && this.attach) {
        if (this._defaultValue !== undefined) {
          this.geometryDirective.geometry.setAttribute(
            this.attach,
            this._defaultValue
          );
        } else {
          this.geometryDirective.geometry.deleteAttribute(this.attach);
        }
      }
    });
    super.ngOnDestroy();
  }

  get attribute(): TAttribute | undefined {
    return this._attribute;
  }
}
