import { Pipe, PipeTransform } from '@angular/core';
import * as THREE from 'three';

@Pipe({
  name: 'vector2',
  pure: true,
})
export class Vector2Pipe implements PipeTransform {
  transform(value: ConstructorParameters<typeof THREE.Vector2>): THREE.Vector2 {
    return new THREE.Vector2(...value);
  }
}
