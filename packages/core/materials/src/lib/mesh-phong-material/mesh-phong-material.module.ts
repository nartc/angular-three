import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeshPhongMaterialDirective } from './mesh-phong-material.directive';



@NgModule({
  declarations: [
    MeshPhongMaterialDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MeshPhongMaterialDirective
  ]
})
export class MeshPhongMaterialModule { }
