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

@Pipe({
  name: 'vector3',
  pure: true,
})
export class Vector3Pipe implements PipeTransform {
  transform(value: ConstructorParameters<typeof THREE.Vector3>): THREE.Vector3 {
    return new THREE.Vector3(...value);
  }
}

@Pipe({
  name: 'vector4',
  pure: true,
})
export class Vector4Pipe implements PipeTransform {
  transform(value: ConstructorParameters<typeof THREE.Vector4>): THREE.Vector4 {
    return new THREE.Vector4(...value);
  }
}
