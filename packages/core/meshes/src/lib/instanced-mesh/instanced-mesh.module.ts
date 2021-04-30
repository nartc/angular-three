import { NgModule } from '@angular/core';
import { InstancedMeshDirective } from './instanced-mesh.directive';

@NgModule({
  declarations: [InstancedMeshDirective],
  exports: [InstancedMeshDirective],
})
export class ThreeInstancedMeshModule {}
