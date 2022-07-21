import { NgModule, Pipe, PipeTransform } from '@angular/core';
import * as THREE from 'three/src/Three';

/**
 * @deprecated Use {@link NgtFogAttribute} instead
 */
@Pipe({
  name: 'fog',
})
export class NgtFogPipe implements PipeTransform {
  /**
   * @deprecated
   * @param value
   */
  transform(value: ConstructorParameters<typeof THREE.Fog>): THREE.Fog {
    return new THREE.Fog(...value);
  }
}

/**
 * @deprecated Use {@link NgtFogExp2Attribute} instead
 */
@Pipe({
  name: 'fogExp2',
})
export class NgtFogExp2Pipe implements PipeTransform {
  /**
   * @deprecated
   * @param value
   */
  transform(value: ConstructorParameters<typeof THREE.FogExp2>): THREE.FogExp2 {
    return new THREE.FogExp2(...value);
  }
}

@NgModule({
  declarations: [NgtFogPipe, NgtFogExp2Pipe],
  exports: [NgtFogPipe, NgtFogExp2Pipe],
})
export class NgtFogPipeModule {}
