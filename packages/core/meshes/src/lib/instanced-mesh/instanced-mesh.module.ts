import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { InstancedMeshDirective } from './instanced-mesh.directive';

@NgModule({
  declarations: [InstancedMeshDirective],
  imports: [CommonModule],
  exports: [InstancedMeshDirective],
})
export class ThreeInstancedMeshModule {}
