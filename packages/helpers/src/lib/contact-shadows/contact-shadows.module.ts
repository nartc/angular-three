import { ThreeCoreModule } from '@angular-three/core';
import { ThreeOrthographicCameraModule } from '@angular-three/core/cameras';
import { ThreeGroupModule } from '@angular-three/core/group';
import { ThreeMeshBasicMaterialModule } from '@angular-three/core/materials';
import { ThreeMeshModule } from '@angular-three/core/meshes';
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ContactShadowsComponent } from './contact-shadows.component';

@NgModule({
  declarations: [ContactShadowsComponent],
  imports: [
    CommonModule,
    ThreeCoreModule,
    ThreeGroupModule,
    ThreeMeshModule,
    ThreeMeshBasicMaterialModule,
    ThreeOrthographicCameraModule,
  ],
  exports: [ContactShadowsComponent],
})
export class ContactShadowsModule {}
