import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MeshDirective } from './mesh.directive';



@NgModule({
  declarations: [
    MeshDirective
  ],
  imports: [
    CommonModule
  ],
  exports: [
    MeshDirective
  ]
})
export class MeshModule { }
