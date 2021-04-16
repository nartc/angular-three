import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeshNormalMaterialDirective } from './mesh-normal-material.directive';



@NgModule({
  declarations: [
    MeshNormalMaterialDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MeshNormalMaterialDirective
  ]
})
export class MeshNormalMaterialModule { }
