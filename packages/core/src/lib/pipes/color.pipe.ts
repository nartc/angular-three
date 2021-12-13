import { NgModule, Pipe, PipeTransform } from '@angular/core';
import * as THREE from 'three';
import { NgtColor } from '../types';
import { makeColor } from '../utils/make';

@Pipe({
  name: 'color',
})
export class NgtColorPipe implements PipeTransform {
  /**
   * ConstructorParameters<typeof THREE.Color> has a limitation on THREE.Color constructor overloads
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
