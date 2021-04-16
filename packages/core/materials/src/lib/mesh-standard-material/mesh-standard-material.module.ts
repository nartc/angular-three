import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeshStandardMaterialDirective } from './mesh-standard-material.directive';



@NgModule({
  declarations: [
    MeshStandardMaterialDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MeshStandardMaterialDirective
  ]
})
export class MeshStandardMaterialModule { }
