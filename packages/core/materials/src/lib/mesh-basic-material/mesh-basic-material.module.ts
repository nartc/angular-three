import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MeshBasicMaterialDirective } from './mesh-basic-material.directive';

@NgModule({
  declarations: [MeshBasicMaterialDirective],
  imports: [CommonModule],
  exports: [MeshBasicMaterialDirective],
})
export class ThreeMeshBasicMaterialModule {}
