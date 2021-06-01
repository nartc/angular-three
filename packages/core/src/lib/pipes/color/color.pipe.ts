import { Pipe, PipeTransform } from '@angular/core';
import * as THREE from 'three';

@Pipe({
  name: 'color',
  pure: true,
})
export class ColorPipe implements PipeTransform {
  transform(args: ConstructorParameters<typeof THREE.Color>): THREE.Color {
    return new THREE.Color(...args);
  }
}
