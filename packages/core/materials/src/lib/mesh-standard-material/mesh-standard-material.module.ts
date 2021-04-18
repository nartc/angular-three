import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MeshStandardMaterialDirective } from './mesh-standard-material.directive';

@NgModule({
  declarations: [MeshStandardMaterialDirective],
  imports: [CommonModule],
  exports: [MeshStandardMaterialDirective],
})
export class ThreeMeshStandardMaterialModule {}
