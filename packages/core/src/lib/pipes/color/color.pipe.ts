import { Pipe, PipeTransform } from '@angular/core';
import * as THREE from 'three';

@Pipe({
  name: 'color',
  pure: true,
})
export class ColorPipe implements PipeTransform {
  /**
   * ConstructorParameters<typeof THREE.Color> has a limitation on THREE.Color constructor overloads
   */
  transform(
    args: Array<THREE.Color | string | number> | [number, number, number]
  ): THREE.Color {
    return new THREE.Color(...args);
  }
}
