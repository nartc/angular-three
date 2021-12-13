import {
  Directive,
  Input,
  NgZone,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
} from '@angular/core';
import * as THREE from 'three';
import type { AnyConstructor } from '../types';
import { NgtGeometry } from './geometry';

@Directive()
export abstract class NgtAttribute<
  TAttribute extends
    | THREE.BufferAttribute
    | THREE.InterleavedBufferAttribute = THREE.BufferAttribute
> implements OnInit, OnChanges, OnDestroy
{
  @Input() attach?: THREE.BuiltinShaderAttributeName | string;

  abstract attributeType: AnyConstructor<TAttribute>;

  constructor(
    protected ngZone: NgZone,
    @Optional() protected geometryDirective: NgtGeometry
  ) {}

  #attributeArgs: unknown[] = [];

  protected set attributeArgs(v: unknown | unknown[]) {
    this.#attributeArgs = Array.isArray(v) ? v : [v];
    this.ngZone.runOutsideAngular(() => {
      this.init();
    });
  }

  #attribute?: TAttribute;
  #defaultValue?: TAttribute;

  ngOnChanges() {
    this.ngZone.runOutsideAngular(() => {
      if (this.attribute) {
        this.attribute.needsUpdate = true;
      }
    });
  }

  ngOnInit() {
    this.ngZone.runOutsideAngular(() => {
      if (!this.attribute) {
        this.init();
      }
    });
  }

  private init() {
    if (this.geometryDirective && this.attach) {
      this.#attribute = new this.attributeType(...this.#attributeArgs);
      if (this.attribute) {
        this.#defaultValue = this.geometryDirective.geometry.attributes[
          this.attach
        ] as TAttribute;
        this.geometryDirective.geometry.setAttribute(
          this.attach,
          this.attribute
        );
      }
    }
  }

  ngOnDestroy() {
    this.ngZone.runOutsideAngular(() => {
      if (this.geometryDirective && this.attach) {
        if (this.#defaultValue !== undefined) {
          this.geometryDirective.geometry.setAttribute(
            this.attach,
            this.#defaultValue
          );
        } else {
          this.geometryDirective.geometry.deleteAttribute(this.attach);
        }
      }
    });
  }

  get attribute(): TAttribute | undefined {
    return this.#attribute;
  }
}
