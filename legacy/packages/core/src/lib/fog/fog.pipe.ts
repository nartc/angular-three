import { Pipe, PipeTransform } from '@angular/core';
import * as THREE from 'three';

@Pipe({
  name: 'fog',
  pure: true,
})
export class NgtFogPipe implements PipeTransform {
  transform(args: ConstructorParameters<typeof THREE.Fog>): THREE.Fog {
    return new THREE.Fog(...args);
  }
}
