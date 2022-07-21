import { NgModule, Pipe, PipeTransform } from '@angular/core';
import * as THREE from 'three/src/Three';

@Pipe({ name: 'side', standalone: true })
export class NgtSidePipe implements PipeTransform {
  transform(side: 'front' | 'back' | 'double'): THREE.Side {
    switch (side) {
      case 'front':
        return THREE.FrontSide;
      case 'back':
        return THREE.BackSide;
      case 'double':
        return THREE.DoubleSide;
    }
  }
}

@NgModule({
  imports: [NgtSidePipe],
  exports: [NgtSidePipe],
})
export class NgtSidePipeModule {}
