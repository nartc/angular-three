import { NgModule, Pipe, PipeTransform } from '@angular/core';
import * as THREE from 'three/src/Three';
import type { NgtColor } from '../types';
import { makeColor } from '../utils/make';

/**
 * @deprecated Use {@link NgtColorAttribute} instead
 */
@Pipe({ name: 'color' })
export class NgtColorPipe implements PipeTransform {
  /**
   * ConstructorParameters<typeof THREE.Color> has a limitation on THREE.Color constructor overloads
   * @deprecated
   */
  transform(args: NgtColor): THREE.Color {
    return makeColor(args) as THREE.Color;
  }
}

@NgModule({
  declarations: [NgtColorPipe],
  exports: [NgtColorPipe],
})
export class NgtColorPipeModule {}
