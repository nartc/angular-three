import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MeshPhongMaterialDirective } from './mesh-phong-material.directive';

@NgModule({
  declarations: [MeshPhongMaterialDirective],
  imports: [CommonModule],
  exports: [MeshPhongMaterialDirective],
})
export class ThreeMeshPhongMaterialModule {}
