import { ThreeObject3d } from '@angular-three/core';
import { Directive, Input, Optional } from '@angular/core';
import { Object3D } from 'three';

@Directive({
  selector: '[ngtLodLevel]',
})
export class LodLevelDirective {
  @Input('ngtLodLevel') distance?: number;

  constructor(@Optional() private readonly hostObject3d?: ThreeObject3d) {}

  get hostObject(): Object3D | undefined {
    return this.hostObject3d?.object3d;
  }
}
