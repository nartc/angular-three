import { coerceBoolean, NgtBooleanInput, NgtRef } from '@angular-three/core';
import { NgtGroup } from '@angular-three/core/objects';
import { Directive, inject, Input, TemplateRef } from '@angular/core';
import * as THREE from 'three';

@Directive({
  selector: 'ng-template[ngt-soba-orthographic-camera-content]',
  standalone: true,
})
export class NgtSobaCameraContent {
  readonly templateRef = inject(TemplateRef);

  @Input() set useFBO(value: NgtBooleanInput) {
    this._useFBO = coerceBoolean(value);
  }

  get useFBO() {
    return this._useFBO;
  }

  private _useFBO = false;

  static ngTemplateContextGuard(
    dir: NgtSobaCameraContent,
    ctx: unknown
  ): ctx is { $implicit: NgtRef<THREE.WebGLRenderTarget>; group?: NgtGroup } {
    return true;
  }
}